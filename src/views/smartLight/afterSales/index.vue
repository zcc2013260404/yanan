<template>
  <div class="containersty">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contents">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <div class="table-title">
        <div>
          <div class="buttons">
            <span class="spansty">标题</span>
            <el-input v-model="questions" placeholder="问题搜索" size="small" class="inputsty" clearable @input="questions=questions.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g,'')" />
            <span class="spansty">企业</span>
            <el-select v-model="keywords" placeholder="企业名称搜索关键字" size="small" class="inputsty" clearable>
              <el-option v-for="(item, index) in companyOptions" :key="index" :label="item.name" :value="item.id" />
            </el-select>
            <span class="spansty">时间段</span>
            <!-- <el-date-picker v-model="datavalue" :editable="false" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /> -->
            <el-date-picker v-model="startTime" :editable="false" :picker-options="startpickerOptions" size="small" type="date" placeholder="开始日期" />
            <span> 至 </span>
            <el-date-picker v-model="endTime" :editable="false" :picker-options="endpickerOptions" size="small" type="date" placeholder="结束日期" />
            <el-button class="flt" size="mini" type="primary" icon="el-icon-search" @click="searchInfo()">搜索</el-button>
            <el-button v-if="hasPermission('question/insert')" class="flt" icon="el-icon-plus" style="float: right;margin-right: -15px;" size="mini" type="primary" @click="addProblem()">添加</el-button>
          </div>
        </div>
      </div>
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" height="calc(100vh - 314px)" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="sn" align="center" label="问题编号" show-overflow-tooltip />
          <el-table-column prop="title" align="center" label="标题" show-overflow-tooltip />
          <el-table-column prop="name" align="center" label="企业" show-overflow-tooltip />
          <el-table-column prop="createTime" align="center" label="日期" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.createTime !== null ? scope.row.createTime.substring(0, scope.row.createTime.length - 3) : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip content="详情" placement="top">
                <el-button v-if="hasPermission('question/findQuestionDetail')" class="flt" size="mini" type="text" @click="getInfo(scope.row)" style='margin-right:40px'><i class="iconstyative icon iconfont leansite-2-shigongxinxi" style="color: #006fe6" /></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button v-if="hasPermission('question/delete')" class="flt" size="mini" type="text" @click="deleteEnt(scope.row, scope.$index)"><i class="deleteIcon iconfont leansite-delete" style="color: #f78989" /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
      </div>
    </div>
    <el-dialog title="新增问题" :visible.sync="addDialog" :close-on-click-modal="false" class="dialgs" width="600px" append-to-body @close="resetFrom('machineForm')">
      <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="machineForm.title" placeholder="请输入标题" maxlength="10" @input="machineForm.title=machineForm.title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g,'')" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkMan">
          <el-input v-model="machineForm.linkMan" placeholder="请输入联系人" maxlength="10" @input="machineForm.linkMan=machineForm.linkMan.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g,'')" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="machineForm.phone" id="ip" placeholder="请输入联系电话" maxlength="15" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="machineForm.content" :rows="5" resize="none" type="textarea" placeholder="请输入内容" maxlength="1000" />
        </el-form-item>
        <el-form-item label="附件">
          <el-upload ref="uploadFile" class="upload-demo" :action="actionUrl" :show-file-list="true" :file-list="fileList" :before-upload="beforeFile" :on-remove="removeFile" :http-request="uploadImage" accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.DOC,.DOCX,.XLS,.XLSX,.PPT,.PPTX,.RAR,.ZIP,.rar,.zip,.pdf,.PDF,.wpt,.WPT,.ETT,.DPT,.ett,.dpt,.txt,.TXT,.csv,.CSV,.apk">
            <el-button size="mini" type="primary" icon="el-icon-upload2">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button :disabled="disabled" type="primary" @click="submitForm('machineForm')">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="问题详情" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialg" width="600px" append-to-body>
      <el-row class="infosty">
        <el-col :span="6">问题编号：</el-col>
        <el-col :span="18">{{ questionInfo.sn }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</el-col>
        <el-col :span="18">{{ questionInfo.title }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">企&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业：</el-col>
        <el-col :span="18">{{ questionInfo.name }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：</el-col>
        <el-col :span="18">{{ (questionInfo.createTime !== null && questionInfo.createTime !== undefined) ? questionInfo.createTime.substring(0, questionInfo.createTime.length - 3) : '' }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">联&nbsp;&nbsp;系&nbsp;&nbsp;人：</el-col>
        <el-col :span="18">{{ questionInfo.linkMan }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">联系电话：</el-col>
        <el-col :span="18">{{ questionInfo.phone }}</el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">正&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文：</el-col>
        <el-col :span="18">{{ questionInfo.content }}</el-col>
      </el-row>
      <el-row class="infosty" style="height: auto;min-height: 32px;">
        <el-col :span="6">回复记录：</el-col>
        <el-col :span="18" class="loglist">
          <div v-for="(item, index) of questionInfo.questionAnswer" :key="index" :class="index === 0 ? 'logconte' : ''" class="queinfo">
            <div class="logtit">
              回复人: {{ item.userName }}({{ (item.dealTime !== null && item.dealTime !== undefined) ? item.dealTime.substring(0, item.dealTime.length - 3) : '' }})
            </div>
            <div class="logcontes">
              {{ item.answer }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</el-col>
        <el-col :span="18">
          <span class="fjxontent">{{ questionInfo.fileName }}</span>
          <el-button v-if="dataId.length > 0" type="text" size="mini" icon="el-icon-download" @click="download()">下载</el-button>
        </el-col>
      </el-row>
      <el-row class="infosty">
        <el-col :span="6">回&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;复：</el-col>
        <el-col :span="18">
          <el-input v-model="textarea" :rows="5" resize="none" type="textarea" placeholder="请输入内容" maxlength="1000" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="replyInfo()">回复</el-button>
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
  .infosty {
    height: 32px;
    .fjxontent {
      width: 365px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .loglist {
    max-height: 150px;
    overflow: auto;
  }
  .queinfo {
    padding: 10px 0px;
  }
  .logtit {
    font-weight: bold;
  }
  .logconte {
    margin-top: -10px;
  }
  .logcontes {
    margin-top: 5px;
  }
  /deep/ .el-dialog__body {
    margin-top: -15px;
    margin-bottom: 60px;
  }
}
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
.containersty {
  height: calc(100vh - 97px);
  overflow: hidden;
  .contents {
    height: calc(100vh - 97px);
    overflow: auto;
    padding-top: 0px;
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 15px 40px;
    }
    .title {
      padding: 0px 40px;
      font-size: 14px;
    }
    .spanti {
      font-weight: bold;
      font-size: 18px;
      margin-right: 5px;
      margin-left: 10px;
    }
    .table-title {
      height: 40px;
      margin: 10px 40px;
      margin-bottom: 0px;
      padding-top: 2px;
    }
    .tabsty {
      margin: 10px 40px;
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
      .el-table::before {
        background: #fff;
      }
      /deep/ .is-leaf {
        border-bottom: 1px solid #bebebe;
        color: #323232;
      }
      /deep/ .el-table__row td {
        border-bottom: 1px solid #bebebe;
        // border-right: 1px solid #bebebe;
      }
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
  }
  /deep/ .pagination-con {
    margin: 20px 0 0 22px;
    float: right;
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
    margin-right: 15px;
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
    .spansty {
      margin-right: 15px;
      float: left;
      display: block;
      padding-top: 5px;
    }
    .inputsty {
      margin-right: 15px;
      float: left;
      width: 200px;
    }
  }
}
</style>