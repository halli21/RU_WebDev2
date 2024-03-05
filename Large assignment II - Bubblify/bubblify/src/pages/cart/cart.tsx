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
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    )
};