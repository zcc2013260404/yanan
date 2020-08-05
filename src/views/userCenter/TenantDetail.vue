<template>
	<div class="box">
		<div class="top">
			<div style="margin-top: -20px;">
				<span @click="cancelOpt">租户管理</span>
				<span class="el-icon-arrow-right">
                    &nbsp;&nbsp;&nbsp;<span></span>租户详情
				</span>
			</div>
		</div>
		<div class="userMessageRight_bottom">
			<!--     基本信息框-->
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp;  一、租户基本信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="tenantObj" label-width="100px" class="demo-ruleForm">
						<el-form-item label="租户名称">
							<span>{{tenantObj.name}}</span>
						</el-form-item>
						<el-form-item label="联系电话">
							<span>{{tenantObj.phone}}</span>
						</el-form-item>
						<el-form-item label="企业邮箱">
							<span>{{tenantObj.email}}</span>
						</el-form-item>
						<el-form-item label="联系地址">
							<span>{{tenantObj.adress+tenantObj.detailAddress}}</span>
						</el-form-item>
						<el-form-item label="营业执照">
							<img :src="tenantObj.imagePath!=null?baseUrl+tenantObj.imagePath:defaultImgUrl" alt="营业执照图片"/>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp;  二、联系人信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="tenantObj"  label-width="100px" class="demo-ruleForm">
						<el-form-item label="姓名">
							<span>{{tenantObj.linkman}}</span>
						</el-form-item>
						<el-form-item label="手机号">
							<span>{{tenantObj.phone}}</span>
						</el-form-item>
						<el-form-item label="邮箱">
							<span>{{tenantObj.email}}</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<!--授权信息-->
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp;  三、授权信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="tenantObj" label-width="100px" class="demo-ruleForm">
						<el-form-item label="有效期">
							<el-col :span="11">
								<span>{{startTime}}</span>
						    </el-col>
						    <el-col class="line" :span="2">至</el-col>
						    <el-col :span="11">
						      <span>{{endTime}}</span>
						    </el-col>
						</el-form-item>
						<el-form-item label="最多设备数">
							<span>{{tenantObj.devices}}</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<!--        底部提交按钮-->
		<div class="bottom">
			<el-row>
				<el-button type="primary" @click="cancelOpt">返回</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
	export default {
		name: "TenantDetail",//租户详情
		props: {
			tenantObj: { //租户信息
				type: Object,
				required: true
			}
		},
		data() {
			let baseImageUrl = this.API.leansite.baseURL;
        	let substrUrl = baseImageUrl.substr(0,baseImageUrl.length-1);
			return {
				baseUrl:substrUrl,//截取后的图片路径
				defaultImgUrl:require('../../assets/img/defaultImg.png')
			}
		},
		computed:{
			startTime:function(){
				return this.commonFun.dateFormat(this.tenantObj.startTime, "yyyy-MM-dd HH:mm");
			},
			endTime:function(){
				return this.commonFun.dateFormat(this.tenantObj.endTime, "yyyy-MM-dd HH:mm");
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			/*
			 * 返回
			 */
			cancelOpt() {
				//调用父组件方法
				this.$emit("TenantDetailCallBack");
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.box {
		margin:0 0 40px;
		.top {
			div {
				font-size: 14px;
				span {
					color: #006fe6;
					margin-right: 10px;
                    cursor: pointer;
				}
				.el-icon-arrow-right {
					color: #969696;
				}
				& :last-child {
					height: 36px;
					font-family: MicrosoftYaHei-Bold;
					font-size: 14px;
					line-height: 36px;
					color: #323232;
					margin: 25px 0;
				}
			}
		}
		.userMessageRight_bottom {
			margin-top: 20px !important;
			.tab {
				border: solid 1px #bebebe;
				/*height: 162px;*/
				font-size: 14px;
				color: #323232;
				margin-bottom: 24px;
				padding-bottom: 20px;
                border-radius:5px;
				.tab_header {
					width: 100%;
					height: 48px;
					line-height: 48px;
					/*background-color: #f0f0f0;*/
					/*border-bottom: solid 1px #bebebe;*/
					span {
						font-size: 14px;
						color: #969696;
					}
				}
				.tab_body_select {
					width: 97%;
					margin: 20px 16px;
					.el-cascader{
						width: 30%;
					}
					.el-select {
						width: 30%;
					}
					.el-button { 
						width: 90px;
						height: 35px;
						border-radius: 4px;
						border: solid 1px #006fe6;
						margin-left: 8px;
					}
				}
				.tab_body {
					width: 93%;
					height: 55px;
					line-height: 55px;
					border-bottom: solid 1px #969696;
					margin: 0 auto;
					display: flex;
					justify-content: space-around;
					
					div {
						width: 40%;
					}
					span {
						display: inline-block;
						width: 100%;
						font-size: 14px;
						line-height: 55px;
						text-align: center;
						cursor: pointer;
						overflow: hidden;
						white-space: nowrap;
						text-overflow:ellipsis;
					}
					.el-icon-delete {
						color: red;
					}
				}
				.formText {
					width: 97%;
					margin: 0 auto;
					.el-form {
						width: 30%;
						/deep/ .el-form-item{
							margin-bottom: 16px;
						}
						img{
							width: 250px;
							height: 150px;
							// border:solid 1px #CCCCCC;
							
						}	
					}
					
				}
			}
		}
		.bottom {
			p {
				color: #d0021b;
			}
			div {
				margin-top: 20px;
				button {
					last-child {
						width: 90px;
						height: 32px;
						border-radius: 4px;
						border: solid 1px #006fe6;
						color: #006fe6;
					}
				}
			}
		}
	}
</style>
