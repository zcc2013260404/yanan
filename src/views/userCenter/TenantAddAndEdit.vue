<template>
	<div class="box">
		<div class="top">
			<div style="margin-top: -20px;">
				<span @click="cancelOpt">租户管理</span>
				<span class="el-icon-arrow-right">
					&nbsp;&nbsp;&nbsp;<span></span>{{pageType}}租户
				</span>
			</div>
			<div>{{pageType}}租户</div>
		</div>
		<div class="tenantObjRight_bottom">
			<!--     基本信息框-->
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; 一、租户基本信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px"
						class="demo-ruleForm">
						<el-form-item label="租户名" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入集团名称(汉字、字母或数字组成的2~20位字符)" :disabled="disabled">
							</el-input>
						</el-form-item>
						<div>
							<el-form-item label="联系电话" prop="telephone">
								<el-input v-model="ruleForm.telephone" placeholder="格式 区号-电话号码"></el-input>
							</el-form-item>
							<el-form-item label="联系地址" prop="adress">
								<el-cascader size="large" :options="options" value='label' v-model="adress" @change="handleChange"
									style="width: 100%;">
								</el-cascader>
							</el-form-item>
							<el-form-item label="" prop="detailAddress">
								<el-input v-model="ruleForm.detailAddress" placeholder="具体门牌号"></el-input>
								<!--ruleForm.detailedaddress-->
							</el-form-item>
						</div>
						<el-form-item label="企业邮箱" prop="companyEmail">
							<el-input v-model="ruleForm.companyEmail" placeholder="请输入正确的邮箱号"></el-input>
						</el-form-item>
						<el-form-item label="营业执照" style="position: relative;" prop="fileId">
							<el-input v-model="ruleForm.fileId" placeholder="请上传营业执照" readonly></el-input>
							<label
								style="width: 70px;height:36px;line-height: 36px; border-radius: 3px; background-color: #C0C4CC; position: absolute;top: 0;right: 0;">
								<input id="ImgName" type="file" @change='handleImgChange($event)' placeholder="请上传营业执照"><span
									class="spanButton">上传</span> </input>
							</label>
							<img id="Img" :src="imageUrl" alt="营业执照" />
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; 二、联系人信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm2" label-width="100px"
						class="demo-ruleForm">

						<el-form-item label="姓名" prop="linkman">
							<el-input v-model="ruleForm.linkman" placeholder="联系人姓名必须是2-6个纯汉字或者3~20位纯英文字母"></el-input>
						</el-form-item>
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="ruleForm.phone" placeholder="请输入正确的手机号"></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="ruleForm.email" placeholder="请输入正确的邮箱"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<!--授权信息-->
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; 三、授权信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm3" label-width="100px"
						class="demo-ruleForm">
						<el-form-item label="有效时间段">
							<el-date-picker :editable="false" v-model="dateValue" type="daterange" @change='handleTime'
								range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
								:default-time="['00:00:00', '23:59:59']" align="right">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="最多设备数" prop="devices">
							<el-input v-model="ruleForm.devices" placeholder="100"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<!--        底部提交按钮-->
		<div class="bottom">
			<p>*&nbsp;必填字段</p>
			<el-row>
				<el-button type="primary" @click="checkAndSubmit">提交</el-button>
				<el-button @click="cancelOpt">取消</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
	import baseValidator from "../../common/baseValidator.js"
	import { regionData, TextToCode, CodeToText } from "element-china-area-data"
	export default {
		name: "TenantAddAndEdit",
		props: {
			tenantObj: { //tenantObj用户信息
				type: Object,
				required: true
			}
		},
		data() {
			let baseImageUrl = this.API.leansite.baseURL;
			let substrUrl = baseImageUrl.substr(0, baseImageUrl.length - 1)
			return {
				pageType: '添加', //页面类型 pageType=添加 /pageType=编辑
				disabled: false,
				options: regionData, //省级联动数据
				selectedOptions: [], //省市县绑定的值
				imageUrl: require('../../assets/img/defaultImg.png'),
				logo: "",
				dateValue: [],//按时间查询
				baseUrl: substrUrl,//图片路径
				adress: [],//转换选择地区中间变量
				operation: true,//控制操作不能太频繁
				ruleForm: {
					id: '',
					name: '',
					phone: '',//手机号
					email: '',
					adress: '',
					detailAddress: '',//详细地址
					companyEmail: '',//企业邮箱
					fileId: '',//上传图片之后生成id
					telephone: '',//电话号
					startTime: '',//开始时间
					endTime: '',//结束时间
					devices: 100,//设备数
					linkman: '',//联系人姓名
				},
				rules: {
					name: [{
						required: true,
						message: '请输入租户名',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateTenantLoginName,
						trigger: 'blur'
					},
					{
						validator: this.validateName,
						trigger: 'blur'
					}
					],
					linkman: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateTenantName, //员工姓名是2-20个字符
						trigger: 'blur'
					}
					],
					adress: [{
						required: true,
						message: '请选择地址',
						trigger: 'change'
					}
					],
					detailAddress: [{
						required: true,
						message: '请填写具体门牌号',
						trigger: 'blur'
					}
					],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validatePhone,
						trigger: 'blur'
					}
					],
					fileId: [{
						required: true,
						message: '请输上传营业执照',
						trigger: 'change'
					}
					],
					telephone: [{
						required: true,
						message: '请输入电话号',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateTelphone,
						trigger: 'blur'
					}
					],
					companyEmail: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateEmail,
						trigger: 'blur'
					}
					],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateEmail,
						trigger: 'blur'
					}
					],
					dateValue: [{
						type: 'date',
						required: true,
						message: '请选择日期',
						trigger: 'change'
					}
					],
					devices: [{
						required: true,
						message: '请输最多设备数',
						trigger: 'blur'
					},
					{
						validator: baseValidator.isInteger,
						trigger: 'blur'
					}
					],
				},
			}
		},
		created() {

		},
		mounted() {
			if (this.tenantObj.id) {
				this.pageType = '编辑';
				this.setFormData(); //表单赋值
			} else {
				this.pageType = '添加';
			};
			this.setUpList(this.options)
		},
		methods: {
			/**
			 * 验证租户名称
			 */
			validateName(rule, value, callback) {
				var self = this;
				this.$axios.leansite({
					method: 'get',
					async: false,//同步请求
					url: this.API.leansite.tenantNameCheck,
					params: {
						id: this.ruleForm.id,
						name: this.ruleForm.name.trim()
					}
				}).then((res) => {
					var resData = res.data;
					if (resData.code == 0) {
						callback();
					} else if (resData.code == 3017) {
						callback(new Error("租户名重复!"));
					}
				})
			},
			/**
			 * 监听时间日期选择器
			 */
			handleTime(val) {
				if (this.commonFun.dateFormat(val[0], "yyyy") > 2037 || this.commonFun.dateFormat(val[1], "yyyy") > 2037) {
					this.$message({
						type: 'warning',
						message: '日期最大年限为2037年'
					});
					this.dateValue = []
					return;
				}
				if (val) {
					this.ruleForm.startTime = this.commonFun.dateFormat(val[0], "yyyy-MM-dd HH:mm:ss");
					this.ruleForm.endTime = this.commonFun.dateFormat(val[1], "yyyy-MM-dd HH:mm:ss");
				} else {
					this.$message({
						type: 'warning',
						message: '请选择日期'
					});
				}
			},
			/**
			 * 表单赋值
			 */
			setFormData() {
				this.adress = this.tenantObj.adress.split(',')
				this.imageUrl = this.baseUrl + this.tenantObj.imagePath;
				//				this.ruleForm={...this.tenantObj}
				this.ruleForm.name = this.tenantObj.name
				this.ruleForm.phone = this.tenantObj.phone
				this.ruleForm.email = this.tenantObj.email
				this.ruleForm.adress = this.tenantObj.adress
				this.ruleForm.detailAddress = this.tenantObj.detailAddress
				this.ruleForm.companyEmail = this.tenantObj.companyEmail
				this.ruleForm.fileId = this.tenantObj.fileId
				this.ruleForm.telephone = this.tenantObj.telephone
				this.ruleForm.startTime = this.tenantObj.startTime
				this.ruleForm.endTime = this.tenantObj.endTime
				this.ruleForm.devices = this.tenantObj.devices
				this.ruleForm.linkman = this.tenantObj.linkman
				this.ruleForm.id = this.tenantObj.id
				//				this.ruleForm.timeStartToEnd = []
				this.dateValue.push(this.tenantObj.startTime);
				this.dateValue.push(this.tenantObj.endTime);
			},
			/*
			 * 取消
			 */
			cancelOpt() {
				let self = this
				self.resetForm(); //重置表单
				//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				self.$emit("TenantEditCallBack", false);
			},
			/*
			 * 重置表单
			 */
			resetForm() {
				this.pageType = '添加';
				this.$refs['ruleForm1'].resetFields();
				this.$refs['ruleForm2'].resetFields();
				this.$refs['ruleForm3'].resetFields();
			},
			/*
			 * 监听省级联动的选择
			 */
			handleChange() {
				this.ruleForm.adress = this.adress.toString()
			},
			/*
			 * 省市联动转汉字
			 */
			setUpList(value) {
				for (let i = 0; i < value.length; i++) {
					value[i].value = value[i].label
					if (value[i].children !== undefined && value[i].children.length > 0) {
						this.setUpList(value[i].children)
					}
				}
			},
			/**
			 * 校验表单并提交数据
			 */
			checkAndSubmit() {
				this.ruleForm.name = this.ruleForm.name.trim()
				this.ruleForm.phone = this.ruleForm.phone.trim()
				this.ruleForm.email = this.ruleForm.email.trim()
				this.ruleForm.adress = this.ruleForm.adress.toString().trim()
				this.ruleForm.detailAddress = this.ruleForm.detailAddress.trim()
				this.ruleForm.companyEmail = this.ruleForm.companyEmail.trim()
				this.ruleForm.fileId = this.ruleForm.fileId.trim()
				this.ruleForm.telephone = this.ruleForm.telephone.trim()
				this.ruleForm.startTime = this.ruleForm.startTime.trim()
				this.ruleForm.endTime = this.ruleForm.endTime.trim()
				this.ruleForm.devices = this.ruleForm.devices.toString().trim()
				this.ruleForm.linkman = this.ruleForm.linkman.trim()
				if (this.ruleForm.Id) {
					this.ruleForm.Id = this.ruleForm.Id.trim()
				}
				var flag1 = false
				var flag2 = false
				var flag3 = false
				this.handleChange()
				this.$refs['ruleForm1'].validate((valid) => {
					if (valid) {
						flag1 = true;
						if (flag1 == true && flag2 == true && flag3 == true) {
							this.savaRequest();
						}
					} else {
						flag1 = false;
						return;
					}
				});
				this.$refs['ruleForm2'].validate((valid) => {
					if (valid) {
						flag2 = true;
					} else {
						flag2 = false;
						return;
					}
				});
				this.$refs['ruleForm3'].validate((valid) => {
					if (valid) {
						flag3 = true;
					} else {
						flag3 = false;
						return;
					}
				});
				if (flag1 == true && flag2 == true && flag3 == true) {
					this.savaRequest();
				}
			},

			/**
			 * 保存数据接口  
			 */
			savaRequest() {
				if (this.operation == true) {
					if (this.ruleForm.fileId == "") {
						this.$message({
							type: 'warning',
							message: '营业执照上传失败，请重新上传'
						});
						return;
					}
					if (this.ruleForm.startTime == "") {
						this.$message({
							type: 'warning',
							message: '请选择日期'
						});
						return;
					}
					if (this.ruleForm.adress.length == 0) {
						this.$message({
							type: 'warning',
							message: '请选择地址'
						});
						return;
					}
					let submitForm = { ...this.ruleForm };
					delete submitForm.imagePath;
					if (this.pageType == "添加") {
						delete this.ruleForm.id
					}
					this.operation = false;
					this.$axios.leansite({
						method: 'post',
						url: this.API.leansite.saveTenant,
						data: submitForm
					}).then((res) => {
						this.operation = true;
						var resData = res.data;
						if (resData.code == 0) {
							this.$message({
								type: 'success',
								message: this.pageType + '租户成功!'
							});

							this.$emit("TenantEditCallBack", true);
						} else if (resData.code == 1000) {
							this.$message({
								type: 'error',
								message: this.pageType + '租户失败：' + resData.msg
							});
						}
					})
				} else if (this.operation == false) {
					this.$message({
						type: 'info',
						message: '提交中请稍后'
					});
				}
			},

			/**
			 * 监听上传图片
			 */
			handleImgChange(e) {
				let file = e.target.files[0];
				let flag = true;
				const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif');
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG || !isLt2M) {
					if (!isJPG) {
						this.$message.error('上传图片只能是 jpg/png/gif 格式!');
					}
					if (!isLt2M) {
						this.$message.error('上传图片大小不能超过 2MB!');
					}
					return isJPG && isLt2M;
				} else {
					let reader = new FileReader();
					let self = this;
					reader.readAsDataURL(file);
					reader.onload = function (e) {
						self.imageUrl = this.result //将图片路径赋值给src
						//	this.imageUrl = e.target.result
					}
					//请求接口   发出请求
					let formData = new FormData()
					formData.append('file', file)
					if (this.tenantObj.id) {
						formData.append('isAdd', false)
					} else {
						formData.append('isAdd', true)
					}
					self.upLoadImageRequest(formData);
				};
			},
			/**
			 * 上传图片接口
			 */
			upLoadImageRequest(fileObj) {
				this.$axios.leansite({
					method: 'POST',
					url: this.API.leansite.upLoadImg,
					data: fileObj,
					heards: {
						'Content-Type': 'multipart/form-data'
					}
				}).then((res) => {
					var resData = res.data;
					if (resData.code == 0) {
						this.ruleForm.fileId = resData.data.dataId;
						this.$message({
							type: 'success',
							message: '上传成功！'
						});

					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.box {
		margin: 0 0 40px;

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

		.tenantObjRight_bottom {
			margin-top: 20px !important;

			.tab {
				border: solid 1px #bebebe;
				/*height: 162px;*/
				font-size: 14px;
				color: #323232;
				margin-bottom: 24px;
				padding-bottom: 20px;
				border-radius: 5px;

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

					.el-cascader {
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
						text-overflow: ellipsis;
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

						/deep/ .el-form-item {
							margin-bottom: 16px;

						}

						#ImgName {
							opacity: 0;
							position: relative !important;
						}
					}
				}
			}

			#Img {
				width: 250px;
				height: 150px;
				margin: 10px auto;
			}
		}

		.bottom {
			p {
				color: #d0021b;
			}

			div {
				margin-top: 20px;

				button {
					&:first-child {
						width: 90px;
						height: 32px;
						background-color: #006fe6;
						border-radius: 4px;
					}

					&:last-child {
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

	/deep/ .spanButton {
		display: inline-block;
		position: absolute !important;
		top: 0px !important;
		left: 30% !important;
	}

	/deep/ .el-picker-panel__body .el-date-range-picker__time-header {
		display: none !important;

	}
</style>