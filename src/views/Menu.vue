<template>
  <el-aside class="nouo-left nouo-menu">
    <div
      style="padding:0 10px;border-bottom: 1px solid #DCDFE6;height:42px;text-align:center;"
    >
      <el-popover placement="top" width="350" ref="pop_schema">
        <div
          class="u-m-b-10 u-text-left u-b u-flex u-f-15"
          style="color:#409EFF;"
        >
          <div class="u-flex-1 u-m-l-10">
            <i class="mr-plus"></i> {{ $t('schema.add') }}
          </div>
          <el-button
            type="primary"
            size="mini"
            @click="
              () => {
                create_schema()
                this.$refs['pop_schema'].doClose()
              }
            "
            >{{ $t('button.yes') }}</el-button
          >
        </div>
        <el-divider class="line"></el-divider>
        <el-form
          :model="new_schema_name"
          ref="schema_new"
          style="margin-top: 10px;"
          :rules="rules"
        >
          <el-form-item prop="name">
            <el-input
              v-model="new_schema_name.name"
              show-word-limit
              :placeholder="$t('schema.name_input')"
            >
              <div slot="prepend">
                {{ $t('schema.name') }}
              </div>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button slot="reference" type="text">
          <i class="mr-plus"></i> {{ $t('schema.add') }}
        </el-button>
      </el-popover>
    </div>
    <el-autocomplete
      clearable
      class="inline-input"
      style="position:fixed;bottom:32px;left:0;"
      v-model="filterText"
      :fetch-suggestions="querySearch"
      prefix-icon="el-icon-search"
      :placeholder="$t('placeholder.search')"
      :trigger-on-focus="false"
    >
    </el-autocomplete>
    <div
      style="position:absolute;top:91px;bottom:85px;overflow:auto;width:299px;"
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
            <span v-if="node.level == 1">
              <i class="mr-database"></i>&nbsp;&nbsp;{{ data.name }}
            </span>
            <el-tooltip
              v-if="node.level == 2"
              class="item"
              effect="light"
              :hide-after="3000"
              placement="bottom"
            >
              <span slot="content">
                <i class="mr-proc"></i>&nbsp;{{ $t('proc.name') }}:
                {{ data.name }}
                <div>
                  <i class="mr-proc"></i>&nbsp;{{ $t('proc.info') }}:
                  <span v-if="data.info">
                    {{ data.info }}
                  </span>
                  <span v-else style="color:#999;">
                    {{ $t('tips.undefined') }}
                  </span>
                </div>
                <div v-if="data.type !== 0">
                  <i class="mr-schema"></i>&nbsp;{{ $t('proc.path') }}:
                  {{
                    '/' +
                      node.parent.data.name +
                      '/' +
                      data.name +
                      (data.type === 2 ? '@' : '.')
                  }}
                </div>
              </span>
              <span> <i class="mr-proc"></i>&nbsp;&nbsp;{{ data.name }} </span>
            </el-tooltip>
            <span>
              <el-popover
                class="hi"
                v-if="node.level === 1"
                placement="right"
                width="350"
                :ref="'pop_new' + node.data.sid"
              >
                <div
                  class="u-m-b-10 u-text-left u-b u-flex u-f-15"
                  style="color:#409EFF;"
                >
                  <div class="u-flex-1 u-m-l-10">
                    <i class="mr-plus"></i> {{ $t('proc.add') }}
                  </div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      () => {
                        create_proc(data)
                        $refs['pop_new' + node.data.sid].doClose()
                      }
                    "
                    >{{ $t('button.add') }}</el-button
                  >
                </div>
                <el-divider class="line"></el-divider>
                <el-form
                  :model="proc_new"
                  ref="newProcForm"
                  style="margin-top: 10px;"
                  :rules="rules"
                >
                  <el-form-item prop="name">
                    <el-input
                      v-model="proc_new.name"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.name_input')"
                    >
                      <el-select
                        v-model="proc_new.type"
                        slot="prepend"
                        style="width:90px;"
                        placeholder="请选择函数类型"
                      >
                        <el-option
                          v-for="item in type_options"
                          :key="item.value"
                          :label="$t(item.label)"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="info">
                    <el-input
                      v-model="proc_new.info"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.info_input')"
                    >
                      <div slot="prepend">
                        {{ $t('proc.info') }}
                      </div>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-tooltip
                  :content="$t('proc.add')"
                  slot="reference"
                  placement="bottom"
                  effect="light"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      () => {
                        add(data)
                        closeTips()
                      }
                    "
                  >
                    <i class="mr-plus"></i>
                  </el-button>
                </el-tooltip>
              </el-popover>
              <el-popover
                class="hi"
                v-if="node.level === 1"
                placement="right"
                width="350"
                :ref="'pop_new' + node.data.sid"
              >
                <div
                  class="u-m-b-10 u-text-left u-b u-flex u-f-15"
                  style="color:#409EFF;"
                >
                  <div class="u-flex-1 u-m-l-10">
                    <i class="mr-plus"></i> {{ $t('proc.add') }}
                  </div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      () => {
                        create_proc(data)
                        $refs['pop_new' + node.data.sid].doClose()
                      }
                    "
                    >{{ $t('button.add') }}</el-button
                  >
                </div>
                <el-divider class="line"></el-divider>
                <el-form
                  :model="proc_new"
                  ref="newProcForm"
                  style="margin-top: 10px;"
                  :rules="rules"
                >
                  <el-form-item prop="name">
                    <el-input
                      v-model="proc_new.name"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.name_input')"
                    >
                      <el-select
                        v-model="proc_new.type"
                        slot="prepend"
                        style="width:90px;"
                        placeholder="请选择函数类型"
                      >
                        <el-option
                          v-for="item in type_options"
                          :key="item.value"
                          :label="$t(item.label)"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="info">
                    <el-input
                      v-model="proc_new.info"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.info_input')"
                    >
                      <div slot="prepend">
                        {{ $t('proc.info') }}
                      </div>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-tooltip
                  :content="$t('proc.add')"
                  slot="reference"
                  placement="bottom"
                  effect="light"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      () => {
                        add(data)
                        closeTips()
                      }
                    "
                  >
                    <i class="mr-cog"></i>
                  </el-button>
                </el-tooltip>
              </el-popover>
              <el-popover
                v-if="node.level === 1"
                placement="right"
                class="hi"
                width="350"
                :ref="'pop_new' + node.data.sid"
              >
                <div
                  class="u-m-b-10 u-text-left u-b u-flex u-f-15"
                  style="color:#409EFF;"
                >
                  <div class="u-flex-1 u-m-l-10">
                    <i class="mr-plus"></i> {{ $t('proc.add') }}
                  </div>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="
                      () => {
                        create_proc(data)
                        $refs['pop_new' + node.data.sid].doClose()
                      }
                    "
                    >{{ $t('button.add') }}</el-button
                  >
                </div>
                <el-divider class="line"></el-divider>
                <el-form
                  :model="proc_new"
                  ref="newProcForm"
                  style="margin-top: 10px;"
                  :rules="rules"
                >
                  <el-form-item prop="name">
                    <el-input
                      v-model="proc_new.name"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.name_input')"
                    >
                      <el-select
                        v-model="proc_new.type"
                        slot="prepend"
                        style="width:90px;"
                        placeholder="请选择函数类型"
                      >
                        <el-option
                          v-for="item in type_options"
                          :key="item.value"
                          :label="$t(item.label)"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="info">
                    <el-input
                      v-model="proc_new.info"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.info_input')"
                    >
                      <div slot="prepend">
                        {{ $t('proc.info') }}
                      </div>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-tooltip
                  :content="$t('proc.add')"
                  slot="reference"
                  placement="bottom"
                  effect="light"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      () => {
                        add(data)
                        closeTips()
                      }
                    "
                  >
                    <i class="mr-delete"></i>
                  </el-button>
                </el-tooltip>
              </el-popover>
              <el-tooltip
                :content="$t('proc.active')"
                placement="bottom"
                effect="light"
              >
                <el-button
                  v-if="
                    node.level === 2 &&
                      proc_open.name === data.name &&
                      proc_open.schema === data.schema
                  "
                  style="color:orange"
                  size="mini"
                  type="text"
                >
                  <i class="mr-desktop"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip
                :content="$t('proc.unsave')"
                v-if="node.level === 2 && data.content !== data.old_content"
                placement="bottom"
                effect="light"
              >
                <el-button size="mini" type="text" style="color:gray">
                  <i class="mr-save"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip
                v-if="node.level === 2 && data.hasOwnProperty('content')"
                :content="$t('proc.cache')"
                placement="bottom"
                effect="light"
              >
                <el-button size="mini" type="text" style="color:gray">
                  <i class="mr-paper-clip"></i>
                </el-button>
              </el-tooltip>
              <el-popover
                v-if="node.level === 2"
                class="hi"
                placement="bottom"
                width="350"
                :ref="'pop_editor' + node.data.pid"
              >
                <div
                  class="u-m-b-10 u-text-left u-b u-flex u-f-15"
                  style="color:#409EFF;"
                >
                  <div class="u-flex-1 u-m-l-10">
                    <i class="mr-cog"></i> {{ $t('proc.config') }}
                  </div>
                  <el-button type="primary" size="mini" @click="save_proc()">{{
                    $t('button.save')
                  }}</el-button>
                </div>
                <el-divider class="line"></el-divider>
                <el-form
                  :model="proc_config"
                  ref="configProcForm"
                  style="margin-top: 10px;"
                  :rules="rules"
                >
                  <el-form-item prop="name">
                    <el-input
                      v-model="proc_config.name"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.name_input')"
                    >
                      <el-select
                        v-model="proc_config.type"
                        slot="prepend"
                        style="width:90px;"
                      >
                        <el-option
                          v-for="item in type_options"
                          :key="item.value"
                          :label="$t(item.label)"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="info">
                    <el-input
                      v-model="proc_config.info"
                      show-word-limit
                      :placeholder="$t('proc.save_proc.info_input')"
                    >
                      <div slot="prepend">
                        {{ $t('proc.info') }}
                      </div>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-tooltip
                  :content="$t('proc.config')"
                  slot="reference"
                  placement="bottom"
                  effect="light"
                >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      () => {
                        rename(node)
                      }
                    "
                  >
                    <i class="mr-cog"></i>
                  </el-button>
                </el-tooltip>
              </el-popover>
              <el-popover
                v-if="node.level === 2"
                placement="top"
                class="hi"
                :ref="'pop' + node.parent.data.sid + data.pid"
              >
                <p
                  v-html="
                    $t('tips.delete_item', { name: data.name, type: data.type })
                  "
                ></p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      () => {
                        $refs['pop' + node.parent.data.sid + data.pid].doClose()
                      }
                    "
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
                <el-tooltip
                  :content="$t('proc.delete')"
                  slot="reference"
                  placement="bottom"
                  effect="light"
                >
                  <el-button size="mini" type="text" @click="closeTips()">
                    <i class="mr-delete"></i>
                  </el-button>
                </el-tooltip>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </el-aside>
