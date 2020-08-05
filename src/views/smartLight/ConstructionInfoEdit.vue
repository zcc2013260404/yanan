<template>
  <div class="box">
    <div class="top">
      <div>
        <span class="backMain" @click="cancelOpt">施工信息</span>
        <span class="el-icon-arrow-right">
          <span></span>{{pageType}}施工信息
        </span>
      </div>
      <div class="headers">{{pageType}}施工信息</div>
    </div>
    <div class="userMessageRight_bottom">
      <div class="user_message tab">
        <div class="tab_header">
          <span>-</span>基本信息
        </div>
        <div class="formText">
          <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="企业名称">
              <el-input v-model="companyName" disabled></el-input>
            </el-form-item>
            <el-form-item label="商务人员姓名" prop="businessman">
              <el-input v-model="ruleForm.businessman" placeholder="请输入商务人员姓名(汉字、字母组成的2~20位字符)"></el-input>
            </el-form-item>
            <el-form-item label="购入Pack数量" prop="packNum">
              <el-input-number v-model="ruleForm.packNum" @blur="handleNumBlur" controls-position="right" :min="1" :max="10000" step-strictly label="请购入Pack数量" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="实施人员姓名" prop="constructorName">
              <el-input v-model="ruleForm.constructorName" placeholder="请输入实施人员姓名(汉字、字母组成的2~20位字符)"></el-input>
            </el-form-item>
            <el-form-item label="签约时间" prop="signingDate">
              <el-date-picker type="date" placeholder="选择日期" :clearable="false" :picker-options="signPickerOptions" v-model="ruleForm.signingDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="安装开始时间" prop="startTime">
              <el-date-picker v-model="ruleForm.startTime" :editable="false" :clearable="false" type="date" :picker-options="startPickerOptions" placeholder="开始日期" style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="安装结束时间" prop="endTime">
              <el-date-picker v-model="ruleForm.endTime" :editable="false" :clearable="false" type="date" :picker-options="endPickerOptions" placeholder="结束日期" style="width:100%;"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bottom">
      <p>*&nbsp;必填字段</p>
      <el-row>
        <el-button :disabled="disabled" type="primary" @click="saveRoleInfo('ruleForm')">提交</el-button>
        <el-button @click="cancelOpt">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import baseValidator from '../../common/baseValidator.js'
