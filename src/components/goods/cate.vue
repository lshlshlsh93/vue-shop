<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card
      ><el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialogVisible()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        is-fold
      >
        <!-- slot="isok" slot-scope="scope" -->
        <!-- :v-slot:isok='scope' -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag
            type="primary"
            size="mini"
            v-if="scope.row.cat_level === 0"
            effect="light"
          >
            一级
          </el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            effect="light"
          >
            二级
          </el-tag>
          <el-tag type="warning" size="mini" v-else effect="light">
            三级
          </el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="getTheEditList(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDialog(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框显示区域 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addcateRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="selectedParentId">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader
            :options="parentCardList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="handleChangle"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框显示区域 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editCateList"
        label-width="80px"
        :rules="addcateRules"
      >
        <el-form-item label="分类名称" prop="editCat_name">
          <el-input v-model="editCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCartSummit(editCateList)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的验证规则
      addcateRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      queryInfo: {
        // 默认全部显示
        // type=1 --> 只展示一级分类
        // type=2 --> 只展示一二级分类
        // type=2 --> 全部展示
        type: 3,
        // 当前是第几页
        pagenum: 1,
        // 当前每页显示的数量
        pagesize: 4
      },
      // 获取的分类列表
      cateList: [
        {
          cat_id: '',
          cat_name: '',
          cat_pid: '',
          cat_level: '',
          cat_deleted: ''
        }
      ],
      // 总条数据
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      removeDialogVisible: false,
      // 父级分类列表
      parentCardList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
        // expand-trigger="hover"
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 根据id查询到的分类列表
      editCateList: {
        cat_id: '',
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      }
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    // 获取所有分类列表
    async getCardList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCardList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCardList()
    },
    showAddCateDialogVisible() {
      this.getParentCardList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCardList() {
      const { data: res } = await this.$http.get('categories', {
        type: 2
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCardList = res.data
    },
    // 选择项发生变化时触发这个函数
    handleChangle() {
      // console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级节点的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加分类
    addCate() {
      // console.log(this.addcateFrom)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success(result.meta.msg)
        this.addCateDialogVisible = false
        this.getCardList()
      })
    },
    addDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 展示编辑分类对话框
    showEditDialog() {
      this.editCateDialogVisible = true
    },
    async getTheEditList(cate) {
      const { data: res } = await this.$http.get(`categories/${cate.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editCateList = res.data
      this.editCateDialogVisible = true
    },
    // 编辑完成时重置表单并移除验证效果
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    async editCartSummit(list) {
      const { data: res } = await this.$http.put(`categories/${list.cat_id}`, {
        cat_name: list.cat_name
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新数据失败')
      }
      this.$message.success('更新数据成功')
      this.editCateDialogVisible = false
      this.getCardList()
    },
    async removeDialog(cart) {
      const resultConfirm = await this.$confirm(
        '此操作将永久删除' + cart.cat_name + '分类',
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
      const { data: res } = await this.$http.delete(`categories/${cart.cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除分类成功')
      this.getCardList()
    }
  }
}
</script>
<style scoped>
.treeTable {
  margin-top: 15px;
}

el-cascader {
  width: 100%;
}
</style>
