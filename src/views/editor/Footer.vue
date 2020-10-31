<template>
  <div
    class="nouo-tag"
    style="background-color: #f8f8f8;border-top: 1px solid #DCDFE6;height:30px;line-height:30px;"
  >
    <span style="width:300px;display:flex;">
      <span v-if="open.pid !== '1979'">
        <span class="item" v-if="open.type !== 0">
          <i class="mr-link"></i>&nbsp;{{ $t('proc.path') }}:&nbsp;{{ path() }}
        </span>
        <span class="item" v-else>
          <i class="mr-link"></i>&nbsp;{{ $t('proc.private') }}
        </span>
      </span>
      <span
        class="item"
        v-if="open.content !== open.old_content"
        style="color:grey;margin-right:20px;"
      >
        <i class="mr-save"></i>&nbsp;{{ $t('proc.unsave_short') }}
      </span>
    </span>
    <span class="title">
      <b class="item" v-if="open.pid === '1979'">
        <i class="mr-wind-cry"></i>&nbsp;{{ $t('tips.not_ready') }}
      </b>
      <b class="item" style="flex:1;" v-else>
        <i class="mr-edit"></i>&nbsp;{{ `${open.schema}.${open.name}` }}
      </b>
      <span class="item" style="flex:1;">
        <i class="mr-flag"></i>&nbsp;{{
          `${open.info || $t('tips.undefined')}`
        }}
      </span>
    </span>
    <span v-html="$t('tips.line_column', position)"></span>
  </div>
</template>
<script>
import Vuex from 'vuex'
export default {
  computed: {
    ...Vuex.mapState('editor', {
      open: (state) => state.open,
      position: (state) => state.position,
    }),
  },
  data() {
    return {}
  },
  methods: {
    path() {
      return `/${this.open.schema}/${this.open.name}${
        this.open.type == 2 ? '@' : '.'
      }`
    },
  },
}
</script>
