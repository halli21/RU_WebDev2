import styles from './searchBar.module.css';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

export const SearchBar = () => {
    return (
        
        <div className={styles.searchBar}>
            <button className="uk-button uk-button-default">Button</button>
            <span data-uk-icon="icon: search; ratio: 2"></span>
            Search for recipes
        </div>
    );
};
