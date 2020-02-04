<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-radio-group
        v-model="tableType"
        style="position:absolute;left:50%;transform:translateX(-50%)"
      >
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="onOut">等待入库</el-radio-button>
        <el-radio-button label="undercarriage">入库完成</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="table-content">
      <el-table :data="productList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column type="selection" width="55" label="选择"></el-table-column>
        <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="productName" label="商品编码" align="center"></el-table-column>
        <el-table-column prop="productName" label="价格"></el-table-column>
        <el-table-column prop="storage" label="入库量">
          <template slot-scope="scope">
            <div>{{scope.row.storage}}</div>
            <div>{{scope.row.status}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="入库仓">
          <template slot-scope="scope">
            <div style="padding:5px;">
              <span>A</span>
              <span
                style="display:inline-block;border:1px solid #ccc;margin-left:10px;padding:5px;"
              >{{scope.row.num.a}}</span>
            </div>
            <div style="padding:5px;">
              <span>B</span>
              <span
                style="display:inline-block;border:1px solid #ccc;margin-left:10px;padding:5px;"
              >{{scope.row.num.a}}</span>
            </div>
            <div style="padding:5px;">
              <span>C</span>
              <span
                style="display:inline-block;border:1px solid #ccc;margin-left:10px;padding:5px;"
              >{{scope.row.num.a}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常商品数量" align="center" prop="num">
          <template slot-scope="scope">
            <div>
              <el-input
                v-model="scope.row.unusual"
                v-show="scope.row.status==='onOut'&&scope.row.isEdit"
              ></el-input>
              <span v-show="scope.row.status!=='onOut' || !scope.row.isEdit">{{scope.row.unusual}}</span>
              <el-button
                @click="scope.row.isEdit=true"
                v-show="scope.row.status==='onOut'&& !scope.row.isEdit"
              >编辑</el-button>
              <el-button
                @click="scope.row.isEdit=false"
                v-if="scope.row.status==='onOut'&& scope.row.isEdit"
              >确定</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="num">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="confirmHosing" v-if="scope.row.status==='onOut'">确认入库</el-button>
              <el-button type="text">留言</el-button>
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
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  components: {},
  data() {
    return {
      name: localStorage.getItem('ms_username'),
      createStatus: false,
      currentPage: 1,
      tableType: 'all',
      inputVal: '',
      productList: [
        {
          id: '111111',
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: 'onOut',
          unusual: '52',
          hubType: 'a',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          },
          isEdit: false
        },
        {
          id: '111111',
          orderNum: '122231311553',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: 'onOut',
          unusual: '52',
          storage: '12',
          sellCount: '220',
          hubType: 'a',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          isEdit: false,
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          id: '111111',
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          unusual: '52',
          isEdit: false,
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          hubType: 'a',
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          hubType: 'a',
          isEdit: false,
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          hubType: 'a',
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          hubType: 'a',
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          hubType: 'a',
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          hubType: 'a',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        },
        {
          orderNum: '122231311551',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          status: '已付款',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          hubType: 'a',
          orderInfo: {
            name: '张三',
            tel: '187888888',
            address: '广东省深圳市。。。。。。',
            allMoney: '15999',
            yunFee: '15',
            hub: 'A'
          }
        }
      ]
    }
  },
  mounted() {
    // let dom = `<tr class="item-head">
    //                 <td colspan="8" class="no-br"><i>订单号：</i><i>{{item.orderNum}}</i><i>创建时间：</i><i>{{item.createDate}}</i></td>
    //             </tr>`
    // $('.el-table__row').before(dom)
    $('.el-table__row').each((index, item) => {
      let orderNum = this.productList[index].orderNum
      let createDate = this.productList[index].createDate
      let dom = `<tr class="item-head">
                    <td colspan="8" class="no-br"><i>订单号：</i><i>${orderNum}</i><i style="margin-left: 20px;">创建时间：</i><i>${createDate}</i></td>
                </tr>`
      $(item).before(dom)
    })
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户'
    }
  },
  methods: {
    changeDate() {
      const now = new Date().getTime()
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000)
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`
      })
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    changeCreateStatus(val) {
      this.createStatus = val
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