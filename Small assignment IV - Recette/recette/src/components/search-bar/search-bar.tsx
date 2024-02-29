import styles from './search-bar.module.css';

interface SearchBarProps {
    onSearchChange: (searchTerm: string) => void;
}

export const SearchBar = ({ onSearchChange }: SearchBarProps) => {
    return (
        <div className={styles.searchBar}>
            <span data-uk-icon="icon: search; ratio: 1.1"></span>
            <input type="text" placeholder="Search for recipes" onChange={(e) => onSearchChange(e.target.value)} />
        </div>
    );
};