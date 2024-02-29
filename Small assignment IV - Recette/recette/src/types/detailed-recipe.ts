import { Recipe } from "./recipe";

export interface Ingredient {
    ingredient: string;
}

export interface Instruction {
    step: number;
    description: string;
}

export interface DetailedRecipe extends Recipe {
    author: string;
    description: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
}