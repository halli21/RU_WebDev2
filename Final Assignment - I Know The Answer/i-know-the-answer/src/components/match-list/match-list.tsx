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
    <List
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
      }}
    >
      {match.matches.map((m) => (
        <Card
          key={m._id}
          onClick={() => navigateToMatch(m._id)}
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: 0,
            width: "100%",
            height: 275,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {m.title}
          </Text>

          <Box
            style={{
              backgroundColor: "red",
              minHeight: 160,
              display: "flex",
            }}
          >
            <Image
              src={m.titleImage}
              style={{
                height: "100%",
                width: "100%",
                alignSelf: "center",
                placeSelf: "center",
                objectFit: "cover",
              }}
            />
          </Box>

          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginTop: 12,
            }}
          >
            {m.players.length}/4 players
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginTop: 2,
            }}
          >
            {displayStatus(m.status)}
          </Text>
        </Card>
      ))}
    </List>
  );
}
