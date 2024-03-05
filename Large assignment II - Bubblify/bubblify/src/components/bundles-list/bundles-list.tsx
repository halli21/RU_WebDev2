import styles from "./bundles-list.module.css";
import { useBundles } from "../../hooks/use-bundles";
import { BundleListItem } from "../bundle-list-item/bundle-list-item";



export const BundlesList = () => {
    const bundles = useBundles();

    return (
        <div className={styles.container}>
            <h1>Bundle list</h1>
            <div className={styles.listContainer}>
                {bundles.map((item, index) => (
                    <BundleListItem key={index} item={item} />
                ))}
            </div>
        </div>
    );
};