
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
                :summary-method="getSummaries"
                show-summary
                style="width:800px;"
                max-height="320"
                border
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
          <el-col
            :span="12"
            v-if="ruleForm.category==1||ruleForm.category==2||ruleForm.storehouseId==2"
          >
            <el-form-item label="预期到货时间：">
              <span>{{timeReceive}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input size="small" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="buttons">
              <el-button
                size="small"
                type="danger"
                @click="deleteThis"
                v-if="ruleForm.storehouseId!=2"
              >删除</el-button>
              <el-button size="small" type="primary" @click="confirmModify">确认</el-button>
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
    id: String
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
        origin: '',
        expectReceiveTime: ''
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
  computed: {
    timeReceive() {
      if (this.ruleForm.expectReceiveTime) {
        return this.$moment(new Date(this.ruleForm.expectReceiveTime)).format(
          ' YYYY-MM-DD'
        )
      } else {
        return ''
      }
    }
  },
  methods: {
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
    async getDetail() {
      let id = this.id
      const url = ` /innobeautywms/entryOrder/${id}`
      let res = await this.util.get(url)
      let { status, date } = res.data
      if (status == 0) {
        // this.storeHouseList = date.storeHouseVoList
        this.sotoreHouseName = date.storehouseName
        this.ruleForm.remark = date.remark
        this.ruleForm.origin = date.origin
        this.ruleForm.commodityItemSaveFormList = date.entryOrderItemList
        this.originalProductList = [...date.entryOrderItemList]
        this.ruleForm.category = date.category
        this.ruleForm.storehouseId = date.storehouseId || ''
        this.saleOrderNo = date.saleOrderNo
        this.ruleForm.expectReceiveTime = date.expectReceiveTime
        this.orderNo = date.orderNo
        this.userName = date.userName
      }
    },
    async confirmModify() {
      let params = {
        id: this.id,
        remark: this.ruleForm.remark
      }
      const url = '/innobeautywms/entryOrder/updateRemark'
      let res = await this.util.post(url, params)
      let { status, msg } = res.data
      if (status === 0) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.$router.push({ path: '/stockInTable' })
        }, 1000)
      } else {
        this.$message.error(msg)
      }
    },
    handleDelete(index) {
      this.ruleForm.commodityItemSaveFormList.splice(index, 1)
    },
    close() {
      this.$router.push({ path: '/stockInTable' })
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