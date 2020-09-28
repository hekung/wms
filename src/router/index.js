// 导入Vue
import Vue from "vue"
// 导包
import VueRouter from "vue-router"
Vue.use(VueRouter)
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
const login = () => import('@/components/login')
const ResetPwd = () => import('@/components/common/ResetPwd')
const home = () => import('@/components/common/Home')
const productTable = () => import('@/components/pages/productManage/ProductTable')
const productInfo = () => import('@/components/pages/productManage/ProductInfo')
const createProduct = () => import('@/components/pages/productManage/CreateProduct')
const storeHouseTable = () => import('@/components/pages/stockManage/StoreHouseTable')
const stockOutTable = () => import('@/components/pages/stockManage/StockOutTable')
const stockOutInfo = () => import('@/components/pages/stockManage/StockOutInfo')
const stockInTable = () => import('@/components/pages/stockManage/StockInTable')
const createStockIn = () => import('@/components/pages/stockManage/CreateStockIn')
const stockIntoDraft = () => import('@/components/pages/stockManage/StockIntoDraft')
const stockIntoInfo = () => import('@/components/pages/stockManage/StockIntoInfo')

const stockDaily = () => import('@/components/pages/stockManage/StockDaily')
const roleManage = () => import('@/components/pages/systemManage/roleManage/RoleManage')
const accountManage = () => import('@/components/pages/systemManage/accountManage/AccountManage')
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
        meta: { title: '产品列表' },
        children: [
          {
            path: 'info/:id',
            component: productInfo,
            props: true,
            meta: {
              title: '产品详情'
            }
          }
        ]
      },
      {
        path: '/createProduct',
        component: createProduct,
        meta: { title: '新建产品' }
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
        path: '/storeHouseTable',
        component: storeHouseTable,
        meta: { title: '仓库管理' }
      },
      {
        path: '/stockOutTable',
        component: stockOutTable,
        meta: { title: '出库列表' },
        name: 'stockOutTable',
        children: [
          {
            path: 'info/:id',
            component: stockOutInfo,
            name: 'stockOutInfo',
            props: true,
            meta: {
              title: '出库详情'
            }
          }
        ]
      },
      {
        path: '/stockInTable',
        component: stockInTable,
        meta: { title: '入库列表' },
        name: 'stockInTable',
        children: [
          {
            path: 'draft/:id',
            component: stockIntoDraft,
            props: true,
            name: 'stockIntoDraft',
            meta: {
              title: '入库详情'
            }
          },
          {
            path: 'info/:id',
            component: stockIntoInfo,
            name: 'stockIntoInfo',
            props: true,
            meta: {
              title: '入库详情'
            }
          }
        ]
      },
      {
        path: '/createStockIn',
        component: createStockIn,
        meta: { title: '新建入库单' }
      },
      {
        path: '/stockDaily',
        component: stockDaily,
        meta: { title: '库存统计' }
      }
    ]
  },
  // 登录页路由
  {
    path: "/login",
    component: login
  },
  {
    path: '/resetPwd',
    component: ResetPwd,
    meta: { title: '修改密码' }
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router