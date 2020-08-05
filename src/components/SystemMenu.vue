<template>
	<div class="systemMenu">
		<ul class="leftMenus">
			<li v-for="menus in systemMenus" @click="alertComponent(menus)">
				<img :src="menus.icon" :tile="menus.name"/>
			</li>
		</ul>
		<ul class="rightMenus">
			<li v-for="menus in systemModules" @click="alertComponent(menus)">
				<img :src="menus.icon" :tile="menus.name"/>
				<span>{{menus.name}}</span>
			</li>
		</ul>
		<el-dialog ref="systemModuleDialog" class="systemModuleDialog" :title="chioceMenus.name" :fullscreen="isfullscreen" :modal="false" :visible.sync="moduleDialogVisible"  :append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true" :show-close="false"  :class="isminimize? 'isminimize': ''" center>
			<div v-show="!isminimize" slot="title" class="medium">
				<div></div>
				<div class="centers"><span>{{chioceMenus.name}}</span></div>
				<div class="icons">
					<i class="el-icon-minus" style="font-size: 24px" @click="minimize"></i>
					<i :class="isfullscreen? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline' " style="font-size: 24px" @click="IsFullscreen"></i>
					<i class="el-icon-close" style="font-size: 24px" @click="closeDialog"></i>
				</div>
			</div>
			<div v-show="!isminimize" class="dialogBody">
				<currComponent></currComponent>
			</div>
		</el-dialog>
	</div>

</template>
<script>
	import Vue from 'vue';
	export default {
		name: 'SystemMenu', //状态栏系统菜单
		data() {
			return {
				isfullscreen: false, // 全屏
				isminimize: false, // 最小化
				moduleDialogVisible: false, // 隐藏弹窗
				systemMenus:[//系统菜单项目
					{ name:'个人中心',path:'/gerenzhongxin',icon:require("../assets/img/yonghu.png")},
					{ name:'设置中心',path:'/gerenzhongxin',icon:require("../assets/img/shezhi.png")},
					{ name:'退出系统',path:'/logout',icon:require("../assets/img/tuichu.png")},
				],
				systemModules:[//系统功能模块
					{ name:'用户中心',path:'/userCenterHome',icon:require("../assets/img/yonghuzhongxin.png")},
					{ name:'物联网中心',path:'/baseForm',icon:require("../assets/img/wulianwang.png")},
					{ name:'运维中心',path:'/gerenzhongxin',icon:require("../assets/img/yunweizhongxin.png")},
				],
				chioceMenus:{
					name:""
				}//点击选中的菜单信息
			}
		},
		created() {
		},
		watch: {
			moduleDialogVisible(val) {
				if(val) {
					const el = this.$refs.systemModuleDialog.$el.querySelector('.el-dialog')
					el.style.left = 0
					el.style.top = 0
				}
			}
		},
		methods: {
			/**
			 * 最小化
			 */
			minimize() {
				this.moduleDialogVisible = false;
				this.isminimize = !this.isminimize
				if(this.isfullscreen) this.isfullscreen = !this.isfullscreen
			},
			/**
			 * 关闭弹窗
			 */
			closeDialog() {
				this.$emit('closeCallBack',this.chioceMenus);
				this.moduleDialogVisible = false
			},
			/**
			 * 打开弹窗
			 */
			openDialog() {
				this.$emit("openCallBack",this.chioceMenus);

				this.moduleDialogVisible = true;
				//this.$parent.statusBarData(this.chioceMenus);
			},
			/**
			 * 全屏
			 */
			IsFullscreen() {
				this.isfullscreen = !this.isfullscreen
				if(this.isfullscreen) this.$emit('isfullscreen')
			},
			/**
	         * 点击弹出组件
	         */
			alertComponent(menuObj) {
				if(menuObj.name =="退出系统"){
					this.$confirm('确定退出系统吗?', '操作提示', {
			          confirmButtonText: '退出系统',
			          cancelButtonText: '继续使用',
			          type: 'warning'
			        }).then(() => {//退出系统
			          this.commonFun.clearAllModuleStore();
			          this.$router.push('/login');  // 正常登录

			        }).catch(() => {//取消

			        });
			        return;
				}
				this.chioceMenus = menuObj;
				let routers = this.$router.options.routes;
				let currComponent = '';
				for(let i=0;i<routers.length;i++){
					if(menuObj.path == routers[i].path){
						currComponent = routers[i].component;
						break;
					}
				}
				if(currComponent.length == 0){
					this.$alert("该页面路径信息配置错误!");
				}else{
					Vue.component('currComponent',currComponent);
					this.openDialog();
					//this.moduleDialogVisible = true;
				}
			},
		},
		mounted() {

		},
		destroyed() {

		}
	}
