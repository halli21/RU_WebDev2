import { Outlet } from "react-router-dom";
import styles from './main-layout.module.css';

export const MainLayout = () => (
    <>
        <main>
            <Outlet />
        </main>
    </>
);