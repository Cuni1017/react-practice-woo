import Model from "./model";

class ShippingZoneMethod extends Model {
  // override
  get id() {
    return this.instanceId;
  }

  get instanceId() {
    return this.getValue("instance_id");
  }

  get methodId() {
    return this.getValue("method_id");
  }

  get methodTitle() {
    return this.getValue("method_title");
  }

  get title() {
    return this.getValue("title");
  }

  get description() {
    return this.getValue("description");
  }

  get settings() {
    return this.getValue("settings");
  }

  get cost() {
    return this.settings.cost;
  }

  get costValue() {
    return this.cost.value;
  }
}

export default ShippingZoneMethod;
