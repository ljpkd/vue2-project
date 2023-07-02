import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home'
import user from './modules/user'
// 注册vuex
Vue.use(Vuex)

export default new Vuex.Store({
  state:{},
  mutations:{},
  actions:{},
  getters:{},
  modules:{
    home,
    user
  },
})