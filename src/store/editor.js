import axios from '../plugins/axios'
export default {
  namespaced: true,
  state: {
    open: {
      old_content: '',
      pid: '1979',
      content: '',
      name: 'Nouo',
      type: 0,
      schema: '',
      scrollTop: 0,
      position: { lineNumber: 1, column: 1 },
      test: [],
    },
    position: { lineNumber: 1, column: 1 },
    readOnly: false,
    menu: [],
  },
  mutations: {
    setMenu(state, menu) {
      state.menu = menu
    },
    init(state, { schema, pid, info, content, name, old_content, type }) {
      state.open.pid = pid
      state.open.info = info
      state.open.content = content
      state.open.old_content = old_content
      state.open.name = name
      state.open.type = type
      state.open.schema = schema
      state.open.test = [
        {
          name: '',
          value: '',
        },
      ]
    },
    async(state) {
      state.open.old_content = state.open.content
    },
    setContent(state, content) {
      state.open.content = content
    },
    setName(state, name) {
      state.open.name = name
    },
    settype(state, type) {
      state.open.type = type
    },
    saveNode(state, node) {
      state.menu = state.menu.map((schema) => {
        if (schema.name === node.schema) {
          state.key = schema.sid
          schema.children = schema.children.map((proc) => {
            if (proc.pid === node.pid && proc.schema === node.schema) {
              return node
            }
            return proc
          })
        }
        return schema
      })
    },
  },
  actions: {
    async get_content({ commit }, proc) {
      let result = false
      let s = {
        schema: proc.schema,
        pid: proc.pid,
      }
      await axios.post('/editor/get_content.', s).then((res) => {
        result = res.status == 200
        if (result) {
          proc.old_content = res.data
          proc.content = res.data
          commit('init', proc)
          commit('saveNode', proc)
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    async save_content({ state, commit }, proc) {
      if (state.open.old_content !== state.open.content) {
        let s = {}
        if (!proc) {
          Object.assign(s, state.open)
        } else {
          Object.assign(s, proc)
        }
        let p = s
        delete s.old_content
        let result = false
        await axios.post('/editor/save_content.', s).then((res) => {
          result = res.status == 200
          if (result) {
            commit('async')
            p.old_content = p.content
            commit('saveNode', p)
          }
        })
        return new Promise(function(resolve, reject) {
          if (result) {
            resolve(result)
          } else {
            reject('error')
          }
        })
      }
    },
    async save_proc({ state, commit, dispatch }, proc) {
      let s = {
        pid: state.open.pid,
        schema: state.open.schema,
      }
      Object.assign(s, proc)
      let result = false
      await axios.post('/editor/save_proc.', s).then(function(res) {
        result = res.status == 200
        if (result) {
          commit('saveNode', s)
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    async create_proc({ state, commit, dispatch }, proc) {
      let result = false
      await axios.post('/editor/create_proc.', proc).then(function(res) {
        if (res.status == 200) {
          result = res.data
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    async create_schema({ state, commit, dispatch }, proc) {
      let result = false
      await axios.post('/editor/create_schema.', proc).then(function(res) {
        if (res.status == 200) {
          result = res.data
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    async remove_proc({ state, commit, dispatch }, proc) {
      let result = false
      await axios.post('/editor/remove_proc.', proc).then(function(res) {
        if (res.status == 200) {
          result = res.data
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    async get_procs({ commit }) {
      let result = false
      await axios.post('/editor/get_procs.').then(function(res) {
        if (res.status == 200) {
          commit('setMenu', res.data)
          result = res.data
        }
      })
      return new Promise(function(resolve, reject) {
        if (result) {
          resolve(result)
        } else {
          reject('error')
        }
      })
    },
    close_proc({ state, commit }, node) {
      let s = {}
      Object.assign(s, state.open)
      s = node || s
      delete s.content
      delete s.old_content
      delete s.position
      delete s.scrollTop
      commit('saveNode', s)
      state.open.pid = '1979'
      state.open.content = ''
      state.open.old_content = ''
    },
  },
  getters: {
    open_proc(state) {
      let tmp_proc_array = []
      state.menu.map((schema) => {
        schema.children.map((v) => {
          if (v.hasOwnProperty('content')) {
            tmp_proc_array.push(v)
          }
        })
      })
      return tmp_proc_array
    },
  },
}
