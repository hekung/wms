<template>
  <div class="stock-daily table-page">
    <div class="table-selector">
      <div>
        <el-form :model="form" :inline="true" label-width="90px">
          <el-form-item label="下单日期：">
            <el-date-picker
              v-model="form.datePickVal"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              size="small"
              @change="pickChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="仓库：">
            <el-select
              v-model="form.stockId"
              placeholder="仓库"
              size="small"
              @change="stockChange"
            >
              <el-option
                v-for="item in stockList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称">
            <el-select
              v-model="form.productId"
              placeholder="产品名称"
              size="small"
              @change="productChange"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.productName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-container">
        <el-button
          class="clear-btn"
          size="small"
          type="info"
          plain
          @click="clearScreen"
          >清空筛选条件</el-button
        >
        <el-button
          class="clear-btn"
          size="small"
          type="primary"
          style="margin-left: 30px"
          @click="exportOut"
          >导出</el-button
        >
      </div>
      <div class="switch">
        <el-switch
          @change="toggleSearch"
          v-model="showGather"
          active-color="rgb(86, 119, 252)"
          active-text="展示各仓库存量"
        ></el-switch>
      </div>
    </div>
    <div class="main-content">
      <el-row class="table-content">
        <el-table
          :data="gatherList"
          ref="multipleTable"
          style="height: 100%; width: 100%"
          v-show="showGather"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            min-width="50px"
          ></el-table-column>
          <el-table-column
            label="SKU编码"
            prop="skuNo"
            min-width="120px"
          ></el-table-column>
          <el-table-column
            label="产品名称"
            prop="productName"
            min-width="200px"
          ></el-table-column>
          <el-table-column label="总库存" min-width="80px">
            <template slot-scope="scope">
              <div>{{ scope.row.totalStock }}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in originalStocks"
            :key="item.id"
            :prop="item.name"
            :label="item.name"
            min-width="80px"
          >
            <template slot-scope="scope">
              <span
                :class="{
                  green:
                    scope.row.shipQuantityMap &&
                    scope.row.shipQuantityMap[item.id] &&
                    scope.row.shipQuantityMap[item.id] <
                      scope.row.stockMap[item.id],
                  red:
                    scope.row.shipQuantityMap &&
                    scope.row.shipQuantityMap[item.id] &&
                    (scope.row.shipQuantityMap[item.id] >
                      scope.row.stockMap[item.id] ||
                      !scope.row.stockMap[item.id]),
                }"
              >
                {{ scope.row.stockMap[item.id] || 0 }}
              </span>
              <span
                v-if="
                  scope.row.shipQuantityMap &&
                  scope.row.shipQuantityMap[item.id]
                "
                >({{ scope.row.shipQuantityMap[item.id] }})</span
              >
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="dataList"
          ref="multipleTable"
          style="height: 100%; width: 100%"
          v-show="!showGather && !form.productId"
        >
          <el-table-column :label="storehouseName" align="center">
            <template slot="empty">
              <div>
                <img src="../../../assets/img/none.svg" alt />
                <p>暂无数据</p>
              </div>
            </template>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              label="SKU编码"
              prop="skuNo"
              min-width="120px"
            ></el-table-column>
            <el-table-column
              label="产品名称"
              prop="productName"
              min-width="200px"
            ></el-table-column>
            <el-table-column label="入库" prop="inStock"></el-table-column>
            <el-table-column label="出库" prop="outStock"></el-table-column>
            <el-table-column label="库存" prop="quantity"></el-table-column>
          </el-table-column>
        </el-table>
        <el-table
          ref="multipleTable"
          :data="dataList"
          v-show="!showGather && form.productId"
        >
          <template slot="empty">
            <div>
              <img src="../../../assets/img/none.svg" alt />
              <p>暂无数据</p>
            </div>
          </template>
          <el-table-column label="仓库" prop="storeHouseName"></el-table-column>
          <el-table-column label="SKU编码" prop="skuNo"></el-table-column>z
          <el-table-column label="产品名称" prop="productName"></el-table-column
          >z
          <el-table-column label="入库" prop="inStock"></el-table-column>
          <el-table-column label="出库" prop="outStock"></el-table-column>
          <el-table-column label="库存" prop="quantity"></el-table-column>
        </el-table>
      </el-row>
    </div>
    <!-- <el-row>
      <div style="margin-top:20px;float:right;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRows"
        ></el-pagination>
      </div>
    </el-row>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      datePickVal: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      timeOrder: '',
      dataList: [],
      productList: [],
      showGather: false,
      gatherList: [],
      stockList: [{ id: undefined, name: '全部' }],
      originalStocks: [],
      storehouseName: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      form: {
        datePickVal: '',
        stockId: '',
        productId: '',
      },
    }
  },
  created() {
    // this.setDeafultTimeRange()
    this.getStockList()
    this.getProductList()
    this.search()
  },
  methods: {
    toggleSearch() {
      this.search()
    },
    clearScreen() {
      for (const key in this.form) {
        if (key !== 'datePickVal') {
          this.form[key] = ''
        } else {
          this.form[key] = []
        }
      }
      this.screening()
    },
    stockChange() {
      this.form.productId = ''
      this.screening()
    },
    productChange() {
      this.form.stockId = ''
      this.screening()
    },
    setDeafultTimeRange() {
      const end = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      ) // 获取当天23：59：59
      const start = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      ) //获取当天0点
      this.form.datePickVal = [start, end]
    },
    async getStockList() {
      const url = `/innobeautywms/storehouseVo`
      try {
        let res = await this.util.get(url)
        let { status, date } = res.data
        if (status == 0) {
          this.originalStocks = JSON.parse(JSON.stringify(date))
          date.unshift({ id: undefined, name: '全部' })
          this.stockList = date
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getProductList() {
      const url = `/innobeautywms/product/select/list`
      try {
        let res = await this.util.get(url)
        let { status, date } = res.data
        if (status == 0) {
          date.unshift({ id: undefined, productName: '全部' })
          this.productList = date
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    exportOut() {
      let url = '/innobeautywms/inventoryStatistic/excel/export'
      if (this.form.productId) {
        url = '/innobeautywms/inventoryStatistic/product/excel/export'
      }
      let params = {
        isSecond: this.showGather,
      }
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime =
          new Date(this.form.datePickVal[1].toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.stockId !== '' && this.form.stockId !== undefined) {
        params.storeHouseId = this.form.stockId
      }
      if (this.form.productId !== '' && this.form.productId !== undefined) {
        params.productId = this.form.productId
      }
      this.util.postDownLoadFile(url, params).then((res) => {
        // let blob = new Blob([res.data], {
        //   type: 'application/msexcel;charset=utf-8'
        // })
        // let objUrl = URL.createObjectURL(res.data)
        // window.location.href = objUrl
        if (res.data.type === 'application/json') {
          let reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
          reader.onload = () => {
            // console.log('----', JSON.parse(reader.result))
            const result = JSON.parse(reader.result)
            this.$message.error(result.msg)
            if (result.status == 10) {
              this.$router.push('/login')
            }
          }
          return
        }
        const content = res.data
        const blob = new Blob([content])
        const fileName = '库存统计.xls'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    screening() {
      this.currentPage = 1
      this.search()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    sortChange({ column, prop, order }) {
      if (prop == 'createTime') {
        this.timeOrder = order
      }
      this.currentPage = 1
      this.search()
    },
    pickChange() {
      this.screening()
    },
    async search() {
      if (this.showGather) {
        this.searchGatherList()
        return
      }
      let url = '/innobeautywms/inventory/statistics'
      if (this.form.productId) {
        url = '/innobeautywms/inventory/product/statistics'
      }

      let params = {}
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime =
          new Date(this.form.datePickVal[1].toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.stockId !== '' && this.form.stockId !== undefined) {
        params.storeHouseId = this.form.stockId
      }
      if (this.form.productId !== '' && this.form.productId !== undefined) {
        params.productId = this.form.productId
      }
      try {
        let res = await this.util.post(url, params)
        let { status, date } = res.data
        if (status == 0) {
          // 如果是选择了商品，那就需要调整返回
          if (this.form.productId) {
            let allObj = date.find((e) => e.storeHouseName === '全部')
            let allObjIndex = date.findIndex((e) => e.storeHouseName === '全部')
            date.splice(allObjIndex, 1)
            date = [allObj, ...date]
          }
          this.dataList = date
          let storehouseObj = this.stockList.find(
            (e) => e.id === this.form.stockId
          )
          this.storehouseName = storehouseObj ? storehouseObj.name : '全部'
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async searchGatherList() {
      let params = {}
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime =
          new Date(this.form.datePickVal[1].toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
        Object.assign(params, { startTime, endTime })
      }
      this.util
        .post('/innobeautywms/inventory/storeHouse/statistics', params)
        .then((res) => {
          let { status, date } = res.data
          if (status == 0) {
            this.gatherList = date
          }
        })
    },
    getSummaries(param) {
      const { columns, data } = param
      let sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计:'
          return
        }
        if (index == 3) {
          const values = data.map((item) => Number(item.totalStock))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        }
        if (index > 3) {
          let stockItem = this.originalStocks.find(
            (e) => e.name == column.property
          )
          const values = data.map((item) => Number(item.stockMap[stockItem.id]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (!sums[index]) {
              sums[index] = 0
            }
          }
        }
      })

      return sums
    },
  },
}
</script>
<style lang="less" scoped>
.stock-daily {
  .table-selector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    .btn-container {
      padding: 10px;
      padding-left: 18px;
      margin-left: 0px;
      .clear-btn {
        padding: 10px 40px;
      }
    }
  }
  .main-content {
    height: calc(~'100% - 100px');
    .table-content {
      height: calc(~'100% - 100px');
      /deep/.el-table__body-wrapper {
        height: calc(~'100% - 100px');
        overflow: auto;
      }
      /deep/ .el-table td,
      .el-table th {
        padding: 7px 0 !important;
      }
      /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 10px; // 横向滚动条
        height: 10px; // 纵向滚动条 必写
      }
      /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 4px;
      }
    }
  }
  .switch {
    height: 50px;
    padding: 10px;
  }
  // /deep/ .el-table__body-wrapper::-webkit-scrollbar {
  //   width: 10px; // 横向滚动条
  //   height: 10px; // 纵向滚动条 必写
  // }
  // /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  //   background-color: #ddd;
  //   border-radius: 4px;
  // }
  .green {
    color: green;
  }
  .red {
    color: red;
  }
}
</style>