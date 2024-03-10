import styles from "./gallery-list.module.css";
import { useBubbles } from "../../hooks/use-bubbles";
import { GalleryListItem } from "../gallery-list-item/gallery-list-item";


export const GalleryList = () => {
    const bubbles = useBubbles();

    return (
        <div className={styles.container}>
            <div className={styles.listContainer}>
                {bubbles.map((item) => (
                    <GalleryListItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};