<template>
  <div class="out-manage">
    <el-row style="position:relative;height:50px;">
      <el-form :model="form" :inline="true">
        <el-form-item label="下单日期：">
          <el-date-picker
            v-model="form.datePickVal"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
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
    <el-row>
      <el-col :span="24" style="position:relative;">
        <el-select placeholder="出库编号" size="mini" value="1" style="width:100px;">
          <el-option label="出库编号" value="1" size="mini"></el-option>
        </el-select>
        <el-input
          v-model="orderNo"
          size="mini"
          style="position:absolute;overflow:hidden;width:200px;margin-left:-4px;"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="blurSearch"
          size="mini"
          style="position:absolute;;margin-left:190px;"
        ></el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-tabs v-model="type">
        <el-tab-pane label="全部出库单" name="2"></el-tab-pane>
        <el-tab-pane label="待出库" name="0"></el-tab-pane>
        <el-tab-pane label="已出库" name="1"></el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row class="table-content">
      <el-table
        :data="stockOutList"
        stripe
        ref="multipleTable"
        style="height:100%;"
        @sort-change="sortChange"
      >
        <el-table-column prop="createTime" label="订单日期" sortable="custom">
          <!-- <template slot-scope="scope">
            <span>{{$moment(new Date(scope.row.createTime)).format('YYYY-MM-DD HH:mm')}}</span>
          </template>-->
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号">
          <template slot-scope="scope">
            <el-button type="text" @click="lookDetail(scope.row)">{{scope.row.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="下单人"></el-table-column>
        <el-table-column prop="productInfoList" label="产品内容">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.productInfoList" :key="index">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收货信息">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.receiverName}}-{{scope.row.receiverMobile}}</span>
              <p>{{scope.row.receiverAddress}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storeHouseName" label="出库仓库"></el-table-column>
        <el-table-column prop="expressCompanys" label="物流公司"></el-table-column>
        <el-table-column prop="expressNo" label="快递单号"></el-table-column>
        <el-table-column prop="orderStatus" label="出库状态"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
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
    </el-row>
    <stock-out-info v-if="showDetail" :id="detailId" @close="toggleShowDetail"></stock-out-info>
  </div>
</template>

<script>
import StockOutInfo from './StockOutInfo'
export default {
  components: {
    StockOutInfo
  },
  data() {
    return {
      datePickVal: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      orderNo: '',
      timeOrder: '',
      showDetail: false,
      stockOutList: [],
      productList: [],
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
      type: '2',
      form: {
        datePickVal: '',
        stockId: '',
        productId: ''
      }
    }
  },
  created() {
    this.search()
    this.getStockList()
  },
  computed: {},
  watch: {
    type() {
      this.currentPage = 1
      this.search()
    }
  },
  methods: {
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
      const url = '/innobeautywms/shippingOrder/excel/export'
      location.href = url
    },
    screening() {
      this.currentPage = 1
      this.search()
    },
    lookDetail(rowData) {
      this.showDetail = true
      this.detailId = rowData.id
    },
    toggleShowDetail(isShow) {
      this.showDetail = isShow
      if (!isShow) {
        this.detailId = ''
        this.search()
      }
    },
    handleClick() {},
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
      let val = order == 'descending' ? 1 : 0
      this.timeOrder = val
      this.currentPage = 1
      this.search()
    },
    handleDelete(rowData) {
      this.$prompt('是否确认取消该出库单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加备注信息'
      })
        .then(async ({ value }) => {
          const url = '/innobeautywms/shippingOrder/delete'
          let params = {
            id: rowData.id,
            closeReason: value
          }
          let res = await this.util.post(url, params)
          if (res.data.status == 0) {
            this.$message.success('删除成功')
            setTimeout(() => {
              this.search()
            }, 1000)
          }
        })
        .catch(() => {})
    },
    blurSearch() {
      this.search({ blur: true })
    },
    async search(addition) {
      let url = '/innobeautywms/shippingOrder/list'
      let params = {
        type: this.type,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.timeOrder === 0 || this.timeOrder === 1) {
        params.timeOrder = this.timeOrder
      }
      if (addition && addition.blur && this.orderNo) {
        params.orderNo = this.orderNo
        url = '/innobeautywms/shippingOrder/list/search'
      }
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime = this.form.datePickVal[1].getTime() + 24 * 60 * 60 * 1000
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.stockId !== '' && this.form.stockId !== undefined) {
        params.storeHouseId = this.form.stockId
      }
      try {
        let res = await this.util.post(url, params)
        let { status, date } = res.data
        if (status == 0) {
          this.stockOutList = date.list
          this.totalRows = date.total
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.out-manage {
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
    height: calc(~'100% - 150px');
    /deep/.el-table__body-wrapper {
      height: calc(~'100% - 50px');
      overflow: auto;
    }
  }
}
</style>