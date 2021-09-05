import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        userInfo: ''
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            localStorage.setItem("token", token);
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo;
            sessionStorage.setItem("userInfo", userInfo);
        },
        REMOVE_USER_INFO: (state) => {
            localStorage.setItem("token", "");
            sessionStorage.setItem("userInfo", JSON.stringify(""));
            state.userInfo = {};
        }
    },
    getters: {
        getUser: state => {
            return state.userInfo;
        }
    },
    actions: {},
    modules: {}
})