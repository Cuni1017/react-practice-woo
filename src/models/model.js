// 為了避免product.id = 1(值直接被改)，又可以取得值，所以建modal
// const product = new Product()

// 直接執行函式示範，把函示整個用()包住後面再加一個()
// (() => {
//   console.log(123);
// })();

class Model {
  // rawData->原始數據
  constructor(rawData) {
    // 利用匿名函式來傳回方法，用list給兩個參數接
    const [getValue, setValue] = (() => {
      const cache = rawData;

      const getValue = (key) => {
        return cache[key];
      };

      const setValue = (key, value) => {
        cache[key] = value;
        // console.log("----------");
        // console.log(this);
        // console.log("----------");
        return this;
      };
      //回傳一個list裡有兩個函式
      return [getValue, setValue];
    })(); //直接執行函式 (()=>{console.log(123)})()

    // const cache = rawData;
    // // console.log(rawData); //傳進來的所有資料: id:54, name: T-shirt, ...
    // const getValue = (key) => {
    //   return cache[key];
    // };

    // const setValue = (key, value) => {
    //   cache[key] = value;
    //   console.log(this);
    //   return this;
    // };

    this.getValue = getValue;
    this.setValue = setValue;

    // this.getValueFunc = () => {
    // 回傳一個函式，給一個參數(key)取值
    //   return (key) => {
    //     return rawData[key];
    //   };
    // };

    // this.getValue = this.getValueFunc();
    // console.log(this);
  }

  // 能在外面使用的function
  // e.x. console.log(Product.id)
  // getter
  get id() {
    return this.getValue("id");
  }

  // 一般不會改ID，但也是可以做
  // e.x. Product.id = value
  setId(value) {
    return this.setValue("id", value);
  }
}

export default Model;

// const tmp = (() => {
//   console.log(456);
// })();

// tmp();

// setTimeout(tmp(), 1000);

// 自己練習
// class Product {
//     constructor(rawData) {
//       // 方式一
//       const [getValue, setValue] = (() => {
//         const cache = rawData;

//         const getValue = (key) => {
//           return cache[key];
//         };

//         const setValue = (key, value) => {
//           cache[key] = value;
//           return this;
//         };
//         return [getValue, setValue];
//       })();

//       // 方式二
//       // const cache = rawData;
//       // const getValue = (key) => {
//       //   return cache[key];
//       // };
//       // const setValue = (key, value) => {
//       //   cache[key] = value;
//       //   console.log("---------");
//       //   console.log(this);
//       //   console.log("---------");
//       //   //   return this;
//       // };

//       this.getValue = getValue;
//       this.setValue = setValue;
//     }
//     get id() {
//       return this.getValue("id");
//     }
//   }

//   let p1 = new Product({ id: 1, name: "T-shirt" });
//   let p2 = new Product({ id: 2, name: "Cap" });

//   console.log(p1);
//   console.log(p2);

//   p1.id = 3; // X
//   // p1.setValue("id", 3); // O

//   console.log(p1);
//   console.log(p2);
