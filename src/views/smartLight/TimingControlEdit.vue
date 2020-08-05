<template>
  <div class="box">
    <div class="top">
      <div>
        <span class="backMain" @click="cancelOpt">定时控制</span>
        <span class="el-icon-arrow-right">
          <span></span>{{pageType}}定时任务
        </span>
      </div>
      <div class="headers">{{pageType}}定时任务</div>
    </div>
    <div class="userMessageRight_bottom">
      <div class="user_message tab">
        <div class="tab_header">
          <span>-</span>基本信息
        </div>
        <div class="formText">
          <el-form label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入任务名称(2~20位字符)" @input="ruleForm.name=ruleForm.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="智能开关" prop="smartSwitchId">
              <el-select v-model="ruleForm.smartSwitchId" placeholder="请选择智能开关">
                <el-option v-for="(c,index) in aSmartSwitch" :key="'aSmartSwitch'+index" :label="c.name" :value="c.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设置周期" prop="scheduleCycle">
              <el-select v-model="ruleForm.scheduleCycle" multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in aTimeCycle" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-for="(item,index) in aTaskSchedulerDetailList" :key="'formItem'+index" :label="index==0?'设定时间':''" required>
              <el-col :span="7">
                <el-form-item :prop="'time'+(index+1)" :rules="{
								      required: true, message: '时间不能为空', trigger: 'blur'
								    }">
                  <el-time-picker style="width: 100%;" popper-class="timeselect" :key="'elTimeSelect'+index" format="HH:mm" placeholder="选择时间" v-model="ruleForm['time'+(index+1)]">
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="5">
                <el-form-item :rules="{
								      required: true, message: '请选择开灯/关灯', trigger: 'blur'
								    }">
                  <el-select :key="'elSelect'+index" v-model="ruleForm['onOff'+(index+1)]" placeholder="请选择开灯/关灯" style="width:100%;">

                    <el-option label="开灯" :value="1"></el-option>
                    <el-option label="关灯" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="ruleForm['onOff'+(index+1)] !== 0" class="line" :span="1">-</el-col>
              <el-col :span="7">
                <el-form-item v-if="ruleForm['onOff'+(index+1)] !== 0" :prop="'brightness'+(index+1)">
                  <el-input :key="'elInput2'+index" v-model="ruleForm['brightness'+(index+1)]" placeholder="瓦数(1-999)" style="width:100%;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="buttonArea" :span="3">
                <el-button icon="el-icon-plus" v-if="index==0" circle title="点我添加时间" @click.prevent="addTimeRow"></el-button>
                <el-button icon="el-icon-minus" v-else circle title="点我删除时间" @click.prevent="removeTimeRow(index)"></el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="任务描述" prop="note">
              <el-input v-model="ruleForm.note" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入任务描述(2~100位字符)">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="bottom">
      <p>*&nbsp;必填字段</p>
      <el-row>
        <el-button :disabled="disabled" type="primary" @click="saveTimingInfo('ruleForm')">提交</el-button>
        <el-button @click="cancelOpt">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import baseValidator from '../../common/baseValidator.js'
