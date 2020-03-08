<template>
  <div class="stock-manage">
    <el-row>
      <div class="create">
        <el-button type="primary" plain @click="createAccount">新建账号</el-button>
      </div>
    </el-row>
    <el-row class="table-content">
      <el-table :data="accountList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="open_code" label="用户账号"></el-table-column>
        <el-table-column prop="name" label="真实姓名"></el-table-column>
        <el-table-column prop="headImg" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.headImg" alt style="height:60px;" />
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status=='1'">
              <el-link type="primary" style="margin-right:20px;" @click="modifyOne(scope.row)">修改</el-link>
              <el-link type="primary" @click="changeStatus(scope.row)">停用</el-link>
            </div>
            <div v-else>
              <el-link type="primary" @click="changeStatus(scope.row)">启用</el-link>
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
    <add-account :detail="selectItem" v-if="createStatus" @detailStatus="changeCreateStatus"></add-account>
  </div>
</template>

<script>
import AddAccount from './AddAccount'
export default {
  components: {
    // CreateRole,
    AddAccount
  },
  data() {
    return {
      createStatus: false,
      currentPage: 1,
      pageSize: 10,
      totalRows: 0,
      inputVal: '',
      selectItem: {},
      accountList: [
        {
          realName: '张三',
          accountId: 'daddqdq',
          img: '',
          role: '管理员',
          authority: '全部',
          useful: true,
          time: '2019-10-21'
        },
        {
          realName: '张三',
          accountId: 'daddqdq',
          img: '',
          role: '管理员',
          authority: '全部',
          useful: true,
          time: '2019-10-21'
        }
      ]
    }
  },
  mounted() {
    this.search()
  },
  computed: {},
  methods: {
    createAccount() {
      this.selectItem = {}
      this.createStatus = true
    },
    modifyOne(rowData) {
      this.selectItem = rowData
      this.createStatus = true
    },
    changeStatus(rowData) {
      let url = `/innobeautywms/account/status/${rowData.user_id}`
      this.util.post(url).then(res => {
        if (res.data.success) {
          this.$message.success('修改用户状态成功')
          this.search()
        } else {
          this.$message.error('修改用户状态失败')
        }
      })
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
      this.search()
    },
    search() {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      this.util.post('/innobeautywms/accounts', params).then(res => {
        if (res.data.success) {
          this.accountList = res.data.data.list
          this.totalRows = res.data.data.total
        } else {
          this.$message.error(res.data.errMsg)
        }
      })
    },
    disableAccount() {},
    deleteChildAccount() {
      this.$confirm('是否确认删除该子账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
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
    height: calc(~'100% - 200px');
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