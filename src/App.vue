<template>
  <div id="app" class="fillcontain">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    let username = this.util.getCookie('username')
    if (!username) {
      this.$router.push('/login').catch(() => {})
    } else {
      // 登录操作
      let password = this.util.getCookie('password')
      this.login(username, password)
    }
  },
  methods: {
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
            this.$router.push('/index').catch(() => {})
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
