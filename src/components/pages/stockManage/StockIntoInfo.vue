
<template>
  <div class="stock-into-info content-one">
    <div class="content-header">
      <div class="crumb">
        <img src="../../../assets/img/order-h.png" alt srcset />
        <span class="parent" @click="close">入库列表</span>
        <img src="../../../assets/img/arrow-h.png" alt srcset />
        <span class="current">入库单信息</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="close"></i>
    </div>
    <div class="content-main">
      <div class="item-title">
        <span class="line"></span>
        <span>基本信息</span>
      </div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作人：" v-if="ruleForm.category==1">
              <span>{{userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库编号：">
              <span>{{orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联订单编号：" v-if="saleOrderNo">
              <span>{{saleOrderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库仓：">
              <span>{{sotoreHouseName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型：">
              <span>{{categoryMap[ruleForm.category]||''}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品内容：">
              <el-table
                :data="ruleForm.commodityItemSaveFormList"
                class="detail-table"
                size="small"
              >
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="productNo" label="产品编码"></el-table-column>
                <el-table-column prop="skuNo" label="Sku编码"></el-table-column>
                <el-table-column prop="quantity" label="数量"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="货品来源：">
              <span>{{ruleForm.origin}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <span>{{ruleForm.remark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="buttons">
              <el-button size="small" type="danger" @click="deleteThis">删除</el-button>
              <el-button size="small" type="info" @click="close">返回</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: Number
  },
  data() {
    return {
      storeHouseList: [],
      categoryList: [
        { id: 0, name: '出厂入库' },
        { id: 1, name: '退货入库' },
        { id: 2, name: '移货入库' }
      ],
      userName: '',
      categoryMap: {
        0: '出厂入库',
        1: '退货入库',
        2: '移货入库'
      },
      saleOrderNo: '',
      orderNo: '',
      selectProductId: '',
      productList: [],
      originalProductList: [],
      sotoreHouseName: '',
      ruleForm: {
        commodityItemSaveFormList: [],
        remark: '',
        storehouseId: '',
        category: '',
        origin: ''
      }
    }
  },
  created() {
    this.getDetail()
    this.getproductList()
  },
  methods: {
    async deleteThis() {
      this.$prompt('是否确认删除该入库单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加备注信息'
      })
        .then(async ({ value }) => {
          const url = '/innobeautywms/entryOrder/delete'
          let params = {
            id: this.id,
            closeReason: value
          }
          let res = await this.util.post(url, params)
          if (res.data.status == 0) {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.close()
            }, 1000)
          } else if (res.data.status > 0) {
            this.$message.error(res.data.msg)
          } else {
            this.$message.error('请求错误')
          }
        })
        .catch(() => {})
    },
    async getproductList() {
      const url = '/innobeautywms/productWithStockPile'
      let res = await this.util.get(url)
      if (res.data.status == 0) {
        this.productList = res.data.date
      }
    },
    async getDetail() {
      const url = ` /innobeautywms/entryOrder/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        this.storeHouseList = date.storeHouseVoList
        let stockItem = this.storeHouseList.find(e => e.id == date.storehouseId)
        if (stockItem) {
          this.sotoreHouseName = stockItem.name
        }
        this.ruleForm.remark = date.remark
        this.ruleForm.origin = date.origin
        this.ruleForm.commodityItemSaveFormList =
          date.entryOrderProductWithStockVoList
        this.originalProductList = [...date.entryOrderProductWithStockVoList]
        this.ruleForm.category = date.category
        this.ruleForm.storehouseId = date.storehouseId || ''
        this.saleOrderNo = date.saleOrderNo
        this.orderNo = date.orderNo
        this.userName = date.userName
      }
    },
    async submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) {
          return
        }
        const url = `/innobeautywms/entryOrder/submit`
        let {
          commodityItemSaveFormList,
          remark,
          storehouseId,
          category
        } = this.ruleForm
        let entryOrderItemSaveFormList = commodityItemSaveFormList.map(e => {
          if (e.id) {
            return {
              productId: e.productId,
              quantity: e.quantity,
              id: e.id
            }
          } else {
            return {
              productId: e.productId,
              quantity: e.quantity
            }
          }
        })
        let params = {
          id: this.id,
          remark,
          category,
          storehouseId,
          entryOrderItemSaveFormList
        }
        let res = await this.util.post(url, params)
        let { status } = res.data
        if (status === 0) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.$emit('close')
          }, 1000)
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    async addProduct() {
      let index = this.ruleForm.commodityItemSaveFormList.findIndex(
        e => e.productId == this.selectProductId
      )
      if (index != -1) {
        return
      }
      let hasItem = this.originalProductList.find(
        e => e.productId == this.selectProductId
      )
      if (hasItem) {
        hasItem.quantity = ''
        this.ruleForm.commodityItemSaveFormList.push({ ...hasItem })
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
    handleDelete(index) {
      this.ruleForm.commodityItemSaveFormList.splice(index, 1)
    },
    close() {
      this.$emit('close')
    },
    getStokCanUse(stockPileList) {
      stockPileList = stockPileList.map(e => JSON.parse(e))
      if (this.ruleForm.storehouseId) {
        let item = stockPileList.find(
          e => e.storehouseId === this.ruleForm.storehouseId
        )
        if (item) {
          return item.quantity || 0
        } else {
          return 0
        }
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="less">
.stock-into-info {
  background-color: #fff;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
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
  .form {
    .buttons {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>