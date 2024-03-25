import { 
    Heading, 
    Box, 
    Text, 
    Button
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { useEffect } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setMatches } from "../../redux/features/match/match-slice";

export function MatchDetailsView() {  
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
            if (user.id == newUser.id) { return; }

            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            return {...m, players: [...m.players, newUser]};
                        };
                        return m; 
                    })
                )
            );
        });

        socket.on("leavematch", (leaveingUser) => {
            if (user.id == leaveingUser.id) { return; }

            dispatch(
                setMatches(
                    match.matches.map((m) => {
                        if (m._id === matchId) {
                            const updatedPlayers = m.players.filter((p) => p.id !== leaveingUser.id);
                            return { ...m, players: updatedPlayers };
                        }
                        return m;
                    })
                )
            );
        });

        return () => {
            socket.off("joinmatch");
            socket.off("leavematch");
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
        </Box>
    )
}