<template>
  <div class="box">
    <div class="top">
      <div>
        <span class="backMain" @click="cancelOpt">智慧开关</span>
        <span class="el-icon-arrow-right">
          <span></span>{{pageType}}智慧开关
        </span>
      </div>
      <div style="font-weight: bold">{{pageType}}智慧开关</div>
    </div>
    <div class="userMessageRight_bottom">
      <div class="user_message tab">
        <el-row>
          <el-col :span="12">
            <div class="tab_header">
              <span>-</span>基本信息
            </div>
            <div class="formText">
              <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="开关名称" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="请输入开关名称(汉字、字母或数字组成的2~20位字符)"></el-input>
                </el-form-item>
                <el-form-item label="SN" prop="sn">
                  <el-input v-model="ruleForm.sn" placeholder="请输入SN" maxlength="20" @input="ruleForm.sn = ruleForm.sn.replace(/[^a-zA-Z0-9\w]/g, '')"></el-input>
                </el-form-item>
                <el-form-item label="IP" prop="ip">
                  <el-input v-model="ruleForm.ip" placeholder="请输入IP"></el-input>
                </el-form-item>
                <el-form-item label="照明一体机" prop="computerID">
                  <el-select v-model="ruleForm.computerID" placeholder="请选择照明一体机">
                    <el-option v-for="(c,index) in lightComputer" :key="'lightComputer'+index" :label="c.name" :value="c.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="tab_header">
              <span>-</span>通道设置
            </div>
            <div v-for="(item,index) in passagewayList" :key="index" class="pasway">
              <span class="labels">{{ item.label }}</span>
              <el-input v-model="item.value" size="mini" @input="item.value = item.value.replace(/^(0+)|[^\d]+/g, '')" maxlength="3" placeholder="请输入通道ID" class="inpuvalue" />
              <el-switch v-model="item.status" active-text="启用" inactive-text="禁用" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bottom">
      <p>*&nbsp;必填字段</p>
      <el-row>
        <el-button :disabled="disabled" type="primary" @click="saveSwitchInfo('ruleForm')">提交</el-button>
        <el-button @click="cancelOpt">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import baseValidator from '../../common/baseValidator.js'
export default {
  name: 'SmartSwitchEdit', //添加或编辑智慧开关
  props: {
    switchObj: {
      //智慧开关
      type: Object,
      required: true
    }
  },
  data() {
    return {
      pageType: '添加', //页面类型 pageType=添加/pageType=编辑
      ruleForm: {
        id: '',
        name: '',
        sn: '',
        ip: '',
        computerID: ''
      },
      passagewayList: [],
      lightComputer: [], //照明一体机
      rules: {
        name: [
          { required: true, message: '请输入开关名称', trigger: 'blur' },
          {
            validator: baseValidator.validateSwitchName,
            trigger: 'blur'
          }
        ],
        sn: [
          { required: true, message: '请输入SN', trigger: 'blur' },
          {
            validator: baseValidator.validateLicense,
            trigger: 'blur'
          }
        ],
        ip: [
          { required: true, message: '请输入ip', trigger: 'blur' },
          {
            validator: baseValidator.validateIP,
            trigger: 'blur'
          }
        ],
        computerID: [{ required: true, message: '请选择照明一体机', trigger: 'blur' }]
      },
      disabled: false
    }
  },
  created() {
    this.getComputerRequest()
  },
  mounted() {
    if (this.switchObj.id) {
      this.pageType = '编辑'
      this.setFormData() //表单赋值
    } else {
      this.pageType = '添加'
    }
    this.passagewayList = []
    for (let i = 0; i < 8; i++) {
      if (this.switchObj.switchGroups && this.switchObj.switchGroups.length > i) {
        this.passagewayList.push({
          label: '通道' + (i + 1),
          id: this.switchObj.switchGroups[i].id,
          value: this.switchObj.switchGroups[i].groupId,
          status: this.switchObj.switchGroups[i].status === 1
        })
      } else {
        this.passagewayList.push({
          label: '通道' + (i + 1),
          id: '',
          value: '',
          status: true
        })
      }
    }
  },
  methods: {
    /**
     * 表单赋值
     */
    setFormData() {
      this.ruleForm.id = this.switchObj.id
      this.ruleForm.name = this.switchObj.name
      this.ruleForm.ip = this.switchObj.ip
      this.ruleForm.sn = this.switchObj.sn
      this.ruleForm.computerID = this.switchObj.computer ? this.switchObj.computer.id : ''
    },
    /**
     * 保存智慧开关信息
     * @param formName {Object} form表单名称
     */
    saveSwitchInfo(formName) {
      let self = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveRequest(true)
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
      this.$emit('SmartSwitchEditCallBack', false)
    },
    /*
     * 重置表单
     */
    resetForm() {
      this.pageType = '添加'
      this.$refs['ruleForm'].resetFields()
    },
    /**
     * 保存智慧开关请求
     */
    saveRequest(flag) {
      let num = 0
      let switchGroups = []
      let flags = ''
      for (const item of this.passagewayList) {
        if (item.value !== '') {
          if (parseInt(item.value) > 255) {
            flags = item.label + '输入最大不超过255'
            break
          }
          num++
          switchGroups.push({
            id: item.id === '' ? null : item.id,
            groupId: item.value,
            status: item.status ? '1' : '0'
          })
        }
      }
      if (flags) {
        this.$message({
          type: 'error',
          message: flags
        })
        return
      }
      if (num === 0) {
        this.$message({
          type: 'error',
          message: '通道至少要有一个'
        })
        return
      }
      let self = this
      let sMsg = '添加'
      if (self.ruleForm.id) {
        sMsg = '编辑'
      } else {
        delete self.ruleForm.id
      }
      let submitForm = { ...this.ruleForm, switchGroups: switchGroups, flag: flag }
      this.disabled = true
      this.$axios
        .leansite({
          method: 'post',
          url: this.API.leansite.saveSwitch,
          data: submitForm
        })
        .then(res => {
          this.disabled = false
          var resData = res.data
          if (resData.code == 0) {
            if (resData.msg) {
              this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">提示?</div><div class="contents">' + resData.msg + '，确定继续提交?</div></div>', '', {
                customClass: 'deleteclass',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.saveRequest(true)
              })
            } else {
              self.$message({
                type: 'success',
                message: this.pageType + '智慧开关成功!'
              })
              self.resetForm() //重置表单
              //调用父组件方法--isRefresh=true需要刷新父组件的数据
              self.$emit('SmartSwitchEditCallBack', true)
            }
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: this.pageType + '智慧开关失败：' + resData.msg
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
      this.$emit('SmartSwitchEditCallBack', false)
    },
    /**
     * 获取一体机列表请求
     */
    getComputerRequest() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getComputerByPage,
          params: {}
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.lightComputer = resData.data
          } else {
            this.lightComputer = []
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.box {
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
  .pasway {
    line-height: 40px;
    .labels {
      display: inline-block;
      float: left;
      width: 60px;
      margin-left: 15px;
    }
    .inpuvalue {
      width: 50%;
      margin-right: 15px;
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
            width: 380px;
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
