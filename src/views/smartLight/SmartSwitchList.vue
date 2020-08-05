<template>
  <div>
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="switchBox">
      <div class="listArea" v-if="!isSmartSwitchEdit">
        <div class="top">
          <SecondBreadcrumb />
        </div>
        <el-row class="demo-form-inline2">
          <el-col :span="12">
            <div v-if="!hasPermission('switch/insert')" style="height: 58px">&nbsp;</div>
            <el-form v-if="hasPermission('switch/insert')" :inline="true" ref="formData" :model="formData">
              <el-form-item label="开关名称">
                <el-input v-model="switchName" size="small" placeholder="请输入开关名称" @input="switchName=switchName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" style="margin-top:3px" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            <el-button type="primary" size="mini" style="margin-top:3px" icon="el-icon-upload2" @click="handleupdate">固件升级</el-button>
            <el-button type="primary" size="mini" style="margin-top:3px" icon="el-icon-s-tools" @click="handlesetting">网络配置</el-button>
          </el-col>
        </el-row>
        <div class="table">
          <el-table :data="tableData" height="calc(100vh - 286px)" empty-text="暂无数据" style="width: 100%;">
            <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
            <el-table-column prop="name" align="center" label="开关名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sn" align="center" label="SN" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" align="center" label="IP" show-overflow-tooltip></el-table-column>
            <el-table-column prop="computer.name" align="center" label="照明一体机" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button v-if="hasPermission('switch/update')" size="mini" style="margin-right: 30px;" type="text" title="编辑" @click.prevent.stop="handleEdit(scope.$index, scope.row)">
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
                <el-button v-if="hasPermission('switch/delete')" size="mini" style="margin-right: 30px;" type="text" title="删除" @click.prevent.stop="handleDelete(scope.$index, scope.row)">
                  <i class="iconfont leansite-delete deleteIconBtn"></i>
                </el-button>
                <el-button size="mini" type="text" title="重启" icon="el-icon-switch-button" class="restarts" @click.prevent.stop="handleRestart(scope.$index, scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
        </div>
      </div>
      <SmartSwitchEdit v-if="isSmartSwitchEdit" :switchObj=oSwitch @SmartSwitchEditCallBack=SmartSwitchEditCallBack></SmartSwitchEdit>
      <el-dialog title="网络配置" :visible.sync="settingDialog" :close-on-click-modal="false" class="dialgs" width="600px" append-to-body @close="resetFrom('machineForm')">
        <el-form v-if="settingDialog" ref="machineForm" :model="machineForm" :rules="rules" label-width="95px">
          <el-form-item label="开关" prop="switchValue">
            <el-select v-model="machineForm.switchValue" placeholder="选择智能开关" size="small" style="width: 100%;" multiple filterable collapse-tags>
              <el-option v-for="(item, index) in switchOptions" :key="item.id" :label="item.name" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由器账号" prop="ssid">
            <el-input v-model="machineForm.ssid" placeholder="请输入路由器账号" maxlength="20" @input="machineForm.ssid=machineForm.ssid.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
          </el-form-item>
          <el-form-item label="路由器密码" prop="pwd">
            <el-input v-model="machineForm.pwd" placeholder="请输入路由器密码" maxlength="20" />
          </el-form-item>
          <!-- <el-form-item label="IP地址" prop="ip">
            <el-input v-model="machineForm.ip" placeholder="请输入IP地址" />
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="settingDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm('machineForm')">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="固件升级" :visible.sync="updateDialog" :close-on-click-modal="false" class="dialgs" width="600px" append-to-body @close="resetFrom('machineForm')">
        <el-form v-if="updateDialog" ref="machineForm" :model="machineForm" :rules="rules" label-width="80px">
          <el-form-item label="开关" prop="switchValue">
            <el-select v-model="machineForm.switchValue" placeholder="请选择开关" size="small" style="width: 100%;" multiple filterable collapse-tags>
              <el-option v-for="item in switchOptions" :key="item.id" :label="item.name" :value="item.sn">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="固件" prop="gj">
            <el-select v-model="machineForm.gj" placeholder="请选择固件" size="small" style="width: 100%;" filterable>
              <el-option v-for="(item, index) in gjList" :key="item.id" :label="item.name + '('+item.version+')'" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm('machineForm')">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '../../components/Pagination.vue'
