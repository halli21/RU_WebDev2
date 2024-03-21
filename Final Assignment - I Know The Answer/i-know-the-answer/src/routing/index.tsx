import {
    Route,
    Navigate,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";
import { MainLayout } from "../pages/layouts/main-layout";

import { Login } from "../pages/login/login";
import { Dashboard } from "../pages/dashboard/dashboard";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<MainLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />

        </Route>
    )
);

export default router;