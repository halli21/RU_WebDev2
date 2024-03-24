import { fetchWithCredentials } from "../utilities/fetch-utilites";


export async function getUser() {
    const response = await fetchWithCredentials("user/info");
    
    if (response.ok && response.headers.get("Content-Length") !== "0") {
        return await response.json();
    }
}

export async function authenticateUser(username: string, password: string) {
    const response = await fetchWithCredentials("login/password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (response.ok) {
        return await response.json();
    } 
}