<template>
  <div class="acceptanceReport">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contents">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <!-- <div class="table-title">
        <div>
          <div class="tits">
            <span class="spanti">&nbsp;</span>
          </div>
        </div>
      </div> -->
      <div class="buttons">
        <el-button v-if="hasPermission('inspectionReport/executeInspection')" :disabled="loading" icon="el-icon-document" class="flt" size="mini" type="primary" @click="getText()">执行验收测试</el-button>
        <el-button v-if="isFinish" class="flt" size="mini" type="primary" icon="el-icon-download" @click="openPDF()">下载PDF报告</el-button>
      </div>
      <div v-if="msgList.length > 0" class="results">
        <p v-for="(item, index) of msgList" :key="index" :style="{ color: item.code !== 2 ? '' : '#f62447' }">{{ item }}</p>
      </div>
      <div v-if="msgList.length === 0" class="results" style="text-align: center">
        <p style="padding-top: 41px;padding-left: 0px;">尚未执行验收报告</p>
      </div>
      <div class="table-title aress">
        <div v-if="isFinish">
          <div class="buttonxs">
            <span style="float: left;display: block;margin-top: 7px;">sn：</span>
            <el-input v-model="sn" placeholder="sn" size="small" class="inputsty" @input="sn = sn.replace(/[^a-zA-Z0-9\w]/g, '')" clearable />
            区域：
            <el-select v-model="areaValue" placeholder="选择区域" size="small" clearable>
              <el-option v-for="item in areaList" :key="item.id" :label="item.area" :value="item.id">
              </el-option>
            </el-select>
            &nbsp;测试项：
            <el-select v-model="testValue" placeholder="选择测试项" multiple collapse-tags size="small" clearable>
              <el-option v-for="item in testList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            &nbsp;结果：
            <el-select v-model="resultValue" :disabled="testValue === null || testValue.length === 0" placeholder="选择结果" size="small" clearable>
              <el-option v-for="item in resultList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-button size="mini" type="primary" style="margin-left: 15px;" icon="el-icon-search" @click="searchInfo()">搜索</el-button>
            <el-button size="mini" type="primary" style="float: right" icon="el-icon-download" @click="exportExcel()">导出结果</el-button>
          </div>
        </div>
      </div>
      <div class="tabsty">
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" height="calc(100vh - 517px)" show-overflow-tooltip>
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="sn" align="center" label="SN" show-overflow-tooltip />
          <el-table-column prop="area" align="center" label="区域" show-overflow-tooltip />
          <el-table-column prop="off" align="center" label="开灯" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.ons === '1' ? '合格' : '不合格' }}
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" label="调光" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.dimming === '1' ? '合格' : '不合格' }}
            </template>
          </el-table-column>
          <el-table-column prop="date" align="center" label="关灯" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.off === '1' ? '合格' : '不合格' }}
            </template>
          </el-table-column>
        </el-table>
        <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
      </div>
    </div>
    <el-dialog title="PDF预览" :visible.sync="dialogs" class="dialg" width="800px" append-to-body>
      <div style="text-align: right;margin-bottom: -55px;">
        <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadPDF()">下载</el-button>
      </div>
      <div id="pdfreport" class="pdfsty">
        <div class="title">
          {{ companyName }}智慧照明系统验收报告
        </div>
        <div class="conts">
          本次共安装灯具 {{ tableAllList.length }} 个，合格 {{ heNum }} 个，不合格 {{ tableAllList.length - heNum }} 个，具体如下:
        </div>
        <div class="tabs">
          <el-table ref="multipleTables" :data="tableAllList" border tooltip-effect="dark" show-overflow-tooltip>
            <el-table-column align="center" width="60" label="行号" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="sn" min-width="180px" align="center" label="SN" show-overflow-tooltip />
            <el-table-column prop="area" align="center" label="区域" show-overflow-tooltip />
            <el-table-column prop="off" align="center" label="开灯" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.ons === '1' ? '合格' : '不合格' }}
              </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="调光" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.dimming === '1' ? '合格' : '不合格' }}
              </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="关灯" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.off === '1' ? '合格' : '不合格' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="findate">
          签约完成日期：{{ startTime !== undefined &&startTime !== null && startTime.length > 0 ? startTime.substring(0, 10) : '' }}
        </div>
        <div class="findate">
          施工完成日期：{{ endTime !== undefined &&endTime !== null && endTime.length > 0 ? endTime.substring(0, 10) : '' }}
        </div>
        <el-row style="margin-top: 50px">
          <el-col :span="12">
            <div class="findate">
              施工方：
            </div>
            <div class="findate">
              日期：
            </div>
          </el-col>
          <el-col :span="12">
            <div class="findate">
              验收方：
            </div>
            <div class="findate">
              日期：
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.dialg {
  /deep/ .el-dialog__body {
    margin-top: -15px;
  }
  /deep/ .el-button--mini {
    padding: 7px 20px;
    background-color: #006fe6;
    border-color: #006fe6;
    margin-top: 3px;
  }
  /deep/ .el-button--text {
    color: #006fe6;
  }
  .pdfsty {
    padding: 0px 15px;
    padding-top: 20px;
  }
  .tabs {
    padding: 5px;
  }
  .conts {
    text-indent: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
  }
  .findate {
    font-size: 16px;
    padding-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .title {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 15px;
    text-align: center;
  }
}
.acceptanceReport {
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contents {
    height: calc(100vh - 97px);
    overflow: auto;
    padding: 15px 40px;
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 15px 20px;
    }
    .title {
      margin-top: -15px;
      font-size: 14px;
    }
    .spanti {
      margin-left: 10px;
    }
    .table-title {
      height: 32px;
      margin: 10px 0px;
      margin-bottom: 0px;
      padding-top: 10px;
      margin-top: 0;
      .buttonxs {
        padding: 15px 0px;
        margin-bottom: 20px;
        margin-top: -39px;
        /deep/ .el-button--mini {
          padding: 7px 20px;
          background-color: #006fe6;
          border-color: #006fe6;
          margin-top: 3px;
        }
        /deep/ .el-button--text {
          color: #006fe6;
        }
        .flt {
          margin-left: 15px;
        }
        .inputsty {
          margin-right: 15px;
          float: left;
          width: 200px;
        }
      }
    }
    .buttons {
      margin-bottom: 24px;
      margin-left: -15px;
      margin-top: -2px;
      text-align: left;
      /deep/ .el-button--mini {
        padding: 7px 20px;
        background-color: #006fe6;
        border-color: #006fe6;
        margin-top: 3px;
      }
      /deep/ .el-button--text {
        color: #006fe6;
      }
      .flt {
        margin-left: 15px;
      }
      .inputsty {
        margin-right: 15px;
        float: left;
        width: 200px;
      }
    }
    .aress {
      margin-top: 33px;
      border: 0px;
      border-bottom: 1px solid #bebebe;
    }
    .results {
      border: 1px solid #bebebe;
      min-height: 120px;
      margin-top: 6px;
      & p {
        padding-left: 15px;
        line-height: 40px;
      }
    }
    .tabsty {
      margin: 10px 0px;
      margin-top: 0px;
      border-left: 1px solid #bebebe;
      border-right: 1px solid #bebebe;
      border-bottom: 1px solid #bebebe;
      padding: 10px;
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
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
  }
}
</style>