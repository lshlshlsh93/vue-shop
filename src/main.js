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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 引入axios
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.defaults.timeout = 5000

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
    console.log(error)
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
    console.log(error)
    return Promise.reject(error)
  }
)
// 把axios挂载到vue上 ，使用$http来替换$axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册
Vue.component('tree-table', TreeTable)

// 将富文本编辑器全局注册
Vue.use(VueQuillEditor)

// 定义一个全局的过滤器
Vue.filter('dateFormat', originVal => {
  const date = new Date(originVal)

  // 年
  const year = date.getFullYear()
  // 如果月不足一月就使用0代替
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  // 如果日不足一天就使用0代替
  const day = (date.getDay() + '').padStart(2, '0')
  // 小时
  const hour = (date.getHours() + '').padStart(2, '0')
  // 分钟
  const minutes = (date.getMinutes() + '').padStart(2, '0')
  // 秒数
  const seconds = (date.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
