import Vue from 'vue'
import App from './App.vue'
import Header from './components/Header'
import Footer from './components/Footer'
import TypeNav from './components/TypeNav'
import Pagination from './components/Pagination'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from '@/router'
import store from '@/store'
import '@/mock'

import * as API from '@/api/index'
// 把所有API放到Vue的原型对象上，这样所有Vue实例对象都能访问到
Vue.prototype.$API = API

Vue.use(ElementUI);

Vue.config.productionTip = false

// 全局事件总线
Vue.prototype.$bus = new Vue()

Vue.component(Header.name,Header),
Vue.component(Footer.name,Footer),
Vue.component(TypeNav.name,TypeNav),
Vue.component(Pagination.name,Pagination),

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
