import { useEffect, useState } from "react";
import { getAllRecipes, getRecipeTypes } from "../services/recipe-service";
import { Recipe } from "../types/recipe";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function getRecipes() {
            try {
                const recipes = await getAllRecipes();
                setRecipes(recipes);
                setError(null);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Error: An unexpected error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        }

        getRecipes();
    }, []);

    return { recipes, isLoading, error };
};