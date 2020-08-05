<template>
	<el-container class="MonitorIndex">
		<el-header>{{facroryName}}</el-header>
		<el-container class="bottomContainer">
			<el-aside :width="asideWidth">
				<div class="asideHeader">
					<p>
						<img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
						<span>{{deviceStatus.online}}/{{deviceStatus.total}}</span>
					</p>
					<ul>
						<li v-for="(listStyle,index) in showListStyle" :key="index" :class="listStyle.isActive?'active':''" @click="selectShowStyle(listStyle.name,index)">
							<i :class="['iconfont',listStyle.icon]"></i>
						</li>
					</ul>
				</div>
				<div class="asideContent" title="向下滑动，显示更多数据">
					<listComponent :is="loadLeftComponent"  @DeviceListCallBack="deviceListCallBack"></listComponent>
				</div>
			</el-aside>
			<el-main>
				<el-tabs v-if="elTabVisible" v-model="editableTabsValue" type="card"  @tab-remove="removeTab">
					<el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :closable="item.isClose" :name="item.name">
						<menuComponent :is="item.componentName" :deviceObject="selectDevice"  @MonitorMenuCallBack="monitorMenuCallBack"></menuComponent>
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
	</el-container>
</template>
<script>
	import MonitorMenu from './MonitorMenu.vue';
	import Event from './Event.vue';
	import DeviceList from './DeviceList.vue';
	import DeviceListMap from './DeviceListMap.vue';
	import DeviceListTree from './DeviceListTree.vue';
	import MonitorTime from './MonitorTime.vue'
	import Output from './Output.vue'
	import File from './File.vue'
	import Information from './Information.vue'
	export default {
		name: 'MonitorIndex', //工业设备列表
		components: {
			MonitorMenu,
			Event,
			DeviceList,
			DeviceListMap,
			DeviceListTree,
			MonitorTime,
			Output,
			File,
			Information
		},
		data() {
			return {
				facroryName: 'E2C',
				asideWidth: '320px',
				showListStyle: [ //数据展示类型
					{
						isActive: true,
						name: 'list',
						icon: 'leansite-caidan'
					},
					{
						isActive: false,
						name: 'tree',
						icon: 'leansite-bg-smalltrees'
					},
					{
						isActive: false,
						name: 'map',
						icon: 'leansite-dingwei'
					}
				],
				elTabVisible:false,
				loadLeftComponent:'DeviceList',//左侧加载的组件 default=DeviceList
				editableTabs: [
					{
						title: '首页',
						name: '首页',
						isClose:false,//是否显示关闭按钮(除首页外其他都为true)
						componentName: 'MonitorMenu'
					}
				],
				selectDevice:{},//选中的设备
				editableTabsValue: '首页',//el-tabs当前显示的标签name
				deviceStatus:{
					total:0,
					online:0
				},//设备状态信息
				timer:null
			}
		},
		created() {
			this.getOnLineDevicesCount();
			this.timer=window.setInterval(()=>{
				this.getOnLineDevicesCount();
			},10000);
		},
        beforeDestroy(){
        	clearInterval(this.timer);
        },
		methods: {
			/**
			 * 监听li控件click事件
			 * @param {String} showStyle 展示方式
			 * @param {Number} index 选中项的下标
			 */
			selectShowStyle(showStyle, index) {
				this.showListStyle.forEach((item) => {
					item.isActive = false;
				});
				this.showListStyle[index].isActive = true;
				switch(showStyle) {
					case 'list':
						this.asideWidth = "320px"
						this.loadLeftComponent = 'DeviceList';
						break;
					case 'tree':
						this.asideWidth = "320px"
						this.loadLeftComponent = 'DeviceListTree';
						break;
					case 'map':
						this.asideWidth = "960px"
						this.loadLeftComponent = 'DeviceListMap';
						break;
					default:
						break;
				}
			},
			/**
			 * 监听el-tabs remove事件
			 * @param {String} targetName 当前标签的name
			 */
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if(activeName === targetName) {
					tabs.forEach((tab, index) => {
						if(tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if(nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			/**
			 * 加载的列表组件回调函数
			 * @param {Object} selectDevice 选中的设备
			 */
			deviceListCallBack(selectDevice){
				if(selectDevice.id != undefined){//判断是否空对象
					this.selectDevice = selectDevice;
					if(selectDevice.isShowMap){
						this.asideWidth = "960px";
					}else{
						this.asideWidth = "320px";
					}
				}else{
					this.selectDevice = {};
				}
				this.elTabVisible = true;
				this.editableTabs = [
					{
						title: '首页',
						name: '首页',
						isClose:false,//是否显示关闭按钮(除首页外其他都为true)
						componentName: 'MonitorMenu'
					}
				];
				this.editableTabsValue = '首页';//el-tabs当前显示的标签name
			},
			/**
			 * monitorMenu组件回调函数
			 * @param {Object} selectMenu 选中的菜单
			 */
			monitorMenuCallBack(selectMenu){
				let existIndex = this.editableTabs.findIndex((item)=>{
					return selectMenu.name == item.name; 
				})
				if(existIndex == -1){
					this.editableTabs.push({
						title: selectMenu.name,
						name: selectMenu.name,
						isClose:true,
						componentName: selectMenu.componentName
					});
				}
				this.editableTabsValue = selectMenu.name;
			},
			/**
			 * 获取工业设备总数和在线设备
			 */
			getOnLineDevicesCount() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getOnLineDevicesCount
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.deviceStatus = resData.data;
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.MonitorIndex {
		height: 100%;
		background-color: #f0f0f0;
		.el-header {
			height: 34px !important;
			line-height: 34px;
			padding-left: 15px;
			text-align: left;
			border: solid 1px #b4b4b4;
			font-size: 14px;
			color: #323232;
		}
		.bottomContainer {
			.el-aside {
				height: 100%;
				overflow: auto;
				background-color: #f0f0f0;
				position: relative;
				border-right: solid 1px #b4b4b4;
				.asideHeader {
					height: 43px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 16px;
					border-bottom: solid 1px #b4b4b4;
					p {
						img {
							width: 27px;
							height: 31px;
							vertical-align: middle;
						}
						span {
							font-size: 14px;
							color: #323232;
							margin-left: 9px;
						}
					}
					ul {
						display: flex;
						justify-content: space-evenly;
						width: 126px;
						height: 32px;
						line-height: 32px;
						border-radius: 4px;
						border: solid 1px #595959;
						cursor: pointer;
						li {
							width: 100%;
							list-style: none;
							border-right: solid 1px #595959;
							text-align: center;
							i {
								color: #323232;
							}
						}
						li:last-child{
							border-right: none;
						}
						li.active {
							background-color: #323232;
							i {
								color: #FFFFFF;
							}
						}
					}
				}
				.asideContent{
					min-width: 960px;
    				max-width: 978px;
					height: calc(100vh - 174px);
					height: -webkit-calc(100vh - 174px);
					height: -moz-calc(100vh - 174px);
					overflow:hidden;
				}
		    	.asideContent:hover{
					width: calc(100% + 18px);
					overflow-y: auto;
				}
			}
			.el-main {
				height: calc(100vh - 130px);
				height: -webkit-calc(100vh - 130px);
				height: -moz-calc(100vh - 130px);
				overflow-y: auto;
				background-color: #FFF;
				padding: 0 0 80px;
				.el-tabs{
					height: 34px;
					/deep/ .el-tabs__header{
						margin:0 !important;
					}
				}
			}
		}
	}
</style>