import styles from "./gallery-list-item.module.css";
import { Bubble } from "../../types/bubble";
import { useNavigate } from "react-router-dom";

interface GalleryListItemProps {
    item: Bubble | undefined;
}

export const GalleryListItem = ({ item } : GalleryListItemProps) => {
    const navigate = useNavigate();
    const backgroundImage = item?.image ? `url(${item.image})` : undefined;

    const addToCart = (product: Bubble) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '{"bubbles": [], "bundles": []}');
         
        cart.bubbles.push(product);
    
        localStorage.setItem('cart', JSON.stringify(cart));
    };
    

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

            <div className={styles.container}>
                <div className={styles.heading}>
                    <p>{item?.name}</p>
                    <span>{item?.price} kr</span>
                </div>

                <p>{item?.description}</p>

                <button className={styles.cart} onClick={(e) => {
                    e.stopPropagation();
                    if (item) {
                        addToCart(item);
                    }
                }}>Add to cart</button>
            </div>
         
        </div>
    );
} ;
