"use strict";

import Vue from "vue";
import type from "./type";
let cookie = (function() {
  var result = [];
  new String(decodeURIComponent(document.cookie)).replace(
    /(\w*)=([^;]*)/g,
    function(m, i, f) {
      result[i] = f;
    }
  );
  return result;
})();
Object.assign(cookie, {
  get: function(name) {
    var values = decodeURIComponent(document.cookie).match(
      new RegExp(name + "=([^;]*)")
    );
    if (values && values.length === 2) {
      return values[1];
    }
  },
  set: function(name, value, attributes) {
    //attributes >>
    // expires intger,
    //  path stirng,
    //  domain string,
    //  secure boolean
    var tmp = [name + "=" + encodeURIComponent(value)];
    if (!type.is.object(attributes)) {
      attributes = {};
    }
    if (type.is.number(attributes["expires"])) {
      var date = new Date();
      var extime = new Date(
        date.setHours(date.getHours() + attributes["expires"])
      ).toUTCString();
      tmp.push("expires=" + extime);
    }
    tmp.push("path=" + attributes["path"]);
    if (type.is.string(attributes["domain"])) {
      tmp.push("domain=" + attributes["domain"]);
    }
    if (!type.is.string(attributes["path"])) {
      attributes["path"] = "/";
    }

    if (type.is.boolean(attributes["secure"]) && attributes["secure"]) {
      tmp.push("secure");
    }
    if (type.is.boolean(attributes["httponly"]) && attributes["httponly"]) {
      tmp.push("httponly");
    }
    document.cookie = tmp.join(";");
    return true;
  },
  setJson: function(name, jsonValue, attributes) {
    var value = JSON.stringify(jsonValue);
    return cookie.set(name, value, attributes);
  },
  getJson: function(name) {
    var result = cookie.get(name);
    return JSON.parse(result);
  },
  remove: function(name, attributes) {
    if (!type.is.object(attributes)) {
      attributes = {};
    }
    Object.assign(attributes, {
      expires: -1
    });
    return cookie.set(name, "", attributes);
  }
});
const Cookie = {
  install(Vue) {
    window.cookie = Vue.cookie = cookie;
    Object.defineProperties(Vue.prototype, {
      $cookie: {
        get() {
          return cookie;
        }
      }
    });
  }
};

Vue.use(Cookie);

export default cookie;
