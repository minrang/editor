'use strict'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cookie from '../plugins/cookie'

Vue.use(VueI18n)

export default new VueI18n({
  locale: cookie.get('locale') || 'en-US',
  messages: {
    'zh-CN': require('../i18n/zh_CN.json'), // 简体中文包
    'en-US': require('../i18n/en_US.json'), // 英语包
  },
})
