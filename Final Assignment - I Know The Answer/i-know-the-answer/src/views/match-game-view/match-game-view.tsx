import {
  Heading,
  Box,
  Text,
  Card,
  Avatar,
  List,
  CircularProgress,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setMatches } from "../../redux/features/match/match-slice";
import { User } from "../../types/user";
import { getMatchById } from "../../services/match-service";
import { themeVars } from "../../themes/theme.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Match } from "../../types/match";

interface LiveAnswer {
  answer: number;
  user: Partial<User>;
}

export function MatchGameView() {
  const answerColors = ["#f1f1f1", "#a097ff", "#84ff82", "#fa8585"];
  const [timer, setTimer] = useState<number>(10);
  const [givenAnswer, setGivenAnswer] = useState<boolean>(false);
  const [answered, setAnswered] = useState<string[]>([]);
  const [answers, setAnswers] = useState<LiveAnswer[]>([]);

  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);

  const { matchId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [currentMatch, setCurrentMatch] = useState<Match | undefined>(
    undefined
  );

  useEffect(() => {
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
    socket.on("updatetimer", (counter) => {
      setTimer(counter);
    });

    socket.on("answer", (answerer) => {
      if (user.id === answerer.id) {
        return;
      }
      setAnswered((prevAnswered) => [...prevAnswered, answerer.avatar]);
    });

    socket.on("answers", (answers) => {
      setAnswers(answers);

      if (currentMatch) {
        const updatedAnswers = [...currentMatch.answers, ...answers];
        const updatedMatch = {
          ...currentMatch,
          answers: updatedAnswers,
        };

        setCurrentMatch(updatedMatch);
      }
    });

    socket.on("nextquestion", (nextQuestion) => {
      setGivenAnswer(false);
      setAnswered([]);
      setAnswers([]);

      if (currentMatch) {
        const updatedMatch = {
          ...currentMatch,
          currentQuestion: nextQuestion,
        };

        setCurrentMatch(updatedMatch);
      }
    });

    socket.on("finishedgame", (finshedMatch) => {
      navigate(`/game-summary/${matchId}`);
    });

    return () => {
      socket.off("updatetimer");
      socket.off("answer");
      socket.off("answers");
    };
  }, [dispatch, currentMatch]);

  function answerQuestion(answerIndex: number) {
    if (!givenAnswer && timer > 0) {
      socket.emit("answer", currentMatch, user, answerIndex, timer);
      setAnswered(user.avatar ? [...answered, user.avatar] : answered);
      setGivenAnswer(true);
    }
  }

  return (
    <Box
      style={{
        display: "grid",
        padding: 50,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Heading style={{ fontSize: 25, paddingBottom: 20 }}>
          Question {currentMatch?.currentQuestion}
        </Heading>
        <Box
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <CircularProgress
            value={(10 - timer) * 10}
            size="72px"
            color={themeVars.colors.teal}
          />
          <span
            style={{
              position: "absolute",
            }}
          >
            {timer}
          </span>
        </Box>
      </Box>
      <Text>
        {currentMatch?.questions[currentMatch.currentQuestion - 1].title}
      </Text>
      <Box style={{ paddingTop: 20, paddingBottom: 100, height: 100 }}>
        {answered.map((avatar, index) => (
          <Avatar
            key={index}
            size="lg"
            src={avatar}
            style={{
              marginRight: 20,
            }}
          />
        ))}
      </Box>

      <List
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          placeSelf: "center",
          gap: 50,
        }}
      >
        {currentMatch?.questions[currentMatch.currentQuestion - 1].options.map(
          (o, index) => (
            <Card
              key={index}
              onClick={() => answerQuestion(index)}
              style={{
                width: 300,
                height: 175,
                backgroundColor: answerColors[index],
              }}
            >
              <Box
                style={{
                  display: "grid",
                  height: 75,
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                {o.correct === true && timer === 0 && (
                  <IoIosCheckmarkCircle
                    style={{
                      color: "green",
                      fontSize: "64px",
                      padding: "12px",
                    }}
                  />
                )}
              </Box>

              <Box
                style={{
                  display: "grid",
                  height: 100,
                }}
              >
                <Text
                  key={index}
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    alignSelf: "center",
                    justifySelf: "center",
                  }}
                >
                  {o.value}
                </Text>
              </Box>

              <Box
                style={{
                  display: "flex",
                  height: 75,
                  paddingLeft: 20,
                  paddingBottom: 10,
                }}
              >
                {answers
                  .filter((a) => a.answer === index)
                  .map((a) => (
                    <Avatar
                      size="md"
                      src={a.user.avatar}
                      style={{
                        marginRight: 10,
                      }}
                    />
                  ))}
              </Box>
            </Card>
          )
        )}
      </List>
    </Box>
  );
}
