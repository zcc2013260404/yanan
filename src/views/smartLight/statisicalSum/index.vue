<template>
  <div class="containersty">
    <div class="titlesty">
      <el-row class="titlinfo">
        <el-col :span="8">
          <div class="blockinfo">
            <div>
              <div class="hese">
                <i class="icon iconfont leansite-shouye-qiye" style="color: #248bff" />
                安装企业数量({{ provinces === '' ? '全国' : provinces }})
              </div>
              <hr style="width: 95px;margin-left: calc(50% - 83px);">
              <div class="englis" style="margin-left: 60px;">
                Number of installation enterprises
              </div>
            </div>
            <span class="spansty">
              {{ installNum }}
            </span>
          </div>
          <el-divider direction="vertical" class="hrline" />
        </el-col>
        <el-col :span="8">
          <div class="blockinfo">
            <div>
              <div class="hese" style="margin-left: calc(50% - 66px)">
                <i class="icon iconfont leansite-2-zhihuikaiguan" style="color: #ffc800" /> 智慧开关({{ provinces === '' ? '全国' : provinces }})
              </div>
              <hr style="width: 60px;margin-left: calc(50% - 43px);">
              <div class="englis">
                Smart switch
              </div>
            </div>
            <span class="spansty" style="margin-left: calc(50% - 43px);">
              {{ smartSwitch }}
            </span>
          </div>
          <el-divider direction="vertical" class="hrline1" />
        </el-col>
        <el-col :span="8">
          <div class="blockinfo" style="border: 0px">
            <div>
              <div class="hese" style="margin-left: calc(50% - 103px)">
                <i class="icon iconfont leansite-shouye-deng" style="color: #3d59c4" /> 接入灯数({{ provinces === '' ? '全国' : provinces }})
              </div>
              <hr style="width: 60px;margin-left: calc(50% - 80px);">
              <div class="englis">
                Number of access lights
              </div>
            </div>
            <span class="spansty" style="margin-left: calc(50% - 80px);">
              {{ accessNum }}
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-title">
        <div>
          <div class="tits">
            <span class="spanti">- </span>企业分布
            <el-tooltip content="返回" placement="top">
              <el-button v-show="province !== ''" type="text" class="backsty" @click="backToAll()"><img :src="backImg" alt="fanhui"></el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <el-row class="mapcontant">
        <el-col :span="24">
          <div id="mapInfo" class="mapsty" />
        </el-col>
        <div class="lisComp">
          <div class="newFac">
            最新购买安装企业
          </div>
          <div v-for="(item, index) of newList" :key="index" class="lis" @click="jumpQYLB(item)">
            {{ index + 1 }} . {{ item.name }}
          </div>
        </div>
        <div class="lisComp1">
          <div class="newFac">
            节能企业排行
          </div>
          <div v-for="(item, index) of newJNList" :key="index" class="lis" @click="jumpQYLB(item)">
            {{ index + 1 }} . {{ item.name }}
          </div>
        </div>
        <el-col :span="24" style="text-align:center;margin-top: -20px">
          <div id="barInfo" class="barsty" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.containersty {
  height: calc(100vh - 107px);
  width: calc(100% - 40px);
  display: flex;
  text-align: center;
  justify-content: center;
  margin: 10px 20px;
  overflow: hidden;
  ::-webkit-scrollbar {
    width: 1px;
  }
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .mapcontant {
    height: calc(100vh - 275px);
    border: 1px solid #bebebe;
    border-top: 0px;
    overflow: auto;
    .newFac {
      font-weight: bold;
      margin-top: 50px;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .lisComp {
      position: absolute;
      right: 75px;
    }
    .lisComp1 {
      position: absolute;
      left: 75px;
    }
    .lis {
      line-height: 28px;
      font-weight: normal;
      text-align: left;
      // padding-left: 15px;
      &:hover {
        color: #006fe6;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    /deep/ .el-col {
      font-size: 18px;
      font-weight: bold;
      display: flex;
      justify-content: center;
    }
  }
  .titlesty {
    width: 100%;
    // padding: 5px 20px;
    .titlinfo {
      border: 1px solid #bebebe;
      .hrline {
        right: 66%;
        top: 20px;
        height: 70px;
        position: absolute;
      }
      .hrline1 {
        right: 33%;
        top: 20px;
        height: 70px;
        position: absolute;
      }
      .hrline2 {
        right: 66%;
        top: 20px;
        height: 70px;
        position: absolute;
      }
      .blockinfo {
        margin: 10px 20px;
        .spansty {
          margin-left: calc(50% - 83px);
          width: 120px;
          display: block;
          text-align: left;
        }
        // border-right: 1px solid #bebebe;
        .hese {
          margin-left: calc(50% - 105px);
          color: #323232;
          margin-bottom: -15px;
          margin-top: -15px;
          width: 210px;
          text-align: left;
        }
        .englis {
          font-size: 14px;
          margin-top: -15px;
          color: #969696;
        }
        & div {
          font-size: 16px;
          font-weight: normal;
          padding-top: 5px;
        }
        & hr {
          width: 50px;
          margin-bottom: 10px;
        }
        & span {
          font-size: 32px;
          font-weight: bold;
          font-family: FZCYJ;
        }
      }
    }
  }
  .table-title {
    height: 40px;
    margin: 10px 0px;
    margin-bottom: 0px;
    border: 1px solid #bebebe;
    text-align: left;
    .tits {
      padding-left: 15px;
      padding-top: 5px;
    }
    .backsty {
      position: relative;
      font-weight: bold;
      z-index: 999;
      float: right;
      margin-right: 15px;
      & img {
        width: 18px;
        margin-top: -7px;
      }
    }
    .spanti {
      font-weight: bold;
      font-size: 18px;
      margin-right: 10px;
    }
  }
  .mapsty {
    width: 100%;
    height: 500px;
    margin-top: -60px;
  }
  .barcontant {
    height: 400px;
  }
  .barsty {
    padding-top: 10px;
    width: 100%;
    height: 220px;
  }
}
</style>