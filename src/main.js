/*
 * @Date: 2020-09-15 19:37:42
 * @LastEditors: kanoyami
 * @LastEditTime: 2020-09-16 20:35:04
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import {
  Aside, Autocomplete, Badge, Button, Col, ColorPicker, Container, Divider, Form, FormItem, Image,
  Input, Main, Menu, MenuItem, Message, Row, Scrollbar, Slider, Submenu, Switch, TabPane, Tabs, Tooltip
} from 'element-ui'

import App from './App.vue'
import Layout from './layout'
import Home from './views/Home.vue'
import StyleGenerator from './views/StyleGenerator'
import Help from './views/Help'
import Room from './views/Room.vue'
import NotFound from './views/NotFound.vue'

import zh from './lang/zh'
import en from './lang/en'


Vue.use(VueRouter)
Vue.use(VueI18n)
// 初始化element
Vue.use(Aside)
Vue.use(Autocomplete)
Vue.use(Badge)
Vue.use(Button)
Vue.use(Col)
Vue.use(ColorPicker)
Vue.use(Container)
Vue.use(Divider)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Image)
Vue.use(Input)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Row)
Vue.use(Scrollbar)
Vue.use(Slider)
Vue.use(Submenu)
Vue.use(Switch)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Tooltip)
Vue.prototype.$message = Message

Vue.config.ignoredElements = [
  /^yt-/
]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {path: '', component: Home},
        {path: 'stylegen', name: 'stylegen', component: StyleGenerator},
        {path: 'help', name: 'help', component: Help}
      ]
    },
    {path: '/room/:roomId', name: 'room', component: Room},
    {path: '*', component: NotFound}
  ]
})

let locale = window.localStorage.lang
if (!locale) {
  let lang = navigator.language
  if (lang.startsWith('zh')) {
    locale = 'zh'
  } else {
    locale = 'en'
  }
}
const i18n = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages: {
    zh, en
  }
})

new Vue({
  render: h => h(App),
  router,
  i18n
}).$mount('#app')
