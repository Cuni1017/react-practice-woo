import Model from "./model";

export default class Category extends Model {
  get name() {
    return this.getValue("name");
  }
}