import SmartSwitchEdit from './SmartSwitchEdit'
import leftmenu from './leftMenu.vue'
import SecondBreadcrumb from '../../components/SecondBreadcrumb'
import baseValidator from '../../common/baseValidator.js'
export default {
  name: 'SmartSwitchList', //智慧开关列表
  components: {
    Pagination,
    SmartSwitchEdit,
    leftmenu,
    SecondBreadcrumb
  },
  data() {
    return {
      companyName: '',
      pageObj: {
        pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
        total: 0, //数据总数
        pageSize: this.API.leansite.constObj.pageSize //页大小
      },
      switchName: '', //
      switchOptions: [],
      settingDialog: false,
      updateDialog: false,
      gjList: [],
      machineForm: {
        switchValue: [],
        ssid: '',
        pwd: '',
        ip: '',
        gj: ''
      },
      rules: {
        ip: [
          {
            required: true,
            message: '请输入IP地址',
            trigger: 'blur'
          },
          {
            validator: baseValidator.validateIP,
            trigger: 'blur'
          }
        ],
        pwd: [
          {
            required: true,
            message: '请输入路由器密码',
            trigger: 'blur'
          }
        ],
        switchValue: [
          {
            required: true,
            message: '请选择开关',
            trigger: 'blur'
          }
        ],
        gj: [
          {
            required: true,
            message: '请选择固件',
            trigger: 'blur'
          }
        ],
        ssid: [
          {
            required: true,
            message: '请输入路由器账号',
            trigger: 'blur'
          }
        ]
      },
      tableData: [],
      formData: {},
      isSmartSwitchEdit: false, //是否显示智慧开关编辑界面
      oSwitch: {} //选中的智慧开关对象
    }
  },
  created() {
    this.getSwitchData()
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
    /*
     * 分页组件回调方法--子组件回传数据的方法
     * @page_obj {Object} 分页信息
     * page_obj.page_index 当前页下标
     * page_obj.page_size 页大小
     */
    PageTurning(page_obj) {
      this.pageObj.pageIndex = page_obj.page_index
      this.pageObj.pageSize = page_obj.page_size
      this.getSwitchData()
    },
    /*
     * 智慧开关信息组件回调方法--子组件回调数据的方法
     * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
     */
    SmartSwitchEditCallBack(isRefresh) {
      this.isSmartSwitchEdit = false
      if (isRefresh) {
        this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
        this.getSwitchData()
      }
    },
    /**
     * 跳转至企业列表
     */
    jumpCompany() {
      this.$store.dispatch('smartLight/setLightChildMenuPath', {
        data: '/enterprisesList'
      })
    },
    /**
     * 监听table search事件
     */
    handleSearch() {
      this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
      this.getSwitchData()
    },
    /**
     * 监听添加智慧开关按钮click事件
     */
    handleAdd() {
      this.oSwitch = {}
      this.isSmartSwitchEdit = true
    },
    resetFrom(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        if (this.settingDialog) {
          let ip = ''
          let datalist = []
          let sns = ''
          for (const item of this.machineForm.switchValue) {
            if (this.switchOptions[item].computer) {
              if (sns === '') {
                sns = this.switchOptions[item].sn
              } else {
                sns = sns + ',' + this.switchOptions[item].sn
              }
              if (ip !== this.switchOptions[item].computer.ip) {
                ip = this.switchOptions[item].computer.ip
                datalist.push({
                  sns: sns + '',
                  dev_type: '1',
                  t: {
                    ip: ip,
                    password: this.machineForm.pwd,
                    ssid: this.machineForm.ssid
                  }
                })
                sns = ''
              }
            }
          }
          for (const item of datalist) {
            let se = this.$axios
              .leansite({
                method: 'post',
                url: this.API.leansite.wifiSwitch,
                data: item
              })
              .then(res => {
                if (res.data.code === 0) {
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              })
          }
          this.$message({
            type: 'success',
            message: '指令已发送'
          })
          setTimeout(() => {
            this.$refs[formName].resetFields()
            this.settingDialog = false
          })
        } else {
          this.$axios
            .leansite({
              method: 'post',
              url: this.API.leansite.firmwareVersionUpdate,
              data: {
                sns: this.machineForm.switchValue.join(','),
                dev_type: '1',
                t: {
                  id: this.gjList[this.machineForm.gj].id,
                  address: this.gjList[this.machineForm.gj].address,
                  name: this.gjList[this.machineForm.gj].name,
                  version: this.gjList[this.machineForm.gj].version
                }
              }
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '指令已发送!'
                })
                this.updateDialog = false
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            })
        }
      })
    },
    handleupdate() {
      this.machineForm = {
        switchValue: [],
        ssid: '',
        pwd: '',
        ip: '',
        gj: ''
      }
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.firmwareVersionList,
          params: {
            pageNum: 1,
            pageSize: 999999
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.gjList = res.data.data.list
          }
        })
      this.getSwitchList()
      this.updateDialog = true
    },
    getSwitchList() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getSwitchByPage,
          params: {
            name: '',
            pageNum: 1,
            pageSize: 999999
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.switchOptions = resData.data.list
          }
        })
    },
    handlesetting() {
      this.machineForm = {
        switchValue: [],
        ssid: '',
        pwd: '',
        ip: '',
        gj: ''
      }
      this.getSwitchList()
      this.settingDialog = true
    },
    handleRestart(index, row) {
      this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">操作提示?</div><div class="contents">确定重启吗？</div></div>', '', {
        customClass: 'deleteclass',
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '重启',
        cancelButtonText: '取消'
      }).then(() => {
        this.$axios
          .leansite({
            method: 'post',
            url: this.API.leansite.restartSwitch,
            params: {
              sns: row.sn
            }
          })
          .then(res => {
            var resData = res.data
            if (resData.code == 0) {
              this.$message({
                type: 'success',
                message: '指令已发送！'
              })
            }
          })
      })
    },
    /**
     * 监听table中"编辑"按钮click事件
     */
    handleEdit(index, row) {
      this.oSwitch = row
      this.isSmartSwitchEdit = true
    },
    /**
     * 监听table中"删除"按钮click事件
     */
    handleDelete(index, row) {
      this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">确定删除该数据吗?</div><div class="contents">删除数据之后，数据将不可恢复。</div></div>', '', {
        customClass: 'deleteclass',
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteSwitchRequest(row)
      })
    },
    /*
     * 日期格式化
     */
    dateFormat(row, column, cellValue, index) {
      return this.commonFun.dateFormat(cellValue, 'yyyy-MM-dd HH:mm')
    },
    /**
     * 删除智慧开关接口
     * @param {Object} oSwitch 智慧开关对象
     */
    deleteSwitchRequest(oSwitch) {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.deleteSwitch,
          params: {
            ids: oSwitch.id
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
            this.switchName = '' //重置查询条件表单
            this.getSwitchData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '删除失败：' + resData.msg
            })
          }
        })
    },
    /**
     * 多条件分页查询获取智慧开关列表请求
     */
    getSwitchData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getSwitchByPage,
          params: {
            name: this.switchName.trim(),
            pageNum: this.pageObj.pageIndex,
            pageSize: this.pageObj.pageSize
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.code == 0) {
            this.tableData = resData.data.list
            this.pageObj.total = resData.data.total
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.dialgs {
  /deep/ .el-button--mini {
    padding: 7px 20px;
    background-color: #006fe6;
    border-color: #006fe6;
    margin-top: 1px;
  }
  /deep/ .el-button--text {
    color: #006fe6;
  }
  .dialog-footer {
    /deep/ .el-button {
      padding: 7px 20px;
      border-color: #006fe6;
    }
    /deep/ .el-button--default {
      color: #006fe6;
    }
    /deep/ .el-button--primary {
      background-color: #006fe6;
      border-color: #006fe6;
      margin-top: 1px;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
  }
  .infosty {
    height: 32px;
  }
  /deep/ .el-dialog__body {
    margin-top: -15px;
    margin-bottom: 10px;
  }
}
.leftmenu {
  float: left;
  height: calc(100vh - 97px);
}
.switchBox {
  height: calc(100vh - 105px);
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
  }
  h2 {
    margin: 10px 0;
    font-size: 36px;
    color: #323232;
    font-weight: normal;
  }
  .el-row {
    border-bottom: 1px solid #bebebe;
    .el-form-item {
      margin-bottom: 22px;
    }
    .el-col {
      &:last-child {
        text-align: right;
      }
    }
  }
  .listArea {
    .top {
      margin-bottom: 22px;
      div {
        font-size: 14px;
        margin-top: 23px;
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
      }
    }
  }
  .table {
    border-left: 1px solid #bebebe;
    border-right: 1px solid #bebebe;
    border-bottom: 1px solid #bebebe;
    padding-left: 10px;
    padding-right: 10px;
    .restarts {
      font-size: 18px;
    }
    .el-table {
      border-radius: 3px;
    }
  }
  /*修改table线条颜色*/
  /deep/ .el-table td,
  /deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #bebebe !important;
    color: #323232;
  }
  .el-table--border::after,
  .el-table--group::after {
    background-color: #bebebe;
  }
  .el-table::before {
    background: #fff;
  }
}
</style>