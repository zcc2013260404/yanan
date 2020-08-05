<template>
  <div class="tenantBox">
    <div class="listArea" v-if="!isTenantAddAndEdit && !isTenantAdminList && !isTenantDetail && !isTenantPower">
      <h2>租户管理</h2>
      <el-form :inline="true" ref="formData" :model="formData" class="demo-form-inline2">
        <el-form-item label="租户名称">
          <el-input v-model="formData.tenantName" placeholder="租户名称" @input="formData.tenantName=formData.tenantName.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="授权时间段">
          <el-date-picker v-model="formData.searchTimes" :editable='false' :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租户状态">
          <el-select v-model="formData.expire" placeholder="请选择状态">
            <el-option label="全部" value="0"></el-option>
            <el-option label="未到期" value="1"></el-option>
            <el-option label="已到期" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" v-if="hasPermission('tenant/save')" @click="handleAdd">新增租户</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" v-if="hasPermission('tenant/findExportList')" @click="handleExport">导出到Excel</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" max-height="660" border empty-text="暂无数据" style="width: 100%" @row-click="tableClick" highlight-current-row>
        <el-table-column prop="id" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="name" align="center" label="租户名称">
        </el-table-column>
        <el-table-column v-if="false" prop="tbLoginname" align="center" label="租户账号">
        </el-table-column>
        <el-table-column prop="customer" align="center" label="租户编号">
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="添加日期" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="startTime" align="center" label="授权开始日期" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="endTime" align="center" label="授权结束日期" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="devices" align="center" label="授权设备数">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="220">
          <template slot-scope="scope">
            <el-button size="mini" v-if="hasPermission('tenant/permissionset')" @click.prevent.stop="handleSetPower(scope.$index, scope.row)">分配权限</el-button>
            <el-button size="mini" v-if="hasPermission('tenant/adminmanager')" @click.prevent.stop="handleAdmin(scope.$index, scope.row)">租户管理员</el-button>
            <el-button size="mini" v-if="hasPermission('tenant/update')" @click.prevent.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" v-if="hasPermission('tenant/delete')" type="danger" @click.prevent.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
    </div>
    <TenantAddAndEdit v-if="isTenantAddAndEdit" :tenantObj=oTenant @TenantEditCallBack=TenantEditCallBack></TenantAddAndEdit>
    <TenantDetail v-if="isTenantDetail" :tenantObj=oTenant @TenantDetailCallBack=TenantDetailCallBack></TenantDetail>
    <TenantAdminList v-if="isTenantAdminList" :tenantObj=oTenant @TenantAdminCallBack=TenantAdminCallBack></TenantAdminList>
    <TenantPower v-if="isTenantPower" :tenantObj=oTenant @TenantPowerCallBack=TenantPowerCallBack></TenantPower>
  </div>
</template>

