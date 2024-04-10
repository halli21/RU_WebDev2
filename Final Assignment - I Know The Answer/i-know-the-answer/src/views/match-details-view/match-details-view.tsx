import {
  Heading,
  Box,
  Text,
  Button,
  Card,
  CardBody,
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
import { MatchStatus } from "../../types/match-status";
import { User } from "../../types/user";
import { getMatchById } from "../../services/match-service";
import { Answer } from "../../types/answer";
import { themeVars } from "../../themes/theme.css";
import { Podium } from "../../components/podium/podium";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface LiveAnswer {
  answer: number;
  user: Partial<User>;
}

interface Score {
  points: number;
  user: User;
}

export function MatchDetailsView() {
  const stylingStart = true;

  const answerColors = ["#f1f1f1", "#a097ff", "#84ff82", "#fa8585"];

  const [timer, setTimer] = useState<number>(0);
  const [answered, setAnswered] = useState<string[]>([]);
  const [answers, setAnswers] = useState<LiveAnswer[]>([]);
  const [scores, setScores] = useState<Map<string, Score>>(new Map());
  const [finalScores, setFinalScores] = useState<Score[]>([]);

  const user = useSelector((state: IRootState) => state.user);
  const match = useSelector((state: IRootState) => state.match);

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
      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              const initialScores = new Map<string, Score>(
                m.players.map((player) => [
                  player.id,
                  { user: player, points: 0 },
                ])
              );
              setScores(initialScores);

              return {
                ...m,
                status: MatchStatus.Started,
              };
            }
            return m;
          })
        )
      );
    });

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

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              const updatedAnswers = [...m.answers, ...answers];
              return {
                ...m,
                answers: updatedAnswers,
              };
            }
            return m;
          })
        )
      );
    });

    socket.on("nextquestion", (nextQuestion) => {
      setAnswered([]);
      setAnswers([]);
      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              return {
                ...m,
                currentQuestion: nextQuestion,
              };
            }
            return m;
          })
        )
      );
    });

    socket.on("finishedgame", (finshedMatch) => {
      finshedMatch.answers.map((a: Answer) => {
        const questionNumber = a.question;
        const question = finshedMatch.questions[questionNumber - 1];

        if (question.options[a.answer].correct === true) {
          const timeElapsed = 10 - a.secondsLeft;
          const points = (10 - timeElapsed) * 10;
          console.log(points);
          const currentScore = scores.get(a.user.id)?.points || 0;
          scores.set(a.user.id, {
            user: a.user,
            points: currentScore + points,
          });
        }
      });

      const scoresArray = Array.from(scores.entries());
      scoresArray.sort((a, b) => b[1].points - a[1].points);
      const finalScoresArray = scoresArray.map((entry) => entry[1]);
      console.log(finalScoresArray);
      setFinalScores(finalScoresArray);

      dispatch(
        setMatches(
          match.matches.map((m) => {
            if (m._id === matchId) {
              return {
                ...finshedMatch,
              };
            }
            return m;
          })
        )
      );
    });

    return () => {
      socket.off("joinmatch");
      socket.off("leavematch");
      socket.off("startmatch");
      socket.off("updatetimer");
      socket.off("answer");
      socket.off("answers");
      //socket.off("nextquestion")
      //socket.off("finishedgame")
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
    navigate("/dashboard");
  }

  function startMatch() {
    // TODO needs to meet criteria to start

    socket.emit("startmatch", matchId);
  }

  function answerQuestion(answerIndex: number) {
    socket.emit("answer", currentMatch, user, answerIndex, timer);

    //setAnswers([...answers, { answer: answerIndex, user: user }])

    setAnswered(user.avatar ? [...answered, user.avatar] : answered);
  }

  return (
    <Box style={{ padding: 50 }}>
      {currentMatch?.status === MatchStatus.NotStarted && (
        <Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: 10,
            }}
          >
            <Heading style={{ fontSize: 30 }}>
              Waiting for players to join
            </Heading>
            <Button
              onClick={startMatch}
              style={{
                borderRadius: 3,
                backgroundColor: themeVars.colors.lightBlue,
                width: "125px",
                fontWeight: 700,
              }}
            >
              Start
            </Button>
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
      )}

      {/* <Box>
                {currentMatch?.players.map((p) => (
                    <Text key={p.id}>{p.displayName}</Text>
                ))}
            </Box> */}
      {/* <Button onClick={leaveMatch}>Leave</Button> */}

      {/* currentMatch?.status === MatchStatus.Started */}

      {currentMatch?.status === MatchStatus.Started && (
        <Box
          style={{
            display: "grid",
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
            {currentMatch?.questions[
              currentMatch.currentQuestion - 1
            ].options.map((o, index) => (
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
                        color: "#1fff1d",
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
            ))}
          </List>
        </Box>
      )}

      {currentMatch?.status === MatchStatus.Finished && (
        <Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: 10,
            }}
          >
            <Heading style={{ fontSize: 25, paddingBottom: 40 }}>
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
      )}
    </Box>
  );
}
