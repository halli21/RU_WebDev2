import { Bubble } from "../types/bubble";
import { Bundle } from "../types/bundle";
import { Cart } from "../types/cart";

const BASE_URL = 'http://localhost:3500/api';


async function request<TResponse>(
    url: string,
    config: RequestInit = {}
    ) {
    const response = await fetch(url, config);
    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
        const json = await response.json();
        console.log(json)
        return json as TResponse;
    } else {
        const text = await response.text();
        return text as TResponse;
    }
}

export const getAllBubbles = async () => {
    try {
        return await request<Bubble[]>(BASE_URL + `/bubbles`);
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getBubbleById = async (id: number) => {
    try {
        return await request<Bubble>(BASE_URL + `/bubbles/${id}`);
    } catch (e) {
        console.error(e);
        return undefined;
    }
};

export const getAllBundles = async () => {
    try {
        return await request<Bundle[]>(BASE_URL + `/bundles`);
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const submitOrder = async (telephone: string, order: Cart) => {
    try {
        const url = `${BASE_URL}/orders/${telephone}`;
        const response = await request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        return response;
    } catch (e) {
        console.error(e);
        return null;
    }
};


export const getOrdersByNumber = async (telephone: string) => {
    try {
        return await request<Cart[]>(BASE_URL + `/orders/${telephone}`);

    } catch (e) {
        console.error(e);
        return [];
    }
};