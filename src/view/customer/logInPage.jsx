import React, { useState, useContext } from "react";
import TextField, { HelperText, Input } from "@material/react-text-field";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import MaterialIcon from "@material/react-material-icon";
import CustomerService from "../../services/customerService";

import IsLogInContext from "../../context/isLogInContext";

const customerService = new CustomerService();

const LoginPage = () => {
  const [uiStatus, setUiStatus] = useState({
    email: "",
    password: "",
    isLoading: false,
  });

  const [isLogIn, setIsLogIn] = useContext(IsLogInContext); //從App.js取得使否登入

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUiStatus({ ...uiStatus, [name]: value });
  };

  const LoginHanlder = async () => {
    setUiStatus({ ...uiStatus, isLoading: true });
    console.log(uiStatus, "uiStatus");
    await customerService.logIn(uiStatus.email, uiStatus.password);
    console.log(customerService.isLoggedIn, "customerService.isLoggedIn");
    if (customerService.isLoggedIn) {
      setIsLogIn(customerService.isLoggedIn);
      if (customerService.shouldBackToCheckout) {
        customerService.clearShouldBackToCheckout();
        console.log("/checkout");
        // window.location.replace("/checkout");
      } else {
        console.log("/");
        // window.location.replace("/");
      }
    } else {
      setUiStatus({ ...uiStatus, isLoading: false });
      alert("登入失敗");
    }
  };

  // 如果已經登入卻回來Login，返回首頁
  if (isLogIn) {
    console.log("/");
    window.location.replace("/");
    return null;
  }

  return (
    <Grid>
      <Row>
        <Cell desktopColumns={2} tabletColumns={1} phoneColumns={0}></Cell>
        <Cell desktopColumns={8} tabletColumns={6} phoneColumns={4}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>Log In</h1>
            <TextField
              style={{ width: "80%", maxWidth: "500px" }}
              label="Email"
              onTrailingIconSelect={() => {}}
              trailingIcon={<MaterialIcon role="button" icon="person" />}
            >
              <Input
                name="email"
                type="email"
                value={uiStatus.email}
                onChange={inputHandler}
              />
            </TextField>
            <br />
            <TextField
              style={{ width: "80%", maxWidth: "500px" }}
              label="Password"
              onTrailingIconSelect={() => {}}
              trailingIcon={<MaterialIcon role="button" icon="lock" />}
            >
              <Input
                name="password"
                type="password"
                value={uiStatus.password}
                onChange={inputHandler}
              />
            </TextField>
            <br />
            {uiStatus.isLoading ? (
              <Button outlined disabled={true}>
                LogIn
              </Button>
            ) : (
              <Button outlined onClick={LoginHanlder}>
                LogIn
              </Button>
            )}
          </div>
        </Cell>
        <Cell desktopColumns={2} tabletColumns={1} phoneColumns={0}></Cell>
      </Row>
    </Grid>
  );
};

export default LoginPage;
