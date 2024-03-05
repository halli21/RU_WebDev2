import styles from "./cart-list-item.module.css";
import { Bubble } from "../../types/bubble";
import { Bundle } from "../../types/bundle";

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
  
    return (
        <div>
            {isBubble(item) ? (
                <div>
                    bubble
                </div>
            ) : isBundle(item) ? (
                <div>
                    bundle
                </div>
            ) : null}
        </div>
    );
};