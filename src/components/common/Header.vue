<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">WMS管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img :src="userInfo.headImgUrl||''" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo?userInfo.name:''}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="bindWeixin" v-if="hasAccessToBind">绑定微信</el-dropdown-item>
            <el-dropdown-item divided command="unBindWeixin" v-if="hasAccessToUnbind">解绑微信</el-dropdown-item>
            <el-dropdown-item divided command="modifyPwd">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="count-order">
      <div class="count-item">
        <span>待审核订单</span>
        <span>{{statistics.saleOrderAuditCount}}</span>
      </div>
      <div class="count-item">
        <span>待出库订单</span>
        <span>{{statistics.shippingCountForWait}}</span>
      </div>
    </div>
    <div class="qr-code" v-if="showQRCode">
      <i class="close-icon" @click="closeQRcode">×</i>
      <img :src="qrcodeSrc" alt srcset class="img-code" />
      <p>扫描二维码绑定微信</p>
    </div>
  </div>
</template>
<script>
import bus from '../common/bus'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      userInfo: JSON.parse(localStorage.getItem('userData')) || {},
      showQRCode: false,
      qrcodeSrc: ''
    }
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData,
      statistics: state => state.order.statistics
    }),
    hasAccessToBind() {
      return this.userInfo.rolesName && !this.userInfo.bindWechat
    },
    hasAccessToUnbind() {
      return this.userInfo.rolesName && this.userInfo.bindWechat
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        let url = '/innobeautywms/auth/logout'
        this.util.get(url).then(res => {
          if (res.data.status == 0) {
            location.reload()
            localStorage.removeItem('userData')
          } else {
            this.$message.error('系统错误')
          }
        })
      }
      if (command == 'modifyPwd') {
        this.$router.push('/resetPwd')
      }
      if (command == 'bindWeixin') {
        this.getQRcode()
      }
      if (command === 'unBindWeixin') {
        this.unBindWexin()
      }
    },
    unBindWexin() {
      const url = `/innobeautywms/weixin/release?userId=${this.userInfo.userId}`
      this.util.post(url).then(res => {
        let { status, msg } = res.data
        if (status == 0) {
          this.$message.success('解绑微信成功')
          this.userInfo.bindWechat = false
          localStorage.setItem('userData', JSON.stringify(this.userInfo))
        } else {
          this.$message.error(msg)
        }
      })
    },
    getQRcode() {
      const url = '/innobeautywms/weixin/getQrcode'
      this.util.get(url).then(res => {
        let { date, status } = res.data
        if (status == 0) {
          this.qrcodeSrc = date
          this.showQRCode = true
        }
      })
    },
    closeQRcode() {
      this.showQRCode = false
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  created() {
    bus.$on('bindWechatStatusChange', isBind => {
      this.userInfo.bindWechat = isBind
      localStorage.setItem('userData', JSON.stringify(this.userInfo))
      if (isBind) {
        this.$message.success('绑定微信成功')
        this.closeQRcode()
      }
    })
  },
  mounted() {
    if (document.body.clientWidth < 1200) {
      this.collapseChage()
    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  background-color: #242f42;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.qr-code {
  padding: 50px;
  background-color: #eee;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  box-shadow: 10px 10px 4px rgba(0, 0, 0, 0.1);
}
.qr-code p {
  color: #333;
  text-align: center;
}
.qr-code .close-icon {
  position: absolute;
  right: -15px;
  top: -15px;
  background-color: #999;
  color: #fff;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  text-align: center;
  cursor: pointer;
  border-radius: 15px;
}
.img-code {
  width: 200px;
  height: 200px;
}
.count-order {
  height: 100%;
  float: right;
  margin-right: 30px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
}
.count-order .count-item {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  justify-content: space-around;
  text-align: center;
}
</style>
