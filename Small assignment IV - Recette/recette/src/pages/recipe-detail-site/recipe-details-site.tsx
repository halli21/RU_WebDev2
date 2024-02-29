import styles from "./recipe-details-site.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DetailedRecipe } from "../../types/detailed-recipe";
import { getRecipeById } from "../../services/recipe-service";

export const RecipeDetailSite = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<DetailedRecipe | undefined>();

    useEffect(() => {
        if (!recipeId) { return; }
        async function getInitialData() {
            const recipe = await getRecipeById(recipeId!);
            setRecipe(recipe);  
        }

        getInitialData();
    }, [recipeId]);

  

    return (
        <div>
            <div
                className={styles.recipeImage}
                style={{
                    backgroundImage: recipe?.image ? `url(data:image/jpeg;base64,${recipe.image})` : undefined,
                }}
            ></div>
            <div className={styles.outerDiv}>
                <div className={styles.container}>

                    <h1>{recipe?.title}</h1>
                    <p>By {recipe?.author}</p>

                    <div className={styles.tagContainer}>
                        <div className={styles.tag}>
                            <p>Calories</p>
                            <p>{recipe?.tags.find(tag => tag.key === 'Calories')?.value ?? 'Not available'} cal</p>
                        </div>

                        <div className={styles.tag}>
                            <p>Total Minutes</p>
                            <p>{recipe?.tags.find(tag => tag.key === 'TotalMinutes')?.value ?? 'Not available'} min</p>
                        </div>
                    </div>


                    <h2>About recipe</h2>
                    <p>{recipe?.description}</p>

                    <h2>Ingredients</h2>
                    <ul>
                        {recipe?.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.ingredient}</li>
                        ))}
                    </ul>

                    <h2>Instructions</h2>
                    <ol>
                        {recipe?.instructions.map(instruction => (
                            <li key={instruction.step}>Step {instruction.step}: {instruction.description}</li>
                        ))}
                    </ol>

                </div>
            </div>
        </div>
    );
};