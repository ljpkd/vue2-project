// 引入方法
import { setToken,getToken } from "@/utils/auth"

const state = {
  token:getToken() || '',
  userInfo:{}
}

// mutation只能是同步操作
const mutations = {
  // 设置token
  SET_TOKEN(state,token){
    // console.log(token)
    state.token = token
  },
  // 设置userInfo
  SET_USERINFO(state,userInfo){
    // console.log(userInfo)
    state.userInfo = userInfo
  },
  // 清空userInfo
  REMOVE_USERINFO(state){
    state.userInfo = {}
  },
  // 清空token
  REMOVE_TOKEN(state){
    state.token = ''
  }
}

// action不能直接修改state数据，要调用mutation去修改state数据(间接修改)
// action 函数接收一个和store实例具有相同方法和属性的context对象
// 因此可以调用context.commit提交mutation，也可以通过context.state和context.getters来获取state和getters
// 通常会解构commit来简化代码
const actions = {
  // 发请求，获取token
  async getToken({commit},userInfo){
    // console.log(this._vm);
    const {token} = await this._vm.$API.user.reqGetToken(userInfo)
    // console.log(token);
    // 为了做七天免登陆，要再存一份到localStorage里面
    setToken(token)
    // 拿到token放到state中
    // 要调用mutation
    commit('SET_TOKEN',token)
    
  },
  // 发请求，获取个人信息
  async getUserInfo({commit}){
    const userInfo = await this._vm.$API.user.reqGetUserInfo() || {}
    commit('SET_USERINFO',userInfo)
  }

  // 
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
