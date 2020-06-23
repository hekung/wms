import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import product from './modules/product'
import stockIn from './modules/stockIn'
import order from './modules/order'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    product,
    stockIn,
    order
  },
  strict: debug
})