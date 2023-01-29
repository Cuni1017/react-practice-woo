import * as crypto from "crypto-browserify";
// import { createHmac } from "crypto";
import OAuth from "oauth-1.0a";

class Woo {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  request = (url, method) => {
    const oauth = OAuth({
      consumer: {
        key: this.key,
        secret: this.secret,
      },
      signature_method: "HMAC-SHA256",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha256", key)
          .update(base_string)
          .digest("base64");
      },
    }).authorize({
      url: url,
      method: method,
    });

    var query = Object.keys(oauth)
      .map((key) => {
        const value = oauth[key];
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
      })
      .join("&");

    let newUrl = `${url}?${query}`;

    return fetch(newUrl, { method: method }).then((res) => res.json());
  };
}

export default Woo;
