<template>
    <div class="mcontaner">
        <Header></Header>
        <div class="block">
            <el-timeline>
                <el-timeline-item v-for="blog in blogs" :timestamp="blog.created" placement="top">
                    <el-card>
                        <h4>
                            <router-link :to="{name: 'blogDetail', params: {blogId: blog.id}}">
                                {{blog.title}}
                            </router-link>
                        </h4>
                        <p>{{blog.description}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <el-pagination class="mpage"
                           background
                           layout="prev, pager, next"
                           :current-page="currentPage"
                           :page-size="pageSize"
                           :total="total"
                           @current-change=page>
            </el-pagination>

        </div>

    </div>
</template>

<script>
  import Header from "../components/Header";

  export default {
    name: "blogs.vue",
    components: {Header},
    data() {
      return {
        blogs: {},
        currentPage: 1,
        total: 0,
        pageSize: 5
      }
    },
    methods: {
      page(currentPage) {
        let params = {
          currentPage: currentPage
        }
        this.$http.get("/api/blogs", {params: params}).then(res => {
          this.blogs = res.data.records
          this.currentPage = res.data.current
          this.total = res.data.total
          this.pageSize = res.data.size
        })
      }
    },
    created() {
      this.page(1)
    }
  }
</script>

<style scoped>

    .mpage {
        margin: 0 auto;
        text-align: center;
    }

</style>
