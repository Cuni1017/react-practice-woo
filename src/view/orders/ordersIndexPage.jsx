import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import OrderService from "../../services/orderService";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import Card, {
  CardPrimaryContent,
  CardActions,
  CardActionButtons,
} from "@material/react-card";
import LoadingView from "../layout/loadingView";

import CustomerService from "../../services/customerService";
const customerService = new CustomerService();
const orderService = new OrderService();

const OrdersContentView = ({ orders }) => {
  return (
    <Grid>
      <Row>
        {orders.map((order) => {
          const url = `/orders/${order.id}`;
          return (
            <Cell
              key={order.id}
              desktopColumns={4}
              tabletColumns={4}
              phoneColumns={4}
            >
              <Card>
                <CardPrimaryContent>
                  <div style={{ padding: "1rem" }}>
                    <h1>訂單編號：{order.id}</h1>
                    <h3>訂單狀態：{order.status}</h3>
                    <p>訂單日期：{order.dateCreated}</p>
                  </div>
                </CardPrimaryContent>

                <CardActions>
                  <CardActionButtons>
                    <Button>
                      <Link to={url}>詳細資訊</Link>
                    </Button>
                  </CardActionButtons>
                </CardActions>
              </Card>
            </Cell>
          );
        })}
      </Row>
    </Grid>
  );
};

const OrdersIndexPage = () => {
  const [orders, setOrders] = useState([]);
  const isInited = useRef(false);

  useEffect(() => {
    const loadFunc = async () => {
      const result = await orderService.getOrders(
        customerService.getCustomerIdFromCookie()
      );
      isInited.current = true;
      // console.log(result);
      setOrders(result);
    };

    loadFunc();
  }, []);

  const initFlag = isInited.current;
  const contentView = useMemo(() => {
    if (initFlag) {
      if (orders.length > 0) {
        return <OrdersContentView orders={orders} />;
      } else {
        return (
          <div
            style={{ textAlign: "center", fontSize: "2rem", marginTop: "2rem" }}
          >
            目前尚無訂單
          </div>
        );
      }
    } else {
      return <LoadingView />;
    }
  }, [orders, initFlag]);
  return contentView;
};

export default OrdersIndexPage;
