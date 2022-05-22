import axios from 'axios'
import Element from "element-ui";
import store from "../store";
import router from "../router";
import instance from "../main";
// 请求处理
axios.interceptors.request.use(config => {
  // 可以统一设置请求头
  return config
})

// 响应处理
axios.interceptors.response.use(response => {
    console.log("==response: ", response)
    // 当结果的code是否为200的情况
    if (response.status === 200) {
      const res = response.data;
      if (res.code === 0) {
        if (instance.$route.name === 'login') {
          // 将用户信息存入localStorage中防止刷新后需要登录状态丢失
          localStorage.setItem("userInfo", JSON.stringify(res.data))
          instance.$store.commit("SET_TOKEN", response.headers["authorization"]);
          instance.$store.commit("SET_USER_INFO", res.data);
        }
        return res
      } else {
        // 弹窗异常信息
        Element.Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        // 直接拒绝往下面返回结果信息
        return Promise.reject(res.msg);
      }
    } else {
      // 弹窗异常信息
      Element.Message({
        message: "请求失败",
        type: 'error',
        duration: 3 * 1000
      })
      // 直接拒绝往下面返回结果信息
      return Promise.reject();
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    // 根据请求状态判断是否登录或者提示其他
    if (error.response.status === 401) {
      store.commit('REMOVE_USER_INFO');
      router.push({
        path: '/login'
      });
      error.message = '请重新登录';
    }
    if (error.response.status === 403) {
      error.message = '权限不足，无法访问';
    }
    Element.Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  })
