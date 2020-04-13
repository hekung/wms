<template>
  <div class="stock-manage">
    <el-row>
      <div class="create">
        <el-button type="primary" plain @click="createStatus=true">新建角色</el-button>
      </div>
    </el-row>
    <el-row class="table-content">
      <el-table :data="roleList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="name" label="角色"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="modifyView(scope.row)" style="margin-right:20px;">修改</el-link>
              <el-link type="primary" @click="deleteRole(scope.$index, scope.row)">删除</el-link>
            </div>
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
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRows"
        ></el-pagination>
      </div>
    </el-row>
    <create-role v-if="createStatus" @createStatus="changeCreateStatus" :detail="selectedItem"></create-role>
  </div>
</template>

<script>
import CreateRole from './CreateRole'
export default {
  components: {
    CreateRole
  },
  data() {
    return {
      createStatus: false,
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      tableType: 'all',
      inputVal: '',
      selectedItem: {},
      roleList: []
    }
  },
  mounted() {
    this.search()
  },
  computed: {},
  methods: {
    search() {
      let url = '/innobeautywms/roles'
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      this.util.post(url, params).then(res => {
        if (res.data.success) {
          this.roleList = res.data.data.list
          this.totalRows = res.data.data.total
        }
      })
    },
    modifyView(rowData) {
      this.selectedItem = rowData
      this.createStatus = true
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
        this.search()
        this.selectedItem = {}
      }
    },
    deleteRole() {}
  }
}
</script>
<style lang="less" scoped>
.stock-manage {
  background-color: #f5f5f5;
  height: 100%;
  padding: 20px;
  position: relative;
  .create {
    float: right;
  }
  .table-content {
    height: calc(~'100% - 140px');
    margin-top: 40px;
    /deep/.el-table__body-wrapper {
      height: calc(~'100% - 48px');
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