import styles from "./navigation-bar.module.css";
import { NavigationLink } from "../navigation-link/navigation-link";


export const NavigationBar = () => {

    return (
        <nav className={styles.container}>
            <div className={styles.content}>
                <div
                    className={styles.logoImage}
                    style={{
                        backgroundImage: `url('/bubblify-logo.jpg')`,
                    }}
                >
                </div>
                <ul className={styles.navigationLinks}>
                    <NavigationLink title="Products" href="/bubbles" />
                    <NavigationLink title="Bundles" href="/bundles" />
                    <NavigationLink title="About us" href="/about" />
                    <NavigationLink title="Cart" href="/cart" />
                </ul>
            </div>
        </nav>
    );
};