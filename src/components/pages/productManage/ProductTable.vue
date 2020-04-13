<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-button type="warning" size="medium" @click="addNew">新建</el-button>
      <el-button type="primary" size="medium" @click="exportOut">导出</el-button>
      <el-button
        type="danger"
        size="medium"
        :disabled="multipleSelection.length<1"
        @click="handleDelete"
      >删除</el-button>
    </el-row>
    <el-row class="table-content">
      <el-table
        :data="productList"
        stripe
        ref="multipleTable"
        style="height:100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="productNo" label="产品编码" align="center"></el-table-column>
        <el-table-column prop="productName" label="产品名称" align="center">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="showDetail(scope.$index, scope.row)"
              >{{scope.row.productName}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="总库存" align="center" sortable></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div style="margin-top:20px;float:right;">
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
    <product-info v-if="showInfo" :id="detailId" @close="closeInfoPage"></product-info>
  </div>
</template>

<script>
import ProductInfo from './ProductInfo'
export default {
  components: {
    ProductInfo
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      showInfo: false,
      detailId: '',
      totalRows: 0,
      productList: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    addNew() {
      this.$router.push('/createProduct')
    },
    showDetail(index, rowData) {
      this.detailId = rowData.id
      this.showInfo = true
    },
    closeInfoPage() {
      this.showInfo = false
      this.search()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    search() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      this.util.post('/innobeautywms/product/list', params).then(res => {
        if (res.data.status == 0) {
          this.productList = res.data.date.list
          this.totalRows = res.data.date.total
        }
      })
    },
    async handleDelete(rowData) {
      this.$confirm('是否确认删除？').then(async () => {
        let ids
        if (rowData.id) {
          // 删除单个
          ids = [rowData.id]
        } else {
          ids = this.multipleSelection.map(e => e.id)
        }
        const url = '/innobeautywms/product/delete'
        let res = await this.util.post(url, { ids })
        if (res.data.status == 0) {
          this.$message.success('删除成功')
          setTimeout(() => {
            this.search()
          }, 1000)
        }
      })
    },
    async exportOut() {
      let ids = this.multipleSelection.map(e => e.id)
      let url
      if (!ids.length) {
        url = '/innobeautywms/product/excel/export'
      } else {
        ids = ids.join(',')
        url = `/innobeautywms/product/excel/export?ids=${ids}`
      }
      location.href = url
    }
  }
}
</script>
<style lang="less" scoped>
.product-manage {
  background-color: #fff;
  height: 100%;
  padding: 40px;
  position: relative;
  .create {
    float: right;
  }
  .table-content {
    height: calc(~'100% - 100px');
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