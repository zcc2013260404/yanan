<template>
  <div class="energy">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contant">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <h1>添加信息</h1>
      <div class="addsty">
        <el-form v-if="hasPermission('computer/insert')" ref="machineForm" :model="machineForm" :rules="rules" label-width="60px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="名称" prop="name">
                <el-input v-model="machineForm.name" size="small" placeholder="请输入名称" maxlength="20" @input="machineForm.name=machineForm.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SN" prop="sn">
                <el-input v-model="machineForm.sn" size="small" placeholder="请输入SN" maxlength="20" @input="machineForm.sn=machineForm.sn.replace(/[^a-zA-Z0-9\w]/g,'')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="IP" prop="ip">
                <el-input v-model="machineForm.ip" size="small" id="ip" placeholder="请输入IP" maxlength="15" />
              </el-form-item>
            </el-col>
            <el-col :span="3" style="margin-left: 15px;">
              <el-button :disabled="disabled" size="mini" type="primary" @click="submitForm('machineForm')"> 添加 </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <div class="table-title">
        <div>
          <div class="tits">
            <span class="spanti">- </span>已有信息
          </div>
        </div>
      </div> -->
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableData" height="calc(100vh - 378px)" tooltip-effect="dark" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="sn" align="center" label="名称（SN)" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.name }}({{ scope.row.sn }})
            </template>
          </el-table-column>
          <el-table-column prop="ip" align="center" label="IP" show-overflow-tooltip />
          <el-table-column prop="date" align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button v-if="hasPermission('computer/update')" size="mini" type="text" title="编辑" @click="editItem(scope.row)" style="margin-right:50px">
                  <i class="iconfont leansite-bianji editIconBtn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button v-if="hasPermission('computer/delete')" style='margin-right:50px' size="mini" type="text" @click="deleteEnt(scope.row, scope.$index)"><i class="deleteIcon iconfont leansite-delete" style="color: #f78989" /></el-button>
              </el-tooltip>
              <!-- <el-tooltip content="监控平台开关" placement="top">
                <el-switch v-model="scope.row.sn" style='margin-right: 50px;margin-top: -5px;' size="mini">
                </el-switch>
              </el-tooltip>
              <el-tooltip content="访问地址" placement="top">
                <el-button v-if="hasPermission('computer/delete')" style="padding: 0px;margin-right:50px" size="mini" type="text" @click="deleteEnt(scope.row, scope.$index)">
                  <svg-icon icon-class="monitor" style="font-size: 18px;" />
                </el-button>
              </el-tooltip> -->
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
      </div>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialg" width="600px" append-to-body @close="resetFrom('editmachineForm')">
      <el-form ref="editmachineForm" :model="editmachineForm" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editmachineForm.name" placeholder="请输入名称" maxlength="20" @input="editmachineForm.name=editmachineForm.name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
        </el-form-item>
        <el-form-item label="SN" prop="sn">
          <el-input v-model="editmachineForm.sn" placeholder="请输入SN" maxlength="20" @input="editmachineForm.sn=editmachineForm.sn.replace(/[^a-zA-Z0-9\w]/g,'')" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="editmachineForm.ip" id="ip" placeholder="请输入IP" maxlength="15" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editsubmitForm('editmachineForm')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.dialg {
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
}
.energy {
  height: calc(100vh - 97px);
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contant {
    height: calc(100vh - 97px);
    padding: 0px 30px;
    overflow: auto;
    h1 {
      font-weight: bold;
      margin-top: -15px;
      font-size: 36px;
      color: #323232;
      padding: 10px;
      margin-bottom: 17px;
    }
    .addsty {
      width: 1000px;
      padding-right: 10px;
      margin-top: -5px;
      /deep/ .el-button--mini {
        padding: 7px 25px;
        background-color: #006fe6;
        border-color: #006fe6;
        margin-top: 3px;
      }
      /deep/ .el-button--text {
        color: #006fe6;
      }
    }
    .tabsty {
      margin: 10px;
      margin-top: 2px;
      border: 1px solid #bebebe;
      // border-right: 1px solid #bebebe;
      // border-bottom: 1px solid #bebebe;
      // border-top: 1px solid #bebebe;
      padding: 0px 10px;
      padding-bottom: 75px;
      .flt {
      }
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
        color: #323232;
        // border-right: 1px solid #bebebe;
      }
    }
    .table-title {
      height: 40px;
      margin: 10px;
      margin-bottom: 0px;
      border: 1px solid #bebebe;
      .tits {
        padding-left: 15px;
        padding-top: 5px;
      }
      .spanti {
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }
    }
    .title {
      padding: 0px 10px;
      font-size: 14px;
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
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
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