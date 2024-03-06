import styles from "./cart-list-item.module.css";
import { Bubble } from "../../types/bubble";
import { Bundle } from "../../types/bundle";
import { useBundleBubbles } from "../../hooks/use-bundle-bubbles";


type CartListItemProps = {
    item: Bubble | Bundle;
};

function isBubble(item: Bubble | Bundle): item is Bubble {
    return (item as Bubble).price !== undefined;
}

function isBundle(item: Bubble | Bundle): item is Bundle {
    return (item as Bundle).items !== undefined;
}

export const CartListItem = ({ item }: CartListItemProps) => {
    const bubbleIds = isBundle(item) ? item.items : [];
    const bubblesList = useBundleBubbles(bubbleIds);

    const bundlePrice = bubblesList.reduce((total, bubble) => {
        return total + (bubble?.price || 0);
    }, 0);

    const price = isBubble(item) ? item.price : bundlePrice;
  
    return (
        <div className={styles.itemContainer}>
            {isBubble(item) ? (
                <div className={styles.bubbleContainer}>
                    <div className={styles.identifier}>
                        <p>{item.name}<span> (Bubble)</span></p>
                 
                    </div>
                    <p style={{fontSize: "14px", fontWeight: "normal", fontStyle: "italic"}}>{price} kr</p>
                </div>
            ) : isBundle(item) ? (
                <div>
                    <div className={styles.bundleContainer}>
                        <p>{item.name}<span> (Bundle)</span></p>
                        <p style={{fontSize: "14px", fontWeight: "normal", fontStyle: "italic"}}>{price} kr</p>
                    </div>
                    
                    <p style={{fontSize: "14px", fontWeight: "normal", paddingLeft: "2px"}}>Includes:</p>
                    {bubblesList.map((bubble) => (
                        <ul>
                            <li style={{fontSize: "14px", fontWeight: "normal", fontStyle: "italic"}}>{bubble?.name}</li> 
                        </ul>
                    ))}
                </div>
            
            ) : null}
        </div>
    );
};