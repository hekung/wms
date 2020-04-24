<template>
  <div class="stock-content">
    <div class="content-header">
      <div class="crumb">
        <span class="parent" @click="cancel">入库列表</span>
        <span class="el-breadcrumb__separator">/</span>
        <span class="current">入库单信息</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="cancel"></i>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="form">
      <div class="title">
        <span>基本信息</span>
      </div>
      <el-form-item label="入库编号：">
        <span>{{orderNo}}</span>
      </el-form-item>
      <el-form-item label="关联订单编号：" v-if="saleOrderNo">
        <span>{{saleOrderNo}}</span>
      </el-form-item>
      <el-form-item label="入库仓：">
        <span>{{sotoreHouseName}}</span>
      </el-form-item>
      <el-form-item label="入库类型：">
        <span>{{categoryName}}</span>
      </el-form-item>
      <el-form-item label="产品内容：">
        <el-table :data="ruleForm.commodityItemSaveFormList" style="width:420px;">
          <el-table-column prop="productName" label="内容名称"></el-table-column>
          <el-table-column prop="productNo" label="内容编码"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remark" size="small"></el-input>
      </el-form-item>
      <div class="buttons">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button type="warning" @click="reject">驳回</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    id: Number
  },
  data() {
    const validateProducts = (rule, value, callback) => {
      if (!this.ruleForm.commodityItemSaveFormList.length) {
        callback(new Error('请选择产品'))
      } else {
        callback()
      }
    }
    return {
      selectProductId: '',
      productList: [],
      storeHouseList: [],
      saleOrderNo: '',
      categoryList: [
        { id: 0, name: '出厂入库' },
        { id: 1, name: '退货入库' },
        { id: 2, name: '移货入库' }
      ],
      orderNo: '',
      sotoreHouseName: '',
      categoryName: '',
      ruleForm: {
        commodityItemSaveFormList: [],
        category: '',
        remark: '',
        storehouseId: ''
      }
    }
  },
  created() {
    this.getproductList()
    // this.getStockList()
    this.getDetail()
  },
  methods: {
    async getStockList() {
      const url = `/innobeautywms/storehouseVo`
      try {
        let res = await this.util.get(url)
        let { status, date } = res.data
        if (status == 0) {
          this.storeHouseList = date
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getDetail() {
      const url = ` /innobeautywms/entryOrder/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        this.storeHouseList = date.storeHouseVoList
        this.ruleForm.remark = date.remark
        this.ruleForm.commodityItemSaveFormList =
          date.entryOrderProductWithStockVoList
        this.originalProductList = [...date.entryOrderProductWithStockVoList]
        this.ruleForm.category = date.category
        this.ruleForm.storehouseId = date.storehouseId || ''
        let stockItem = this.storeHouseList.find(e => e.id == date.storehouseId)
        if (stockItem) {
          this.sotoreHouseName = stockItem.name
        }
        this.orderNo = date.orderNo
        let categoryItem = this.categoryList.find(e => e.id == date.category)
        if (categoryItem) {
          this.categoryName = categoryItem.name
        }
        this.saleOrderNo = date.saleOrderNo
      }
    },
    async getproductList() {
      const url = '/innobeautywms/product/list'
      let res = await this.util.get(url)
      if (res.data.status == 0) {
        this.productList = res.data.date
      }
    },
    handleDelete(index) {
      this.ruleForm.commodityItemSaveFormList.splice(index, 1)
    },
    addProduct() {
      let index = this.ruleForm.commodityItemSaveFormList.findIndex(
        e => e.productId == this.selectProductId
      )
      if (index != -1) {
        return
      }
      let item = this.productList.find(e => e.id == this.selectProductId)
      if (!item) {
        this.$message.error('请先选择产品')
        return
      }
      item = Object.assign({}, item)
      item.productId = item.id
      delete item.id
      item.quantity = ''
      this.ruleForm.commodityItemSaveFormList.push(item)
    },
    submitForm() {
      this.createStockIn()
    },
    async reject() {
      this.$prompt('是否确认驳回该入库单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加备注信息'
      })
        .then(async ({ value }) => {
          const url = '/innobeautywms/entryOrder/return/delete'
          let params = {
            id: this.id,
            closeReason: value
          }
          let res = await this.util.post(url, params)
          let { status } = res.data
          if (status === 0) {
            this.$message.success('操作成功')
            setTimeout(() => {
              this.$emit('close')
            }, 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {})
    },
    async createStockIn() {
      const url = '/innobeautywms/entryOrder/return/submit'
      let res = await this.util.post(url, {
        id: this.id,
        remark: this.ruleForm.remark
      })
      let { status } = res.data
      if (status === 0) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.$emit('close')
        }, 1000)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.stock-content {
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
    }
    .buttons {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>