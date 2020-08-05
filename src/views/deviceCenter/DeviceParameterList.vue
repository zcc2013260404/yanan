<template>
    <el-container class="deviceParameterList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>参数列表</span>
                <el-button type="text" v-if="hasPermission('devicesAttrSet/insert')" icon="el-icon-plus"  style="padding-left: 10px;" @click="editParamsHandle('add')">添加参数</el-button>
            </div>
            <div class="leftAsideSearch">
                <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterDeviceParam"
				  	v-model="filterText">
				</el-input>
            </div>
            <div class="tableDiv" title="向下滑动，显示更多数据">
		  		<el-table ref="singleTable" :data="filterDeviceParameterTableData" class="table" highlight-current-row :show-header=false  :row-style="{background:'#f0f0f0'}" @row-click="handleClick">
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
		                        <p class="topP">
		                        	<img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
		                        	<span>{{scope.row.name}}</span>
		                        	<i class="iconfont leansite-shouchang rightListIcon"></i>
		                        </p>
		                        <p class="mediumP">{{scope.row.attrSetId}}</p>
		                        <p class="bottomP">{{scope.row.describe == null||scope.row.describe.length==0?'暂无数据':scope.row.describe}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
	  	<el-container class="rightContainer" v-if="!paramsAddAndEditVisble">
	        <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span>{{oChioceObject.name}}</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button type="text" v-if="hasPermission('devicesAttrSet/update')" icon="el-icon-edit" @click="editParamsHandle('edit')">编辑</el-button>
				  	<el-button type="text" v-if="hasPermission('devicesAttrSet/delete')" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>
				  </el-col>
				</el-row>
	        </el-header>
			<div class="table-title">
	        	<span>-</span>参数描述
	        </div>
	        <div class="showDesc">{{oChioceObject.describe}}</div>
	        <div class="table-title"><span>-</span>变量</div>
	        <div class="container">
	            <el-table :data="oChioceObject.attrDetails" class="table" ref="multipleTable" height="330" empty-text="暂无数据">
	            	<el-table-column prop="code" label="编码" align="center" width="240"></el-table-column>
	                <el-table-column prop="attr" label="名称" align="center" min-width="240"></el-table-column>
	                <el-table-column prop="dataType" label="字符类型"  align="center" width="240"></el-table-column>
	                <el-table-column prop="unit" label="单位" align="center" width="220"></el-table-column>
	                <!--<el-table-column prop="dataLength" label="最大字符长度" align="center" width="220"></el-table-column>-->
	            </el-table>
	        </div>
	   </el-container>
	   <el-container class="rightContainer" v-else-if="paramsAddAndEditVisble">
	   		<DeviceParameterAddAndEdit :parameterObj="oEditChioceObject" @ParameterEditCallBack="parameterEditCallBack"></DeviceParameterAddAndEdit>
	   </el-container>
	</el-container>
</template>

<script>
	import DeviceParameterAddAndEdit from "./DeviceParameterAddAndEdit.vue";
    export default {
        name: 'DeviceParameterList',//设备参数列表
        components: {
			DeviceParameterAddAndEdit
		},
        data() {
            return {
            	deviceParameterTableData:[],
				paramsAddAndEditVisble:false,//是否显示参数添加或者编辑界面
				filterDeviceParameterTableData:[],//过滤后的网络设备数据
				filterText:'',//搜索设备文本
				oChioceObject:{
					name:'暂无数据',
					describe:'暂无数据',
					attrDetails:[]
				},//表格选中的数据
				oEditChioceObject:{
					name:'暂无数据',
					describe:'暂无数据',
					attrDetails:[]
				}//表格选中的数据--编辑参数时使用
            }
        },
        created() {
			
        },
        mounted(){
			this.getDeviceParameterRequest();
        },
        methods: {
            /**
             * 监听左侧搜索文本框input事件
             */
             filterDeviceParam(){
             	if(this.filterText.length == 0){
                	this.filterDeviceParameterTableData = this.deviceParameterTableData;
                }else{
                	this.filterDeviceParameterTableData = this.deviceParameterTableData;
                	this.filterDeviceParameterTableData = this.filterDeviceParameterTableData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })
                }
            },
            /**
             * 	监听左侧表格的click事件
             */
            handleClick(row, column, event) {
		        this.oChioceObject = row;
		        this.oEditChioceObject = row;
		        this.paramsAddAndEditVisble = false;
		    },
            /**
             * 监听添加和编辑参数按钮click事件
             * @param {String} optType 操作类型 add/edit
             */
            editParamsHandle(optType){
            	if(optType == "add"){
            		this.oEditChioceObject ={};
            	}
            	this.paramsAddAndEditVisble = true;
            },
            /**
             * 监听 删除 按钮click事件
             */
            handleDelete() {
            	this.$confirm('确定删除参数：'+this.oChioceObject.name+"   ？", '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.deleteRequest(this.oChioceObject.id);//批量删除请求
		        }).catch(() => {});
            },
            /**
             * DeviceParameterAddAndEdit组件回调方法
             */
            parameterEditCallBack(isRef,oper){
            	if(isRef){
					let autoCheck = true
            		this.getDeviceParameterRequest(autoCheck,oper);
            	}
            	this.oEditChioceObject = this.oChioceObject;
            	this.paramsAddAndEditVisble = false;
            },
			/**
			 * 获取所有参数请求
			 */
			getDeviceParameterRequest(autoCheck,oper) {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDeviceParameter
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.deviceParameterTableData = resData.data;
						this.filterDeviceParameterTableData = resData.data;
						if(resData.data.length > 0){
							if(autoCheck){
								if(oper == 'modity'){
									for(let i = 0 ; i < resData.data.length ; i++){
										if(resData.data[i].id == this.oChioceObject.id){
											this.$refs.singleTable.setCurrentRow(this.filterDeviceParameterTableData[i])
											this.oChioceObject = this.filterDeviceParameterTableData[i];
											this.oEditChioceObject = this.oChioceObject;	
										}
									}
								}else{
									this.$refs.singleTable.setCurrentRow(this.filterDeviceParameterTableData[this.filterDeviceParameterTableData.length-1])
									this.oChioceObject = this.filterDeviceParameterTableData[this.filterDeviceParameterTableData.length-1];
									this.oEditChioceObject = this.oChioceObject;	
								}
								
							}else{
								this.$refs.singleTable.setCurrentRow(this.filterDeviceParameterTableData[0])
								this.oChioceObject = this.filterDeviceParameterTableData[0];
								this.oEditChioceObject = this.oChioceObject;
							}
							
						}
					} 
				});
			},
            /**
             * 删除参数请求
             */
            deleteRequest(paramsId){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteDeviceParameter,
					params:{
						id:paramsId
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: '删除参数成功！'
						});
						this.getDeviceParameterRequest();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除参数失败：'+resData.msg
						});
					}
				})
            }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .deviceParameterList {
	    height: 100%;
	    background-color: #f0f0f0;
	    .outAside{
	    	height: 100%;
            overflow: auto;
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
            	border-bottom: solid 1px #b4b4b4;
            	.el-input{
            		border-radius: 4px;
					border: solid 1px #969696;
            	}
            }
            .tableDiv{
            	width: calc(100% + 18px);
            	height: calc(100vh - 190px);
			    height: -webkit-calc(100vh - 190px);
			    height: -moz-calc(100vh - 190px);
	            overflow:hidden;
		    	.el-table{
		    		.listDiv{
		    			padding:3px 8px 5px 5px;
		    			.topP{
		    				img{
		    					width: 15px;
								height: 17px;
								vertical-align: text-top;
		    				}
		    				span{
		    					margin-left: 20px;
							    font-size: 14px;
							    width: 200px;
							    overflow: hidden !important;
							    text-overflow:ellipsis;
							    white-space: nowrap;
							    color: #323232;
							    display: inline-block;
		    				}
		    				.rightListIcon{
								margin-left: 26px;
							    font-size: 16px;
							    color: #969696;
							    vertical-align: super;
		    				}
		    			}
		    			.mediumP{
		    				padding-left: 38px;
		    				font-size: 12px;
							color: #006fe6;
							width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    			.bottomP{
		    				padding-left: 38px;
		    				font-size: 12px;
		    				color: #969696;
		    				width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    		}
		    	}
	    	}
	    	.tableDiv:hover{
				width: calc(100% + 18px);
				overflow-y: auto;
			}
	    }

        .rightContainer{
        	height: calc(100vh - 96px);
		    height: -webkit-calc(100vh - 96px);
		    height: -moz-calc(100vh - 96px);
			overflow-y: auto;
    		background-color: #FFF;
    		padding: 0 0 80px;
		    .el-header {
		        height: 83px !important;
		        line-height: 83px;
		        background-color: #ffffff;
	    		padding: 0 40px;
	    		.leftHeader{
	    			span{
						max-width: 600px;
	    				display: inline-block;
	    				font-size: 36px;
	    				color: #323232;
	    				overflow: hidden !important;
						text-overflow:ellipsis;
						white-space: nowrap;
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
		    .table-title{
	        	height: 48px;
	        	line-height: 48px;
	        	margin: 24px 40px 0;
	        	padding:0 16px;
				background-color: #FFFFFF;
				border: solid 1px #bebebe;
				border-bottom:none;
				border-radius: 3px 3px 0px 0px;
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
				border-top: none;
				color: #323232;
				font-size: 14px;
				border-radius: 0px 0px 3px 3px;
	        }
			.container {
		    	background-color: #FFFFFF;
		        height: 100%;
		        margin: 0 40px 0;
		        padding-left:22px;
	    		border: solid 1px #bebebe;
	    		border-top: none;
				border-radius: 0px 0px 3px 3px;
		        .pagination{
		        	margin:20px 0 0 22px;
		        }
		    }
        }
    }
</style>
