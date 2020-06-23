<template>
  <div class="in-manage table-page">
    <div class="table-selector">
      <el-form :model="form" :inline="true" class="form" label-width="120px">
        <div class="top-blur-search">
          <el-form-item label="入库单查询：">
            <el-input
              v-model="form.orderNo"
              size="small"
              placeholder="请输入入库编号"
              style="width:300px;display:inline-block;"
              clearable
            ></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="screening"
              size="small"
              style="display:inline-block;margin-left:10px;"
            ></el-button>
          </el-form-item>
          <el-button
            type="warning"
            size="medium"
            @click="addNew"
            style="float:right;margin-right:30px;"
          >新建入库单</el-button>
        </div>
        <div>
          <el-form-item label="日期筛选：">
            <el-date-picker
              v-model="form.datePickVal"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="screening"
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="入库类型：">
            <el-select
              v-model="form.category"
              @change="screening"
              placeholder="入库类型"
              size="small"
              style="margin:0 12px;"
            >
              <el-option
                v-for="(item) in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库仓">
            <el-select
              v-model="form.storeHouseId"
              @change="screening"
              placeholder="入库仓"
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
          <el-button class="clear-btn" size="small" type="info" @click="clearScreen" plain>清空筛选条件</el-button>
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
      <div class="table-content">
        <el-table
          :data="entryOrderList"
          stripe
          ref="multipleTable"
          style="height:100%;"
          @sort-change="sortChange"
        >
          <template slot="empty">
            <div>
              <img src="../../../assets/img/none.svg" alt />
              <p>暂无数据</p>
            </div>
          </template>
          <el-table-column
            prop="createTime"
            label="创建日期"
            align="center"
            sortable="custom"
            min-width="120px"
          >
            <!-- <template slot-scope="scope">
            <span>{{$moment(new Date(scope.row.createTime)).format('YYYY-MM-DD HH:mm')}}</span>
            </template>-->
          </el-table-column>
          <el-table-column prop="category" label="入库类型" align="center" min-width="60px">
            <template slot-scope="scope">
              <span>{{scope.row.orderStatus=='待入库'?'':scope.row.category}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rate" label="入库编号" align="center" min-width="120px">
            <template slot-scope="scope">
              <el-button type="text" @click="lookDetail(scope.row)">{{scope.row.orderNo}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="storehouseName" label="入库仓" min-width="100px"></el-table-column>
          <el-table-column prop="origin" label="货品来源" min-width="100px"></el-table-column>
          <el-table-column prop="productInfoList" label="产品名称*数量" min-width="300px">
            <template slot-scope="scope">
              <div
                v-for="(item,index) in scope.row.productInfoList"
                :class="index>3&&!showMorePro?'no-show':''"
                :key="index"
              >{{item}}</div>
              <el-button
                type="text"
                v-if="scope.row.productInfoList.length>4&&!showMorePro"
                @click="showMorePro=!showMorePro"
              >......</el-button>
              <el-button
                type="text"
                v-if="scope.row.productInfoList.length>4&&showMorePro"
                @click="showMorePro=!showMorePro"
              >收起</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120px"></el-table-column>
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
    <!-- <stock-into-info v-if="showInfoPage" :id="detailId" @close="closeInfoPage"></stock-into-info>
    <stock-into-draft v-if="showDraftPage" :id="detailId" @close="closeDraftPage"></stock-into-draft>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      datePickVal: '',
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      detailId: '',
      timeOrder: '',
      showInfoPage: false,
      showDraftPage: false,
      entryOrderList: [],
      showMorePro: false,
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
      form: {
        datePickVal: '',
        storeHouseId: '',
        category: '',
        orderNo: ''
      }
    }
  },
  created() {
    this.search()
    this.getStockList()
  },
  watch: {
    $route(val) {
      if (val.name === 'stockInTable') {
        this.screening()
      }
    }
  },
  methods: {
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
      if (rowData.orderStatus == '待入库') {
        this.showDraftPage = true
        this.$router.push({ path: `/stockInTable/draft/${rowData.id}` })
      } else {
        this.showInfoPage = true
        this.$router.push({ path: `/stockInTable/info/${rowData.id}` })
      }
      this.detailId = rowData.id
    },
    closeAndGetInfo(id) {
      this.detailId = id
      this.showInfoPage = true
    },
    closeInfoPage() {
      this.showInfoPage = false
      this.search()
    },
    closeDraftPage() {
      this.showDraftPage = false
      this.search()
    },
    sortChange({ order }) {
      let val = order == 'descending' ? 1 : 0
      this.timeOrder = val
      this.currentPage = 1
      this.search()
    },
    addNew() {
      this.$router.push('/createStockIn')
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
      let url = '/innobeautywms/entryOrder/list'
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.timeOrder === 0 || this.timeOrder === 1) {
        params.timeOrder = this.timeOrder
      }
      if (this.form.orderNo) {
        params.orderNo = this.form.orderNo
        url = '/innobeautywms/entryOrder/list/search'
      }
      if (this.form.datePickVal && this.form.datePickVal.length) {
        let startTime = this.form.datePickVal[0].getTime()
        let endTime = this.form.datePickVal[1].getTime() + 24 * 60 * 60 * 1000
        Object.assign(params, { startTime, endTime })
      }
      if (
        this.form.storeHouseId !== '' &&
        this.form.storeHouseId !== undefined
      ) {
        params.storeHouseId = this.form.storeHouseId
      }
      if (this.form.category !== '' && this.form.category !== undefined) {
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
  .main-content {
    height: calc(~'100% - 220px');
    .table-content {
      .no-show {
        display: none;
      }
      height: calc(~'100% - 100px');
      /deep/.el-table__body-wrapper {
        height: calc(~'100% - 60px');
        overflow: auto;
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