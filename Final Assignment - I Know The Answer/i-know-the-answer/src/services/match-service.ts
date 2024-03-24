import { Match } from "../types/match";
import { fetchWithCredentials } from "../utilities/fetch-utilites";


export async function createNewMatch(match: Omit<Match, "id" | "answers" | "players" | "status">) {
    const response = await fetchWithCredentials("matches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(match)
    });

    if (response.ok) {
        return await response.text();
    }
}


export async function getAllMatches() {
    const response = await fetchWithCredentials("matches");

    if (response.ok) {
        return await response.json();
    }
}