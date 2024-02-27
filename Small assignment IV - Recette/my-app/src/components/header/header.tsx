import styles from './header.module.css';
import { SearchBar } from '../searchBar/searchBar';

export const Header = () => {
    return (
        <header className={styles.header}>
            <SearchBar />
            <h1>Explore Recipes</h1>
        </header>
    );
};
