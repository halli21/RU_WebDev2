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
            <p onClick={() => onTypeClick(null)} className={currentType === null ? styles.active : ''}>ALL</p>
            {recipeTypes.map((type) => (
                <p key={type._id} onClick={() => onTypeClick(type)} className={currentType === type ? styles.active : ''}>
                    {type.name}
                </p>
            ))}

        </div>
    );
};
