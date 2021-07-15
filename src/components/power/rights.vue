<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表区域 -->
      <el-table :data="rightsList" height="79.9vh" border stripe>
        <el-table-column type="index" label="#" width="50px"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="width">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="width">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" width="width">
          <template slot-scope="scope">
            <el-tag effect="dark" v-if="scope.row.level === '0'">
              一级
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-else-if="scope.row.level === '1'"
            >
              二级
            </el-tag>
            <el-tag effect="dark" type="warning" v-else>
              三级
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [
        {
          authName: '',
          level: '',
          path: '',
          pid: ''
        }
      ]
    }
  },
  // 生命周期函数
  created() {
    // 获取权限列表
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: result } = await this.$http.get('rights/list')
      // console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.rightsList = result.data
    }
  }
}
</script>
<style scoped></style>
