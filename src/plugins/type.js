"use strict";

import Vue from "vue";

let type = function(obj) {
  if (obj == null) {
    return obj === undefined ? "Undefined" : "Null";
  }
  obj = Object.prototype.toString.call(obj);
  return obj.substring(8, obj.length - 1);
};
Object.assign(type, {
  as: type,
  is: {
    string: function(value) {
      return typeof value == "string" || type.as(value) == "String";
    },
    array: function(value) {
      return type.as(value) == "Array";
    },
    ["array buffer"]: function(value) {
      return type.as(value) == "ArrayBuffer";
    },
    object: function(value) {
      return !!value && typeof value == "object";
    },
    set: function(value) {
      return type.as(value) == "Set";
    },
    map: function(value) {
      return type.as(value) == "Map";
    },
    number: function(value) {
      return typeof value == "number" || type.as(value) == "Number";
    },
    boolean: function(value) {
      return value === true || value === false || type.as(value) == "Boolean";
    },
    date: function(value) {
      return type.as(value) == "Date";
    },
    ["reg exp"]: function(value) {
      return type.as(value) == "RegExp";
    },
    function: function(value) {
      return typeof value == "function" || type.as(value) == "Function";
    },
    bit: function(value) {
      return value === 0 || value === 1;
    },
    hex: function(value) {
      return /^[a-fA-F0-9]+$/.test(value);
    },
    null: function(value) {
      return value == null;
    },
    undefined: function(value) {
      return value === undefined;
    }
  },
  match: function(obj, str) {
    if (type.is.hasOwnProperty(str)) {
      return type.is[str](obj);
    }
    let strArr = str.toLowerCase().split(" ");
    if (strArr.length == 1) {
      if (typeof obj === strArr[0]) {
        return !0;
      }
    }
    str = strArr
      .map(v => {
        return v.charAt(0).toUpperCase() + v.slice(1);
      })
      .join("");
    return type.as(obj) === str;
  },
  object2array: function(obj, cols) {
    var reslut = [];
    for (var i = 0; i < obj.length; i++) {
      reslut.push(obj[i][cols]);
    }
    return reslut;
  },
  arrayBuffer2string: function(ab) {
    if (type.match(ab, "array buffer")) {
      var uint8Arr = new Uint8Array(ab);
      let encodedString = String.fromCharCode.apply(null, uint8Arr);
      return decodeURIComponent(escape(encodedString));
    }
  },
  string2arrayBuffer: function(str) {
    if (type.match(str, "string")) {
      let strRes = unescape(encodeURIComponent(str));
      var ab = new ArrayBuffer(strRes.length);
      var uint8Arr = new Uint8Array(ab);
      for (var i = 0; i < strRes.length; i++) {
        uint8Arr[i] = strRes.charAt(i).charCodeAt();
      }
      return ab;
    }
  },
  arguments2array: function(args) {
    return Array.prototype.splice.call(args, 0, args.length);
  }
});
const Type = {
  install(Vue) {
    window.type = Vue.type = type;
    Object.defineProperties(Vue.prototype, {
      $type: {
        get() {
          return type;
        }
      }
    });
  }
};

Vue.use(Type);

export default type;
