<template>
  <div class="stock-daily">
    <el-row style="position:relative;height:40px;">
      <el-form :model="form" :inline="true">
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
            size="mini"
          ></el-date-picker>
          <el-select v-model="form.stockId" placeholder="出库仓" size="mini" style="margin:0 12px;">
            <el-option
              v-for="(item) in stockList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="screening">筛选</el-button>
          <el-button size="mini" type="primary" @click="exportOut">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="table-content">
      <el-table :data="dataList" stripe ref="multipleTable" style="height:100%;width:100%;">
        <el-table-column prop="creatTime" label="日期" fixed align="center" width="120">
          <!-- <template slot-scope="scope">
            <span>{{$moment(new Date(scope.row.createTime)).format('YYYY-MM-DD')}}</span>
          </template>-->
        </el-table-column>
        <el-table-column
          v-for="(value,index) in productNameList"
          :key="index"
          :label="value"
          align="center"
        >
          <el-table-column label="入库数" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.map[value]?scope.row.map[value].inStock:0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="出库数" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.map[value]?scope.row.map[value].outStock:0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.map[value]?scope.row.map[value].quantity:0}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-row>
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
      productNameList: [],
      stockList: [{ id: undefined, name: '全部' }],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      form: {
        datePickVal: '',
        stockId: '',
        productId: ''
      }
    }
  },
  created() {
    this.setDeafultTimeRange()
    this.search()
    this.getStockList()
  },
  computed: {},
  methods: {
    setDeafultTimeRange() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 10)
      this.form.datePickVal = [start, end]
    },
    async getStockList() {
      const url = `/innobeautywms/storehouseVo`
      try {
        let res = await this.util.get(url)
        let { status, date } = res.data
        if (status == 0) {
          date.unshift({ id: undefined, name: '全部' })
          this.stockList = date
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    exportOut() {
      const url = '/innobeautywms/inventoryJournal/excel/export'
      let params = {}
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime = this.form.datePickVal[1].getTime() + 24 * 60 * 60 * 1000
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.stockId !== '') {
        params.storeHouseId = this.form.stockId
      }
      this.util.postDownLoadFile(url, params).then(res => {
        // let blob = new Blob([res.data], {
        //   type: 'application/msexcel;charset=utf-8'
        // })
        // let objUrl = URL.createObjectURL(res.data)
        // window.location.href = objUrl
        const content = res.data
        const blob = new Blob([content])
        const fileName = '库存日记账.xls'
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
    async search() {
      const url = '/innobeautywms/inventory/report'
      let params = {}
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime = this.form.datePickVal[1].getTime() + 24 * 60 * 60 * 1000
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.stockId !== '') {
        params.storeHouseId = this.form.stockId
      }
      try {
        let res = await this.util.post(url, params)
        let { status, date } = res.data
        if (status == 0) {
          this.dataList = date.inventoryReportVoList
          this.productNameList = date.productNoAndNameList
          this.totalRows = this.dataList.length
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.stock-daily {
  background-color: #fff;
  height: 100%;
  padding: 40px;
  position: relative;
  /deep/ .el-range-editor--mini .el-range-separator {
    width: 30px;
  }
  /deep/ .el-date-editor--daterange.el-input__inner {
    width: 240px;
  }
  .table-content {
    margin-top: 20px;
    max-height: calc(~'100% - 100px');
    min-height: 500px;
    /deep/.el-table__body-wrapper {
      height: calc(~'100% - 100px');
      overflow: auto;
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
</style>