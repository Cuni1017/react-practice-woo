import Model from "./model";

class ShippingZone extends Model {
  get name() {
    return this.getValue("name");
  }

  get order() {
    return this.getValue("order");
  }
}

export default ShippingZone;
