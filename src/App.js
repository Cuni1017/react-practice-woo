import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";

import Nav from "./view/layout/nav.jsx";
import AppRoutes from "./view/layout/routes";

import CartContext from "./context/cartContext.jsx";
import CartItemsDetail from "./models/cartItemDetail";
import CartService from "./services/cartService";

import IsLogInContext from "./context/isLogInContext.jsx";
import CustomerService from "./services/customerService";

import CategoryContext from "./context/categoryContext.jsx";
import ProductService from "./services/productService";

const cartService = new CartService();
const customerService = new CustomerService();
const productService = new ProductService();

const mergeDataWithToCartItemsDetail = (
  cartItemDetails,
  product,
  quantity,
  append = true //是不是要增加quantity，false => 直接修改quantity
) => {
  const quantityForSubmit = parseInt(quantity);

  if (cartService.getCartItem(product.id)) {
    //如果購物車內有該商品的話，更新該id的quantity
    return cartItemDetails.map((item) => {
      if (item.product.id === product.id) {
        if (append) {
          return new CartItemsDetail(
            product,
            item.quantity + quantityForSubmit
          );
        } else {
          return new CartItemsDetail(product, quantityForSubmit);
        }
      } else {
        return item;
      }
    });
  } else {
    //如果之前沒有這項產品
    return [
      ...cartItemDetails,
      new CartItemsDetail(product, quantityForSubmit),
    ];
  }
};

const App = () => {
  const [cartItemDetails, setCartItemDetails] = useState([]);
  const [isLogIn, setIsLogIn] = useState(customerService.isLoggedIn);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadFunc = async () => {
      const result = await productService.getCategories();
      setCategories(result);
    };

    loadFunc();
  }, []);

  return (
    <IsLogInContext.Provider value={[isLogIn, setIsLogIn]}>
      <CartContext.Provider
        value={[
          cartItemDetails,
          setCartItemDetails,
          mergeDataWithToCartItemsDetail,
        ]}
      >
        <Router>
          <Nav />
          <main className="mdc-top-app-bar--fixed-adjust">
            <CategoryContext.Provider value={categories}>
              <AppRoutes />
            </CategoryContext.Provider>
          </main>
        </Router>
      </CartContext.Provider>
    </IsLogInContext.Provider>
  );
};

export default App;
