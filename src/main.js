import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router/index.js'
import './util/plugin.js'
import Util from './util/index.js'
import axios from 'axios'
Vue.prototype.$axios = window.axios = axios  //改变
Vue.prototype.util = new Util()
Vue.config.productionTip = false
// router.beforeEach((to, from, next) => {
//   // ...
//   let util = new Util()
//   let sid = util.getCookie('sid')
//   if (to.path != '/login' && !sid) {
//     next('/login')
//   } else {
//     next()
//   }
// })
new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
