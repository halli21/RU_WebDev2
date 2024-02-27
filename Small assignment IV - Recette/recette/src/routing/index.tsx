import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
  } from "react-router-dom";
  import { MainLayout } from "../pages/layouts/main-layout";
  import { RecipeGallery } from "../pages/recipeGallery/recipeGallery";

  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        <Route path="/" element={<RecipeGallery />} />
  
      </Route>
    )
  );
  
  export default router;