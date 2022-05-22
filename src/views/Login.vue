<!--  -->
<template>
    <div class>
        <el-container>
            <el-main>
                <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="100px"
                        class="demo-ruleForm"
                >
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="ruleForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="register('ruleForm')">注册</el-button>
                        <el-button type="primary" @click="login('ruleForm')">登录</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>
    </div>
</template>

<script>

  import Element from "element-ui";
  import commonUtil from "../common/commonUtil";

  export default {
    components: {},
    data() {
      return {
        isLogin: "",
        ruleForm: {
          userName: "",
          password: ""
        },
        rules: {
          userName: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur"}
          ],
          password: [{required: true, message: "请输入密码", trigger: "change"}]
        }
      };
    },
    computed: {},
    mounted() {
      let loginFlag = this.getParamsFormRoutes("isLogin");
      if (!commonUtil.isEmpty(loginFlag)) {
        this.isLogin = loginFlag
      }
    },
    watch: {},
    methods: {
      getParamsFormRoutes(paramName) {
        return this.$route.query[paramName];
      },

      register(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const _this = this
            let uri = "/api/register";
            let message = "注册成功";
            this.$http
              .post(uri, _this.ruleForm)
              .then(res => {
                console.log("res:", res)
                if (res.code === 0) {
                  // 弹窗异常信息
                  Element.Message({
                    message: message,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  // 注册成功跳转到博客列表首页
                  _this.$router.push("/blogs");
                } else {
                  // 弹窗异常信息
                  Element.Message({
                    message: "登录失败",
                    type: 'error',
                    duration: 3 * 1000
                  })
                }
              });
          } else {
            return false;
          }
        });
      },
      login(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const _this = this
            let uri = "/api/login";
            let message = "登录成功";
            this.$http
              .post(uri, _this.ruleForm)
              .then(res => {
                // 弹窗异常信息
                Element.Message({
                  message: message,
                  type: 'success',
                  duration: 3 * 1000
                })
                // 登陆或注册成功跳转到博客列表首页
                _this.$router.push("/blogs");
              });
          } else {
            return false;
          }
        });
      },

      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  };
</script>
<style lang='scss' scoped>
    .el-header,
    .el-footer {
        background-color: #b3c0d1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #d3dce6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .demo-ruleForm {
        max-width: 500px;
        margin: 0 auto;
    }
</style>