export default {
  name: 'TimingControlEdit', //添加或编辑定时任务
  props: {
    timingObj: {
      //定时任务
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
        scheduleCycle: '',
        smartSwitchId: null,
        computerID: '',
        status: 0,
        note: '',
        id1: '',
        time1: '',
        onOff1: 1, //0=关闭；1=开启
        brightness1: 70,
        id2: '',
        time2: '',
        onOff2: '',
        brightness2: '',
        id3: '',
        time3: '',
        onOff3: '',
        brightness3: '',
        id4: '',
        time4: '',
        onOff4: '',
        brightness4: '',
        id5: '',
        time5: '',
        onOff5: '',
        brightness5: '',
        id6: '',
        time6: '',
        onOff6: '',
        brightness6: ''
      },
      aSmartSwitch: [], //智能开关列表
      aTimeCycle: [
        //时间周期
        {
          id: '1',
          name: '周一'
        },
        {
          id: '2',
          name: '周二'
        },
        {
          id: '3',
          name: '周三'
        },
        {
          id: '4',
          name: '周四'
        },
        {
          id: '5',
          name: '周五'
        },
        {
          id: '6',
          name: '周六'
        },
        {
          id: '7',
          name: '周日'
        }
      ],
      aTaskSchedulerDetailList: [
        {
          brightness: 70,
          id: '',
          onOff: 0,
          time: ''
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: '请输入任务名称',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateTimingName,
            trigger: 'blur'
          }
        ],
        time1: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        time2: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        time3: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        time4: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        time5: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        time6: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        brightness1: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        brightness2: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        brightness3: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        brightness4: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        brightness5: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        brightness6: [
          {
            required: true,
            message: '瓦数(1-999)',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateBrightness,
            trigger: 'blur'
          }
        ],
        smartSwitchId: [
          {
            required: true,
            message: '请选择智能开关',
            trigger: 'blur'
          }
        ],
        scheduleCycle: [
          {
            required: true,
            message: '请选择周期',
            trigger: 'blur'
          }
        ],
        note: [
          {
            required: true,
            message: '请输入任务描述',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateDescription,
            trigger: 'blur'
          }
        ]
      },
      disabled: false
    }
  },
  created() {
    this.getSwatchRequest()
  },
  mounted() {
    if (this.timingObj.id) {
      this.pageType = '编辑'
      this.setFormData() //表单赋值
    } else {
      this.pageType = '添加'
    }
  },
  methods: {
    /**
     * 表单赋值
     */
    setFormData() {
      this.ruleForm.id = this.timingObj.id
      this.ruleForm.name = this.timingObj.name
      this.ruleForm.scheduleCycle = this.timingObj.scheduleCycle.split(',')
      this.ruleForm.smartSwitchId = this.timingObj.switchId
      this.ruleForm.note = this.timingObj.note
      this.aTaskSchedulerDetailList = this.timingObj.taskSchedulerDetailList
      this.aTaskSchedulerDetailList.forEach((item, index) => {
        this.ruleForm['id' + (index + 1)] = item.id
        this.ruleForm['onOff' + (index + 1)] = item.onOff
        this.ruleForm['time' + (index + 1)] = new Date('2020-01-01 ' + item.time)
        this.ruleForm['brightness' + (index + 1)] = (item.brightness + '').trim()
      })
    },
    /**
     * 保存定时任务信息
     * @param formName {Object} form表单名称
     */
    saveTimingInfo(formName) {
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
      this.$emit('TimingControlEditCallBack', false)
    },
    /*
     * 重置表单
     */
    resetForm() {
      this.pageType = '添加'
      this.$refs['ruleForm'].resetFields()
    },
    /**
     * 保存定时任务请求
     */
    saveRequest() {
      let self = this
      let submitForm = {
        id: this.ruleForm.id,
        name: this.ruleForm.name.trim(),
        scheduleCycle: this.ruleForm.scheduleCycle.toString(),
        switchId: this.ruleForm.smartSwitchId,
        note: this.ruleForm.note.trim(),
        taskSchedulerDetailList: []
      }
      this.aTaskSchedulerDetailList.forEach((item, index) => {
        submitForm.taskSchedulerDetailList.push({
          id: item.id,
          onOff: this.ruleForm['onOff' + (index + 1)],
          time: this.commonFun.dateFormat(this.ruleForm['time' + (index + 1)], 'HH:mm'),
          brightness: this.ruleForm['onOff' + (index + 1)] === 0 ? '' : (this.ruleForm['brightness' + (index + 1)] + '').trim()
        })
      })
      this.disabled = true
      this.$axios
        .leansite({
          method: 'post',
          url: this.API.leansite.saveTask,
          data: submitForm
        })
        .then(res => {
          this.disabled = false
          var resData = res.data
          if (resData.code == 0) {
            self.$message({
              type: 'success',
              message: this.pageType + '定时任务成功!'
            })
            self.resetForm() //重置表单
            //调用父组件方法--isRefresh=true需要刷新父组件的数据
            self.$emit('TimingControlEditCallBack', true)
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: this.pageType + '定时任务失败：' + resData.msg
            })
          }
        })
        .catch(err => {
          this.disabled = false
        })
    },
    /**
     * 监听 "+"按钮click事件
     */
    addTimeRow() {
      if (this.aTaskSchedulerDetailList.length == 6) {
        this.$message({
          type: 'warning',
          message: '定时时间不能超过6条!'
        })
        return
      }
      this.aTaskSchedulerDetailList.push({
        id: '',
        time: '',
        onOff: 0, //0=开启；1=关闭
        brightness: ''
      })
      let listLength = this.aTaskSchedulerDetailList.length
      this.ruleForm['id' + listLength] = ''
      this.ruleForm['onOff' + listLength] = 0
      this.ruleForm['time' + listLength] = ''
      this.ruleForm['brightness' + listLength] = ''
      this.aTaskSchedulerDetailList.forEach((item, index) => {
        item.id = this.ruleForm['id' + (index + 1)]
        item.onOff = this.ruleForm['onOff' + (index + 1)]
        item.time = this.ruleForm['time' + (index + 1)]
        item.brightness = (this.ruleForm['brightness' + (index + 1)] + '').trim()
      })
    },
    /**
     * 监听 "—"按钮click事件
     * @param {Number} index 选中的下标
     */
    removeTimeRow(index) {
      if (this.aTaskSchedulerDetailList.length == 1) {
        this.$message({
          type: 'warning',
          message: '定时时间至少有1条!'
        })
        return
      }
      this.ruleForm['id' + (index + 1)] = ''
      this.ruleForm['onOff' + (index + 1)] = ''
      this.ruleForm['time' + (index + 1)] = ''
      this.ruleForm['brightness' + (index + 1)] = ''
      let aSaveList = []
      for (let i = 1; i < 7; i++) {
        console.log((this.ruleForm['onOff' + i] + '').length != 0)
        if ((this.ruleForm['onOff' + i] + '').length != 0) {
          aSaveList.push({
            id: this.ruleForm['id' + i],
            time: this.ruleForm['time' + i],
            onOff: this.ruleForm['onOff' + i],
            brightness: (this.ruleForm['brightness' + i] + '').trim()
          })
        }
      }
      for (let i = 1; i < 7; i++) {
        if (i <= aSaveList.length) {
          this.ruleForm['id' + i] = aSaveList[i - 1].id
          this.ruleForm['time' + i] = aSaveList[i - 1].time
          this.ruleForm['onOff' + i] = aSaveList[i - 1].onOff
          this.ruleForm['brightness' + i] = (aSaveList[i - 1].brightness + '').trim()
        } else {
          this.ruleForm['id' + i] = ''
          this.ruleForm['time' + i] = ''
          this.ruleForm['onOff' + i] = ''
          this.ruleForm['brightness' + i] = ''
        }
      }
      this.aTaskSchedulerDetailList = aSaveList
    },
    /**
     * 获取智能开关列表请求
     */
    getSwatchRequest() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getSwitchByPage,
          params: {}
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.aSmartSwitch = resData.data
          } else {
            this.aSmartSwitch = []
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.box {
  margin: 0;
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
        width: 34%;
        margin-left: 16px;
        .line,
        .buttonArea {
          text-align: center;
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
}
</style>
