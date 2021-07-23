<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        effect="light"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_option">
        <el-col
          ><span>选择商品分类：</span>
          <!-- 选择商品的级联分类选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="catList"
            :props="cateProps"
            @change="handleChange"
            size="small"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- -->

        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item, index1) in scope.row.attr_vals"
                  :key="index1"
                  closable
                  @close="handleClose(index1, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="width">
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  v-for="(item, index1) in scope.row.attr_vals"
                  :key="index1"
                  closable
                  @close="handleClose(index1, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="width">
            </el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框显示区域 -->
    <!-- 添加 -->
    <el-dialog
      :title="'添加' + dialogTitleName"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addParamsFormClosed"
    >
      <el-form
        status-icon
        ref="addParamsFormRef"
        :model="addParamsForm"
        label-width="80px"
        :rules="addParamsFormRules"
      >
        <el-form-item
          :label="dialogTitleName"
          label-width="80px"
          prop="attr_name"
        >
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑' + dialogTitleName"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editParamsFormClosed"
    >
      <el-form
        status-icon
        ref="editParamsFormRef"
        :model="editParamsForm"
        label-width="80px"
        :rules="editParamsFormRules"
      >
        <el-form-item
          :label="dialogTitleName"
          label-width="80px"
          prop="attr_name"
        >
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类列表
      catList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectedKeys: {},
      // 被激活的页签的的名称
      activeName: 'many',
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: [],
      // 是否显示添加参数对话框
      addParamsDialogVisible: false,
      // 添加动态参数
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数的验证规则
      addParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '参数名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 是否显示编辑对话框
      editDialogVisible: false,
      // 修改的表单数据对象
      editParamsForm: {},
      // 修改的表单数据的验证规则
      editParamsFormRules: {
        attr_name: [
          {
            required: true,
            message: '参数名称不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 默认隐藏输入框
      inputVisible: false,
      // 输入框输入的内容
      inputValue: ''
    }
  },
  created() {
    // 获取所有商品分类列表
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.catList = res.data
    },
    // 级联选择框发生变化触发的事件
    handleChange() {
      this.getCatParms()
    },
    // tab页签
    handleTabClick() {
      // console.log(this.activeName)
      this.getCatParms()
    },
    async getCatParms() {
      // 选择的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selectedKeys)
      // 根据所选的分类id，和所处于的分类面板获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      res.data.forEach(item => {
        // 判断是否为空，如果为空直接返回空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制tag文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      // console.log(res.data)
      // this.$message.success(res.meta.msg)
      // 判断选择的是动态参数还是静态属性
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.addParamsDialogVisible = true
    },
    // 重置表单
    addParamsFormClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.catId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.addParamsDialogVisible = false
        this.getCatParms()
        this.$message.success('添加成功')
      })
    },
    // 显示编辑对话框
    async showEditDialog(edit) {
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes/${edit.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editParamsForm = res.data
      this.editDialogVisible = true
    },
    // 当编辑对话框关闭重置表单
    editParamsFormClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 点击按钮修改参数
    async editParams() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.catId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改成功')
        this.getCatParms()
        this.editDialogVisible = false
      })
    },
    // 点击删除参数按钮时触发的事件
    async removeParams(removeItem) {
      // console.log(removeItem)
      const removeConfirm = await this.$confirm(
        '此操作将删除' + removeItem.attr_name + '参数, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `categories/${this.catId}/attributes/${removeItem.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除参数成功')
      this.getCatParms()
    },
    // 文本框失去焦点或者按下enter键
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //  console.log('ok')
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error()
      }
      this.$message.success('修改参数项成功')
    },
    // 显示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用就是，当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选择的三级分类id
    catId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    dialogTitleName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style scoped>
.cat_option {
  margin: 15px;
}
.input-new-tag {
  width: 120px;
}
</style>
