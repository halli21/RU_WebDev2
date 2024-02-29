import styles from './header.module.css';
import { SearchBar } from '../search-bar/search-bar';


interface HeaderProps {
    onSearchChange: (searchTerm: string) => void;
}

export const Header = ({ onSearchChange }: HeaderProps) => {
    return (
        <header className={styles.header}>
            <SearchBar onSearchChange={onSearchChange} />
            <h1>Explore Recipes</h1>
        </header>
    );
};
