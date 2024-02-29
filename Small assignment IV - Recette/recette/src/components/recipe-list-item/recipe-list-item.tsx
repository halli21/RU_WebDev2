import styles from "./recipe-list-item.module.css";
import { Recipe } from "../../types/recipe";
import { useNavigate } from "react-router-dom";


interface RecipeListItemProps {
    item: Recipe | undefined;
}

export const RecipeListItem = ({ item }: RecipeListItemProps) => {
    const navigate = useNavigate();
    const backgroundImage = item?.image ? `url(data:image/jpeg;base64,${item.image})` : undefined;

    return (
        <div 
            className={styles.recipeItem}
            onClick={() => navigate(`/${item?._id}`)}
        >
            <div
                className={styles.recipeImage}
                style={{
                    backgroundImage: backgroundImage,
                }}
            >

            </div>
            <p>{item?.title}</p>
        </div>
    );  
};