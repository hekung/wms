<template>
  <div class="add-account">
    <div class="el-dialog__header">
      <span class="el-dialog__title">新建账号</span>
      <button type="button" aria-label="Close" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </button>
    </div>
    <el-form :model="ruleForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="用户账号："
            prop="account"
            :rules="{required: true, message: '请输入', trigger: 'blur'}"
            style="width:360px;"
          >
            <el-input v-model="ruleForm.open_code" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户姓名：" style="width:360px;">
            <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="用户头像：">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :on-success="onSuccessPC"
              :before-upload="beforeUpload"
              :on-change="onImgChangePC"
              action="/innobeauty/oms/pic/upload"
            >
              <img v-if="imageUrlPC" :src="imageUrlPC" class="avatar" />
              <div v-else style="height:100%;line-height:120px;">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="用户角色："
            prop="role"
            :rules="{required: true, message: '请选择', trigger: 'blur'}"
          >
            <el-select v-model="ruleForm.roleId" placeholder="请选择">
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
      <el-button type="primary" @click="submit">提 交</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
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
    return {
      imageUrlPC: '',
      pcImgFile: '',
      headImg: '',
      roleArr: [{ id: '1', name: '角色1' }],
      ruleForm: {
        open_code: '',
        name: '',
        roleId: ''
      },
      rules: {}
    }
  },
  created() {
    if (this.detail.id) {
      let { open_code, name, headImg, roleName } = this.detail
      this.imageUrlPC = headImg
      this.headImg = headImg
      this.ruleForm = { open_code, name }
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('detailStatus', false)
    },
    onSuccessPC(response, file, fileList) {
      this.imageUrlPC = URL.createObjectURL(file.raw)
      this.headImg = response.url
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
      let url = '/innobeautywms/account'
      let { open_code, name, roleId = '1' } = this.ruleForm
      let headImg = this.headImg
      let id = this.detail.id
      let params = {
        open_code,
        name,
        roleId: '1',
        headImg,
        id
      }
      // if(this.detail.id) {
      //   params.id = (this.detail.id
      // }
      this.util.post(url, params).then(res => {
        if (res.data.success) {
          this.$message.success('账号添加/修改成功')
          this.$emit('detailStatus', false)
        } else {
          this.$message.error(res.data.errMsg)
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
  padding: 20px;
  overflow: auto;
  .avatar-uploader {
    /deep/ .el-upload--text {
      width: 120px;
      height: 120px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>