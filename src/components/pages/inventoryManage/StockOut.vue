<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;">
      <el-radio-group
        v-model="tableType"
        style="position:absolute;left:50%;transform:translateX(-50%)"
      >
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="wait">等待出库的订单</el-radio-button>
        <el-radio-button label="history">历史出库单</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="table-content">
      <el-table
        :data="productsList"
        border
        class="table"
        ref="multipleTable"
        style="height:100%;"
        :span-method="objectSpanMethod"
      >
        <el-table-column prop="productName" label="商品图片/名称" align="center">
          <template slot-scope="scope">
            <div>
              <img :src="scope.row.productPictureUrl" alt class="product-img" />
              <span>{{scope.row.productName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center">
          <template slot-scope="scope">
            <span style="color:rgb(230, 11, 48);">¥{{scope.row.productPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="userAddress" label="收货信息" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="scope.row.userAddress.nickName"
              placement="top"
            >
              <el-button type="text">姓名</el-button>
            </el-tooltip>
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="scope.row.userAddress.tel"
              placement="top"
            >
              <el-button type="text">手机号</el-button>
            </el-tooltip>
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="util.getOrderAddress(scope.row.userAddress)"
              placement="top"
            >
              <el-button type="text">收货地址</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="subtotal" label="实收款(元)" align="center">
          <template slot-scope="scope">
            <p>¥{{scope.row.subtotal}}</p>
            <p>（含快递：¥）</p>
          </template>
        </el-table-column>
        <el-table-column prop="stockPileForVoList" label="出货仓">
          <template slot-scope="scope">
            <div>
              <div
                style="font-size:10px;"
                v-for="(item, index) in scope.row.stockPileForVoList"
                :key="index"
              >
                <span>{{item.stockname}}</span>
                <!-- <span
                  style="display:inline-block;border:1px solid #ccc;margin-left:10px;padding:2px;color: #ccc;"
                >{{item.quantity}}</span>-->
                <el-input
                  :placeholder="item.quantity"
                  v-model="item.number"
                  :disabled="scope.row.orderStatus!==1"
                  class="stock-input-num"
                ></el-input>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" align="center" prop="aaa"></el-table-column>
        <el-table-column label="运单" align="center" prop="ddd"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
        <el-table-column label="发货时间" align="center" prop="ccc"></el-table-column>
        <el-table-column prop="status" label="通知">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="toggleMessageDetail(true,scope.row)"
              v-if="scope.row.orderStatus=='1'|| scope.row.orderStatus=='2'"
            >新消息</el-link>
            <el-link v-else @click="toggleMessageDetail(true,scope.row)">查看历史</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus=='2'">
              <el-popover placement="left-end" :offset="-300" trigger="hover">
                <div>
                  <div>
                    <p>填写物流信息</p>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item label="物流公司：" prop="title">
                            <el-input v-model="ruleForm.expressName" placeholder="请输入"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="快递单号：" prop="code">
                            <el-input v-model="ruleForm.expressNo" placeholder="请输入"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="备注：">
                            <el-input v-model="ruleForm.remark" placeholder="请输入"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-form-item style="transform:translateX(-60px); text-align:center;">
                        <el-button type="primary" @click="submitForm(scope.row)">确认发货</el-button>
                        <el-button @click="handleClose">取消</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <el-button type="text" slot="reference">出库完成</el-button>
              </el-popover>

              <!-- <el-popover
                placement="left-end"
                :offset="-300"
                width="1000"
                trigger="hover"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                style="margin-left:20px;"
              >
                <div>
                  <div class="track-list">
                    <ul>
                      <li>
                        <i class="node-icon"></i>
                        <span class="time">2016-03-10 18:07:15</span>
                        <span class="txt">感谢您购物，欢迎您再次光临！</span>
                      </li>
                      <li>
                        <i class="node-icon"></i>
                        <span class="time">2016-03-10 18:07:15</span>
                        <span class="txt">配送员【申国龙】已出发，联</span>
                      </li>
                      <li>
                        <i class="node-icon"></i>
                        <span class="time">2016-03-10 18:07:15</span>
                        <span class="txt">感谢您在京东购物，欢迎您再次光临！</span>
                      </li>
                      <li class="first">
                        <i class="node-icon"></i>
                        <div>
                          <p>填写物流信息</p>
                          <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="120px"
                          >
                            <el-row>
                              <el-col :span="24">
                                <el-form-item label="物流公司：" prop="title">
                                  <el-input v-model="ruleForm.company" placeholder="请输入"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="24">
                                <el-form-item label="快递单号：" prop="code">
                                  <el-input v-model="ruleForm.num" placeholder="请输入"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="24">
                                <el-form-item label="备注：">
                                  <el-input v-model="ruleForm.comment" placeholder="请输入"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-form-item style="transform:translateX(-60px); text-align:center;">
                              <el-button type="primary" @click="submitForm('ruleForm')">确认发货</el-button>
                              <el-button @click="handleClose">取消</el-button>
                            </el-form-item>
                          </el-form>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <el-button type="text" slot="reference">留言</el-button>
              </el-popover>-->
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
    <message-detail
      v-if="showMessageDetail"
      :detail="selectStockItem"
      @detailStatus="toggleMessageDetail"
    ></message-detail>
  </div>
</template>

<script>
import MessageDetail from './MessageDetail'
import $ from 'jquery'
export default {
  components: { MessageDetail },
  data() {
    return {
      name: localStorage.getItem('ms_username'),
      currentPage: 1,
      pageSize: 10,
      productsList: [],
      orderList: [],
      showMessageDetail: false,
      totalRows: 0,
      tableType: 'all',
      inputVal: '',
      lastOrderNum: '',
      ruleForm: {
        expressName: '',
        expressNo: '',
        remark: ''
      },
      rules: {
        company: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
      },
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
          orderNum: '122231311551',
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
          orderNum: '122231311534',
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
          orderNum: '122231311556',
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
          orderNum: '122231311556',
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
    this.search()
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '普通用户'
    }
  },
  methods: {
    toggleMessageDetail(isShow, rowData) {
      this.showMessageDetail = isShow
      if (rowData) {
        let id = rowData.orderIdReal
        this.selectStockItem = this.productsList.filter(e => {
          return e.orderIdReal == id
        })
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    search() {
      $('.item-head').remove()
      let url = '/innobeautywms/ordermanager/orders'
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      switch (this.tableType) {
        case 'all':
          params.allOrderflag = true
          break
        case 'wait':
          params.orderStatus = '2'
          break
        case 'history':
          params.historyflag = true
          break
      }

      this.util.post(url, params).then(res => {
        if (res.data.success) {
          let orderList = res.data.data.list
          this.orderList = orderList
          this.totalRows = res.data.data.rowsTotal
          // 各个订单的商品数量组成的数组
          this.orderProNums = orderList.map(item => {
            return item.orderDetailVoList.length
          })
          // 计算数组前n项之和的方法
          const preNtotal = (arr, n) => {
            arr.reduce((pre, cur, index) => {
              if (index > n - 1) {
                return pre
              } else {
                return pre + cur
              }
            })
          }
          // 获取到每个订单的第一个商品的索引值
          // let orderFirstProIndexArr = [0]
          // this.orderProNums.forEach((ele, index) => {
          //   orderFirstProIndexArr.push(preNtotal(this.orderProNums, index))
          // })
          // this.orderFirstProIndexArr = orderFirstProIndexArr

          //对返回数据进行处理
          let productsList = []
          orderList.forEach(order => {
            let orderInfo = Object.assign({}, order)
            delete orderInfo.orderDetailVoList
            orderInfo.orderIdReal = orderInfo.id
            delete orderInfo.id
            // Object.assign(order.orderDetailList[0], orderInfo)
            order.orderDetailVoList.forEach(item => {
              Object.assign(item, orderInfo)
            })
            Array.prototype.push.apply(productsList, order.orderDetailVoList)
          })
          this.productsList = productsList
          let orderFirstProIndexArr = []
          let oldOrderIdReal = ''
          this.productsList.forEach((item, index) => {
            if (item.orderIdReal !== oldOrderIdReal) {
              orderFirstProIndexArr.push(index)
              oldOrderIdReal = item.orderIdReal
            }
          })
          console.log(this.productsList)
          this.orderFirstProIndexArr = orderFirstProIndexArr

          this.$nextTick(() => {
            $('.el-table__row').each((index, item) => {
              let orderNum = this.productsList[index].orderId
              let createDate = this.productsList[index].createdAt
              if (orderNum === this.lastOrderNum) return
              let dom = `<tr class="item-head">
                            <td colspan="12" class="no-br"><i>订单号：</i><i>${orderNum}</i><i style="margin-left: 20px;">创建时间：</i><i>${createDate}</i></td>
                        </tr>`
              $(item).before(dom)
              this.lastOrderNum = orderNum
            })
          })
        } else {
          this.$message.error(res.data.errMsg)
        }
      })
    },
    submitForm(rowData) {
      let url = '/innobeautywms/ordermanager/finishShip'
      let { expressName, expressNo, remark } = this.ruleForm
      let {
        orderIdReal,
        userAddress: { nickName, tel, address }
      } = rowData
      let params = {
        expressName,
        expressNo,
        remark,
        id: orderIdReal,
        consignee_realname: nickName,
        consignee_address: address,
        consignee_telphone: tel
      }
      this.util.post(url, params).then(res => {
        console.log(res.data)
      })
    },
    handleClose() {
      this.ruleForm.expressName = ''
      this.ruleForm.expressNo = ''
      this.ruleForm.remark = ''
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 6) {
        if (this.orderFirstProIndexArr.includes(rowIndex)) {
          let rowspan = this.orderProNums[
            this.orderFirstProIndexArr.indexOf(rowIndex)
          ]
          return {
            rowspan: rowspan,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  },
  watch: {
    tableType() {
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
  .item-pop {
    display: block;
    text-align: center;
    margin: auto;
  }
}
</style>
<style scoped>
.product-img {
  width: 80px;
  height: 80px;
  margin: auto;
  display: block;
}
.track-rcol {
  width: 900px;
  border: 1px solid #eee;
}
.track-list {
  margin: 20px;
  padding-left: 5px;
  position: relative;
}
.track-list li {
  position: relative;
  padding: 9px 0 0 25px;
  width: 50%;
  line-height: 18px;

  color: #999;
}
.track-list li:nth-child(2n + 1) {
  border-right: 1px solid #d9d9d9;
}
.track-list li:nth-child(2n) {
  border-left: 1px solid #d9d9d9;
  transform: translateX(100%);
}
.track-list li.first {
  color: red;
  padding-top: 0;
  border-left-color: #fff;
}
.track-list li .node-icon {
  position: absolute;
  top: 5px;
  width: 11px;
  height: 11px;
  background: url(../../../assets/img/order-icons.png) -21px -72px no-repeat;
}
.track-list li:nth-child(2n) .node-icon {
  left: -6px;
}
.track-list li:nth-child(2n + 1) .node-icon {
  right: -6px;
}
.track-list li.first .node-icon {
  background-position: 0 -72px;
}
.track-list li .time {
  margin-right: 20px;
  position: relative;
  top: 4px;
  display: inline-block;
  vertical-align: middle;
}
.track-list li .txt {
  max-width: 600px;
  position: relative;
  top: 4px;
  display: inline-block;
  vertical-align: middle;
}
.track-list li.first .time {
  margin-right: 20px;
}
.track-list li.first .txt {
  max-width: 600px;
}
</style>