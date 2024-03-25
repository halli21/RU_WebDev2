import { 
    List,
    Card,
    CardBody,
    Text,
    Image,
    Box
} from "@chakra-ui/react";
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
                    if (m._id == matchId) {
                    return {...m, players: [...m.players, user]};
                    }
                    return m; 
                })
            )
        )
     

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
    }

    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360
            }}
        >
            {match.matches.map((m) => (
                <Card
                    key={m._id}
                    onClick={() => navigateToMatch(m._id)}
                    marginTop={5}
                    marginBottom={5}
                >
                    <CardBody>
                        <Text>{m.title}</Text>
                        <Box 
                            boxSize='100%'
                            objectFit='cover'
                        >
                            <Image src={m.titleImage} />
                        </Box>
                        <Text>{m.players.length}/4 players</Text>
                        <Text>{displayStatus(m.status)}</Text>
                    </CardBody>
                </Card>
            ))}

        </List>
    )
} 