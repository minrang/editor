<template>
  <el-aside class="nouo-left nouo-menu">
    <el-autocomplete
      clearable
      class="inline-input"
      v-model="filterText"
      :fetch-suggestions="querySearch"
      prefix-icon="el-icon-search"
      :placeholder="$t('placeholder.search')"
      :trigger-on-focus="false"
    >
    </el-autocomplete>
    <div
      ref="scroll"
      style="position:absolute;bottom:32px;top:92px;overflow:auto;width:299px;"
    >
      <el-scrollbar>
        <el-tree
          class="filter-tree"
          :data="imenu"
          :props="defaultProps"
          node-key="sid"
          :default-expanded-keys="nodeExpandArr"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          @node-drop="nodeDrop"
          highlight-current
          :draggable="true"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          v-on:node-click="nodeClick"
          ref="tree"
        >
          <span
            class="custom-tree-node"
            v-bind:style="{ color: node.level == 1 ? '#909399' : '#409EFF' }"
            slot-scope="{ node, data }"
          >
            <span>
              <el-dropdown
                v-if="node.level == 2"
                trigger="click"
                placement="right"
                @command="changeType"
                size="mini"
              >
                <el-button
                  class="u-m-r-5"
                  type="text"
                  :title="$t('proc.type')"
                  :style="
                    'color:' +
                      (proc_open.name === data.name &&
                      proc_open.schema === data.schema
                        ? 'orange'
                        : '#409eff')
                  "
                >
                  <i :class="'mr-t' + data.type"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" v-if="data.pid != '1979'">
                  <el-dropdown-item icon="mr-t0" :command="[data, 0]">{{
                    $t('type.t0')
                  }}</el-dropdown-item>
                  <el-dropdown-item icon="mr-t1" :command="[data, 1]">{{
                    $t('type.t1')
                  }}</el-dropdown-item>
                  <el-dropdown-item icon="mr-t2" :command="[data, 2]">{{
                    $t('type.t2')
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <span
                :contenteditable="data == rename_dom"
                :ref="data.pid || data.sid"
                @keypress="enterName"
                :style="
                  data == rename_dom ? 'color:#409eff;font-weight:bold;' : ''
                "
                >{{ data.name }}</span
              >
              <el-button
                :title="$t('proc.unsave')"
                v-if="
                  data != rename_dom &&
                    node.level === 2 &&
                    data.content !== data.old_content
                "
                class="u-m-5"
                size="mini"
                type="text"
                style="color:gray"
              >
                <i class="mr-save"></i>
              </el-button>

              <el-button
                class="u-m-5"
                v-else-if="
                  data != rename_dom &&
                    node.level === 2 &&
                    data.hasOwnProperty('content')
                "
                :title="$t('proc.cache')"
                size="mini"
                type="text"
                style="color:gray"
              >
                <i class="mr-paper-clip"></i>
              </el-button>
            </span>
            <span>
              <i
                class="u-m-5"
                :title="
                  data != rename_dom ? $t('button.rename') : $t('button.submit')
                "
                :class="(data != rename_dom ? 'mr-edit' : 'mr-check') + ' hi'"
                @click="data != rename_dom ? changeName(data) : checkName(data)"
              ></i>

              <el-button
                v-if="node.level === 1 && data.hasOwnProperty('children')"
                :title="$t('proc.add')"
                size="mini"
                type="text"
                @click="add_proc(data)"
              >
                <i class="mr-plus"></i>
              </el-button>
              <el-popover
                placement="right"
                v-if="data.pid != '1979' && node.level === 2"
                :ref="'pop_del' + data.pid"
              >
                <p
                  v-html="
                    $t('tips.delete_item', {
                      name: node.parent.data.name + '.' + data.name,
                      type: $t('type.t' + data.type),
                    })
                  "
                ></p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    type="text"
                    @click="$refs['pop_del' + data.pid].doClose()"
                  >
                    {{ $t('button.cancel') }}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="remove_proc(node, data)"
                  >
                    {{ $t('button.yes') }}
                  </el-button>
                </div>
                <el-button
                  :title="$t('proc.delete')"
                  slot="reference"
                  size="mini"
                  type="text"
                >
                  <i class="mr-delete"></i>
                </el-button>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>

    <span
      @click="add_schema"
      :title="$t('schema.add')"
      class="schema-add-button"
    >
      <i class="mr-plus" style="font-size: 20px;" />
    </span>
  </el-aside>
</template>
<style scoped>
.schema-add-button {
  text-align: center;
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  box-shadow: 0 0 6px rgb(160, 207, 255);
  line-height: 40px;
  position: fixed;
  bottom: 66px;
  left: 130px;
  color: #409eff;
}
.schema-add-button:hover {
  color: rgb(160, 207, 255);
  cursor: pointer;
}
.el-tree-node__content .hi {
  display: none;
}
.el-tree-node__content:hover .hi {
  display: inline;
}

.el-tree-node__content .ih {
  display: inline;
}
.el-tree-node__content:hover .ih {
  display: none;
}
.custom-tree-node span {
  color: #909399;
}
.custom-tree-node:hover span {
  color: #409eff;
}
</style>
<script>
import Vuex from 'vuex'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  create() {
    this.$store.dispatch('editor/get_procs')
  },
  computed: {
    ...Vuex.mapState('editor', {
      proc_open: (state) => state.open,
      imenu: (state) => state.menu,
    }),
  },
  methods: {
    changeName(data) {
      let _val = data.name
      this.rename_dom = data
      setTimeout(() => {
        let obj = this.$refs[data.pid || data.sid]
        var range = document.createRange()
        range.selectNodeContents(obj)
        range.collapse(false)
        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }, 200)
    },
    checkName(data) {
      let isFolder = !data.pid
      if (isFolder) {
        if (!data.hasOwnProperty('children')) {
          this.$store
            .dispatch('editor/create_schema', {
              name: this.$refs[data.sid].innerText,
            })
            .then(
              (e) => {
                this.$store.commit('editor/setMenu', [])
                this.$store.dispatch('editor/get_procs')
              },
              () => {
                this.$message({
                  offset: 6,
                  duration: 1500,
                  type: 'error',
                  message: this.$t('schema.create_error'),
                })
              }
            )
          return
        } else {
          if (this.$refs[data.sid].innerText != data.name) {
            this.$axios
              .post('/editor/save_schema.', {
                name: data.name,
                new_name: this.$refs[data.sid].innerText,
              })
              .then((res) => {
                if (res.status == 200) {
                  data.name = this.$refs[data.sid].innerText
                  this.$message({
                    offset: 6,
                    duration: 1500,
                    type: 'success',
                    message: this.$t('tips.save_success'),
                  })
                  this.rename_dom = null
                }
              })
          }
        }
      } else {
        if (this.$refs[data.pid].innerText != data.name) {
          data.name = this.$refs[data.pid].innerText
          if (data.pid == '1979') {
            this.$store.dispatch('editor/create_proc', data).then(
              (pid) => {
                Object.assign(data, { pid })
                this.$message({
                  offset: 6,
                  duration: 1500,
                  type: 'success',
                  message: this.$t('proc.create_proc.success'),
                })
              },
              () => {
                this.$message({
                  offset: 6,
                  duration: 1500,
                  type: 'error',
                  message: this.$t('proc.create_proc.error'),
                })
              }
            )
          } else {
            this.$store.dispatch('editor/save_proc', data).then(
              () => {
                this.$message({
                  offset: 6,
                  duration: 1500,
                  type: 'success',
                  message: this.$t('proc.save_proc.success'),
                })
              },
              () => {
                this.$message({
                  offset: 6,
                  duration: 1500,
                  type: 'error',
                  message: this.$t('proc.save_proc.error'),
                })
              }
            )
          }
        }
      }
      this.rename_dom = null
    },
    enterName(e) {
      if (e.keyCode == 13) {
        e.returnValue = false
        this.checkName(this.rename_dom)
      }
    },
    add_proc(data) {
      this.imenu.map((v) => {
        if (v.children)
          v.children = v.children.filter((vv) => vv.pid !== '1979')
        if (data == v) {
          this.rename_dom = {
            schema: data.name,
            info: '',
            name: 'new_function_name',
            pid: '1979',
            type: 0,
          }
          this.nodeExpandArr = this.nodeExpandArr.filter((vv) => vv != v.name)
          this.nodeExpandArr.push(v.sid)
          v.children.unshift(this.rename_dom)
          this.changeName(this.rename_dom)
        }
      })
    },
    add_schema() {
      if (this.imenu.filter((v) => !v.hasOwnProperty('children')).length > 0) {
        return
      }
      let sid = this.imenu.length
      this.rename_dom = {
        name: 'noname',
        sid,
      }
      this.imenu.push(this.rename_dom)
      this.changeName(this.rename_dom)
      setTimeout(() => {
        let sEL = this.$refs.scroll
        sEL.scrollTop = sEL.scrollHeight
      }, 200)
    },
    querySearch(queryString, cb) {
      if (queryString.indexOf(':') === 0) {
        const result = [
          { value: ':open', action: 'open' },
          { value: ':unsave', action: 'unsave' },
          { value: ':history', action: 'open' },
          { value: ':new 10', action: 'open' },
        ]
        cb(result)
      } else {
        cb([])
      }
    },
    changeType([data, i]) {
      if (data.type != i) {
        this.$axios
          .post('/editor/change_proc_type.', { type: i, pid: data.pid })
          .then((res) => {
            if (res.status == 200) {
              data.type = i
              this.proc_open.type = i
              this.$message({
                offset: 6,
                duration: 1500,
                type: 'success',
                message: this.$t('proc.save_proc.success'),
              })
            }
          })
      }
    },
    allowDrag(node) {
      return node.level == 2
    },
    allowDrop(draggingNode, dropNode, type) {
      let nodes = null
      let r = false
      if (dropNode.level == 1 && type == 'inner') {
        nodes = dropNode
      } else if (dropNode.level == 2 && type != 'inner') {
        nodes = dropNode.parent
      }
      if (nodes) {
        r = true
        if (nodes != draggingNode.parent) {
          nodes.childNodes.map((v) => {
            if (v.data.name == draggingNode.data.name) {
              r = false
            }
          })
        }
      }
      return r
    },
    nodeDrop(draggingNode, dropNode, type) {
      let config = {}
      if (dropNode.level == 1) {
        let schema = dropNode.data.name
        let id = draggingNode.data.pid
        let count = dropNode.childNodes.length - 1
        config = { count, schema, id }
      } else {
        let arr = []
        dropNode.parent.childNodes.map((v) => {
          arr.push(v.data.pid)
        })
        let schema = dropNode.parent.data.name
        let id = draggingNode.data.pid
        config = { arr, schema, id }
      }
      this.$axios.post('/editor/sort_proc.', config).then((v) => {
        if (v.status == 200) {
          this.$message({
            offset: 6,
            duration: 1500,
            type: 'success',
            message: this.$t('proc.sort_proc.success'),
          })
        } else {
          this.$message({
            offset: 6,
            duration: 1500,
            type: 'error',
            message: this.$t('proc.sort_proc.error'),
          })
        }
      })
    },
    nodeExpand(data, node, ele) {
      this.$set(ele, 'expanded', true)
      if (node.expanded) {
        this.nodeExpandArr.push(data.sid)
        this.nodeExpandArr = Array.from(new Set(this.nodeExpandArr))
      }
    },
    nodeCollapse(data, node, ele) {
      if (this.nodeExpandArr.length > 0) {
        for (var i = 0; i < this.nodeExpandArr.length; i++) {
          if (this.nodeExpandArr[i] == data.sid) {
            this.nodeExpandArr.splice(i, 1)
            this.$set(ele, 'expanded', false)
          }
        }
      }
    },
    nodeClick(data, node, tree) {
      if (node.level === 1) {
        this.$refs.tree.setCurrentKey(null)
      } else {
        if (
          this.rename_dom &&
          this.rename_dom.pid == '1979' &&
          data.pid != '1979'
        ) {
          this.imenu.map((v) => {
            v.children = v.children.filter((vv) => vv.pid != '1979')
          })
        }
        if (data == this.rename_dom || data.pid == '1979') {
          return
        } else {
          this.rename_dom = null
        }
        if (this.proc_open.pid == data.pid && data.hasOwnProperty('content')) {
          return
        }
        this.$emit('editGet')
        if (data.hasOwnProperty('content')) {
          this.$store.commit('editor/init', data)
          setTimeout(() => {
            this.$emit('editSet', data.scrollTop, data.position)
          }, 100)
        } else {
          Object.assign(data, {
            schema: node.parent.data.name,
          })
          this.$store.dispatch('editor/get_content', data).then(() => {
            this.$message({
              offset: 6,
              duration: 1500,
              message: this.$t('tips.get_content_success', {
                name: data.name,
              }),
            })
          })
        }
      }
    },
    filterNode(value, data, node) {
      if (!value) return true
      if (node.parent.level > 0) {
        if (node.parent.data.name.indexOf(value) > -1) {
          return !0
        }
        if (data.content && data.content.indexOf(value) > -1) {
          return !0
        }
        if (data.info && data.info.indexOf(value) > -1) {
          return !0
        }
      }
      return data.name.indexOf(value) !== -1
    },
    remove_proc(node, data) {
      this.$store
        .dispatch('editor/remove_proc', {
          schema: node.parent.data.name,
          pid: data.pid,
        })
        .then(
          (e) => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.pid === data.pid)
            children.splice(index, 1)
            this.$message({
              offset: 6,
              duration: 1500,
              type: 'success',
              message: this.$t('proc.remove_proc.success'),
            })
            this.imenu.map((v) => {
              if (v.children.length == 0) {
                this.imenu.splice(v.sid, 1)
              }
            })
          },
          () => {
            this.$message({
              offset: 6,
              duration: 1500,
              type: 'error',
              message: this.$t('proc.remove_proc.error'),
            })
          }
        )
    },
  },
  data() {
    return {
      rename_dom: null,
      nodeExpandArr: [],
      filterText: '',
      drag: '',
      defaultProps: {
        children: 'children',
        name: 'name',
      },
      rules: {
        name: [
          {
            type: 'string',
            required: true,
            message: this.$t('tips.proc_name_require'),
          },
          {
            pattern: /^[a-z_0-9]*$/,
            message: this.$t('tips.proc_name_format'),
          },
        ],
      },
    }
  },
}
</script>
