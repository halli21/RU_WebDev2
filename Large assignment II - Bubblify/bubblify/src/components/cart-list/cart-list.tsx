import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useEffect, useState, useMemo } from "react";
import { Cart } from "../../types/cart";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";


export const CartList = () => {  
    const [cartItems, setCartItems] = useState<Cart>({ products: [], bundles: []});

    useEffect(() => {
        const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        setCartItems(cartFromStorage);
    }, []);

    const bundleItemIds = useMemo(() => cartItems.bundles.flatMap(bundle => bundle.items), [cartItems.bundles]);

    const bundleBubbles = useBundleBubbles(bundleItemIds);


    const productsTotal = useMemo(() => {
        return cartItems.products.reduce((total, product) => total + (product?.price || 0), 0);
    }, [cartItems.products]);

    const bundlesTotal = useMemo(() => {
        return cartItems.bundles.reduce((total, bundle) => {
            const bundlePrice = bundle.items.reduce((sum, itemId) => {
                const bubble = bundleBubbles.find(bubble => bubble.id === itemId);
                return sum + (bubble?.price || 0);
            }, 0);
            return total + bundlePrice;
        }, 0);
    }, [cartItems.bundles, bundleBubbles]);

    const cartPrice = productsTotal + bundlesTotal;

    const combinedItems = useMemo(() => [...cartItems.products, ...cartItems.bundles], [cartItems.products, cartItems.bundles]);



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