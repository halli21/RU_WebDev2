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
import { setEnterMatch } from "../../redux/features/session/session-slice";
import { themeClass, themeVars } from "../../themes/theme.css";

export function MatchList() {
  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);

  const { inMatch, currentGameId } = useSelector((state: IRootState) => ({
    inMatch: state.session.inMatch,
    currentGameId: state.session.currentGameId,
  }));

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const toast = useToast();
  const navigate = useNavigate();

  async function navigateToMatch(matchId: string) {
    const response = await getMatchById(matchId);
    const thisMatch: Match = response;

    console.log("currentGameId", currentGameId);
    console.log("matchId", matchId);

    // if (inMatch && currentGameId !== matchId) {
    //   toast({
    //     title: "Error joining match.",
    //     description: "You are already in a match.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    if (thisMatch.players.length === 4) {
      toast({
        title: "Error joining match.",
        description: "Game is full.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (thisMatch.status !== MatchStatus.NotStarted) {
      toast({
        title: "Error joining match.",
        description: "Game already started.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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

    //dispatch(setEnterMatch(matchId));

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
  );
}
