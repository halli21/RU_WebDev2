import { Recipe } from "../types/recipe";

const BASE_URL = 'http://localhost:3500';




async function request<TResponse>(
    url: string,
    config: RequestInit = {}
    ) {
    const response = await fetch(url, config);
    const json = await response.json();
    console.log(json)
    return json as TResponse;
}

export const getAllRecipes = async () => {
    try {
        return await request<Recipe[]>(BASE_URL + `/recipes`);
    } catch (e) {
        console.error(e);
        return [];
    }
};
  

export const getRecipes = async () => {
    try {
        const response = await fetch(
            BASE_URL + `/recipes`
        );
        const json = await response.json();
        return json;
    } catch (e) {
        console.log(e);
        return [];
    }
}


export const getRecipeTypes= async () => {
    try {
        const response = await fetch(
            BASE_URL + `/recipes/recipeTypes`
        );
        const json = await response.json();
        return json;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const getRecipeById = async () => {
    try {
        const response = await fetch(
            BASE_URL + `/recipes/65ddcccb2c5d6f094d02a700`
        );
        const json = await response.json();
        return json;
    } catch (e) {
        console.log(e);
        return [];
    }
}