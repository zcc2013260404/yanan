<template>
<el-container class="deviceCenterHome">
    <el-header>
        <img src="../../assets/img/logo.png" alt="平台logo">
        <span>设备管理</span>
    </el-header>
    <el-container class="platformContainer">
        <el-tabs type="border-card" tab-position="left" :before-leave="beforeLeave">
            <el-tab-pane v-for="(aside,index) in asideList" :key="aside.name+index">
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
    name: 'DeviceCenterHome', //设备中心首页
    props: {
        username: { //用户名
            type: String,
            required: false
        },
        leansiteToken: { //token信息
            type: String,
            required: true
        }
    },
    components: {

    },
    data() {
        return {
            oldAsideList: [//原始侧边栏菜单
            	{
                    icon: [
                        require('../../assets/img/deviceCenter/wangluoshebei-wxz.png'),
                        require('../../assets/img/deviceCenter/wangluoshebei-xz.png')
                    ],
                    name: '网络设备',
                    links: '/networkDeviceList',
                    powerName:'netDevices/view',
               },
            	{
                    icon: [
                        require('../../assets/img/deviceCenter/canshuguanli-wxz.png'),
                        require('../../assets/img/deviceCenter/canshuguanli-xz.png')
                    ],
                    name: '参数管理',
                    links: '/deviceParameterList',
                    powerName:'devicesAttrSet/view',
               },
            	{
                    icon: [
                        require('../../assets/img/deviceCenter/leixingguanli-wxz.png'),
                        require('../../assets/img/deviceCenter/leixingguanli-xz.png')
                    ],
                    name: '类型管理',
                    links: '/deviceTypeList',
                    powerName:'devicesClassify/view',
               },
            	{
                    icon: [
                        require('../../assets/img/deviceCenter/gongyeshebei-wxz.png'),
                        require('../../assets/img/deviceCenter/gongyeshebei-xz.png')
                    ],
                    name: '工业设备',
                    links: '/industryDeviceList',
                    powerName:'productDevices/view',
               },
            	{
                    icon: [
                        require('../../assets/img/deviceCenter/guanlianpeizhi-wxz.png'),
                        require('../../assets/img/deviceCenter/guanlianpeizhi-xz.png')
                    ],
                    name: '关联配置',
                    links: '/relationDeviceList',
                    powerName:'productNet/view',
              }
            ],
            asideList:[],//显示的菜单列表
            activeIndex: 0//点击当前元素的index
        }
    },
    created() {
    	this.menuPower();//左侧菜单权限
		this.loadComponent(this.asideList[0].links);//加载组件
    },
    mounted() {

    },
    computed: {

    },
    methods: {
    	/**
    	 * 左侧菜单权限
    	 */
    	menuPower(){
    		var self = this;
    		let powerList = this.$store.getters['userCenter/getOperationAuthority'];
    		if(powerList.length > 0){
    			let newList = [];
    			self.oldAsideList.forEach(function(item,index){
    				let bMenuExist = self.hasPermission(item.powerName);
    				if(bMenuExist){
    					newList.push(item);
    				}
    			});
    			self.asideList = newList;
    		}else{
    			self.asideList = newList;
    		}
    	},
        /**
         * 点击侧边栏
         */
        asideClick(index, links) {
            this.isActive = index;
            this.$router.push({
                name: links
            });
        },
        /**
         *	tabs点击切换前
         */
        beforeLeave(activeName, oldActiveName) {
            this.activeIndex = activeName * 1;
			this.loadComponent(this.asideList[this.activeIndex].links);//加载组件
        },
        /**
         * 点击弹出组件
         */
        alertUserComponent(path) {

        },
        /**
         * 加载组件
         */
		loadComponent(componentPath) {
			let routers = this.$router.options.routes;
			let currComponent = '';
			for(let i=0;i<routers.length;i++){
				if(componentPath == routers[i].path){
					currComponent = routers[i].component;
					break;
				}
			}
			Vue.component('currMenu',currComponent);
		}
    }
}
</script>

<style lang="scss" scoped type="text/css">
.deviceCenterHome {
	
    height: 100%;
    min-height: 500px;
    .el-header {
    	display: none;
        height: 60px;
        background-color: #ffffff;
        >img {
            margin: 12px 21px 0 0;
            max-width: 130px;
        }
        >span {
            font-family: 'MicrosoftYaHei';
            font-size: 16px;
            color: #101010;
            vertical-align: -webkit-baseline-middle;
        }
    }
    .platformContainer {
        background-color: #fff;
        height: 100%;
        .el-tabs {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .el-tabs__header {
                width: 80px;
            }
            .el-tabs-pane{
            	background-color: #f0f0f0;
            }
        }
    }
    /deep/ .el-tabs--border-card {
        border: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    /deep/ .el-tabs--left .el-tabs__header{

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
    /deep/ .el-tabs--border-card>.el-tabs__content {
        background-color: #fff;
        padding:0;
        min-height: calc(100% - 60px);
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item {
        border-left: solid 3px #f0f0f0;
        background-color: #f0f0f0;
        line-height: none;
        width: 78px;
        height: 74px;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item div {
        display: flex;
        flex-direction:column;
        align-items: center;
    	justify-content: center;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item div image{
        width: 20px;
        height: 20px;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item div label{
        font-size: 12px;
        height: 30px;
        line-height: 38px;
        color: #595959;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
        border-color: transparent transparent;
        border-left: solid 3px #006fe6;
        background-color: #ffffff;
        color: #006fe6;
    }
}
</style>
