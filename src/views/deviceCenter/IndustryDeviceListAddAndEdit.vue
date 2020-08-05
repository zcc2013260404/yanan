<template>
	<div class="industryDeviceListAddAndEidt">
		<div class="top">
			<div>
				<span class="backMain" @click="cancelOpt(2)">工业设备</span>
				<span class="el-icon-arrow-right" v-show="pageType=='添加'">
                    <span></span>
				</span>
				<span class="backMain" @click="cancelOpt(1)" v-show="pageType=='添加'">选择类型</span>
				<span class="el-icon-arrow-right">
                    <span></span>{{pageType}}设备
				</span>
			</div>
			<div>{{pageType}}设备</div>
		</div>
		<div class="userMessageRight_bottom">
			<div class="user_message tab">
				<div class="tab_header"><span>-</span>基本信息</div>
				<div class="tab_body">
					<div class="formText">
						<el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleFormTop" label-width="10px" class="submitForm">
							<el-form-item label="设备名称" prop="name">
								<el-input v-model="ruleForm.name" placeholder="请输入名称（2~50个字符）" style="width:260px;"></el-input>
							</el-form-item>
							<el-form-item label="描述" prop="note">
								<el-input type="textarea" v-model="ruleForm.note" placeholder="请输入描述（0~50个字符）" maxlength="50" show-word-limit></el-input>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
		<div class="userMessageRight_bottom">
			<div class="user_message tab">
				<div class="tab_header"><span>-</span>地理位置</div>
				<div class="tab_body">
					<div class="formText">
						<el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="submitForm">
							<el-form-item label="区域" prop="orgId">
								<el-cascader ref="cascader" v-model="ruleForm.orgId" :options="departMentOptions" :props="cascaderProps" collapse-tags @change="cascaderChange" clearable style="width: 500px;">
								</el-cascader>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
		<div class="bottom">
			<p>*&nbsp;必填字段</p>
			<el-row>
				<el-button type="primary" @click="saveIndustryDevice">提交</el-button>
				<el-button @click="cancelOpt(2)">取消</el-button>
			</el-row>
		</div>
	</div>
</template>

