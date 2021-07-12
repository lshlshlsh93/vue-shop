import Vue from 'vue'
import Router from 'vue-router'
// 登录页面
import login from './components/login.vue'
// 主页
import home from './components/home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    { path: '/login', component: login },
    { path: '/home', component: home }
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
