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
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border scrripe height="75vh">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'button_bottom',
                index1 === 0 ? 'button_top' : '',
                'v_center'
              ]"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- <pre>{{ scope.row }}</pre> -->

              <!--渲染一级权限-->
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!-- for循环实现二级权限渲染 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'button_top', 'v_center']"
                  ><el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- for循环实现三级权限渲染 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleDialog(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 对话框显示区域 -->

      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        @close="addRoleDialogClose"
      >
        <el-form
          :rules="addRoleFormRules"
          ref="addRoleRef"
          :model="addRoleForm"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->

      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        :close="editDialogClose"
      >
        <el-form ref="editRoleRef" :model="editRole" label-width="80px">
          <el-form-item label="角色名称" required>
            <el-input v-model="editRole.roleName"></el-input
          ></el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRole.roleDesc"></el-input
          ></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeRole(editRole.roleId)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表
      rolesList: [
        {
          roleName: '',
          roleDesc: ''
        }
      ],
      // 添加角色的表单信息
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 5,
            max: 7,
            message: '角色名称长度在 5 到 7 个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [{ message: '请输入角色描述', trigger: 'blur' }]
      },
      // 是否显示添加角色对话框
      addRoleDialogVisible: false,
      // 是否显示编辑对话框
      editRoleDialogVisible: false,
      // 是否显示删除角色对话框
      removeRoleDialogVisible: false,
      // 是否显示分配权限对话框
      setRightsDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点的id值
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 编辑用户查询到的信息
      editRole: {}
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: result } = await this.$http.get('roles')

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.rolesList = result.data
    },
    // 监听点击添加角色按钮的事件
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          'roles',
          this.addRoleForm
        )
        if (result.meta.status !== 201) {
          this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.addRoleDialogVisible = false
        this.getRolesList()
      })
    },
    // 当添加角色对话框关闭时
    addRoleDialogClose() {
      this.$refs.addRoleRef.resetFields()
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const resultConfirm = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resultConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }

      role.children = result.data
    },
    // 显示删除角色的对话框
    async removeRoleDialog(id) {
      // console.log(id)
      const removeConfirm = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (removeConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: result } = await this.$http.delete('roles/' + id)
      if (result.meta.status !== 200) {
        this.$message.error(result.meta.msg)
      }
      this.$message.error(result.meta.msg)
      this.getRolesList()
    },
    // 显示编辑权限的对话框
    async editRoleDialog(role) {
      // 根据id查询角色
      const { data: res } = await this.$http.get(`roles/${role.id}`)

      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
      }
      this.editRole = res.data
      this.editRoleDialogVisible = true
    },
    // 监听关闭用户编辑角色对话框的事件
    editDialogClose() {
      // 重置表单
      this.$refs.editRoleRef.resetFields()
    },
    // 编辑用户角色提交
    changeRole(id) {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + id, {
          roleName: this.editRole.roleName,
          roleDesc: this.editRole.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editRoleDialogVisible = false
        this.getRolesList()
        this.$message.success('修改角色信息成功')
      })
    },
    // 显示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: result } = await this.$http.get('/rights/tree')

      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.rightsList = result.data
      this.getLefKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 根据递归获取所有三级权限节点的id值，并保存到defKeys中
    getLefKeys(node, arr) {
      // 如果当前node节点不包含节点则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLefKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 点击分配权限确定对话框的事件
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const {
        data: result
      } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin: 7px;
}
.button_top {
  border-top: 1px solid #eee;
}
.button_bottom {
  border-bottom: 1px solid #eee;
}
.v_center {
  display: flex;
  align-items: center;
}
</style>
