import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useEffect, useState } from "react";
import { Cart } from "../../types/cart";
import { useNavigate } from 'react-router-dom';


export const CartList = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<Cart>({ products: [], bundles: []});

    useEffect(() => {
        const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
        setCartItems(cartFromStorage);
    }, []);

    const combinedItems = [...cartItems.products, ...cartItems.bundles];

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div>
            <h1>Cart list</h1>
            <div className={styles.listContainer}>
                {combinedItems.map((item, index) => (
                    <CartListItem key={index} item={item}/>
                ))}
            </div>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};