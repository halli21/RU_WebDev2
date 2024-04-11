import {
  Heading,
  Box,
  Text,
  Button,
  Card,
  Avatar,
  List,
  useToast,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";

import { themeVars } from "../../themes/theme.css";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMatchById } from "../../services/match-service";
import { setMatches } from "../../redux/features/match/match-slice";
import { socket } from "../../services/socket-service";
import { MatchStatus } from "../../types/match-status";

export function MatchWaitingView() {
  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);
  const toast = useToast();
  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const currentMatch = useSelector((state: IRootState) =>
    state.match.matches.find((m) => m._id === matchId)
  );

  useEffect(() => {
    if (!matchId) {
      return;
    }
    async function getMatch() {
      const fetchedMatch = await getMatchById(matchId!);

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              return {
                ...fetchedMatch,
              };
            }
            return m;
          })
        )
      );
    }

    getMatch();
  }, []);

  useEffect(() => {
    socket.on("joinmatch", (newUser) => {
      if (user.id === newUser.id) {
        return;
      }

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              return {
                ...m,
                players: [...m.players, newUser],
              };
            }
            return m;
          })
        )
      );
    });

    socket.on("leavematch", (leaveingUser) => {
      if (user.id === leaveingUser.id) {
        return;
      }

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              const updatedPlayers = m.players.filter(
                (p) => p.id !== leaveingUser.id
              );
              return {
                ...m,
                players: updatedPlayers,
              };
            }
            return m;
          })
        )
      );
    });

    socket.on("startmatch", () => {
      toast({
        title: "Game has started!",
        status: "info",
        duration: 5000,
        isClosable: true,
      });

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              //   const initialScores = new Map<string, Score>(
              //     m.players.map((player) => [
              //       player.id,
              //       { user: player, points: 0 },
              //     ])
              //   );
              //   setScores(initialScores);

              return {
                ...m,
                status: MatchStatus.Started,
              };
            }
            return m;
          })
        )
      );

      navigate(`/game/${matchId}`);
    });

    return () => {
      socket.off("joinmatch");
      socket.off("leavematch");
      socket.off("startmatch");
    };
  }, [dispatch, match.matches]);

  function leaveMatch() {
    socket.emit("leavematch", matchId, user);
    dispatch(
      setMatches(
        match.matches.map((m) => {
          if (m._id === matchId) {
            const updatedPlayers = m.players.filter(
              (player) => player.id !== user.id
            );
            return { ...m, players: updatedPlayers };
          }
          return m;
        })
      )
    );
    //dispatch(setLeaveMatch());
    navigate("/dashboard");
  }

  function startMatch() {
    if (
      currentMatch &&
      currentMatch.players &&
      currentMatch.players.length > 1
    ) {
      socket.emit("startmatch", matchId);
    } else {
      toast({
        title: "Not enough players.",
        description: "Need at least two players to start game.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box style={{ padding: 50 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <Heading style={{ fontSize: 30 }}>Waiting for players to join</Heading>
        <Box>
          {currentMatch?.owner.id === user.id && (
            <Button
              onClick={startMatch}
              style={{
                borderRadius: 3,
                backgroundColor: themeVars.colors.lightBlue,
                width: "125px",
                fontWeight: 700,
                marginRight: 10,
              }}
            >
              Start
            </Button>
          )}
          <Button
            onClick={leaveMatch}
            style={{
              borderRadius: 3,
              backgroundColor: themeVars.colors.lightBlue,
              width: "125px",
              fontWeight: 700,
            }}
          >
            Leave
          </Button>
        </Box>
      </Box>

      <Box
        style={{
          display: "grid",
          placeItems: "center",
          paddingTop: 40,
        }}
      >
        <List
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 70,
            rowGap: 25,
          }}
        >
          {currentMatch?.players.map((p) => (
            <Card
              key={p.id}
              style={{
                backgroundColor: "#f2f2f2",
                width: 300,
                height: 275,
                display: "grid",
                justifyItems: "center",
                padding: 40,
              }}
            >
              <Avatar size="xl" src={p.avatar} />
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 24,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {p.displayName} is in the house!
              </Text>
            </Card>
          ))}
        </List>
      </Box>
    </Box>
  );
}
