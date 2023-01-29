import React, { useState, useCallback, useContext } from "react";
import { Cell, Grid, Row } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import Select, { Option } from "@material/react-select";
import OnSalePriceString from "./onSaleString.jsx";
import CartService from "../../../services/cartService.js";

import CartContext from "../../../context/cartContext.jsx";
// import CartItemsDetail from "../../../models/cartItemDetail.js";

const cartService = new CartService();

const ProductContentView = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartItemDetails, setCartItemDetails, mergeDataWithToCartItemsDetail] =
    useContext(CartContext);

  const selectQuantity = useCallback((e) => {
    const { value } = e.target;
    // console.log(value);
    setQuantity(value);
  }, []);

  const addInCart = useCallback((e) => {
    const quantityForSubmit = parseInt(quantity);
    const newCartItemDetails = mergeDataWithToCartItemsDetail(
      cartItemDetails,
      product,
      quantityForSubmit
    );
    setCartItemDetails(newCartItemDetails);

    // console.log(quantity);
    cartService.addInCart(product.id, quantity);
    // window.location.replace("/products");
  }); //這裡不應該加,[]，不然用的都是同一個function=>只會加1個

  const priceElement = product.onSale ? (
    <OnSalePriceString product={product} />
  ) : (
    <>${product.price}</>
  );

  //   console.log(quantity);
  return (
    <Grid>
      <Row>
        <Cell desktopColumns={6} phoneColumns={4} tabletColumns={8}>
          <img src={product.imageUrl} style={{ width: "100%" }} />
        </Cell>
        <Cell desktopColumns={6} phoneColumns={4} tabletColumns={8}>
          <div style={{ padding: "1rem 2rem" }}>
            <h1>{product.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
            <div style={{ margin: "1rem 0" }}>{priceElement}</div>
            <div>
              <Select
                outlined
                label=""
                value={quantity}
                onChange={selectQuantity}
              >
                {[1, 2, 3, 4, 5].map((num) => {
                  return (
                    <Option key={num} value={num}>
                      {num}
                    </Option>
                  );
                })}
              </Select>
              <Button onClick={addInCart} style={{ margin: "0 1rem" }} outlined>
                Add in Cart
              </Button>
            </div>
          </div>
        </Cell>
      </Row>
    </Grid>
  );
};

export default ProductContentView;
