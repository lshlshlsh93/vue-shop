import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 按钮组件
Vue.use(Button)
// 表单组件
Vue.use(Form)
// 表单项组件
Vue.use(FormItem)
// 输入框组件
Vue.use(Input)
// 引入弹框提示组件
Vue.prototype.$message = Message
