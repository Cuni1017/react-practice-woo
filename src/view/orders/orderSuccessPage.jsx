import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import OrderService from "../../services/orderService";
import { Button } from "@material/react-button";
import { useMemo } from "react";
import LoadingView from "../layout/loadingView";

import CustomerService from "../../services/customerService";

const orderService = new OrderService();
const customerService = new CustomerService();

const OrderSuccessContentView = ({ order }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <div style={{ fontSize: "2.5rem" }}>訂單建立成功</div>
      <div style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
        您的訂單編號為 <Link to={`/orders/${order.id}`}>{order.id}</Link>
      </div>

      <Button style={{ marginTop: "2rem" }}>
        <Link to="/orders">所有訂單</Link>
      </Button>
      <br />

      <Button outlined style={{ marginTop: "5rem" }}>
        <Link to="/">回到首頁</Link>
      </Button>
      <br />
      {}
    </div>
  );
};

const OrderSuccessPage = () => {
  const { id } = useParams();
  const isInited = useRef(false);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const loadFunc = async () => {
      const result = await orderService.getOrder(id);
      isInited.current = true;
      setOrder(result);
      console.log(result);
    };

    loadFunc();
  }, [id]);

  const initFlag = isInited.current;
  const contentView = useMemo(() => {
    if (initFlag) {
      if (order) {
        return <OrderSuccessContentView order={order} />;
      } else {
        return <Navigate to="/" />;
      }
    } else {
      return <LoadingView />;
    }
  }, [order, initFlag]);

  // 不用useMemo => 底下return要contentView()
  // const contentView = () => {
  //   if (initFlag) {
  //     //如果有這個訂單存在
  //     if (order) {
  //       return <OrderSuccessContentView order={order} />;
  //     } else {
  //       return <Navigate to="/" />;
  //     }
  //   } else {
  //     return <LoadingView />;
  //   }
  // };

  return contentView;
};

export default OrderSuccessPage;