export default {
  name: 'ConstructionInfoEdit', //添加或编辑施工信息
  props: {
    constructionObj: {
      //施工信息
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pageType: '添加', //页面类型 pageType=添加/pageType=编辑
      ruleForm: {
        id: '',
        constructorName: '', //施工者
        businessman: '', //商务人员姓名
        packNum: 1, //购入Pack数量
        signingDate: new Date(),
        startTime: new Date(), //开始时间
        endTime: new Date(new Date().getTime() + 259200000) //结束时间
      },
      signPickerOptions: {
        disabledDate: time => {
          if (this.ruleForm.startTime) {
            return time.getTime() >= this.ruleForm.startTime.getTime()
          } else if (this.ruleForm.endTime) {
            return time.getTime() >= this.ruleForm.endTime.getTime()
          } else {
            return false
          }
        }
      },
      startPickerOptions: {
        //开始日期配置
        disabledDate: time => {
          if (this.ruleForm.signingDate) {
            if (this.ruleForm.endTime) {
              return time.getTime() <= this.ruleForm.signingDate.getTime() || time.getTime() >= this.ruleForm.endTime.getTime()
            } else {
              return time.getTime() <= this.ruleForm.signingDate.getTime()
            }
          } else if (this.ruleForm.endTime) {
            return time.getTime() <= this.ruleForm.endTime.getTime()
          } else {
            return false
          }
        }
      },
      endPickerOptions: {
        //结束日期配置
        disabledDate: time => {
          if (this.ruleForm.signingDate) {
            if (this.ruleForm.endTime) {
              return time.getTime() <= this.ruleForm.endTime.getTime()
            } else {
              return time.getTime() <= this.ruleForm.signingDate.getTime()
            }
          } else if (this.ruleForm.startTime) {
            return time.getTime() <= this.ruleForm.startTime.getTime()
          } else {
            return false
          }
        }
      },
      companyName: '', //企业名称
      rules: {
        businessman: [
          { required: true, message: '请输入商务人员姓名', trigger: 'blur' },
          {
            validator: baseValidator.validateBusinessman,
            trigger: 'blur'
          }
        ],
        constructorName: [
          { required: true, message: '请输入施工人员姓名', trigger: 'blur' },
          {
            validator: baseValidator.validateConstructor,
            trigger: 'blur'
          }
        ],
        packNum: [{ required: true, message: '请输入购入Pack数量', trigger: 'blur' }],
        signingDate: [{ required: true, message: '请选择签约时间', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择安装开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择安装结束时间', trigger: 'blur' }]
      },
      disabled: false
    }
  },
  mounted() {
    if (this.constructionObj.id) {
      this.pageType = '编辑'
      this.setFormData() //表单赋值
    } else {
      this.pageType = '添加'
      this.companyName = this.$store.getters['smartLight/getcurrCompany'].name
    }
  },
  methods: {
    /**
     * 表单赋值
     */
    setFormData() {
      this.ruleForm.id = this.constructionObj.id
      this.companyName = this.constructionObj.name
      this.ruleForm.businessman = this.constructionObj.businessPeople
      this.ruleForm.constructorName = this.constructionObj.implPeople
      this.ruleForm.packNum = this.constructionObj.packCount
      this.ruleForm.signingDate = this.constructionObj.signDate
      this.ruleForm.startTime = new Date(this.constructionObj.startDate)
      this.ruleForm.endTime = new Date(this.constructionObj.endDate)
    },
    /**
     * 监听开始时间change事件
     */
    changeStart() {
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: time => {
          if (this.ruleForm.startTime) {
            return time.getTime() < this.ruleForm.startTime
          }
        }
      })
    },
    /**
     * 监听结束时间change事件
     */
    changeEnd() {
      this.startPickerOptions = Object.assign({}, this.startPickerOptions, {
        disabledDate: time => {
          if (this.ruleForm.endTime) {
            return time.getTime() > this.ruleForm.endTime
          }
        }
      })
    },
    /**
     * 保存施工信息信息
     * @param formName {Object} form表单名称
     */
    saveRoleInfo(formName) {
      let self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveRequest()
        } else {
          return false
        }
      })
    },
    /**
     * 监听"购入Pack数量"文本框Blur事件
     */
    handleNumBlur(event) {
      if (!this.ruleForm.num || this.ruleForm.num == 0) {
        this.ruleForm.num = 1
      }
    },
    /*
     * 取消
     */
    cancelOpt() {
      this.resetForm() //重置表单
      //调用父组件方法--isRefresh=false不需要刷新父组件的数据
      this.$emit('ConstructionInfoEditCallBack', false)
    },
    /*
     * 重置表单
     */
    resetForm() {
      this.pageType = '添加'
      this.$refs['ruleForm'].resetFields()
    },
    /**
     * 保存施工信息请求
     */
    saveRequest() {
      let self = this
      let sMsg = '添加'
      if (self.ruleForm.id) {
        sMsg = '编辑'
      } else {
        delete self.ruleForm.id
      }
      let submitForm = {
        id: this.ruleForm.id,
        implPeople: this.ruleForm.constructorName, //施工者
        businessPeople: this.ruleForm.businessman, //商务人员姓名
        packCount: this.ruleForm.packNum, //购入Pack数量
        signDate: this.commonFun.dateFormat(this.ruleForm.signingDate, 'yyyy-MM-dd'),
        startDate: this.commonFun.dateFormat(this.ruleForm.startTime, 'yyyy-MM-dd'),
        endDate: this.commonFun.dateFormat(this.ruleForm.endTime, 'yyyy-MM-dd')
      }
      this.disabled = true
      this.$axios
        .leansite({
          method: 'post',
          url: this.API.leansite.saveConstruction,
          data: submitForm
        })
        .then(res => {
          this.disabled = false
          var resData = res.data
          if (resData.code == 0) {
            self.$message({
              type: 'success',
              message: this.pageType + '施工信息成功!'
            })
            self.resetForm() //重置表单
            //调用父组件方法--isRefresh=true需要刷新父组件的数据
            self.$emit('ConstructionInfoEditCallBack', true)
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: this.pageType + '施工信息失败：' + resData.msg
            })
          }
        })
        .catch(err => {
          this.disabled = false
        })
    },
    /**
     * 取消
     */
    cancelOpt() {
      // //调用父组件方法--isRefresh=false不需要刷新父组件的数据
      this.$emit('ConstructionInfoEditCallBack', false)
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.box {
  .headers {
    font-weight: bold;
    margin-top: 23px !important;
    margin-bottom: 24px !important;
  }
  .top {
    div {
      font-size: 14px;
      margin-top: 24px;
      .backMain {
        cursor: pointer;
      }
      span {
        color: #006fe6;
        margin-right: 10px;
      }
      .el-icon-arrow-right {
        color: #969696;
      }
      &:last-child {
        height: 36px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 36px;
        line-height: 36px;
        color: #323232;
        margin: 25px 0;
      }
    }
  }
  .userMessageRight_bottom {
    margin-top: 20px !important;
    .tab {
      border: solid 1px #bebebe;
      font-size: 14px;
      color: #323232;
      margin-bottom: 23px;
      padding-bottom: 20px;
      border-radius: 3px 3px 3px 3px;
      .tab_header {
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-weight: bold;
        background-color: #ffffff;
        span {
          font-weight: bold;
          font-size: 18px;
          margin-right: 10px;
          margin-left: 16px;
        }
      }
      .tab_body_select {
        width: 93%;
        margin: 20px auto;
        .el-select {
          width: 30%;
        }
        .el-button {
          width: 90px;
          height: 35px;
          border-radius: 4px;
          border: solid 1px #006fe6;
          margin-left: 8px;
        }
      }
      .tab_body {
        width: 93%;
        height: 55px;
        line-height: 55px;
        border-bottom: solid 1px #969696;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        div {
          width: 40%;
        }
        span {
          display: inline-block;
          width: 30%;
          font-size: 14px;
          line-height: 55px;
          text-align: center;
        }
        .el-icon-delete {
          color: red;
        }
      }
      .formText {
        width: 93%;
        margin-left: 16px;
        .el-form {
          .el-form-item {
            width: 350px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
  .bottom {
    p {
      color: #d0021b;
    }
    div {
      margin-top: 20px;
      .el-button {
        &:first-child {
          width: 90px;
          height: 32px;
          background-color: #006fe6;
          border-radius: 4px;
        }
        &:last-child {
          width: 90px;
          height: 32px;
          border-radius: 4px;
          border: solid 1px #006fe6;
          color: #006fe6;
        }
      }
    }
  }
}
/deep/ .el-form--label-top .el-form-item__label {
  padding: 0px !important;
  line-height: 30px;
}
</style>
