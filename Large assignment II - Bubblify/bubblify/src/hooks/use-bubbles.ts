import { useEffect, useState } from "react";
import { getAllBubbles } from "../services/bubblify-service";
import { Bubble } from "../types/bubble";


export const useBubbles = () => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    useEffect(() => {
        async function getBubbles() {
            const bubbles = await getAllBubbles();
            setBubbles(bubbles);
        }

        getBubbles();
    }, []);

    return bubbles;
};