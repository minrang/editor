<template>
  <el-container>
    <el-header height="45px">
      <NouoHeader></NouoHeader>
    </el-header>
    <el-main>
      <NouoMenu @editSet="editSet" @editGet="editGet" ref="nouo"></NouoMenu>
      <div id="main">
        <NouoToolbar ref="toolbar" @find="find" @format="format"></NouoToolbar>
        <MonacoEditor
          style="width:100%;height:100%;"
          v-model="iEditor.open.content"
          language="javascript"
          :options="options()"
          ref="monaco"
          @editorDidMount="editorDidMount"
        />
      </div>
    </el-main>
    <NouoFooter></NouoFooter>
  </el-container>
</template>
<script>
import Vue from 'vue'
import NouoMenu from './editor/Menu'
import NouoToolbar from './editor/Toolbar'
import NouoHeader from './editor/Header'
import NouoFooter from './editor/Footer'

import MonacoEditor from 'vue-monaco'

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === 'json') {
      return './json.worker.js'
    }
    if (label === 'css') {
      return './css.worker.js'
    }
    if (label === 'html') {
      return './html.worker.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.js'
    }
    return './editor.worker.js'
  },
}
import * as beautifier from 'js-beautify'
import { mapState } from 'vuex'

// Vue.component("NouoMenu", Menu);
// Vue.component("NouoToolbar", Toolbar);
// Vue.component("NouoHeader", Header);
// Vue.component("NouoFooter", Footer);

export default {
  components: {
    MonacoEditor,
    NouoFooter,
    NouoHeader,
    NouoToolbar,
    NouoMenu,
  },
  data() {
    return {
      editor: null,
    }
  },
  computed: {
    iEditor() {
      return this.$store.state.editor
    },
  },
  created() {
    this.$store.dispatch('editor/get_procs')
  },
  methods: {
    options() {
      return {
        readOnly: this.iEditor.open.name === '',
        wordWrap: 'on',
        automaticLayout: true,
        contextmenu: false,
        minimap: {
          enabled: false,
        },
      }
    },
    format() {
      this.editor.setValue(beautifier.js(this.iEditor.open.content))
    },
    find() {
      this.editor.getAction('actions.find').run()
    },
    editSet(scrollTop, position) {
      this.editor.focus()
      this.editor.setScrollTop(scrollTop)
      this.editor.setPosition(position)
    },
    editGet() {
      let ss = {
        scrollTop: this.editor.getScrollTop(),
        position: this.editor.getPosition(),
      }
      Object.assign(ss, this.iEditor.open)
      this.$store.commit('editor/saveNode', ss)
    },
    editorDidMount(editor) {
      this.editor = editor
      // for (var d in editor) {
      //   console.log(d);
      // }
      // console.log();
      editor.onDidChangeCursorPosition((e) => {
        this.iEditor.position = e.position
      })
      document.oncontextmenu = function() {
        return false
      }
      document.addEventListener('keydown', (e) => {
        e = window.event || e
        var keycode = e.keyCode || e.which
        var ctrlKey = e.metaKey || e.ctrlKey
        var altKey = e.altKey
        if (ctrlKey) {
          if (altKey) {
            switch (keycode) {
              case 87: //w
                this.$refs['toolbar'].close()
                break
              case 84: //t
                // this.$refs['toolbar'].test();
                this.editor.focus()
                this.editor.setPosition({ lineNumber: 1, column: 2 })
                break
              default:
                return
            }
          } else {
            switch (keycode) {
              case 83: //s
                this.$refs['toolbar'].save_content()
                break
              default:
                return
            }
          }
          e.preventDefault()
          window.event.returnValue = false
        } else {
          if (keycode === 116) {
            this.$refs['toolbar'].refresh()
          }
        }
      })
    },
  },
}
</script>
