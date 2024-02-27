import styles from './searchBar.module.css';




export const SearchBar = () => {
    return (
        
        <div className={styles.searchBar}>
     
            <span data-uk-icon="icon: search; ratio: 2"></span>
            Search for recipes
        </div>
    );
};
