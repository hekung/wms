<template>
  <div class="stock-content table-page">
    <div class="content-header">
      <div class="crumb">
        <img src="../../../assets/img/order-h.png" alt srcset />
        <span class="current">新建入库单</span>
      </div>
    </div>
    <div class="content-main">
      <div class="item-title">
        <span class="line"></span>
        <span>基本信息</span>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
        <el-form-item label="入库类型：" prop="category">
          <el-select v-model="ruleForm.category" placeholder="入库类型" size="small">
            <el-option
              v-for="(item) in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库仓：" prop="storehouseId">
          <el-select v-model="ruleForm.storehouseId" placeholder="请选择入库仓" size="small">
            <el-option
              v-for="(item) in storeHouseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库产品：">
          <el-select v-model="selectProductId" placeholder="请选择" size="small">
            <el-option
              v-for="(item) in productList"
              :key="item.id"
              :label="item.productName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button @click="addProduct" type="primary" size="small" style="margin-left:20px;">添加</el-button>
        </el-form-item>
        <el-form-item label="产品内容：" prop="commodityItemSaveFormList">
          <el-table
            border
            :data="ruleForm.commodityItemSaveFormList"
            class="detail-table"
            size="small"
            :summary-method="getSummaries"
            show-summary
            style="width:880px;"
          >
            <el-table-column prop="productName" label="内容名称" width="400px"></el-table-column>
            <el-table-column prop="productNo" label="产品编码" width="100px"></el-table-column>
            <el-table-column prop="skuNo" label="Sku编码" width="200px"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="100px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.quantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="货品来源：" prop="origin">
          <el-input v-model="ruleForm.origin" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="ruleForm.remark" size="small"></el-input>
        </el-form-item>
        <div class="buttons">
          <el-button size="small" type="primary" @click="submitForm">确认</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    const validateProducts = (rule, value, callback) => {
      if (!this.ruleForm.commodityItemSaveFormList.length) {
        callback(new Error('请选择产品'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      selectProductId: '',
      productList: [],
      storeHouseList: [],
      needSaveDraft: true,
      categoryList: [
        { id: 0, name: '出厂入库' },
        { id: 2, name: '移货入库' }
      ],
      ruleForm: {
        commodityItemSaveFormList: [],
        category: '',
        origin: '',
        remark: '',
        storehouseId: ''
      },
      rules: {
        category: [
          { required: true, message: '请选择入库类型', trigger: 'change' }
        ],
        commodityItemSaveFormList: [
          {
            validator: validateProducts,
            required: true
          }
        ],
        origin: [
          { required: true, message: '请输入货品来源', trigger: 'blur' }
        ],
        storehouseId: [{ required: true, message: '请选择仓库' }]
      }
    }
  },
  created() {
    this.getproductList()
    this.getStockList()
    Object.assign(this.ruleForm, this.draftData)
  },
  computed: {
    ...mapState({
      draftData: state => state.stockIn.draftData
    })
  },
  beforeDestroy() {
    if (this.needSaveDraft) {
      this.$store.commit('stockIn/setDraftData', this.ruleForm)
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
          sums[index] = 'N/A'
        }
      })

      return sums
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
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.ruleForm.commodityItemSaveFormList.forEach(item => {
          if (!item.quantity) {
            valid = false
            return
          }
        })
        if (!valid) {
          this.$message.error('库存明细缺少数量')
          return
        }
        this.createStockIn()
      })
    },
    async createStockIn() {
      const url = '/innobeautywms/entryOrder'
      let {
        commodityItemSaveFormList,
        category,
        remark,
        storehouseId,
        origin
      } = this.ruleForm
      let entryOrderItemSaveFormList = commodityItemSaveFormList.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
      let res = await this.util.post(url, {
        category,
        remark,
        storehouseId,
        origin,
        entryOrderItemSaveFormList
      })
      let { status } = res.data
      if (status === 0) {
        this.needSaveDraft = false
        this.$store.commit('product/setDraftData', {})
        this.$message.success('创建入库单成功')
        setTimeout(() => {
          this.$router.push('/stockInTable')
        }, 1000)
      } else {
        this.$message.error('创建入库单失败，请联系技术人员')
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.stock-content {
  background-color: #fff;
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
  .content-main {
    padding: 0 50px;
    overflow: auto;
  }
  .form {
    .buttons {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>