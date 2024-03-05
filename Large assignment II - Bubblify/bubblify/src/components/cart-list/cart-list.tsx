import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useEffect, useState } from "react";
import { Cart } from "../../types/cart";


export const CartList = () => {
 
    const [cartItems, setCartItems] = useState<Cart>({ products: [], bundles: []});

    useEffect(() => {
        const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        setCartItems(cartFromStorage);
    }, []);

    const combinedItems = [...cartItems.products, ...cartItems.bundles];

    console.log(combinedItems)

    return (
        <div>
            <h1>Cart list</h1>
            <div className={styles.listContainer}>
                {combinedItems.map((item, index) => (
                    <CartListItem key={index} item={item}/>
                ))}
            </div>
            <button>Checkout</button>
        </div>
    );
};