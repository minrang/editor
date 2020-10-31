'use strict'

import Vue from 'vue'
import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

// _axios.interceptors.request.use(
//   function(config) {
//     // Do something before request is sent
//     return config
//   },
//   function(error) {
//     return Promise.reject(error)
//   }
// )

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (
      error.response.status == 501 &&
      error.response.data == 'No permission'
    ) {
      window.location.href = '/#/login'
    }
    return error.response
  }
)

Plugin.install = function(Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      },
    },
    $axios: {
      get() {
        return _axios
      },
    },
  })
}

Vue.use(Plugin)

export default _axios
