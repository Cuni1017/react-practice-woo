import React, { useContext, useMemo } from "react";
import List, {
  ListGroup,
  ListGroupSubheader,
  ListItem,
  ListItemGraphic,
  ListItemMeta,
} from "@material/react-list";
import MaterialIcon from "@material/react-material-icon";
import Select, { Option } from "@material/react-select";
import CartContext from "../../../context/cartContext";
import CartService from "../../../services/cartService";

const cartService = new CartService();

const QuantitySelector = ({ label, value, onChange }) => {
  const valueArray = useMemo(() => {
    const tmp = Array.from(Array(101).keys());
    tmp.shift();
    return tmp;
  }, []);

  return (
    <Select outlined label={label} value={value} onChange={onChange}>
      {valueArray.map((num) => {
        return (
          <Option key={num} value={num}>
            {num}
          </Option>
        );
      })}
    </Select>
  );
};

const CartItemsList = () => {
  const [cartItemDetails, setCartItemDetails, mergeDataWithToCartItemsDetail] =
    useContext(CartContext);

  return (
    <div>
      <List avatarList twoLine>
        <ListGroup>
          <ListGroupSubheader tag="h2">購物車商品</ListGroupSubheader>
          {cartItemDetails.map((cartItem) => {
            const { product, quantity } = cartItem;

            return (
              <React.Fragment key={product.id}>
                <ListItem
                  activated={false}
                  style={{ height: "88px", padding: "0.5rem 1rem" }}
                >
                  <ListItemGraphic
                    graphic={
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        style={{ width: "80px", height: "80px" }}
                      />
                    }
                  />
                  <span className="mdc-list-item__text">
                    <span className="mdc-list-item__primary-text">
                      {product.title}
                    </span>
                    <span className="mdc-list-item__secondary-text">
                      一些額外資訊......
                    </span>
                  </span>
                  <ListItemMeta
                    meta={`$${product.price}`}
                    style={{ marginRight: ".5rem", color: "red" }}
                  />
                  <QuantitySelector
                    value={quantity}
                    onChange={(e) => {
                      const { value } = e.target;
                      const newQuantity = parseInt(value);
                      const newCartItemDetail = mergeDataWithToCartItemsDetail(
                        cartItemDetails,
                        product,
                        newQuantity,
                        false
                      );
                      setCartItemDetails(newCartItemDetail);
                      cartService.updateCartItem(
                        CartService.createCartItem(product.id, newQuantity)
                      );
                    }}
                  />
                  <MaterialIcon
                    icon="delete"
                    style={{ marginLeft: "1rem" }}
                    onClick={(e) => {
                      const newCartItemDetails = cartItemDetails
                        .map((item) => {
                          if (item.product.id === product.id) {
                            return null;
                          } else {
                            return item;
                          }
                        })
                        .filter((x) => x);
                      setCartItemDetails(newCartItemDetails);
                      cartService.removeCartItem(product.id);
                    }}
                  />
                </ListItem>
                <hr />
              </React.Fragment>
            );
          })}
        </ListGroup>
      </List>
    </div>
  );
};

export default CartItemsList;
