import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入elementui全局组件
import ElementUI from 'element-ui'

import Crumb from './components/crumb.vue'

// import './plugins/element.js'
// 导入局样式表

import './assets/css/global.css'

// 导入字体图标文件
import './assets/fonts/iconfont.css'

// 挂载axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.use(Crumb)
Vue.component('bread', Crumb)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
