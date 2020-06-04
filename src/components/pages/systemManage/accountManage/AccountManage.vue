<template>
  <div class="account-manage">
    <el-row style="position:relative;height:40px;">
      <el-button type="warning" size="medium" @click="createAccount">新建账号</el-button>
    </el-row>
    <el-row class="table-content">
      <el-table :data="accountList" stripe ref="multipleTable" style="height:100%;">
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
            <div v-if="scope.row.state==0">
              <el-button type="text" @click="modifyOne(scope.row)">修改信息</el-button>
              <el-button type="text" @click="modifyPwd(scope.row)">修改密码</el-button>
              <el-button type="text" @click="changeStatus(scope.row)">停用</el-button>
            </div>
            <div v-else>
              <el-link type="primary" @click="changeStatus(scope.row)">启用</el-link>
            </div>
          </template>
        </el-table-column>
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
      accountList: [],
      roleMap: {
        sellerDirector: '销售主管',
        seller: '销售员',
        superAdministrator: '超级管理员'
      }
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
    modifyPwd(rowData) {
      this.$prompt(
        '是否确认修改账号为' + rowData.open_code + '的密码?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入新密码'
        }
      ).then(({ value }) => {
        if (value) {
          let url = `/innobeautywms/superAdministrator/password`
          let params = {
            userId: rowData.user_id,
            newPassword: value
          }
          this.util.post(url, params).then(res => {
            if (res.data.status === 0) {
              this.$message.success('修改账号密码成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error('未输入新密码,操作无效')
        }
      })
    },
    changeStatus(rowData) {
      let url = `/innobeautywms/account/status/${rowData.user_id}`
      this.util.post(url).then(res => {
        if (res.data.status == 0) {
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
        if (res.data.status == 0) {
          this.accountList = res.data.date.list
          this.accountList.forEach(e => {
            e.createTime = this.$moment(new Date(e.createTime)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          })
          this.totalRows = res.data.date.total
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
.account-manage {
  background-color: #fff;
  height: 100%;
  padding: 40px;
  position: relative;
  // .create {
  //   float: right;
  // }
  .table-content {
    height: calc(~'100% - 100px');
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