<template>
  <div class="product-manage table-page">
    <div class="main-content">
      <div class="btn-container">
        <el-button type="warning" size="small" class="clear-btn" @click="addNew">新建产品</el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="multipleSelection.length<1"
          class="clear-btn"
          @click="handleDelete"
        >删除</el-button>
      </div>
      <div class="table-content">
        <el-table
          :data="productList"
          stripe
          ref="multipleTable"
          style="height:100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50" :index="getIndex"></el-table-column>
          <el-table-column prop="mainImage" label="产品图片" align="center">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.mainImage" alt srcset style="height:20px;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="skuNo" label="SKU编码" min-width="120"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="150">
            <template slot-scope="scope">
              <div>
                <el-button
                  type="text"
                  @click="showDetail(scope.$index, scope.row)"
                >{{scope.row.productName}}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="productSpecification" label="规格" width="120"></el-table-column>
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
      </div>
      <div class="page-shift-container">
        <div class="page-shift">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,30,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalRows"
          ></el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
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
    getIndex(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },
    showDetail(index, rowData) {
      this.detailId = rowData.id
      this.showInfo = true
      this.$router.push({ path: `/index/info/${rowData.id}` })
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
  .table-selector {
    padding: 10px;
    .clear-btn {
      font-size: 12px;
      padding-left: 40px;
      padding-right: 40px;
    }
  }
  .main-content {
    height: calc(~'100% - 100px');
    margin-top: 0;
    .btn-container {
      padding: 10px;
      padding-left: 18px;
      border-bottom: 1px solid #f1f1f1;
      .clear-btn {
        padding: 10px 40px;
      }
    }
    .table-content {
      height: calc(~'100% - 100px');
      /deep/.el-table__body-wrapper {
        height: calc(~'100% - 48px');
        overflow: auto;
      }
    }
    /deep/ .el-table td,
    /deep/ .el-table th {
      padding: 7px 0 !important;
    }
    /deep/ .el-table .el-button {
      padding: 6px 6px !important;
    }
  }
}
</style>