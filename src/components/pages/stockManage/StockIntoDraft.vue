<template>
  <div class="stock-content content-one">
    <div class="content-header">
      <div class="crumb">
        <img src="../../../assets/img/order-h.png" alt srcset />
        <span class="parent" @click="cancel">入库列表</span>
        <img src="../../../assets/img/arrow-h.png" alt srcset />
        <span class="current">入库单信息</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="cancel"></i>
    </div>
    <div class="content-main">
      <div class="item-title">
        <span class="line"></span>
        <span>基本信息</span>
      </div>
      <el-row>
        <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="form">
          <el-col :span="12">
            <el-form-item label="操作人：" v-if="categoryName=='退货入库'">
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
              <span v-if="ruleForm.category!=2||ruleForm.orderStatus==3">{{sotoreHouseName}}</span>
              <el-select v-else v-model="ruleForm.storehouseId" placeholder="请选择入库仓" size="small">
                <el-option
                  v-for="(item) in storeHouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库类型：">
              <span>{{categoryName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品内容：">
              <el-table
                :data="ruleForm.commodityItemSaveFormList"
                style="width:800px;"
                border
                class="detail-table"
                max-height="360"
                size="mini"
                :summary-method="getSummaries"
                show-summary
              >
                <el-table-column prop="productName" label="产品名称" width="400px"></el-table-column>
                <el-table-column prop="productNo" label="产品编码" width="100px"></el-table-column>
                <el-table-column prop="skuNo" label="Sku编码" width="200px"></el-table-column>
                <el-table-column prop="quantity" label="数量" width="100px"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货品来源：">
              <span>{{ruleForm.origin}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预期到货时间：">
              <span>{{this.$moment(this.ruleForm.expectReceiveTime).format(' YYYY-MM-DD')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input
                v-model="ruleForm.remark"
                size="small"
                v-if="ruleForm.storehouseId!=2 && ruleForm.orderStatus!=3"
              ></el-input>
              <span v-else>{{ruleForm.remark}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="buttons">
              <el-button size="small" type="primary" disabled v-if="ruleForm.orderStatus==3">仓库入库中</el-button>
              <el-button size="small" type="primary" @click="submitForm" v-else>确认</el-button>
              <el-button
                size="small"
                type="warning"
                @click="reject"
                v-if="ruleForm.category==1&&ruleForm.orderStatus==0"
              >驳回</el-button>
              <el-button
                size="small"
                type="danger"
                @click="abolish"
                v-if="ruleForm.orderStatus==3"
              >撤回</el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteThis"
                v-if="ruleForm.category!=1&&ruleForm.orderStatus==0"
              >删除</el-button>
              <el-button size="small" @click="cancel">返回</el-button>
            </div>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: String
  },
  data() {
    return {
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
      userName: '',
      ruleForm: {
        commodityItemSaveFormList: [],
        category: '',
        remark: '',
        storehouseId: '',
        origin: '',
        expectReceiveTime: '',
        orderStatus: '' // 0:'待入库' 1：'已入库'  2：'已取消'   3：'仓库入库中'
      }
    }
  },
  created() {
    this.getproductList()
    this.getStockList()
    this.getDetail()
  },
  watch: {
    id: function() {
      this.getDetail()
    }
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
              this.cancel()
            }, 1000)
          } else if (res.data.status > 0) {
            this.$message.error(res.data.msg)
          } else {
            this.$message.error('请求错误')
          }
        })
        .catch(() => {})
    },
    async abolish() {
      const url = `/innobeautywms/entryOrder/withraw/${this.id}`
      try {
        let res = await this.util.post(url)
        let { status, msg } = res.data
        if (status == 0) {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.$router.push({ path: '/stockInTable' })
          }, 1000)
        } else if (msg) {
          this.$message.error(msg)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计' + '（' + data.length + '）'
          return
        }
        if (index == 3) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        } else {
          sums[index] = '——'
        }
      })

      return sums
    },
    async getDetail() {
      const url = ` /innobeautywms/entryOrder/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        // this.storeHouseList = date.storeHouseVoList
        this.ruleForm.remark = date.remark
        this.ruleForm.origin = date.origin
        this.ruleForm.commodityItemSaveFormList = date.entryOrderItemList
        this.originalProductList = [...date.entryOrderItemList]
        this.ruleForm.category = date.category
        this.ruleForm.storehouseId = date.storehouseId || ''
        this.sotoreHouseName = date.storehouseName
        this.orderNo = date.orderNo
        this.userName = date.userName
        let categoryItem = this.categoryList.find(e => e.id == date.category)
        if (categoryItem) {
          this.categoryName = categoryItem.name
        } else {
          this.categoryName = ''
        }
        this.saleOrderNo = date.saleOrderNo
        this.ruleForm.expectReceiveTime = date.expectReceiveTime
        this.ruleForm.orderStatus = date.orderStatus
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
    submitForm() {
      if (this.ruleForm.category == 2) {
        this.changeStockIn()
      } else if (this.ruleForm.category == 1) {
        this.returnStockIn()
      } else {
        this.outFactoryStockIn()
      }
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
              this.$router.push({ path: '/stockInTable' })
            }, 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {})
    },
    async changeStockIn() {
      this.$confirm('是否确认入库').then(async () => {
        const url = '/innobeautywms/entryOrder/transfer/submit'
        let res = await this.util.post(url, {
          id: this.id,
          remark: this.ruleForm.remark,
          storehouseId: this.ruleForm.storehouseId
        })
        let { status } = res.data
        if (status === 0) {
          if (this.ruleForm.storehouseId == 2) {
            this.$message.success('入库仓为昆山仓，此单将流入第三方系统处理')
          } else {
            this.$message.success('操作成功')
          }
          setTimeout(() => {
            this.$router.push({ path: '/stockInTable' })
          }, 1000)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async returnStockIn() {
      this.$prompt('是否确认入库', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加审核意见'
      }).then(async ({ value }) => {
        const url = '/innobeautywms/entryOrder/return/submit'
        let res = await this.util.post(url, {
          id: this.id,
          remark: this.ruleForm.remark,
          message: value
        })
        let { status } = res.data
        if (status === 0) {
          if (this.ruleForm.storehouseId == 2) {
            this.$message.success('入库仓为昆山仓，此单将流入第三方系统处理')
          } else {
            this.$message.success('操作成功')
          }
          setTimeout(() => {
            this.$router.push({ path: '/stockInTable' })
          }, 1000)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async outFactoryStockIn() {
      this.$confirm('是否确认入库').then(async () => {
        const url = `/innobeautywms/entryOrder/submit/${this.id}`
        let res = await this.util.post(url)
        let { status } = res.data
        if (status === 0) {
          if (this.ruleForm.storehouseId == 2) {
            this.$message.success('入库仓为昆山仓，此单将流入第三方系统处理')
          } else {
            this.$message.success('操作成功')
          }
          setTimeout(() => {
            this.$router.push({ path: '/stockInTable' })
          }, 1000)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/stockInTable' })
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