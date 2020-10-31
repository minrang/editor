<template>
  <div class="nouo-header">
    <div class="logo" style="flex:1;">
      <span> <i class="mr-nouo"></i>&nbsp;Nouo Editor&nbsp;</span>
      <sup style="color:#ccc">0.1 beta</sup>
    </div>
    <el-dropdown trigger="click" @command="changeLocale">
      <el-button
        class="item"
        style="color:#fff;"
        type="text"
        icon="mr-language"
      ></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
        <el-dropdown-item command="en-US">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-popover placement="bottom" width="160" ref="exit-tips">
      <p>{{ $t('tips.exit') }}</p>
      <div style="text-align: right; margin: 0">
        <el-button
          size="mini"
          type="text"
          @click="$refs['exit-tips'].doClose()"
          >{{ $t('button.cancel') }}</el-button
        >
        <el-button type="primary" size="mini" @click="exit">{{
          $t('button.yes')
        }}</el-button>
      </div>
      <el-button
        style="color:#fff;margin:0 20px;"
        class="item"
        slot="reference"
        type="text"
        icon="mr-power-off"
      ></el-button>
    </el-popover>
  </div>
</template>
<script>
import Vuex from 'vuex'

export default {
  data() {
    return {
      open: ['index'],
    }
  },
  methods: {
    changeLocale(command) {
      this.$i18n.locale = command
      this.$cookie.set('locale', command, {
        expires: 240,
      })
    },
    exit() {
      this.$store.dispatch('account/logout').then(() => {
        this.$router.push('/login')
      })
    },
  },
}
</script>
