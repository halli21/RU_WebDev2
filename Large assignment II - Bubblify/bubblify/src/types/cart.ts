import { Bubble } from "./bubble";
import { Bundle } from "./bundle";

export interface Cart {
    products: Bubble[];
    bundles: Bundle[];
}