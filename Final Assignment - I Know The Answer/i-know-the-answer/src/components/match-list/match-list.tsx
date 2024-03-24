import { 
    List,
    Card,
    CardBody,
    Text,
    Image,
    Box
} from "@chakra-ui/react";

import { useMatches } from "../../hooks/use-matches";


export function MatchList() {
    const matches = useMatches();


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
                    </CardBody>
                </Card>
            ))}

        </List>
    )
} 