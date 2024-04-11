import { List, Card, Text, Image, Box, useToast } from "@chakra-ui/react";
import { MatchStatus } from "../../types/match-status";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { setMatches } from "../../redux/features/match/match-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMatchById } from "../../services/match-service";
import { Match } from "../../types/match";

export function MatchList() {
  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const toast = useToast();
  const navigate = useNavigate();

  async function navigateToMatch(matchId: string) {
    const response = await getMatchById(matchId);
    const thisMatch: Match = response;

    let inOtherMatch = false;
    let otherMatchStatus = "";
    let inThisMatch = false;

    match.matches.map((m) => {
      m.players.map((p) => {
        if (
          user.id === p.id &&
          m._id !== thisMatch._id &&
          m.status !== MatchStatus.Finished
        ) {
          inOtherMatch = true;
          otherMatchStatus = m.status;
        } else if (
          user.id === p.id &&
          m._id === thisMatch._id &&
          m.status !== MatchStatus.Finished
        ) {
          inThisMatch = true;
        }
      });
    });

    if (inOtherMatch && otherMatchStatus === MatchStatus.NotStarted) {
      toast({
        title: "Error joining match.",
        description:
          "You must leave your current match before entering another one.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (inOtherMatch && otherMatchStatus === MatchStatus.Started) {
      toast({
        title: "Error joining match.",
        description:
          "You are already in active match. Rejoin match to play or wait for match to finish.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (
      thisMatch.players.length === 4 &&
      !inThisMatch &&
      thisMatch.status === MatchStatus.Started
    ) {
      toast({
        title: "Error joining match.",
        description: "Game is full.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (thisMatch.status === MatchStatus.Started && !inThisMatch) {
      toast({
        title: "Error joining match.",
        description: "Game already started.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (thisMatch.status === MatchStatus.Finished) {
      navigate(`/game-summary/${matchId}`);
      return;
    }

    if (!inThisMatch) {
      socket.emit("joinmatch", matchId, user);

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              return { ...m, players: [...m.players, user] };
            }
            return m;
          })
        )
      );
    } else if (inThisMatch && thisMatch.status === MatchStatus.Started) {
      navigate(`/game/${matchId}`);
      return;
    }

    navigate(`/waiting-room/${matchId}`);
  }

  const displayStatus = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.NotStarted:
        return "Not Started";
      case MatchStatus.Started:
        return "Started";
      case MatchStatus.Finished:
        return "Finished";
      default:
        return "Wat";
    }
  };

  return (
    <Box>
      {match.matches.length > 0 && (
        <Box
          style={{
            display: "flex",
            gap: 20,
            overflowX: "scroll",
            paddingBottom: 20,
          }}
        >
          {match.matches.map((m) => (
            <Box
              key={m._id}
              onClick={() => navigateToMatch(m._id)}
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: 0,
                width: "100%",
                maxWidth: "270px",
                height: 300,
                padding: 20,
                flex: "none",
                cursor: "pointer",
              }}
            >
              <Text fontSize="14px" fontWeight="700" marginBottom="10px">
                {m.title}
              </Text>

              <Image
                src={m.titleImage}
                style={{
                  height: 180,
                  width: "100%",
                  objectFit: "cover",
                }}
              />

              <Text fontSize="12px" fontWeight="700" marginTop="12px">
                {m.players.length}/4 players
              </Text>
              <Text fontSize="12px" fontWeight="700" marginTop="2px">
                {displayStatus(m.status)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
