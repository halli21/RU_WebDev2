import { useEffect, useState } from "react";
import { getAllBundles } from "../services/bubblify-service";
import { Bundle } from "../types/bundle";


export const useBundles = () => {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    useEffect(() => {
        async function getBundles() {
            const bundles = await getAllBundles();
            setBundles(bundles);
        }

        getBundles();
    }, []);

    return bundles;
};