<script>
	import baseValidator from "../../common/baseValidator.js"
	export default {
		name: "IndustryDeviceListAddAndEidt", //设备类型添加或编辑
		props: {
			typeObj: { //typeObj用户信息
				type: Object,
				required: true
			},
			chioceDevice: { //选中的设备信息（仅添加时使用）
				type: Object,
				required: false
			}
		},
		data() {
			return {
				pageType: '添加', //页面类型 ：添加/编辑
				ruleForm: {
					id: '',
					name: '',
					note: '',
					orgId: '', //区域id
					classifyId: '' //设备类型id
				},
				cascaderProps: {
					checkStrictly: true, //可以任意选择哪一级
					value: 'id', //value和label是映射级联选择中的数据
					label: 'title'
				},
				departMentOptions: [],
				showOrgId: [], //级联选择器回显数据
				rules: {
					name: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
						{
							validator: baseValidator.validateDeviceName,
							trigger: 'blur'
						}
					],
					note: [{
							required: false,
							message: '请输入描述',
							trigger: 'blur'
						},
						{
							validator: baseValidator.validateDeviceDesc,
							trigger: 'blur'
						}
					],
					orgId: [{
							required: true,
							message: '请选择区域',
							trigger: 'blur'
						},
						{
							validator: baseValidator.validateDeviceOrg,
							trigger: 'blur'
						}
					]
				},
				options: []
			}
		},
		mounted() {
			this.getAllDepartment();
			if(this.typeObj.id) {
				this.pageType = '编辑';
				this.setFormData(); //表单赋值
			} else {
				this.ruleForm.classifyId = this.chioceDevice.id;
				this.pageType = '添加';
			}
		},
		methods: {
			/**
			 * 监听取消按钮click事件
			 * @param {Number} optType 操作类型 0:刷新表格数据;1:返回到选择设备类型界面;2:不刷新数据关闭，返回至列表界面
			 */
			cancelOpt(optType) {
				this.resetForm();
				// //调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("IndustryDeviceEditCallBack", optType);
			},
			/**
			 * 表单赋值
			 */
			setFormData() {
				this.ruleForm.id = this.typeObj.id;
				this.ruleForm.name = this.typeObj.name;
				this.ruleForm.note = this.typeObj.note;
				this.ruleForm.orgId = this.typeObj.orgId+"";
				this.ruleForm.classifyId = this.typeObj.classifySet.id;
			},
			/**
			 * 保存设备信息
			 * @param formName {String} form表单名称
			 */

			saveIndustryDevice(formName) {
				let self = this;
				this.$refs['ruleFormTop'].validate((valid) => {
					if(valid){
						this.$refs["ruleForm"].validate((valid) => {
							if(valid) {
								this.saveRequest();
							} else {
								return false;
							}
						});
					}else{
						return ;
					}
				});
				
			},
			/**
			 * 监听 区域级联选择器的 change事件
			 */
			cascaderChange(chioceNode) {
				this.ruleForm.orgId = chioceNode;
			},
			/*
			 * 重置表单
			 */
			resetForm() {
				this.pageType = '添加';
				this.$refs['ruleForm'].resetFields();
			},
			/**
			 * 处理showOrgId数据
			 * 部门树回显数据
			 */
			optChioceDep() {
				let mappingObj = {
					childKey: 'id',
					fatherKey: 'parentId'
				};
				//父子结构tree数据递归转换为数组扁平化结构 
				let oldTreeList = this.commonFun.deepTraversal(this.departMentOptions);
				let newArray = this.commonFun.findTreeNodeById(oldTreeList, this.ruleForm.orgId, mappingObj);
				let aOrgIds = this.commonFun.createArrIdAndReverse(newArray, "id");
				this.ruleForm.orgId = aOrgIds;
			},
			/**
			 * 获取所有部门接口
			 */
			getAllDepartment() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDepts
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.departMentOptions = resData.data.children;
						if(this.pageType == "编辑") {
							this.optChioceDep();
						}
					}
				})
			},
			/**
			 * 保存设备请求
			 */
			saveRequest() {
				let self = this;
				let submitForm = {
					name: this.ruleForm.name,
					note: this.ruleForm.note,
					classifyId: this.ruleForm.classifyId,
					orgId: this.ruleForm.orgId[this.ruleForm.orgId.length - 1] * 1
				};
				if(this.pageType == "编辑") {
					submitForm.id = this.ruleForm.id;
					submitForm.tbId=this.typeObj.tbId;
				}
				this.$axios.leansite({
					method: 'post',
					url: this.API.leansite.saveIndustryDevice,
					data: submitForm
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						self.$message({
							type: 'success',
							message: this.pageType + '设备成功!'
						});
						self.resetForm(); //重置表单
						//调用父组件方法--isRefresh=true需要刷新父组件的数据
						self.$emit("IndustryDeviceEditCallBack", 0);
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: this.pageType + '设备失败：' + resData.msg
						});
					} 
				})
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.industryDeviceListAddAndEidt {
    	margin: 0 40px 0;
		.top {
			div {
				font-size: 14px;
				margin-top: 24px;
				.backMain {
					cursor: pointer;
				}
				span {
					color: #006fe6;
					margin-right: 10px;
				}
				.el-icon-arrow-right {
					color: #969696;
				}
				&:last-child {
					height: 36px;
					font-family: MicrosoftYaHei-Bold;
					font-size: 36px;
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
				font-size: 14px;
				color: #323232;
				margin-bottom: 23px;
				padding-bottom: 20px;
				border-radius: 3px 3px 3px 3px;
				.tab_header {
					height: 48px;
					line-height: 48px;
                    background-color: #FFFFFF;
                    border-bottom: solid 1px #bebebe;
                    border-bottom: none;
					padding-left: 16px;
                    span{
                    	font-weight: bold;
                    	font-size: 18px;
                    	margin-right: 10px;
                    }
				}
				.tab_body {
					width: 100%;
					overflow: hidden;
				}
				.formText {
					width: 50%;
					margin: 0 auto;
					padding: 0 16px;
					float: left;
					.el-form {
						width: 100%;
						/deep/ .el-textarea .el-input__count{
                        	height: 24px !important;
                        }
					}
				}
			}
		}
		.tableTitle {
			height: 48px;
			line-height: 48px;
			margin: 24px 0 0;
			padding: 0 16px;
			background-color: #FFFFFF;
			border: solid 1px #bebebe;
	        span{
            	font-weight: bold;
            	font-size: 18px;
            	margin-right: 10px;
            }
		}
		.container {
			border: solid 1px #bebebe;
			border-top: none;
			padding: 16px;
			.tipsMsg {
				display: flex;
				align-items: center;
				height: 64px;
				background-color: #ffedb5;
				border-radius: 3px;
				border: solid 1px #e6dbb7;
				i {
					padding: 0 15px;
					font-size: 20px;
				}
				ul li {
					list-style: none;
					font-size: 14px;
					font-weight: normal;
					font-stretch: normal;
					line-height: 24px;
					letter-spacing: 0px;
					color: #665e48;
				}
			}
			.el-button {
				margin: 15px 0 5px;
			}
		}
		.bottom {
			padding: 23px 0;
			p {
				color: #d0021b;
			}
			div {
				margin-top: 20px;
				.el-button {
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
</style>