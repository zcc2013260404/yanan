<template>
	<el-dialog
		ref="xhzqDialog"
		:width="width"
		class="xhzqDialog"
		:title="appObj.appName"
		:fullscreen="isfullscreen"
		:modal="false"
		:visible.sync="dialogVisible"
		:append-to-body="false"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:show-close="false"
		:class="isminimize? 'isminimize': ''"
		center>
		<div v-show="!isminimize" slot="title" class="medium">
			<div class="centers">
				<img src="../assets/img/logo-noText.png" alt="平台logo" />
				<span>{{appObj.appName}}</span>
			</div>
			<div class="icons">
				<i class="el-icon-minus"  @click="minimize"></i>
				<i :class="isfullscreen? 'iconfont leansite-suoxiao' : 'iconfont leansite-fangda' "  style="font-size: 16px;" @click="IsFullscreen"></i>
				<i class="el-icon-close"  @click="closeDialog"></i>
			</div>
		</div>
		<div v-show="!isminimize" class="dialogBody" style="height: 100% !important;">
			<iframe class="iframeClass" :src="appObj.appUrl" id="mobsf" marginheight="50px" marginwidth="15px"  scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-modals allow-popups" frameborder="0" width="100%" height="75%"></iframe>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		name: 'DialogUrl', //弹框打开第三方应用
		props: {
			width:{//显示宽度
				type: String,
				default: '70%'
			},
			appObj: {//选中的第三方应用对象
				type: Object,
				required:true
			}
		},
		data() {
			return {
				isfullscreen: true, // 全屏
				isminimize: false, // 最小化
				dialogVisible: false, // 隐藏弹窗
				username:this.$store.getters['userCenter/getUser'].name,
				leansiteToken:this.$store.getters['userCenter/getToken'],
			}
		},
		created() {
			this.appObj.appUrl +="?username="+this.username+"&token="+this.leansiteToken;
			this.openDialog();
		},
		watch: {
			dialogVisible(val) {
				if(val) {
					const el = this.$refs.xhzqDialog.$el.querySelector('.el-dialog')
					el.style.left = 0
					el.style.top = 0
				}
			}
		},
		methods: {
			// 最小化
			minimize() {
				this.dialogVisible = false;
				this.isminimize = !this.isminimize
				if(this.isfullscreen) this.isfullscreen = !this.isfullscreen
			},
			// 关闭弹窗
			closeDialog() {
				this.$emit('callBackFun',this.appObj);
				this.dialogVisible = false
			},
			// 打开弹窗
			openDialog() {
				this.dialogVisible = true
			},
			// 全屏
			IsFullscreen() {
				this.isfullscreen = !this.isfullscreen;
				const elIframe = this.$refs.xhzqDialog.$el.querySelector('iframe');
				if(this.isfullscreen){
					elIframe.style.height = "90%";
				}else{
					elIframe.style.height = "75%";
				}
				if(this.isfullscreen) this.$emit('isfullscreen');
			},

		},
		mounted() {

		},
		destroyed() {

		}
	}
</script>
<style lang="scss" type="text/css" scoped>
	.el-dialog {
		/*margin-top: 10vh!important;*/
		/*height: 60vh;*/
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

	.isminimize{
		left: 80px;
    	bottom: -355px;
		top: auto;
		right: auto;
		overflow: hidden;
		.el-dialog{
			margin: 0 !important;
			width: 240px !important;
			height: 40px;
			bottom: 0 !important;
			left:0 !important;
		}
		.el-dialog__header{
			cursor: auto!important;
			.el-dialog__headerbtn{
				display: none;
			}
		}
		.dialogFooter{
			position: absolute;
			bottom: 0;
		}
	}

	.xhzqDialog{
		min-height: 600px;
		overflow-y: hidden !important;
		.is-fullscreen{
			width: 100% !important;
			left: 0 !important;
			top: 0 !important;
			margin-top: 0 !important;
			overflow: hidden !important;
			position: relative;
			.el-dialog__header{
				cursor: auto!important;
			}
			.el-dialog__body{
				height: 100% !important;
				.dialogBody{
					height: 100% !important;
					min-height: calc(80vh-50px) !important;
					padding-bottom: 120px!important;
				}
			}
			.dialogFooter{
				position: absolute;
				bottom: 0;
				width: 100%;
				background: #fff;
			}
		}
		.el-dialog {
			height: 100%;
			.el-dialog__header{
				width: 100%;
				height: 48px;
			    line-height: 48px;
			    padding: 0 20px !important;
			    color: #303030;
			    border-bottom: solid 1px #d9e3f3 !important;
				display: flex;
				/*@extend .no_select;*/
				cursor: auto;
				.medium{
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.centers{
	                	img{
	                		height: 25px;
	                		margin-left: 25px;
	                	}
	                    span {
	                        text-align: left;
	                        font-size: 16px;
	                        color: #606266;
	                        vertical-align: middle;
	                        margin-left: 20px
	                    }
					}
					.icons{
						height: 21px;
						display: flex;
						justify-content: flex-end;
						i{
							color: #5f6368;
							font-size: 18px;
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
				.horn{
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: space-between;
					div{
						i{
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
				height: 100% !important;
				.dialogBody {
					height: 100%;
					overflow: hidden;
					padding: 0 !important;
					background: #f7f9fc;
					.iframeClass{
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
		/deep/ .el-dialog--center{
			height: 100%;
			overflow: hidden !important;
			.el-dialog__header{
				height: 48px;
			    padding: 0 20px !important;
			    color: #303030;
			    border-bottom: solid 1px #d9e3f3 !important;
			}
			.el-dialog__body{
				height:100%;
				padding: 0;
			}
		}
		/deep/.el-dialog.is-fullscreen{
			overflow: hidden !important;
		}
		/deep/.iframeClass{
			::-webkit-scrollbar {
				width: 4px;
				height: 8px;
			}
			::-webkit-scrollbar-thumb {
				background: transparent;
				border-radius: 4px;
			}
			:hover::-webkit-scrollbar-thumb {
				background: hsla(0, 0%, 53%, .4)
			}
			:hover::-webkit-scrollbar-track {
				background: hsla(0, 0%, 53%, .1)
			}
		}
	}
</style>
