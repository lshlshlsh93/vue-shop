import Vue from 'vue'
import Router from 'vue-router'
// 登录页面
import Login from './components/login.vue'
// 主页
import Home from './components/home.vue'
// 欢迎
import Welcome from './components/welcome.vue'

// 用户
import Users from './components/User/user.vue'

// 权限列表
import Rights from './components/power/rights.vue'

// 角色列表
import Roles from './components/power/roles.vue'

// 商品分类组件
import Goods from './components/goods/goods.vue'

// 商品分类组件
import Rate from './components/goods/cate.vue'

// 商品参数组件
import Params from './components/goods/params.vue'

// 添加商品
import Add from './components/goods/add.vue'

// 订单列表组件
import Orders from './components/orders/order.vue'

// 数据报表
import Report from './components/report/report.vue'

// @ --> src
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    { path: '/login', component: Login },
    {
      // 父路由
      path: '/home',
      component: Home,
      redirect: '/welcome',
      // 子路由
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Rate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径调整
  // next 是一个函数，表示放行
  //  next()放行  next('/login') 强制放行
  // 如果用户访问的是登录页面直接放行
  if (to.path === '/login') {
    return next()
  } else {
    // 获取用户登录的token
    // 正常情况下是从后端拿到token，前端只管token是否存在
    const token = window.sessionStorage.getItem('token')
    if (!token) {
      // 如果没有token，说明用户没有登录，强制跳转回登录页面
      return next('/login')
    } else {
      // 放行
      next()
    }
  }
})

// 导出模块
export default router
