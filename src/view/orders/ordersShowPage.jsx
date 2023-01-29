import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import OrderService from "../../services/orderService";
// import ProductService from "../../services/productService";
import LoadingView from "../layout/loadingView";
import { Button } from "@material/react-button";

import CustomerService from "../../services/customerService";
const customerService = new CustomerService();
// const productService = new ProductService();
const orderService = new OrderService();

const OrderContentView = ({ order }) => {
  // const [orderItems, setOrderItems] = useState([]);
  // const isInited = useRef(false);

  // useEffect(() => {
  //   const loadFunc = async () => {
  //     const products = await productService.getProductByIds(order.productIds);
  //     isInited.current = true;
  //   };
  //   loadFunc();
  // }, []);

  // const initFlag = isInited.current;

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <h1>訂單編號：{order.id}</h1>
      <p>訂單狀態：{order.status}</p>
      <p>訂單建立時間：{order.dateCreated}</p>
      <p>
        總價：{order.total} {order.currency}
      </p>
      <p>地址：{order.fullAddress}</p>
      <div style={{ maxWidth: "20rem", margin: "auto" }}>
        <ul>
          {order.items.map((item) => {
            const productUrl = `/products/${item.productId}`;
            return (
              <Link to={productUrl} key={item.productId}>
                <li
                  style={{
                    listStyle: "none",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: "80px" }}
                  />
                  <span
                    style={{
                      marginLeft: "1rem",
                    }}
                  >
                    {item.name} x {item.quantity}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <Button style={{ marginTop: "2rem" }}>
        <Link to="/orders">所有訂單</Link>
      </Button>
      <br />

      <Button outlined style={{ marginTop: "5rem" }}>
        <Link to="/">回到首頁</Link>
      </Button>
    </div>
  );
};

const OrdersShowPage = () => {
  const [order, setOrder] = useState({});
  const isInited = useRef(false);
  const { id } = useParams();

  useEffect(() => {
    const loadFunc = async () => {
      const result = await orderService.getOrder(
        id,
        customerService.getCustomerIdFromCookie()
      );
      isInited.current = true;
      setOrder(result);
      console.log(order);
    };
    loadFunc();
  }, [id]);

  const initFlag = isInited.current;
  const ContentView = useMemo(() => {
    if (initFlag) {
      if (order) {
        return <OrderContentView order={order} />;
      } else {
        return <Navigate to="/" />;
      }
    } else {
      return <LoadingView />;
    }
  }, [order, initFlag]);

  return ContentView;
};

export default OrdersShowPage;
