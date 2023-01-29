import React, { useEffect, useState, useRef, useCallback } from "react";
import ProductCardList from "./components/productCardList.jsx";
import ProductService from "../../services/productService";
import LoadingView from "../layout/loadingView.jsx";
import { Button } from "@material/react-button";
import CustomerService from "../../services/customerService.js";

const productService = new ProductService();

const ProductsIndexPage = () => {
  // 用useRef來保存數據，保證每次初始化後指向的是同一個reference

  let isInited = useRef(false);
  let page = useRef(1);
  let isLastPage = useRef(false);

  const [products, setProducts] = useState([]);

  const loadMoreProducts = useCallback(async () => {
    if (isLastPage.current) return;

    page.current += 1;
    const result = await productService.getProducts(page.current); //Products的Array
    // console.log(page);
    // console.log(result);
    if (result && result.length > 0) {
      setProducts([...products, ...result]);
    } else {
      isLastPage.current = true;
      page.current -= 1;
      setProducts([...products]); //result是空的[]，要重新render!，不然畫面不會動
    }
  }, [products]); //使用useCallback要回傳值，當元素值改變時會重新更新回傳的函式
  // useCallback 的用法是將一個函式包覆並將該函式記憶起來，最後回傳記憶的函式。

  useEffect(() => {
    const loadFunc = async () => {
      const result = await productService.getProducts(page.current); //Products的Array
      //  利用product.js Modal來保護值
      //   result[0].id = "3"; // 不行
      //   result[0].setId(3); // 可以，再product Modal自己寫的
      //   Uncaught (in promise) TypeError: Cannot set property id of #<Product> which has only a getter
      //   console.log(result[0].getValue("id"));
      //   console.log(result[0].getValue("name"));
      isInited.current = true;
      setProducts([...products, ...result]);
    };
    loadFunc();
  }, [productService]);

  return isInited.current ? (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <ProductCardList products={products} />
      {isLastPage.current ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Button onClick={loadMoreProducts} disabled={true}>
            This is last Page.
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Button onClick={loadMoreProducts}>Load more</Button>
        </div>
      )}
    </div>
  ) : (
    <LoadingView />
  );
};

export default ProductsIndexPage;
