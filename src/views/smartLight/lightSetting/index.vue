<template>
  <div class="lightsty">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contents">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <div class="buttons">
        <el-select v-model="areaValue" placeholder="选择区域" size="small" @change="changeArea()">
          <el-option v-for="(item, index) in areaOptions" :key="index" :label="item.area" :value="index">
          </el-option>
        </el-select>
        <el-select v-model="switchValue" placeholder="选择智能开关" size="small" clearable @change="switchChange()">
          <el-option v-for="(item, index) in switchOptions" :key="index" :label="item.name" :value="index">
          </el-option>
        </el-select>
        <el-select v-model="switchListValue" :disabled="switchListOptions.length === 0 || !switchValue" placeholder="选择开关组" size="small" clearable @change="switchgetLend()">
          <el-option v-for="(item, index) in switchListOptions" :key="index" :label="item.groupId" :value="index">
          </el-option>
        </el-select>
        <el-button v-if="hasPermission('led/saveSwitchBoundLed')" class="flt" size="mini" type="primary" @click="bindByLight()">
          <svg-icon icon-class="bind" class="refleshsty" /> 绑定</el-button>
        <el-checkbox v-model="checkAll" class="flt setcheck" size="mini" border @change="checkedAlls">全选</el-checkbox>
        <!-- <div class="msgsty">
          <el-tooltip effect="dark" content="消息" placement="top">
            <el-badge :value="newMsgNum" :hidden="newMsgNum === '0'" class="item">
              <el-button size="medium" type="text" @click="msgOpen()"><i class="el-icon-message-solid" /></el-button>
            </el-badge>
          </el-tooltip>
        </div> -->
        <div class="imgposi">
          <img src="../../../assets/img/LightCtrl/zhuangtais.png" alt="">
        </div>
      </div>
      <div class="mapsty">
        <el-button v-if="activeName === '1'" class="resle" size="mini" type="primary" @click="refreshParamInfos()">
          <svg-icon icon-class="reflesh" class="refleshsty" /> 数据重载
        </el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClicks">
          <el-tab-pane label="图纸" name="0">
            <div id="mapLight">
              <img v-show="backImg !== undefined && backImg !== null && backImg !== ''" :src="backImg" alt="区域" @error="''+ require('../../../assets/img/defaultImg.png')">
              <div v-for="(item, index) of lightList" :key="index" :style="{left:item.xaxis * 100+'%',top:item.yaxis * 100+'%'}">
                <el-tooltip :content="!item.alias ? item.sn : item.alias" effect="light" placement="top">
                  <div class="tol" @click="setChecked(item, index)">&nbsp;</div>
                </el-tooltip>
                <img v-if="item.peopleStatus === '0' || item.peopleStatus === '1'" :src="item.peopleStatus === '0' ? rgoff : rgon" alt="" class="rgImg">
                <img v-if="item.linghtStatus === '0' || item.linghtStatus === '1'" :src="item.linghtStatus === '0' ? ggoff : ggon" alt="" class="ggImg">
                <img v-if="item.status === '-1'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg2" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                <img v-if="item.status === '1'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg1" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                <img v-if="item.status === '0'" :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg0" alt="" click='false' :ref="index" :index="index" class="lightsImg" @click="setChecked(item, index)">
                <img :style="{display: item.checked ? 'inline-block' : 'none'}" :src="choose" class="chooseImg" alt="">
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="列表" name="1">
            <el-table ref="multipleTable" v-show="activeName === '1'" :data="lightList" tooltip-effect="dark" height="calc(100vh - 285px)" show-overflow-tooltip highlight-current-row>
              <el-table-column align="center" width="80" fixed label="选择" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.checked" class="setd" text-color="#006fe6" fill="#006fe6" />
                </template>
              </el-table-column>
              <el-table-column align="center" width="80" fixed label="行号" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column prop="sn" align="center" fixed width="150px" label="灯具SN" show-overflow-tooltip />
              <el-table-column prop="alias" align="center" fixed width="150px" label="别名" show-overflow-tooltip />
              <el-table-column prop="switchNames" align="center" width="150px" label="开关" show-overflow-tooltip />
              <el-table-column prop="group_id" align="center" label="开关通道" show-overflow-tooltip />
              <el-table-column prop="energy" align="center" label="光感开关" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.light_on_off === 0 ? '关闭' : '开启' }}
                </template>
              </el-table-column>
              <el-table-column prop="illumi_flr_max" align="center" min-width="90" label="照度上限值" show-overflow-tooltip />
              <el-table-column prop="illumi_flr" align="center" min-width="90" label="照度下限值" show-overflow-tooltip />
              <el-table-column prop="illumi_top_min" align="center" label="最低亮度" show-overflow-tooltip />
              <el-table-column prop="illumi_top" align="center" label="最高亮度" show-overflow-tooltip />
              <el-table-column prop="energy" align="center" label="人感开关" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.people_on_off === 0 ? '关闭' : '开启' }}
                </template>
              </el-table-column>
              <el-table-column prop="trig_delay_tm" align="center" label="延迟时间" show-overflow-tooltip />
              <el-table-column prop="n_ramp_tm" align="center" label="渐变时间" show-overflow-tooltip />
              <el-table-column prop="minval" align="center" label="最低照度" show-overflow-tooltip />
              <el-table-column prop="maxval" align="center" label="最高照度" show-overflow-tooltip />
              <el-table-column prop="ip" align="center" min-width="120" label="网络IP" show-overflow-tooltip />
              <el-table-column prop="ssid" align="center" label="SSID" show-overflow-tooltip />
              <el-table-column prop="password" align="center" label="密码" show-overflow-tooltip />
              <el-table-column prop="energy" align="center" min-width="130" label="WIFI模块" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.wf_dev ? modelList[scope.row.wf_dev].name : '' }}
                </template>
              </el-table-column>
              <el-table-column prop="energy" align="center" min-width="120" label="射频范围" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.wf_mode ? rangList[scope.row.wf_mode - 1].name : '' }}
                </template>
              </el-table-column>
              <el-table-column prop="version" align="center" label="固件版本" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div v-show="msgShow" :style="{left: showType ? '150px' : '80px'}" class="showMsg">
          <div class="tits">
            <div class="title">
              消息
            </div>
            <el-button type="text" size="medium" @click="msgclose()"><i class="el-icon-close" /></el-button>
          </div>
          <div class="msgcon">
            <div v-for="(item, index) of msgList" :key="index" class="sing">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer :show-close="false" :visible.sync="drawer" append-to-body direction="rtl" class="lightset" @closed="hideBtn()">
      <el-button icon="el-icon-arrow-right" class="hidebtn" @click="hideBtn()" />
      <div class="contry">
        <div class="namepos">基础控制</div>
        <div v-if="hasPermission('led/openOrCloseLed')" class="conts">
          <div class="opencla">
            <span class="tis">灯设置</span>
            <el-button class="flt" size="mini" type="primary" @click="setSwitch(1)">开灯</el-button>
            <el-button class="flt" size="mini" @click="setSwitch(0)">关灯</el-button>
            <el-button class="flt" size="mini" @click="restartled()">重启主板</el-button>
          </div>
        </div>
        <div v-if="hasPermission('led/presetBrightness')" class="default-brightness">
          <div class="sespan">预设亮度</div>
          <div class="linesty" style="margin-right: 75px">
            <el-input v-model="defaultLight" type="text" maxlength="3" size="mini" style="width: 150px;" @input="defaultLight=defaultLight.replace(/[^\d]/g,'')" /> W
          </div>
          <el-button class="flt ysfloat" size="mini" type="primary" @click="changeLightStates()"><i style="font-size: 12px" class="icon iconfont leansite-2-xitongpeizhi" /> 设置</el-button>
        </div>
        <div v-if="hasPermission('led/firmwarePpdate')" class="default-brightness">
          <div class="sespan">固件升级</div>
          <div class="linesty" style="margin-right: 95px">
            <el-select v-model="gjUpdate" placeholder="选择升级包" style="width: 150px" size="mini">
              <el-option v-for="(item, index) in updateOptions" :key="index" :label="item.name + '(' + item.version + ')'" :value="index">
              </el-option>
            </el-select>
          </div>
          <el-button class="flt ysfloat" size="mini" icon="el-icon-top" type="primary" style="margin-left: 15px" @click="updateGJ()">升级</el-button>
        </div>
      </div>
      <div v-if="hasPermission('led/setLight')" class="contry1">
        <div class="namepos">光感控制</div>
        <el-form ref="lightmachineForm" :model="lightmachineForm" :rules="rules" label-width="120px" class="froms">
          <el-form-item class="opsty" label="开启:" prop="status">
            <el-switch v-model="lightmachineForm.status" class="switchs" />
          </el-form-item>
          <el-form-item class="opsty" label="控制方式:" prop="contronStatus">
            <el-switch v-model="lightmachineForm.contronStatus" active-text="开关灯" inactive-text="亮度调节" class="switchs" />
          </el-form-item>
          <el-form-item v-if="lightmachineForm.contronStatus" label="光感强度:" prop="hilightValue">
            <el-input v-model="lightmachineForm.hilightValue" placeholder="请输入光感强度" maxlength="5" @input="lightmachineForm.hilightValue=lightmachineForm.hilightValue.replace(/[^\d]/g,'')" />LX
          </el-form-item>
          <el-form-item v-if="!lightmachineForm.contronStatus" label="照度上限值:" prop="hilightValue">
            <el-input v-model="lightmachineForm.hilightValue" placeholder="请输入照度上限值" maxlength="5" @input="lightmachineForm.hilightValue=lightmachineForm.hilightValue.replace(/[^\d]/g,'')" />LX
          </el-form-item>
          <el-form-item v-if="!lightmachineForm.contronStatus" label="照度下限值:" prop="lowlightValue">
            <el-input v-model="lightmachineForm.lowlightValue" placeholder="请输入照度下限值" maxlength="5" @input="lightmachineForm.lowlightValue=lightmachineForm.lowlightValue.replace(/[^\d]/g,'')" />LX
          </el-form-item>
          <el-form-item v-if="!lightmachineForm.contronStatus" label="最低亮度:" prop="lowValues">
            <el-input v-model="lightmachineForm.lowValues" placeholder="请输入最低亮度" maxlength="5" @input="lightmachineForm.lowValues=lightmachineForm.lowValues.replace(/[^\d.]/g,'')" />%
          </el-form-item>
          <el-form-item v-if="!lightmachineForm.contronStatus" label="最高亮度:" prop="hiValues">
            <el-input v-model="lightmachineForm.hiValues" placeholder="请输入最高亮度" maxlength="5" @input="lightmachineForm.hiValues=lightmachineForm.hiValues.replace(/[^\d.]/g,'')" />%
          </el-form-item>
          <el-row>
            <el-col :span="24" class="stbutton">
              <el-button type="primary" size="mini" @click="submitForm('lightmachineForm')">
                <i style="font-size: 12px" class="icon iconfont leansite-2-xitongpeizhi" /> 设置
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="hasPermission('led/setPeople')" class="contry1">
        <div class="namepos">人感控制</div>
        <el-form ref="peoplemachineForm" :model="peoplemachineForm" :rules="rules" label-width="120px" class="froms">
          <el-form-item class="opsty" label="开启:" prop="status">
            <el-switch v-model="peoplemachineForm.status" class="switchs" />
          </el-form-item>
          <el-form-item label="延迟时间:" prop="delayTime">
            <el-input v-model="peoplemachineForm.delayTime" placeholder="请输入延迟时间" maxlength="5" @input="peoplemachineForm.delayTime=peoplemachineForm.delayTime.replace(/[^\d]/g,'')" />s
          </el-form-item>
          <el-form-item label="渐变时间:" prop="triggerValue">
            <el-input v-model="peoplemachineForm.triggerValue" placeholder="请输入渐变时间" maxlength="5" @input="peoplemachineForm.triggerValue=peoplemachineForm.triggerValue.replace(/[^\d]/g,'')" />s
          </el-form-item>
          <el-form-item label="最低亮度:" prop="lowValue">
            <el-input v-model="peoplemachineForm.lowValue" placeholder="请输入最低亮度" maxlength="5" @input="peoplemachineForm.lowValue=peoplemachineForm.lowValue.replace(/[^\d.]/g,'')" />%
          </el-form-item>
          <el-form-item label="最高亮度:" prop="hiValue">
            <el-input v-model="peoplemachineForm.hiValue" placeholder="请输入最高亮度" maxlength="5" @input="peoplemachineForm.hiValue=peoplemachineForm.hiValue.replace(/[^\d.]/g,'')" />%
          </el-form-item>
          <el-row>
            <el-col :span="24" class="stbutton">
              <el-button type="primary" size="mini" @click="submitForm('peoplemachineForm')">
                <i style="font-size: 12px" class="icon iconfont leansite-2-xitongpeizhi" /> 设置
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="hasPermission('led/setwifi')" class="contry1">
        <div class="namepos">网络配置</div>
        <el-form ref="wifimachineForm" :model="wifimachineForm" :rules="rules" label-width="120px" class="froms">
          <el-form-item label="IP地址:" prop="ip">
            <el-input v-model="wifimachineForm.ip" placeholder="请输入IP地址" style="margin-left: -10px" />
          </el-form-item>
          <el-form-item label="SSID:" prop="ssid">
            <el-input v-model="wifimachineForm.ssid" maxlength="20" placeholder="请输入SSID" style="margin-left: -10px" @input="wifimachineForm.ssid=wifimachineForm.ssid.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\w]/g,'')" />
          </el-form-item>
          <el-form-item label="WIFI密码:" prop="wifipwd">
            <el-input v-model="wifimachineForm.wifipwd" placeholder="请输入WIFI密码" style="margin-left: -10px" maxlength="20" />
          </el-form-item>
          <el-form-item label="WIFI模块:" prop="wifimodel">
            <el-select v-model="wifimachineForm.wifimodel" placeholder="请选择WIFI模块" style="width: 220px;margin-left: -15px">
              <el-option v-for="(item, index) in modelList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="射频范围:" prop="wifirange">
            <el-select v-model="wifimachineForm.wifirange" placeholder="请选择射频范围" style="width: 220px;margin-left: -15px">
              <el-option v-for="(item, index) in rangList" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="24" class="stbutton">
              <el-button type="primary" size="mini" @click="submitForm('wifimachineForm')">
                <i style="font-size: 12px" class="icon iconfont leansite-2-xitongpeizhi" /> 设置
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
    <div class="ctrlBox">
      <el-tooltip class="item" effect="dark" content="亮度级别控制" placement="top">
        <el-button type="primary" size="medium" circle @click="resetLigthStates()" />
      </el-tooltip>
    </div>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.lightset {
  /deep/ .el-drawer {
    width: 400px !important;
    height: calc(100vh - 48px);
    overflow: auto;
  }
  .froms {
    margin-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    .switchs {
      float: left;
      margin-top: 8px;
    }
    /deep/ .is-checked .el-switch__core {
      border-color: #006fe6;
      background-color: #006fe6;
    }
    /deep/ .el-input {
      width: 220px;
      margin-right: 5px;
    }
  }
  /deep/ .el-button--primary {
    background: #006fe6;
    border-color: #006fe6;
  }
  .stbutton {
    text-align: right;
    margin-right: 40px;
    width: 100%;
    /deep/ .el-button--primary {
      background: #006fe6;
      border-color: #006fe6;
      padding: 8px 20px;
      margin-right: 20px;
    }
  }
  .hidebtn {
    position: fixed;
    top: 42%;
    right: 400px;
    z-index: 9999;
    padding: 0px;
    height: 75px;
    width: 15px;
    border-radius: 0;
  }
  .contry {
    margin-top: -50px;
    text-align: center;
    /deep/ .el-button--default {
      color: #006fe6;
      border-color: #006fe6;
    }
    .default-brightness {
      .ysfloat {
        float: right;
        margin-top: -40px;
        margin-right: 20px;
      }
      padding-top: 0px;
      text-align: center;
      padding-left: 0px;
      .sespan {
        margin-bottom: 5px;
        font-size: 14px;
        float: left;
        margin-top: 15px;
        margin-left: 31px;
        margin-right: -23px;
      }
      .linesty {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 50px;
        .setpros {
          height: 20px;
          cursor: pointer;
        }
      }
    }
    .opencla {
      padding: 10px;
      text-align: left;
      .tis {
        // position: relative;
        margin-left: 21px;
        margin-right: 25px;
      }
      .flt {
        margin-right: 11px;
      }
    }
    .namepos {
      padding-top: 10px;
      font-size: 16px;
      // border-bottom: 2px solid #e5e5e5;
      padding-bottom: 10px;
      color: #323232;
    }
  }
  .contry1 {
    margin-top: 0px;
    text-align: center;
    .opsty {
      /deep/ .el-form-item__label {
        margin-left: 0px;
      }
    }
    /deep/.el-form-item__label {
      text-align: left;
      padding-left: 20px;
    }
    .default-brightness {
      padding-top: 0px;
      text-align: center;
      padding-left: 0px;
      .sespan {
        margin-bottom: 5px;
        font-size: 14px;
        float: left;
        margin-top: 15px;
        margin-left: 20px;
        margin-right: -23px;
      }
      .linesty {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 50px;
        .setpros {
          height: 20px;
          cursor: pointer;
        }
      }
    }
    .opencla {
      padding: 10px;
      .tis {
        position: relative;
        left: -35px;
      }
      .flt {
        margin-right: 20px;
      }
    }
    .namepos {
      padding-top: 10px;
      font-size: 16px;
      border-top: 2px solid #e5e5e5;
      padding-bottom: 10px;
      color: #323232;
    }
  }
}
.lightsty {
  height: calc(100vh - 97px);
  .contents {
    height: calc(100vh - 97px);
    overflow: auto;
    padding: 0 10px;
  }
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .showMsg {
    position: absolute;
    background-color: #f0f0f0;
    border: 1px solid #323232;
    border-left: none;
    width: 300px;
    height: 300px;
    bottom: 0px;
    .tits {
      border-bottom: 1px solid #b4b4b4;
      padding-bottom: 5px;
    }
    .title {
      text-align: left;
      width: 50%;
      margin-left: -20px;
      padding-top: 5px;
      font-size: 14px;
      color: #323232;
      font-weight: bold;
    }
    .msgcon {
      padding: 5px 10px;
      text-align: left;
      height: 265px;
      overflow: auto;
      .sing {
        height: 27px;
        color: #606266;
        display: flex;
        align-items: center;
      }
    }
    & button {
      float: right;
      margin-right: 10px;
      margin-top: -25px;
      & i {
        color: #323232;
      }
    }
  }
  .title {
    padding: 0px 30px;
    font-size: 14px;
  }
  .msgsty {
    float: right;
    margin-top: -35px;
    & button {
      padding-top: 0px;
      padding-bottom: 0px;
    }
    & i {
      font-size: 25px;
    }
  }
  .ctrlBox {
    position: absolute;
    right: 20px;
    top: 47%;
    /deep/ .el-button {
      transform: scale(1);
      background: url(data:image/png;base64,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)
        no-repeat 0 0;
      width: 48px;
      height: 48px;
      border: 0px;
    }
  }
  .buttons {
    padding: 0px 30px;
    margin-bottom: 15px;
    .refleshsty {
      color: #fff;
      font-size: 13px;
    }
    /deep/ .el-button--mini {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
    }
    /deep/ .el-button--text {
      color: #006fe6;
    }
    .imgposi {
      float: right;
      // right: 50px;
    }
    .flt {
      margin-left: 15px;
      /deep/ .is-checked {
        /deep/ .el-checkbox__inner {
          border-color: #006fe6;
          background-color: #006fe6;
        }
      }
    }
    .setcheck {
      height: 30px;
      padding-top: 4px;
    }
    /deep/ .is-checked {
      border-color: #006fe6;
    }
  }
  .mapsty {
    overflow: auto;
    overflow-x: hidden;
    text-align: center;
    padding: 0px 30px;
    .resle {
      padding: 7px 20px;
      background-color: #006fe6;
      border-color: #006fe6;
      position: absolute;
      z-index: 999;
      right: 40px;
      top: 110px;
      .refleshsty {
        color: #fff;
      }
    }
    /deep/ .is-active {
      color: #006fe6;
    }
    .setd {
      /deep/ .is-checked {
        /deep/ .el-checkbox__inner {
          background-color: #006fe6;
          border-color: #006fe6;
        }
      }
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
  }
  #mapLight {
    position: relative;
    overflow: hidden;
    height: auto;
    display: inline-block;
    .rgImg {
      width: 22px;
      height: 22px;
      left: 40px;
      position: absolute;
    }
    .ggImg {
      width: 22px;
      height: 22px;
      left: 0px;
      position: absolute;
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
</style>