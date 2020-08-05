<template>
  <div class="energy">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contant">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClicks">
        <el-tab-pane label="能源统计" name="0">
          <div style="margin: 14px 0px">
            时间段：
            <el-date-picker v-show="activeName === '0'" v-model="startTime" :editable="false" :picker-options="startpickerOptions" size="small" type="date" placeholder="开始日期" />
            <span v-show="activeName === '0'"> 至 </span>
            <el-date-picker v-show="activeName === '0'" v-model="endTime" :editable="false" :picker-options="endpickerOptions" size="small" type="date" placeholder="结束日期" />
            <!-- <el-date-picker v-show="activeName === '0'" v-model="dateRange" :editable="false" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" /> -->
            区域：
            <el-select v-show="activeName === '0'" v-model="areaValue" placeholder="选择区域" size="small" clearable @change="changeArea()">
              <el-option v-for="(item, index) in areaOptions" :key="item.id" :label="item.area" :value="index">
              </el-option>
            </el-select>
            <!-- 开关：
            <el-select v-model="switchValue" placeholder="选择智能开关" size="small" clearable>
              <el-option v-for="(item, index) in switchOptions" :key="item.id" :label="item.name" :value="index">
              </el-option>
            </el-select> -->
            <el-button class="flt" size="mini" type="primary" icon="el-icon-search" @click="searchInfo()">搜索</el-button>
          </div>
          <el-table ref="multipleTable" v-show="activeName === '0'" :data="tableData" tooltip-effect="dark" height="calc(100vh - 368px)" show-overflow-tooltip highlight-current-row @row-click="handleClick">
            <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="time" align="center" label="日期" show-overflow-tooltip />
            <el-table-column prop="area" align="center" label="分区" show-overflow-tooltip />
            <!-- <el-table-column prop="led_switch" align="center" label="开关" show-overflow-tooltip /> -->
            <el-table-column prop="energy" align="center" label="能耗" show-overflow-tooltip />
          </el-table>
          <div class="pagse">
            <Pagination v-show="activeName === '0'" :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="实时能耗" name="1">
          <div style="margin: 14px 0px">
            <!-- 开关：
            <el-select v-model="switchValue" placeholder="选择智能开关" size="small" clearable>
              <el-option v-for="(item, index) in switchOptions" :key="item.id" :label="item.name" :value="index">
              </el-option>
            </el-select>
            <el-button class="flt" size="mini" type="primary" icon="el-icon-search" @click="searchInfo()">搜索</el-button> -->
            <div class="imgposi">
              <img src="../../../assets/img/LightCtrl/state.png" alt="">
            </div>
          </div>
          <el-row v-show="activeName === '1'">
            <el-col :span="24" class="cols">
              <div id="mapLight">
                <img v-show="backImg !== undefined && backImg !== null && backImg !== ''" :src="backImg" alt="区域" @error="''+ require('../../../assets/img/defaultImg.png')">
                <div v-for="(item, index) of lightList" :key="index" :style="{left:item.xaxis * 100+'%',top:item.yaxis * 100+'%'}">
                  <!-- <div :style="{display: item.checked ? 'inline-block' : 'none'}" class="realTime">
                    <div class="ssupd">
                      实时能耗：{{ powers }}
                    </div>
                    <div class="ssupd">
                      实时电流：{{ electric }}
                    </div>
                    <div class="ssupd">
                      实时电压：{{ voltage }}
                    </div>
                  </div> -->
                  <el-tooltip :content="!item.alias ? item.sn : item.alias" effect="light" placement="top">
                    <div class="tol" @click="setChecked(item, index)">&nbsp;</div>
                  </el-tooltip>
                  <img v-if="item.status === '-1'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg2" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                  <img v-if="item.status === '1'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg1" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                  <img v-if="item.status === '0'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg0" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                  <img :style="{display: item.checked ? 'inline-block' : 'none'}" src="../../../assets/img/LightCtrl/choose.png" class="chooseImg" alt="">
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--切换右侧图表显示与隐藏-->
    <div v-show="activeName === '1'" :class="rightBarRightClass" @click="changeChartsShow">
      <i :class="arrowName"></i>
    </div>
    <!--右侧图表控制区-->{{ activeName === '1' && isShowChart }}
    <el-aside v-show="activeName === '1' && isShowChart" width="360px">
      <h4 v-show="isAbleCheck">当前灯：{{!currLedsn?'暂无数据':currLedsn}}</h4>
      <div v-show="isAbleCheck" class="realTimeCharts">
        <div class="RightCon" id="chart1"></div>
        <div class="RightCon" id="chart2"></div>
        <div class="RightCon" id="chart3"></div>
      </div>
    </el-aside>
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
    height: calc(100vh - 127px);
    padding: 15px 40px;
    overflow: auto;
    /deep/ .el-button--mini {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
    /deep/ .el-tab-pane {
      border-left: 1px solid #bebebe;
      border-right: 1px solid #bebebe;
      border-bottom: 1px solid #bebebe;
      padding: 10px;
    }
    /deep/ .el-tabs__header {
      margin: 0px;
      border-bottom: 1px solid #bebebe;
      /deep/ .el-tabs__nav {
        border: 1px solid #bebebe;
        border-bottom: 0px;
      }
      /deep/ .el-tabs__item {
        border-left: 1px solid #bebebe;
        &:first-child {
          border-left: none;
        }
      }
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
    /deep/ .el-table__body-wrapper {
      cursor: pointer;
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
    .flt {
      margin-left: 15px;
    }
    .title {
      font-size: 14px;
      margin-top: -15px;
    }
    .totas {
      padding: 10px 0px;
    }
    .imgposi {
      float: right;
      margin-top: 10px;
      margin-right: 15px;
    }
    .cols {
      text-align: center;
      margin-top: 20px;
    }
    .pagse {
      width: 100%;
      text-align: right;
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      right: 0px;
    }
    #mapLight {
      position: relative;
      overflow: hidden;
      height: auto;
      display: inline-block;
      .realTime {
        top: -95px;
        background-color: rgba(255, 255, 255, 0.9);
        position: absolute;
        width: 200px;
        border-radius: 6px;
        left: -70px;
        z-index: 9;
      }
      .tol {
        width: 50px;
        height: 50px;
        position: absolute;
        // border: 1px solid #e5e5e5;
        // border-radius: 30px;
        top: 4px;
        left: 4px;
      }
      .ssupd {
        line-height: 30px;
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        padding-left: 15px;
        color: #666;
      }
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
.rightBarControlHide {
  z-index: 2;
  cursor: pointer;
  position: absolute;
  top: 45%;
  right: 15px;
  width: 12px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background-color: #d2d2d2;
}
.rightBarControlShow {
  z-index: 2;
  cursor: pointer;
  position: absolute;
  top: 45%;
  right: 360px;
  width: 12px;
  height: 64px;
  line-height: 64px;
  text-align: center;
  background-color: #d2d2d2;
}
.el-aside {
  position: absolute;
  right: 0;
  background-color: #f0f0f0;
  z-index: 2;
  height: 100%;
  top: 0px;
  padding-top: 15px;
  h3 {
    height: 67px;
    line-height: 67px;
    text-align: center;
    border-bottom: solid 1px #c4c4c4;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #323232;
  }
  .el-form {
    padding: 0 14px;
    margin-bottom: 30px;
    .el-form-item {
      margin-bottom: 0;
      padding: 12px 0;
      border-bottom: solid 1px #c4c4c4;
    }
  }
  .realTimeCharts {
    width: calc(100% - 28px);
    padding: 0 14px;
    .RightCon {
      width: 325px;
      height: 200px;
      margin-bottom: 20px;
    }
  }
  h4 {
    margin: 0 14px 20px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #006fe6;
    text-align: left;
  }
}
</style>