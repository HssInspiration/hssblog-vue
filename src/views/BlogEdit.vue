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
                    <!--                    <mavon-editor v-model="ruleForm.content"></mavon-editor>-->
                    <tinymce
                            id="myedit"
                            ref="editor"
                            v-model="ruleForm.content"
                            :disabled="disabled"
                            @onClick="onClick"
                    />
                    <!--                    <button @click="clear">清空内容</button>-->
                    <!--                    <button @click="disabled = true">禁用</button>-->
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
        console.log("=============1233")
        let options = {
          whiteList: {
            img: ["src", "title", "target"],
            p: [],
            a: ["href"]
          },
        };
        let filterXss = new xss.FilterXSS(options);
        console.log("filterXss: ", filterXss);
        let filterContent = filterXss.process(value);
        console.log("filterContent: ", filterContent);
        return true;
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
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入摘要', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', validator: validRichText, trigger: 'blur'}
            // {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        },
        disabled: false,
        msg: '',
      };
    },
    methods: {
      // 内容
      getContent() {
        console.log('内容', this.msg)
      },
      // 鼠标单击的事件
      onClick(e, editor) {
        console.log('Element clicked')
        console.log(e)
        console.log(editor)
      },
      // 清空内容
      clear() {
        console.log(this.$refs.editor)
        this.$refs.editor.clear()
      },
      validateContent(content) {
        console.log("=============content is :", content)
        let options = {
          whiteList: {
            img: ["src", "title", "target"]
          },
        };
        let filterXss = new xss.FilterXSS(options);
        let filterContent = filterXss.process(content);
        console.log("=============filterContent is :", filterContent)
      },

      submitForm(formName) {
        console.log("fromName: ",formName)
        this.$refs[formName].validate((valid) => {
          try {
            if (valid) {
              const _this = this
              this.$http.post('/api/blog/edit', this.ruleForm, {
                headers: {
                  "Authorization": localStorage.getItem("token")
                }
              }).then(res => {
                _this.$alert('操作成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.$router.push("/blogs")
                  }
                });
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          } catch (e) {
            console.log("error is : ", e)
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
          const blog = res.data.data
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
