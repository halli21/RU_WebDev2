import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
} from "react-router-dom";

import { LoginView } from "../views/login-view/login-view";
import { DashboardView } from "../views/dashboard-view/dashboard-view";
import { MainLayout } from "../layouts/main-layout";
import { MatchCreateView } from "../views/match-create-view/match-create-view";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<LoginView />} />
            <Route path="/*" element={<MainLayout />} >
                <Route path="dashboard" element={<DashboardView />} />
                <Route path="matches/create" element={<MatchCreateView />} />
            </Route>
        </>
    )
);

export default router;