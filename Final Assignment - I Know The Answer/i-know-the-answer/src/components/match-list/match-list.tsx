import { List, Card, Text, Image, Box } from "@chakra-ui/react";
import { MatchStatus } from "../../types/match-status";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { setMatches } from "../../redux/features/match/match-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

export function MatchList() {
  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const navigate = useNavigate();

  function navigateToMatch(matchId: string) {
    // TODO check first if successful
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

    navigate(`/matches/${matchId}`);
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