</script>
<style lang="scss" type="text/css" scoped>
	.systemMenu{
		width: 260px !important;
		height: 39vh;
		background-color: #31353f;
		box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.1);
		position: absolute;
		left: 0;
		top: -39vh;
		.leftMenus{
			display: inline-block;
		    height: 95%;
		    padding-top: 5%;
		    width: 23.4%;
		    text-align: center;
		    cursor: pointer;
           
		    li{
		    	height: 42px;
               
		    }
		    li:hover{
		    	background-color: #4c5363;
		    }
		}
		.rightMenus{
			display: inline-block;
			cursor: pointer;
		    height: 95%;
		    padding-top: 5%;
		    width: 75.5%;
		    text-align: left;
		    border-left: 1px solid #4c5363;
		    li{
		    	padding-left: 8.5%;
		    	height: 42px;
		    	span{
		    		margin-left: 10px;
		    		color: #ffffff;
		    	}
		    }
		    li:hover{
		    	background-color: #4c5363;
		    }
		}
	}
	.el-dialog {
		margin-top: 10vh!important;
	}

	.no_select {
		-webkit-touch-callout: none;
		/* iOS Safari */
		-webkit-user-select: none;
		/* Chrome/Safari/Opera */
		-khtml-user-select: none;
		/* Konqueror */
		-moz-user-select: none;
		/* Firefox */
		-ms-user-select: none;
		/* Internet Explorer/Edge */
		user-select: none;
		/* Non-prefixed version, currently */
	}

	.isminimize {
		left: 20px;
		bottom: 20px;
		top: auto;
		right: auto;
		overflow: hidden;
		.el-dialog {
			margin: 0 !important;
			width: 240px !important;
			height: 40px;
			top: 0 !important;
			left: 0 !important;
		}
		.el-dialog__header {
			cursor: auto!important;
			.el-dialog__headerbtn {
				display: none;
			}
		}
		.dialogFooter {
			position: absolute;
			bottom: 0;
		}
	}

	.systemModuleDialog {
		.is-fullscreen {
			width: 100% !important;
			left: 0 !important;
			top: 0 !important;
			margin-top: 0 !important;
			overflow: hidden;
			position: relative;
			.el-dialog__header {
				cursor: auto!important;
			}
			.el-dialog__body {
				height: 100%;
				.dialogBody {
					height: 100%!important;
					max-height: none!important;
					padding-bottom: 120px!important;
				}
			}
			.dialogFooter {
				position: absolute;
				bottom: 0;
				width: 100%;
				background: #fff;
			}
		}
		.el-dialog {
			.el-dialog__header {
				width: 100%;
				padding: 5px 20px 5px !important;
				display: flex;
				border-bottom: 1px solid #ccc;
				@extend .no_select;
				cursor: auto;
				.medium {
					width: 100%;
					height: 100%;
					display: flex;
					div {
						flex: 1;
					}
					.centers {
						span {
							text-align: center;
							font-size: 16px;
							color: #606266;
						}
					}
					.icons {
						display: flex;
						justify-content: flex-end;
						i {
							color: #5f6368;
							font-size: 18px!important;
							display: block;
							padding: 0 7px;
						}
						i:hover {
							background: #dcdfe6;
							cursor: pointer;
						}
						.el-icon-close:hover {
							background: #f00;
							color: #fff;
						}
					}
				}
				.horn {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: space-between;
					div {
						i {
							color: #5f6368;
							font-size: 20px!important;
						}
					}
					.lefts {
						flex: 4;
						margin-top: 3px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						span {
							font-size: 16px;
							color: #606266;
						}
					}
					.centers {
						flex: 1;
					}
					.rights {
						flex: 1;
					}
					i:hover {
						cursor: pointer;
						color: #000;
					}
				}
				.el-dialog__headerbtn {
					top: 0;
					font-size: 24px;
				}
			}
			.el-dialog__body {
				padding: 1px !important;
				.dialogBody {
					max-height: calc(80vh - 50px);
					box-shadow: inset 0px -2px 10px 1px #b0b3b2;
					overflow: auto;
					padding: 20px 25px 20px;
					background: #f7f9fc;
					&::-webkit-scrollbar {
						width: 4px;
						height: 8px;
					}
					&::-webkit-scrollbar-thumb {
						background: transparent;
						border-radius: 4px;
					}
					&:hover::-webkit-scrollbar-thumb {
						background: hsla(0, 0%, 53%, .4)
					}
					&:hover::-webkit-scrollbar-track {
						background: hsla(0, 0%, 53%, .1)
					}
				}
				.dialogFooter {
					padding: 10px 15px;
					border-top: 1px solid #ccc;
					text-align: right;
					.el-button {
						padding: 7px 15px;
					}
				}
			}
		}
		.systemModuleDialog {
			.el-select {
				width: 100%;
			}
			.el-date-editor {
				width: 100%;
			}
		}
	}
</style>
