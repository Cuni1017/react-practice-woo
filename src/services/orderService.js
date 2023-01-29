import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import Order from "../models/order";
import PaymentGateway from "../models/paymentGateway";
import ShippingZone from "../models/shippingZone";
import ShippingZoneMethod from "../models/ShippingZoneMethod";

const WooCommerce = new WooCommerceRestApi({
  url: "http://localhost/react_practice/", // Your store URL
  consumerKey: "ck_e83a1ec3b9fb31a678f1f9cb1713459c03c4bb3a", // Your consumer key
  consumerSecret: "cs_8a887854a0c785a96de21b4bc9bde8007d1a38d7", // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});

class OrderService {
  submitOrder = (data) => {
    if (!data.customer_id) {
      return null;
    }

    return WooCommerce.post("orders", data)
      .then((response) => {
        // console.log(response.data);
        return new Order(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        return null;
      });
  };

  getOrder = (id, customer_id = null) => {
    if (!customer_id) {
      return null;
    }

    return WooCommerce.get(`orders`, {
      customer: customer_id,
      include: [id],
    })
      .then((response) => {
        console.log(response);
        const result = response.data.map((rawData) => {
          return new Order(rawData);
        });
        if (result.length > 0) {
          return result[0];
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  getOrders = (customer_id) => {
    if (!customer_id) {
      return null;
    }

    return WooCommerce.get("orders", {
      customer: customer_id,
    })
      .then((response) => {
        console.log(response.data);
        const orders = response.data;
        return orders.map((order) => {
          return new Order(order);
        });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  getPaymentGatways = () => {
    return WooCommerce.get("payment_gateways")
      .then((response) => {
        // console.log(response.data);
        const result = response.data.map((data) => {
          return new PaymentGateway(data);
        });
        return result;
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  // getShippingMethods = () => {
  //   return WooCommerce.get("shipping_methods")
  //     .then((response) => {
  //       // console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data);
  //     });
  // };

  // 取得我們區分的地區
  getShippingZones = () => {
    return WooCommerce.get("shipping/zones")
      .then((response) => {
        // console.log(response.data);
        return response.data.map((rawData) => {
          return new ShippingZone(rawData);
        });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  // 取得我們每個分區的運費
  getShippingZoneMethods = (shippingZone) => {
    if (!shippingZone || !shippingZone.id) return [];

    return WooCommerce.get(`shipping/zones/${shippingZone.id}/methods`)
      .then((response) => {
        // console.log(response.data);
        return response.data.map((rawData) => {
          return new ShippingZoneMethod(rawData);
        });
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };
}

export default OrderService;
