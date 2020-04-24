<template>
  <div class="stock-out-info">
    <div class="content-header">
      <div class="crumb">
        <span class="parent" @click="close">出库列表</span>
        <span class="el-breadcrumb__separator">/</span>
        <span class="current">出库单详情</span>
      </div>
      <i class="close-btn el-icon el-icon-close" @click="close"></i>
    </div>
    <el-steps :active="stepActive" finish-status="success" simple>
      <el-step title="指定仓库/填写物流"></el-step>
      <el-step title="已出库"></el-step>
    </el-steps>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
      <el-row v-if="stepActive==0">
        <el-col :span="24">
          <div class="title">
            <span>指定仓库/物流</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择仓库：" prop="storehouseId">
            <el-radio-group v-model="ruleForm.storehouseId" size="small">
              <el-radio v-for="item in storeHouseList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择物流公司：">
            <el-select
              v-model="ruleForm.expressCompanys"
              placeholder="请选择"
              size="small"
              prop="expressCompanys"
            >
              <el-option
                v-for="(item) in expressCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="快递单号：" prop="expressNo">
            <el-input v-model="ruleForm.expressNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="24">
          <div class="title">
            <span>指定仓库/物流公司</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="仓库：">
            <span>{{getStorehouseName()}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物流公司：">
            <span>{{ruleForm.expressCompanys}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="快递单号：">
            <span>{{ruleForm.expressNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="title">
            <span>基本信息</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单编号：">
            <span>{{ruleForm.orderNo}}</span>
          </el-form-item>
          <el-form-item label="产品内容：">
            <el-table :data="ruleForm.productList" style="width:420px;">
              <el-table-column prop="productName" label="产品名称"></el-table-column>
              <el-table-column prop="productNo" label="产品编码"></el-table-column>
              <el-table-column prop="quantity" label="数量"></el-table-column>
              <el-table-column prop="stock" label="可用库存">
                <template slot-scope="scope">
                  <div>{{getStokCanUse(scope.row.stockPileList)}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="title">
            <span>配送信息</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="收件人：">
            <span>{{ruleForm.receiverName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系电话：">
            <span>{{ruleForm.receiverMobile}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="收件地址：">
            <span>{{ruleForm.receiverAddress}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="title">
            <span>其他信息</span>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span>{{ruleForm.remark}}</span>
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
            <el-button type="warning" size="small" @click="confirmTo" v-if="!receive">确认到货</el-button>
            <el-button type="success" size="small" disabled v-else>已确认到货</el-button>
            <el-button type="info" size="small" @click="close">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
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
      expressCompanyList: [
        { id: 1, name: '顺丰速递' },
        { id: 2, name: '国际速递' }
      ],
      receive: false,
      storeHouseList: [],
      ruleForm: {
        productList: [],
        expressNo: '',
        receiverName: '',
        receiverMobile: '',
        receiverAddress: '',
        remark: '',
        orderNo: '',
        storehouseId: '',
        expressCompanys: ''
      },
      rules: {
        storehouseId: [{ required: true, message: '请选择仓库' }],
        expressCompanys: [{ required: true, message: '请选择物流公司' }],
        expressNo: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
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
    getStorehouseName() {
      let item = this.storeHouseList.find(
        e => e.id === this.ruleForm.storehouseId
      )
      if (item) {
        return item.name || ''
      }
      return ''
    },
    async getDetail() {
      const url = `/innobeautywms/shippingOrder/${this.id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        this.storeHouseList = date.storeHouseVoList
        this.ruleForm.productList = date.shippingOrderProductInfoList
        for (const key in this.ruleForm) {
          if (date[key]) {
            this.ruleForm[key] = date[key]
          }
        }
        if (date.receive) {
          this.receive = date.receive
        }
        if (!this.ruleForm.expressNo) {
          this.stepActive = 0
        } else {
          this.stepActive = 1
        }
      }
    },
    close() {
      this.$emit('close', false)
    },
    async submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const url = `/innobeautywms/shippingOrder`
          let id = this.id
          let { storehouseId, expressCompanys, expressNo } = this.ruleForm
          let params = { id, storehouseId, expressCompanys, expressNo }
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
    },
    goNext() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const url = `/innobeautywms/shippingOrder`
          let params
          let id = this.id
          let { storehouseId, expressCompanys, expressNo } = this.ruleForm
          if (this.stepActive == 0) {
            params = { id, storehouseId, expressCompanys }
          } else {
            params = { id, expressNo }
          }
          this.util.post(url, params).then(res => {
            let { status } = res.data
            if (status == 0) {
              this.getDetail()
            } else {
              this.$message.error('请求错误，请联系技术人员')
            }
          })
        }
      })
    },
    goLast() {
      let stepActive = this.stepActive
      this.stepActive = stepActive - 1
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
    margin-top: 20px;
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