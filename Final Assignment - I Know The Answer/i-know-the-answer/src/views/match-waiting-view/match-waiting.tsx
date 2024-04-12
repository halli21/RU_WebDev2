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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getMatchById } from "../../services/match-service";
import { setMatches } from "../../redux/features/match/match-slice";
import { socket } from "../../services/socket-service";
import { MatchStatus } from "../../types/match-status";
import { Match } from "../../types/match";

export function MatchWaitingView() {
  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);
  const toast = useToast();
  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [currentMatch, setCurrentMatch] = useState<Match | undefined>(
    undefined
  );

  // const isUserInPlayers = fetchedMatch.players.some(
  //   (player: { id: string | undefined }) => player.id === user.id
  // );

  useEffect(() => {
    console.log("waiting room mounting");

    if (!matchId) {
      return;
    }

    socket.emit("joinmatch", matchId, user);

    async function getMatch() {
      const fetchedMatch = await getMatchById(matchId!);
      setCurrentMatch(fetchedMatch);
    }

    getMatch();
  }, []);

  useEffect(() => {
    socket.on("joinmatch", (newUser) => {
      if (user.id === newUser.id) {
        return;
      }

      if (currentMatch && currentMatch.players) {
        if (currentMatch.players.some((user) => user.id === newUser.id)) {
          return;
        }

        const updatedPlayers = [...currentMatch.players, newUser];

        const updatedMatch = {
          ...currentMatch,
          players: updatedPlayers,
        };

        setCurrentMatch(updatedMatch);
      }
    });

    socket.on("leavematch", (leaveingUser) => {
      if (user.id === leaveingUser.id) {
        return;
      }

      if (currentMatch && currentMatch.players) {
        const updatedPlayers = currentMatch.players.filter(
          (user) => user.id !== leaveingUser.id
        );

        const updatedMatch: Match = {
          ...currentMatch,
          players: updatedPlayers,
        };
        setCurrentMatch(updatedMatch);
      }
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
  }, [dispatch, currentMatch]);

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
