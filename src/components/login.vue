<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域  -->
      <!-- ref引用的值就是表单的引用对象 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="login_form_rules"
      >
        <!-- 用户名 -->
        <!-- 双向数据绑定应该绑定给 el-input的 v-model属性-->
        <!-- 验证规则应该传给 el-form-item的 prop属性-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            props=""
            placeholder="Username"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="Password"
            prefix-icon="iconfont icon-user"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: [
        {
          success: '',
          error: ''
        }
      ],
      // 这是登录表单的数据绑定对象
      loginForm: {
        // 数据属性
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      login_form_rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    handleLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        // console.log(result)
        if (result.meta.status !== 200) {
          this.$message.error(result.meta.msg)
        } else {
          // 登录成功
          this.$message.success(result.meta.msg)

          // 1.将登录成功之后的token存入到客户端的sessionStorage中
          // 1.项目中出了登录之外的其他api接口，必须在登录之后才能访问
          // 1.2token只应该在当前网站打开期间有效，所以将token存在sessionStorage中
          // console.log(result)
          const token = result.data.token
          window.sessionStorage.setItem('token', token)
          // 2. 通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home')
        }
      })
    },
    // 点击重置按钮，重置表单属性，并且移除校验效果
    resetForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
      this.$message.warning('用户点击了重置按钮')
    }
  }
}
</script>
/* lang 大写 */
<style scoped Lang="less">
.login_container {
  background-color: #2b4b6b;
  /* 沾满全屏 */
  height: 100%;
}

/* .login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
} */
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  widows: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 450px;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
