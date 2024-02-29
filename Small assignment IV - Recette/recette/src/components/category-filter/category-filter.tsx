import styles from './category-filter.module.css';
import { useRecipeTypes } from '../../hooks/use-recipe-types';
import { RecipeType } from '../../types/recipe-type';


interface CategoryFilterProps {
    currentType: RecipeType | null;
    onTypeClick: (type: RecipeType | null) => void;
}

export const CategoryFilter = ({ currentType, onTypeClick } : CategoryFilterProps) => {
    const recipeTypes = useRecipeTypes();
    return (
        <div className={styles.filterBar}>
            <div 
                onClick={() => onTypeClick(null)} 
                className={`${styles.typeName} ${currentType === null ? styles.active : ''}`}
            >
                ALL
            </div>
            {recipeTypes.map((type) => (
                <div 
                    key={type._id} 
                    onClick={() => onTypeClick(type)} 
                    className={`${styles.typeName} ${currentType === type ? styles.active : ''}`}
                >
                    {type.name}
                </div>
            ))}
        </div>
    );
};
