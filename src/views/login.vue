<template>
	<div class="login-container">
		<div class="login_left">
            <div class="message">
        		<p>智慧照明系统</p>
        		<p>INTELLIGENT LIGHTING SYSTEM</p>
            </div>
			<span class="comName">&copy;2020 重庆丝路启航智能科技有限公司 </span>
		</div>
		<div class="login_right">
			<div class="ms-login">
				<img class="systemLogo" src="../assets/img/logo-noText.png" alt="logo" />
				<p style="margin:25px 0 80px; font-size: 17px;" >欢迎进入 leansite<sup>®</sup> E2C Cloud</p>
				
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
					<el-form-item label="" prop="usersName">
						<el-input v-model="ruleForm.usersName" id="name" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item label="" prop="loginPassword">
						<el-input v-model="ruleForm.loginPassword" type="Password" placeholder="密码" show-password></el-input>
					</el-form-item>
					<el-form-item label="" prop="kaptcha">
						<el-row>
							<el-col :span="8">
								<el-input v-model="ruleForm.kaptcha" type="text" placeholder="验证码"></el-input>
							</el-col>
							<el-col :span="8"></el-col>
							<el-col :span="8">
								<img :src="oVerificationCode.base64Str" alt="验证码图片" class="erificationCodeImg" title="看不清,点击换一张" @click="getVerificationCode()" />
							</el-col>
						</el-row>

					</el-form-item>
					<!--<el-form-item label="" prop="type">
						<el-checkbox v-model="ruleForm.autoLogin">自动登录</el-checkbox>
					</el-form-item>-->
					<div class="login-btn">
						<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import bus from '../common/bus.js';
	export default {
		name: "login", //登录
		components: {},
		data() {
			let self = this;
			var checkCode=(rule, value, callback)=>{
            	if(value.trim()!=self.oVerificationCode.code){
            		callback(new Error('验证码错误!'));
            	}else {
					callback();
				}
            };
			return {
				ruleForm: {
					'usersName': '', //登录账户
					'loginPassword': '', //密码
					'kaptcha': '', //验证码
					'autoLogin': false
				},
				oVerificationCode: {},
				rules: {
					usersName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					loginPassword: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					kaptcha: [
						{
							required: true,
							message: '请输入验证码',
							trigger: 'blur'
						},
						{
								validator:checkCode,
								trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.getVerificationCode();
			//this.autoLogin();
			this.keyupEnter();
		},
		methods: {
			/**
			 * 登录
			 */
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(!valid) {
						return false;
					}
					let oLogin = {
						sUsername: this.ruleForm.usersName.trim(),
						sPassword: this.$md5(this.ruleForm.loginPassword.trim()),
						sKaptcha: this.ruleForm.kaptcha.trim(),
					};
					this.login(oLogin);
				});
			},
			/**
			 * 回车--登录
			 */
			keyupEnter() {
				document.onkeydown = e => {
					let body = document.getElementsByTagName('body')[0];
					if(e.keyCode === 13) {
						this.submitForm("ruleForm");
					}
				}
			},
			/**
			 * 判断是否自动登录
			 */
			autoLogin(isAutoLogin) {
				let userObj = this.$store.getters['userCenter/getLoginUser'];
				if(userObj != '') {
					this.ruleForm.autoLogin = true;
					this.ruleForm.usersName = userObj.user;
					this.ruleForm.loginPassword = this.commonFun.uncompileStr(userObj.psw);
					let oLogin = {
						sUsername: userObj.user,
						sPassword: this.commonFun.uncompileStr(userObj.psw)
					};
					setTimeout(() => {
						this.login(oLogin);
					}, 2000);
				}
			},
			/**
			 * 登录请求
			 */
			login(loginObj) {
				let self = this;
				this.$axios.leansite({
					url: this.API.leansite.login, //不需要再添加ip和端口
					method: 'post', //提交方式：get和post，同 params 和 data配合使用
					params: {
						'loginName': loginObj.sUsername,
						'password': loginObj.sPassword,
						'kaptcha': loginObj.sKaptcha
					}
				}).then((res) => {
					var resData = res.data;
					let resCode = parseInt(resData.code);
					if(resCode == 0) {
						if(self.ruleForm.autoLogin) {
							this.$store.dispatch("userCenter/setLoginUser", {
								data: {
									'user': loginObj.sUsername,
									'psw': self.commonFun.compileStr(loginObj.sPassword)
								}
							})
						} else {
							this.$store.dispatch("userCenter/setLoginUser", {
								optType:'delete'
							});
						}
						this.$store.dispatch("userCenter/setUser", {
							data: resData.data.loginUser
						});
						this.$store.dispatch("userCenter/setToken", {
							data: resData.data.token
						});
						this.$store.dispatch("userCenter/setOperationAuthority", {
							data: resData.data.permissions
						});
						if(self.$route.query.redirect) { 
							self.$router.push(self.$route.query.redirect).go(0);  // 登录过期重新登录
						} else { 
							self.$router.push({
								name: 'index'
							});  // 正常登录
						}
					} else if(resData.code == 1000) {
						this.getVerificationCode();
						this.$message({
							type: 'error',
							message: '登录失败：' + resData.msg
						});
					} 
				})
			},
			/**
			 * 获取验证码
			 */
			getVerificationCode() {
				let self = this;
				this.$axios.leansite({
					url: this.API.leansite.getKaptcha,
					method: 'get',
				}).then((res) => {
					var resData = res.data;
					let resCode = parseInt(resData.code);
					if(resCode == 0) {
						self.oVerificationCode = resData.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		.login_left {
			position: relative;
		    width: 65.468%;
		    height: 100%;
		    background-image: url(../assets/img/denglu-beijing.png);
		    background-position: top;
		    background-repeat: no-repeat;
		    background-size: 100% 100%;
			.comName{
				position: absolute;
				color: #fff;
				bottom: 30px;
				right: 176px;
				font-size: 14px;
				font-weight: normal;
				font-stretch: normal;
				line-height: 4px;
				letter-spacing: 0px;
				color: #ffffff;
			}
            .message{
                position: absolute;
                bottom: 100px;
                left: 50px;
                color: #fff;
                text-align: left;
                P{
                	&:first-child{
                		width: 50%;
                		font-family: 'PingFang-SC-Bold';
						font-size: 20px;
						font-weight: normal;
						font-stretch: normal;
						line-height: 24px;
						letter-spacing: 0px;
						color: #ffffff;
						padding: 0 0 11px;
						border-bottom: solid 2px #ffffff;
						margin-bottom: 13px;
                	}
                	&:last-child{
						font-family: 'PingFang-SC-Bold';
						font-size: 50px;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 0px;
						color: #ffffff;
                	}
                }
            }
		}
		.login_right {
			background: #f2f5fa;
			width: calc(100% - 66.6%);
			position: relative;
			text-align: center;
		}
		.ms-login {
			width: 100%;
			height: 450px;
			color: #303030;
			background: #f2f5fa;
			text-align: center;
			img {
				width: 113;
				height: 24px;
			}
			.systemLogo {
				margin: 247px auto 0;
			}
			.el-form {
				width: 60%;
				font-size: 16px !important;
				margin: 0 auto;
				text-align: left;
				.el-form-item {
					margin-bottom: 25px;
					.erificationCodeImg {
						width: 108px;
						height: 36px;
						border-radius: 4px;
						margin-left: 10px;
						cursor: pointer;
					}
				}
				.login-btn {
					width: 100%;
					color: #C0C4CC;
					text-align: center;
					.el-button {
						width: 100%;
						background-color: #006fe6;
    					margin-top: 20px;
					}
				}
			}
		}
		/deep/ .el-input__inner {
			background: transparent!important;
			border: none;
			border-radius: 0;
			border-bottom: 1px solid #c4c4c4;
			font-family: Helvetica;
			font-size: 16px;
			color: #595959;
		}
		/deep/ .el-input__inner::-webkit-input-placeholder {
			color: #D2D5DC;
		}
		/deep/ .el-input__inner::-moz-input-placeholder {
			color: #D2D5DC;
		}
		/deep/ .el-input__inner::-ms-input-placeholder {
			color: #D2D5DC;
		}
	}
</style>
