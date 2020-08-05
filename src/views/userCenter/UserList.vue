<template>
	<div class="userListBox">
		<div class="userListLeft">
			<div class="top">
				<span>用户列表</span>
				<span class="el-icon-plus" v-if="hasPermission('user/insert')" @click="userAdd">添加用户</span>
			</div>
			<div class="seach">
				<el-input class="searchDept" prefix-icon="el-icon-search" placeholder="search" @input="filterUser" v-model="filterText">
				</el-input>
			</div>
			<div class="indexBar userNameByOrder" v-if="group.length>0" title="向下滑动，显示更多数据">
				<ul v-for="(itemGroup,index) in group" :key='index' >
					<li style="background: #d9d9d9" v-show='filterAllUserName[itemGroup].length>0' >{{itemGroup}}</li>
					<div>
						<li class="test" :class="userId==item.id?'userNameLight':''  " v-for="(item,index2) in filterAllUserName[itemGroup]" :key='index2' @click="userName_click(item,index,index2)">{{item.name}}</li>
					</div>
				</ul>
			</div>
			<div v-else-if="group.length==0" style="height: 80px;width: 100%;text-align: center;line-height: 80px;background: #fff;">暂无数据</div>
		</div>
		<div class="userMessageRight_box">
			<div class="userMessageRight" v-if="userName||addUser">
				<div v-if="addUser==false">
					<div class="userMessageRight_header">
						<div class="userMessageRight_header_top">
							<div class="showUserName" :class="{disableMask:status==1}">{{userName}}</div>
							<div class="operation">
								<span class="el-icon-remove-outline" v-if="hasPermission('user/disable')" @click="disableClick" v-show="status==0">&nbsp;停用</span>
								<span class="el-icon-edit" v-if="hasPermission('user/update')" v-show="status==0" @click="userEidt">&nbsp;编辑</span>
								<span class="el-icon-refresh-right" v-if="hasPermission('user/startuse')" @click="enable" v-show="status==1">&nbsp;恢复</span>
								<span class="el-icon-delete" v-if="hasPermission('user/delete')" @click="deleteUser">&nbsp;删除</span>
							</div>
						</div>
						<div class="userMessageRight_header_bottom" :class="{disableMask:status==1}">
							<span class="el-icon-message">&nbsp;{{userEmail}}</span>
							<span class="el-icon-phone">{{userPhone}}</span>
						</div>
					</div>
					<div class="userMessageRight_bottom" :class="{disableMask:status==1}">
						<div class="user_message tab">
							<div class="tab_header" :class="{disableMask:status==1}">
								<div>
									&nbsp;&nbsp;&nbsp;&nbsp;<span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span> 部门 <span>&nbsp;&nbsp;(此用户并列属于以下部门)</span>
								</div>
								<div>
									<el-button class="edit el-icon-edit" v-if="hasPermission('user/distributionOrg')" :disabled="status==1" :class="{disableMask:status==1}" @click="assignDep">编辑用户归属</el-button>
								</div>
								<el-dialog class="outDialog" :class="{disableMask:status==1}" key="userDialog" :berore-close="handleClose" title='编辑用户归属' v-show="assignDepDialogVisible" :visible.sync="assignDepDialogVisible" width="696px" height="421px" append-to-body :close-on-click-modal="false" :show-close="true">
									<el-cascader v-model="showOrgId" ref="cascader" :options="assignDepOptions" :props="props" collapse-tags ></el-cascader>
									<!--<el-button @click="bindDpt">分配</el-button>
                                    <div >
                                        <div v-for="item in userOwnDep">{{item.name}}</div>
                                    </div>-->
									<el-button @click="assignDepDialogVisible = false">取 消</el-button>
									<el-button type="primary" @click="saveDepEidt">确 定</el-button>
								</el-dialog>
							</div>
							<div v-if="userOwnDep.length>0">
								<div class="tab_body" :class="{disableMask:status==1}" v-for="(item,index) in userOwnDep" :key="index">{{item.name}} </div>
							</div>
							<div class="tab_body" v-else>暂时没有所属部门</div>
						</div>
						<div class="user_message tab">
							<div class="tab_header" :class="{disableMask:status==1}">
								<div>
									&nbsp;&nbsp;&nbsp; <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span> 角色 <span>&nbsp;&nbsp;(此用户并列属于以下角色)</span>
								</div>
								<div>
									<el-button class="edit el-icon-edit" v-if="hasPermission('user/distributionRole')" :disabled="status==1" :class="{disableMask:status==1}" @click="assignRoles">分配角色</el-button>
									<el-dialog class="outDialog" :class="{disableMask:status==1}" key="userDialog" :berore-close="handleClose" v-show="assignRolesDialogVisible" :visible.sync="assignRolesDialogVisible" width="696px" height="421px" append-to-body :close-on-click-modal="false" :show-close="true">
										<template slot="title">
											<div class='titleZise' style="font-size: 16px;">用户角色分配</span>
											</div>
										</template>
										<!-- 角色分配弹出框 -->
										<div class="emptyTipsMsg">
											<span style="font-size: 20px; display: inline-block; margin: 5px 16px ;" class="el-icon-info"></span>
											<span>用户重新登录后，变更生效。</span>
										</div>
										<el-transfer filterable :filter-method="filterMethod" filter-placeholder="seach" :titles="['可用角色', '已分配角色']" v-model="aSelectedRoleId" @change="roleEidtChange" clearable :data="data">
										</el-transfer>
										<span slot="footer" class="dialog-footer">
                                        <el-button style="color: #006fe6;border:1px solid #006fe6" @click="assignRolesDialogVisible = false">取 消</el-button>
                                        <el-button type="primary" style="color: white" @click="saveRolesEidt">确 定</el-button>
                                    </span>
									</el-dialog>
								</div>
							</div>
							<div v-if="userOwnRole.length>0">
								<div class="tab_body" :class="{disableMask:status==1}" v-for="(item,index) in userOwnRole" :key="index">{{item.name}}</div>
							</div>
							<div class="tab_body" v-else>暂时没有角色</div>
						</div>
					</div>
				</div>

				<!--            添加用户-->
				<UserListAddAndEdit v-if="addUser" :userMessage="editAllUserMes" @UserEditCallBack=userEditCallBack></UserListAddAndEdit>
			</div>
			<div class="kongbai" v-else-if="!userName&&!addUser">
				<img src="../../assets/img/userCenter/kongbai.png" alt="空白提示图片">
				<p>系统初始，请添加用户</p>
				<p>Stystem initial,please add user</p>
			</div>
		</div>

	</div>
