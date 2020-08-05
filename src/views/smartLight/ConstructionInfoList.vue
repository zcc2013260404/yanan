<template>
  <div>
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="constructionBox">
      <div class="listArea" v-if="!isConstructionInfoEdit">
        <div class="top">
          <SecondBreadcrumb />
        </div>
        <el-row class="demo-form-inline2">
          <el-col :span="22">
            <el-form :inline="true" ref="formData" :model="formData">
              <el-form-item label="实施人员姓名">
                <el-input v-model="formData.constructorName" size="small" placeholder="请输入实施人员姓名" @input="formData.constructorName=formData.constructorName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')"></el-input>
              </el-form-item>
              <el-form-item label="安装时间段">
                <el-col :span="11">
                  <el-form-item>
                    <el-date-picker v-model="formData.startTime" :editable="false" size="small" type="date" :picker-options="startPickerOptions" placeholder="开始日期" style="width:100%;" @change="changeStart"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1">至</el-col>
                <el-col :span="11">
                  <el-form-item>
                    <el-date-picker v-model="formData.endTime" :editable="false" size="small" type="date" :picker-options="endPickerOptions" placeholder="结束日期" style="width:100%;" @change="changeEnd"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" style="margin-left: -25px" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2">
            <el-button v-if="hasPermission('construction/insert')" size="mini" style="margin-top:3px" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>
        <div class="table">
          <el-table :data="tableData" height="calc(100vh - 286px)" empty-text="暂无数据" style="width: 100%">
            <el-table-column type="index" width="70" align="center" label="序号">
              <template slot-scope="scope">
                {{API.leansite.constObj.pageSize * (API.leansite.constObj.pageIndex-1)*1+scope.$index*1+1}}
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="企业名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessPeople" align="center" label="商务人员姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="packCount" align="center" label="购入Pack数量"></el-table-column>
            <el-table-column prop="implPeople" align="center" label="实施人员姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="signDate" align="center" label="签约日期"></el-table-column>
            <el-table-column prop="startDate" align="center" label="安装开始日期"></el-table-column>
            <el-table-column prop="endDate" align="center" label="安装结束日期"></el-table-column>
            <el-table-column align="center" label="操作" width="130">
              <template slot-scope="scope">
                <el-button v-if="hasPermission('construction/update')" size="mini" style="margin-right: 50px;" type="text" title="编辑" @click.prevent.stop="handleEdit(scope.$index, scope.row)">
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
                <el-button v-if="hasPermission('construction/delete')" size="mini" type="text" title="删除" @click.prevent.stop="handleDelete(scope.$index, scope.row)">
                  <i class="iconfont leansite-delete deleteIconBtn"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
        </div>
      </div>
      <ConstructionInfoEdit v-if="isConstructionInfoEdit" :constructionObj=oConstruction @ConstructionInfoEditCallBack=ConstructionInfoEditCallBack></ConstructionInfoEdit>
    </div>
  </div>
</template>

<script>
import leftmenu from './leftMenu.vue'
import SecondBreadcrumb from '../../components/SecondBreadcrumb'
import Pagination from '../../components/Pagination.vue'
import ConstructionInfoEdit from './ConstructionInfoEdit'
export default {
  name: 'ConstructionInfoList', //施工信息列表
  components: {
    leftmenu,
    Pagination,
    ConstructionInfoEdit,
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
      formData: {
        constructorName: '', //搜索框绑定的值
        startTime: '', //开始时间
        endTime: '' //结束时间
      },
      tableData: [],
      isConstructionInfoEdit: false, //是否显示施工信息编辑界面
      oConstruction: {}, //选中的施工信息对象
      startPickerOptions: {
        //开始日期配置
        disabledDate: time => {
          if (this.formData.endTime !== '' && this.formData.endTime !== null) {
            return time.getTime() > this.formData.endTime
          } else {
            return false
          }
        }
      },
      endPickerOptions: {
        //结束日期配置
        disabledDate: time => {
          if (this.formData.startTime != '' && this.formData.startTime != null) {
            return time.getTime() <= this.formData.startTime
          } else {
            return false
          }
        }
      }
    }
  },
  created() {
    this.getConstructionData()
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
      this.getConstructionData()
    },
    /*
     * 施工信息信息组件回调方法--子组件回调数据的方法
     * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
     */
    ConstructionInfoEditCallBack(isRefresh) {
      this.isConstructionInfoEdit = false
      if (isRefresh) {
        this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
        this.getConstructionData()
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
     * 监听开始时间change事件
     */
    changeStart() {
      this.endPickerOptions = Object.assign({}, this.endPickerOptions, {
        disabledDate: time => {
          if (this.formData.startTime) {
            return time.getTime() < this.formData.startTime
          } else {
            return false
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
          if (this.formData.endTime) {
            return time.getTime() > this.formData.endTime
          } else {
            return false
          }
        }
      })
    },
    /**
     * 监听table search事件
     */
    handleSearch() {
      this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
      this.getConstructionData()
    },
    /**
     * 监听添加施工信息按钮click事件
     */
    handleAdd() {
      this.oConstruction = {}
      this.isConstructionInfoEdit = true
    },
    /**
     * 监听table中"编辑"按钮click事件
     */
    handleEdit(index, row) {
      this.oConstruction = row
      this.isConstructionInfoEdit = true
    },
    /**
     * 监听table中"删除"按钮click事件
     */
    handleDelete(index, row) {
      this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">确定删除该条数据?</div><div class="contents">删除数据之后，数据将不可恢复。</div></div>', '', {
        customClass: 'deleteclass',
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteConstructionRequest(row)
      })
    },
    /*
     * 日期格式化
     */
    dateFormat(row, column, cellValue, index) {
      return this.commonFun.dateFormat(cellValue, 'yyyy-MM-dd HH:mm')
    },
    /**
     * 删除施工信息接口
     * @param {Object} oConstruction 施工信息对象
     */
    deleteConstructionRequest(oConstruction) {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.deleteConstruction,
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
            this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
            this.$refs.formData.resetFields() //重置查询条件表单
            this.getConstructionData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '删除失败：' + resData.msg
            })
          }
        })
    },
    /**
     * 多条件分页查询获取施工信息列表请求
     */
    getConstructionData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getConstructionsByPage,
          params: {
            implPeople: this.formData.constructorName.trim(),
            startDate: this.commonFun.dateFormat(this.formData.startTime, 'yyyy-MM-dd'),
            endDate: this.commonFun.dateFormat(this.formData.endTime, 'yyyy-MM-dd'),
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

.constructionBox {
  height: calc(100vh - 105px);
  height: -webkit-calc(100vh - 105px);
  height: -moz-calc(100vh - 105px);
  overflow-y: auto;
  margin: 0 auto;
  padding: 0 40px;
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
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
      margin-bottom: 11px;
    }
    .el-col {
      &:last-child {
        text-align: right;
      }
    }
  }
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