<template>
    <el-container class="roleList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>角色列表</span>
                <el-button type="text" v-if="hasPermission('role/insert')" icon="el-icon-plus" @click="editRoleHandle('add')" style="padding-left: 10px;">添加角色</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterRole"
				  	v-model="filterText">
				</el-input>
            </div>
            <div class="tableDiv" title="向下滑动，显示更多数据">
		  		<el-table :data="filterRoleTableData" class="table" 
		  			highlight-current-row 
		  			:show-header=false ref="singleTable" 
		  			:row-class-name="tableRowClassName"
		  			@row-click="handleSelectRole" 
		  			:row-style="{background:'#f0f0f0'}">
	                <el-table-column  align="left" min-width="300">
	                    <template slot-scope="scope">
	                        <p style="font-size:14px;color: #323232;">{{scope.row.name}}</p>
	                        <p style="font-size:12px;color: #969696;width:282px;overflow: hidden !important;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.note}}</p>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
    <div class="userMessageRight_box">
	  	<el-container class="rightContainer" v-if="roleWebVisible">
	  		<RoleAddAndEdit :roleObj=oRoleAddAndEdit @RoleEditCallBack=RoleEditCallBack :rowObj="oRoleObject"></RoleAddAndEdit>
	  	</el-container>
	  	<el-container class="rightContainer" v-else-if="roleAuthVisible">
	  		<RoleListPower :roleObj=oRoleAddAndEdit @RoleListPowerCallBack=RolePowerCallBack></RoleListPower>
	  	</el-container>
	  	<el-container class="rightContainer" v-else>
	        <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span>{{oRoleObject.name}}</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button  type="text" v-if="hasPermission('permissions/insert')" icon="el-icon-edit" @click="setPowerHandle">权限设置</el-button>
				  	<el-button type="text" v-if="hasPermission('role/update')" icon="el-icon-edit" @click="editRoleHandle('edit')">编辑</el-button>
				  	<el-button type="text" v-if="hasPermission('role/delete')" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>
				  </el-col>
				</el-row>
	        </el-header>
			<div class="table-title">
	        	<span>-</span>角色描述
	        </div>
	        <div class="showDesc">{{oRoleObject.note}}</div>
			<div class="table-title"><span>-</span>用户</div>
	        <div class="container">
	            <el-table :data="userTableData" class="table" ref="multipleTable" height="450" empty-text="暂无数据">
	                <el-table-column prop="name" label="姓名" align="center" width="250"></el-table-column>
	                <el-table-column prop="phone" label="电话"  align="center" width="200"></el-table-column>
	                <el-table-column prop="email" label="邮箱" align="center" min-width="250"></el-table-column>
	            </el-table>
	            <Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
	        </div>
	   </el-container>
    </div>
	</el-container>
</template>

