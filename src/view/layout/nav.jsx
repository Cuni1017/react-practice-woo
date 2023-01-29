import React, { useState, useContext } from "react";
import CartItemsPopup from "./cartItemsPopup.jsx";

import { Link } from "react-router-dom";
import TopAppBar, {
  TopAppBarIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "@material/react-top-app-bar";
import MaterialIcon from "@material/react-material-icon";
import Drawer from "@material/react-drawer";
import List, { ListItem } from "@material/react-list";

import IsLogInContext from "../../context/isLogInContext.jsx";

import CustomerService from "../../services/customerService.js";

const customerService = new CustomerService();

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [isLogIn, setIsLogIn] = useContext(IsLogInContext);

  console.log(isLogIn, "isLogIn");

  return (
    <>
      <Drawer modal open={open} onClose={() => setOpen(false)}>
        <List>
          <Link to="/">
            <ListItem>首頁 </ListItem>
          </Link>
          <Link to="/products">
            <ListItem>所有商品</ListItem>
          </Link>
          <Link to="/products/search">
            <ListItem>搜尋商品</ListItem>
          </Link>
          <Link to="/cart">
            <ListItem>購物車</ListItem>
          </Link>

          {isLogIn ? (
            <>
              <Link to="/orders">
                <ListItem>歷史訂單</ListItem>
              </Link>
              <Link
                to="/logout"
                onClick={() => {
                  customerService.logOut();
                  setIsLogIn(false);
                }}
              >
                <ListItem>登出</ListItem>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <ListItem>登入</ListItem>
              </Link>
              <Link to="/signup">
                <ListItem>註冊</ListItem>
              </Link>
            </>
          )}
        </List>
      </Drawer>
      <TopAppBar>
        <TopAppBarRow>
          <TopAppBarSection align="start">
            <TopAppBarIcon navIcon tabIndex={0}>
              <MaterialIcon
                hasRipple
                icon="menu"
                onClick={() => setOpen(!open)}
              />
            </TopAppBarIcon>
            <TopAppBarTitle>
              <Link to="/">React Practice</Link>
            </TopAppBarTitle>
          </TopAppBarSection>

          <TopAppBarSection align="end" role="toolbar">
            <TopAppBarIcon tabIndex={0}>
              <div style={{ marginRight: "1rem" }}>
                <CartItemsPopup />
              </div>
            </TopAppBarIcon>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    </>
  );
};

export default Nav;
