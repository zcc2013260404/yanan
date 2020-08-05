<template>
  <div>
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="constructionBox">
      <div class="listArea">
        <div class="top">
          <SecondBreadcrumb />
        </div>
        <h1>添加施工区域</h1>
        <el-form v-if="hasPermission('area/insert')" :inline="true" label-position="left" ref="formData" :model="ruleForm" :rules="rules" class="demo-form-inline2">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="ruleForm.areaName" size="small" placeholder="区域名称(汉字、字母或数字组成的2~20位字符)" style="width:350px;" @blur="checkName"></el-input>
          </el-form-item>
          <el-form-item label="区域图纸" prop="imageName">
            <el-input v-model="ruleForm.imageName" size="small" readonly placeholder="选中的图纸路径" style="width:250px;"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-upload ref="uploadImg" class="upload-demo" :action="actionUp" :show-file-list='false' :limit="1" :file-list="fileList" :before-upload="beforeFile" :http-request="uploadImage">
              <el-button size="mini" style="padding: 7px 17px;" icon="el-icon-upload2" type="primary">上传图纸</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="disabled" type="primary" size="mini" icon="el-icon-plus" @click="handleAddArea('formData')">添加</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="table-title"><span>-</span>区域地图</div> -->
        <div class="container">
          <el-row>
            <el-col :span="8" v-for="(item,index) in areaImageData" :key="'areaImageData'+index">
              <div class="deviceTypeDiv" :key="'areaImage'+index">
                <div class="topImg">
                  <el-image :src="API.leansite.baseURL+item.imagePath" fit="cover">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <i v-if="hasPermission('area/delete')" class="deleteIcon iconfont leansite-delete" @click="handleDelete(item)" />
                </div>
                <div class="bottomContent">
                  <span>{{item.area}}</span>
                </div>
              </div>
            </el-col>
          </el-row>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftmenu from './leftMenu.vue'
