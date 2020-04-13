<template>
  <div class="stock-content">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="form">
      <div class="title">
        <span>基本信息</span>
      </div>
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
        <el-table :data="ruleForm.commodityItemSaveFormList" style="width:420px;">
          <el-table-column prop="productName" label="内容名称"></el-table-column>
          <el-table-column prop="productNo" label="内容编码"></el-table-column>
          <el-table-column prop="quantity" label="数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
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
      <el-form-item label="备注：">
        <el-input v-model="ruleForm.remark" size="small"></el-input>
      </el-form-item>
      <div class="buttons">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
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
      categoryList: [
        { id: 0, name: '出厂入库' },
        { id: 1, name: '退货入库' },
        { id: 2, name: '移货入库' }
      ],
      ruleForm: {
        commodityItemSaveFormList: [],
        category: '',
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
        storehouseId: [{ required: true, message: '请选择仓库' }]
      }
    }
  },
  created() {
    this.getproductList()
    this.getStockList()
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
        storehouseId
      } = this.ruleForm
      let entryOrderItemSaveFormList = commodityItemSaveFormList.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
      let res = await this.util.post(url, {
        category,
        remark,
        storehouseId,
        entryOrderItemSaveFormList
      })
      let { status } = res.data
      if (status === 0) {
        this.$message.success('创建入库单成功')
        setTimeout(() => {
          this.$emit('close')
        }, 1000)
      } else {
        this.$message.error('创建入库单失败，请联系技术人员')
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