import styles from "./bubble-item-details.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBubbleById } from "../../services/bubblify-service";
import { Bubble } from "../../types/bubble";

export const BubbleItemDetails = () => {
    const { bubbleId } = useParams();
    const [bubble, setBubble] = useState<Bubble | undefined>();
    

    useEffect(() => {
        if (!bubbleId) { return; }
        async function getBubble() {
            const bubble = await getBubbleById(bubbleId!);
            setBubble(bubble);
        }

        getBubble();
    }, [bubbleId]);

    return (
        <div>
            <h1>BubbleItemDetails</h1>
            <div
                className={styles.bubbleImage}
                style={{
                    backgroundImage: bubble?.image ? `url(${bubble.image})` : undefined,
                }}
            >
            </div>
            <p>{bubble?.name}</p>
            <p>{bubble?.price}</p>
            <p>{bubble?.description}</p>
        </div>
    );
};