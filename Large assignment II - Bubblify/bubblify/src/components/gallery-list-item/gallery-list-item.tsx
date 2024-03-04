import styles from "./gallery-list-item.module.css";
import { Bubble } from "../../types/bubble";
import { useNavigate } from "react-router-dom";

interface GalleryListItemProps {
    item: Bubble | undefined;
}

export const GalleryListItem = ({ item } : GalleryListItemProps) => {
    const navigate = useNavigate();
    const backgroundImage = item?.image ? `url(${item.image})` : undefined;

    return (
        <div 
            className={styles.galleryItem}
            onClick={() => navigate(`/bubbles/${item?.id}`)}
        >
            <div
                className={styles.galleryItemImage}
                style={{
                    backgroundImage: backgroundImage,
                }}
            >
            </div>

            <div>
                <p>{item?.name}</p>
                <p>{item?.price}</p>
                <p>{item?.description}</p>
            </div>
        </div>
    );
} ;
