import Model from "./model";

class CartItemsDetail extends Model {
  constructor(product, quantity) {
    //以一個object來繼承model的rawData
    super({
      product: product,
      quantity: quantity,
    });
    // console.log(this);
  }

  get product() {
    return this.getValue("product");
  }

  get quantity() {
    return this.getValue("quantity");
  }

  get productName() {
    return this.product.name;
  }

  get productId() {
    return this.product.id;
  }
}

export default CartItemsDetail;
