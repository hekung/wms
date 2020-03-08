<template>
  <div class="create-stock">
    <div class="el-dialog__header">
      <button type="button" aria-label="Close" class="el-dialog__headerbtn">
        <i class="el-dialog__close el-icon el-icon-close" @click="handleClose"></i>
      </button>
    </div>
    <el-row class="table-content">
      <el-table
        :data="this.info.productList"
        border
        :span-method="objectSpanMethod"
        class="table"
        ref="multipleTable"
        style="height:100%;"
      >
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="productNo" label="商品编码"></el-table-column>
        <el-table-column prop="quantity" label="入库量">
          <template slot-scope="scope">
            <span>{{info.storehouseName+'('+scope.row.quantity+')'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template slot-scope="scope">
            <div v-html="scope.row.remark" class="remark"></div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="当前状态">
          <template slot-scope="scope">
            <span :class="info.status==0?'green':'gray'">{{info.status==0?'等待入库':'完成'}}</span>
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
          <li class="first" v-if="info.status==0">
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
      info: {
        status: '',
        storehouseName: '',
        productList: [],
        remark: ''
      },
      ueditorText: '',
      clickBackTo: false,
      pcEditorOption: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: this.$config.baseUrl + 'ueditor/ueditorConfig',
        // serverUrl: 'http://localhost:8090/ueditor/ueditorConfig',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: this.util.getCommonUrl() + '/ueditor/',
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
      this.info.status = this.detail.status
      this.info.storehouseName = this.detail.storehouseName
      this.getDetail(this.detail.id)
    }
  },
  methods: {
    submit() {},
    getDetail(id) {
      let url = `/innobeautywms/ordermanager/entryorderdetail/${id}`
      this.util.get(url).then(res => {
        if (res.data.success) {
          let { remark, entryOrderDetailVoList } = res.data.data
          this.info.remark = remark
          this.info.productList = entryOrderDetailVoList
          this.info.productList.forEach(item => {
            item.remark = remark
          })
        } else {
          this.$message.error(res.data.errMsg)
        }
      })
    },
    handleClose() {
      this.$emit('detailStatus', false)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 2) {
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
.gray {
  color: #666;
}
.remark {
  /deep/ img {
    width: 100%;
  }
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