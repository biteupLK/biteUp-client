import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

import RestaurantPage from './views/resturantPage/ResturantPage';
import FoodsPage from './views/foodsPage/FoodsPage';
import useAuth from "./customHooks/keycloak";
import ErrorPage from "./views/login/Errorpage"
const HomePage = React.lazy(() => import("./views/homePage/HomePage"));

const AppRoutes = () => {
  const isLogin = useAuth();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={isLogin?<HomePage />:<ErrorPage/>} />
        <Route path="/restaurant" element={isLogin?<RestaurantPage />:<ErrorPage/>} />
        <Route path="/foods" element={isLogin?<FoodsPage />:<ErrorPage/>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