</template>

<script>
	import UserListAddAndEdit from "./UserListAddAndEdit";
	export default {
		name: 'UserList',
		components: {
			UserListAddAndEdit
		},
		data() {
			return {
				status: 0, // 0代表正常状态  1代表禁用状态
				filterText: '', //用户筛选
				allUserName: null, //列表中所有的用户名
				filterAllUserName: [], //过滤所有用户名的分组
				group: null, //所有用户名的分组，按照首字母分
				data: [],
				aSelectedRoleId: [], //已选角色id数组
				filterMethod(query, item) { //这是角色分配的搜索逻辑数据
					return item.label.indexOf(query) > -1;
				},
				assignRolesDialogVisible: false, //角色分配的
				assignDepDialogVisible: false, //部门分配
				addUser: false, //控制添加用户界面是否出现
				disableMask: false, //控制点击禁用后出现的灰色样式
				disabled: false, //点击禁用后一些按钮添加disable 禁用模式
				userName: null, //右边显示的用户名
				userPhone: null, //右边显示的用户电话号码
				userEmail: null, //右边显示的用户邮箱
				rightUserMessage:{},
				orgId: '', //分配了的用户部门id
				userId: null, //根据用户id设置点击用户出现高亮
				allRoles: null,
				leftDefault: [],
				roleIds: null,
				loginName: null,
				userOwnDep: '', //用户现在所属的部门
				userOwnRole: '', //用户拥有的角色
				allUserMes: {}, //所有用户信息 （包括基本信息，和角色部门信息）
				props: {
					multiple: true, //让选择框可以多选
					checkStrictly: true, //可以任意选择哪一级
					value: 'id', //value和label是映射级联选择中的数据
					label: 'title'
				},
				assignDepOptions: [], //部门分配数据源  所有部门
				bindedDepartment: [], //编辑绑定的部门
				showOrgId: [], //级联选择器回显数据
				editAllUserMes:{},//传给子组件的值
				currentEditLine:[0,0],//当前编辑用户所在列表行数
			}
		},
		created() {
			this.group = []
		},
		mounted() {
			this.getUserName();
			this.getRoleRequest();
			this.getAllDepartment();
			
		},
		methods: {
			/**
			 * 用户搜索过滤
			 */
			filterUser() {
				if(this.filterText.length == 0) {
					this.filterAllUserName = this.allUserName;
				} else {
					this.filterAllUserName = this.allUserName;
					let returnObj = {};
					for(let f in this.filterAllUserName) {
						returnObj[f] = this.filterAllUserName[f].filter((currentValue, index, arr) => {
							return currentValue.name.indexOf(this.filterText) != -1;
						})
					}
					this.filterAllUserName = returnObj;
				}
			},
			/**
			 * 获取所有用户名  （用户列表中的）
			 */
			getUserName(oper,modityUser) {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getAllUserName
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
//						this.status = resData.data.status
						this.allUserName = resData.data;
						this.group = Object.keys(this.allUserName).sort();
						this.filterAllUserName = resData.data;
						
						if(this.allUserName[this.group[0]] && this.allUserName[this.group[0]].length > 0) {

							let userObj = null

							if(oper == 'delete'){
								let groupVal = this.group[0]
								let allUserObj = this.allUserName[groupVal]
								userObj = allUserObj[0]
							}else if(oper == 'modity' && modityUser != undefined){
								userObj = modityUser
							}else{
								let editLine = this.currentEditLine[0]
								let groupVal = this.group[editLine]
								if(groupVal == undefined){
									groupVal = this.group[0]
								}
								let allUserObj = this.allUserName[groupVal]
								userObj = allUserObj[this.currentEditLine[1]]
							}
							
							this.userEmail = userObj.email; //刚开始右边默认显示第一个人的信息
							this.userName = userObj.name;
							this.loginName = userObj.loginName;
							this.userPhone = userObj.phone;
//							this.rightUserMessage
							this.userId = userObj.id;
							this.status = userObj.status;
							this.orgId = userObj.orgId;
							this.allUserMes = userObj;
							this.editAllUserMes = this.allUserMes

						}else{
							this.userEmail = ''; //刚开始右边默认显示第一个人的信息
							this.userName = '';
							this.userPhone = '';
							this.userOwnDep= '';//用户现在所属的部门
							this.userOwnRole= ''; //用户拥有的角色
						}
						
						this.getUserOwnRole();
						this.getUserOwnDep();
					}
				})
			},
			/**
			 * 用户拥有的部门
			 */
			getUserOwnDep() {
				if(this.userId == undefined){
					return
				}
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getUserOwnDep,
					params: {
						"id": this.userId
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.userOwnDep = resData.data
						this.allUserMes.userOwnDep = this.userOwnDep;
						this.editAllUserMes.userOwnDep = this.userOwnDep;
						this.optUserOwnDep(resData.data);
					}
				})
			},
			/**
			 * 处理showOrgId
			 * 部门树回显数据
			 */
			optUserOwnDep(data) {
				let chioceDeptIds = [];
				if(data.length > 0) {
					data.forEach((item, index) => {
						chioceDeptIds.push(item.id);
					});
				}
				let mappingObj = {
					childKey: 'id',
					fatherKey: 'parentId'
				};
				//父子结构tree数据递归转换为数组扁平化结构
				let oldTreeList = this.commonFun.deepTraversal(this.assignDepOptions);
				let fatherChildIds = [];
				chioceDeptIds.forEach((item, index) => {
					let newArray = this.commonFun.findTreeNodeById(oldTreeList, item, mappingObj);
					let arrayFC = this.commonFun.createArrIdAndReverse(newArray, "id");
					fatherChildIds.push(arrayFC);
				});
				this.showOrgId = fatherChildIds;
			},
			/**
			 * 用户拥有的角色
			 */
			getUserOwnRole() {
				var roleIds = [];

				if(this.userId == undefined){
					return
				}
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getUserOwnRole,
					params: {
						"userId": this.userId
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.userOwnRole = resData.data;
						this.userOwnRole.forEach((item, index) => {
							roleIds.push(item.id);
						})
						this.aSelectedRoleId = roleIds;
						this.roleIds = roleIds.toString();
						this.allUserMes.userOwnRole = this.userOwnRole;
						this.allUserMes.roleIds = roleIds.toString();
						this.editAllUserMes.userOwnRole = this.userOwnRole;
						this.editAllUserMes.roleIds = roleIds.toString();
					}
				})
			},
			/**
			 * 点击了列表中的用户名 在右边显示相应用户的信息
			 */

			userName_click(item,index,index2) {
				this.userEmail = item.email;
				this.userPhone = item.phone;
				this.userName = item.name;
				this.userId = item.id;
				this.loginName = item.loginName;
				this.status = item.status;
				this.orgId = item.orgId;
				this.allUserMes = item;
				this.editAllUserMes = item;
				this.getUserOwnRole();
				this.getUserOwnDep();
				this.addUser = false;
				this.currentEditLine = [index,index2];
			},

			/**
			 * 点击了编辑
			 */
			userEidt() {
				this.addUser = true;
			},
			/**
			 * 点击了添加用户
			 */
			userAdd() {
				this.editAllUserMes = {};
				this.addUser = true;
			},
			/**
			 * 点击了删除
			 */
			deleteUser() {
				this.$confirm('此操作将永久删除用户, 是否继续?', '删除用户', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteUserRequest()
				}).catch(() => {

				});
			},
			/**
			 * 删除接口
			 */
			deleteUserRequest() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteUser,
					params: {
						ids: this.userId.toString(),

					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.getUserName('delete')
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除用户失败：' + resData.msg
						});
					}
				})

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
						this.assignDepOptions = resData.data.children;
					}
				})
			},
			/**
			 * 所有角色接口
			 */
			getRoleRequest() {
				this.$axios.leansite({
					method: 'GET',
					url: this.API.leansite.getAllRole,
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.allRoles = resData.data;
						this.allRoles.forEach((item, index) => {
							this.data.push({
								label: item.name,
								key: item.id,
								city: item.name //查询的关键字
							});
						});
					}
				})
			},
			/**
			 * 分配部门保存接口
			 */
			saveBindedDep() {
				this.$axios.leansite({
					method: 'POST',
					url: this.API.leansite.saveUser,
					data: {
						"id": this.userId, //有id的话是编辑保存 没有的话是新增保存
						"orgId": this.orgId,
						"email": this.userEmail,
						"loginName": this.loginName,
						"name": this.userName,
						"phone": this.userPhone,
						'roleIds': this.roleIds
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.getUserOwnDep()
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '保存失败：' + resData.msg
						});
					}
				})
			},
			/**
			 * 保存数据接口
			 */
			savaRequest() {
				this.$axios.leansite({
					method: 'POST',
					url: this.API.leansite.saveUser,
					data: {
						"id": this.userId, //有id的话是编辑保存 没有的话是新增保存
						"roleIds": this.aSelectedRoleId.toString(),
						"email": this.userEmail,
						"loginName": this.loginName,
						"name": this.userName,
						"orgId": this.orgId,
						"phone": this.userPhone,
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.getUserOwnRole()
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '角色分配失败：' + resData.msg
						});
					}
				})
			},
			/**
			 * 禁用 恢复接口
			 */
			isEnable() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.isEnable,
					params: {
						status: this.status,
						id: this.userId
					},
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						if(this.status == 0) {
							this.status = 1;
						} else {
							this.status = 0
						}
						this.getUserName()
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '操作失败：' + resData.msg
						});
					}
				})
			},
			/**
			 * 点击部门分配 分配
			 */
			bindDpt() {
				let clickedOrgId = [];
				let val = this.$refs.cascader.getCheckedNodes();
				val.forEach((dep, index) => {
					this.bindedDepartment.push(dep.label);
					clickedOrgId.push(dep.value)
				})
				this.orgId = clickedOrgId.toString();
			},
			/**
			 * 保存 部门 编辑
			 */
			saveDepEidt() {
				let aChioceArray = this.$refs.cascader.getCheckedNodes();
				if(aChioceArray.length == 0) {
					this.$message({
						type: 'warning',
						message: '您还没有选择用户所属部门!'
					});
					return;
				}
				let aChioceId = [];
				aChioceArray.forEach((item, index) => {
					aChioceId.push(item.value);
				});
				this.orgId = aChioceId.toString();
				this.editAllUserMes.orgId = this.orgId
				this.saveBindedDep();
				this.assignDepDialogVisible = false;
			},
			/**
			 * 角色分配弹框
			 */
			assignRoles() {
				this.assignRolesDialogVisible = true;
				this.getUserOwnRole();
			},
			/**
			 * 用户部门编辑
			 */
			assignDep() {
				this.assignDepDialogVisible = true;
				this.getUserOwnDep()

			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			/**
			 * 角色分配弹出框的左右变化监听事件
			 */
			roleEidtChange(val) {
				this.roleIds = val.toString()
			},
			/**
			 * 点击了角色分配确定按钮
			 */
			saveRolesEidt() {
				if(this.aSelectedRoleId.length == 0) {
					this.$message({
						type: 'warning',
						message: '您还没有选择用户所属角色!'
					});
					return;
				}
				this.savaRequest()
				this.assignRolesDialogVisible = false;
			},

			/**
			 * 点击了禁用
			 */
			disableClick() {
				this.isEnable()
			},
			/**
			 * 点击启动
			 */
			enable() {
				this.isEnable()
			},
			/*
			 * 用户信息组件回调方法--子组件回调数据的方法
			 * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
			 */
			userEditCallBack(isRefresh,userData) {
				this.addUser = false;
				this.editAllUserMes = this.allUserMes
				if(isRefresh) {
					this.getUserName('modity',userData);
				}
			},
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.userListBox {
		display: flex;
		justify-content: left;
		width: 100%;
		height: 100%;
		background-color: #fff;
		.userListLeft {
			width: 320px;
			background-color: #f0f0f0;
			border-right: solid 1px #b4b4b4;
			border-radius: 3px;
			overflow: hidden;
			.top {
				display: flex;
				justify-content: space-between;
				padding: 14px 16px 0;
				span {
					font-size: 14px;
					color: #323232;
					cursor: pointer;
				}
				.el-icon-plus {
					margin-top: 2px;
					color: #006fe6;
					cursor: pointer;
				}
			}
			.seach {
				margin: 15px 0 20px 0;
				text-align: center;
				border: none;
				/deep/ .el-input {
					width: 90%;
					/*height: 24px;*/
					background-color: #ffffff;
					border-radius: 4px;
					border: solid 1px #969696;
					margin: 0 auto;
					outline: none;
					border: none;
				}
			}
			.userNameByOrder {
				height: calc(100vh - 201px);
				height: -webkit-calc(100vh - 201px);
				height: -moz-calc(100vh - 201px);
				overflow: hidden;
				ul {
					/*margin-top: 20px;*/
					width: 320px;
					li {
						padding-left: 15px;
						height: 42px;
						line-height: 42px;
						background-color: #f0f0f0;
					}
					div {
						li {
							padding-left: 15px;
							height: 42px;
							line-height: 42px;
							background-color: #f0f0f0;
							border-bottom: solid 1px #b4b4b4;
							cursor: pointer;
							&:last-child {
								border: none;
							}
						}
					}
					.test{
						width: 296px;
						overflow: hidden !important;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					/deep/ .userNameLight {
						background-color: #fff !important;
					}
				}
			}
	    	.userNameByOrder:hover{
				width: calc(100% + 18px);
				overflow-y: auto;
			}
		}
		.userMessageRight_box {
			width: 85%;
			height: calc(100vh - 96px);
			height: -webkit-calc(100vh - 96px);
			height: -moz-calc(100vh - 96px);
			overflow: auto;
		}
		.userMessageRight {
			/*width: 90%;*/
			/*height: 100vh;*/
			/*overflow-y: auto;*/
			margin: 30px 40px 70px;
			.userMessageRight_header_top {
				display: flex;
				justify-content: space-between;
				.showUserName {
					font-family: Helvetica_cyr-Bold;
					font-size: 36px;
					color: #323232;
				}
				.operation {
					font-size: 14px;
					span {
						display: inline-block;
						margin-right: 20px;
						cursor: pointer;
					}
					.el-icon-remove-outline {
						color: #ffc800;
					}
					.el-icon-edit {
						color: #006fe6;
					}
					.el-icon-refresh-right {
						color: #006fe6;
					}
					.el-icon-delete {
						color: #f62447;
					}
				}
			}
			.userMessageRight_header_bottom {
				margin: 16px 0;
				span {
					display: inline-block;
					margin: 0 20px 0 0;
					font-family: Helvetica;
					font-size: 14px;
					color: #969696;
				}
			}
			.userMessageRight_bottom {
				.tab {
					border: solid 1px #bebebe;
					/*height: 162px;*/
					font-size: 14px;
					color: #323232;
					margin-bottom: 24px;
					border-radius: 3px;
					.tab_header {
						width: 100%;
						height: 48px;
						line-height: 48px;
						display: flex;
						justify-content: space-between;
						/*background-color: #f0f0f0;*/
						border-bottom: solid 1px #bebebe;
						/*padding-left:30px;*/
						span {
							font-size: 14px;
							color: #969696;
						}
						.edit {
							color: #006fe6;
							margin-right: 20px;
							cursor: pointer;
							background-color: transparent;
							border: none;
						}
						/deep/ .titleZise {
							font-size: 16px!important;
						}
					}
					.tab_body {
						width: 93%;
						height: 55px;
						line-height: 55px;
						border-bottom: solid 1px #bebebe;
						margin: 0 auto;
						&:last-child {
							/*父元素的最后一个子元素 所以应该写在这里*/
							border-bottom: none;
						}
					}
				}
			}
		}
		.kongbai {
			width: 100%;
			/*height: 100%;*/
			img {
				display: block;
				margin-top: 300px;
				margin: 400px auto 24px;
				width: 93px;
				height: 64px
			}
			p {
				text-align: center;
				color: #323232;
				font-size: 16px;
				&:last-child {
					color: #969696;
					margin-top: 7px;
				}
			}
		}
	}
	
	/deep/ .el-message-box__title {
		justify-content: left !important;
	}
	
	.el-dialog {
		background-color: #ffffff;
		box-shadow: 0px 0px 29px 0px rgba(0, 0, 0, 0.5);
		border-radius: 3px;
	}
	
	/deep/ .disableMask {
		color: #969696 !important;
		cursor: not-allowed !important;
	}
	
	/deep/ .el-dialog {
		/deep/ .emptyTipsMsg {
			margin: 10px 0 10px 0px;
			width: 99.2%;
			height: 32px;
			background-color: #d1e8f0;
			border-radius: 3px;
			border: solid 1px #bbd0d7;
			line-height: 32px;
			font-size: 14px;
			color: #235461;
		}
		/deep/ .el-dialog__header {
			border-bottom: 1px solid #4c5363;
		}
		.el-dialog__body {
			padding-top: 0;
			margin: 20px;
			/deep/ .el-button--primary.is-disabled {
				display: block;
				color: #006fe6;
				background-color: transparent;
				margin: 10px 0;
				border: none;
			}
			/deep/ .el-transfer-panel {
				width: 240px;
			}
			/deep/ .el-transfer-panel:hover {
				background: none;
				border: none;
				color: #409EFF;
			}
			/deep/ .el-transfer-panel .el-transfer-panel__header {
				background-color: transparent !important;
				border-bottom: none;
				/*text-align: center;*/
				width: 250px;
			}
			.el-transfer-panel .el-transfer-panel__header {
				.el-checkbox .el-checkbox__label span {
					display: block;
				}
			}
			.el-icon-arrow-left:before {
				content: "\E6DD";
				/*font-size: 20px;*/
			}
			.el-icon-arrow-right:before {
				content: "\E6DC";
				/*font-size: 20px;*/
			}
		}
	}
	
	/deep/ .el-form--label-top .el-form-item__label {
		padding: 0;
	}
	
	/deep/ .el-input--medium .el-input__inner {
		height: 32px;
		line-height: 32px;
	}
</style>