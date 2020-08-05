<template>
	<div class="box">
		<div class="top">
			<div style="margin-top: -50px;">
				<span @click="cancelOpt">用户管理</span>
				<span class="el-icon-arrow-right">
                    &nbsp;&nbsp;&nbsp;<span></span>{{pageType}}用户
				</span>
			</div>
			<div>{{pageType}}用户</div>
		</div>
		<div class="userMessageRight_bottom">
			<!--     基本信息框-->
			<div class="user_message tab">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span>  基本信息
					</div>
				</div>
				<div class="formText">
					<el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="用户名" prop="loginName">
							<el-input v-model="ruleForm.loginName" placeholder="请输入用户名(字母、数字组成的3~20位字符)" :disabled="disabled"></el-input>
						</el-form-item>
						<div >
							<el-form-item :label='pageType=="添加"?"密码（默认密码为000000）":"密码"' prop="password">
								<el-input type="password"  v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码，至少6个字符"></el-input>
							</el-form-item>
							<el-form-item label="确认密码" prop="checkPass">
								<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请重新输入密码"></el-input>
							</el-form-item>
						</div>
						<el-form-item label="姓名" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入姓名(汉字、字母或数字组成的2~20位字符)"></el-input>
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
			<!--      部门   -->
			<div class="user_message tab" v-show="pageType=='添加'">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span>  部门
					</div>
				</div>
				<div class="tab_body_select">
					<el-cascader ref="cascader" :options="departMentOptions" :props="props" collapse-tags  clearable>
					</el-cascader>
					<el-button type="text" @click="bindDpt">绑定部门</el-button>
				</div>
				<div v-if="bindedDepartment.length>0">
					<div class="tab_body_header tab_body" style="color: #999;">
						<div><span>部门名称</span></div>
						<div><span>操作</span></div>
					</div>
					<div class="tab_body" v-for="(item,index) in bindedDepartment" :key="'label'+index">
						<div><span>{{item.label}}</span></div>
						<div><span class="el-icon-delete" @click="deleteDept(index)"></span></div>
					</div>
				</div>
			</div>
			<!--       角色-->
			<div class="user_message tab" style="overflow: auto;"  v-show="pageType=='添加'">
				<div class="tab_header">
					<div>
						&nbsp;&nbsp;&nbsp; <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span>  角色
					</div>
				</div>
				<div class="tab_body_select">
					<el-select v-model="sRoleVal" multiple  :props="defaultProps"  collapse-tags value-key="id" @change="roleBindChange" clearable>
						<el-option v-for="item in options" :key="item.id" :label="item.name" :props="defaultProps" :value="item">
						</el-option>
					</el-select>
					<el-button type="text" @click="bindRole">绑定角色</el-button>
				</div>
				<div >
					
					<div v-if="bindedRole.length>0">
						<div class="tab_body_header tab_body" style="color: #999;">
							<div><span>角色名称</span></div>
							<div><span>操作</span></div>
						</div>
						<div class="tab_body" v-for="(item,index) in bindedRole" :key="index">
							<div><span>{{item.name}}</span></div>
							<div><span class="el-icon-delete" @click="deleteRole(index)"></span></div>
						</div>
					</div>
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

	export default {
		name: "userListAddAndEdit",
		props: {
			userMessage: { //userMessage用户信息
				type: Object,
				required: true
			}
		},
		data() {
			return {
				pageType: '添加', //页面类型 pageType=添加 /pageType=编辑
                isCheck:true,
				disabled:false,
				ruleForm: {
					loginName: '',
					password: '',
					checkPass: '',
					name: '',
					phone: '',
					email: '',
					roleIds: [],
					orgId: [], //已绑定部门id
				},
				rules: {
					loginName: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							validator:baseValidator.validateLoginName,
							trigger: 'blur'
						}
					],
					password: [{
							required:true,
							message: '请输入密码',
							trigger: 'blur'
						}, {
							validator: baseValidator.validatePassword,
							trigger: 'blur'
						}
					],
					checkPass: [{
							required:true,
							message: '请再次输入密码',
							trigger: 'blur'
						},
						{
							validator:(rule, value, callback) => {
								if(value != this.ruleForm.password) {
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
						// {min: 11, max: 11,message: '长度在 3 到 5 个字符', trigger: 'blur'}
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
				defaultProps: {
					value: 'id',
					label: 'title'
				},
				options: [],
				props: {
					multiple: true, //让选择框可以多选
					checkStrictly: true, //可以任意选择哪一级
					value: 'id', //value和label是映射级联选择中的数据
					label: 'title'
				},
				departMentOptions: [],
				sRoleVal: '', //用户角色

				bindedDepartment: [], //已绑定部门

				bindedRoles: [], //接受监听到的选中的角色
				bindedRole: [], //选中的角色  (绑定给用户的时候渲染页面)
				roleChangeVal:[],//监听到的角色改变的值
			}
		},
		created() {
			this.getAllDepartment();
			this.getRoleRequest();
		},
		mounted() {
			if(this.userMessage.id) {
				this.pageType = '编辑';
				this.rules.password[0].required = false;
				this.rules.checkPass[0].required = false;
				this.setFormData(); //表单赋值
				this.disabled = true;
			} else {
				this.pageType = '添加';
				this.ruleForm.password=this.API.leansite.constObj.DEFAULTPASSWORD,
				this.ruleForm.checkPass=this.API.leansite.constObj.DEFAULTPASSWORD,
				this.disabled = false;
			};
		},
		methods: {
			/**
			 * 表单赋值
			 */
			setFormData() {
				this.ruleForm.id = this.userMessage.id;
				this.ruleForm.name = this.userMessage.name;
				this.ruleForm.checkPass = '';
				this.ruleForm.password = '';
				this.ruleForm.note = this.userMessage.note;
				this.ruleForm.loginName = this.userMessage.loginName;
				this.ruleForm.email = this.userMessage.email;
				this.ruleForm.phone = this.userMessage.phone;
				this.ruleForm.roleIds = this.userMessage.roleIds;
				this.ruleForm.orgId = this.userMessage.orgId;
				console.log(this.userMessage.orgId);
				this.bindedRole = this.userMessage.userOwnRole;
				this.sRoleVal = this.bindedRole;
				this.userMessage.userOwnDep.forEach((item, index) => {
					this.bindedDepartment.push({
						id:item.id,
						label:item.name
					})
				});
			},
			/**
			 * 获取所有部门接口
			 */
			getAllDepartment() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDepts,
					params: {},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.departMentOptions = resData.data.children;
					} 
				});
			},
			/**
			 * 获取所有角色接口
			 */
			getRoleRequest() {
				this.$axios.leansite({
					method: 'GET',
					url: this.API.leansite.getAllRole,

				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.options = resData.data
					} 
				});
			},
			
			/**
			 * 删除选中的部门
			 * @param {Number} arrayIndex 部门数组的下标
			 */
			deleteDept(arrayIndex){
				this.bindedDepartment.splice(arrayIndex,1);
				let clickedOrgId = [];
				this.bindedDepartment.forEach((item,index)=>{
					clickedOrgId.push(item.id);
				});
				this.ruleForm.orgId = clickedOrgId.toString();
			},
			/**
			 * 删除选中的角色
			 * @param {Number} arrayIndex 部门数组的下标
			 */
			deleteRole(arrayIndex){
				var id = [];
				this.bindedRole.splice(arrayIndex,1);
				this.bindedRole.forEach((item,index)=>{
					if(id.indexOf(item.id)==-1){
						id.push(item.id)
					}
				});
				this.ruleForm.roleIds = id.toString();
			},
			/**
			 * 点击绑定部门
			 */
			bindDpt() {
				let aChiocedOrg = this.$refs.cascader.getCheckedNodes();
				if(aChiocedOrg.length == 0){
					this.$message({
                        type: 'warning',
                        message: '请先选择部门!'
                    });
                    return;
				}
				aChiocedOrg.forEach((item, index) => {
					let iFindLabel = this.bindedDepartment.findIndex((currentValue, index, arr)=>{
						return item.value*1 == currentValue.id*1;
					});
					if(iFindLabel == -1){
						this.bindedDepartment.push({
							id:item.value*1,
							label:item.label
						});
					}
				})
				let clickedOrgId = [];
				this.bindedDepartment.forEach((item,index)=>{
					clickedOrgId.push(item.id);
				});
				this.ruleForm.orgId = clickedOrgId.toString();
			},
			/**
			 * 点击角色绑定事件
			 */
			bindRole() {
				
				if(this.sRoleVal.length == 0){
					this.$message({
                        type: 'warning',
                        message: '请先选择角色!'
                    });
                    return;
				};
				this.bindedRole = this.sRoleVal;
			},
			/*
			 * 取消
			 */
			cancelOpt() {
				this.resetForm();//重置表单
				//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("UserEditCallBack", false);
			},
			/*
			 * 重置表单
			 */
			resetForm(){
				this.pageType ='添加';
				this.$refs['ruleForm'].resetFields();
			},
			/**
			 * 校验表单并提交数据
			 */
			checkAndSubmit(){
				this.bindedRole.forEach((item,index)=>{
					this.bindedRoles.push(item.id);
                  	this.ruleForm.roleIds = this.bindedRoles.toString()
				});
				this.$refs["ruleForm"].validate((valid) => {
					if(this.pageType=="添加"){
						if(this.ruleForm.orgId.length == 0) {
						this.$message({
	                        type: 'warning',
	                        message: '您还没有绑定部门!'
	                    });
	                    return;
					};
					if(this.ruleForm.roleIds.length == 0) {
						this.$message({
	                        type: 'warning',
	                        message: '您还没有绑定角色!'
	                    });
	                    return;
					};
					}
					if(valid) {
						this.savaRequest();
					}
				});
			},
			/**
			 * 保存数据接口  确定
			 */
			savaRequest() {
				let self = this;
				let oOrg = {};
				let submitForm = {...self.ruleForm};
				if(submitForm.password=='') {
					delete submitForm.password;
					delete submitForm.checkPass;
				} else {
					delete submitForm.checkPass;
					submitForm.password = this.$md5(submitForm.password);
				}
				if(this.pageType =='添加'){
					submitForm.status = 0;
					submitForm.id = '';
				}else{
					submitForm.status = this.userMessage.status;
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
                            message: this.pageType+'用户成功'
                        });
						this.$emit("UserEditCallBack", true , resData.data);
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: this.pageType+'用户失败：' + resData.msg
						});
					} 
				});

			},
            roleBindChange(val){
                this.roleChangeVal = val;
            }
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
	/deep/ .el-select .el-input .el-select__caret{
	z-index: -100;
}
</style>
