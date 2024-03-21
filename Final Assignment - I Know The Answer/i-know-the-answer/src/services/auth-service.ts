import { User } from "../types/user";
import { UserLogin } from "../types/userLogin";

const BASE_URL = 'http://localhost:4567';


async function request<TResponse>(
    url: string,
    config: RequestInit = {}
): Promise<TResponse | null> {
    const response = await fetch(url, { ...config, credentials: 'include' });

    if (!response.ok) {
        console.error('Request failed with status', response.status);
    }

    try {
        return await response.json();
    } catch (e) {
        console.error('Failed to parse response as JSON', e);
        return null;
    }
}


export const authenticateUser = async (userInfo : UserLogin): Promise<User | null> => {
    const url = BASE_URL + `/login/password`;
    const data: User | null = await request<User>(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
    });
    return data;
};