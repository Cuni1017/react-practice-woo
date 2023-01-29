import React, { useRef, useEffect, useState, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import ProductService from "../../services/productService";
import LoadingView from "../layout/loadingView.jsx";
import ProductContentView from "./components/productContentView.jsx";

const productService = new ProductService();

const ProductsShowPage = () => {
  const { id } = useParams(); // useParams來取得網址上的params
  let isInited = useRef(false);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const loadProductFunc = async () => {
      const result = await productService.getProductById(id);
      isInited.current = true;
      setProduct(result);
    };
    loadProductFunc();
  }, [id]);

  const initFlag = isInited.current;
  const contentView = useMemo(() => {
    if (initFlag) {
      if (product) {
        return <ProductContentView product={product} />;
      } else {
        return <Navigate to="/" />;
      }
    } else {
      return <LoadingView />;
    }
  }, [product, initFlag]);
  return (
    <>
      <div>{contentView}</div>
    </>
  );
};

export default ProductsShowPage;
