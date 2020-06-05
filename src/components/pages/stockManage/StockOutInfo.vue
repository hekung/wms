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
              <el-table :data="ruleForm.productList" class="detail-table" size="small">
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="productNo" label="产品编码"></el-table-column>
                <el-table-column prop="skuNo" label="Sku编码"></el-table-column>
                <el-table-column prop="quantity" label="数量"></el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <span>{{ruleForm.remark}}</span>
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
              <span>{{ruleForm.designatedLogistics}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流单号：" prop="expressNo">
              <el-input v-model="ruleForm.expressNo"></el-input>
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
              <!-- <el-button type="success" size="small" disabled v-else>已确认到货</el-button>-->
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
    id: Number
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
        receiverName: '',
        postalCode: '',
        receiverMobile: '',
        receiverAddress: '',
        remark: '',
        orderNo: '',
        storehouseId: '',
        storehouseName: '',
        designatedLogistics: '',
        userName: ''
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
  methods: {
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
        let designatedLogisticsObj = this.expressCompanysList.find(
          e => e.id == date.designatedLogistics
        )
        if (designatedLogisticsObj) {
          this.ruleForm.designatedLogistics = designatedLogisticsObj.name
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
      this.$emit('close', false)
    },
    async modifyExpressNo() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) return
        const url = `/innobeautywms/shippingOrder/express`
        let id = this.id
        let { expressNo } = this.ruleForm
        let params = { id, expressNo }
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
          let { expressNo } = this.ruleForm
          let params = { id, expressNo }
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