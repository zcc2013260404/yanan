<template>
	<div class="box">
		<div class="top">
			<div style="margin-top: -20px;">
				<span @click="backOpt">租户管理</span>
				<span class="el-icon-arrow-right">
                    &nbsp;&nbsp;&nbsp;<span></span>租户管理员
				</span>
			</div>
		</div>
		<el-container>
			<el-aside class="outAside" width="55%">
				<el-table :data="tableData" class="table" ref="multipleTable" height="678" empty-text="暂无数据" @row-click="tableClick">
					<el-table-column prop="name" label="用户名" align="left" width="200"></el-table-column>
					<el-table-column prop="loginName" label="登录账号" align="left" width="200"></el-table-column>
					<el-table-column prop="phone" label="手机号" align="left" min-width="150"></el-table-column>
					<el-table-column prop="email" label="邮箱" align="left" min-width="200"></el-table-column>
					<el-table-column label="操作" align="center" width="150">
						<template slot-scope="scope">
							<span class="el-icon-delete" v-if="hasPermission('user/delete')" @click.prevent.stop="deleteTenantAdmin(scope.$index, scope.row)" title="删除"></span>
						</template>
					</el-table-column>
				</el-table>
				<Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
			</el-aside>
			<el-container class="rightContainer">
				<div class="tenantObjRight_bottom">
					<!--     基本信息框-->
					<div class="user_message tab">
						<div class="tab_header">
							<div>
								&nbsp;&nbsp;&nbsp; <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span> 基本信息
							</div>
						</div>
						<div class="formText">
							<el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
								<el-form-item label="用户名" prop="loginName">
									<el-input v-model="ruleForm.loginName" placeholder="请输入用户名(字母、数字组成的3~20位字符)" :disabled="disabled"></el-input>
								</el-form-item>
								<div>
									<el-form-item :label='pageType=="添加"?"密码（默认密码为"+API.leansite.constObj.DEFAULTPASSWORD+"）":"密码"' prop="password">
										<el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码，至少6个字符"></el-input>
									</el-form-item>
									<el-form-item label="确认密码" prop="checkPass">
										<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请重新输入密码"></el-input>
									</el-form-item>
								</div>
								<el-form-item label="姓名" prop="name">
									<el-input v-model="ruleForm.name" placeholder="请输入姓名(汉字、字母或数字组成的2~20位字符)"></el-input>
								</el-form-item>
								<el-form-item label="手机号" prop="phone">
									<el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
								</el-form-item>
								<el-form-item label="邮箱" prop="email">
									<el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<!--底部提交按钮-->
					<div class="bottom">
						<p>*&nbsp;必填字段</p>
						<el-row>
							<el-button type="primary"  v-if="pageType=='添加' && hasPermission('user/insert')" @click="checkAndSubmit">添加</el-button>
							<el-button type="primary"  v-if="pageType=='编辑' && hasPermission('user/update')" @click="checkAndSubmit">编辑</el-button>
							<el-button @click="resetForm">重置</el-button>
							<el-button @click="backOpt">返回</el-button>
						</el-row>
					</div>
				</div>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import Pagination from '../../components/Pagination.vue';
	import baseValidator from "../../common/baseValidator.js"

	export default {
		name: "TenantAdminList", //租户管理员列表
		props: {
			tenantObj: { //tenantObj用户信息
				type: Object,
				required: true
			}
		},
		components: {
			Pagination
		},
		data() {
			return {
				pageType: '添加', //页面类型 pageType=添加 /pageType=编辑
				disabled: false,
				ruleForm: {
					id:'',
					loginName: '',
					password: '',
					checkPass: '',
					name: '',
					phone: '',
					email: '',
					orgId:'',
					roleIds:'',
					tenantId:''
				},
				oTenant:{...this.tenantObj},
				pageObj: {
					pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
					total: 0, //数据总数
					pageSize: this.API.leansite.constObj.pageSize, //页大小
				},
				oTenantAdmin:{},//选中的管理员信息
				tableData: [], //租户管理员列表
				rules: {
					loginName: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator: baseValidator.validateLoginName,
							trigger: 'blur'
						}
					],
					password: [{
						required: true,
						validator: baseValidator.validatePassword,
						trigger: 'blur'
					}],
					checkPass: [{
							required: true,
							message: '请再次输入密码',
							trigger: 'blur'
						},
						{
							validator: (rule, value, callback) => {
								if(value !== this.ruleForm.password) {
									callback(new Error('两次输入密码不一致!'));
								} else {
									callback();
								}
							},
							trigger: 'blur'
						}
					],
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							validator: baseValidator.validateName, //员工姓名是2-20个字符
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
				},
			}
		},
		created() {
			this.getTenantAdminData();
		},
		mounted() {
			this.formChange(2);
		},
		methods: {
			/*
			 * 分页组件回调方法--子组件回传数据的方法
			 * @page_obj {Object} 分页信息
			 * page_obj.page_index 当前页下标
			 * page_obj.page_size 页大小
			 */
			PageTurning(page_obj) {
				this.pageObj.pageIndex = page_obj.page_index;
				this.pageObj.pageSize = page_obj.page_size;
				this.getTenantAdminData();
			},
			/**
			 * 监听table click事件
			 */
			tableClick(row, column, event) {
				this.oTenantAdmin = row;
				this.formChange(1);
			},
			/**
			 * 表单赋值
			 */
			setFormData() {
				this.ruleForm.id = this.oTenantAdmin.id;
				this.ruleForm.name = this.oTenantAdmin.name;
				this.ruleForm.checkPass = '';
				this.ruleForm.password = '';
				this.ruleForm.note = this.oTenantAdmin.note;
				this.ruleForm.loginName = this.oTenantAdmin.loginName;
				this.ruleForm.email = this.oTenantAdmin.email;
				this.ruleForm.phone = this.oTenantAdmin.phone;
			},
			/*
			 * 监听 返回 按钮 click事件
			 */
			backOpt() {
				this.resetForm(); //重置表单
				//调用父组件方法
				this.$emit("TenantAdminCallBack");
			},
			/*
			 * 重置表单
			 */
			resetForm() {
				this.formChange(2);
				this.$refs['ruleForm'].resetFields();
				this.ruleForm.password = this.API.leansite.constObj.DEFAULTPASSWORD;
				this.ruleForm.checkPass = this.API.leansite.constObj.DEFAULTPASSWORD;
			},
			/**
			 * 校验表单并提交数据
			 */
			checkAndSubmit() {
				this.$refs["ruleForm"].validate((valid) => {
					if(valid) {
						this.savaRequest();
					}
				});
			},
			/**
			 * 监听 删除 按钮click事件
			 */
			deleteTenantAdmin(index, row) {
				this.$confirm('确定删除该租户管理员?', '操作提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteUserRequest(row);
				});
			},
			/**
			 * 表单添加或编辑状态切换
			 * @param {Number} optType 处理类型 1=编辑；2=添加
			 */
			formChange(optType) {
				if(optType == 1) {
					this.pageType = '编辑';
					this.rules.password[0].required = false;
					this.rules.checkPass[0].required = false;
					this.setFormData(); //表单赋值
					this.disabled = true;
				} else {
					this.pageType = '添加';
					this.rules.password[0].required = true;
					this.rules.checkPass[0].required = true;
					this.ruleForm.password = this.API.leansite.constObj.DEFAULTPASSWORD,
					this.ruleForm.checkPass = this.API.leansite.constObj.DEFAULTPASSWORD,
					this.disabled = false;
				};
			},
			/**
			 * 删除接口
			 * @param {Object} userObj 需要删除的租户管理员对象
			 */
			deleteUserRequest(adminObj) {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteUser,
					params: {
						ids: adminObj.id
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
						this.getTenantAdminData();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除租户管理员失败：' + resData.msg
						});
					}
				})

			},
			/**
			 * 保存数据接口  确定
			 */
			savaRequest() {
				let self = this;
				let oOrg = {};
				let submitForm = {
					id:this.ruleForm.id,
					loginName: this.ruleForm.loginName.trim(),
					password: this.ruleForm.password.trim(),
					checkPass: this.ruleForm.checkPass.trim(),
					name: this.ruleForm.name.trim(),
					phone: this.ruleForm.phone.trim(),
					email: this.ruleForm.email.trim(),
					orgId:this.oTenant.orgId,
					roleIds:this.oTenant.roleId,
					tenantId:this.oTenant.id
				};
				if(submitForm.password.length == 0) {
					delete submitForm.password;
					delete submitForm.checkPass;
				} else {
					delete submitForm.checkPass;
					submitForm.password = this.$md5(submitForm.password);
				}
				if(this.pageType == '添加') {
					submitForm.status = 0;
					submitForm.id = '';
					submitForm.isAdmin = 2;
				} else {
					submitForm.status = this.oTenant.status;
				}
				this.$axios.leansite({
					method: 'POST',
					url: this.API.leansite.saveUser,
					data: submitForm,
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: this.pageType + '租户管理员成功'
						});
						this.resetForm();
						this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
						this.getTenantAdminData();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: this.pageType + '租户管理员失败：' + resData.msg
						});
					}
				});

			},
			/**
			 * 多条件分页查询获取租户列表请求
			 */
			getTenantAdminData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getTenantAdminsByPage,
					params: {
						'tenantId': this.oTenant.id,
						'pageNum': this.pageObj.pageIndex,
						'pageSize': this.pageObj.pageSize
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.tableData = resData.data.list;
						this.pageObj.total = resData.data.total;
						this.pageType = '添加'
						this.oTenantAdmin = {};
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.box {
		margin: 0 auto;
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
			width: 100%;
			margin-top: 20px !important;
			.tab {
				border: solid 1px #bebebe;
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
						width: 50%;
						/deep/ .el-form-item {
							margin-bottom: 16px;
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
					&:first-child {
						width: 90px;
						height: 32px;
						background-color: #006fe6;
						border-radius: 4px;
					}
					&:nth-child(2),
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
		.outAside {
			.el-table {
				.el-icon-delete {
					color: red;
					cursor: pointer;
				}
			}
		}
	}
</style>