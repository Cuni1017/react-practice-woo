import React, { useState, useEffect, useContext } from "react";
import TextField, { Input } from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";
import { Button } from "@material/react-button";
import ProductService from "../../services/productService";
import LoadingView from "../layout/loadingView";
import ProductCardList from "./components/productCardList.jsx";
import CategoryOptions from "./components/categoryOptions";
import CategoryContext from "../../context/categoryContext.jsx";

const productService = new ProductService();

export default function ProductSearchPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();
  const categories = useContext(CategoryContext);

  const inputHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const searchProducts = async (text) => {
    if (isSearching) return;

    setIsSearching(true);
    const result = await productService.getProductsBySearch(
      text,
      categoryId,
      minValue,
      maxValue
    );
    setIsSearching(false);

    if (result) {
      setProducts(result);
    }
  };

  const searchHandler = () => {
    searchProducts(searchText);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "1rem",
          gap: "0.5rem",
        }}
      >
        <TextField
          label="搜尋商品..."
          outlined
          style={{ width: "60%" }}
          // helperText={<HelperText>Help Me!</HelperText>}
          onTrailingIconSelect={() => {}}
          trailingIcon={<MaterialIcon role="button" icon="search" />}
        >
          <Input name="searchText" value={searchText} onChange={inputHandler} />
        </TextField>

        <CategoryOptions
          style={{ margin: "1rem" }}
          value={categoryId}
          categories={categories}
          onChange={(e) => {
            const { value } = e.target;
            setCategoryId(value);
          }}
        />

        <TextField outlined label="最小金額" style={{ maxWidth: "115px" }}>
          <Input
            type="number"
            min={0}
            value={minValue}
            onChange={(e) => {
              const { value } = e.target;
              setMinValue(value);
            }}
          />
        </TextField>
        <TextField
          outlined
          label="最大金額"
          min={0}
          style={{ maxWidth: "115px" }}
        >
          <Input
            type="number"
            value={maxValue}
            onChange={(e) => {
              const { value } = e.target;
              setMaxValue(value);
            }}
          />
        </TextField>
        <Button onClick={searchHandler} outlined style={{ minHeight: "55px" }}>
          Search
        </Button>
      </div>
      {isSearching ? (
        <LoadingView />
      ) : (
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          {products.length > 0 ? (
            <>
              <ProductCardList products={products} />
            </>
          ) : (
            <>
              <h1 style={{ textAlign: "center" }}>沒有商品符合</h1>
            </>
          )}
        </div>
      )}
    </>
  );
}
