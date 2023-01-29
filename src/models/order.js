import Model from "./model";
import OrderItem from "./orderItem";

class Order extends Model {
  get status() {
    return this.getValue("status");
  }

  get dateCreated() {
    return this.getValue("date_created").replace("T", " ");
  }

  get currency() {
    return this.getValue("currency");
  }

  get total() {
    return this.getValue("total");
  }

  get billing() {
    return this.getValue("billing");
  }

  get shipping() {
    return this.getValue("shipping");
  }

  get fullAddress() {
    const { country, state, city, address_1, address_2 } = this.shipping;
    return `${state} ${city} ${address_1}${address_2} ${country}`;
  }

  get items() {
    const items = this.getValue("line_items");
    // console.log(items);
    return items.map((item) => {
      return new OrderItem(item);
    });
  }

  get productIds() {
    return this.items.map((item) => {
      return item.productId;
    });
  }
}

export default Order;
