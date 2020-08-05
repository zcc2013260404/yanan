<template>
  <div class="index">
    <!--桌面-->
    <div class="main-block">
      <!-- <div v-for="app in thirdAppList" :class="app.available=='0'?'block-item noActive':'block-item'" @click="openDialog(app)" :title="app.available=='0'?'您没有'+app.appName+'的操作权限':app.appName">
        <img :src="app.appIcon" />
        <span class="demonstration">{{app.appName}}</span>
      </div> -->
      <div class="deskcont">
        <div v-if="isShowUser" class="desktitle">用户中心</div>
        <div v-if="isShowUser" class="desklist">
          <div v-for="(app, index) in userChildList" :key="index" :style="{ display: app.isShow ? 'block': 'none' }" class="deskmenu" @click="alertComponent(app)">
            <div class="deskicon">
              <img :src="app.childIcon" />
            </div>
            <span class="demonstration">{{app.childrenName}}</span>
          </div>
        </div>
        <div v-if="isShowSmart" class="desktitle">智慧照明</div>
        <div v-if="isShowSmart" class="desklist">
          <div v-for="(app, index) in smartChildList" :key="index" :style="{ display: app.isShow ? 'block': 'none' }" class="deskmenu" @click="jumpFunc(app)">
            <div class="deskicon">
              <img :src="app.childIcon" />
            </div>
            <span class="demonstration">{{app.childrenName}}</span>
          </div>
        </div>
      </div>
    </div>
    <!--状态栏-->
    <div class="status-bar">
      <!--状态栏系统菜单-->
      <div id="systemMenuDiv" v-show="systemMenuVisible" class="systemMenu" tabIndex='1' @blur="systemMenuBlur">
        <ul class="leftMenus">
          <li v-for="(menus, index) in systemMenus" :key="index" :title="menus.appName" @click="alertComponent(menus)">
            <img :src="menus.appIcon" :alt="menus.appName" />
          </li>
        </ul>
        <ul class="rightMenus">
          <li v-for="(menus, index) in systemModuleList" :key="index" @click="alertComponent(menus)">
            <img :src="menus.appIcon" :tile="menus.appName" />
            <span>{{menus.appName}}</span>
          </li>
        </ul>
      </div>
      <img class="menuLogo" @click="clickSystemMenu" src="../assets/img/logo_icon.png" alt="菜单图标" title="打开系统菜单" />
      <!--<el-input
			    placeholder="在此处搜索应用"
			    prefix-icon="el-icon-search"
			    v-model="searchApp">
			</el-input>-->
      <!--显示活动的app图标-->
      <el-tooltip v-if="activeApps.length > 0" v-for="app in activeApps" :content="`${app.appName}`" placement="top" :class="app.isActive?'active':''" visible-arrow="false" :key="`${app.appName}`" @click.native="clickMinimizedApp(app)">
        <img class="statusIcon" v-bind:src="app.appIcon" />
      </el-tooltip>
    </div>
    <!--弹框打开第三方应用-->
    <DialogUrl v-for="app in activeApps" v-if="app.isShowDialog==true && app.webSource == 2" width="80%" @callBackFun="closeParentDialog" :appObj="app" :key="`${app.appName}`" :ref="'dialogUrl'+app.appName"></DialogUrl>
    <!--弹框打开组件-->
    <DialogComponent v-for="app in activeApps" v-if="app.isShowDialog==true && app.webSource == 1" width="80%" @callBackFun="closeParentDialog" :appObj="app" :key="`${app.appName}`" :ref="'dialogComponent'+app.appUrl"></DialogComponent>
    <div class="ctrlBox">
      <el-tooltip class="item" effect="dark" content="设置桌面" placement="top">
        <el-button type="primary" size="medium" icon="el-icon-s-tools" circle @click="setDesktop()" />
      </el-tooltip>
    </div>
    <el-drawer :show-close="false" :with-header="false" :visible.sync="drawer" append-to-body direction="rtl" class="lightset">
      <el-button icon="el-icon-arrow-right" class="hidebtn" @click="hideBtn()" />
      <div class="desktopSet">
        <div class="title">设置桌面</div>
        <div v-if="systemModules[0].isAuth" class="settitle">
          用户中心:
        </div>
        <div v-if="systemModules[0].isAuth" class="setcontent">
          <el-checkbox-group v-model="checkUserList">
            <el-checkbox v-for="(item, index) in userChildList" :style="{ display: item.isAuth ? '' : 'none' }" :key="index" :label="item.appId" class="getcheck">{{ item.childrenName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="systemModules[1].isAuth" class="settitle">
          设备中心:
        </div>
        <div v-if="systemModules[1].isAuth" class="setcontent">
          <el-checkbox-group v-model="checkDeviceList">
            <el-checkbox v-for="(item, index) in deviceChildList" :style="{ display: item.isAuth ? '' : 'none' }" :key="index" :label="item.appId" class="getcheck">{{ item.childrenName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="systemModules[3].isAuth" class="settitle">
          智慧照明:
        </div>
        <div v-if="systemModules[3].isAuth" class="setcontent">
          <el-checkbox-group v-model="checkSmartList" @change="setEnt()">
            <el-checkbox v-for="(item, index) in smartChildList" :style="{ display: item.isAuth ? '' : 'none' }" :key="index" :label="item.appId" class="getcheck">{{ item.childrenName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="stbutton">
          <el-button type="primary" size="medium" @click="saveDesktop()"> 保存 </el-button>
          <el-button size="medium" @click="hideBtn()"> 取消 </el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="选择企业" :visible.sync="addDialog" :close-on-click-modal="false" class="dialgs" width="400px" append-to-body>
      <div class="digcont">
        <el-input v-model="keyWords" placeholder="搜索" size="small" class="inputsty" clearable @input="findEntList()" />
        <el-button class="flt" size="small" type="primary" @click="confirmEnt()">确定</el-button>
      </div>
      <div class="digul">
        <el-table ref="multipleTable" :data="tableList" tooltip-effect="dark" height="400px" show-overflow-tooltip highlight-current-row @row-click="handleClick">
          <el-table-column align="center" width="80" label="行号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" label="名称" show-overflow-tooltip />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Bus from '../common/bus.js'
import DialogUrl from '../components/DialogUrl.vue' //弹框打开第三方应用
import DialogComponent from '../components/DialogComponent.vue' //弹框打开系统组件
export default {
  name: 'index',
  components: {
    DialogUrl,
    DialogComponent
  },
  data() {
    return {
      timeStamp: new Date().getTime(),
      searchApp: '', //搜索应用
      systemMenuVisible: false, //是否显示状态栏系统菜单
      thirdAppList: [], //桌面第三方应用
      systemMenus: [
        //系统菜单项目
        // { appName:'个人中心',appUrl:'',appIcon:require("../assets/img/yonghu.png")},
        //					{ appName:'设置中心',appUrl:'/gerenzhongxin',appIcon:require("../assets/img/shezhi.png")},
        // { appName:'修改密码',appUrl:'/gerenzhongxin',appIcon:require("../assets/img/shezhi.png")},
        { appName: '退出系统', appUrl: '/logout', appIcon: require('../assets/img/tuichu.png') }
      ],
      systemModules: [
        //系统功能模块
        {
          appId: 1,
          appName: '用户中心',
          appUrl: 'UserCenterHome',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          powerName: 'userCenter',
          isAuth: false //是否有权限
        },
        {
          appId: 2,
          appName: '设备中心',
          appUrl: 'DeviceCenterHome',
          appIcon: require('../assets/img/wulianwang.png'),
          powerName: 'deviceCenter',
          isAuth: false //是否有权限
        },
        {
          appId: 3,
          appName: '监测管理',
          appUrl: 'MonitorIndex',
          appIcon: require('../assets/img/jianceguanli.png'),
          powerName: 'monitorCenter',
          isAuth: false //是否有权限
        },
        {
          appId: 4,
          appName: '智慧照明',
          appUrl: 'SmartLightCenterHome',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          powerName: 'wisdomfloodlight',
          isAuth: false //是否有权限
        },
        {
          appId: 5,
          appName: '运维中心',
          appUrl: this.API.leansite.requestIP.devOps,
          appIcon: require('../assets/img/yunweizhongxin.png'),
          powerName: 'ops',
          isAuth: false //是否有权限
        },
        {
          appId: 6,
          appName: '数据中台',
          appUrl: this.API.leansite.requestIP.dataControl,
          appIcon: require('../assets/img/dataControl.png'),
          powerName: 'dataControl',
          isAuth: false //是否有权限
        },
        {
          appId: 7,
          appName: '商业智能',
          appUrl: this.API.leansite.requestIP.analysisControl,
          appIcon: require('../assets/img/businessIntelligence.png'),
          powerName: 'analysisControl',
          isAuth: false //是否有权限
        }
      ],
      userChildList: [
        {
          appId: 101,
          appName: '用户中心',
          childrenName: '租户管理',
          appUrl: 'UserCenterHome',
          childUrl: '/tenantList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/zhgl.png'),
          powerName: 'tenant/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 102,
          appName: '用户中心',
          childrenName: '组织架构',
          appUrl: 'UserCenterHome',
          childUrl: '/deptList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/zjjg.png'),
          powerName: 'org/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 103,
          appName: '用户中心',
          childrenName: '角色管理',
          appUrl: 'UserCenterHome',
          childUrl: '/roleList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/jsgl.png'),
          powerName: 'role/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 104,
          appName: '用户中心',
          childrenName: '用户管理',
          appUrl: 'UserCenterHome',
          childUrl: '/userList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/yhgl.png'),
          powerName: 'user/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 105,
          appName: '用户中心',
          childrenName: '活动日志',
          appUrl: 'UserCenterHome',
          childUrl: '/logList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/hdrz.png'),
          powerName: 'sysLog/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 106,
          appName: '用户中心',
          childrenName: '预警监控',
          appUrl: 'UserCenterHome',
          childUrl: '/monitor',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/yjjk.png'),
          powerName: 'monitor/list',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        }
      ],
      deviceChildList: [
        {
          appId: 201,
          appName: '设备中心',
          childrenName: '网络设备',
          appUrl: 'DeviceCenterHome',
          childUrl: '/networkDeviceList',
          appIcon: require('../assets/img/wulianwang.png'),
          childIcon: require('../assets/img/gpgl.png'),
          powerName: 'netDevices/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 202,
          appName: '设备中心',
          childrenName: '参数管理',
          appUrl: 'DeviceCenterHome',
          childUrl: '/deviceParameterList',
          appIcon: require('../assets/img/wulianwang.png'),
          childIcon: require('../assets/img/gysb.png'),
          powerName: 'devicesAttrSet/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 203,
          appName: '设备中心',
          childrenName: '类型管理',
          appUrl: 'DeviceCenterHome',
          childUrl: '/deviceTypeList',
          appIcon: require('../assets/img/wulianwang.png'),
          childIcon: require('../assets/img/lxgl.png'),
          powerName: 'devicesClassify/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 204,
          appName: '设备中心',
          childrenName: '工业设备',
          appUrl: 'DeviceCenterHome',
          childUrl: '/industryDeviceList',
          appIcon: require('../assets/img/wulianwang.png'),
          childIcon: require('../assets/img/gysb.png'),
          powerName: 'productDevices/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 205,
          appName: '设备中心',
          childrenName: '关联配置',
          appUrl: 'DeviceCenterHome',
          childUrl: '/relationDeviceList',
          appIcon: require('../assets/img/wulianwang.png'),
          childIcon: require('../assets/img/glpz.png'),
          powerName: 'productNet/view',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        }
      ],
      smartChildList: [
        {
          appId: 401,
          appName: '智慧照明',
          childrenName: '统计汇总',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/statisticalSum',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/tongjihuizong.png'),
          powerName: 'statistics',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 402,
          appName: '智慧照明',
          childrenName: '企业列表',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/qiyexinxi.png'),
          powerName: 'companiesList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 403,
          appName: '智慧照明',
          childrenName: '故障代码',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/errorCode',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/guzhangdaima.png'),
          powerName: 'faultCode',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 404,
          appName: '智慧照明',
          childrenName: '固件版本',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/firmwareVersion',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/gujianbanben.png'),
          powerName: 'firmwareVersion',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 435,
          appName: '智慧照明',
          childrenName: '施工信息',
          appUrl: 'SmartLightCenterHome',
          parentChild: 'enterprisesList',
          childUrl: '/constructionInfoList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/sgxx.png'),
          powerName: 'construction/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 436,
          appName: '智慧照明',
          childrenName: '施工区域',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/constructionAreaList',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/sgqy.png'),
          powerName: 'area/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 437,
          appName: '智慧照明',
          childrenName: '照明一体机',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/lightMachine',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/zmytj.png'),
          powerName: 'computer/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 438,
          appName: '智慧照明',
          childrenName: '智慧开关',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/smartSwitchList',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/zhkg.png'),
          powerName: 'switch/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 439,
          appName: '智慧照明',
          childrenName: '照明设置',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/lightSetting',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/zmsz.png'),
          powerName: 'led/findAreasByLed',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 440,
          appName: '智慧照明',
          childrenName: '定时控制',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/timingControlList',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/dskz.png'),
          powerName: 'scheduler/findTaskSchedulerList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 441,
          appName: '智慧照明',
          childrenName: '验收报告',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/acceptanceReport',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/ysbg.png'),
          powerName: 'inspectionReport/findLampList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 442,
          appName: '智慧照明',
          childrenName: '能源统计',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/energyStatistics',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/nytj.png'),
          powerName: 'ledPowerStatistics/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 443,
          appName: '智慧照明',
          childrenName: '在线售后',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/afterSales',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/zxsh.png'),
          powerName: 'question/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 444,
          appName: '智慧照明',
          childrenName: '故障信息',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/faultInformation',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/gzxx.png'),
          powerName: 'faultmessage',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 445,
          appName: '智慧照明',
          childrenName: '系统配置',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/systemConfig',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/zhihuizhaoming.png'),
          childIcon: require('../assets/img/xtpz.png'),
          powerName: 'originalPower/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        },
        {
          appId: 446,
          appName: '智慧照明',
          childrenName: '人感统计',
          appUrl: 'SmartLightCenterHome',
          childUrl: '/senseStatistics',
          parentChild: 'enterprisesList',
          appIcon: require('../assets/img/yonghuzhongxin.png'),
          childIcon: require('../assets/img/xtpz.png'),
          powerName: 'originalPower/findList',
          isAuth: false, //是否有权限
          isSelect: false, //是否选中
          isShow: false // 是否显示
        }
      ],
      checkUserList: [],
      checkDeviceList: [],
      checkSmartList: [],
      isShowUser: false,
      isShowDevice: false,
      isShowSmart: false,
      appObj: null,
      addDialog: false,
      keyWords: '',
      selectEnt: null,
      tableList: [],
      systemList: [], //系统应用
      activeApps: [], //状态栏显示打开的app数组
      drawer: false
    }
  },
  computed: {
    systemModuleList: function() {
      let filterSystemModules = this.systemModules.filter(function(currentValue, index) {
        return currentValue.isAuth == true
      })
      return filterSystemModules
    }
  },
  created() {
    if (!this.$store.getters['userCenter/getToken'] && this.$store.getters['userCenter/getToken'].length <= 0) {
      this.$router.push('/login') // 正常登录
      return
    } else {
      //      		this.getData();
      //      		this.getSystemData();
      this.menuPower()
      this.findDesktop()
    }
    //重新加载数据
    Bus.$on('reloadData', msg => {
      //              this.getData();
      //      		this.getSystemData();
    })
  },
  mounted() {},
  methods: {
    /**
     * 系统菜单右侧权限
     */
    menuPower() {
      var self = this
      let powerList = this.$store.getters['userCenter/getOperationAuthority']
      if (powerList.length > 0) {
        self.systemModules.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            self.systemModules[index].isAuth = true
          }
        })
        this.userChildList.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            item.isAuth = true
          }
        })
        this.deviceChildList.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            item.isAuth = true
          }
        })
        this.smartChildList.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            if (self.$store.getters['userCenter/getUser'].tenantId && item.appId < 435) {
              item.isAuth = false
            } else {
              item.isAuth = true
            }
          }
        })
        console.log(this.smartChildList)
      }
      if (this.systemList.length > 0) {
        this.systemList.forEach((item, index) => {
          this.systemModules.forEach((item2, index2) => {
            if (item.appName == item2.appName) {
              this.systemModules[index2].isAuth = true
            }
          })
        })
      }
    },
    /**
     * 系统菜单失去焦点事件
     */
    systemMenuBlur(e) {
      this.systemMenuVisible = false
    },
    /**
     * 获取系统应用列表数据
     */
    getSystemData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getSysApp,
          params: {
            roleNames: this.$store.getters['userCenter/getRoles'].toString()
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.status == 200) {
            this.systemList = resData.data
            this.menuPower() //左侧菜单权限
          } else {
            this.$message({
              type: 'error',
              message: '查询失败，请刷新重试！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '请求异常，请检查网络！'
          })
        })
    },
    /**
     * 获取应用列表数据
     */
    getData() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getThirdApp,
          params: {
            roleNames: this.$store.getters['userCenter/getRoles'].toString()
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.status == 200) {
            this.thirdAppList = resData.data
          } else {
            this.$message({
              type: 'error',
              message: '查询失败，请刷新重试！'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '请求异常，请检查网络！'
          })
        })
    },
    /**
     * 打开桌面的第三方app
     */
    openDialog(appObj) {
      if (appObj.available == '0') {
        //没有操作权限
        this.$alert('您没有' + appObj.appName + '的操作权限，请联系管理员!', '操作提示', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return
      }
      let searchIndex = -1
      if (this.activeApps.length > 0) {
        searchIndex = this.activeApps.findIndex(value => value.appName == appObj.appName)
      }
      if (searchIndex == -1) {
        if (this.activeApps.length >= 20) {
          this.$message({
            type: 'info',
            message: '最多只能同是打开20个应用/功能'
          })
          return
        }
        let chioceApp = {}
        for (let i = 0; i < this.thirdAppList.length; i++) {
          if (this.thirdAppList[i].appName == appObj.appName) {
            chioceApp = this.thirdAppList[i]
            break
          }
        }
        let appObject = {
          appName: appObj.appName, //APP名称
          appIcon: appObj.appIcon, //app图标
          webSource: 2, //打开的网页来源  1=本项目；2=第三方项目
          appUrl: appObj.appUrl,
          isActive: true, //状态栏中显示的app是否处于活动状态
          isShowDialog: true, //是否显示弹框
          isMinimize: false //是否缩小弹框
        }
        let pushIndex = this.activeApps.length > 0 ? this.activeApps.length : 0
        this.$set(this.activeApps, pushIndex, appObject)
      }
    },
    handleClick(row, column, event) {
      if (row) {
        this.selectEnt = row
      }
    },
    confirmEnt() {
      if (this.selectEnt) {
        this.$store.dispatch('smartLight/setcurrCompany', {
          data: this.selectEnt
        })
        this.addDialog = false
        this.alertComponent(this.appObj)
      } else {
        this.$message({
          type: 'error',
          message: '请选择企业'
        })
      }
    },
    jumpFunc(appObj) {
      this.appObj = appObj
      if (appObj.parentChild) {
        this.keyWords = ''
        this.selectEnt = null
        if (this.$store.getters['userCenter/getUser'].tenantId) {
          var item = JSON.parse(JSON.stringify(this.$store.getters['userCenter/getUser'].factory))
          item.id = item.tenantId
          this.$store.dispatch('smartLight/setcurrCompany', {
            data: item
          })
          this.alertComponent(appObj)
        } else {
          this.findEntList()
          this.addDialog = true
        }
      } else {
        this.alertComponent(appObj)
      }
    },
    findEntList() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.getCompanyList,
          params: {
            pageNum: 1,
            pageSize: 999999,
            name: this.keyWords
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.tableList = res.data.data.list
          }
        })
    },
    /**
     * 新增状态栏数据处理
     * SystemMenu组件回调
     */
    openComponent(appObj) {
      let searchIndex = -1
      if (this.activeApps.length > 0) {
        searchIndex = this.activeApps.findIndex(value => value.appUrl == appObj.appUrl)
      }
      if (searchIndex == -1) {
        if (this.activeApps.length >= 20) {
          this.$message({
            type: 'info',
            message: '最多只能同是打开20个应用或功能'
          })
          return
        }
        let newActiveApps = this.activeApps
        newActiveApps.forEach((item, index) => {
          item.isShowDialog = true
          item.isActive = false
          item.isMinimize = false
        })
        this.activeApps = newActiveApps
        let appObject = {
          appName: appObj.appName, //APP名称
          appIcon: appObj.appIcon, //app图标
          webSource: 1, //打开的网页来源  1=本项目；2=第三方项目
          appUrl: appObj.appUrl,
          isActive: true, //状态栏中显示的app是否处于活动状态
          isShowDialog: true, //是否显示弹框
          isMinimize: false, //是否缩小弹框
          childUrl: appObj.childUrl
        }
        let pushIndex = this.activeApps.length > 0 ? this.activeApps.length : 0
        this.$set(this.activeApps, pushIndex, appObject)
      } else {
        this.clickMinimizedApp(this.activeApps[searchIndex])
      }
    },
    /**
     * 关闭桌面的第三方应用和系统组件弹框
     */
    closeParentDialog(appObj) {
      let searchIndex = -1
      if (this.activeApps.length > 0) {
        searchIndex = this.activeApps.findIndex(value => value.appName == appObj.appName)
      }
      if (searchIndex != -1) {
        this.$delete(this.activeApps, searchIndex)
      }
    },
    /**
     * 点击底部状态栏中缩小的app图标
     */
    clickMinimizedApp(appObj) {
      if (this.activeApps.length > 0) {
        let searchIndex = -1
        for (let i = 0; i < this.activeApps.length; i++) {
          if (this.activeApps[i].appName == appObj.appName) {
            searchIndex = i
            break
          }
        }
        //重置所有activeApps中的状态数据
        let newActiveApps = this.activeApps
        newActiveApps.forEach((item, index) => {
          item.isShowDialog = true
          item.isActive = false
          item.isMinimize = false
        })
        this.activeApps = newActiveApps
        if (searchIndex != -1) {
          //当前选中的模块 处于活动状态
          let editApp = this.activeApps[searchIndex]
          editApp.isMinimize = false
          editApp.isShowDialog = true
          editApp.isActive = true
          editApp.childUrl = appObj.childUrl
          if (appObj.appUrl === 'SmartLightCenterHome') {
            this.$store.dispatch('smartLight/setLightChildMenuPath', {
              data: 'dialogReload'
            })
          } else {
            this.$store.dispatch('userCenter/setChildMenuPath', {
              data: 'dialogReload'
            })
          }
          let oRefs = null
          if (appObj.webSource == 1) {
            //显示本项目模块
            this.activeApps[searchIndex] = editApp
            oRefs = this.$refs['dialogComponent' + appObj.appUrl][0]
            oRefs.moduleDialogVisible = false
          } else {
            //显示第三方应用
            oRefs = this.$refs['dialogUrl' + appObj.appName][0]
            oRefs.dialogVisible = false
          }
          setTimeout(() => {
            oRefs.isminimize = false
            if (appObj.webSource == 1) {
              oRefs.moduleDialogVisible = true
            } else {
              oRefs.dialogVisible = true
            }
          }, 0)
        }
      }
    },
    /**
     * 点击系统菜单logo
     */
    clickSystemMenu() {
      this.systemMenuVisible = !this.systemMenuVisible
    },
    /**
     * 点击弹出组件
     */
    alertComponent(menuObj) {
      this.systemMenuVisible = false
      this.timeStamp = new Date().getTime()
      switch (menuObj.appName) {
        case '退出系统':
          this.logout()
          break
        case '运维中心':
          this.openDialog(menuObj)
          break
        case '数据中台':
          window.open(menuObj.appUrl, '_blank')
          break
        case '商业智能':
          window.open(menuObj.appUrl, '_blank')
          break
        default:
          this.openComponent(menuObj)
          break
      }
    },
    /**
     * 退出系统
     */
    logout() {
      this.$confirm('确定退出系统吗?', '操作提示', {
        confirmButtonText: '退出系统',
        cancelButtonText: '继续使用',
        type: 'warning'
      }).then(() => {
        //退出系统
        this.logoutRequest()
      })
    },
    /**
     * 退出系统请求
     */
    logoutRequest() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.logout
        })
        .then(res => {
          this.commonFun.againLogin()
        })
        .catch(err => {
          this.commonFun.againLogin()
        })
    },
    /**
     * 打开桌面设置
     */
    setDesktop() {
      this.findDesktop()
      this.drawer = true
    },
    /**
     * 隐藏桌面设置
     */
    hideBtn() {
      this.drawer = false
    },
    // 判断是否选中智慧照明三级菜单
    setEnt() {
      const index = this.checkSmartList.findIndex((item, index) => {
        return item > 434
      })
      if (index > -1 && !this.$store.getters['userCenter/getUser'].tenantId) {
        const checkindex = this.checkSmartList.findIndex((item, index) => {
          return item === 402
        })
        if (checkindex < 0) {
          this.checkSmartList.push(402)
        }
      }
    },
    findDesktop() {
      this.$axios
        .leansite({
          method: 'get',
          url: this.API.leansite.findDeskTop,
          params: {
            userId: this.$store.getters['userCenter/getUser'].id,
            pageNum: 1,
            pageSize: 99999999
          }
        })
        .then(res => {
          this.isShowUser = false
          this.isShowDevice = false
          this.isShowSmart = false
          if (res.data.data.list.length > 0) {
            let self = this
            this.checkUserList = []
            this.checkDeviceList = []
            this.checkSmartList = []
            this.userChildList.forEach(function(uitem, uindex) {
              const checkindex = res.data.data.list.findIndex((item, index) => {
                return uitem.appId === item.menuId
              })
              uitem.isShow = checkindex > -1 && uitem.isAuth
              if (uitem.isShow) {
                self.isShowUser = true
                self.checkUserList.push(uitem.appId)
              }
            })
            this.deviceChildList.forEach(function(ditem, dindex) {
              const checkindex = res.data.data.list.findIndex((item, index) => {
                return ditem.appId === item.menuId
              })
              ditem.isShow = checkindex > -1 && ditem.isAuth
              if (ditem.isShow) {
                self.isShowDevice = true
                self.checkDeviceList.push(ditem.appId)
              }
            })
            this.smartChildList.forEach(function(sitem, sindex) {
              const checkindex = res.data.data.list.findIndex((item, index) => {
                return sitem.appId === item.menuId
              })
              sitem.isShow = checkindex > -1 && sitem.isAuth
              if (sitem.isShow) {
                self.isShowSmart = true
                self.checkSmartList.push(sitem.appId)
              }
            })
            console.log(this.smartChildList)
          }
        })
    },
    saveDesktop() {
      const dataList = []
      this.checkUserList.forEach((item, index) => {
        dataList.push({
          menuId: item,
          parentId: (item + '').substring(0, 1),
          userId: this.$store.getters['userCenter/getUser'].id
        })
      })
      this.checkDeviceList.forEach((item, index) => {
        dataList.push({
          menuId: item,
          parentId: (item + '').substring(0, 1),
          userId: this.$store.getters['userCenter/getUser'].id
        })
      })
      this.checkSmartList.forEach((item, index) => {
        dataList.push({
          menuId: item,
          parentId: (item + '').substring(0, 1),
          userId: this.$store.getters['userCenter/getUser'].id
        })
      })
      this.$axios
        .leansite({
          method: 'post',
          url: this.API.leansite.saveDeskTop,
          data: dataList
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.hideBtn()
            this.findDesktop()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped type="text/css">
.dialgs {
  /deep/ .el-dialog__body {
    margin-top: -15px;
    margin-bottom: 10px;
  }
  /deep/ .el-button {
    padding: 7px 20px;
    border-color: #006fe6;
  }
  /deep/ .el-button--primary {
    background-color: #006fe6;
    border-color: #006fe6;
    margin-top: 1px;
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
  .digcont {
    width: 100%;
    display: flex;
    .inputsty {
      width: 275px;
      margin-right: 10px;
    }
  }
  .digul {
    margin-top: -10px;
    height: 400px;
    overflow: auto;
    border-radius: 5px;
    padding: 10px;
    /deep/ .el-table__row {
      cursor: pointer;
    }
    .digli {
      height: 32px;
      line-height: 32px;
    }
  }
}
.lightset {
  /deep/ .el-drawer {
    width: 400px !important;
  }
  .hidebtn {
    position: fixed;
    top: 42%;
    right: 400px;
    z-index: 9999;
    padding: 0px;
    height: 75px;
    width: 15px;
  }
  .desktopSet {
    width: 100%;
    height: calc(100vh - 48px);
  }
  .getcheck {
    margin-top: 16px;
    width: 95px;
    color: #323232;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding-top: 15px;
    padding-bottom: 15px;
    color: #323232;
    border-bottom: 1px solid #bebebe;
  }
  .settitle {
    font-weight: bold;
    padding-top: 10px;
    padding-left: 10px;
    color: #323232;
  }
  .stbutton {
    text-align: center;
    margin-top: 20px;
    position: absolute;
    bottom: 84px;
    width: 100%;
    /deep/ .el-button--primary {
      background: #006fe6;
      border-color: #006fe6;
      padding: 8px 25px;
    }
    /deep/ .el-button--default {
      border-color: #006fe6;
      padding: 8px 25px;
      color: #006fe6;
    }
  }
  .setcontent {
    padding-left: 35px;
    margin-right: -10px;
  }
  /deep/ .el-checkbox__inner {
    border: 1px solid #bebebe;
  }
  /deep/ .is-checked {
    /deep/ .el-checkbox__inner {
      background-color: #006fe6;
      border-color: #006fe6;
    }
    /deep/ .el-checkbox__label {
      color: #006fe6;
    }
  }
}
.index {
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  overflow-x: auto;
  .ctrlBox {
    position: absolute;
    right: 20px;
    top: 47%;
    /deep/ .el-button--primary {
      background: #1e67b9;
      border-color: #1e67b9;
    }
  }
  .main-block {
    width: 100vw;
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    align-content: flex-start;
    background: #ffffff url(../assets/img/index_bg.png) no-repeat center;
    background-size: cover;
    .deskcont {
      width: 100vw;
      .desktitle {
        font-size: 16px;
        font-weight: bold;
        margin: 10px;
        color: #323232;
      }
      .desklist {
        margin-top: 5px;
        border: 1px solid #dedede;
        border-radius: 5px;
        margin-left: 10px;
        margin-right: 10px;
        padding: 0px 15px 30px;
        display: flex;
        background: rgba($color: #fff, $alpha: 0.5);
        flex-wrap: wrap;
      }
      .deskmenu {
        width: 110px;
        text-align: center;
        color: #323232;
        cursor: pointer;
        margin-top: 30px;
        margin-right: 40px;
        cursor: pointer;
        .deskicon {
          background: #1e67b9;
          height: 65px;
          width: 65px;
          display: flex;
          text-align: center;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          margin-left: 23px;
          margin-bottom: 10px;
          & i {
            color: #fff;
            font-size: 28px;
          }
        }
      }
    }
    .block-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 10vh;
      cursor: pointer;
      margin-top: 3.5vh;
      margin-left: 2vw;
      img {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
      }
    }
    .block-item.noActive {
      opacity: 0.3;
    }
  }
  .status-bar {
    width: 100%;
    height: 5vh;
    min-height: 48px;
    line-height: 5vh;
    background-color: #31353f;
    position: fixed;
    bottom: 0;
    z-index: 9999;
    .systemMenu {
      width: 280px;
      height: 39vh;
      background-color: #31353f;
      box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
      position: absolute;
      left: 0;
      top: -39vh;
      .leftMenus {
        display: inline-block;
        width: 21.5%;
        padding: 5% 0 0;
        text-align: center;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        overflow-y: auto;
        li {
          height: 51px;
          line-height: 51px;
        }
        li:hover {
          background-color: #4c5363;
        }
      }
      .rightMenus {
        display: inline-block;
        cursor: pointer;
        height: 91%;
        padding: 6% 0;
        width: 78.3%;
        text-align: left;
        border-left: 1px solid #4c5363;
        border-bottom: 1px solid #4c5363;
        float: right;
        overflow-y: auto;
        li {
          padding-left: 8.5%;
          height: 42px;
          line-height: 42px;
          span {
            margin-left: 10px;
            color: #ffffff;
          }
        }
        li:hover {
          background-color: #4c5363;
        }
      }
    }
    #systemMenuDiv:focus {
      outline-color: transparent;
    }
    img.menuLogo {
      width: 30px;
      height: 30px;
      padding: 10px 15px;
      cursor: pointer;
      margin-right: 10px;
      background-color: #202020;
    }
    img.menuLogo:hover {
      background-color: #202020;
    }
    .el-input {
      width: 276px;
      height: 36px;
      line-height: 36px;
      background-color: #eeeeee;
      border-radius: 4px;
      margin-right: 10px;
    }
    .el-tooltip {
      cursor: pointer;
      margin: 0 5px;
      padding: 0 8px;
      height: 33px;
      border: none;

      img.statusIcon {
        cursor: pointer;
        width: 40px;
        height: 40px;
      }
    }
    .el-tooltip.active {
      border-bottom: 3px solid #a0a9b5;
    }
    .el-tooltip:hover {
      background-color: #4c5363;
    }
  }
}

::-webkit-scrollbar {
  width: 1px;
  background-color: transparent;
}
</style>
