import styles from './searchBar.module.css';

// TODO still needs icon
// <span data-uk-icon="icon: search; ratio: 2"></span>

export const SearchBar = () => {
    return (
        <div className={styles.searchBar}>
            Search for recipes
        </div>
    );
};
