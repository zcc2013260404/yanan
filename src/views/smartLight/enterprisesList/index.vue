<template>
  <div class="containersty">
    <div class="contents">
      <h1>企业列表</h1>
      <div class="table-title">
        <div>
          <div class="buttons">
            <span style="float: left;display: block;margin-top: 7px;">企业名称：</span>
            <el-input v-model="keywords" placeholder="企业名称搜索关键字" size="small" class="inputsty" @input="keywords=keywords.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" clearable />
            企业地址：
            <el-cascader v-model="address" :options="options" size="small" value='label' placeholder="请选择企业地址" @change="handleChange" clearable />
            <el-button size="mini" type="primary" style="margin-left: 15px;" icon="el-icon-search" @click="searchInfo()">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableList" height="calc(100vh - 336px)" tooltip-effect="dark" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="名称" show-overflow-tooltip />
          <el-table-column prop="startTime" align="center" label="签约日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.startTime !== null ? scope.row.startTime.substring(0, scope.row.startTime.length - 3) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" align="center" label="施工完成日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.endTime !== null ? scope.row.endTime.substring(0, scope.row.endTime.length - 3) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="登记日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.createTime !== null ? scope.row.createTime.substring(0, scope.row.createTime.length - 3) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="devices" align="center" label="数量" show-overflow-tooltip />
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip content="切入" placement="top">
                <el-button size="mini" type="text" class="trans" title="切入" @click="jumpQR(scope.row)">
                  <i class="iconfont leansite-xiazai2 editIconBtn"></i>
                </el-button>
              </el-tooltip>
              <!-- <el-button class="flt" size="mini" type="danger" @click="deleteEnt(scope.row, scope.$index)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
      </div>
    </div>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.containersty {
  height: calc(100vh - 97px);
  padding: 0px 10px;
  .contents {
    height: calc(100vh - 97px);
    overflow: auto;
    .trans {
      transform: rotate(-90deg);
      -ms-transform: rotate(-90deg); /* IE 9 */
      -moz-transform: rotate(-90deg); /* Firefox */
      -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
      -o-transform: rotate(-90deg); /* Opera */
    }
    .tits {
      padding-left: 15px;
      padding-top: 5px;
    }
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 13px 30px;
    }
    .spanti {
      font-weight: bold;
      font-size: 18px;
      margin-right: 10px;
    }
    .tabsty {
      margin: 10px 30px;
      margin-top: 17px;
      border: 1px solid #bebebe;
      padding: 0px 10px;
      padding-bottom: 75px;
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #bebebe;
      }
      .el-table--border::after,
      .el-table--group::after {
        background-color: #bebebe;
      }
      .el-table::before {
        background: #fff;
      }
      /deep/ .is-leaf {
        border-bottom: 1px solid #bebebe;
        color: #323232;
        // border-right: 1px solid #bebebe;
      }
      /deep/ .el-table__row td {
        border-bottom: 1px solid #bebebe;
        // border-right: 1px solid #bebebe;
      }
    }
    .table-title {
      height: 40px;
      margin: 10px 30px;
      margin-bottom: 0px;
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
  }
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .title {
    padding: 10px 15px;
    font-size: 14px;
  }
  .buttons {
    margin-bottom: 15px;
    /deep/ .el-button--mini {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
    .flt {
      margin-left: 15px;
    }
    .flts {
      margin-left: 15px;
      background: #fff;
      color: #66b1ff;
    }
    .inputsty {
      margin-right: 15px;
      float: left;
      width: 200px;
    }
  }
}
</style>