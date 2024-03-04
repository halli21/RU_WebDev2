import styles from "./recipe-details-site.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DetailedRecipe } from "../../types/detailed-recipe";
import { getRecipeById } from "../../services/recipe-service";

export const RecipeDetailSite = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<DetailedRecipe | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!recipeId) { return; }
        async function getRecipeData() {
            try {
                const recipe = await getRecipeById(recipeId!);
                setRecipe(recipe);  
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

        getRecipeData();
    }, [recipeId]);


    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }
  

    return (
        <div className={styles.grid}>
            {isLoading ? 
            (<div className={styles.loading}><div uk-spinner="ratio: 4"></div></div>)
            :
            (
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
                                    <span>{recipe?.tags.find(tag => tag.key === 'Calories')?.value ?? 'Not available'} cal</span>
                                </div>

                                <div className={styles.tag}>
                                    <p>Total Minutes</p>
                                    <span>{recipe?.tags.find(tag => tag.key === 'TotalMinutes')?.value ?? 'Not available'} min</span>
                                </div>
                            </div>


                            <h2>About recipe</h2>
                            <p>{recipe?.description}</p>

                            <h2>Ingredients</h2>
                            <ul className={styles.list}>
                                {recipe?.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient.ingredient}</li>
                                ))}
                            </ul>

                            <h2>Instructions</h2>
                            <ol className={styles.list}>
                                {recipe?.instructions.map(instruction => (
                                    <li key={instruction.step}> {instruction.description}</li>
                                ))}
                            </ol>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};