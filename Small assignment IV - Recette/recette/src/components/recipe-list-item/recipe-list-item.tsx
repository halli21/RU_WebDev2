import styles from "./recipe-list-item.module.css";
import { Recipe } from "../../types/recipe";


interface RecipeListItemProps {
    item: Recipe | undefined;
}


export const RecipeListItem = ({ item }: RecipeListItemProps) => {
    return (
        <div>
            <p>{item?.id}</p>
            <p>{item?.title}</p>
        </div>
    );  
};