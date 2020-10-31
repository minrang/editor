<template>
  <div
    id="nouo-tag"
    class="nouo-tag"
    style="padding:0 10px;border-bottom: 1px solid #DCDFE6;"
  >
    <span class="title">
      <el-popover ref="pop_info" placement="right" width="400">
        <div style="text-align: right; margin: 0;">
          <el-col :span="19">
            <el-input v-model="info">
              <template slot="prepend">{{ open.name }}</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="save_info">
              {{ $t('button.yes') }}
            </el-button>
          </el-col>
        </div>
        <el-button
          slot="reference"
          @click="open_info"
          type="text"
          :disabled="open.pid === '1979'"
        >
          <i class="mr-flag"></i>
          &nbsp;{{ $t('proc.info') }}
        </el-button>
      </el-popover>
      <el-button type="text" :disabled="open.pid === '1979'" @click="refresh">
        <i class="mr-sync"></i>
        &nbsp;{{ $t('button.refresh') }}
      </el-button>
      <el-button
        type="text"
        :disabled="open.pid === '1979'"
        @click="$emit('find')"
      >
        <i class="mr-search"></i>
        &nbsp;{{ $t('button.find') }}
      </el-button>
      <el-button
        type="text"
        :disabled="open.pid === '1979'"
        @click="$emit('format')"
      >
        <i class="mr-format-code"></i>
        &nbsp;{{ $t('button.format') }}
      </el-button>
    </span>
    <el-button
      type="text"
      :disabled="open.pid === '1979' || open.type === 0"
      @click="dialogVisible = true"
    >
      <i class="mr-paper-plane"></i>
      &nbsp;{{ $t('button.test') }}
    </el-button>

    <el-button
      type="text"
      :disabled="open.pid === '1979' || open.old_content === open.content"
      @click="save_content"
    >
      <i class="mr-download"></i>
      &nbsp;{{ $t('button.save') }}
    </el-button>
    <el-popover
      v-if="open.old_content !== open.content"
      placement="left"
      ref="pop_exit"
    >
      <p v-html="$t('tips.unsave')"></p>
      <div style="text-align: right; margin: 0">
        <el-button
          size="mini"
          type="text"
          @click="$refs['pop_exit'].doClose()"
          >{{ $t('button.cancel') }}</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="
            () => {
              $refs['pop_exit'].doClose()
              close()
            }
          "
          >{{ $t('button.yes') }}</el-button
        >
      </div>
      <el-button
        type="text"
        slot="reference"
        :disabled="open.pid === '1979'"
        style="margin-right:20px;"
      >
        <i class="mr-times"></i>
        &nbsp;{{ $t('button.close') }}
      </el-button>
    </el-popover>
    <el-button
      v-else
      type="text"
      :disabled="open.pid === '1979'"
      @click="close"
    >
      <i class="mr-times"></i>
      &nbsp;{{ $t('button.close') }}
    </el-button>
    <el-dialog
      :title="$t('proc.test_proc.title', { name: open.name })"
      :visible.sync="dialogVisible"
      width="90%"
      center
      :close-on-click-modal="false"
    >
      <el-container>
        <el-header
          style="display: flex;padding:0 5px;background-color: #f8f8f8;height: 42px;margin-bottom: 10px;"
        >
          <span class="title">
            <el-button type="text" @click="addItem">
              <i class="mr-plus"></i>
              &nbsp;{{ $t('button.add') }}
            </el-button>
          </span>
          <el-select
            v-model="method"
            size="mini"
            style="width:88px;margin:0 5px;"
          >
            <el-option
              v-for="item in method_options"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-button type="text" :disabled="!testVisible" @click="test">
            <i class="mr-paper-plane"></i>
            &nbsp;{{ $t('button.test') }}
          </el-button>
        </el-header>
        <el-container>
          <el-aside>
            <el-form style="width:300px">
              <el-form-item
                style="margin-bottom:10px;"
                v-bind:key="index"
                v-for="(_, index) in open.test"
              >
                <el-input
                  v-model="open.test[index].name"
                  style="width:100px;"
                  placeholder="请输入项名"
                ></el-input>
                <el-input
                  style="margin-left:5px;width:140px;"
                  v-model="open.test[index].value"
                  placeholder="请输入值"
                ></el-input>
                <el-button type="text" @click="open.test.splice(index, 1)">
                  <i class="mr-delete" style="margin-left:5px;"></i>
                </el-button>
              </el-form-item>
            </el-form>
          </el-aside>
          <el-main style="height:500px;">
            <MonacoEditor
              style="width:100%;height:100%;"
              v-model="editor_value"
              language="json"
              :options="options()"
              @editorDidMount="editorDidMount"
            />
          </el-main>
        </el-container>
      </el-container>
    </el-dialog>
  </div>
</template>
<script>
import Vuex from 'vuex'
import MonacoEditor from 'vue-monaco'
import * as beautifier from 'js-beautify'

export default {
  components: {
    MonacoEditor,
  },
  data() {
    return {
      info: '',
      editor_value: '',
      editor: null,
      dialogVisible: false,
      method: 'POST',
      method_options: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
      testVisible: true,
    }
  },
  computed: {
    ...Vuex.mapState('editor', {
      open: (state) => state.open,
    }),
  },
  methods: {
    open_info() {
      this.info = this.open.info
    },
    save_info() {
      this.$axios
        .post('/editor/save_proc_info.', {
          pid: this.open.pid,
          info: this.info,
        })
        .then((res) => {
          if (res.status == 200) {
            this.open.info = this.info
            this.$refs.pop_info.doClose()
            this.$message({
              offset: 6,
              duration: 1500,
              type: 'success',
              message: this.$t('tips.save_success'),
            })
          }
        })
    },
    addItem() {
      this.open.test.push({
        name: '',
        value: '',
      })
    },
    options() {
      return {
        readOnly: true,
        wordWrap: 'on',
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
      }
    },
    editorDidMount(editor) {
      this.editor = editor
    },
    test() {
      this.testVisible = false
      let config = {
        method: this.method,
        url:
          '/' +
          this.open.schema +
          '/' +
          this.open.name +
          (this.open.type === 2 ? '@' : '.'),
      }

      let params = {}
      this.open.test.map((v) => {
        if (params.hasOwnProperty(v.name)) {
          params[v.name] = [params[v.name]]
          params[v.name].push(v.value)
        } else {
          params[v.name] = v.value
        }
      })

      Object.assign(
        config,
        this.method === 'GET' ? { params } : { data: params }
      )

      this.$axios(config)
        .then(
          (res) => {
            this.editor.setValue(beautifier.js(JSON.stringify(res.data)))
            this.testVisible = true
          },
          (res) => {
            console.log(res)
            this.editor.setValue(beautifier.js(JSON.stringify(res)))
            this.testVisible = true
          }
        )
        .catch((err) => {
          this.editor.setValue(beautifier.js(JSON.stringify(err)))
          this.testVisible = true
        })
    },
    refresh() {
      this.$store.dispatch('editor/get_content', this.open)
      this.$message({
        offset: 6,
        duration: 1500,
        message: this.$t('tips.refresh'),
      })
    },
    save_content() {
      if (this.open.content !== this.open.old_content) {
        this.$store.dispatch('editor/save_content').then(() => {
          this.$message({
            offset: 6,
            duration: 1500,
            message: this.$t('tips.save_success'),
            type: 'success',
          })
        })
      }
    },
    close() {
      this.$store.dispatch('editor/close_proc')
    },
  },
}
</script>
