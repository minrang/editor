import axios from '../plugins/axios'

export default {
  namespaced: true,
  state: {
    account: {
      info: {},
      editor: {},
    },
  },
  actions: {
    async login({ state, commit, rootState }, userinfo) {
      let result = false
      await axios.post('/account/login@', userinfo).then(function(res) {
        result = res.data !== 'error'
        if (result) {
          commit('changeLoginState', true)
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve()
        } else {
          reject()
        }
      })
    },
    async logout({ state, commit, rootState }) {
      let result = false
      await axios.post('/account/logout@').then(function(res) {
        result = res.data !== 'error'
        if (res.data === 'success') {
          commit('changeLoginState', false)
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve()
        } else {
          reject()
        }
      })
    },
  },
}
