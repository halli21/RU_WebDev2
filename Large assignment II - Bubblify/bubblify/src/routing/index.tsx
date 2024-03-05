import {
    Route,
    Navigate,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";
import { MainLayout } from "../pages/layouts/main-layout";
import { Gallery } from "../pages/gallery/gallery";
import { BubbleItemDetails } from "../pages/bubble-item-details/bubble-item-details";
import { Bundles } from "../pages/bundles/bundles";
import { About } from "../pages/about/about";
import { Cart } from "../pages/cart/cart";
import { Checkout } from "../pages/checkout/checkout";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/bubbles" />} />
            <Route path="/bubbles" element={<Gallery />}/>
            <Route path="/bubbles/:bubbleId" element={<BubbleItemDetails />} />
            <Route path="/bundles" element={<Bundles />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/cart" element={<Cart />}/>
            <Route path="/checkout" element={<Checkout />}/>

        </Route>
    )
);

export default router;