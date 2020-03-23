<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-radio-group
        v-model="tableType"
        style="position:absolute;left:50%;transform:translateX(-50%)"
      >
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="1">等待入库</el-radio-button>
        <el-radio-button label="2">入库完成</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="table-content">
      <el-table
        :data="stockList"
        border
        class="table"
        ref="multipleTable"
        style="height:100%;"
        @expand-change="expandClick"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.productList" :span-method="objectSpanMethod">
              <el-table-column label="商品名称" prop="productName"></el-table-column>
              <el-table-column label="商品编码" prop="productNo"></el-table-column>
              <el-table-column label="入库量" prop="quantity"></el-table-column>
              <el-table-column label="备注" prop="remark">
                <template slot-scope="scope">
                  <div v-html="scope.row.remark" class="remark"></div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="productList" label="入库详情">
          <template slot-scope="scope">
            <el-button type="warning" @click="viewProducts(scope.row)" plain>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="当前状态">
          <template slot-scope="scope">
            <span :class="statusMap[scope.row.status][1]">{{statusMap[scope.row.status][0]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeHouseName" label="入库仓(数量)">
          <template slot-scope="scope">
            <span>{{scope.row.storehouseName+'('+scope.row.number+')'}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="123344e334" label="通知">
          <!-- <template slot-scope="scope">
            <el-link v-if="scope.row.status==2" @click="toggleMessageDetail(true,scope.row)">查看历史</el-link>
            <el-link
              type="primary"
              @click="toggleMessageDetail(true,scope.row)"
              v-if="scope.row.status==1"
            >
              <span class="new-message">
                新消息
                <i class="message-count" v-if="scope.row.newMessage">{{scope.row.newMessage}}</i>
              </span>
            </el-link>
          </template>-->
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleFinish(scope.row)"
              :disabled="scope.row.status!=1"
            >入库完成</el-button>
            <el-button type="text" @click="handleBack(scope.row)" :disabled="scope.row.status!=1">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin-top:40px;float:left;">
        <label>搜索：</label>
        <el-input v-model="inputVal" placeholder="请输入内容" style="display:inline-block;width:300px;"></el-input>
      </div>
      <div style="margin-top:40px;float:right;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10 ,30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRows"
        ></el-pagination>
      </div>
    </el-row>
    <housing-message
      v-if="showMessageDetail"
      :detail="selectStockItem"
      @detailStatus="toggleMessageDetail"
    ></housing-message>
  </div>
</template>

<script>
import HousingMessage from './HousingMessage'
import { mapState } from 'vuex'
import $ from 'jquery'
export default {
  components: {
    HousingMessage
  },
  data() {
    return {
      statusMap: {
        0: ['等待通知入库', 'red'],
        1: ['等待入库', 'yellow'],
        2: ['入库完成', 'green']
      },
      createStatus: false,
      showMessageDetail: false,
      selectStockItem: {},
      currentPage: 1,
      tableType: 'all',
      inputVal: '',
      pageSize: 10,
      totalRows: 0,
      productsPullDown: false,
      stockList: []
    }
  },
  mounted() {
    this.search()
  },
  computed: {
    ...mapState({
      userId: state => state.user.userData.userId
    })
  },
  methods: {
    search() {
      let url = '/innobeautywms/ordermanager/entryorders'
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.tableType !== 'all') {
        params.status = this.tableType
      } else {
        params.allStatus = true
      }
      this.util.post(url, params).then(res => {
        if (res.data.success) {
          this.stockList = res.data.data.list
          this.stockList.forEach(item => {
            item.isExpand = false
          })
          this.totalRows = res.data.data.rowsTotal
        } else {
          this.$message.error(res.data.errMsg)
        }
      })
    },
    toggleMessageDetail(isShow, rowData) {
      this.showMessageDetail = isShow
      if (rowData) {
        this.selectStockItem = rowData
      }
    },
    async viewProducts(rowData) {
      let index = this.stockList.findIndex(item => item === rowData)
      let dom = $(`.el-table__expand-icon`)[index]
      if (rowData.isExpand) {
        dom.click()
        return
      }
      if (!rowData.productList) {
        await this.productsDetail(rowData, dom)
      }
    },
    async expandClick(row) {
      if (row.isExpand) {
        return
      }
      let index = this.stockList.findIndex(item => item === row)
      let dom = $(`.el-table__expand-icon`)[index]
      if (!row.productList) {
        await this.productsDetail(row, dom)
      } else {
        row.isExpand = !row.isExpand
      }
    },
    async productsDetail(rowData, dom) {
      let id = rowData.id
      let url = `/innobeautywms/ordermanager/entryorderdetail/${id}`
      const { data } = await this.util.get(url)
      if (data.success) {
        data.data.entryOrderDetailVoList.map(item => {
          this.$set(item, 'remark', data.data.remark)
        })
        this.$set(rowData, 'productList', data.data.entryOrderDetailVoList)
      } else {
        this.$message.error(data.errMsg)
      }
      this.$nextTick(() => {
        rowData.isExpand = true
        dom.click()
      })
      return data
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
    changeCreateStatus(val) {
      this.createStatus = val
      if (!val) {
        this.selectStockItem = {}
      }
    },
    handleFinish(rowData) {
      let entryOrderId = rowData.id
      let { orderId, type } = rowData
      let url = `/innobeautywms/ordermanager/entryorder/finishEntryOrder`
      this.util.post(url, { orderId, type, entryOrderId }).then(res => {
        if (res.data.success) {
          this.currentPage = 1
          this.search()
        } else {
          this.$message.error('请求错误，请联系技术人员')
        }
      })
    },
    handleBack(rowData) {
      let entryorderId = rowData.id
      let url = `/innobeautywms/ordermanager/entryorder/disallowance/${entryorderId} `
      this.util.post(url).then(res => {
        if (res.data.success) {
          this.currentPage = 1
          this.search()
        } else {
          this.$message.error('请求错误，请联系技术人员')
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        if (rowIndex === 0) {
          return {
            rowspan: 20,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    confirmHosing() {
      this.$confirm('是否确认入库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消入库'
          })
        })
    }
  },
  watch: {
    tableType(val) {
      this.currentPage = 1
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
.product-manage {
  background-color: #f5f5f5;
  height: 100%;
  padding: 20px;
  position: relative;
  .create {
    float: right;
  }
  .table-content {
    height: calc(~'100% - 120px');
    /deep/.el-table__body-wrapper {
      height: calc(~'100% - 48px');
      overflow: auto;
    }
    .remark {
      /deep/ img {
        width: 100%;
      }
    }
    .new-message {
      position: relative;
      .message-count {
        position: absolute;
        background-color: #ff0000;
        height: 16px;
        font-size: 10px;
        line-height: 16px;
        min-width: 16px;
        text-align: center;
        border-radius: 8px;
        color: #fff;
      }
    }
  }
  .item-head {
    background-color: #ccc;
    border: 1px solid #bbb;
    height: 40px;
    line-height: 40px;
    span {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
.green {
  color: rgb(85, 171, 52);
}
.gray {
  color: #666;
}
</style>