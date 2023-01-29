import React, { useState, useContext, useEffect, useRef } from "react";
import OrderService from "../../services/orderService";
import CartService from "../../services/cartService";
import CustomerService from "../../services/customerService";
import CheckoutInfoEditorContainer from "./components/hooks/checkoutInfoEditorContainer";
import PaymentGatewaySelector from "./components/hooks/paymentGatewaySelector.jsx";
import ShippingZoneMethodSelector from "./components/hooks/shippingZoneMethodSelector.jsx";
import CartContext from "../../context/cartContext";
import IsLogInContext from "../../context/isLogInContext";
import CheckoutInfoContext from "../../context/checkoutInfoContext";
import ExtraCheckoutInfroContext from "../../context/extraCheckoutInfroContext";

import Button from "@material/react-button";
import { Grid, Row, Cell } from "@material/react-layout-grid";

const orderService = new OrderService();
const cartService = new CartService();
const customerService = new CustomerService();

const data = {
  payment_method: "bacs",
  payment_method_title: "銀行轉帳",
  billing: {
    first_name: "小明",
    last_name: "王",
    address_1: "信義路五段7號85樓",
    address_2: "",
    city: "信義區",
    state: "台北市",
    postcode: "110",
    country: "TW",
    email: "demo.progressbar.tw@gmail.com",
    phone: "0912345678",
  },
  shipping: {
    first_name: "小明",
    last_name: "王",
    address_1: "信義路五段7號89樓",
    address_2: "",
    city: "信義區",
    state: "台北市",
    postcode: "110",
    country: "TW",
  },
  line_items: [],
  shipping_lines: [],
  customer_id: customerService.getCustomerIdFromCookie(),
};

// console.log(customerService.getCustomerIdFromCookie());

const CheckoutPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [cartItemDetails] = useContext(CartContext);
  const [submitData, setSubmitData] = useState(data); //原本woocommerce給的格式
  //自己附加的，有發票方式、地址
  const [extraSubmitData, SetExtraSubmitData] = useState({
    receiptType: "2",
    taxId: "",
    receiptOptions: ["byMail"],
  });
  const [checkoutAssets, setCheckoutAssets] = useState({
    paymentGateways: [],
    shippingZoneMethods: [],
  });

  const isReady = useRef(false);
  const checkoutIsReady = () => {
    return (
      submitData.shipping_lines.length > 0 &&
      submitData.payment_method_title !== ""
    );
  };

  const getButtonText = () => {
    if (submitting) {
      return "結帳中...請稍後";
    } else if (!isReady.current || !checkoutIsReady()) {
      return "資料填寫不完整, 無法結帳";
    } else {
      return "結帳";
    }
  };

  // //填入訂單的訊息
  data.line_items = cartItemDetails.map((item) => {
    return {
      product_id: item.product.id,
      quantity: item.quantity,
    };
  });
  console.log(data.line_items);

  useEffect(() => {
    //   // 如果尚未登入就進來結帳頁面，轉到登入頁面
    checkUserIsLogin();

    // const loadAssets = async () => {
    //   const [paymentGateways, shippingZones] = await Promise.all([
    //     orderService.getPaymentGatways(),
    //     orderService.getShippingZones(),
    //   ]);
    //   //     // const paymentGateways = await orderService.getPaymentGatways();
    //   //     // const shippingZones = await orderService.getShippingZones();
    //   const shippingZoneMethods = await orderService.getShippingZoneMethods(
    //     shippingZones[1] //只取台灣
    //   );
    //   setCheckoutAssets({
    //     ...checkoutAssets,
    //     paymentGateways: paymentGateways,
    //     shippingZoneMethods: shippingZoneMethods,
    //   });
    // };

    // loadAssets();
  }, []);

  const [isLogIn, setIsLogIn] = useContext(IsLogInContext);
  // // 避免在React StrictMode 重複兩次alert的flag
  let flag = 0;

  const checkUserIsLogin = () => {
    if (!isLogIn) {
      if (flag === 0) alert("結帳前請先登入");
      flag += 1;
      customerService.setShouldBackToCheckout();
      // window.location.replace("/login");
    }
  };

  return (
    <CheckoutInfoContext.Provider value={[submitData, setSubmitData, isReady]}>
      <ExtraCheckoutInfroContext.Provider
        value={[extraSubmitData, SetExtraSubmitData]}
      >
        <h1 style={{ textAlign: "center" }}>結帳</h1>
        <CheckoutInfoEditorContainer />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Button
            outlined
            onClick={(e) => {
              setSubmitting(true);
              const submitOrder = async () => {
                console.log(submitData);
                const order = await orderService.submitOrder(submitData);
                if (order) {
                  cartService.clearCartItems();
                  window.location.replace(`/orders/${order.id}/success`);
                } else {
                  window.location.replace(`/orders/failed`);
                }
              };
              submitOrder();
            }}
            disabled={!isReady.current || !checkoutIsReady() || submitting}
          >
            {getButtonText()}
          </Button>
        </div>
      </ExtraCheckoutInfroContext.Provider>
    </CheckoutInfoContext.Provider>
  );
};

export default CheckoutPage;
