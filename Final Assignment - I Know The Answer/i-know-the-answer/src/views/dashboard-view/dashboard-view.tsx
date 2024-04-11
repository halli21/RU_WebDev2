import { Heading, Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MatchList } from "../../components/match-list/match-list";
import { themeVars } from "../../themes/theme.css";

export function DashboardView() {
  const navigate = useNavigate();
  return (
    <Box style={{ padding: 50 }}>
      <Heading style={{ fontSize: 30, paddingBottom: 50 }}>Dashboard</Heading>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 15,
        }}
      >
        <Heading style={{ fontSize: 20, alignSelf: "center" }}>
          Matchrooms
        </Heading>

        <Button
          onClick={() => navigate("/matches/create")}
          style={{
            backgroundColor: themeVars.colors.lightBlue,
            width: 140,
            color: "black",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          Create
        </Button>
      </Box>
      <MatchList />
    </Box>
  );
}
