import { Recipe } from "../types/recipe";
import { DetailedRecipe } from "../types/detailed-recipe";
import { RecipeType } from "../types/recipe-type";

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
        throw Error('Something happened')
    }
};

export const getRecipeById = async (id: string) => {
    try {
        return await request<DetailedRecipe>(BASE_URL + `/recipes/${id}`);
    } catch (e) {
        throw Error('Something happened')
    }
};

export const getRecipeTypes = async () => {
    try {
        const recipeTypes = await request<RecipeType[]>(BASE_URL + `/recipes/recipeTypes`);
        return recipeTypes;
    } catch (e) {
        console.error(e);
        return [];
    }
};


