import React, { useState, useContext } from "react";
import TextField, { HelperText, Input } from "@material/react-text-field";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import MaterialIcon from "@material/react-material-icon";
import CustomerService from "../../services/customerService";
import IsLogInContext from "../../context/isLogInContext";

const customerService = new CustomerService();

// https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-a-customer

const SignupPage = () => {
  const [uiStatus, setUiStatus] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isLoading: false,
  });
  const [isLogIn, setIsLogIn] = useContext(IsLogInContext);

  // 如果已經登入卻回來SignUp，返回首頁
  if (isLogIn) {
    window.location.replace("/");
    return null;
  }

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUiStatus({ ...uiStatus, [name]: value });
  };

  const SignUpHanlder = async () => {
    setUiStatus({ ...uiStatus, isLoading: true });
    const result = await customerService.signUp({
      email: uiStatus.email,
      // password: uiStatus.password, //並不是真正意義上的建立使用者，所以不用
      firstName: uiStatus.firstName,
      lastName: uiStatus.lastName,
      username: `${uiStatus.firstName} ${uiStatus.lastName}`,
    });
    if (customerService.isLoggedIn) {
      setIsLogIn(customerService.isLoggedIn);
      window.location.replace("/");
    } else {
      alert("註冊失敗");
    }
  };

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
            <h1>Sign Up</h1>
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
            <TextField
              style={{ width: "80%", maxWidth: "500px" }}
              label="First Name"
              onTrailingIconSelect={() => {}}
              trailingIcon={<MaterialIcon role="button" icon="badge" />}
            >
              <Input
                name="firstName"
                type="text"
                value={uiStatus.firstName}
                onChange={inputHandler}
              />
            </TextField>
            <br />
            <TextField
              style={{ width: "80%", maxWidth: "500px" }}
              label="Last Name"
              onTrailingIconSelect={() => {}}
              trailingIcon={<MaterialIcon role="button" icon="badge" />}
            >
              <Input
                name="lastName"
                type="text"
                value={uiStatus.lastName}
                onChange={inputHandler}
              />
            </TextField>
            <br />
            {uiStatus.isLoading ? (
              <Button outlined disabled={true}>
                Sign Up
              </Button>
            ) : (
              <Button outlined onClick={SignUpHanlder}>
                Sign Up
              </Button>
            )}
          </div>
        </Cell>
        <Cell desktopColumns={2} tabletColumns={1} phoneColumns={0}></Cell>
      </Row>
    </Grid>
  );
};

export default SignupPage;
