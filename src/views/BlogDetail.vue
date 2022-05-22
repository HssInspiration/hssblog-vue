<template>
    <div>
        <Header></Header>
        <div class="mblog">
            <h2> {{ blog.title }}</h2>
            <el-link icon="el-icon-edit" v-if="ownBlog">
                <router-link :to="{name: 'blogEdit', params: {blogId: blog.id}}">
                    编辑
                </router-link>
            </el-link>
            <el-divider></el-divider>
            <tinymce
                    ref="editor"
                    v-model="blog.content"
                    :disabled="true"
                    :toolbar="false"
            />
            <!--            <div class="markdown-body" v-html="blog.content"></div>-->
        </div>
    </div>
</template>

<script>
  import 'github-markdown-css'
  import Header from "../components/Header";
  import tinymce from '../components/Tinymce'

  export default {
    name: "blogDetail.vue",
    components: {Header, tinymce},
    data() {
      return {
        blog: {
          id: "",
          title: "",
          content: ""
        },
        ownBlog: false
      }
    },
    created() {
      const blogId = this.$route.params.blogId
      this.$http.get('/api/blog/' + blogId).then(res => {
        const blog = res.data
        this.blog.id = blog.id
        this.blog.title = blog.title
        // 支持markDown展示
        // let MardownIt = require("markdown-it")
        // let md = new MardownIt()
        this.blog.content = blog.content;//md.render(blog.content)
        this.ownBlog = (blog.userId === this.$store.getters.getUser.id)
      })
    }
  }
</script>

<style scoped>
    .mblog {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        width: 100%;
        min-height: 700px;
        padding: 20px 15px;
    }

</style>
