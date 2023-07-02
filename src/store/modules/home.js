const state = {
  categoryList:[]
}

// mutation只能是同步操作
const mutations = {
  SET_CATEGORY_LIST(state,categoryList){
    state.categoryList = categoryList
  }
}

// action不能直接修改state数据，要调用mutation去修改state数据(间接修改)
// action 函数接收一个和store实例具有相同方法和属性的context对象
// 因此可以调用context.commit提交mutation，也可以通过context.state和context.getters来获取state和getters
// 通常会解构commit来简化代码
const actions = {
  async getCategoryList({commit}){
    // await的两个作用
    // 
    const result = await this._vm.$API.home.reqBaseCategoryList()
    // 调用mutations
    commit('SET_CATEGORY_LIST',result.slice(0,15)) // 不包含15
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
