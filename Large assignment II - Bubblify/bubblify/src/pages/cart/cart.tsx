import styles from "./cart.module.css";
import { CartList } from "../../components/cart-list/cart-list";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div>
            <CartList />
            <button onClick={handleCheckout} className={styles.button}>Go To Checkout</button>
        </div>
    )
};