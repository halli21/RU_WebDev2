import { 
    List,
    Card,
    CardBody,
    Text,
    Image,
    Box
} from "@chakra-ui/react";

import { useMatches } from "../../hooks/use-matches";
import { MatchStatus } from "../../types/match-status";


export function MatchList() {
    const matches = useMatches();


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
            {matches.map((m) => (
                <Card>
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