<script>
	import Bus from '../../common/bus.js';
	import Pagination from '../../components/Pagination.vue';
	import RoleAddAndEdit from '../../views/userCenter/RoleAddAndEdit.vue';
	import RoleListPower from "./RoleListPower.vue";
    export default {
        name: 'RoleList',//角色列表
        components: {
			Pagination, //分页组件
			RoleAddAndEdit,//新增或修改角色
            RoleListPower, //分配权限
		},
        data() {
            return {
				roleId:'',
				choiceId:'',
				operType:'',
            	oRoleObject:{
            		name:'暂无数据'
            	},//选中的角色对象
            	oRoleAddAndEdit:{},//给RoleAddAndEdit传递的数据
		        filterText:'',//组织架构筛选
                userTableData: [],//用户列表数据
                filterRoleTableData: [],//用于筛选的角色列表数据
                roleTableData:[],//角色列表数据
                pageObj: {
					pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
					total: 0, //数据总数
					pageSize: this.API.leansite.constObj.pageSize, //页大小
				},
				searchText:'',//搜索字段
				roleWebVisible:false,//是否显示角色信息界面
                roleAuthVisible:false,//是否显示分配权限信息界面
                tableCurrentLine:0,//表格的当前行
            }
        },

        created() {
            this.getRoleData();
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
				this.getUserData();
			},
	        /*
	         * 角色信息组件回调方法--子组件回调数据的方法
	         * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
	         */
	        RoleEditCallBack(isRefresh){
                this.roleAuthVisible = false;
            	this.roleWebVisible = false;
				if(isRefresh){
			   		this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
			   		this.tableCurrentLine = this.filterRoleTableData.length
					this.getRoleData(true);
				}
			},
			/**
			 * 分配权限完成回调函数
			 */
            RolePowerCallBack(isRefresh){
                this.roleAuthVisible = false;
            	this.roleWebVisible = false;
                Bus.$emit('reloadData');
                if(isRefresh){
                    this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
                    this.getRoleData(true);
                }
            },
            /**
             * 添加或者编辑角色信息
             * @param {String} optType 操作类型 add/edit
             */
            editRoleHandle(optType){
            	if(optType == "add"){
					this.operType = 'add'
            		this.oRoleAddAndEdit ={};
            	}else{
					this.operType = 'edit'
	            	if(this.oRoleObject.name == '超级管理员'){
	        			this.$message({
							type: 'warning',
							message: '不能编辑超级管理员的信息'
						});
						return;
	            	}
            		this.oRoleAddAndEdit =this.oRoleObject;
            	}
            	this.roleAuthVisible = false;
            	this.roleWebVisible = true;
            },
            /**
             * 权限设置
             */
            setPowerHandle(optType){
            	if(this.oRoleObject.name == '超级管理员'){
        			this.$message({
						type: 'warning',
						message: '不能设置超级管理员的权限'
					});
					return;
            	}
            	this.oRoleAddAndEdit =this.oRoleObject;
            	this.roleAuthVisible = true;
            	this.roleWebVisible = false;
            },
			/**
			 * 获取列表数据
			 */
			getRoleData(autoCheck) {
				if(autoCheck){
					this.choiceId = this.oRoleObject.id	
				}else{
					this.choiceId = ''
				}
				
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getAllRole
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.roleTableData = resData.data;
						this.filterRoleTableData = resData.data;
						if(resData.data.length > 0){
							let needCheck = true
							
							if(this.oRoleObject != undefined ){
								if(this.operType == 'add'){
									let len = this.filterRoleTableData.length
									this.$refs.singleTable.setCurrentRow(this.filterRoleTableData[len-1])
									this.oRoleObject = this.filterRoleTableData[len-1]
									needCheck = false
								}else if(this.operType == 'del'){
									this.$refs.singleTable.setCurrentRow(this.filterRoleTableData[0])
									this.oRoleObject = this.filterRoleTableData[0]
									needCheck = false
								}else{
									for(let i = 0 ; i < this.filterRoleTableData.length ; i++){
										if(this.filterRoleTableData[i].id == this.choiceId){
											this.$refs.singleTable.setCurrentRow(this.filterRoleTableData[i])
											this.oRoleObject = this.filterRoleTableData[i]
											needCheck = false
											break
										}
									}
								}
							}

							if(needCheck){
								this.$refs.singleTable.setCurrentRow(this.filterRoleTableData[0])
								this.oRoleObject = this.filterRoleTableData[0]
							}
							
							this.getUserData();		
						}else{
							this.userTableData = [];
							this.pageObj.total = 0;
						}
					} 
				})
			},
            /**
             * 角色搜索过滤
             */
             filterRole(){
             	if(this.filterText.length == 0){
                	this.filterRoleTableData = this.roleTableData;
                }else{
                	this.filterRoleTableData = this.roleTableData;
                	this.filterRoleTableData = this.filterRoleTableData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })
                }
            },
            /**
             * 删除角色
             */
            handleDelete() {
            	if(this.oRoleObject.name == '超级管理员'){
        			this.$message({
						type: 'warning',
						message: '超级管理员不能删除'
					});
					return;
            	}
            	this.$confirm('确定删除该角色', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.deleteRequest(this.oRoleObject.id);//批量删除请求
		        }).catch(() => {});
            },
            /**
             * 批量删除请求
             */
            deleteRequest(delRoleText){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteRoles,
					params:{
						ids:delRoleText
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: '删除成功！'
						});
				   		this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
						this.operType = 'del'
						this.getRoleData();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除失败：'+resData.msg
						});
					}
				})
            },
            tableRowClassName ({row, rowIndex}) {
		        //把每一行的索引放进row
		        row.index = rowIndex;
		      },
            /**
             * 单击选中角色
             */
            handleSelectRole(row, column, event) {
            	this.tableCurrentLine = row.index;
            	this.oRoleObject = row;
            	this.getUserData();
            	this.roleWebVisible = false;
            	this.roleAuthVisible = false;
            },
            /**
			 * 根据roleId获取人员数据
			 */
			getUserData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getUsersPageByRoleId,
					params: {
						'roleId':this.oRoleObject.id,
						'pageNum': this.pageObj.pageIndex,
						'pageSize': this.pageObj.pageSize
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.userTableData = resData.data.list;
						this.pageObj.total = resData.data.total;
					} 
				})
			},
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .roleList {
	    height: 100%;
	    background-color: #f0f0f0;
        /deep/ .el-tree-node>.el-tree-node__children{
            overflow: visible;
        }
        /deep/ .roleList .el-tree-node__content{
        	border: solid 1px #b4b4b4;
        }
	    .outAside{
	    	background-color: #f0f0f0;
	    	position:relative;
	    	border-right: solid 1px #b4b4b4;
	    	/deep/ .current-row > td {
			   background: #FFFFFF !important;
			}
	    	/deep/ .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
			  border-color: #b4b4b4;
			}
			/deep/ .el-table--border::after, .el-table--group::after, .el-table::before{
			  background-color: #b4b4b4;
			}
            .leftAsideTitle{
            	padding: 5px 16px;
                display: flex;
                align-items: center;
                justify-content:space-between;
                span{
                	font-size: 14px;
                	color: #323232;
                }
                .el-button{
                	color:#006fe6;
                }
            }
            .leftAsideSearch{
            	padding: 0 16px 10px;
            	border: none;
            	.el-input{
            		outline: none;
            		border: none;
            		border-radius: 4px;
					border: solid 1px #969696;
            	}
            }
            .tableDiv{
            	width: calc(100% + 18px);
            	height: calc(100vh - 190px);
			    height: -webkit-calc(100vh - 190px);
			    height: -moz-calc(100vh - 190px);
	            overflow: hidden;
            }
	    	.tableDiv:hover{
				width: calc(100% + 18px);
				overflow-y: auto;
			}
			ul{
				z-index: 2;
				width: 94px;
				position:absolute;
			    display: inline-block;
			    border-bottom: solid 1px #ccc;
			    background-color: #fff;
			    li{
				    padding: 5px 10px;
				    text-align: center;
				    border: solid 1px #ccc;
				    border-bottom: none;
				    cursor: pointer;
				    font-size: 12px;
				    color: #606266;
			    }
			    li:hover{
			    	background-color: #eef1f7;
			    }
			}
	    }
        .userMessageRight_box{
            height: 100vh;
            width: 100%;
            overflow: auto;
        }
	    /deep/ .el-tree-node__content{
	    	height: 33px !important;
	    	font-size: 14px;
	    }
	    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
	    		background-color: #FFFFFF;
	    		color: #3f78f6;
	    }
        /deep/ .custom-tree-node{
            line-height: 12px;
            span{
                overflow: visible !important;
            }
        }
        .rightContainer{
        	height: calc(100vh - 96px);
		    height: -webkit-calc(100vh - 96px);
		    height: -moz-calc(100vh - 96px);
			overflow-y: auto;
    		background-color: #FFF;
    		padding: 0 0 80px;
        }
        .box-card{
        	margin: 0 40px;
		    border: solid 1px #bebebe;
		    height: 260px !important;
        }
        /deep/ .el-card__header{
    		height: 48px;
			background-color: #f0f0f0;
			border-bottom: solid 1px #bebebe;
			padding:0;
    	}
    	/deep/ .el-card__header .clearfix{
    		height: 48px;
		    padding: 0 16px;
		    display: flex;
		    justify-content: space-between;
		    align-items: center;

    	}
    	/deep/ .el-card .el-card__body{
		    height: 92px;
    	}
    	/deep/ .el-card .el-card__body div{
    		height: 56px;
    		line-height: 56px;
    		color: #323232;
    	}
	    .el-header {
	        height: 83px !important;
	        line-height: 83px;
	        background-color: #ffffff;
    		padding: 0 40px;
    		.leftHeader{
    			span{
    				font-size: 36px;
    				color: #323232;
    				width: 398px!important;
				    overflow: hidden;
				    white-space: nowrap;
				    text-overflow: ellipsis;
				    display: block;
    			}
    		}
	        .el-col.rightHeader{
	        	text-align: right !important;
	        	.addRole{
	        		margin-right: 23px;
	        		font-size: 16px;
	        		color: #2c5ac2;
	        	}
	        	.batchDel{
	        		font-size: 16px;
	        		color: #ed5151;
	        	}
	        	.el-input{
	        		margin-left: 23px;
	        		width: 200px;
	        		.el-icon-search{
	        			color: #68c161;
	        		}
	        	}
                .search{
                    position: relative;
                    left: -30px;
                    top: -2px;
                }
	        }
	    }
	    div.table-title{
        	height: 48px;
        	line-height: 48px;
        	margin: 24px 40px 0;
        	padding:0 16px;
			background-color: #FFFFFF;
			border: solid 1px #bebebe;
			border-radius: 3px 3px 0 0;
			/*border-bottom:none;*/
	        span{
            	font-weight: bold;
            	font-size: 18px;
            	margin-right: 10px;
            }
        }
        .showDesc{
        	margin: 0 40px 25px;
        	height: 92px;
        	line-height: 92px;
        	padding:0 16px;
			border: solid 1px #bebebe;
			border-top:none;
			color: #323232;
			font-size: 14px;
			border-radius: 0 0 3px 3px;
        }
	    .container {
	    	background-color: #FFFFFF;
	        height: 100%;
	        margin: 0 40px 0;
	        padding-left:22px;
    		border: solid 1px #bebebe;
    		border-top:none;
			border-radius: 0 0 3px 3px;
	        .pagination{
	        	margin:20px 0 0 22px;
	        }
	    }
	    .el-main {
	        padding: 30px;
	    }
	}
	/deep/ .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 50px!important;
}

</style>
