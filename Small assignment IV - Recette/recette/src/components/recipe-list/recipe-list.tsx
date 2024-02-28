import styles from "./recipe-list.module.css";
import { useRecipes } from "../../hooks/use-recipes";
import { RecipeListItem } from "../recipe-list-item/recipe-list-item";


export const RecipeList = () => {
    const recipes = useRecipes();
    return (
        <div className={styles.recipeList}>
            {recipes.map((item) => (
                <RecipeListItem key={item._id} item={item} />
            ))}
        </div>
    );
};