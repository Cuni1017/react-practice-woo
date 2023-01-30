import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Cookies from "js-cookie";
import Customer from "../models/customer";

const WooCommerce = new WooCommerceRestApi({
  url: "http://localhost/react_practice/", // Your store URL
  consumerKey: "ck_e83a1ec3b9fb31a678f1f9cb1713459c03c4bb3a", // Your consumer key
  consumerSecret: "cs_8a887854a0c785a96de21b4bc9bde8007d1a38d7", // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});

const CUSTOMER_KEY = "customer";

class CustomerService {
  constructor() {
    this.customerStorage = Cookies.get(CUSTOMER_KEY);
    if (this.customerStorage == null) {
      this.clearCustomerStorage();
    } else {
      this.customerStorage = JSON.parse(this.customerStorage);
    }
    console.log(this.customerStorage);
  }

  get i() {
    return "i";
  }

  // getCustomerStorage = () => JSON.parse(Cookies.get(CUSTOMER_KEY));

  clearCustomerStorage = () => {
    this.customerStorage = {};
    this.saveToCustomerStorage();
    console.log(this.customerStorage, "clear");
  };

  saveToCustomerStorage = () => {
    console.log(this.customerStorage, "saveToCustomerStorage");
    Cookies.set(CUSTOMER_KEY, JSON.stringify(this.customerStorage), {
      expires: 7,
    });
    // this.customerStorage = {};
  };

  setCustomerIdToCookie = (customerId) => {
    this.customerStorage["customerId"] = customerId;
    this.saveToCustomerStorage();
  };

  get isLoggedIn() {
    // console.log(!!this.getCustomerIdFromCookie(), "dasdasdsazxc");
    return !!this.getCustomerIdFromCookie();
  }

  getCustomerIdFromCookie = () => {
    console.log(this.customerStorage, "get");
    return this.customerStorage["customerId"];
  };

  getCustomerById = (id) => {
    return WooCommerce.get(`customers/${id}`)
      .then((response) => {
        const customer = new Customer(response.data);
        this.setCustomerIdToCookie(customer.id);
        return customer;
      })
      .catch((error) => {
        console.log(error.response.data);
        return null;
      });
  };

  logIn = (email) => {
    alert("嘗試Login");
    // WooCommerce的註冊是使用Wordpress的註冊，註冊後資料後在長一些東西給WooCommerce
    // 因為抓單一個User登入要改wordpress的php設定，所以這裡用另一種方式：List All Customer By Email
    // https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#list-all-customers
    return WooCommerce.get("customers", {
      email: email,
      role: "all",
    })
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          const customer = new Customer(response.data[0]);
          this.setCustomerIdToCookie(customer.id);
          return customer;
        } else {
          // 沒有這個帳戶
          delete this.customerStorage["customerId"];
          return null;
        }
      })
      .catch((error) => {
        delete this.customerStorage["customerId"];
        console.log(error.response.data);
        return null;
      });
  };

  logOut = () => {
    this.clearCustomerStorage();
  };

  // https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#create-a-customer
  signUp = (data) => {
    return WooCommerce.post("customers", data)
      .then((response) => {
        const customer = new Customer(response.data);
        this.setCustomerIdToCookie(customer.id);
        return customer;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  // 如果使用者使用者在未登入情況去checkout，轉到登入頁面，登入後回到checkout
  setShouldBackToCheckout = () => {
    console.log(this.isLoggedIn, "this.isLoggedIn");
    console.log(this.customerStorage, "this.customerStorage");
    alert("let me see see");
    this.customerStorage["setShouldBackToCheckout"] = true;
    this.saveToCustomerStorage();
  };

  clearShouldBackToCheckout = () => {
    this.customerStorage["setShouldBackToCheckout"] = null;
    this.saveToCustomerStorage();
  };

  get shouldBackToCheckout() {
    // console.log(this.customerStorage["setShouldBackToCheckout"], "123");
    // console.log(!!this.customerStorage["setShouldBackToCheckout"], "456");
    // 兩個驚嘆號把null或undefined轉成false
    return !!this.customerStorage["setShouldBackToCheckout"];
  }
}

export default CustomerService;
