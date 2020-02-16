<template>
  <div class="layout">
    <div class="url"></div>
    <div class="url"></div>
    <div class="url"></div>
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item,index) in list" :key="index">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>
<script>
import bus from './bus'
export default {
  data() {
    return {
      list: ['仓库管理', '商品管理']
    }
  },
  created() {
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    // bus.$on('tags', msg => {
    //     let arr = [];
    //     for (let i = 0, len = msg.length; i < len; i++) {
    //         msg[i].name && arr.push(msg[i].name);
    //     }
    //     this.tagsList = arr;
    // });
    bus.$on('router-change', val => {
      switch (val) {
        case 'index':
          this.list = ['仓储管理', '仓库管理']
          break
        case 'housingNotice':
          this.list = ['仓储管理', '入库']
          break
        case 'stockOut':
          this.list = ['仓储管理', '出库']
          break
      }
    })
  }
}
</script>
<style lang="less" scoped>
.layout {
  background-color: #eeeeee;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #999;

  .url {
    float: left;
    width: 50px;
    height: 50px;
    background-color: rgb(50, 65, 87);
    visibility: hidden;
    margin-left: 20px;
    margin-top: 10px;
  }
  .bread {
    float: left;
    margin-left: 50px;
    height: 100%;
    line-height: 100%;
    padding-top: 28px;
  }
}
</style>