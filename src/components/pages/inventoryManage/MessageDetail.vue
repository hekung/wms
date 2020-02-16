<template>
  <div class="create-stock">
    <div class="el-dialog__header">
      <button type="button" aria-label="Close" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </button>
    </div>
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
              :content="scope.row.userAddress.address"
              placement="top"
            >
              <el-button type="text">收货地址</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="通知">
          <template slot-scope="scope">
            <el-link v-if="!info.hasMessage">查看历史</el-link>
            <el-link type="primary" v-if="info.hasMessage">新消息</el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
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
            <div>
              <el-popover placement="left-end" :offset="-300" width="1000" trigger="hover">
                <div>
                  <div class="track-list">
                    <ul>
                      <li class="first">
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
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
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
          <li class="first" v-if="info.hasMessage">
            <i class="node-icon"></i>
            <div>
              <el-button type="primary" plain @click="clickBackTo=!clickBackTo">回复</el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-row>
    <div v-if="clickBackTo===true">
      <VueUeditorWrap v-model="ueditorText" :config="pcEditorOption" />
      <div style="text-align:center;">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    VueUeditorWrap
  },
  props: {
    detail: Object
  },
  data() {
    return {
      info: {},
      ueditorText: '',
      clickBackTo: false,
      pcEditorOption: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: this.$config.baseUrl + 'ueditor/ueditorConfig',
        // serverUrl: 'http://localhost:8090/ueditor/ueditorConfig',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: '/vue-oms/ueditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: true
      }
    }
  },
  created() {
    if (this.detail && this.detail.id) {
      this.info = { ...this.detail }
    }
  },
  methods: {
    submit() {},
    handleClose() {
      this.$emit('detailStatus', false)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 4) {
        if (rowIndex === 0) {
          return {
            rowspan: 3,
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
  }
}
</script>
<style lang="less" scoped>
.create-stock {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  padding: 20px;
  overflow: scroll;
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