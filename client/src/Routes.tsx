import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router";
import RestaurantPage from "./views/resturantPage/ResturantPage";
import FoodsPage from "./views/foodsPage/FoodsPage";
import getUserDetails from "./customHooks/extractPayload";
import UserProfile from "./views/userProfile/UserProfile";
import PaymentPage from "./views/paymentPage/PayementPage";
import UserHome from "./views/homePage/UserHome";
import Error from "./views/login/Errorpage";
import useAuth from "../src/customHooks/keycloak";
import ErrorPage from "./views/adminPage/ErrorPage";
import ResturantAdmin from "./views/resturant/ResturantAdmin";
import MenuManager from "./views/resturant/MenuManager";
import RestaurantForm from "./views/resturant/RestaurantForm";
import CartPage from "./views/cartPage/CartPage";
import PaidOrders from "./views/myOrders/MyOrders";

const HomePage = React.lazy(() => import("./views/homePage/HomePage"));

const UserBackwardProtectedRoute = () => {
  const userDetails = getUserDetails();
  const role = userDetails?.role;

  const user = userDetails?.name;
  if (user && role != "Admin") {
    return <Navigate to="/home" />;
  }
  return <Outlet />;
};

const UserRestaurantAdmin = () => {
  const userDetails = getUserDetails();
  const role = userDetails?.role;

  if (role != "ResAdmin") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

const AdminProtectedRoute = () => {
  const userDetails = getUserDetails();
  const role = userDetails?.role;

  if (role != "Admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRoutes = () => {

  const isLogin = useAuth();
  console.log(isLogin)

  return (
    <Routes>
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/restaurant" element={<RestaurantPage />} />
      <Route path="/foods" element={<FoodsPage />} />
      <Route path="/home" element={<UserHome />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/resturantAdmin" element={<ResturantAdmin />} />
      <Route path="/menumanager" element={<MenuManager />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/myOrders" element={<PaidOrders />} />

      <Route element={<UserRestaurantAdmin />}>
        <Route path="/restaurantForm" element={<RestaurantForm />} />
        <Route path="/menumanager" element={<MenuManager />} />
      </Route>

      <Route element={<UserBackwardProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<Error />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;
