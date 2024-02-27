import { useEffect, useState } from "react";
import { getAllRecipes } from "../services/recipe-service";
import { Recipe } from "../types/recipe";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        async function getRecipes() {
            setRecipes(await getAllRecipes());
        }

        getRecipes();
    }, []);

    return recipes;
};