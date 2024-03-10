import { Outlet } from "react-router-dom";
import "../page-styles.css";
import { NavigationBar } from "../../components/navigation-bar/navigation-bar";

export const MainLayout = () => (
    <>
        <NavigationBar />
        <main className="page">
            <Outlet />
        </main>
    </>
);