import SecondBreadcrumb from '../../components/SecondBreadcrumb'
import baseValidator from '../../common/baseValidator.js'
export default {
  name: 'ConstructionAreaList', //施工区域列表
  components: {
    leftmenu,
    SecondBreadcrumb
  },
  data() {
    return {
      companyName: '',
      actionUp: 'aaaa',
      fileList: [],
      ruleForm: {
        imageDataId: '', //上传图片后返回的dataId
        areaName: '', //搜索框绑定的值
        imagePath: '', //上传后返回的图片路径
        imageName: '' //图片名称
      },
      areaImageData: [],
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let newValue = value.trim()
              let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/
              let aFilterResult = this.areaImageData.filter((currentValue, index, arr) => {
                return currentValue.area == value.trim()
              }, this)
              if (newValue.length == 0) {
                callback(new Error('请输入区域名称(汉字、字母或数字组成的2~20位字符)'))
              } else if (!reg.test(newValue)) {
                callback(new Error('区域名称必须是汉字、字母或数字组成的2~20位字符'))
              } else if (aFilterResult.length > 0) {
                callback(new Error('区域名称重复!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        imageName: [{ required: true, message: '请选择区域图片', trigger: 'blur' }]
      },
      disabled: false
    }
  },
  created() {
    this.getAreaImgData()
  },
  mounted() {
    let company = null
    if (this.$store.getters['smartLight/getcurrCompany']) {
      company = this.$store.getters['smartLight/getcurrCompany']
    }
    if (company) {
      this.companyName = company.name
    }
  },
  methods: {
    /**
     * 跳转至企业列表
     */
    jumpCompany() {
      this.$store.dispatch('smartLight/setLightChildMenuPath', {
        data: '/enterprisesList'
      })
    },
    /**
     * 监听添加按钮事件
     */
    handleAddArea(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addAreaRequest()
        } else {
          return false
        }
      })
    },
    /**
     * 监听 "区域名称" 输入框input事件
     */
    checkName() {
      let aFilterResult = this.areaImageData.filter((currentValue, index, arr) => {
        currentValue.name == this.ruleForm.areaName.trim()
      }, this)
      if (aFilterResult.length > 0) {
      }
    },
    /**
     * 监听"删除"按钮click事件
     */
    handleDelete(oAreaImg) {
      this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">确定删除该条数据?</div><div class="contents">删除数据之后，数据将不可恢复。</div></div>', '', {
        customClass: 'deleteclass',
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteConstructionRequest(oAreaImg)
      })
    },
    /**
     * 文件上传之前 判断格式
     */
    beforeFile(file) {
      let name = file.name
      let type = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
      if (type != 'png' && type != 'jpg' && type != 'jpeg') {
        this.$message({
          type: 'warning',
          message: '请上传png/jpg/jpeg格式图片！'
        })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
    },
    /**
     * 点击确定上传（图片）
     */
    uploadImage(item) {
      let formDatas = new FormData()
      formDatas.append('file', item.file)
      formDatas.append('isAdd', true)
      this.upLoadImageRequest(formDatas)
    },
    /**
     * 删除施工信息接口
     * @param {Object} oConstruction 施工区域对象
     */
    deleteConstructionRequest(oConstruction) {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.deleteArea,
          params: {
            ids: oConstruction.id
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.$refs.formData.resetFields() //重置表单
            this.getAreaImgData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '删除失败：' + resData.msg
            })
          }
        })
    },
    /**
     * 多条件分页查询获取施工区域列表请求
     */
    getAreaImgData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getAreaFindList
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.areaImageData = resData.data
          }
        })
    },
    /**
     * 上传图片接口
     */
    upLoadImageRequest(fileObj) {
      this.$axios
        .leansite({
          method: 'POST',
          url: this.API.leansite.upLoadImg,
          data: fileObj,
          heards: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.$refs.uploadImg.clearFiles() //上传成功之后清除历史记
          var resData = res.data
          if (resData.code == 0) {
            this.ruleForm.imagePath = resData.data.path
            this.ruleForm.imageDataId = resData.data.dataId
            this.ruleForm.imageName = resData.data.name + '.' + resData.data.suffix
            this.$message({
              type: 'success',
              message: '上传成功！'
            })
          }
        })
    },
    /**
     * 添加区域请求
     */
    addAreaRequest(fileObj) {
      this.disabled = true
      this.$axios
        .leansite({
          method: 'POST',
          url: this.API.leansite.saveArea,
          data: {
            area: this.ruleForm.areaName,
            id: this.ruleForm.imageDataId,
            imagePath: this.ruleForm.imagePath
          }
        })
        .then(res => {
          this.disabled = false
          var resData = res.data
          if (resData.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功！'
            })
            this.$refs.formData.resetFields() //重置表单
            this.getAreaImgData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '添加失败：' + resData.msg
            })
          }
        })
        .catch(err => {
          this.disabled = false
        })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.leftmenu {
  float: left;
  height: calc(100vh - 97px);
}
.constructionBox {
  height: calc(100vh - 97px);
  padding-bottom: 24px;
  height: -webkit-calc(100vh - 105px);
  height: -moz-calc(100vh - 105px);
  overflow-y: auto;
  margin: 0 auto;
  padding: 0 40px;
  .demo-form-inline2 {
    /deep/ .el-button--mini {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
    /deep/ .el-form-item {
      margin-bottom: 24px;
    }
  }
  .listArea {
    margin-bottom: 24px;
    h1 {
      padding: 0 10px 10px 0;
      margin-top: -5px;
      font-weight: normal;
      font-size: 36px;
      font-weight: bold;
      color: #323232;
      padding-bottom: 22px;
    }
    .table-title {
      height: 48px;
      line-height: 48px;
      margin: 24px 0 0;
      padding: 0 16px;
      border: solid 1px #bebebe;
      border-radius: 3px 3px 0 0;
      span {
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }
    }
    .container {
      background-color: #ffffff;
      border: solid 1px #bebebe;
      // border-top: none;
      padding: 0 0 20px;
      .deviceTypeDiv {
        width: calc(100% - 46px);
        height: 295px;
        background-color: #ffffff;
        border-radius: 3px;
        margin: 23px auto 0;
        .topImg {
          width: 100%;
          height: 275px;
          background-color: #f0f0f0;
          text-align: center;
          position: relative;
          .el-image {
            width: 100%;
            height: 100%;
            /deep/ .image-slot {
              height: 275px;
              line-height: 275px;
              i {
                font-size: 30px;
              }
            }
          }
          .deleteIcon {
            cursor: pointer;
            color: #f62447;
            font-size: 15px;
            position: absolute;
            bottom: 1px;
            right: 1px;
            padding: 0px 11px;
            background-color: #fff;
            border-radius: 3px;
          }
          .deleteIcon:hover {
            background-color: #f62447;
            color: #ffffff;
          }
        }
        .bottomContent {
          height: 22px;
          width: 100%;
          text-align: center;
          span {
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 24px;
            letter-spacing: 0px;
            color: #323232;
          }
        }
      }
    }
  }
}
</style>