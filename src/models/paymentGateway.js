import Model from "./model";

export default class PaymentGateway extends Model {
  get title() {
    return this.getValue("title");
  }
  get description() {
    return this.getValue("description");
  }
  get order() {
    return this.getValue("order");
  }
  get enabled() {
    return this.getValue("enabled");
  }
}
