import React from "react";
import { Link } from "react-router-dom";
import Card, {
  CardPrimaryContent,
  CardMedia,
  CardActions,
  CardActionButtons,
} from "@material/react-card";
import { Button } from "@material/react-button";
import OnSalePriceString from "./onSaleString.jsx";

const ProductCard = ({ product }) => {
  const url = `/products/${product.id}`;

  const priceElement = product.onSale ? (
    <OnSalePriceString product={product} />
  ) : (
    <>${product.price}</>
  );

  return (
    <Link to={url}>
      <Card outlined className="productCard">
        {/* http://via.placeholder.com/600x450 */}
        <CardMedia square imageUrl={product.imageUrl} />
        <CardPrimaryContent>
          <div style={{ padding: "0 1rem" }}>
            <p className="title">{product.title}</p>
            <p
              // dangerouslySetInnerHTMLinnerHTML是 React在瀏覽器 DOM 中的替代品。通常，從代碼設置 HTML 是有風險的，因為它很容易在無意中使您的用戶遭受跨站點腳本 (XSS)攻擊。所以，你可以直接從 React 設置 HTML，但你必須鍵入dangerouslySetInnerHTML並傳遞一個帶有__html鍵的對象，以提醒自己這是危險的。例如：
              className="description"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            >
              {/* {product.shortDescription} */}
            </p>
          </div>
        </CardPrimaryContent>

        <CardActions>
          <CardActionButtons>
            <Button>{priceElement}</Button>
          </CardActionButtons>
        </CardActions>
      </Card>
    </Link>
  );
};

export default ProductCard;
