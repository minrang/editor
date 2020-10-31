import Vue from "vue";
import Vuex from "vuex";

import account from "./account";
import editor from "./editor";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    account,
    editor
  }
});
