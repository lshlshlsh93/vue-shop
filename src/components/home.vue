<template>
  <el-container class="home_container">
    <el-header
      ><div>
        <img src="../assets/plant.jpg" alt="" width="50px" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="Collapse ? '64px' : '220px'">
        <div class="toggle_button" @click="toggleCollapse">
          -_-
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="Collapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            active-text-color="#409EFF"
          >
            <!-- 一次菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + Subitem.path"
              v-for="Subitem in item.children"
              :key="Subitem.id"
              @click="saveNavState('/' + Subitem.path)"
            >
              <!-- 二次菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ Subitem.authName }}</span>
              </template></el-menu-item
            >
            <!-- 第二个菜单栏 -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view> </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont  icon-shangpin',
        102: 'iconfont  icon-danju',
        145: 'iconfont  icon-baobiao'
      },
      // 是否折叠
      Collapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    },
    // 获取菜单列表
    async getMenuList() {
      // get返回是promise，简化使用await async
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.menuList = result.data
      // console.log(result)
    },
    // 点击按钮实现侧边菜单栏的折叠与展开
    toggleCollapse() {
      this.Collapse = !this.Collapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 将当前的激活状态地址存入到sessionStorage中
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-right: 17px;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.home_container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
  transition: 0.2s;
}
</style>
