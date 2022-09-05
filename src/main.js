import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import Print from 'vue-print-nb'
Vue.use(Print)
// import http from './utils/request'
// Vue.prototype.$http = http
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// Vue.directive('imgerror', {
//   // 当指令绑定的元素被插入父元素的时候触发
//   // el: 指令绑定的元素  binding: 参数对象
//   inserted(el, binding) {
//     // console.log(el, binding.value, '8888++')
//     // 当图片标签加载图片失败时触发
//     el.onerror = function() {
//       // console.log('----我被触发了----')
//       el.src = binding.value
//     }
//   }
// })
import * as directives from './directives'

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// 过滤
import * as filters from '@/filters/index'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
console.log(ElementUI, 999) // 是个对象, 有install方法
Vue.use(ElementUI)
import HrsassUI from '@/components'
Vue.use(HrsassUI)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
