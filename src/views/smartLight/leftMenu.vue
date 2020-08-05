<template>
  <el-container class="platformContainer">
    <el-tabs v-if="!showType" v-model="tableIndex" type="border-card" tab-position="left">
      <el-tab-pane v-for="(aside,index) in asideList" :key="aside.name+index" :name="index + ''">
        <div slot="label" @click="asideClick(index, aside.links)">
          <!-- <img :src="activeIndex == index ? aside.icon[1] : aside.icon[0]" alt="菜单图标"> -->
          <i :class="aside.icon[0]" :style="{ color: tableIndex === index + '' ? '#006edd' : '' }" class="iconstys" />
          <label :style="{ color: tableIndex === index + '' ? '#006edd' : '' }">{{ aside.name }}</label>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="showType" class="secondMenu">
      <el-table :data="asideList" ref="secondMeunTable" style="height:calc( 100vh - 98px );background-color: #f0f0f0;border-right: solid 1px #b4b4b4;" :show-header='false' highlight-current-row :row-class-name="tableRowClassName" :row-style="{ background: '#f0f0f0' }" @row-click='handleSecondClick'>
        <el-table-column>
          <template slot-scope="scope">
            <i :class="scope.row.icon[0]" :style="{ color: tableIndex === scope.$index + '' ? '#006edd' : '' }" class="iconstyative" />
            <span :style="{ color: tableIndex === scope.$index + '' ? '#006edd' : '' }">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-container>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'SmartLightCenterLeftMenu', //智慧照明中心菜单
  components: {},
  data() {
    return {
      asideList: [], //显示的菜单列表
      tableIndex: 0 + '',
      showType: this.$store.getters['userCenter/getUser'].tenantId ? false : true,
      activeIndex: 0 //点击当前元素的index
    }
  },
  created() {
    // this.menuPower() //左侧菜单权限
    this.getIndex()
    // this.loadComponent(this.asideList[this.activeIndex].links) //加载组件
  },
  mounted() {},
  computed: {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      row.index = rowIndex
      if (row.links === this.$store.getters['smartLight/getLightChildMenuPath']) {
        return 'activebg'
      }
    },
    handleSecondClick(row, column) {
      this.$store.dispatch('smartLight/setLightChildMenuPath', {
        data: row.links
      })
    },
    getIndex() {
      this.asideList = []
      if (this.$store.getters['smartLight/getLightChildMenuList']) {
        this.asideList = this.$store.getters['smartLight/getLightChildMenuList']
      }
      const path = this.$store.getters['smartLight/getLightChildMenuPath']
      if (path) {
        for (let i = 0; i < this.asideList.length; i++) {
          if (this.asideList[i].links === path) {
            this.tableIndex = i + ''
            this.activeIndex = i
            break
          }
        }
      }
    },
    /**
     * 点击侧边栏
     */
    asideClick(index, links) {
      this.isActive = index
      this.$store.dispatch('smartLight/setLightChildMenuPath', {
        data: links
      })
    },
    /**
     *	tabs点击切换前
     */
    beforeLeave(activeName, oldActiveName) {
      this.activeIndex = activeName * 1
      this.tableIndex = this.activeIndex + ''
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
      // Vue.component('currMenu', currComponent)
    }
  }
}
</script>

<style lang="scss" scoped type="text/css">
.platformContainer {
  height: calc(100vh - 98px) !important;
  .secondMenu {
    width: 150px;
    /deep/ .activebg {
      background: #fff !important;
    }
    .el-table {
      height: calc(100vh - 98px) !important;
      background-color: #f0f0f0 !important;
      border-right: solid 1px #b4b4b4 !important;
      cursor: pointer;
      .el-table td {
        background-color: #f0f0f0 !important;
        border-bottom: solid 1px #b4b4b4 !important;
      }
      .el-table__body tr.current-row > td {
        background-color: #fff !important;
      }
    }
  }
  .iconstyative {
    font-size: 16px;
    position: relative;
    top: 2px;
    margin-right: 6px;
  }
  .iconstys {
    font-size: 20px;
    position: relative;
    margin-bottom: -30px;
    margin-top: -30px;
  }
}
</style>
