import { Outlet } from "react-router-dom";
import styles from './main-layout.module.css';
import { NavigationBar } from "../../components/navigation-bar/navigation-bar";

export const MainLayout = () => (
    <>
        <NavigationBar />
        <main>
            <Outlet />
        </main>
    </>
);