</template>
<style scoped>
.el-tree-node__content .hi {
  display: none;
}
.el-tree-node__content:hover .hi {
  display: inline;
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
    rename(node) {
      this.proc_config = {
        pid: node.data.pid,
        name: node.data.name,
        type: node.data.type,
        info: node.data.info,
      }
      this.closeTips()
    },
    add(data) {
      this.proc_new = {
        schema: data.name,
        name: '',
        type: 0,
      }
    },
    save_proc() {
      this.$refs['configProcForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('editor/save_proc', this.proc_config).then(
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
          this.closeTips()
        }
      })
    },
    create_schema(data) {
      this.$refs['schema_new'].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch('editor/create_schema', this.new_schema_name)
            .then(
              (e) => {
                this.new_schema_name.name = ''
                this.$store.dispatch('editor/get_procs')
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
        }
      })
    },
    create_proc(data) {
      this.$refs['newProcForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('editor/create_proc', this.proc_new).then(
            (e) => {
              if (!data.children) {
                this.$set(data, 'children', [])
              }
              let s = {
                pid: e,
              }
              Object.assign(s, this.proc_new)
              data.children.push(s)
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
        }
      })
    },
    closeTips() {
      for (var d in this.$refs) {
        let node = this.$refs[d]
        node.hasOwnProperty('doClose') & node.doClose()
      }
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
          this.proc_open.pid == node.data.pid &&
          node.data.hasOwnProperty('content')
        ) {
          return
        }
        this.$emit('editGet')
        if (node.data.hasOwnProperty('content')) {
          this.$store.commit('editor/init', node.data)
          setTimeout(() => {
            this.$emit('editSet', node.data.scrollTop, node.data.position)
          }, 100)
        } else {
          Object.assign(node.data, {
            schema: node.parent.data.name,
          })
          this.$store.dispatch('editor/get_content', node.data).then(() => {
            this.$message({
              offset: 6,
              duration: 1500,
              message: this.$t('tips.get_content_success', {
                name: node.data.name,
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
            this.closeTips()
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
      new_schema_name: {
        name: '',
      },
      nodeExpandArr: [],
      proc_config: {
        name: '',
        type: 0,
        info: '',
      },
      proc_new: {
        schema: '',
        name: '',
        type: 0,
        info: '',
      },
      filterText: '',
      drag: '',
      defaultProps: {
        children: 'children',
        name: 'name',
      },
      type_options: [
        { label: 'type.private', value: 0 },
        { label: 'type.auth', value: 1 },
        { label: 'type.public', value: 2 },
        { label: 'type.socket', value: 3 },
      ],
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
