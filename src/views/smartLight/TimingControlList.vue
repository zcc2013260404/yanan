<template>
  <div>
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="timingBox">
      <div class="listArea" v-if="!isTimingControlEdit && !isTimingExecuteResult">
        <div class="top">
          <SecondBreadcrumb />
        </div>
        <el-row class="demo-form-inline2">
          <el-col :span="22">
            <el-form :inline="true" ref="formData">
              <el-form-item label="任务名称">
                <el-input v-model="timingName" size="small" placeholder="请输入任务名称" @input="timingName=timingName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2">
            <el-button v-if="hasPermission('scheduler/insert')" size="mini" style="margin-top:3px" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>
        <div class="table">
          <el-table :data="tableData" height="calc(100vh - 286px)" empty-text="暂无数据" style="width: 100%;">
            <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
            <el-table-column prop="name" align="center" label="任务名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="switchName" align="center" label="智慧开关" show-overflow-tooltip></el-table-column>
            <el-table-column prop="scheduleCycleWeek" align="center" label="任务周期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" align="center" label="任务状态" width="150">
              <template slot-scope="scope">
                <el-tag v-if='scope.row.status==0' type="success">开启中</el-tag>
                <el-tag v-else type="danger">已关闭</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="120">
              <template slot-scope="scope">
                <el-button v-if="hasPermission('scheduler/update')" size="mini" style="margin-right: 30px;" type="text" title="编辑" @click.prevent.stop="handleEdit(scope.$index, scope.row)">
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
                <el-button v-if="hasPermission('scheduler/selectTaskSchedulerLogList')" style="margin-right: 30px;" size="mini" type="text" title="执行结果" @click.prevent.stop="handleExecuteResult(scope.$index, scope.row)">
                  <i class="iconfont leansite-sousuo1 lookIconBtn"></i>
                </el-button>
                <el-button v-if="hasPermission('scheduler/delete')" size="mini" type="text" title="删除" @click.prevent.stop="handleDelete(scope.$index, scope.row)">
                  <i class="iconfont leansite-delete deleteIconBtn"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
        </div>
      </div>
      <TimingControlEdit v-if="isTimingControlEdit" :timingObj=oTiming @TimingControlEditCallBack=TimingControlEditCallBack></TimingControlEdit>
      <TimingExecuteResult v-if="isTimingExecuteResult" :timingObj=oTiming @TimingExecuteResultCallBack=TimingExecuteResultCallBack></TimingExecuteResult>
    </div>
  </div>
</template>

<script>
import Pagination from '../../components/Pagination.vue'
import TimingControlEdit from './TimingControlEdit'
import TimingExecuteResult from './TimingExecuteResult'
import leftmenu from './leftMenu.vue'
import SecondBreadcrumb from '../../components/SecondBreadcrumb'
export default {
  name: 'TimingControlList', //定时控制列表
  components: {
    Pagination,
    TimingControlEdit,
    TimingExecuteResult,
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
      timingName: '', //
      tableData: [],
      isTimingControlEdit: false, //是否显示定时控制编辑界面
      isTimingExecuteResult: false, //是否显示执行结果界面
      oTiming: {}, //选中的定时控制对象
      isOpting: true
    }
  },
  created() {
    this.getTimingData()
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
      this.getTimingData()
    },
    /*
     * 定时控制信息组件回调方法--子组件回调数据的方法
     * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
     */
    TimingControlEditCallBack(isRefresh) {
      this.isTimingControlEdit = false
      if (isRefresh) {
        this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
        this.getTimingData()
      }
    },
    /*
     * 执行结果组件回调方法--子组件回调数据的方法
     */
    TimingExecuteResultCallBack() {
      this.isTimingExecuteResult = false
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
      this.getTimingData()
    },
    /**
     * 监听添加定时控制按钮click事件
     */
    handleAdd() {
      this.oTiming = {}
      this.isTimingControlEdit = true
    },
    /**
     * 监听table中"编辑"按钮click事件
     */
    handleEdit(index, row) {
      this.oTiming = row
      this.isTimingControlEdit = true
    },
    /**
     * 监听table中"switch"按钮click事件
     */
    changeStatus(newValue, id) {
      if (this.isOpting) {
        this.isOpting = false
        this.changeTaskStatusRequest(newValue, id)
      }
    },
    /**
     * 监听table中"执行结果"按钮click事件
     */
    handleExecuteResult(index, row) {
      this.oTiming = row
      this.isTimingExecuteResult = true
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
        this.deleteTimingRequest(row)
      })
    },
    /*
     * 日期格式化
     */
    dateFormat(row, column, cellValue, index) {
      return this.commonFun.dateFormat(cellValue, 'yyyy-MM-dd HH:mm')
    },
    /**
     * 删除定时控制接口
     * @param {Object} oTiming 定时控制对象
     */
    deleteTimingRequest(oTiming) {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.deleteTask,
          params: {
            ids: oTiming.id
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
            this.timingName = '' //重置查询条件表单
            this.getTimingData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '删除失败：' + resData.msg
            })
          }
        })
    },
    /**
     * 切换任务状态请求
     * @param {Number} statusVal 改变后的status值
     * @param {Number} taskId 任务id
     */
    changeTaskStatusRequest(statusVal, taskId) {
      let submitUrl = this.API.leansite.startTask
      if (statusVal === 1) {
        submitUrl = this.API.leansite.stopTask
      }
      this.$axios
        .leansite({
          method: 'get',
          url: submitUrl,
          params: {
            taskSchedulerId: taskId
          }
        })
        .then(res => {
          this.isOpting = true
          var resData = res.data
          if (resData.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
            this.timingName = '' //重置查询条件表单
            this.getTimingData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '操作失败：' + resData.msg
            })
            let findIndex = this.tableData.findIndex(item => {
              return item.id == taskId
            })
            if (findIndex != -1) {
              let beforeChange = statusVal == 0 ? 1 : 0
              this.tableData[findIndex].status = beforeChange
            }
          }
        })
    },
    /**
     * 多条件分页查询获取定时控制列表请求
     */
    getTimingData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getTaskByPage,
          params: {
            name: this.timingName.trim(),
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
.leftmenu {
  float: left;
  height: calc(100vh - 97px);
}
.timingBox {
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