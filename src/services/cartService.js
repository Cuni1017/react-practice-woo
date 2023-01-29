import Cookies from "js-cookie";

const CART_KEY = "cart";

class CartService {
  constructor() {
    this.cart = Cookies.get(CART_KEY);
    //如果使用者沒有cart(第一次進來)
    if (this.cart == null) {
      this.cart = {}; //建立一個{}給他
      this.save(); //保存在他的電腦
    } else {
      this.cart = JSON.parse(this.cart); //解析文件，才回變成javascript可以使用的object
    }
    // console.log(this.cart);
  }

  static createCartItem = (productId, quantity = 0) => {
    return {
      productId: productId,
      quantity: quantity,
    };
  };

  save = () => {
    Cookies.set(CART_KEY, JSON.stringify(this.cart));
  };

  getCartItem = (productId) => {
    const productIdKey = parseInt(productId);
    const cartItem = this.cart[productIdKey];
    if (!cartItem || !this.isCartItemValid(cartItem, productIdKey)) {
      this.removeCartItem(productIdKey);
      return;
    }

    return cartItem;
  };

  addInCart = (productId, quantity) => {
    const cartItem =
      this.getCartItem(productId) || CartService.createCartItem(productId, 0);
    // { 方法一帶
    //   //如果沒有這個id，幫它新建一個
    //   productId: productId,
    //   quantity: 0,
    // };

    cartItem.quantity += Math.max(1, quantity); //Math.max() 函式會回傳零或多個數字中的最大值。
    this.updateCartItem(cartItem);
  };

  updateCartItem = (cartItem) => {
    const { productId } = cartItem;
    if (this.isCartItemValid(cartItem, productId)) {
      this.cart[productId] = cartItem;
      this.save();
    }
  };

  removeCartItem = (productId) => {
    this.cart[productId] = null;
    this.save();
  };

  clearCartItems = () => {
    this.cart = {};
    this.save();
  };

  // 因為cookie是存在客戶端，所以做驗證，但也不算真正安全
  // 真正安全是拿到cartItem.productId 送到後端去查這個id存不存在
  isCartItemValid = (cartItem, productId) => {
    // (如果Item裡的productId不等於它的標號 或 Item的數量少於0的話) return false
    return !(cartItem.productId !== productId || cartItem.quantity <= 0);
  };

  getCartItems = () => {
    return Object.keys(this.cart)
      .map((productId) => {
        return this.getCartItem(productId);
      })
      .filter((x) => x);
  };
}

export default CartService;
// 再包裝 js-cookie
