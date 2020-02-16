<template>
  <div class="stock-manage">
    <el-row>
      <div class="create">
        <el-button type="primary" plain @click="createStatus=true">新建角色</el-button>
      </div>
    </el-row>
    <el-row class="table-content">
      <el-table :data="roleList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column prop="time" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="scope.row.isEdit=true" style="margin-right:20px;">修改</el-link>
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
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        ></el-pagination>
      </div>
    </el-row>
    <create-role v-if="createStatus" @createStatus="changeCreateStatus"></create-role>
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
      tableType: 'all',
      inputVal: '',
      roleList: [
        {
          roleName: '管理员',
          account: 'daddqdq',
          authority: '全部',
          useful: true,
          isEdit: false,
          children: [{ account: 'dwqd' }, { account: 'fgreggr' }],
          //必须
          addChildId: '',
          addhildName: ''
        },
        {
          roleName: '管理员',
          account: 'daddqdq',
          authority: '全部',
          useful: true,
          isEdit: false,
          children: [{ account: 'dwqd' }, { account: 'fgreggr' }],
          //必须
          addChildId: '',
          addhildName: ''
        }
      ]
    }
  },
  mounted() {},
  computed: {},
  methods: {
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    changeCreateStatus(val) {
      this.createStatus = val
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