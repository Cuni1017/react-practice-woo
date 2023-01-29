import React, { useState, useEffect, useContext } from "react";
import TaiwanPostalCode from "./TaiwanPostalCode.json";
import ReceiptType from "./receiptType.jsx";
import AddressPicker from "./addressPicker.jsx";
import ShippingZoneMethodSelector from "./shippingZoneMethodSelector.jsx";
import PaymentGatewaySelector from "./paymentGatewaySelector.jsx";
import CheckoutInfoContext from "../../../../context/checkoutInfoContext";
import OrderService from "../../../../services/orderService.js";
import { Cell, Grid, Row } from "@material/react-layout-grid";
import Card, { CardPrimaryContent } from "@material/react-card";

const orderService = new OrderService();

const CheckoutInfoEditorContainer = () => {
  const [submitData, setSubmitData, isReady] = useContext(CheckoutInfoContext);
  const [checkoutInfo, setCheckoutInfo] = useState({
    receipt: {
      receiptType: "", //發票類型: 二聯or三聯
      taxId: "", //統一編號
      receiptOptions: [], //
    },
    fullAddress: {
      city: "台北市",
      district: "中正區",
      postalCode: "100",
      address: "",
    },
  });

  const [checkoutAssets, setCheckoutAssets] = useState({
    paymentGateways: [], // 付費方式
    shippingZoneMethods: [], //運送方式
  });

  useEffect(() => {
    const loadAssets = async () => {
      const [paymentGateways, shippingZones] = await Promise.all([
        orderService.getPaymentGatways(),
        orderService.getShippingZones(),
      ]);
      // const paymentGateways = await orderService.getPaymentGatways();
      // const shippingZones = await orderService.getShippingZones();
      const shippingZoneMethods = await orderService.getShippingZoneMethods(
        shippingZones[1] //只取台灣
      );

      setCheckoutAssets({
        ...checkoutAssets,
        paymentGateways: paymentGateways,
        shippingZoneMethods: shippingZoneMethods,
      });
    };

    loadAssets();
  }, []);
  const { paymentGateways, shippingZoneMethods } = checkoutAssets;

  const checkReceiptTypeIsReady = (receipt) => {
    let result = false;
    const { receiptType, taxId } = receipt;

    if (receiptType === "2") {
      result = true;
    } else if (
      receiptType === "3" && //選擇公司，且有填寫統一編號
      taxId !== ""
    ) {
      result = true;
    }
    return result;
  };

  const checkAddressPickerIsReady = (fullAddress) => {
    let result = true;
    let fullAddressArray = Object.keys(fullAddress);
    fullAddressArray.forEach((element) => {
      if (fullAddress[element] === "") result = false;
    });
    return result;
  };

  // 舊的
  // const checkoutIsReady = () => {
  //   return checkReceiptTypeIsReady() && checkAddressPickerIsReady();
  // };

  const updateContextValue = () => {
    // 舊的
    // isReady.current = checkoutIsReady();
    // console.log(isReady.current);

    const { fullAddress } = checkoutInfo;
    const newAddress = {
      address_1: fullAddress.address,
      address_2: "",
      city: fullAddress.district,
      state: fullAddress.city,
      postcode: fullAddress.postalCode,
    };
    setSubmitData({
      ...submitData,
      billing: {
        ...submitData.billing,
        ...newAddress,
      },
      shipping: {
        ...submitData.shipping,
        ...newAddress,
      },
    });
  };

  const handler = (name, value) => {
    // console.log(value);
    // console.log(name);
    // 原本class Component的setState會自己幫我們合併至state
    // this.setState({ [name]: value }, () => {
    //   //在每次狀態改變時回傳至Context
    //   this.updateContextValue();
    //   // console.log(this.state);
    // });
    // hooks的不會，所以要傳進去解開來，而且hooks沒有callbackFunc
    setCheckoutInfo({ ...checkoutInfo, [name]: value });

    // !因為setState是"非同步"的，所以updateContextValue時，資料還會是上一步的。
    // !解決方式就是在他還沒update之前就檢查他

    isReady.current =
      checkReceiptTypeIsReady(
        // 看是不是receipt被改，如果是的話，傳最新的value讓他檢查，不是的話就傳原本的
        name === "receipt" ? value : checkoutInfo.receipt
      ) &&
      checkAddressPickerIsReady(
        // 看是不是fullAddress被改，如果是的話，傳最新的value讓他檢查，不是的話就傳原本的
        name === "fullAddress" ? value : checkoutInfo.fullAddress
      );

    updateContextValue();
  };

  return (
    <Grid>
      <Row>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
        <Cell desktopColumns={6} phoneColumns={4} tabletColumns={6}>
          <ReceiptType handler={handler} receipt={checkoutInfo.receipt} />
          <br />
        </Cell>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
      </Row>
      <Row>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
        <Cell desktopColumns={6} phoneColumns={4} tabletColumns={6}>
          <AddressPicker
            handler={handler}
            fullAddress={checkoutInfo.fullAddress}
            TaiwanPostalCodes={TaiwanPostalCode}
          />
          <br />
        </Cell>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
      </Row>
      <Row>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
        <Cell desktopColumns={6} phoneColumns={4} tabletColumns={6}>
          <Card>
            <CardPrimaryContent>
              <PaymentGatewaySelector
                value={submitData.payment_method}
                paymentGateways={paymentGateways}
                onChange={(paymentGateway) => {
                  setSubmitData({
                    ...submitData,
                    payment_method: paymentGateway.id,
                    payment_method_title: paymentGateway.title,
                  });
                }}
              />
              <ShippingZoneMethodSelector
                value={submitData.shipping_lines}
                shippingZoneMethods={shippingZoneMethods}
                onChange={(shippingZoneMethod) => {
                  setSubmitData({
                    ...submitData,
                    shipping_lines: [
                      {
                        method_id: shippingZoneMethod.methodId, //flat_rate
                        method_title: shippingZoneMethod.methodTitle, //單一費率..
                        total: shippingZoneMethod.costValue, //cost
                      },
                    ],
                  });
                }}
              />
            </CardPrimaryContent>
          </Card>
        </Cell>
        <Cell desktopColumns={3} phoneColumns={0} tabletColumns={1}></Cell>
      </Row>
    </Grid>
  );
};

export default CheckoutInfoEditorContainer;
