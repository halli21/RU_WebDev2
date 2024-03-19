import { User } from "../types/user";
import { UserLogin } from "../types/userLogin";

const BASE_URL = 'http://localhost:4567';

async function request<TResponse>(
    url: string,
    config: RequestInit = {}
): Promise<TResponse> {
    const response = await fetch(url, config);

    console.log(response)


    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }


    const json = await response.json();
    console.log(json);
    return json;
}
export const loginUser = async (userInfo : UserLogin): Promise<User | null> => {
    try {
        const url = BASE_URL + `/login/password`;
        const data: User = await request<User>(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });
        console.log('data', data)

        return data;

    } catch (e) {
        console.error('Login request failed', e);
        return null;
    }
};