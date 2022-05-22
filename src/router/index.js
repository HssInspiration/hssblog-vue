import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/Login.vue'
import blogs from '../views/Blogs.vue'
import blogEdit from '../views/BlogEdit.vue'
import blogDetail from '../views/BlogDetail.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'index',
  component: blogs
}, {
  path: '/login',
  name: 'login',
  component: login
}, {
  path: '/blog/add',
  name: 'blogEdit',
  component: blogEdit
}, {
  path: '/blogs',
  name: 'blogs',
  component: blogs
}, {
  path: '/blog/:id',
  name: 'blogDetail',
  component: blogDetail
}, {
  path: '/blog/:blogId/edit',
  name: 'blogEdit',
  component: blogEdit
}]

const router = new VueRouter({
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  // 捕获路由在当前页跳转到当前页的异常
  return originalPush.call(this, location).catch(error => error)
}

export default router
