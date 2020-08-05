<template>
	<div class="monitorMenu">
		<div class="emptyDiv" v-if="isEmpty">
			<img src="../../assets/img/userCenter/kongbai.png" alt="无数据图片" />
			<p>没有相关信息</p>
			<p>There is no information</p>
		</div>
		<div v-else class="noEmptyDiv" v-for="(menu,index) in menuList" :key="index" @click="menuClick(index)">
			<p>
				<img :src="menu.img" alt="图标" />
			</p>
			<span>{{menu.name}}</span>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'MonitorMenu', //监测管理菜单页
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			}
		},
		components: {},
		data() {
			return {
				isEmpty:null,
				menuList: [{
						name: '时序',
						img: require('../../assets/img/monitorCenter/timeOrder.png'),
						componentName: 'MonitorTime'
					},
					{
						name: '事件',
						img: require('../../assets/img/monitorCenter/events.png'),
						componentName: 'Event'
					},
					{
						name: '文件',
						img: require('../../assets/img/monitorCenter/file.png'),
						componentName: 'File'
					},
					{
						name: '信息',
						img: require('../../assets/img/monitorCenter/msg.png'),
						componentName: 'Information'
					},
					{
						name: '输出',
						img: require('../../assets/img/monitorCenter/output.png'),
						componentName: 'Output'
					}
				],
			}
		},
		watch:{
			deviceObject(newValue,oldValue){
				this.deviceObject = newValue;
				this.listenData();
			}
		},
		created() {
	
		},
		mounted() {
			this.listenData();
		},
		methods: {
			/**
			 * 监听div控件click事件
			 * 新增tab并打开
			 * @param {Number} selectIndex 选中项的下标
			 */
			menuClick(selectIndex) {
				this.$emit("MonitorMenuCallBack", this.menuList[selectIndex]);
			},
			listenData(){
				if(this.deviceObject.id == undefined){
					this.isEmpty=true;
				}else{
					this.isEmpty=false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.monitorMenu {
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.noEmptyDiv{
			width: 17%;
			text-align: center;
			p {
				height: 320px;
				line-height: 320px;
				text-align: center;
				border-radius: 3px;
				border: solid 1px #595959;
				img {
					width: 88px;
					height: 88px;
				}
			}
			span {
				color: #323232;
				display: block;
				margin-top: 42px;
			}
		}
		.emptyDiv{
			text-align: center;
			img{
				width: 106px;
				height: 64px;
				margin-bottom:19px;
			}
			p{
				&:first-child{
					
					font-size: 16px;
					line-height: 24px;
					letter-spacing: 0px;
					color: #323232;
				}
				&:last-child{
					font-size: 16px;
					line-height: 24px;
					letter-spacing: 0px;
					color: #969696;
				}
			}
		}
	}
</style>