import styles from "./gallery-list-item.module.css";
import { Bubble } from "../../types/bubble";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface GalleryListItemProps {
    item: Bubble | undefined;
}

export const GalleryListItem = ({ item } : GalleryListItemProps) => {
    const navigate = useNavigate();
    const backgroundImage = item?.image ? `url(${item.image})` : undefined;
    const [buttonState, setButtonState] = useState('addToCart');

    const addToCart = (product: Bubble) => {
        let cart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        cart.products.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        setButtonState('goToCheckout');

        
        setTimeout(() => {
            setButtonState('addToCart');
        }, 5000);
    };
    

    return (
        <div>
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


                    {buttonState === 'addToCart' ? (
                        <button className={styles.cart} onClick={(e) => {
                            e.stopPropagation();
                            if (item) {
                                addToCart(item);
                            }
                        }}>Add to cart</button>
                    ) : (
                        <button className={styles.checkout} onClick={(e) => {
                            e.stopPropagation();
                            navigate('/checkout');
                        }}>
                            Go to checkout
                        </button>
                    )}
                    
                </div>

            
            </div>
        </div>
    );
} ;
