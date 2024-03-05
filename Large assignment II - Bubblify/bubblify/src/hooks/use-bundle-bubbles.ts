import { useEffect, useState } from "react";
import { getBubbleById } from "../services/bubblify-service";
import { Bubble } from "../types/bubble";



export const useBundleBubbles = (ids: number[]) => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        async function getBubbles() {
            const bubblesPromises = ids.map(id => getBubbleById(id));
            const bubblesResults = await Promise.all(bubblesPromises);
            setBubbles(bubblesResults.filter((bubble): bubble is Bubble => bubble !== undefined));
        }

        if(ids.length > 0) {
            getBubbles();
        }
    }, [ids]);

    return bubbles;
};