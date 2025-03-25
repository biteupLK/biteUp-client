import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

import RestaurantPage from './views/resturantPage/ResturantPage';
import FoodsPage from './views/foodsPage/FoodsPage';

const HomePage = React.lazy(() => import("./views/homePage/HomePage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant" element={<RestaurantPage />} />
        <Route path="/foods" element={<FoodsPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
