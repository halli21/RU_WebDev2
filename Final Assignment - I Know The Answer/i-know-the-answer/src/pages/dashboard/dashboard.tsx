import styles from "./dashboard.module.css";

import { MatchRoomList } from "../../components/matchroom-list/matchroom-list";


export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <MatchRoomList />
        </div>
    )
}