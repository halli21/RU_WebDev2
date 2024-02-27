import styles from './header.module.css';
import { SearchBar } from '../searchBar/searchBar';

import React, { useEffect, useState } from 'react';
import { getRecipes, getRecipeTypes, getRecipeById } from '../../services/recipe-service';


export const Header = () => {
  

    useEffect(() => {
        const fetchRecipes = async () => {
            const data = await getRecipes();
            const types = await getRecipeTypes();
            const byId = await getRecipeById();
            console.log(data)
            console.log(types)
            console.log(byId)
            
            
        };

        fetchRecipes();
    }, []);

    return (
        <header className={styles.header}>
            <SearchBar />
            <h1>Explore Recipes</h1>
           
        </header>
    );
};

// export const Header = () => {
//     return (
//         <header className={styles.header}>
//             <SearchBar />
//             <h1>Explore Recipes</h1>
//         </header>
//     );
// };
