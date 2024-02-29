import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { MainLayout } from "../pages/layouts/main-layout";
import { RecipeGallery } from "../pages/recipe-gallery/recipe-gallery";
import { RecipeDetailSite } from "../pages/recipe-detail-site/recipe-details-site";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route path="/" element={<RecipeGallery />} />
      <Route path="/:recipeId" element={<RecipeDetailSite />} />

    </Route>
  )
);

export default router;