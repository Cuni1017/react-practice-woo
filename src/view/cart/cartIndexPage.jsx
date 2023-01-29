import React, { useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Grid, Cell } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import CartItemsList from "./components/cartItemsList";

import CartContext from "../../context/cartContext";

const CartIndexPage = () => {
  const [cartItemDetails] = useContext(CartContext);
  const total = useMemo(() => {
    return cartItemDetails.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [cartItemDetails]);

  return (
    <div>
      <Grid>
        <Row>
          <Cell desktopColumns={8} phoneColumns={4} tabletColumns={8}>
            <div>
              <CartItemsList />
            </div>
          </Cell>
          <Cell desktopColumns={4} phoneColumns={4} tabletColumns={8}>
            <div style={{ paddingTop: ".5rem" }}>
              <p>總價： {total}</p>
              <div>
                <Link to="/checkout">
                  <Button outlined>結帳</Button>
                </Link>
              </div>
            </div>
          </Cell>
        </Row>
      </Grid>
    </div>
  );
};

export default CartIndexPage;
