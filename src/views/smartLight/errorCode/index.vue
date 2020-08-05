<template>
  <div class="energy">
    <div class="contant">
      <h1>故障代码维护</h1>
      <div class="addsty">
        <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="名称" prop="name">
                <el-input v-model="machineForm.name" size="small" placeholder="请输入名称" maxlength="50" @input="machineForm.name=machineForm.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="代码" prop="code">
                <el-input v-model="machineForm.code" size="small" placeholder="请输入代码" maxlength="50" @input="machineForm.code=machineForm.code.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:left">
              <el-button :disabled="disabled" class='addButton' size="mini" type="primary" icon="el-icon-plus" @click="submitForm('machineForm')">添加</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableData" height="calc(100vh - 335px)" tooltip-effect="dark" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.name }}</span>
              <el-input v-if="scope.row.isEdit" v-model="scope.row.name" placeholder="请输入名称" maxlength="50" @input="scope.row.name=scope.row.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g,'')" />
            </template>
          </el-table-column>
          <el-table-column prop="code" align="center" label="代码" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.code }}</span>
              <el-input v-if="scope.row.isEdit" v-model="scope.row.code" placeholder="请输入代码" maxlength="50" @input="scope.row.code=scope.row.code.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g,'')" />
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip :content="!scope.row.isEdit ? '编辑' : '保存'" placement="top">
                <el-button v-if="!scope.row.isEdit" size="mini" type="text" title="编辑" @click="editItem(scope.row, scope.$index)" style='margin-right:50px'>
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
                <el-button v-if="scope.row.isEdit" size="mini" type="text" title="保存" @click="editsubmitForm()" style='margin-right:50px'>
                  <i class="iconfont leansite-save01 saveIconBtn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip :content="!scope.row.isEdit ? '删除' : '取消'" placement="top">
                <el-button v-if="!scope.row.isEdit" size="mini" type="text" title="删除" @click="deleteEnt(scope.row, scope.$index)">
                  <i class="iconfont leansite-delete deleteIconBtn"></i>
                </el-button>
                <el-button v-if="scope.row.isEdit" size="mini" type="text" title="取消" @click="cancelEdit(scope.$index)">
                  <i class="el-icon-circle-close" style="font-size:18px"></i>
                </el-button>
              </el-tooltip>
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
.energy {
  height: calc(100vh - 97px);
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contant {
    height: calc(100vh - 97px);
    padding: 15px;
    overflow: auto;
    margin-left: 15px;
    h1 {
      padding-left: 10px !important ;
      margin-top: -11px;
      margin-bottom: 11px;
    }
    .addsty {
      width: 1000px;
      padding-right: 10px;
      margin-left: -10px;
      .addButton {
        margin-left: 15px;
        padding: 7px 25px;
        background-color: #006fe6;
        border-color: #006fe6;
        margin-top: 3px;
      }
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 10px 30px;
    }
    .tits {
      padding-left: 15px;
      padding-top: 10px;
    }
    .tabsty {
      margin: 10px;
      margin-top: 0px;
      border: 1px solid #bebebe;
      // border-left: 1px solid #bebebe;
      // border-right: 1px solid #bebebe;
      // border-bottom: 1px solid #bebebe;
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
      margin: 10px;
      margin-bottom: 0px;
      border: 1px solid #bebebe;
    }
    .imgposi {
      float: right;
    }
    .cols {
      text-align: center;
      margin-top: 20px;
    }
    .ssupd {
      line-height: 35px;
      font-size: 18px;
      margin-top: 50px;
      font-weight: bold;
    }
    #mapLight {
      position: relative;
      overflow: hidden;
      height: auto;
      display: inline-block;
      > img {
        max-width: 100%;
        height: auto;
        filter: blur(0px);
      }
      .chooseImg {
        position: relative;
      }
      > div {
        position: absolute;
        cursor: pointer;
        width: 60px;
      }
    }
  }
}
</style>