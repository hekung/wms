<template>
  <div class="add-account content-one">
    <div class="content-header">
      <div class="crumb">
        <img src="../../../../assets/img/order-h.png" alt srcset />
        <span class="parent" @click="handleClose">账号管理</span>
        <img src="../../../../assets/img/arrow-h.png" alt srcset />
        <span class="current">账号信息</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="handleClose"></i>
    </div>
    <div class="content-main">
      <div class="item-title">
        <span class="line"></span>
        <span>所有信息</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" label-width="120px" ref="ruleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户账号：" prop="open_code" style="width:360px;">
              <el-input v-model="ruleForm.open_code" size="small" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户姓名：" style="width:360px;" prop="name">
              <el-input v-model="ruleForm.name" size="small" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户头像：" prop="headImg">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="onSuccessPC"
                :before-upload="beforeUpload"
                :on-change="onImgChangePC"
                action="/innobeautywms/imgUpload"
              >
                <img v-if="imageUrlPC" :src="imageUrlPC" class="avatar" />
                <div v-else style="height:100%;line-height:120px;">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户角色：" prop="roleId">
              <el-select v-model="ruleForm.roleId" size="small" placeholder="请选择">
                <el-option
                  v-for="(item) in roleArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button size="small" type="primary" @click="submit">提 交</el-button>
        <el-button size="small" @click="$emit('detailStatus', false)">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    addChildAccountVisible: {
      type: Boolean,
      default() {
        return false
      }
    },
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const validateAccount = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]+$/
      if (!value) {
        callback(new Error('请输入账号名称'))
      }
      if (!reg.test(String(value).trim())) {
        callback(new Error('账号名称只能为字母和数字'))
      } else {
        callback()
      }
    }
    const validateImg = (rule, value, callback) => {
      if (!this.headImg) {
        callback(new Error('请上传头像'))
      } else {
        callback()
      }
    }
    return {
      imageUrlPC: '',
      pcImgFile: '',
      headImg: '',
      roleArr: [{ id: 1, name: '管理员' }],
      ruleForm: {
        open_code: '',
        name: '',
        roleId: '',
        account: ''
      },
      rules: {
        open_code: [
          {
            validator: validateAccount,
            required: true
          }
        ],
        headImg: [
          {
            validator: validateImg,
            required: true,
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入账号姓名',
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色'
          }
        ]
      }
    }
  },
  created() {
    if (this.detail.id) {
      let { open_code, name, headImg, roleName, roleId } = this.detail
      this.imageUrlPC = headImg
      this.headImg = headImg
      this.ruleForm = { open_code, name, roleId }
    }
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      let url = '/innobeautywms/role/list'
      this.util.get(url).then(res => {
        let { date, status } = res.data
        if (status === 0) {
          this.roleArr = date
        }
      })
    },
    handleClose(done) {
      this.$emit('detailStatus', false)
    },
    onSuccessPC(response, file, fileList) {
      this.imageUrlPC = URL.createObjectURL(file.raw)
      this.headImg = response.date
    },
    beforeUpload(file) {
      const isJPG = /(gif|jpg|jpeg|png|GIF|JPG|PNG|SVG|svg)$/.test(file.type)
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        this.$message.error('只能是图片格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      // 禁止自动上传
      if (!isJPG || !isLt3M) {
        return false
      }
    },
    onImgChangePC(file, fileList) {
      this.pcImgFile = file.raw
      this.imageUrlPC = URL.createObjectURL(file.raw)
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url = '/innobeautywms/account'
          let { open_code, name, roleId } = this.ruleForm
          let headImg = this.headImg
          let id = this.detail.id
          let params = {
            open_code,
            name,
            roleId,
            headImg,
            id
          }
          if (this.detail.id) {
            params.id = this.detail.id
          }
          this.util.post(url, params).then(res => {
            if (res.data.status == 0) {
              this.$message.success('账号添加/修改成功')
              this.$emit('detailStatus', false)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.add-account {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  padding-top: 60px;
  overflow: hidden;
  .content-header {
    height: 60px;
    line-height: 60px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    box-shadow: 0px 1px 0px 0px rgba(240, 240, 240, 1);
    .crumb {
      display: flex;
      align-items: center;
      .parent {
        font-size: 14px;
        font-weight: bold;
        color: rgba(50, 65, 87, 1);
        cursor: pointer;
        margin-left: 10px;
      }
      .current {
        font-size: 14px;
        font-weight: bold;
        color: rgba(50, 65, 87, 1);
      }
    }
    .close-btn {
      cursor: pointer;
    }
  }
  .avatar-uploader {
    /deep/ .el-upload--text {
      width: 120px;
      height: 120px;
      border: 1px dashed #d9d9d9;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>