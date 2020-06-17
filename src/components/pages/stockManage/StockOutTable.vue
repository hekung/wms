<template>
  <div class="out-manage table-page">
    <div class="table-selector">
      <el-form :model="form" :inline="true" label-width="120px">
        <div class="top-blur-search">
          <el-form-item label="出库单查询：">
            <el-input
              v-model="orderNo"
              size="small"
              placeholder="请输入出库编号"
              style="width:300px;display:inline-block;"
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="blurSearch"
              size="small"
              style="display:inline-block;margin-left:10px;"
            ></el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="下单日期：">
            <el-date-picker
              v-model="form.datePickVal"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="pickChange"
              :picker-options="pickerOptions"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="出库仓">
            <el-select
              v-model="form.stockId"
              @change="screening"
              placeholder="出库仓"
              size="small"
              style="margin:0 12px;"
            >
              <el-option
                v-for="(item) in stockList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-button class="clear-btn" size="small" type="info" plain @click="clearScreen">清空筛选条件</el-button>
          <el-button
            class="clear-btn"
            size="small"
            type="primary"
            style="margin-left:30px;"
            @click="exportOut"
          >导出</el-button>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div>
        <el-tabs v-model="type">
          <el-tab-pane name="2">
            <div slot="label" class="tab-title">
              <img src="../../../assets/img/all.png" alt v-if="type!=='2'" />
              <img src="../../../assets/img/all-1.png" alt v-else />
              <span>全部</span>
            </div>
          </el-tab-pane>
          <el-tab-pane name="0">
            <div slot="label" class="tab-title">
              <img src="../../../assets/img/waitDone.png" alt v-if="type!=='0'" />
              <img src="../../../assets/img/waitDone-1.png" alt v-else />
              <span>待出库</span>
            </div>
          </el-tab-pane>
          <el-tab-pane name="1">
            <div slot="label" class="tab-title">
              <img src="../../../assets/img/finish.png" alt v-if="type!=='1'" />
              <img src="../../../assets/img/finish-1.png" alt v-else />
              <span>已完成</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-content">
        <el-table
          :data="stockOutList"
          stripe
          ref="multipleTable"
          style="height:100%;"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange"
        >
          <template slot="empty">
            <div>
              <img src="../../../assets/img/none.svg" alt />
              <p>暂无数据</p>
            </div>
          </template>
          <el-table-column type="selection" width="55" v-if="type=='0'"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" sortable="custom"></el-table-column>
          <el-table-column prop="orderNo" label="订单编号">
            <template slot-scope="scope">
              <el-button type="text" @click="lookDetail(scope.row)">{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="receiverName" label="收货人"></el-table-column>
          <el-table-column prop="storeHouseName" label="出库仓库"></el-table-column>
          <el-table-column prop="expressCompanys" label="物流公司"></el-table-column>
          <el-table-column prop="expressNoList" label="物流单号">
            <template slot-scope="scope">
              <div
                v-for="(expressNo,index) in scope.row.expressNoList"
                :key="index"
                :class="index>3&&!showMorePro?'no-show':''"
              >
                <span>{{expressNo}}</span>
              </div>
              <el-button
                type="text"
                v-if="scope.row.expressNoList.length>4&&!showMorePro"
                @click="showMorePro=!showMorePro"
              >......</el-button>
              <el-button
                type="text"
                v-if="scope.row.expressNoList.length>4&&showMorePro"
                @click="showMorePro=!showMorePro"
              >收起</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="出库状态" align="center">
            <template slot-scope="scope">
              <span :class="scope.row.orderStatus==='已完成'?'orange':''">{{scope.row.orderStatus}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-shift-container">
        <div class="page-shift">
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
      </div>
    </div>
    <stock-out-info v-if="showDetail" :id="detailId" @close="toggleShowDetail"></stock-out-info>
    <el-dialog
      title="请选择导出报表："
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="cancelExport"
    >
      <el-radio-group v-model="exportOutType">
        <el-radio :label="0" class="db">昆山发货单</el-radio>
        <el-radio :label="1" class="db">香港发货单</el-radio>
        <el-radio :label="2" class="db">日本发货单</el-radio>
        <el-radio :label="3" class="db">日本发货单JP</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelExport">取 消</el-button>
        <el-button type="primary" @click="confirmExport">确 定</el-button>
      </span>
    </el-dialog>
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
      showMorePro: false,
      showDetail: false,
      dialogVisible: false,
      exportOutType: '',
      multipleSelection: '',
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
        stockId: ''
      }
    }
  },
  created() {
    this.search()
    this.getStockList()
  },
  computed: {},
  watch: {
    type(val) {
      this.currentPage = 1
      this.search()
      if (val !== '0') {
        this.multipleSelection = []
      }
    }
  },
  methods: {
    pickChange() {
      this.screening()
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
      this.dialogVisible = true
    },
    cancelExport() {
      this.exportOutType = ''
      this.dialogVisible = false
    },
    confirmExport() {
      if (this.exportOutType === '') {
        this.$message.error('请选择导出模板')
        return
      }
      let url =
        '/innobeautywms/shippingOrder/excel/export/' + this.exportOutType
      let params = {}
      if (this.multipleSelection.length) {
        url = '/innobeautywms/shippingOrder/excel/export/select'
        let ids = this.multipleSelection.map(e => e.id)
        params = {
          type: this.exportOutType,
          ids
        }
      }
      this.util.postDownLoadFile(url, params).then(res => {
        // 如果服务器错误返回
        if (res.data.type === 'application/json') {
          let reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
          reader.onload = () => {
            // console.log('----', JSON.parse(reader.result))
            const result = JSON.parse(reader.result)
            this.$message.error(result.msg)
          }
        } else {
          const nameMap = {
            0: '昆山发货单模板',
            1: '香港发货单模板',
            2: '日本发货单模板',
            3: '日本发货单JP模板'
          }
          const content = res.data
          const blob = new Blob([content])
          const fileName = nameMap[this.exportOutType] + '.xls'
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
        }
        this.cancelExport()
      })
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
          this.stockOutList.forEach(e => {
            let expressNo = e.expressNo || ''
            let expressNoList = expressNo.split(',')
            e.expressNoList = expressNoList
          })
          this.totalRows = date.total
          console.log(this.stockOutList)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="less" scoped>
.out-manage {
  .orange {
    color: orange;
  }
  .db {
    display: block;
    line-height: 30px;
  }
  .main-content {
    height: calc(~'100% - 180px');
    .table-content {
      height: calc(~'100% - 100px');
      /deep/.el-table__body-wrapper {
        height: calc(~'100% - 60px');
        overflow: auto;
      }
      .no-show {
        display: none;
      }
    }
  }
  .table-selector {
    .top-blur-search {
      border-bottom: 1px dashed #e8e8e8;
      padding: 10px 0;
      margin-bottom: 10px;
    }
    .btn-container {
      padding: 10px;
      padding-left: 18px;
      .clear-btn {
        font-size: 12px;
        padding: 10px 40px;
      }
    }
  }
}
</style>