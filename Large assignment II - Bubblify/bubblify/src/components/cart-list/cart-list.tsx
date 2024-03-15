import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";
import { useMemo } from "react";
import { Cart } from "../../types/cart";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";
import PropTypes from 'prop-types';


interface CartListProps {
    cart: Cart;
}


export const CartList = (item: CartListProps) => {  
    
    const bundleItemIds = useMemo(() => {
        return item.cart.bundles.flatMap(bundle => bundle.items);
    }, [item.cart.bundles]);

    const bundleBubbles = useBundleBubbles(bundleItemIds);

    const productsTotal = item.cart.products.reduce((total, product) => total + (product?.price || 0), 0);

    const bundlesTotal = item.cart.bundles.reduce((total, bundle) => {
        const bundlePrice = bundle.items.reduce((sum, itemId) => {
            const bubble = bundleBubbles.find(bubble => bubble.id === itemId);
            return sum + (bubble?.price || 0);
        }, 0);
        return total + bundlePrice;
    }, 0);

    const cartPrice = productsTotal + bundlesTotal;

    const combinedItems = [...item.cart.products, ...item.cart.bundles];


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


const bubbleShape = {
    // Unique identifier for the bubble
    id: PropTypes.number.isRequired,
    // Display name of the bubble
    name: PropTypes.string.isRequired,
    // Description of the bubble
    description: PropTypes.string.isRequired,
    // Price of the bubble
    price: PropTypes.number.isRequired,
    // Image URL for the bubble
    image: PropTypes.string.isRequired,
};
  
const bundleShape = {
    // Unique identifier for the bundle
    id: PropTypes.number.isRequired,
    // Display name of the bundle
    name: PropTypes.string.isRequired,
    // Array of bubble ids that are included in the bundle
    items: PropTypes.arrayOf(PropTypes.number).isRequired,
};

CartList.propTypes = {
    // This is the cart item which should be displayed in the component
    cart: PropTypes.shape({
        products: PropTypes.arrayOf(PropTypes.shape(bubbleShape)).isRequired,
        bundles: PropTypes.arrayOf(PropTypes.shape(bundleShape)).isRequired,
    }).isRequired
};
