<template>
  <el-container class="userCenterHome">
    <el-header>
      <img src="../../assets/img/logo.png" alt="平台logo">
      <span>用户中心</span>
    </el-header>
    <el-container class="platformContainer">
      <el-tabs v-model="tableIndex" type="border-card" tab-position="left" :before-leave="beforeLeave">
        <el-tab-pane v-for="(aside,index) in asideList" :key="index">
          <div slot="label">
            <img :src="activeIndex == index ? aside.icon[1] : aside.icon[0]" alt="菜单图标">
            <label>{{aside.name}}</label>
          </div>
          <el-row v-if="activeIndex == index">
            <el-col :span="24">
              <currMenu :key="aside.name+index"></currMenu>
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
  name: 'UserCenterHome', //用户中心首页
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
          icon: [require('../../assets/img/userCenter/zuhu-wxz.png'), require('../../assets/img/userCenter/zuhu-xz.png')],
          name: '租户管理',
          links: '/tenantList',
          powerName: 'tenant/view'
        },
        {
          icon: [require('../../assets/img/userCenter/zuzhijiagou-wxz.png'), require('../../assets/img/userCenter/zuzhijiagou-xz.png')],
          name: '组织架构',
          links: '/deptList',
          powerName: 'org/view'
        },
        {
          icon: [require('../../assets/img/userCenter/jueseguanli-wxz.png'), require('../../assets/img/userCenter/jueseguanli-xz.png')],
          name: '角色管理',
          links: '/roleList',
          powerName: 'role/view'
        },
        {
          icon: [require('../../assets/img/userCenter/yonghu-wxz.png'), require('../../assets/img/userCenter/yonghu-xz.png')],
          name: '用户管理',
          links: '/userList',
          powerName: 'user/view'
        },
        {
          icon: [require('../../assets/img/userCenter/huodongrizhi-wxz.png'), require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '活动日志',
          links: '/logList',
          powerName: 'sysLog/view'
        },
        {
          icon: [require('../../assets/img/userCenter/huodongrizhi-wxz.png'), require('../../assets/img/userCenter/huodongrizhi-xz.png')],
          name: '预警监控',
          links: '/monitor',
          powerName: 'monitor/list'
        }
      ],
      tableIndex: '0',
      asideList: [], //显示的菜单列表
      activeIndex: 0 //点击当前元素的index
    }
  },
  created() {
    this.menuPower() //左侧菜单权限
    if (!this.$store.getters['userCenter/getChildMenuPath'] || this.$store.getters['userCenter/getChildMenuPath'] === 'dialogReload') {
      this.loadComponent(this.asideList[0].links) //加载组件
    } else {
      this.getJumpUrl()
    }
  },
  mounted() {
    this.getJumpUrl()
  },
  computed: {
    childrenMenu() {
      return this.$store.state.userCenter.childMenuPath
    }
  },
  watch: {
    childrenMenu(val) {
      // 弹出框重新加载
      if (val) {
        if (val === 'dialogReload') {
          this.$store.dispatch('userCenter/setChildMenuPath', {
            optType: 'delete'
          })
        } else {
          this.getJumpUrl()
        }
      }
    }
  },
  methods: {
    getJumpUrl() {
      const path = this.$store.getters['userCenter/getChildMenuPath']
      if (path) {
        let flag = false
        for (let i = 0; i < this.asideList.length; i++) {
          if (path === this.asideList[i].links) {
            this.activeIndex = i
            this.tableIndex = '' + i
            flag = true
            break
          }
        }
        if (flag) {
          this.loadComponent(path) //加载组件
        }
        this.$store.dispatch('userCenter/setChildMenuPath', {
          optType: 'delete'
        })
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
    /**
     * 加载组件
     */
    loadComponent(componentPath) {
      let routers = this.$router.options.routes
      let currComponent = ''
      for (let i = 0; i < routers.length; i++) {
        if (componentPath == routers[i].path) {
          currComponent = routers[i].component
          break
        }
      }
      Vue.component('currMenu', currComponent)
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.userCenterHome {
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
