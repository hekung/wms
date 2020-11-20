<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#242f42"
      text-color="#f2f2f2"
      active-text-color="#ffd04b"
      @select="select"
      unique-opened
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">
                  <div class="menu-item-sub">{{ subItem.title }}</div>
                </template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  <div class="menu-item-sub">{{ threeItem.title }}</div>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.title }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data() {
    return {
      collapse: false,
      userData: JSON.parse(localStorage.getItem('userData')) || {},
      items: [
        {
          index: 'index',
          title: '产品列表',
          icon: 'el-icon-s-grid',
        },
        {
          index: 'createProduct',
          title: '新建产品',
          icon: 'no-icon',
        },
        {
          index: 'stockInTable',
          title: '入库列表',
          icon: 'el-icon-document',
        },
        {
          index: 'createStockIn',
          title: '新建入库单',
          icon: 'no-icon',
        },
        {
          index: 'stockOutTable',
          title: '出库列表',
          icon: 'el-icon-tickets',
        },
        {
          index: 'stockDaily',
          title: '库存统计',
          icon: 'el-icon-edit-outline',
        },
        {
          icon: 'el-icon-user',
          index: 'accountManage',
          title: '账号管理',
        },
      ],
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
    let val = this.userData.rolesName
    if (!val.includes('superAdministrator')) {
      this.items.pop()
    }
  },
  watch: {
    onRoutes(val) {
      bus.$emit('router-change', val)
    },
  },
  methods: {
    select(index) {
      if (index === this.onRoutes) {
        window.location.reload()
      } else {
        this.$router.push({ path: `/${index}` })
      }
    },
  },
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
  width: 200px;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar > ul.el-menu {
  height: 100%;
  border-right: 0 none;
}
.menu-item-sub {
  margin-left: 10px;
}
.no-icon {
  margin-right: 29px;
}
li.el-menu-item.is-active {
  color: burlywood;
}
</style>
