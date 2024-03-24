import { useEffect, useState } from "react";
import { getAllMatches } from "../services/match-service";
import { Match } from "../types/match";


export const useMatches = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    useEffect(() => {
        async function getMatches() {
            const matches = await getAllMatches();
            setMatches(matches);
        }

        getMatches();
    }, []);

    return matches;
};