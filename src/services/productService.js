// import Woo from "./Woo";
// const woo = new Woo(
//   "ck_e83a1ec3b9fb31a678f1f9cb1713459c03c4bb3a", // Your consumer key
//   "cs_8a887854a0c785a96de21b4bc9bde8007d1a38d7" // Your consumer secret
// );

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Product from "../models/product";
import Category from "../models/category";

const WooCommerce = new WooCommerceRestApi({
  url: "http://localhost/react_practice/", // Your store URL
  consumerKey: "ck_e83a1ec3b9fb31a678f1f9cb1713459c03c4bb3a", // Your consumer key
  consumerSecret: "cs_8a887854a0c785a96de21b4bc9bde8007d1a38d7", // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});

class productService {
  getProducts = (page) => {
    // https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#list-all-products
    return WooCommerce.get("products", {
      page: page,
      per_page: 3,
    })
      .then((response) => {
        const products = response.data.map((rawData) => {
          return new Product(rawData); // 傳進所有數據進Product，利用modal來保護值
        });
        return products;
      })
      .catch((error) => {
        // console.log(error.response.data); //對開發沒什麼用
        console.log(error);
        return [];
      });

    // woo
    //   .request("http://localhost/react_practice/wp-json/wc/v3/products", "get")
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.log(error.response.data);
    //   });
  };

  //   getProductFromId
  getProductById = (id) => {
    return WooCommerce.get(`products/${id}`)
      .then((response) => {
        return new Product(response.data);
      })
      .catch((error) => {
        console.log(error);
        return null;
        // console.log(error.response.data);
      });
  };

  getProductByIds = (ids) => {
    return WooCommerce.get("products", {
      per_page: 100,
      include: ids,
    })
      .then((response) => {
        const products = response.data.map((rawData) => {
          return new Product(rawData);
        });
        return products;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  };

  getProductsBySearch = (text, categoryId, minValue = 0, maxValue) => {
    let data = {
      per_page: 100,
      search: text,
    };

    if (parseInt(categoryId) !== -1) {
      data["category"] = categoryId;
    }

    if (minValue) {
      data["min_price"] = minValue;
    }
    if (maxValue) {
      data["max_price"] = maxValue;
    }

    if (minValue && maxValue && parseInt(minValue) > parseInt(maxValue)) {
      delete data["min_price"];
      delete data["max_price"];
      alert("MinPrice > MaxPrice !!");
    }

    // console.log(data, "data");

    return WooCommerce.get("products", data)
      .then((response) => {
        console.log(response);
        if (response.data.length === 0) {
          console.log("0 products");
          return [];
        }
        const products = response.data.map((rawData) => {
          return new Product(rawData);
        });
        return products;
      })
      .catch((error) => {
        console.log(error.response.data);
        return [];
      });
  };

  getCategories = () => {
    return WooCommerce.get("products/categories")
      .then((response) => {
        // console.log(response.data);
        const categories = response.data.map((rawData) => {
          return new Category(rawData);
        });
        // console.log(categories);
        return categories;
      })
      .catch((error) => {
        console.log(error.response.data);
        return [];
      });
  };
}
export default productService;

//再包裝 Woocommerce
