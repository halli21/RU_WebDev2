import styles from "./cart-list.module.css";
import { CartListItem } from "../cart-list-item/cart-list-item";


export const CartList = () => {
 
    const cartItems = {
        "products": [
            {
                "id": 1,
                "name": "Plain bubbles",
                "description": "These are the plain bubbles! They are as plain as they get!",
                "price": 499,
                "image": "https://i.imgur.com/ZiNsJOp.png"
            },
            {
                "id": 2,
                "name": "Wild bubbles",
                "description": "These are the wild bubbles! They form various shapes as found in the wild! Look out! It's a bubble bear!",
                "price": 799,
                "image": "https://i.imgur.com/w9Usvcd.png"
            }
        ],
        "bundles": [
            {
                "id": 1,
                "name": "Dark Christmas!",
                "items": [ 5, 6 ]
            },
            {
                "id": 2,
                "name": "Triple Bubble!",
                "items": [ 2, 3, 4 ]
            }
        ]
    }

    const combinedItems = [...cartItems.products.map(item => ({...item, type: 'bubble'})), 
                           ...cartItems.bundles.map(bundle => ({...bundle, type: 'bundle'}))];



    return (
        <div>
            <h1>Cart list</h1>
            <div className={styles.listContainer}>
                {combinedItems.map((item) => (
                    <CartListItem />
                ))}
            </div>
            <button>Checkout</button>

        </div>
    );
};