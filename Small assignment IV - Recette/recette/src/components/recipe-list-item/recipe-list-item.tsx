import styles from "./recipe-list-item.module.css";
import { Recipe } from "../../types/recipe";


interface RecipeListItemProps {
    item: Recipe | undefined;
}

export const RecipeListItem = ({ item }: RecipeListItemProps) => {
    const base64Image = item?.image ? `data:image/jpeg;base64,${item.image}` : undefined;
    const backgroundImage = item?.image ? `url(data:image/jpeg;base64,${item.image})` : undefined;

    return (
        <div className={styles.recipeItem}>
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


// <img src={base64Image} className={styles.recipeImage}/>