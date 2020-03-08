<template>
  <div class="create-stock">
    <div class="el-dialog__header">
      <span class="el-dialog__title">新增角色</span>
      <button type="button" aria-label="Close" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </button>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色名称" prop="roleName">
            <el-select v-model="ruleForm.name" placeholder="请选择" style="margin-right:20px;">
              <el-option label="管理员" value="管理员"></el-option>
              <el-option label="产品" value="产品"></el-option>
              <el-option label="技术" value="技术"></el-option>
              <el-option label="运营" value="运营"></el-option>
              <el-option label="代理商" value="代理商"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限配置：" prop="authority">
            <div style="margin:20px 0;padding:20px;border:1px solid #dcdfe6;border-radius:4px;">
              <el-form :model="ruleForm.authority">
                <el-form-item label="商品管理：" prop="productManage">
                  <el-checkbox-group v-model="ruleForm.authority.productManage">
                    <el-checkbox label="商品列表查看" value="a"></el-checkbox>b
                    <el-checkbox label="商品列表编辑/修改" value="b"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="订单管理：" prop="orderManage">
                  <el-checkbox-group v-model="ruleForm.authority.orderManage">
                    <el-checkbox label="销售订单查看" value="a"></el-checkbox>
                    <el-checkbox label="销售订单编辑/修改" value="b"></el-checkbox>
                    <el-checkbox label="修改单价/返佣比例" value="b"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" style="text-align: center;">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created() {
    if (this.detail.id) {
      Object.assign(this.ruleForm, this.detail)
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        account: '',
        authority: {
          productManage: [],
          orderManage: []
        }
      },
      rules: {
        name: [
          { required: true, message: '请选择角色名称', trigger: 'change' }
        ],
        account: [{ required: true, message: '请输入账户名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let url = '/innobeautywms/role'
          this.util.post(url, { name: this.ruleForm.name }).then(res => {
            if (res.data.success) {
              this.$message.success('新增角色成功')
              this.$emit('createStatus', false)
            }
          })
        }
      })
    },
    handleClose() {
      this.$emit('createStatus', false)
    },
    handleDelete(index) {
      this.ruleForm.accountList.splice(index, 1)
    },
    addAccount() {
      this.ruleForm.accountList.unshift({
        isEdit: true,
        level: '',
        account: '',
        tel: '',
        wechat: '',
        payRate: ''
      })
    }
  }
}
</script>
<style lang="less" scoped>
.create-stock {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  padding: 20px;
  overflow: auto;
}
</style>