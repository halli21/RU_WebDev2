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
        <div>
            {isBubble(item) ? (
                <div>
                    {item.name} {price}
                </div>
            ) : isBundle(item) ? (
                <div>
                    {item.name} {price}
                </div>
            ) : null}
        </div>
    );
};