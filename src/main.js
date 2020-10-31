import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/axios'
import i18n from './plugins/i18n'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './scss/common.scss'
import './main.css'
import './mr.icon.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
