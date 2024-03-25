import { 
    Heading, 
    Box, 
    Text, 
    Button,
    Card,
    CardBody,
    Avatar
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setMatches } from "../../redux/features/match/match-slice";
import { MatchStatus } from "../../types/match-status";
import { Answer } from "../../types/answer";
import { User } from "../../types/user";



interface LiveAnswer {
    answer: number;
    user: User;
};

export function MatchDetailsView() {  
    const [timer, setTimer] = useState<number>(0);
    const [answered, setAnswered] = useState<string[]>([]);
    const [answers, setAnswers] = useState<LiveAnswer[]>([]);

    const user = useSelector((state: IRootState) => state.user);
    const match = useSelector((state: IRootState) => state.match);
    const { matchId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const currentMatch = useSelector((state: IRootState) => 
        state.match.matches.find((m) => m._id === matchId)
    );



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
            console.log(answers);
            setAnswers(answers);
        });



        return () => {
            socket.off("joinmatch");
            socket.off("leavematch");
            socket.off("startmatch");
            socket.off("updatetimer");
            socket.off("answer");
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
        <Box>
            <Heading>{currentMatch?.title}</Heading>
            <Text>{currentMatch?.status}</Text>
            <Box>
                {currentMatch?.players.map((p) => (
                    <Text key={p.id}>{p.displayName}</Text>
                ))}
            </Box>
            <Button onClick={leaveMatch}>Leave</Button>
            <Button onClick={startMatch}>Start</Button>

            {currentMatch?.status === MatchStatus.Started && <Text>Started</Text>}

            {/* {currentMatch?.status === MatchStatus.Started && 
                <Box>
                    <Heading>Question {currentMatch.currentQuestion}</Heading>
                    <Text>{currentMatch.questions[currentMatch.currentQuestion - 1].title}</Text>
                    {currentMatch.questions[currentMatch.currentQuestion - 1].options.map((o) =>(
                        <Text>{o.value}</Text>
                    ))}

                    <Text>{timer}</Text>

                </Box>
            } */}

            <Box mt={20}>
                <Heading>Question {currentMatch?.currentQuestion}</Heading>
                <Text>{currentMatch?.questions[currentMatch.currentQuestion - 1].title}</Text>
                <Box>
                    {answered.map((avatar, index) => (
                        <Avatar
                            size='lg'
                            src={avatar}
                        />
                    ))}
                </Box>

                

                {currentMatch?.questions[currentMatch.currentQuestion - 1].options.map((o, index) =>(
                    <Card onClick={() => answerQuestion(index)}>
                        <CardBody>
                            <Text>{o.value}</Text>
                            <Box>
                                {answers.filter(a => a.answer === index).map((a) => (
                                    <Avatar
                                        size='md'
                                        src={a.user.avatar}
                                    />
                                ))}
                            </Box>
                        </CardBody>
                    </Card>
                ))}

                <Text>{timer}</Text>
            </Box>

            
        </Box>
    )
}