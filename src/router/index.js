// 导入Vue
import Vue from "vue"
// 导包
import VueRouter from "vue-router"
Vue.use(VueRouter)
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const login = r => require.ensure([], () => r(require('@/components/login')), 'login')
const home = r => require.ensure([], () => r(require('@/components/common/Home')), 'home')
const productTable = r => require.ensure([], () => r(require('@/components/pages/productManage/ProductTable')), 'ProductTable')
const createProduct = r => require.ensure([], () => r(require('@/components/pages/productManage/CreateProduct')), 'CreateProduct')
const stockOutTable = r => require.ensure([], () => r(require('@/components/pages/stockManage/StockOutTable')), 'stockOutTable')
const stockInTable = r => require.ensure([], () => r(require('@/components/pages/stockManage/StockInTable')), 'stockInTable')
const stockDaily = r => require.ensure([], () => r(require('@/components/pages/stockManage/StockDaily')), 'stockDaily')
const roleManage = r => require.ensure([], () => r(require('@/components/pages/systemManage/roleManage/RoleManage')), 'roleManage')
const accountManage = r => require.ensure([], () => r(require('@/components/pages/systemManage/accountManage/AccountManage')), 'accountManage')
// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  // 访问的是 / 打到(重定向)
  {
    path: "/",
    redirect: '/index'
  },
  {
    path: '/',
    component: home,
    meta: { title: '仓储管理' },
    children: [
      {
        path: '/index',
        component: productTable,
        meta: { title: '产品列表' }
      },
      {
        path: '/createProduct',
        component: createProduct,
        meta: { title: '创建产品' }
      },
      {
        path: '/roleManage',
        component: roleManage,
        meta: { title: '角色管理' }
      },
      {
        path: '/accountManage',
        component: accountManage,
        meta: { title: '账号管理' }
      },
      {
        path: '/stockOutTable',
        component: stockOutTable,
        meta: { title: '出库列表' }
      },
      {
        path: '/stockInTable',
        component: stockInTable,
        meta: { title: '入库列表' }
      },
      {
        path: '/stockDaily',
        component: stockDaily,
        meta: { title: '入库日记账' }
      }
    ]
  },
  // 登录页路由
  {
    path: "/login",
    component: login
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router