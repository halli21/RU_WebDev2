import styles from "./cart.module.css";
import { CartList } from "../../components/cart-list/cart-list";
import { useNavigate } from "react-router-dom";
import { Cart } from "../../types/cart";
import { useState, useEffect } from "react";
import { getOrdersByNumber } from "../../services/bubblify-service";


export const CartPage = () => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const [cartItems, setCartItems] = useState<Cart>({ products: [], bundles: []});

    const [previousOrders, setPreviousOrders] = useState<Cart[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '{"products": [], "bundles": []}');
            setCartItems(cartFromStorage);

            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

            if (userInfo.phoneNumber) {
                try {
                    const response = await getOrdersByNumber(userInfo.phoneNumber);
                    setPreviousOrders(response);
                } catch (e) {
                    console.error(e);
                }
            }
        };

        fetchOrders();
    }, []);


    const addToCart = (order: Cart) => {
        const updatedCart = {
            products: [...cartItems.products, ...order.products],
            bundles: [...cartItems.bundles, ...order.bundles]
        };
    
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };



    const isCartEmpty = cartItems.products.length === 0 && cartItems.bundles.length === 0;


    return (
        <div className={styles.section}>  
            <div>
                {isCartEmpty ? (
                    <h3>Your cart is empty!</h3>
                ) : (
                    <h3>Your cart</h3>
                )}
                <CartList order={cartItems}/>
                {!isCartEmpty && (
                    <button onClick={handleCheckout} className={styles.button} disabled={isCartEmpty}>Go To Checkout</button>
                )}
            </div>

            <div>
                <h3>Previous orders</h3>
                {previousOrders.map((order, index) => (
                    <div className={styles.previousOrder}>
                        <CartList key={index} order={order} />
                        <button onClick={() => addToCart(order)}  className={styles.button}>Add to cart</button>
                    </div>
                ))}
            </div>
        </div>
    )
};