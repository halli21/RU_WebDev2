import styles from "./bubble-item-details.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBubbleById } from "../../services/bubblify-service";
import { Bubble } from "../../types/bubble";
import { useNavigate } from "react-router-dom";

export const BubbleItemDetails = () => {
    const navigate = useNavigate();
    const { bubbleId } = useParams();
    const [bubble, setBubble] = useState<Bubble | undefined>();
    const [buttonState, setButtonState] = useState('addToCart');
    

    useEffect(() => {
        if (!bubbleId) { return; }
        async function getBubble() {
            const bubble = await getBubbleById(Number(bubbleId));
            setBubble(bubble);
        }

        getBubble();
    }, [bubbleId]);


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
        <div className={styles.container}>
            <div
                className={styles.bubbleImage}
                style={{
                    backgroundImage: bubble?.image ? `url(${bubble.image})` : undefined,
                }}
            >
            </div>
            <div className={styles.details}>
                <h1>{bubble?.name} <span>{bubble?.price} kr</span></h1>
                <p>{bubble?.description}</p>

                {buttonState === 'addToCart' ? (
                    <button className={styles.cart} onClick={(e) => {
                        e.stopPropagation();
                        if (bubble) {
                            addToCart(bubble);
                        }
                    }}>Add to cart</button>
                ) : (
                    <button className={styles.cart} onClick={(e) => {
                        e.stopPropagation();
                        navigate('/checkout');
                    }}>
                        Go to checkout
                    </button>
                )}
            </div>
        </div>
    );
};