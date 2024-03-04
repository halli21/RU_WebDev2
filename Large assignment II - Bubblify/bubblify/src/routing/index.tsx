import {
    Route,
    Navigate,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";
import { MainLayout } from "../pages/layouts/main-layout";
import { Gallery } from "../pages/gallery/gallery";
import { About } from "../pages/about/about";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/bubbles" />} />
            <Route path="/bubbles" element={<Gallery />}/>

            <Route path="/about" element={<About />}/>

        </Route>
    )
);

export default router;