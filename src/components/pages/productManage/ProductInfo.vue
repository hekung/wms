<template>
  <div class="product-content">
    <div class="content-header">
      <div class="crumb">
        <span class="parent" @click="cancel">产品列表</span>
        <span class="el-breadcrumb__separator">/</span>
        <span class="current">产品详情</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="cancel"></i>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
      <div class="title">
        <span>基本信息</span>
      </div>
      <el-form-item label="产品名称：" prop="productName">
        <el-input v-model="ruleForm.productName" placeholder="请输入产品名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品编码：" prop="productNo">
        <el-input v-model="ruleForm.productNo" placeholder="请输入产品编码" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品重量(g)：" prop="weight">
        <el-input v-model="ruleForm.weight" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品体积(ml)：" prop="volume">
        <el-input v-model="ruleForm.volume" size="small"></el-input>
      </el-form-item>
      <div class="title">
        <span>仓储信息</span>
      </div>
      <el-col :span="24">
        <el-form-item label="库存明细：">
          <el-table :data="ruleForm.productStockPileFormList" style="width:420px;">
            <el-table-column prop="name" label="所在仓库"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="buttons">
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    id: Number
  },
  data() {
    const validateFixedTo = (rule, value, callback) => {
      const reg = /^(0|[1-9]\d*)(.\d{1,2})?$/
      if (value && !reg.test(String(value).trim())) {
        callback(new Error('请输入正确的数字'))
      } else {
        callback()
      }
    }
    return {
      stockId: '',
      storeHouseList: [],
      ruleForm: {
        productName: '',
        productNo: '',
        weight: '',
        volume: '',
        productStockPileFormList: []
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '请输入产品编码', trigger: 'blur' }
        ],
        weight: [{ validator: validateFixedTo }],
        volume: [{ validator: validateFixedTo }]
      }
    }
  },
  created() {
    this.getStoreHouseList()
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      const url = `/innobeautywms/product/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        let productStockPileFormList = date.productStockPileVoList.map(e => ({
          storehouseId: e.storehouseId,
          name: e.storeHouseName,
          quantity: e.quantity
        }))
        delete date.id
        delete date.productStockPileVoList
        Object.assign(this.ruleForm, date, { productStockPileFormList })
      }
    },
    async getStoreHouseList() {
      const url = '/innobeautywms/storehouse/list'
      let res = await this.util.get(url)
      if (res.data.status == 0) {
        this.storeHouseList = res.data.date
      }
    },
    handleDelete(index) {
      this.ruleForm.productStockPileFormList.splice(index, 1)
    },
    addStoreInfo() {
      let selectItem = this.storeHouseList.find(e => e.id == this.stockId)
      let index = this.ruleForm.productStockPileFormList.findIndex(e => {
        return e.storehouseId == this.stockId
      })
      if (index !== -1) {
        this.$message.error('列表中已存在该仓库')
        return
      }
      this.ruleForm.productStockPileFormList.push({
        storehouseId: this.stockId,
        name: selectItem.name,
        quantity: ''
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.ruleForm.productStockPileFormList.forEach(item => {
          if (!item.quantity) {
            valid = false
            return
          }
        })
        if (!valid) {
          this.$message.error('库存明细缺少数量')
          return
        }
        this.addProduct()
      })
    },
    async addProduct() {
      const url = '/innobeautywms/product'
      let params
      if (!this.id) {
        params = JSON.parse(JSON.stringify(this.ruleForm))
        params.productStockPileFormList.map(e => {
          delete e.name
        })
      } else {
        let { productName, productNo, weight, volume } = this.ruleForm
        params = { productName, productNo, weight, volume, id: this.id }
      }

      let res = await this.util.post(url, params)
      if (res.data.status == 0) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.cancel()
        }, 1000)
      }
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.product-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  position: absolute;
  padding: 40px 40px;
  left: 0;
  top: 0;
  z-index: 10;
  overflow: auto;
  .content-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    .crumb {
      .parent {
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
      }
      .current {
        font-size: 16px;
      }
    }
    .close-btn {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
    }
  }
  .form {
    .title {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .buttons {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>