import React, { useState, useEffect, useContext } from "react";
import MaterialIcon from "@material/react-material-icon";
import { Button } from "@material/react-button";
import MenuSurface, { Corner } from "@material/react-menu-surface";
import { Chip } from "@material/react-chips";
import { Link } from "react-router-dom";

import CartService from "../../services/cartService";
import ProductService from "../../services/productService";
import CartItemsDetail from "../../models/cartItemDetail";

import CartContext from "../../context/cartContext";

const cartService = new CartService();
const productService = new ProductService();

const CartItemsPopup = () => {
  const [open, setOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const [cartItemDetails, setCartItemDetails] = useContext(CartContext);

  const count = cartItemDetails.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  useEffect(() => {
    const loadCartItemsDetail = async () => {
      const cartItems = cartService.getCartItems();
      if (cartItems.length > 0) {
        const productIds = cartItems.map((cartItem) => {
          return cartItem.productId;
        });

        const products = await productService.getProductByIds(productIds);
        const result = products
          .map((product) => {
            const cartItem = cartService.getCartItem(product.id);
            if (!cartItem) {
              return null;
            }
            return new CartItemsDetail(product, cartItem.quantity);
          })
          .filter((x) => x); //filter會過濾掉所有的null, false

        // 因為cartItemDetails有可能會包含null(cartService找不到這個ID)所以用filter
        setCartItemDetails(result);
      }
    };

    loadCartItemsDetail();
  }, [productService]);

  return (
    <div className="mdc-menu-surface--anchor" ref={setAnchorElement}>
      {/* <Button raised onClick={() => this.setState({ open: true })}>
        Open Menu
      </Button> */}

      <Chip
        label={count}
        leadingIcon={<MaterialIcon icon="shopping_cart" />}
        onClick={() => setOpen(true)}
      />

      <MenuSurface
        open={open}
        anchorCorner={Corner.BOTTOM_END}
        onClose={() => {
          setOpen(false);
        }}
        anchorElement={anchorElement}
      >
        <div style={{ padding: "1rem" }}>
          <p>購物車商品: </p>
          {cartItemDetails.map((item) => {
            return (
              <p key={item.productId}>
                {item.productName} x {item.quantity}
              </p>
            );
          })}
          <hr />
          <Link to="/cart">
            <Button outlined>結帳</Button>
          </Link>
        </div>
      </MenuSurface>
    </div>
  );
};

export default CartItemsPopup;
