<template>
  <div class="faultInfomation">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contant">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <div>
        <el-select v-model="areaValue" placeholder="选择区域" size="small" @change="changeArea()">
          <el-option v-for="(item, index) in areaOptions" :key="item.id" :label="item.area" :value="index">
          </el-option>
        </el-select>
        <!-- <el-button class="flt" size="small" type="primary">查询</el-button> -->
        <!-- <el-button class="flt" size="small" type="danger" @click="openErrorDialog()">故障灯列表</el-button> -->
        <div class="imgposi">
          <img src="../../../assets/img/LightCtrl/zhuangtaigz.png" alt="">
        </div>
      </div>
      <div class="mapsty">
        <div id="mapLight">
          <img v-show="backImg !== undefined && backImg !== null && backImg !== ''" :src="backImg" alt="区域" />
          <div v-for="(item, index) of lightList" :key="index" :style="{left:item.xaxis*100+'%',top:item.yaxis*100+'%'}">
            <img v-if="item.fault === null" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg1" alt="" click='false' :ref="index" :index="index" class="lightsImg">
            <img v-if=" item.fault !==null" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg0" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="switchChange(item, index)">
            <img :style="{display: item.checked ? 'inline-block' : 'none'}" src="../../../assets/img/LightCtrl/choose.png" class="chooseImg" alt="">
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="故障灯列表" :visible.sync="dialogVisible" class="dialg" width="600px" append-to-body>
      <div style="margin-bottom: 20px;">
        <span class="tits">
          故障代码
        </span>
        <el-button class="downposi" size="small" type="primary" @click="exportExcel()">下载</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" show-overflow-tooltip>
        <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="ledSn" align="center" label="SN" show-overflow-tooltip />
        <el-table-column prop="faultCode" align="center" label="故障代码" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.downposi {
  position: absolute;
  right: 15px;
  top: 65px;
}
.dialg {
  /deep/ .el-dialog__body {
    margin-top: -15px;
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
    // border-right: 1px solid #bebebe;
  }
  /deep/ .el-table__row td {
    border-bottom: 1px solid #bebebe;
    // border-right: 1px solid #bebebe;
  }
}
.faultInfomation {
  height: calc(100vh - 97px);
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contant {
    height: calc(100vh - 97px);
    padding: 15px 40px;
    overflow: auto;
    .title {
      margin-top: -15px;
      font-size: 14px;
    }
    .imgposi {
      float: right;
    }
    .mapsty {
      width: 100%;
      text-align: center;
      margin-top: 20px;
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