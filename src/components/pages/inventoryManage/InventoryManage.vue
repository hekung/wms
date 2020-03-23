<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-radio-group
        v-model="tableType"
        style="position:absolute;left:50%;transform:translateX(-50%)"
      >
        <el-radio-button label="all">全部商品</el-radio-button>
        <el-radio-button label="onSell">上架中的商品</el-radio-button>
        <el-radio-button label="noSell">未上架的商品</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="table-content">
      <el-table :data="productList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="productImgList" label="商品图片" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.productImgList.length">
              <img :src="getImgSrc(scope.row.productImgList)" alt style="width:100%;height:120px;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" align="center">
          <template slot-scope="scope">
            <div>
              <el-link
                type="primary"
                @click="showDetail(scope.$index, scope.row)"
              >{{scope.row.productName}}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productNo" label="商品编码" align="center"></el-table-column>
        <el-table-column prop="productPrice" label="单价" align="center" sortable>
          <template slot-scope="scope">
            <span style="color:rgb(230, 11, 48);">¥{{scope.row.productPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storage" label="总库" align="center" sortable></el-table-column>
        <el-table-column prop="storage" label="各仓库库存" align="center">
          <template slot-scope="scope">
            <div
              style="padding:5px;"
              v-for="(item, index) in scope.row.stockPileForVoList"
              :key="index"
            >
              <span style="font-size:10px;">{{item.stockname}}</span>
              <span
                style="display:inline-block;border:1px solid #ccc;margin-left:10px;padding:2px;"
              >{{item.quantity}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sellCount" label="销量" align="center" sortable></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin-top:40px;float:left;">
        <label>搜索：</label>
        <el-input
          v-model="inputVal"
          placeholder="请输入内容"
          v-on:keyup.enter.native="search"
          style="display:inline-block;width:300px;"
        ></el-input>
      </div>
      <div style="margin-top:40px;float:right;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,30,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRows"
        ></el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      createStatus: false,
      currentPage: 1,
      pageSize: 10,
      tableType: 'all',
      totalRows: 0,
      inputVal: '',
      productList: []
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    getImgSrc(imgList = []) {
      let item = imgList.find(e => e.category === 0)
      if (item) {
        return item.imgAddr
      } else {
        return ''
      }
    },
    showDetail(index, rowData) {
      this.createStatus = true
      this.selectItem = rowData
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
      this.search(this.tableType)
    },
    search() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (this.translateStatus === '2') {
        params.alleffective = true
      } else {
        params.productStatus = this.translateStatus
      }
      this.util
        .post('/innobeautywms/productmanager/products', params)
        .then(res => {
          if (res.data.success) {
            this.productList = res.data.data.list
            this.productList.map(item => {
              let num = item.stockPileForVoList.reduce(
                (acc, cur, index, arr) => {
                  return acc + cur.quantity
                },
                0
              )
              item.storage = num
            })
            this.totalRows = res.data.data.rowsTotal
          } else {
            this.$message.error(res.data.errMsg)
          }
        })
    },
    createProduct() {
      this.selectItem = {}
      this.createStatus = true
    }
  },
  watch: {
    tableType(val) {
      this.currentPage = 1
      this.search(val)
    }
  },
  computed: {
    translateStatus() {
      const map = {
        all: '2',
        onSell: '0',
        noSell: '1'
      }
      return map[this.tableType]
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
      height: calc(~'100% - 50px');
      overflow: auto;
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
</style>