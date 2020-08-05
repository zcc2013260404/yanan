<template>
    <el-container class="deptList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>组织架构列表</span>
                <el-button type="text" v-if="hasPermission('org/insertFactory')" icon="el-icon-plus" @click="addDept" style="padding-left: 10px;">添加集团</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	v-model="filterText">
				</el-input>
            </div>
	  		<el-tree
	  		  ref="orgTree"
		      :data="aDeptDatas.children"
		      node-key="id"
		      :props="defaultProps"
		      highlight-current
		      :indent="10"
		      @node-click="treeClick"
			  :default-expanded-keys="defaultExpandedKeys"
		      :filter-node-method="filterNode"
		      :expand-on-click-node="false">
		       <span class="custom-tree-node" slot-scope="{ node, data }"  style="padding-right:10px;">
		        <i :class="node.level == 1?'iconfont leansite-zuzhijiagou':'el-icon-folder'" ></i>
		        <span style="display:inline-block;margin-left:5px;width: 220px;overflow: hidden !important;text-overflow:ellipsis;white-space: nowrap;" :title="node.label">{{ node.label }} （{{data.staffNum}}）人</span>
		      </span>
		   </el-tree>
	  	</el-aside>
	  	<div class="rightContainer_box">
		  	<el-container class="rightContainer">
		        <el-header>
		        	<el-row >
					  <el-col :span="16" class="leftHeader" >
					  	<span :title="oChioceDept.title">{{oChioceDept.title}}</span>
					  </el-col>
					  <el-col :span="8" class="rightHeader" >
					  	<el-button type="text" v-if="hasPermission('org/update')" icon="el-icon-edit" class="addUser" @click="editDeptHandle">编辑</el-button>
					  	<el-button type="text" v-if="hasPermission('org/delete')" icon="el-icon-delete" class="batchDel" @click="delDeptHandle">删除</el-button>
					  </el-col>
					</el-row>
		        </el-header>
		        <div class="table-title">
		        	<div><span>-</span>下级分类</div>
				    <el-button  type="text" icon="el-icon-plus" v-if="hasPermission('org/insertDept')" @click="addChildDeptHandle" >添加下级</el-button>
		        </div>
		        <div class="dptList">
				  <div v-for="o in childData" :key="'child'+o" class="text item">
				    {{ o.title }} （{{o.staffNum}}）人
				  </div>
				</div>
				<div class="table-title"><div><span>-</span>用户</div></div>
		        <div class="container">
		            <el-table :data="tableData" class="table" ref="multipleTable" height="300" empty-text="暂无数据">
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
	import Pagination from '../../components/Pagination.vue';
    export default {
        name: 'DeptList',//部门管理列表
        components: {
			Pagination //分页组件
		},
        data() {
            return {
				expandList:[],
            	aDeptDatas:{},//组织架构数据
		        defaultProps: {//tree与data字段映射
		          children: 'children',
		          label: 'title',
		          id:'id'
		        },
		        filterText:'',//组织架构筛选
                tableData: [],//用户列表数据
                multipleSelection: [],//选中项
				defaultExpandedKeys:[],
                pageObj: {
					pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
					total: 0, //数据总数
					pageSize: this.API.leansite.constObj.pageSize, //页大小
				},
				childData:[],//下级组织
				oChioceDept:{
					title:'暂无数据'
				},//选中的部门
				deptId:'',//选中的部门id
				searchText:'',//搜索字段
            }
        },
	    watch: {
	      filterText(val) {
	        this.$refs.orgTree.filter(val);
	      }
	    },
        created() {
        	this.getDeptData();//获取部门数据
        },
        mounted(){
			
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
				this.getData();
			},
			/**
			 * 部门树过滤搜索 
			 */
			filterNode(value, data) {
		        if (!value) return true;
		        return data.title.indexOf(value) !== -1;
		   },
			/**
			 * 部门树点击事件
			 */
			treeClick(nodeObj,nodes,nodeSelf){
				if(nodeObj.hasChildren){
					this.childData = nodeObj.children;
				}else{
					this.childData = [];
				}
				this.oChioceDept = nodeObj;
                this.deptId = nodeObj.id;
                this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
			    this.getData();
			},
			/**
			 * 新增集团
			 */
			addDept(){
				this.$prompt('请输入集团名称', '新增集团', {
		          confirmButtonText: '确定',
                  cancelButtonText: '取消',
				  closeOnClickModal:false,
                  inputValidator:function(val){
                  	let reg =  /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/;
                  	if(!reg.test(val.trim())){
                  		return "集团名称必须是汉字、字母或数字组成的2~20位字符"
                  	}
                  },
		          inputPlaceholder:"请输入集团名称(汉字、字母或数字组成的2~20位字符)"
		        }).then(({ value }) => {
		          this.addAndEditDeptRequest({parentId:this.aDeptDatas.id,name:value.trim(),isChild:false});
		        }).catch(() => {});
			},
			/**
			 * 新增部门请求
			 */
			addAndEditDeptRequest(oDept){
				let oOrg={};
				let sMsg = "添加";
				let oper = 'add'
				if(oDept.id){
					sMsg = "编辑";
					oper = 'modity'
					oOrg = {
						'parentId':oDept.parentId,
						'id':oDept.id,
						'name':oDept.name,
					};
				}else{
					oOrg = {
						'parentId':oDept.parentId,
						'name':oDept.name
					};
				}

				if(oDept.isChild){
					//如果是添加下级部门
					oper = 'appendChild'
				}

				this.$axios.leansite({
					method: 'post',
					url: this.API.leansite.addAndEditDept,
					data:oOrg
				}).then((res) => {
					let resData = res.data
					let currentKey = this.$refs.orgTree.getCurrentKey()
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: oDept.isChild==false?sMsg+'集团成功!':sMsg+'部门成功!'
						});
						this.filterText = ''
						this.getDeptData(oper,currentKey);//获取部门数据
					}  else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: oDept.isChild==false?sMsg+'集团失败：'+resData.msg:sMsg+'部门失败：'+resData.msg
						});
					}
				})
           },
            //获取首个部门
            getFirstDept(arr) {
            	if(arr.length > 0){
	                for(let i = 0;i < arr.length;i++ ){
	                    if(arr[i].hasChildren){
	                        this.getFirstDept(arr[i].children);
	                        return;
	                    }else{
	                        this.deptId = arr[i].id;
	                        this.$nextTick(()=>{
	                        	this.$refs.orgTree.setCurrentKey(this.deptId);	
	                        });
	                        this.getData();
	                        break;
	                    }
	                }
                }else{
                	this.deptId = null;
	                this.tableData = [];
                }
            },
			getParent(node) {
				if(node.parent == null){
					this.expandList.push(node.id)
					return
				}
				this.expandList.push(node.id)
				node.expanded = true
				this.getParent(node.parent)
			},
			/**
			 * 获取部门数据
			 */
			getDeptData(oper,currentKey) {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDepts,
				}).then((res) => {
					let resData = res.data;
					if(resData.code == 0) {
                        this.aDeptDatas = resData.data;
                        if(this.aDeptDatas.hasChildren){
                        	this.oChioceDept =  resData.data.children[0];
                        	this.childData = resData.data.children[0].children;
                        	this.deptId = this.oChioceDept.id;
                        }else{
                        	this.childData = [];
                        	this.oChioceDept = this.aDeptDatas; 
                            this.deptId = this.aDeptDatas.id;
                        }
                        
						if(undefined == oper){
							this.getData();
						}

                        this.$nextTick(()=>{
							if(oper == 'add'){	
								this.$refs.orgTree.setCurrentKey(this.aDeptDatas.children[this.aDeptDatas.children.length-1].id)
								let currentNode = this.$refs.orgTree.getCurrentNode()
								this.treeClick(currentNode,null,null)
							}else if(oper == 'modity' && currentKey != undefined){	
								this.$refs.orgTree.setCurrentKey(currentKey)
								let currentNode = this.$refs.orgTree.getCurrentNode()
								this.treeClick(currentNode,null,null)
							}else if(oper == 'appendChild' && currentKey != undefined){
								this.$refs.orgTree.setCurrentKey(currentKey);
								this.$nextTick(()=>{
									let currentNode = this.$refs.orgTree.getNode(currentKey)
									this.getParent(currentNode)
									//default-expanded-keys
									
									currentNode.expanded = true
									setTimeout(() => {
										this.treeClick(this.$refs.orgTree.getCurrentNode(),null,null)
									}, 10);
								})
							}else{
								this.$refs.orgTree.setCurrentKey(this.oChioceDept.id);	
							}
			            });
					} 
				})
			},
			/**
			 * 根据部门id获取人员数据
			 */
			getData(paramDeptID) {
				let deptId = this.deptId
				if(undefined != paramDeptID){
					deptId = paramDeptID
				}
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getUserByDeptId,
					params: {
						'orgId': deptId,
						'pageNum': this.pageObj.pageIndex,
						'pageSize': this.pageObj.pageSize
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.tableData = resData.data.list;
						this.pageObj.total = resData.data.total;
					} 
				})
			},

			/**
			 * 按回车键搜索
			 */
            searchEnterFun(e){
			   var keyCode = window.event? e.keyCode:e.which;
			   if(keyCode == 13){
			   		this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
					this.getData();
			   }
			},
			/**
			 * 点击搜索
			 */
            clickSearch(e){
		   		this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
				this.getData();
			},
            
            /**
             * 多选
             */
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            /**
             * 新增下级部门
             */
			addChildDeptHandle() {
				this.$prompt('请输入部门名称', '添加下级部门', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
				  closeOnClickModal:false,
                  inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/,
		          inputPlaceholder:"请输入部门名称(汉字、字母或数字组成的2~20位字符)",
		          inputErrorMessage: '部门名称必须是汉字、字母或数字组成的2~20位字符'
		        }).then(({ value }) => {
		          this.addAndEditDeptRequest({parentId:this.oChioceDept.id,name:value.trim(),isChild:true});
		        }).catch(() => {});
		    },
            /**
             * 编辑集团
             */
			editDeptHandle() {
				this.$prompt(this.oChioceDept.parentId==0?'请输入集团名称':'请输入部门名称', this.oChioceDept.parentId==0?'编辑集团':'编辑部门', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
				  closeOnClickModal:false,
                  inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/,
                  inputValue:this.oChioceDept.title,
                  inputPlaceholder:this.oChioceDept.parentId==0?"请输入集团名称(汉字、字母或数字组成的2~20位字符)":"请输入部门名称(汉字、字母或数字组成的2~20位字符)",
		          inputErrorMessage: this.oChioceDept.parentId==0?'集团名称必须是汉字、字母或数字组成的2~20位字符':'部门名称必须是汉字、字母或数字组成的2~20位字符'
		        }).then(({ value }) => {
		          this.addAndEditDeptRequest({parentId:this.oChioceDept.parentId,id:this.oChioceDept.id,name:value.trim(),isChild:false});
		        }).catch(() => {});
		    },
			/**
			 * 删除部门
			 */
	        delDeptHandle() {
				console.log(this.oChioceDept)
            	this.$confirm(this.oChioceDept.parentId==0?'确定删除集团：':'确定删除部门：'+this.oChioceDept.title, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          closeOnClickModal:false,
		          type: 'warning'
		        }).then(() => {
	                this.delDeptRequest();
				}).catch(() => {});
	     	},
	     	/**
			 * 删除部门请求
			 */
	     	delDeptRequest(){
	     		this.$axios.leansite({
						method: 'get',
						url: this.API.leansite.delDept,
						params:{
							id:this.oChioceDept.id
						}
					}).then((res) => {
						var resData = res.data;
						if(resData.code == 0) {
							this.$message({
								type: 'success',
								message: this.oChioceDept.parentId==0?'删除集团成功!':'删除部门成功!'
							});
							this.getDeptData();
						} else if(resData.code == 1000) {
							this.$message({
								type: 'error',
								message: this.oChioceDept.parentId==0?'删除集团失败：'+ resData.msg:'删除部门失败：'+ resData.msg
							});
						}
					})
	     	}
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .deptList {
	    height: 100%;
	    background-color: #f0f0f0;
        /deep/ .el-tree-node>.el-tree-node__children{
            overflow: visible;
        }
        /deep/ .deptList .el-tree-node__content{
        	border: solid 1px #b4b4b4;
        }
	    .outAside{
            overflow: auto;
	    	background-color: #f0f0f0;
	    	position:relative;
	    	border-right: solid 1px #b4b4b4;
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
            	.el-input{
            		border-radius: 4px;
					border: solid 1px #969696;
            	}
            }
	    	.el-tree{
	    		width: 320px;
			    height: calc(100vh - 191px);
			    height: -webkit-calc(100vh - 191px);
			    height: -moz-calc(100vh - 191px);
            	overflow: auto;
			    background-color: #f0f0f0;
			    border-top: solid 1px #969696;
			    overflow-y: auto;
				.custom-tree-node {
				    line-height: 14px;
				}
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
        .rightContainer_box{
        	height: 100vh;
        	width: calc(100% - 320px);
        	width:-webkit-calc(100% - 320px);
        	width: -moz-calc(100% - 320px);
        	background: #fff;
        }
        .rightContainer{
    		overflow: hidden;
    		min-height: 640px;
    		background-color: #FFF;
        }
        
        .box-card{
        	margin: 0 40px;
        	border: solid 1px #bebebe;
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
    		padding: 0 20px;
		    height: 327px;
		    overflow-y: scroll;
    	}
    	/deep/ .el-card .el-card__body div{
    		height: 56px;
    		line-height: 56px;
    		color: #323232;
    		border-bottom: solid 1px #969696;
    		
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
				    cursor: pointer;
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
        	margin: 0 40px;
        	padding:0 16px;
			background-color: #FFFFFF;
			border: solid 1px #bebebe;
			/*border-bottom:none;*/
			display: flex;
			justify-content: space-between;
			border-radius: 3px 3px 0 0 !important;
	        span{
            	font-weight: bold;
            	font-size: 18px;
            	margin-right: 10px;
            }
        }
        .dptList{
        	margin: 0 40px 25px;
        	height: 228px;
        	padding:0 16px;
			border: solid 1px #bebebe;
			border-top: none;
			overflow-y: auto;
			border-radius: 0px 0px 3px 3px !important;
        	div{
        		font-size: 14px;
				color: #323232;
        		height: 57px;
        		line-height: 57px;
        		border-bottom: solid 1px #969696;
        	}
        	div:last-child{
        		border-bottom:none;
        	}
        }
	    .container {
        	border-radius: 0 0 3px 3px;
	    	background-color: #FFFFFF;
	        height: 100%;
	        margin: 0 40px 0;
	        padding-left:22px;
    		border: solid 1px #bebebe;
			border-top: none;
	        .pagination{
	        	margin:20px 0 0 22px;
	        }
	    }
	    .el-main {
	        padding: 30px;
	    }
	    .el-dialog{
	    	background-color: #ffffff;
			box-shadow: 0px 1px 20px 0px
				rgba(0, 0, 0, 0.2);
			border-radius: 16px;
			 /deep/ .el-dialog__header{
				padding: 12px 40px;
				border-bottom: 1px solid #d9e3f3;
			}
	    }
	}
	/deep/ .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 50px!important;
}
/deep/ .deptList div.table-title[data-v-57c832b0] {
	border-radius: 3px 3px 0 0!important;
}

</style>
