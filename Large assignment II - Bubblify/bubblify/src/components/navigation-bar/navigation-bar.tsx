import styles from "./navigation-bar.module.css";
import { NavigationLink } from "../navigation-link/navigation-link";


export const NavigationBar = () => {

    return (
        <nav className={styles.navigationBar}>
            <ul className={styles.navigationLinks}>
                <NavigationLink title="Bubbles" href="/bubbles" />
                <NavigationLink title="Bundles" href="/bundles" />
                <NavigationLink title="About" href="/about" />
            </ul>
        </nav>
    );
};