import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../home/homePage.jsx";
import ProductsIndexPage from "../products/productsIndexPage.jsx";
import ProductsShowPage from "../products/productsShowPage.jsx";
import ProductSearchPage from "../products/productSearchPage.jsx";
import OrdersIndexPage from "../orders/ordersIndexPage.jsx";
import OrdersShowPage from "../orders/ordersShowPage.jsx";
import OrderSuccessPage from "../orders/orderSuccessPage.jsx";
import OrderFailedPage from "../orders/orderFailedPage.jsx";
import CartIndexPage from "../cart/cartIndexPage.jsx";
import CheckoutPage from "../cart/checkoutPage.jsx";
import NoMatchPage from "../errors/404.jsx";
import LoginPage from "../customer/logInPage";
import SignupPage from "../customer/signUpPage.jsx";
import CustomerService from "../../services/customerService";
import IsLogInContext from "../../context/isLogInContext";

const customerService = new CustomerService();

const AppRoutes = () => {
  const [isLogin, setIsLogin] = useContext(IsLogInContext);

  const logoutElement = () => {
    // 有問題，會直接執行
    // customerService.logOut();
    // setIsLogin(false);
    return <Navigate to="/" />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/products" element={<ProductsIndexPage />}></Route>
        <Route path="/products/:id" element={<ProductsShowPage />}></Route>
        <Route path="/products/search" element={<ProductSearchPage />}></Route>
        <Route path="/orders" element={<OrdersIndexPage />}></Route>
        <Route path="/orders/:id" element={<OrdersShowPage />}></Route>
        <Route
          path="/orders/:id/success"
          element={<OrderSuccessPage />}
        ></Route>
        <Route path="/orders/failed" element={<OrderFailedPage />}></Route>
        <Route path="/cart" element={<CartIndexPage />}></Route>
        <Route path="/checkout" element={<CheckoutPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/logout" element={logoutElement()}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="*" element={<NoMatchPage />}></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
