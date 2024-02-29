import styles from "./recipe-gallery.module.css";

import { useState } from 'react';

import { Header } from "../../components/header/header";
import { CategoryFilter } from '../../components/category-filter/category-filter';
import { RecipeList } from "../../components/recipe-list/recipe-list";
import { RecipeType } from '../../types/recipe-type';

export const RecipeGallery = () => {
  const [searched, setSearched] = useState('');
  const [currentType, setCurrentType] = useState<RecipeType | null>(null);

  const handleSearchChange = (newSearchTerm: string) => {
    setSearched(newSearchTerm.toLowerCase());
  };

  const handleTypeClick = (type : RecipeType | null) => {
    setCurrentType(type);
  };
  return (
    <>
      <Header onSearchChange={handleSearchChange} />
      <div className={styles.container}>
        <CategoryFilter currentType={currentType} onTypeClick={handleTypeClick} />
        <RecipeList userSearch={searched} currentType={currentType} />
      </div>
    </>
  );
};