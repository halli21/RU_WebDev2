import styles from "./recipe-list.module.css";
import { useState } from "react";
import { useRecipes } from "../../hooks/use-recipes";
import { CategoryFilter } from "../category-filter/category-filter";
import { RecipeListItem } from "../recipe-list-item/recipe-list-item";
import { RecipeType } from "../../types/recipe-type";


export const RecipeList = () => {
    const [currentType, setCurrentType] = useState<RecipeType | null>(null);
    const recipes = useRecipes();
    
    const handleTypeClick = (type: RecipeType | null) => {
        console.log(type)
        setCurrentType(type);
    };

    const filteredRecipes = currentType === null ? recipes : recipes.filter((item) => item.recipeType === currentType._id);
    return (
        <div>
            <CategoryFilter currentType={currentType} onTypeClick={handleTypeClick} />
            <p>You have {filteredRecipes.length} recipes to explore.</p>
            <div className={styles.recipeList}>
                {filteredRecipes.map((item) => (
                    <RecipeListItem key={item._id} item={item} />
                ))}
            </div>
        </div>
    );
};