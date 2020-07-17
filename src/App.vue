<template>
  <div id="app" class="fillcontain">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from './components/common/bus.js'
export default {
  name: 'app',
  data() {
    return {
      timeId: ''
    }
  },
  created() {
    // let username = this.util.getCookie('username')
    // if (!username) {
    //   this.$router.push('/login').catch(() => {})
    // } else {
    //   // 登录操作
    //   let password = this.util.getCookie('password')
    //   this.login(username, password)
    // }
    let sid = this.util.getCookie('sid')
    if (!sid) {
      this.$router.push('/login')
    } else {
      let userData = localStorage.getItem('userData')
      userData = JSON.parse(userData)
      this.$store.commit('user/setUserData', userData)
      this.socketConnect()
    }
    bus.$on('socket-connect', () => {
      this.socketConnect()
    })
  },
  computed: {
    ...mapState({
      userData: state => state.user.userData
    })
  },
  methods: {
    socketConnect() {
      const socket = new WebSocket(
        this.util.getSocketBase() +
          `/innobeautywms/websocket/${this.userData.userId}`
      )
      socket.addEventListener('open', () => {
        socket.send(
          JSON.stringify({
            action: 'getCount'
          })
        )
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => {
          socket.send(
            JSON.stringify({
              action: 'heartbeat'
            })
          )
        }, 25 * 60 * 1000)
      })
      socket.addEventListener('message', event => {
        console.log(event.data)
        if (event.data.includes('shippingCountForWait')) {
          // {shippingCountForWait=6, saleOrderAuditCount=0}
          // let resMessage = event.data.substring(1, event.data.length - 1)
          // let arr = resMessage.split(',')
          // let arr1 = arr[0].split('=')
          // let arr2 = arr[1].split('=')
          // let normalData = {}

          // let attr1 = arr1[0].trim()
          // let attr2 = arr2[0].trim()
          // Object.defineProperty(normalData, attr1, {
          //   value: arr1[1]
          // })
          // Object.defineProperty(normalData, attr2, {
          //   value: arr2[1]
          // })
          this.$store.commit('order/setStatistics', JSON.parse(event.data))
        }
        if (event.data.includes('isBindWechat')) {
          let { isBindWechat } = JSON.parse(event.data)
          bus.$emit('bindWechatStatusChange', isBindWechat)
        }
      })
    },
    login(username, password) {
      this.util
        .postForm('/innobeautywms/auth/login', {
          username: username,
          password: password
        })
        .then(res => {
          if (res.data && res.data.success) {
            this.$store.commit('user/setUserData', res.data.data)
            this.util.setCookie('username', username)
            this.util.setCookie('password', password)
          } else {
            this.$message({
              type: 'error',
              message: res.data.errMsg
            })
          }
        })
    }
  }
}
</script>

<style lang="less">
@import './assets/css/main.css';
</style>
