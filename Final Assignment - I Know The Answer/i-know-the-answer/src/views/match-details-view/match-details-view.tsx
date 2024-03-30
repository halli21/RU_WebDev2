import { 
    Heading, 
    Box, 
    Text, 
    Button,
    Card,
    CardBody,
    Avatar,
    List
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



interface LiveAnswer {
    answer: number;
    user: User;
};


interface Score {
    points: number;
    user: User;
};

export function MatchDetailsView() {  
    const [timer, setTimer] = useState<number>(0);
    const [answered, setAnswered] = useState<string[]>([]);
    const [answers, setAnswers] = useState<LiveAnswer[]>([]);
    const [scores, setScores] = useState<Map<string, Score>>(new Map());

    const user = useSelector((state: IRootState) => state.user);
    const match = useSelector((state: IRootState) => state.match);

    const { matchId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();


    const currentMatch = useSelector((state: IRootState) => 
        state.match.matches.find((m) => m._id === matchId)
    );


    useEffect(() => {
        if (!matchId) { return; }
        async function getMatch() {
            const fetchedMatch = await getMatchById(matchId!);

            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            return {
                                ...fetchedMatch
                            };
                        };
                        return m; 
                    })
                )
            );
        }

        getMatch();
    }, [])




    useEffect(() => {    
        socket.on("joinmatch", (newUser) => {
            if (user.id === newUser.id) { return; }

            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            return {
                                ...m, 
                                players: [...m.players, newUser]
                            };
                        };
                        return m; 
                    })
                )
            );
        });

        socket.on("leavematch", (leaveingUser) => {
            if (user.id === leaveingUser.id) { return; }

            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            const updatedPlayers = m.players.filter((p) => p.id !== leaveingUser.id);
                            return { 
                                ...m, 
                                players: updatedPlayers 
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

                            const initialScores = new Map<string, Score>(m.players.map(player => [player.id, { user: player, points: 0 }]));
                            setScores(initialScores);

                            return {
                                ...m,
                                status: MatchStatus.Started
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
            if (user.id === answerer.id) { return; }
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
                                answers: updatedAnswers 
                            };
                        }
                        return m;
                    })
                )
            )
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
                                currentQuestion: nextQuestion
                            };
                        }
                        return m;
                    })
                )
            )
        });


        socket.on("finishedgame", (finshedMatch) => {
            console.log("recieved finishedgame");
            console.log(finshedMatch);

            finshedMatch.answers.map((a: Answer) => {
                const questionNumber = a.question;
                console.log(questionNumber);
                const question = finshedMatch.questions[questionNumber - 1];
                console.log(question);
                
                if (question.options[a.answer].correct === true) {
                    const timeElapsed = 10 - a.secondsLeft;
                    const points = (10 - timeElapsed) * 10;
                    console.log(points)
                    const currentScore = scores.get(a.user.id)?.points || 0;
                    scores.set(a.user.id, { user: a.user, points: currentScore + points });
        
                }
            })

            const scoresArray = Array.from(scores.entries());
            scoresArray.sort((a, b) => b[1].points - a[1].points);
            const sortedScores = new Map(scoresArray);
            setScores(sortedScores)

            console.log(scores);
                
    
            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            return {
                                ...finshedMatch
                            };
                        };
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
            socket.off("finishedgame")
        };

    }, [dispatch, match.matches]);



    function leaveMatch() {
        socket.emit("leavematch", matchId, user);
        dispatch(
            setMatches(
                match.matches.map((m) => {
                    if (m._id === matchId) {
                        const updatedPlayers = m.players.filter(player => player.id !== user.id);
                        return {...m, players: updatedPlayers};
                    }
                    return m;
                })
            )
        )
        navigate("/dashboard");
    }



    function startMatch() {
        // TODO needs to meet criteria to start

        socket.emit("startmatch", matchId);
    }


    function answerQuestion(answerIndex: number) {
    
        socket.emit("answer", currentMatch, user, answerIndex, timer);

        setAnswered(user.avatar ? [...answered, user.avatar] : answered);
    }

  

    return (
        <Box 
            style={{padding: 50}}
        >
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 10
                }}
            >
                <Heading
                    style={{fontSize: 30}}
                >
                    Waiting for players to join
                </Heading>
                <Button 
                    onClick={startMatch}
                    style={{
                        borderRadius: 3,
                        backgroundColor: themeVars.colors.lightBlue,
                        width: "125px",
                        fontWeight: 700
                    }}
                >
                    Start
                </Button>
            </Box>
                    
            <Box
                style={{
                    display: "grid",
                    placeItems: "center",
                    paddingTop: 40
                }}
            >
                <List 
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        columnGap: 70,
                        rowGap: 25
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
                                padding: 40
                            }}
                        >
                            <Avatar
                                size='xl'
                                src={p.avatar}
                            />
                            <Text
                                style={{
                                    fontWeight: 700,
                                    fontSize: 24,
                                    textAlign: "center",
                                    lineHeight: 1
                                }}
                            >
                                {p.displayName} is in the house!
                            </Text>

                        </Card>
                        
                    ))}
                </List>
            </Box>

            {/* <Box>
                {currentMatch?.players.map((p) => (
                    <Text key={p.id}>{p.displayName}</Text>
                ))}
            </Box> */}
            {/* <Button onClick={leaveMatch}>Leave</Button> */}

            {currentMatch?.status === MatchStatus.Started && <Text>Started</Text>}


            {currentMatch?.status === MatchStatus.Started && 
                <Box mt={20}>
                    <Heading>Question {currentMatch?.currentQuestion}</Heading>
                    <Text>{currentMatch?.questions[currentMatch.currentQuestion - 1].title}</Text>
                    <Box>
                        {answered.map((avatar, index) => (
                            <Avatar
                                key={index}
                                size='lg'
                                src={avatar}
                            />
                        ))}
                    </Box>

                    

                    {currentMatch?.questions[currentMatch.currentQuestion - 1].options.map((o, index) =>(
                        <Card key={index} onClick={() => answerQuestion(index)}>
                            <CardBody>
                                <Text key={index}>{o.value}</Text>
                                <Box>
                                    {answers.filter(a => a.answer === index).map((a) => (
                                        <Avatar
                                            size='md'
                                            src={a.user.avatar}
                                        />
                                    ))}
                                </Box>
                                {o.correct === true && timer === 0 && <Text>Correct Answer</Text>}
                            </CardBody>
                        </Card>
                    ))}

                    <Text>{timer}</Text>
                </Box>
            }


            {currentMatch?.status === MatchStatus.Finished && 
                <Box>
                    <Heading>Scoreboard</Heading>
                    {Array.from(scores.entries()).map(([userId, score], index) => (
                        <Box key={userId}>
                            <Avatar
                                key={index}
                                size='lg'
                                src={score.user.avatar}
                            />
                            {`#${index + 1} ${score.user.displayName} ${score.points} pts`}
                        </Box>
                    ))}
                </Box>
            }

            
        </Box>
    )
}