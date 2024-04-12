import { Heading, Box, Text, Button, Avatar } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setMatches } from "../../redux/features/match/match-slice";
import { getMatchById } from "../../services/match-service";
import { themeVars } from "../../themes/theme.css";
import { Podium } from "../../components/podium/podium";
import { User } from "../../types";
import { Answer } from "../../types/answer";
import { Match } from "../../types/match";
import { MatchStatus } from "../../types/match-status";

interface Score {
  points: number;
  user: User;
}

export function MatchSummaryView() {
  const [finalScores, setFinalScores] = useState<Score[]>([]);
  const match = useSelector((state: IRootState) => state.match);

  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    if (!matchId) {
      return;
    }
    async function getMatch() {
      const fetchedMatch = (await getMatchById(matchId!)) as Match;

      if (fetchedMatch.status !== MatchStatus.Finished) {
        navigate("/dashboard");
        return;
      }

      // create empty map
      const initialScores = new Map<string, Score>(
        fetchedMatch.players.map((player: User) => [
          player.id,
          { user: player, points: 0 },
        ])
      );

      // calc scores
      const newScores = new Map(initialScores);
      fetchedMatch.answers.forEach((a: Answer) => {
        const questionNumber = a.question;
        const question = fetchedMatch.questions[questionNumber - 1];

        if (question.options[a.answer].correct === true) {
          const timeElapsed = 10 - a.secondsLeft;
          const points = (10 - timeElapsed) * 10;
          const currentScore = newScores.get(a.user.id)?.points || 0;
          newScores.set(a.user.id, {
            user: a.user,
            points: currentScore + points,
          });
        }
      });

      // turn to list
      const scoresArray = Array.from(newScores, ([, score]) => score);
      scoresArray.sort((a, b) => b.points - a.points);
      setFinalScores(scoresArray);

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

  return (
    <Box
      style={{
        padding: 50,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <Heading
          style={{ fontSize: 25, paddingBottom: 40, alignSelf: "center" }}
        >
          Game summary
        </Heading>
        <Button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: themeVars.colors.lightBlue,
            width: 200,
            color: "black",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box
        style={{
          display: "grid",
          justifyContent: "center",
        }}
      >
        <Podium
          firstPlaceAvatar={finalScores[0]?.user.avatar}
          secondPlaceAvatar={finalScores[1]?.user.avatar}
          thirdPlaceAvatar={
            finalScores.length > 2 ? finalScores[2]?.user.avatar : ""
          }
        />
      </Box>

      <Heading style={{ fontSize: 20, paddingBottom: 20, paddingTop: 60 }}>
        Scoreboard
      </Heading>

      {finalScores?.map((score, index) => (
        <Box
          key={score.user.id}
          style={{
            backgroundColor: "#f2f2f2",
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                paddingRight: 20,
                paddingLeft: 20,
              }}
            >
              #{index + 1}
            </Text>
            <Box style={{ paddingRight: 20 }}>
              <Avatar key={index} size="md" src={score.user.avatar} />
            </Box>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>
              {score.user.displayName}
            </Text>
          </Box>
          <Text style={{ fontSize: 12, fontWeight: 700, paddingRight: 20 }}>
            {score.points} pts
          </Text>
        </Box>
      ))}
    </Box>
  );
}
