import { Match } from "../types/match";
import { fetchWithCredentials } from "../utilities/fetch-utilites";


export async function createNewMatch(match: Omit<Match, "_id" | "answers" | "currentQuestion" | "players" | "status">) {
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

        const jso = await response.json();

        console.log(jso)


        return jso;
    }
}


export async function getMatchById(id: string) {
    const response = await fetchWithCredentials(`matches/${id}`);

    if (response.ok) {
        return await response.json();
    }
}