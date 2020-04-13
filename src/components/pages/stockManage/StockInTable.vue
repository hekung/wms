<template>
  <div class="in-manage">
    <el-row style="position:relative;height:40px;">
      <el-button type="warning" size="medium" @click="addNew">新建入库单</el-button>
      <el-form :model="form" :inline="true" class="form">
        <el-form-item label="入库单筛选：">
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
          <el-select v-model="form.category" placeholder="入库类型" size="mini" style="margin:0 12px;">
            <el-option
              v-for="(item) in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.storeHouseId"
            placeholder="入库仓"
            size="mini"
            style="margin:0 12px;"
          >
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
      <el-table
        :data="entryOrderList"
        stripe
        ref="multipleTable"
        style="height:100%;"
        @sort-change="sortChange"
      >
        <el-table-column prop="createTime" label="创建日期" align="center" sortable="custom">
          <template slot-scope="scope">
            <span>{{$moment(new Date(scope.row.createTime)).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="入库类型" align="center"></el-table-column>
        <el-table-column prop="rate" label="入库编号" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="lookDetail(scope.row)">{{scope.row.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="storehouseName" label="入库仓"></el-table-column>
        <el-table-column prop="productInfoList" label="产品名称*数量">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.productInfoList" :key="index">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin-top:40px;float:right;">
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
    <create-stock-in v-if="showCreatePage" @close="closeCreatePage"></create-stock-in>
    <stock-into-info v-if="showInfoPage" :id="detailId" @close="closeInfoPage"></stock-into-info>
  </div>
</template>

<script>
import CreateStockIn from './CreateStockIn'
import StockIntoInfo from './StockIntoInfo'
export default {
  components: {
    CreateStockIn,
    StockIntoInfo
  },
  data() {
    return {
      datePickVal: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      detailId: '',
      showCreatePage: false,
      showInfoPage: false,
      entryOrderList: [],
      stockList: [{ id: undefined, name: '全部' }],
      categoryList: [
        { id: undefined, name: '全部' },
        { id: 0, name: '出厂入库' },
        { id: 1, name: '退货入库' },
        { id: 2, name: '移货入库' }
      ],
      multipleSelection: [],
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
        storeHouseId: '',
        category: ''
      }
    }
  },
  created() {
    this.search()
    this.getStockList()
  },
  methods: {
    exportOut() {
      const url = '/innobeautywms/entryOrder/excel/export'
      location.href = url
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
    lookDetail(rowData) {
      this.showInfoPage = true
      this.detailId = rowData.id
    },
    closeAndGetInfo(id) {
      this.showCreatePage = false
      this.detailId = id
      this.showInfoPage = true
    },
    closeCreatePage() {
      this.showCreatePage = false
      this.search()
    },
    closeInfoPage() {
      this.showInfoPage = false
      this.search()
    },
    sortChange() {},
    addNew() {
      this.showCreatePage = true
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
    handleDelete(rowData) {
      this.$prompt('是否确认删除该入库单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请添加备注信息'
      })
        .then(async ({ value }) => {
          const url = '/innobeautywms/entryOrder/delete'
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
    async search() {
      const url = '/innobeautywms/entryOrder/list'
      let params = {
        type: this.type,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime = this.form.datePickVal[1].getTime() + 24 * 60 * 60 * 1000
        Object.assign(params, { startTime, endTime })
      }
      if (this.form.storeHouseId) {
        params.storeHouseId = this.form.storeHouseId
      }
      if (this.form.category) {
        params.category = this.form.category
      }
      try {
        let res = await this.util.post(url, params)
        let { status, date } = res.data
        if (status == 0) {
          this.entryOrderList = date.list
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
.in-manage {
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
  .form {
    float: right;
  }
  /deep/ .el-tabs__nav-wrap {
    width: 100%;
  }
  .table-content {
    height: calc(~'100% - 100px');
    /deep/.el-table__body-wrapper {
      height: calc(~'100% - 50px');
      overflow: auto;
    }
  }
}
</style>