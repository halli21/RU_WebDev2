import styles from "./recipe-list.module.css";
import { useRecipes } from "../../hooks/use-recipes";
import { RecipeListItem } from "../recipe-list-item/recipe-list-item";
import { RecipeType } from "../../types/recipe-type";

interface RecipeListProps {
    userSearch: string;
    currentType: RecipeType | null;
}
  
export const RecipeList = ({ userSearch, currentType }: RecipeListProps) => {
    const { recipes, isLoading, error } = useRecipes();

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearchTerm = recipe.title.toLowerCase().includes(userSearch);
        const matchesType = currentType === null || recipe.recipeType === currentType._id;
        return matchesSearchTerm && matchesType;
    });


    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <p>You have <span>{filteredRecipes.length}</span> recipes to explore.</p>
            {isLoading ? (
                <div className={styles.loading}><div uk-spinner="ratio: 2"></div></div>
            ) : (
                <div className={styles.recipeList}>
                    {filteredRecipes.map((item) => (
                        <RecipeListItem key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};