import { Heading, Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MatchList } from "../../components/match-list/match-list";

export function DashboardView() {
    const navigate = useNavigate();
    return (
        <Box>
            <Heading>Dashboard</Heading>
            <Box>
                <Heading>Matchrooms</Heading>
                <Button onClick={() => navigate("/matches/create")}>
                    Create
                </Button>
                <MatchList />
            </Box>
        </Box>
    )
}