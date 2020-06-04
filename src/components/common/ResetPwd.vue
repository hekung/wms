<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>重设密码</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="password">
            <el-input type="password" placeholder="初始密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="newPwd">
            <el-input type="password" placeholder="新密码" v-model="loginForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item prop="cNewPwd">
            <el-input type="password" placeholder="确认新密码" v-model="loginForm.cNewPwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">确认</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    const validateCNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.loginForm.newPwd) {
        callback(new Error('两次新密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      loginForm: {
        username: '',
        password: '',
        newPwd: '',
        cNewPwd: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        cNewPwd: [
          { required: true, validator: validateCNewPwd, trigger: 'blur' }
        ]
      },
      showLogin: true
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.reset()
        } else {
          return false
        }
      })
    },
    closeDialog() {},
    reset() {
      let userData = JSON.parse(localStorage.getItem('userData'))
      let userId = userData.userId
      this.util
        .post('/innobeautywms/user/password', {
          userId: userId,
          oldPassword: this.loginForm.password,
          newPassword: this.loginForm.newPwd
        })
        .then(res => {
          if (res.data && res.data.status == 0) {
            let url = '/innobeautywms/auth/logout'
            this.util.get(url).then(res => {
              if (res.data.status == 0) {
                this.$router.push('/login')
              } else {
                this.$message.error('退出登陆异常')
              }
            })
            localStorage.removeItem('userData')
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style/mixin';
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 300px);
  .ctp(320px, 300px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
