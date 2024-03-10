import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useEffect, useState } from "react";
import { Cart } from "../../types/cart";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";


export const CartList = () => {  
    const [cartItems, setCartItems] = useState<Cart>({ products: [], bundles: []});

    useEffect(() => {
        const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        setCartItems(cartFromStorage);
    }, []);

    const productsTotal = cartItems.products.reduce((total, product) => total + (product?.price || 0), 0);

    const bundlesItemIds = cartItems.bundles.flatMap(bundle => bundle.items);
    const bundleBubblesList = useBundleBubbles(bundlesItemIds);
    const bundlesTotal = bundleBubblesList.reduce((total, bubble) => {
        return total + (bubble?.price || 0);
    }, 0);

    const cartPrice = productsTotal + bundlesTotal;

    const combinedItems = [...cartItems.products, ...cartItems.bundles];

    return (    
        <div className={styles.container}>
            {combinedItems.length === 0 ? (
                <h3>Your cart is empty!</h3>
            ): (
                <div>
                    <div className={styles.listContainer}>
                        {combinedItems.map((item, index) => (
                            <CartListItem key={index} item={item}/>
                        ))}
                    </div>
                    <p className={styles.total}>Total: {cartPrice} kr</p>
                </div>
            )}
        </div>
    );
};


// total