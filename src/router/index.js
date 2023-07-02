import Vue from 'vue'
import VueRouter from 'vue-router'
import './rewriteNavigate'
import Home from '@/views/Home'
import Registe from '@/views/Registe'
import Login from '@/views/Login'
import Search from '@/views/Search'
import Detail from '@/views/Detail'
import AddSuccess from '@/views/AddSuccess'
import Cart from '@/views/Cart'
import Test from '@/views/Test'
// import Pay from '@/views/Pay'
// import PaySuccess from '@/views/PaySuccess'
// import Trade from '@/views/Trade'
import { getToken } from '@/utils/auth'

import store from '@/store'
// 一定要先使用！！！
Vue.use(VueRouter)

// 创建router实例
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/home', component: Home, meta: { isShowTypeNav: true } },
    { path: '/registe', component: Registe, meta: { isHiddenFooter: true } },
    { path: '/login', component: Login, meta: { isHiddenFooter: true } },
    { path: '/search', component: Search, meta: { isShowTypeNav: true } },
    { path: '/detail/:id', component: Detail, meta: { isShowTypeNav: true } },
    {
      path: '/addsuccess',
      component: AddSuccess,
      meta: { isShowTypeNav: false },
    },
    { path: '/cart', component: Cart, meta: { isShowTypeNav: false } },
    { path: '/trade', 
      // 路由懒加载
      component: ()=>import ('@/views/Trade'), 
      meta: { isShowTypeNav: false } ,
      beforeEnter:(to,from,next) => {
        if(from.path==='/cart'){
          next()
        }else{
          next('/home')
        }
      }
  },
    { path: '/pay',
      // 路由懒加载
      component: ()=>import ('@/views/Pay'), 
      meta: { isShowTypeNav: false } ,
      beforeEnter:(to,from,next) => {
        if(from.path === '/trade'){
          next()
        }else{
          next('/home')
        }
      }
    },
    {
      path: '/paysuccess',
      // 路由懒加载
      component: ()=>import ('@/views/PaySuccess'), 
      meta: { isShowTypeNav: false },
    },
    { path: '/test', component: Test },
    { path: '/', redirect: '/home' },
  ],
  scrollBehavior(to, from, savedPosition) {
    // console.log(to,from,savedPosition);
    // savedPosition参数
    // 如果当前是进入了一个全新的路由,那么该参数就是null
    // 如果当前是回退/前进到一个旧的路由,那么该参数就会返回一个对象
    //      对象内部具有x和y两个属性,告知开发者离开之前滚动条的位置

    /* 需求:如果用户进入一个全新路由,那么就需要将滚动条重置为0
          拆解:
              1.如果用户进入一个全新路由
                  可以通过savedPosition参数进行判断
              2.需要将滚动条重置为0
                  当前函数返回值可以控制滚动条到哪里
                  返回一个对象,内部具有x和y属性
      */

    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0,
      }
    }
  },
})

// 通过全局导航守卫实现用户七天免登录功能
// 跳转路由和刷新页面都会先经过全局前置守卫
// 在全局前置守卫里面判断token是否过期，后端返回的状态码是208则说明token过期
// const token = getToken()
// const userInfo = getUserInfo()
// const whitePages = ['/login','/registe']
// 一般分为两个情况，白名单和权限名单，哪个少写哪个
const authList = ['/trade', '/pay', '/paysuccess']
router.beforeEach(async (to, from, next) => {
  // console.log(to);
  const token = getToken()
  const userInfo = store.state.user.userInfo
  if (token) {
    // 进入这里说明已经有token了
    // 继续判断是否有个人信息
    if (userInfo.id) {
      // 有个人信息则直接放行
      next()
    } else {
      // 有token，没有个人信息，那就我们开发者帮用户获取个人信息，免得用户自己去登录
      // console.log('有token,没有个人信息');
      // 这里要捕获一下token过期，
      try {
        await store.dispatch('user/getUserInfo')
        next()
      } catch (e) {
        next('/login')
      }
    }
  } else {
    // 这里是没有token
    if (authList.includes(to.path)) {
      // 没有token，并且是权限名单里面的路径，则直接让用户去登录
      next('/login')
      return
    }
    // 不是权限名单里面的路径，放行
    next()
  }
})

// 导出
export default router
