import Model from "./model";

class OrderItem extends Model {
  get name() {
    return this.getValue("name");
  }
  get productId() {
    return this.getValue("product_id");
  }
  get quantity() {
    return this.getValue("quantity");
  }
  get price() {
    return this.getValue("price");
  }

  get imageUrl() {
    return this.getValue("image").src;
  }
}

export default OrderItem;
