<template>
  <div class="product-content">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="form">
      <div class="title">
        <span>基本信息</span>
      </div>
      <el-form-item label="产品名称：" prop="productName">
        <el-input v-model="ruleForm.productName" placeholder="请输入产品名称" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品编码：" prop="productNo">
        <el-input v-model="ruleForm.productNo" placeholder="请输入产品编码" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品图片：">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="onSuccessPC"
          :before-upload="beforeUpload"
          action="/innobeautywms/imgUpload"
        >
          <img v-if="imageUrlPC" :src="imageUrlPC" class="avatar" />
          <div v-else style="height:100%;line-height:120px;">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Sku编码：" prop="skuNo">
        <el-input v-model="ruleForm.skuNo" placeholder="请输入Sku编码" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产地：" prop="productArea">
        <el-select v-model="ruleForm.productArea" placeholder="请选择产地" size="small">
          <el-option label="加拿大" value="加拿大"></el-option>
          <el-option label="日本" value="日本"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格：" prop="productSpecification">
        <el-input v-model="ruleForm.productSpecification" placeholder="请输入规格" size="small"></el-input>
      </el-form-item>
      <el-form-item label="产品批号：" prop="productBatchNumber">
        <el-input v-model="ruleForm.productBatchNumber" placeholder="请输入产品批号" size="small"></el-input>
      </el-form-item>
      <el-form-item label="单品毛重(g)：" prop="singleWeight">
        <el-input v-model="ruleForm.singleWeight" size="small"></el-input>
      </el-form-item>
      <div class="title">
        <span>扩展信息</span>
      </div>
      <el-form-item label="单品尺寸mm(长宽高)：">
        <div class="df">
          <el-input v-model="length" size="small"></el-input>
          <span>*</span>
          <el-input v-model="width" size="small"></el-input>
          <span>*</span>
          <el-input v-model="height" size="small"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="中箱内产品数(个)：">
        <el-input v-model="ruleForm.middleBoxProductNumber" size="small"></el-input>
      </el-form-item>
      <el-form-item label="中箱尺寸mm(长宽高)：">
        <div class="df">
          <el-input v-model="binLength" size="small"></el-input>
          <span>*</span>
          <el-input v-model="binWidth" size="small"></el-input>
          <span>*</span>
          <el-input v-model="binHeight" size="small"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="内盒产品数(个)：">
        <el-input v-model="ruleForm.innerProductNumber" size="small"></el-input>
      </el-form-item>
      <el-form-item label="内盒数(盒/箱)：">
        <el-input v-model="ruleForm.innerBoxProductNumber" size="small"></el-input>
      </el-form-item>
      <el-form-item label="箱产品数(产品数/箱)：">
        <el-input v-model="ruleForm.caseProductNumber" size="small"></el-input>
      </el-form-item>
      <el-form-item label="箱规mm(长宽高)：">
        <div class="df">
          <el-input v-model="binLength2" size="small"></el-input>
          <span>*</span>
          <el-input v-model="binWidth2" size="small"></el-input>
          <span>*</span>
          <el-input v-model="binHeight2" size="small"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="最小发货数：">
        <el-input v-model="ruleForm.minShipNumber" size="small" class="ib"></el-input>
        <el-select v-model="ruleForm.deliveryUnit" placeholder="单位" size="small" class="ib">
          <el-option label="个" value="个"></el-option>
          <el-option label="盒" value="盒"></el-option>
          <el-option label="包" value="包"></el-option>
          <el-option label="张" value="张"></el-option>
          <el-option label="本" value="本"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="发货单位：">
        <el-input v-model="ruleForm.deliveryUnit" size="small"></el-input>
      </el-form-item>-->

      <div class="buttons">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const validateFixedTo = (rule, value, callback) => {
      const reg = /^(0|[1-9]\d*)(.\d{1,2})?$/
      if (!value || !reg.test(String(value).trim())) {
        callback(new Error('请输入正确的数字'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      stockId: '',
      storeHouseList: [],
      headImg: '',
      imageUrlPC: '',
      length: '',
      width: '',
      height: '',
      binLength: '',
      binWidth: '',
      binHeight: '',
      binLength2: '',
      binWidth2: '',
      binHeight2: '',
      ruleForm: {
        productName: '',
        productNo: '',
        mainImage: '',
        skuNo: '',
        singleWeight: '',
        productStockPileFormList: [],
        productArea: '',
        productSpecification: '',
        productBatchNumber: '',
        middleBoxProductNumber: '',
        innerProductNumber: '',
        innerBoxProductNumber: '',
        caseProductNumber: '',
        minShipNumber: '',
        deliveryUnit: '',
        singleProductSize: '',
        middleBoxProductSize: '',
        caseSpecification: ''
      },
      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productNo: [
          { required: true, message: '请输入产品编码', trigger: 'blur' }
        ],
        skuNo: [{ required: true, message: '请输入Sku编码', trigger: 'blur' }],
        singleWeight: [{ validator: validateFixedTo, required: true }],
        volume: [{ validator: validateFixedTo }],
        productArea: [
          { required: true, message: '请输入产地', trigger: 'blur' }
        ],
        productSpecification: [
          { required: true, message: '请输入规格', trigger: 'blur' }
        ],
        productBatchNumber: [
          { required: true, message: '请输入产品批号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStoreHouseList()
  },
  methods: {
    onSuccessPC(response, file, fileList) {
      this.imageUrlPC = URL.createObjectURL(file.raw)
      this.ruleForm.mainImage = response.date
    },
    beforeUpload(file) {
      const isJPG = /(gif|jpg|jpeg|png|GIF|JPG|PNG|SVG|svg)$/.test(file.type)
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        this.$message.error('只能是图片格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      // 禁止自动上传
      if (!isJPG || !isLt3M) {
        return false
      }
    },
    async getStoreHouseList() {
      const url = '/innobeautywms/storehouse/list'
      let res = await this.util.get(url)
      if (res.data.status == 0) {
        this.storeHouseList = res.data.date
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addProduct()
        } else {
          this.$message.error('有必填项未填')
        }
      })
    },
    async addProduct() {
      const url = '/innobeautywms/product'
      let params = JSON.parse(JSON.stringify(this.ruleForm))
      params.singleProductSize =
        this.length + '*' + this.width + '*' + this.height
      params.middleBoxProductSize =
        this.binLength + '*' + this.binWidth + '*' + this.binHeight
      params.caseSpecification =
        this.binLength2 + '*' + this.binWidth2 + '*' + this.binHeight2
      let res = await this.util.post(url, params)
      if (res.data.status == 0) {
        this.$message.success('创建产品成功')
        setTimeout(() => {
          this.$router.push('/index')
        }, 1000)
      } else {
        this.$message.error(res.data.msg)
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.product-content {
  background-color: #fff;
  height: 100%;
  padding: 20px 40px;
  position: relative;
  overflow: auto;
  .ib {
    display: inline-block;
    width: 100px;
    margin-right: 10px;
  }
  .form {
    .avatar-uploader {
      /deep/ .el-upload--text {
        width: 120px;
        height: 120px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .title {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 20px;
    }
    .buttons {
      text-align: center;
      margin-top: 30px;
    }
    .df {
      display: flex;
      /deep/ .el-input {
        width: 100px;
      }
      span {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>