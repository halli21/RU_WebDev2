import styles from "./recipe-list-item.module.css";
import { Recipe } from "../../types/recipe";
import { useNavigate } from "react-router-dom";

import { TbMeat, TbPepper, TbFish, TbMoodKid } from "react-icons/tb"; // Imported icons
import { GiChickenLeg } from "react-icons/gi";


interface RecipeListItemProps {
    item: Recipe | undefined;
}

export const RecipeListItem = ({ item }: RecipeListItemProps) => {
    const navigate = useNavigate();
    const backgroundImage = item?.image ? `url(data:image/jpeg;base64,${item.image})` : undefined;


    const getIcon = (tagKey : string) => {
        switch(tagKey) {
            case 'Meat':
                return <TbMeat className={styles.meat}/>;
            case 'Chicken':
                return <GiChickenLeg className={styles.chicken}/>;
            case 'Fish':
                return <TbFish className={styles.fish}/>;
            case 'Spicy':
                return <TbPepper className={styles.pepper}/>;
            case 'KidFriendly':
                return <TbMoodKid className={styles.kid}/>;
            default:
                return null;
        }
    };

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

            <div>
                {item?.tags.map(tag => tag.value ? getIcon(tag.key) : null)}
            </div>
        </div>
    );  
};