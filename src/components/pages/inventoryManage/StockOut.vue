<template>
  <div class="product-manage">
    <el-row style="position:relative;height:40px;"></el-row>
    <el-row class="table-content">
      <el-table :data="productList" border class="table" ref="multipleTable" style="height:100%;">
        <el-table-column prop="productName" label="商品图片/名称" align="center"></el-table-column>
        <el-table-column prop="price" label="单价" align="center">
          <template slot-scope="scope">
            <span style="color:rgb(230, 11, 48);">¥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storage" label="库存" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="orderInfo" label="收货信息" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="scope.row.orderInfo.name"
              placement="top"
            >
              <el-button type="text">姓名</el-button>
            </el-tooltip>
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="scope.row.orderInfo.tel"
              placement="top"
            >
              <el-button type="text">手机号</el-button>
            </el-tooltip>
            <el-tooltip
              class="item-pop"
              effect="dark"
              :content="scope.row.orderInfo.address"
              placement="top"
            >
              <el-button type="text">收货地址</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="orderInfo" label="实收" align="center">
          <template slot-scope="scope">
            <p>¥{{scope.row.orderInfo.allMoney}}</p>
            <p>（含快递：¥{{scope.row.orderInfo.yunFee}}）</p>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="出货仓" align="center">
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
        <el-table-column label="物流公司" align="center" prop="productName"></el-table-column>
        <el-table-column label="运单" align="center" prop="productName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="productName"></el-table-column>
        <el-table-column label="发货时间" align="center" prop="productName"></el-table-column>
        <el-table-column label="操作" align="center" prop="num">
          <template slot-scope="scope">
            <div>
              <el-popover
                placement="left-end"
                :offset="-300"
                width="1000"
                trigger="hover"
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
                <el-button type="text" slot="reference">出库完成</el-button>
              </el-popover>

              <el-popover
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
              </el-popover>
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
      lastOrderNum: '',
      ruleForm: {
        company: '',
        num: '',
        comment: ''
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
    // let dom = `<tr class="item-head">
    //                 <td colspan="8" class="no-br"><i>订单号：</i><i>{{item.orderNum}}</i><i>创建时间：</i><i>{{item.createDate}}</i></td>
    //             </tr>`
    // $('.el-table__row').before(dom)
    $('.el-table__row').each((index, item) => {
      let orderNum = this.productList[index].orderNum
      let createDate = this.productList[index].createDate
      if (orderNum === this.lastOrderNum) return
      let dom = `<tr class="item-head">
                    <td colspan="12" class="no-br"><i>订单号：</i><i>${orderNum}</i><i style="margin-left: 20px;">创建时间：</i><i>${createDate}</i></td>
                </tr>`
      $(item).before(dom)
      this.lastOrderNum = orderNum
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