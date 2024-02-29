import { useEffect, useState } from "react";
import { getRecipeTypes } from "../services/recipe-service";
import { RecipeType } from "../types/recipe-type";

export const useRecipeTypes = () => {
    const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);

    useEffect(() => {
        async function getRecipes() {
            setRecipeTypes(await getRecipeTypes());
        }

        getRecipes();
    }, []);

    return recipeTypes;
};