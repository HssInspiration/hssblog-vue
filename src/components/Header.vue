<template>
    <div class="m-content">
        <h3>欢迎来到Hss的博客</h3>
        <div class="block">
            <el-avatar :size="50" :src="avatar"></el-avatar>
            <div>{{ user.userName }}</div>
        </div>
        <div class="maction">
            <el-link @click="toIndex">主页</el-link>
            <el-divider direction="vertical"></el-divider>
            <span>
              <el-link type="success" @click="add" :disabled="!hasLogin">发表文章</el-link>
            </span>
            <el-divider direction="vertical"></el-divider>
            <span v-show="!hasLogin">
                <el-link type="primary" @click="register">注册</el-link>
            </span>
            <el-divider direction="vertical"></el-divider>
            <span v-show="!hasLogin">
                <el-link type="primary" @click="login">登录</el-link>
            </span>
            <span v-show="hasLogin">
              <el-link type="danger" @click="logout">退出</el-link>
            </span>
        </div>
    </div>
</template>

<script>
  import logo from '../assets/logo.png'
  export default {
    name: "Header",
    data() {
      return {
        avatar: logo,
        hasLogin: false,
        user: {
          userName: '请先登录',
        },
        blogs: {},
        currentPage: 1,
        total: 0
      }
    },
    methods: {
      add(){
        this.$router.push({path: "/blog/add"});
      },
      // 主页
      toIndex() {
        this.$router.push({path: "/blogs"});
      },
      // 注册
      register() {
        this.$router.push({path: "/login", query: {isLogin: "0"}});
      },

      // 登录
      login() {
        this.$router.push({path: "/login", query: {isLogin: "1"}});
      },

      // 退出
      logout() {
        const _this = this
        this.$http.get('/api/logout', {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        }).then((res) => {
          _this.$store.commit('REMOVE_USER_INFO')
          // 退出后清空登录状态
          localStorage.clear()
          _this.$router.push('/login')
        });
      }
    },
    created() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo && (userInfo.userName || userInfo.id)) {
        this.user.userName = userInfo.userName
        this.user.avatar = userInfo.avatar
        this.hasLogin = true
      }
    }
  }
</script>
<style scoped>
    .m-content {
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
    }

    .maction {
        margin: 10px 0;
    }
</style>
