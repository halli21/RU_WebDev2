import { Bubble } from "../types/bubble";

const BASE_URL = 'http://localhost:3500/api';


async function request<TResponse>(
    url: string,
    config: RequestInit = {}
    ) {
    const response = await fetch(url, config);
    const json = await response.json();
    console.log(json)
    return json as TResponse;
}

export const getAllBubbles = async () => {
    try {
        return await request<Bubble[]>(BASE_URL + `/bubbles`);
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getBubbleById = async (id: string) => {
    try {
        return await request<Bubble>(BASE_URL + `/bubbles/${id}`);
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const getAllBundles = async () => {
    try {
        return await request<any[]>(BASE_URL + `/bundles`);
    } catch (e) {
        console.error(e);
        return [];
    }
};