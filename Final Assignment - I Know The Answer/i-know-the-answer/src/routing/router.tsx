import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

import { LoginView } from "../views/login-view/login-view";
import { DashboardView } from "../views/dashboard-view/dashboard-view";
import { MainLayout } from "../layouts/main-layout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<LoginView />} />
            <Route path="/*" element={<MainLayout />} >
                <Route path="dashboard" element={<DashboardView />} />
            </Route>
        </>
    )
);

export default router;