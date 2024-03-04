import { useEffect, useState } from "react";
import { getAllBundles } from "../services/bubblify-service";
// import { Bubble } from "../types/bubble";


export const useBundles = () => {
    const [bundles, setBundles] = useState<any[]>([]);
    useEffect(() => {
        async function getBundles() {
            const bundles = await getAllBundles();
            setBundles(bundles);
        }

        getBundles();
    }, []);

    return bundles;
};