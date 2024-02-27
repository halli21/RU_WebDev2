import styles from './header.module.css';
import { SearchBar } from '../search-bar/search-bar';

export const Header = () => {
    return (
        <header className={styles.header}>
            <SearchBar />
            <h1>Explore Recipes</h1>
        </header>
    );
};
