import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

const HomePage = React.lazy(() => import("./views/homePage/HomePage"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
