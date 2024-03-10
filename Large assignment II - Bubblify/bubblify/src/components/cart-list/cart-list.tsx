import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useEffect, useState, useMemo } from "react";
import { Cart } from "../../types/cart";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";


interface CartListProps {
    order: Cart;
}


export const CartList = (item: CartListProps) => {  
    
    const bundleItemIds = useMemo(() => item.order.bundles.flatMap(bundle => bundle.items), [item.order.bundles]);

    const bundleBubbles = useBundleBubbles(bundleItemIds);

    const productsTotal = useMemo(() => {
        return item.order.products.reduce((total, product) => total + (product?.price || 0), 0);
    }, [item.order.products]);

    const bundlesTotal = useMemo(() => {
        return item.order.bundles.reduce((total, bundle) => {
            const bundlePrice = bundle.items.reduce((sum, itemId) => {
                const bubble = bundleBubbles.find(bubble => bubble.id === itemId);
                return sum + (bubble?.price || 0);
            }, 0);
            return total + bundlePrice;
        }, 0);
    }, [item.order.bundles, bundleBubbles]);

    const cartPrice = productsTotal + bundlesTotal;

    const combinedItems = useMemo(() => [...item.order.products, ...item.order.bundles], [item.order.products, item.order.bundles]);



    return (    
        <div className={styles.container}>
            {combinedItems.length !== 0 && (
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