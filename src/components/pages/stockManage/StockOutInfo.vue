<template>
  <div class="stock-out-info content-one">
    <div class="content-header">
      <div class="crumb">
        <img src="../../../assets/img/order-h.png" alt srcset />
        <span class="parent" @click="close">出库列表</span>
        <img src="../../../assets/img/arrow-h.png" alt srcset />
        <span class="current">出库单信息</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="close"></i>
    </div>
    <div class="content-main">
      <div class="item-title">
        <span class="line"></span>
        <span>基本信息</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作员：">
              <span>{{ruleForm.userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单编号：">
              <span>{{ruleForm.orderNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品内容：">
              <el-table
                :data="ruleForm.productList"
                style="width:800px;"
                class="detail-table"
                size="small"
                :summary-method="getSummaries"
                show-summary
                border
              >
                <el-table-column prop="productName" label="产品名称" width="400px"></el-table-column>
                <el-table-column prop="productNo" label="产品编码" width="100px"></el-table-column>
                <el-table-column prop="skuNo" label="Sku编码" width="200px"></el-table-column>
                <el-table-column prop="quantity" label="数量" width="100px"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="销售单备注：">
              <span>{{ruleForm.saleOrderRemark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="item-title">
            <span class="line"></span>
            <span>配送信息</span>
          </div>
          <el-col :span="12">
            <el-form-item label="收件人：">
              <span>{{ruleForm.receiverName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              <span>{{ruleForm.receiverMobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件地址：">
              <span>{{ruleForm.receiverAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮政编码：">
              <span>{{ruleForm.postalCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货仓库：">
              <span>{{storehouseName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流公司：">
              <span>{{ruleForm.expressCompanys}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="物流单号：" prop="expressNo">
              <el-input
                v-model="ruleForm.expressNo"
                size="small"
                placeholder="支持输入多个物流单号,以英文逗号“,”隔开"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="出库备注：" prop="shippingOrderRemark">
              <el-input v-model="ruleForm.shippingOrderRemark" size="small" placeholder="请输入出库备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="buttons" v-if="stepActive ==0">
              <el-button type="primary" @click="submitForm" size="small">确认</el-button>
              <el-button type="error" @click="handleDelete" size="small">驳回</el-button>
              <el-button type="info" size="small" @click="close">返回</el-button>
            </div>
            <div class="buttons" v-else>
              <el-button type="warning" size="small" @click="modifyExpressNo">确认</el-button>
              <el-button type="info" size="small" @click="close">返回</el-button>
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
    id: String
  },
  data() {
    return {
      stepActive: 0,
      expressCompanysList: [
        { id: 0, name: 'JP佐川' },
        { id: 1, name: 'JPEMS' },
        { id: 2, name: 'HK圆通' },
        { id: 3, name: '邮政小包' },
        { id: 4, name: '顺丰' }
      ],
      storeHouseList: [],
      storehouseName: '',
      ruleForm: {
        productList: [],
        expressNo: '',
        expressCompanys: '',
        receiverName: '',
        postalCode: '',
        receiverMobile: '',
        receiverAddress: '',
        orderNo: '',
        storehouseId: '',
        storehouseName: '',
        designatedLogistics: '',
        userName: '',
        saleOrderRemark: '',
        shippingOrderRemark: ''
      },
      rules: {
        expressNo: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDetail()
  },
  watch: {
    id: function() {
      this.getDetail()
    }
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
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
    handleDelete() {
      this.$prompt('是否确认驳回该出库单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加备注信息'
      })
        .then(async ({ value }) => {
          const url = '/innobeautywms/shippingOrder/delete'
          let params = {
            id: this.id,
            closeReason: value
          }
          let res = await this.util.post(url, params)
          if (res.data.status == 0) {
            this.$message.success('操作成功')
            setTimeout(() => {
              this.close()
            }, 1000)
          }
        })
        .catch(() => {})
    },
    async confirmTo() {
      const url = `/innobeautywms/shippingOrder/acceptance/${this.id}`
      let res = await this.util.get(url)
      let { status } = res.data
      if (status == 0) {
        this.$message.success('确认到货成功')
        setTimeout(() => {
          this.close()
        }, 1000)
      } else {
        this.$message.error(res.data.msg)
      }
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
    },
    async getDetail() {
      const url = `/innobeautywms/shippingOrder/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        this.storeHouseList = date.storeHouseVoList
        this.ruleForm.productList = date.shippingOrderProductInfoList
        for (const key in this.ruleForm) {
          if (date.hasOwnProperty(key)) {
            this.ruleForm[key] = date[key]
          }
        }
        if (date.expressCompanys) {
          let designatedLogisticsObj = this.expressCompanysList.find(
            e => e.id == date.expressCompanys
          )
          if (designatedLogisticsObj) {
            this.ruleForm.expressCompanys = designatedLogisticsObj.name
          }
        }

        if (!this.ruleForm.expressNo) {
          this.stepActive = 0
        } else {
          this.stepActive = 1
        }
        let item = this.storeHouseList.find(
          e => e.id === this.ruleForm.storehouseId
        )
        if (item) {
          this.storehouseName = item.name
        }
      }
    },
    close() {
      this.$router.push({ path: '/stockOutTable' })
    },
    async modifyExpressNo() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) return
        const url = `/innobeautywms/shippingOrder/express`
        let id = this.id
        let { expressNo, shippingOrderRemark } = this.ruleForm
        let params = { id, expressNo, remark: shippingOrderRemark }
        this.util.post(url, params).then(res => {
          let { status } = res.data
          if (status == 0) {
            this.$message.success('操作成功')
            this.close()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    async submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const url = `/innobeautywms/shippingOrder`
          let id = this.id
          let { expressNo, shippingOrderRemark } = this.ruleForm
          let params = { id, expressNo, remark: shippingOrderRemark }
          this.util.post(url, params).then(res => {
            let { status } = res.data
            if (status == 0) {
              this.$message.success('操作成功')
              this.close()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.stock-out-info {
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