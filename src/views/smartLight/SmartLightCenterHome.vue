<template>
  <el-container class="smartLightCenterHome">
    <el-header>
      <img src="../../assets/img/logo.png" alt="平台logo">
      <span>智慧照明中心</span>
    </el-header>
    <el-container class="platformContainer">
      <el-tabs v-model="tableIndex" id="tabsContain" type="border-card" tab-position="left" :before-leave="beforeLeave" @tab-click="changeTab">
        <el-tab-pane v-for="(aside,index) in asideList" :key="index + ''">
          <div slot="label">
            <img :src="(activeIndex == index) || (activeIndex < 0 && enterprisesIndex === index) ? aside.icon[1] : aside.icon[0]" alt="菜单图标">
            <label :style="{ color: (activeIndex == index) || (activeIndex < 0 && enterprisesIndex === index) ? '#006edd' : '' }">{{aside.name}}</label>
          </div>
          <el-row v-if="(activeIndex == index) || (activeIndex < 0 && enterprisesIndex === index)">
            <el-col :span="24">
              <currMenu :key="index + ''"></currMenu>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'SmartLightCenterHome', //智慧照明中心首页
  props: {
    username: {
      //用户名
      type: String,
      default: '',
      required: true
    },
    leansiteToken: {
      //token信息
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      oldAsideList: [
        //原始侧边栏菜单
        {
          icon: [require('../../assets/img/LightCtrl/tongjihuizong-wxz.png'), require('../../assets/img/LightCtrl/tongjihuizong-xz.png')],
          name: '统计汇总',
          links: '/statisticalSum',
          powerName: 'statistics'
        },
        {
          icon: [require('../../assets/img/LightCtrl/qiyexinxi-wxz.png'), require('../../assets/img/LightCtrl/qiyexinxi-xz.png')],
          name: '企业列表',
          links: '/enterprisesList',
          powerName: 'companiesList'
        },
        {
          icon: [require('../../assets/img/LightCtrl/guzhangdaima-wxz.png'), require('../../assets/img/LightCtrl/guzhangdaima-xz.png')],
          name: '故障代码',
          links: '/errorCode',
          powerName: 'faultCode'
        },
        {
          icon: [require('../../assets/img/LightCtrl/gjbb.png'), require('../../assets/img/LightCtrl/gjbbs.png')],
          name: '固件版本',
          links: '/firmwareVersion',
          powerName: 'firmwareVersion'
        }
      ],
      oldchildAsideList: [
        //原始侧边栏菜单
        {
          icon: ['icon iconfont leansite-2-shigongxinxi', require('../../assets/img/userCenter/jueseguanli-xz.png')],
          name: '施工信息',
          links: '/constructionInfoList',
          powerName: 'construction/findList'
        },
        {
          icon: ['icon iconfont leansite-2-shigongquyu', require('../../assets/img/userCenter/yonghu-xz.png')],
          name: '施工区域',
          links: '/constructionAreaList',
          powerName: 'area/findList'
        },
        {
          icon: ['icon iconfont leansite-2-yitiji', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '照明一体机',
          links: '/lightMachine',
          powerName: 'computer/findList'
        },
        {
          icon: ['icon iconfont leansite-2-zhihuikaiguan', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '智慧开关',
          links: '/smartSwitchList',
          powerName: 'switch/findList'
        },
        {
          icon: ['icon iconfont leansite-2-zhaomingshezhi', require('../../assets/img/userCenter/zuhu-xz.png')],
          name: '照明设置',
          links: '/lightSetting',
          powerName: 'led/findAreasByLed'
        },
        {
          icon: ['icon iconfont leansite-2-dingshi', require('../../assets/img/userCenter/zuzhijiagou-xz.png')],
          name: '定时控制',
          links: '/timingControlList',
          powerName: 'scheduler/findTaskSchedulerList'
        },
        // {
        //     icon: [
        //         'icon iconfont leansite-2-renwu',
        //         require('../../../assets/img/userCenter/jueseguanli-xz.png')
        //     ],
        //     name: '任务设置',
        //     links: '/roleList',
        //     powerName: 'role/view'
        // },
        {
          icon: ['icon iconfont leansite-2-yanshoubaogao', require('../../assets/img/userCenter/yonghu-xz.png')],
          name: '验收报告',
          links: '/acceptanceReport',
          powerName: 'inspectionReport/findLampList'
        },
        {
          icon: ['icon iconfont leansite-2-nengyuantongji', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '能源统计',
          links: '/energyStatistics',
          powerName: 'ledPowerStatistics/findList'
        },
        {
          icon: ['icon iconfont leansite-yonghuxinxi', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '人感统计',
          links: '/senseStatistics',
          powerName: 'ledPowerStatistics/findList'
        },
        {
          icon: ['icon iconfont leansite-2-zaixianshouhou', require('../../assets/img/userCenter/yonghu-xz.png')],
          name: '在线售后',
          links: '/afterSales',
          powerName: 'question/findList'
        },
        {
          icon: ['icon iconfont leansite-shouye-guzhang', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '故障信息',
          links: '/faultInformation',
          powerName: 'faultmessage'
        },
        {
          icon: ['icon iconfont leansite-2-xitongpeizhi', require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '系统配置',
          links: '/systemConfig',
          powerName: 'originalPower/findList'
        }
      ],
      tableIndex: '0',
      enterprisesIndex: -1,
      asideList: [], //显示的菜单列表
      showType: this.$store.getters['userCenter/getUser'].tenantId ? false : true,
      activeIndex: 0 //点击当前元素的index
    }
  },
  created() {
    this.menuPower() //左侧菜单权限
    if (!this.showType) {
      const flag = this.checkUrl('/enterprisesList')
      if (!flag) {
        let self = this
        this.oldAsideList.forEach(function(item, index) {
          if (item.links === '/enterprisesList') {
            self.asideList.push(item)
          }
        })
      }
      this.loadComponent('/enterprisesList')
    }
    if (!this.$store.getters['smartLight/getLightChildMenuPath']) {
      if (this.asideList.length > 0) {
        this.loadComponent(this.asideList[0].links) //加载组件
      }
    } else {
      this.setUrl()
    }
  },
  mounted() {
    if (!this.showType) {
      document.getElementById('tabsContain').firstChild.style.display = 'none'
      this.getUrl('/enterprisesList')
    } else {
      this.setUrl()
    }
  },
  computed: {
    childrenMenu() {
      return this.$store.state.smartLight.lightChildMenuPath
    }
  },
  watch: {
    childrenMenu(val) {
      if (val) {
        // 弹出框重新加载
        if (val === 'dialogReload') {
          this.$store.dispatch('smartLight/setcurrCompany', {
            data: {},
            optType: 'delete'
          })
        } else {
          this.getUrl(val)
        }
      }
    }
  },
  methods: {
    changeTab() {
      if (this.activeIndex < 0) {
        this.getUrl(this.asideList[parseInt(this.tableIndex + '')].links)
      }
    },
    // 通过桌面点击跳转
    setUrl() {
      const path = this.$store.getters['smartLight/getLightChildMenuPath']
      if (path) {
        let flag = this.checkUrl(path)
        this.$store.dispatch('smartLight/setLightChildMenuPath', {
          optType: 'delete'
        })
        if (flag) {
          this.loadComponent(path)
        } else {
          this.checkUrl('/enterprisesList')
          this.loadComponent('/enterprisesList')
          var self = this
          setTimeout(() => {
            self.$store.dispatch('smartLight/setLightChildMenuPath', {
              data: path
            })
          })
        }
      }
    },
    checkUrl(path) {
      let flag = false
      for (let i = 0; i < this.asideList.length; i++) {
        if (path === this.asideList[i].links) {
          this.activeIndex = i
          this.tableIndex = '' + i
          flag = true
          break
        }
      }
      return flag
    },
    getUrl(val) {
      let currComponent = this.getComment(val)
      if (val !== '/enterprisesList') {
        let list = []
        if (this.$store.getters['smartLight/getLightChildMenuList']) {
          list = this.$store.getters['smartLight/getLightChildMenuList']
        }
        if (list.length === 0) {
          this.activeIndex = -1
        } else {
          for (let i = 1; i <= list.length; i++) {
            if (val === list[i - 1].links) {
              this.activeIndex = -1 - i
              break
            }
          }
        }
        Vue.component('currMenu', currComponent)
        var self = this
        setTimeout(() => {
          self.$store.dispatch('smartLight/setLightChildMenuPath', {
            optType: 'delete'
          })
        }, 500)
      } else {
        this.$store.dispatch('smartLight/setcurrCompany', {
          data: {},
          optType: 'delete'
        })
        this.checkUrl(val)
        Vue.component('currMenu', currComponent)
      }
    },
    /**
     * 左侧菜单权限
     */
    menuPower() {
      var self = this
      let powerList = this.$store.getters['userCenter/getOperationAuthority']
      if (powerList.length > 0) {
        let newList = []
        self.oldAsideList.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            newList.push(item)
          }
        })
        self.asideList = newList
        let newLists = []
        self.oldchildAsideList.forEach(function(item, index) {
          let bMenuExist = self.hasPermission(item.powerName)
          if (bMenuExist) {
            newLists.push(item)
          }
        })
        this.$store.dispatch('smartLight/setLightChildMenuList', {
          data: newLists
        })
      } else {
        self.asideList = newList
      }
    },
    /**
     * 点击侧边栏
     */
    asideClick(index, links) {
      this.isActive = index
      this.$router.push({
        name: links
      })
    },
    /**
     *	tabs点击切换前
     */
    beforeLeave(activeName, oldActiveName) {
      this.activeIndex = activeName * 1
      this.loadComponent(this.asideList[this.activeIndex].links) //加载组件
    },
    /**
     * 点击弹出组件
     */
    alertUserComponent(path) {},
    loginCheck() {
      let self = this
      this.$axios
        .internet({
          url: this.API.internet.login, //不需要再添加ip和端口
          method: 'post', //提交方式：get和post，同 params 和 data配合使用
          data: {
            username: this.username,
            password: '',
            leansitetoken: this.leansiteToken
          }
        })
        .then(res => {
          var resData = res.data
          if (resData.token && resData.token.length > 0) {
            this.$store.dispatch('userCenter/setInternetToken', {
              data: token
            })
          } else {
            self.$alert('打开物联网中心失败,请关闭重新打开!')
          }
        })
    },
    getComment(componentPath) {
      let currComponent = ''
      let routers = this.$router.options.routes
      for (let i = 0; i < routers.length; i++) {
        if (componentPath == routers[i].path) {
          currComponent = routers[i].component
          if (componentPath === '/enterprisesList') {
            for (let i = 0; i < this.asideList.length; i++) {
              if (componentPath === this.asideList[i].links) {
                this.enterprisesIndex = i
                break
              }
            }
          }
          break
        }
      }
      return currComponent
    },
    /**
     * 加载组件
     */
    loadComponent(componentPath) {
      let currComponent = this.getComment(componentPath)
      this.$store.dispatch('smartLight/setcurrCompany', {
        data: {},
        optType: 'delete'
      })
      Vue.component('currMenu', currComponent)
    }
  },
  destroyed() {
    this.$store.dispatch('smartLight/setLightChildMenuPath', {
      data: ''
    })
  }
}
</script>

<style lang="scss" scoped type="text/css">
.smartLightCenterHome {
  height: 100%;
  min-height: 500px;
  .el-header {
    display: none;
    height: 60px;
    background-color: #ffffff;
    > img {
      margin: 12px 21px 0 0;
      max-width: 130px;
    }
    > span {
      font-family: 'MicrosoftYaHei';
      font-size: 16px;
      color: #101010;
      vertical-align: -webkit-baseline-middle;
    }
  }
  .platformContainer {
    background-color: #fff;
    height: calc(100% - 60px);
    .el-tabs {
      width: 100%;
      overflow: hidden;
      .el-tabs__header {
        width: 80px;
      }
      .el-tabs-pane {
        background-color: #f0f0f0;
      }
    }
  }
  /deep/ .el-tabs--border-card {
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  /deep/ .el-tabs--left .el-tabs__header {
  }
  /deep/ .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0;
    width: 78px;
    background-color: #f0f0f0;
    border: none;
    border-right: solid 1px #b4b4b4;
  }
  /deep/ .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
    height: 74px;
    line-height: 74px;
    color: #101010;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    background-color: #fff;
    padding: 0;
    min-height: calc(100% - 60px);
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    border-left: solid 3px #f0f0f0;
    background-color: #f0f0f0;
    line-height: none;
    width: 78px;
    height: 74px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item div image {
    width: 20px;
    height: 20px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item div label {
    font-size: 12px;
    height: 30px;
    line-height: 38px;
    color: #595959;
  }
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border-color: transparent transparent;
    border-left: solid 3px #006fe6;
    background-color: #ffffff;
    color: #006fe6;
  }
}
</style>
