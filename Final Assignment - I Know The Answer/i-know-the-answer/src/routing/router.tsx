import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { LoginView } from "../views/login-view/login-view";
import { DashboardView } from "../views/dashboard-view/dashboard-view";
import { MainLayout } from "../layouts/main-layout";
import { MatchCreateView } from "../views/match-create-view/match-create-view";
import { MatchDetailsView } from "../views/match-details-view/match-details-view";
import { MatchWaitingView } from "../views/match-waiting-view/match-waiting";
import { MatchGameView } from "../views/match-game-view/match-game-view";
import { MatchSummaryView } from "../views/match-summary-view/match-summary-view";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginView />} />
      <Route path="/*" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="matches/create" element={<MatchCreateView />} />
        <Route path="matches/:matchId" element={<MatchDetailsView />} />
        <Route path="waiting-room/:matchId" element={<MatchWaitingView />} />
        <Route path="game/:matchId" element={<MatchGameView />} />
        <Route path="game-summary/:matchId" element={<MatchSummaryView />} />
      </Route>
    </>
  )
);

export default router;
