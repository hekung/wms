<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-radio-group
        v-model="tableType"
        style="position:absolute;left:50%;transform:translateX(-50%)"
      >
        <el-radio-button label="all">全部商品</el-radio-button>
        <el-radio-button label="onOut">上架中的商品</el-radio-button>
        <el-radio-button label="undercarriage">已下架的商品</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="table-content">
      <el-table :data="productList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="productName" label="商品图片" align="center"></el-table-column>
        <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="code" label="商品编码" align="center"></el-table-column>
        <el-table-column prop="productName" label="价格"></el-table-column>
        <el-table-column prop="storage" label="总库"></el-table-column>
        <el-table-column prop="num" label="各仓库库存" sortable>
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
        <el-table-column prop="sellCount" label="销量" sortable></el-table-column>
        <el-table-column prop="createDate" label="创建时间" sortable></el-table-column>
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
          status: '已付款',
          hubType: 'a',
          sellCount: '133',
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
          id: '111111',
          orderNum: '122231311553',
          createDate: '2019-02-11 09:09:28',
          productName: '资生堂蒂花之秀............................',
          price: '999.00',
          number: '2',
          buyer: 'daychang',
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          status: '已付款',
          storage: '12',
          sellCount: '220',
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
          id: '111111',
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
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          buyer: 'daychang',
          status: '已付款',
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
          num: {
            a: '122',
            b: '1254',
            c: '444'
          },
          status: '已付款',
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
    // $('.el-table__row').each((index, item) => {
    //   let orderNum = this.productList[index].orderNum
    //   let createDate = this.productList[index].createDate
    //   let dom = `<tr class="item-head">
    //                 <td colspan="8" class="no-br"><i>订单号：</i><i>${orderNum}</i><i>创建时间：</i><i>${createDate}</i></td>
    //             </tr>`
    //   $(item).before(dom)
    // })
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