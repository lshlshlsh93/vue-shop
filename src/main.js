import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'

// 引入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 引入vue-table插件
import TreeTable from 'vue-table-with-tree-grid'

// 引入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置请求拦截器
axios.interceptors.request.use(
  config => {
    // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // Do something before request is sent
    // console.log(config)
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)
// 配置响应拦截器
axios.interceptors.response.use(
  response => {
    // Do something before response is sent
    return response
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)
// 挂载axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
