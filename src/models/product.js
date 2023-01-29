import Modal from "./model";

class Product extends Modal {
  get name() {
    return this.getValue("name");
  }

  //取別名 可以用``改顏色之類的
  get title() {
    return this.name;
  }

  get shortDescription() {
    return this.getValue("short_description");
  }

  get description() {
    return this.getValue("description");
  }

  get price() {
    return this.getValue("price");
  }
  get onSale() {
    return this.getValue("on_sale");
  }
  get regularPrice() {
    return this.getValue("regular_price");
  }

  get imageUrl() {
    const images = this.getValue("images");
    if (images && images.length > 0) return images[0].src;
    return "";
  }
}

export default Product;
