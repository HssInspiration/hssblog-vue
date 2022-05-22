<template>
    <div>
        <Header></Header>
        <div class="m-content">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <el-form-item label="摘要" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <tinymce
                            id="myEdit"
                            ref="editor"
                            v-model="ruleForm.content"
                            :disabled="disabled"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
  import Header from "../components/Header";
  import tinymce from '../components/Tinymce'
  import xss from 'xss'

  export default {
    name: "blogEdit.vue",
    components: {Header, tinymce},
    data() {
      let validRichText = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("内容不能为空"));
        }
        if (value.length > 5000) {
          return callback(new Error("内容不能超过5000字符"));
        }
        // 特殊字符校验
        let pattern = new RegExp("[`~!@#$^*()=|{}'\\[\\].《》]");
        if (pattern.test(value)) {
          return callback(new Error("内容不允许包含以下特殊字符：`~!@#$^*()=|{}'\\[\\].《》"));
        }
        callback();
      }
      return {
        ruleForm: {
          id: '',
          title: '',
          description: '',
          content: ''
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
            {min: 3, max: 25, message: '标题长度在 3 到 25 个字符', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '摘要不能为空', trigger: 'blur'}
          ],
          content: [
            {validator: validRichText, trigger: 'blur'},
          ]
        },
        disabled: false,
        msg: '',
      };
    },
    methods: {
      // 清空内容
      clear() {
        console.log(this.$refs.editor)
        this.$refs.editor.clear()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          try {
            if (valid) {
              const _this = this
              // 博客内容xss过滤
              let options = {
                whiteList: {
                  img: ["src", "title", "target"],
                  p: [],
                  a: ["href"]
                },
              };
              let filterXss = new xss.FilterXSS(options);
              this.ruleForm.content = filterXss.process(this.ruleForm.content);
              this.$http.post('/api/blog/edit', this.ruleForm, {
                headers: {
                  "Authorization": localStorage.getItem("token")
                }
              }).then(res => {
                if (res && res.code === 0) {
                  _this.$alert('操作成功', '提示', {
                    callback: action => {
                      _this.$router.push("/blogs")
                    }
                  });
                } else {
                  _this.$alert('操作失败', '警告', {
                    callback: action => {
                      _this.$router.push("/blogs")
                    }
                  });
                }
              })
            } else {
              this.$alert('操作失败', '警告', {});
              return false;
            }
          } catch (e) {
            this.$alert('操作失败', '警告', {});
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      const blogId = this.$route.params.blogId
      console.log(blogId)
      const _this = this
      if (blogId) {
        this.$http.get('/api/blog/' + blogId).then(res => {
          const blog = res.data
          _this.ruleForm.id = blog.id
          _this.ruleForm.title = blog.title
          _this.ruleForm.description = blog.description
          _this.ruleForm.content = blog.content
        })
      }

    }
  }
</script>

<style scoped>
    .m-content {
        text-align: center;
    }
</style>