<script>
import Pagination from '../../components/Pagination.vue'
import TenantAddAndEdit from './TenantAddAndEdit'
import TenantDetail from './TenantDetail'
import TenantAdminList from './TenantAdminList'
import TenantPower from './TenantPower'
export default {
  name: 'TenantList',
  components: {
    Pagination,
    TenantAddAndEdit,
    TenantAdminList,
    TenantDetail,
    TenantPower
  },
  data() {
    return {
      pageObj: {
        pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
        total: 0, //数据总数
        pageSize: this.API.leansite.constObj.pageSize //页大小
      },
      formData: {
        tenantName: '', //搜索框绑定的值
        searchTimes: ['', ''], //按时间查询
        expire: '0'
      },
      tableData: [],
      isTenantDetail: false, //是否显示租户信息详情界面()
      isTenantAddAndEdit: false, //是否显示租户信息编辑界面
      isTenantAdminList: false, //是否显示租户管理员信息编辑界面
      isTenantPower: false, //是否显示租户权限设置界面
      oTenant: {}, //选中的租户对象
      pickerOptions: {
        disabledDate(time) {
          let _now = Date.now()
          return time.getFullYear() > '2037'
        }
      }
    }
  },
  created() {
    this.getTenantData()
  },
  mounted() {
    //			let nowDate = new Date();
    //			let currDay = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate() + ' 00:00:00';
    //			this.formData.searchTimes = [new Date(currDay), new Date()];
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
      this.getTenantData()
    },
    /*
     * 租户信息组件回调方法--子组件回调数据的方法
     * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
     */
    TenantEditCallBack(isRefresh) {
      this.componentShow(0)
      if (isRefresh) {
        this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
        this.getTenantData()
      }
    },
    /*
     * 租户管理员详情组件回调方法--子组件回调数据的方法
     */
    TenantDetailCallBack() {
      this.componentShow(0)
    },
    /*
     * 租户管理员组件回调方法--子组件回调数据的方法
     */
    TenantAdminCallBack() {
      this.componentShow(0)
    },
    /*
     * 租户权限设置组件回调方法--子组件回调数据的方法
     */
    TenantPowerCallBack() {
      this.componentShow(0)
    },
    /**
     * 监听table click事件
     */
    handleSearch() {
      this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex
      this.getTenantData()
    },
    /**
     * 监听table click事件
     */
    tableClick(row, column, event) {
      this.oTenant = row
      this.componentShow(3)
    },
    /**
     * 监听table中"权限设置"按钮click事件
     */
    handleSetPower(index, row) {
      this.oTenant = row
      this.componentShow(4)
    },
    /**
     * 监听table中"编辑管理员"按钮click事件
     */
    handleAdmin(index, row) {
      this.oTenant = row
      this.componentShow(2)
    },
    /**
     * 监听添加租户按钮click事件
     */
    handleAdd() {
      this.oTenant = {}
      this.componentShow(1)
    },
    /**
     * 监听"导出到excel"按钮click事件
     */
    handleExport() {
      let startTime = this.commonFun.dateFormat(this.formData.searchTimes[0], 'yyyy-MM-dd HH:mm')
      let endTime = this.commonFun.dateFormat(this.formData.searchTimes[1], 'yyyy-MM-dd HH:mm')
      let requestUrl =
        this.API.leansite.baseURL +
        this.API.leansite.exportToExcel +
        '?name=' +
        this.formData.tenantName.trim() +
        '&expire=' +
        this.formData.expire +
        '&startTime=' +
        startTime +
        '&endTime=' +
        endTime
      window.open(encodeURI(requestUrl))
    },
    /**
     * 监听table中"编辑"按钮click事件
     */
    handleEdit(index, row) {
      this.oTenant = row
      this.componentShow(1)
    },
    /**
     * 监听table中"删除"按钮click事件
     */
    handleDelete(index, row) {
      this.$confirm('确定删除该租户?', '删除租户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTenantRequest(row)
      })
    },
    /**
     * 控制组件显示与隐藏
     * @param {Number} componentNo 组件编号
     * @param {Number} componentNo = 0  不显示所有组件
     * @param {Number} componentNo = 1  仅显示TenantAddAndEdit组件
     * @param {Number} componentNo = 2  仅显示TenantAdminList组件
     * @param {Number} componentNo = 3  仅显示TenantDetail所有组件
     * @param {Number} componentNo = 4  仅显示TenantPower组件
     */
    componentShow(componentNo) {
      switch (componentNo) {
        case 1:
          this.isTenantAddAndEdit = true
          this.isTenantAdminList = false
          this.isTenantDetail = false
          this.isTenantPower = false
          break
        case 2:
          this.isTenantAddAndEdit = false
          this.isTenantAdminList = true
          this.isTenantDetail = false
          this.isTenantPower = false
          break
        case 3:
          this.isTenantAddAndEdit = false
          this.isTenantAdminList = false
          this.isTenantDetail = true
          this.isTenantPower = false
          break
        case 4:
          this.isTenantAddAndEdit = false
          this.isTenantAdminList = false
          this.isTenantDetail = false
          this.isTenantPower = true
          break
        case 0:
        default:
          this.isTenantAddAndEdit = false
          this.isTenantAdminList = false
          this.isTenantDetail = false
          this.isTenantPower = false
          break
      }
    },
    /*
     * 日期格式化
     */
    dateFormat(row, column, cellValue, index) {
      return this.commonFun.dateFormat(cellValue, 'yyyy-MM-dd HH:mm')
    },
    /**
     * 删除租户接口
     * @param {Object} oTenant 租户对象
     */
    deleteTenantRequest(oTenant) {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.deleteTenant,
          params: {
            id: oTenant.id
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
            this.getTenantData()
          } else if (resData.code == 1000) {
            this.$message({
              type: 'error',
              message: '删除失败：' + resData.msg
            })
          }
        })
    },
    /**
     * 多条件分页查询获取租户列表请求
     */
    getTenantData() {
      if (!this.formData.searchTimes) {
        this.formData.searchTimes = ['', '']
      }
      if (this.formData.searchTimes[0].toString().length > 0) {
        this.formData.searchTimes[0] = this.commonFun.dateFormat(
          this.formData.searchTimes[0],
          'yyyy-MM-dd HH:mm:ss'
        )
      }
      if (this.formData.searchTimes[1].toString().length > 0) {
        this.formData.searchTimes[1] = this.commonFun.dateFormat(
          this.formData.searchTimes[1],
          'yyyy-MM-dd HH:mm:ss'
        )
      }
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getTenantsByPage,
          params: {
            name: this.formData.tenantName.trim(),
            expire: this.formData.expire,
            startTime: this.formData.searchTimes[0],
            endTime: this.formData.searchTimes[1],
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
.tenantBox {
  height: calc(100vh - 105px);
  height: -webkit-calc(100vh - 105px);
  height: -moz-calc(100vh - 105px);
  overflow-y: auto;
  margin: 0 auto;
  padding: 0 40px;
  h2 {
    margin: 10px 0;
    font-size: 36px;
    color: #323232;
    font-weight: normal;
  }
  .el-row {
    margin-bottom: 20px;
    .el-col {
      &:last-child {
        text-align: right;
      }
    }
  }
  .table {
    width: 100%;
    .el-table {
      border-radius: 3px;
    }
  }
}
</style>