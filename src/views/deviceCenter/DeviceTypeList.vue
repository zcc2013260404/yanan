<template>
    <el-container class="deviceTypeList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span>类型列表</span>
                <el-button type="text" v-if="hasPermission('devicesClassify/insert')" icon="el-icon-plus"  style="padding-left: 10px;" @click="editTypeHandle('add')">添加类型</el-button>
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
		  		<el-table ref="singleTable" :data="filterDeviceTypeTableData" 
		  			class="table" highlight-current-row 
		  			:show-header=false  
		  			:row-style="{background:'#f0f0f0'}" 
		  			:row-class-name="tableRowClassName"
		  			@row-click="handleCurrentChange" >
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
	                            <p class="topP">
	                                <img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
	                                <span>{{scope.row.classifyName}}</span>
	                                <i class="iconfont leansite-shouchang rightListIcon"></i>
	                            </p>
		                        <p class="mediumP">{{scope.row.dmClassifyType?scope.row.dmClassifyType.name:'暂无数据'}}</p>
		                        <p class="bottomP">{{scope.row.describe}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
	  	<el-container class="rightContainer" v-if="!typeAddAndEditVisble">
	        <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span v-if="oChioceObject.classifyName" class="showName">{{oChioceObject.classifyName}}</span>
                    <span v-else-if="!oChioceObject.classifyName" class="showName">暂无数据</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button type="text" v-if="hasPermission('devicesClassify/update')" icon="el-icon-edit" @click="editTypeHandle('edit')">编辑</el-button>
				  	<el-button type="text" v-if="hasPermission('devicesClassify/delete')" style="font-size: 14px;" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>
				  </el-col>
				</el-row>
			</el-header>
			<div class="showOtherInfo">
				<p>参数数量：{{oChioceObject.nameCount}}</p>
			</div>
			<div class="showDevices">
				<p>
					<span>图示</span>
					<span>类型ID</span>
					<span>描述</span>
				</p>
				<p>
					<span>
						<div><img  :src="oChioceObject.imagePath?baseUrl+oChioceObject.imagePath:imgUrl" alt="设备类型图片"/></div>
					</span>
					<span>{{oChioceObject.classifyId}}</span>
					<span class="describe" >
						<span>{{oChioceObject.describe}}</span>
					</span>
				</p>
			</div>
			<div class="table-title"><span>-</span>参数</div>
			<div class="container">
				<el-table stripe :data="oChioceObject.attrSet" class="table" ref="multipleTable"  empty-text="暂无数据">
					<el-table-column prop="name" label="名称" align="center" min-width="200"></el-table-column>
					<el-table-column prop="attr" label="变量" align="center" min-width="300"></el-table-column>
				</el-table>
			</div>
		</el-container>
		<el-container class="rightContainer" v-else-if="typeAddAndEditVisble">
			<DeviceTypeAddAndEdit :typeObj="oEidtChioceObject" @TypeEditCallBack="typeEditCallBack" ></DeviceTypeAddAndEdit>
		</el-container>
	</el-container>
</template>

<script>
	import DeviceTypeAddAndEdit from "./DeviceTypeAddAndEdit";
	export default {
		name: 'DeviceTypeList', //类型类型列表
		components: {
			DeviceTypeAddAndEdit
		},
		data() {
			let baseImageUrl = this.API.leansite.baseURL;
			let substrUrl = baseImageUrl.substr(0, baseImageUrl.length - 1)
			return {
				editTempObjejct:{},
				deviceTypeTableData: [

				],
				deviceId:'',
				filterDeviceTypeTableData: [], //过滤后的网络类型数据
				filterText: '', //搜索类型文本
				oChioceObject: {
					attrSet: [],
					classifySet: {
						imagePath: ''
					}
				}, //表格选中的数据
				parameterData: [],
				typeAddAndEditVisble: false, //是否显示类型添加或者编辑界面
				typeDeviceId: "", //类型id
				imgUrl: require('../../assets/img/defaultImg.png'), //图片示例
				baseUrl: substrUrl, //截取后的图片基本路径
				oEidtChioceObject:{},
				tableCurrentLine:0,//表格的当前行
			}
		},
		created() {

		},
		mounted() {
			this.getDeviceTypeList()
		},
		methods: {
			/**
			 * 角色搜索过滤
			 */
			filterRole() {
				if(this.filterText.length == 0) {
					this.filterDeviceTypeTableData = this.deviceTypeTableData;
				} else {
					this.filterDeviceTypeTableData = this.deviceTypeTableData;
					this.filterDeviceTypeTableData = this.filterDeviceTypeTableData.filter((currentValue, index, arr) => {
						return currentValue.classifyName.indexOf(this.filterText) != -1;
					})
				}
			},
			/**
			 * 添加或者编辑设备信息
			 * @param {String} optType 操作类型 add/edit
			 */
			editTypeHandle(optType) {

				if(optType == "add") {
					this.oEidtChioceObject = {};
				}
				this.typeAddAndEditVisble = true;
			},
			/**
			 * 删除角色
			 */
			handleDelete() {
				this.$confirm('确定删除该类型', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRequest(this.typeDeviceId); //批量删除请求
				}).catch(() => {});
			},
			/**
			 * 	当表格的当前行发生变化的时候会触发该事件
			 */
			tableRowClassName ({row, rowIndex}) {
		        //把每一行的索引放进row
		        row.index = rowIndex;
		      },
		      
			handleCurrentChange(currentRow, oldCurrentRow) {
				this.tableCurrentLine = currentRow.index
				this.oChioceObject = currentRow;
				this.oEidtChioceObject = currentRow;
				this.typeDeviceId = currentRow.id;
				this.typeAddAndEditVisble = false;
			},
			/*
			 * 用户信息组件回调方法--子组件回调数据的方法
			 * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
			 */
			typeEditCallBack(isRefresh) {
				this.typeAddAndEditVisble = false;
				this.editTempObjejct = this.oChioceObject
				this.oEidtChioceObject= this.oChioceObject
				// this.roleWebVisible = false;
				if(isRefresh) {

					this.getDeviceTypeList(true);
				}
			},
			/*
			 * 获取类型管理数据列表
			 */
			getDeviceTypeList(autoSelect) {
				if(autoSelect){
					this.deviceId = this.oChioceObject.id
				}else{
					this.deviceId = ''
				}
				
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDeviceTypeList,
					params: {}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						setTimeout(() => {
							this.filterDeviceTypeTableData = this.deviceTypeTableData;

							let selectStatus = false
							for(let i = 0 ; i < this.deviceTypeTableData.length ; i++){
								if(this.deviceTypeTableData[i].id == this.deviceId){
									this.$refs.singleTable.setCurrentRow(this.filterDeviceTypeTableData[i])
									selectStatus = true
									break;
								}
							}
							if(!selectStatus){
								this.$refs.singleTable.setCurrentRow(this.filterDeviceTypeTableData[0])
							};
						}, 1);
						this.deviceTypeTableData = resData.data;
						if(this.deviceTypeTableData.length > 0) {
							if(this.deviceId != ''){
								for(let i = 0 ; i < this.deviceTypeTableData.length ; i++){
									if(this.deviceTypeTableData[i].id == this.deviceId){
										this.oChioceObject = this.deviceTypeTableData[i]
										this.oEidtChioceObject = this.oChioceObject;
										this.typeDeviceId = this.deviceTypeTableData[i].id
										break;
									}
								}
							}else{
								this.oChioceObject = this.deviceTypeTableData[0]
								this.oEidtChioceObject = this.oChioceObject;
								this.typeDeviceId = this.deviceTypeTableData[0].id
							}
						}
					}
				})
			},
			/**
			 * 批量删除请求
			 */
			deleteRequest(delTypeText) {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteDevicesTypeById,
					params: {
						id: delTypeText
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: '删除成功！'
						});
						this.getDeviceTypeList();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除失败：' + resData.msg
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.deviceTypeList {
		height: 100%;
		background-color: #f0f0f0;
		.outAside {
			height: 100%;
			overflow: auto;
			background-color: #f0f0f0;
			position: relative;
			border-right: solid 1px #b4b4b4;
			/deep/ .current-row>td {
				background: #FFFFFF !important;
			}
			/deep/ .el-table td,
			.el-table th.is-leaf,
			.el-table--border,
			.el-table--group {
				border-color: #b4b4b4;
			}
			/deep/ .el-table--border::after,
			.el-table--group::after,
			.el-table::before {
				background-color: #b4b4b4;
			}
			.leftAsideTitle {
				padding: 5px 16px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				span {
					font-size: 14px;
					color: #323232;
				}
				.el-button {
					color: #006fe6;
				}
			}
			.leftAsideSearch {
				padding: 0 16px 10px;
				border-bottom: solid 1px #b4b4b4;
				.el-input {
					border-radius: 4px;
					border: solid 1px #969696;
				}
			}
			.tableDiv {
				width: calc(100% + 18px);
				height: calc(100vh - 190px);
				height: -webkit-calc(100vh - 190px);
				height: -moz-calc(100vh - 190px);
				overflow: hidden;
				.el-table {
					.listDiv {
						padding: 3px 8px 5px 5px;
						.topP {
							.leftListIcon {
								font-size: 15px;
								color: #969696;
							}
							span {
								margin-left: 20px;
								font-size: 14px;
								width: 200px;
								overflow: hidden !important;
								text-overflow: ellipsis;
								white-space: nowrap;
								color: #323232;
								display: inline-block;
							}
							.rightListIcon {
								margin-left: 27px;
								font-size: 15px;
								color: #969696;
							}
						}
						.mediumP {
							padding-left: 38px;
							font-size: 12px;
							color: #006fe6;
							width: 200px;
							overflow: hidden !important;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.bottomP {
							padding-left: 38px;
							font-size: 12px;
							color: #969696;
							width: 200px;
							overflow: hidden !important;
							text-overflow: ellipsis;
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
		.rightContainer {
			width: 90%;
			margin-bottom: 30px;
			overflow: hidden;
			/*min-height: 640px;*/
			height: 90vh;
			overflow: auto;
			background-color: #FFF;
			.el-header {
				height: 83px !important;
				line-height: 83px;
				background-color: #ffffff;
				padding: 0 40px;
				.leftHeader {
					display: flex;
					.showName {
						max-width: 600px;
						display: inline-block;
						font-size: 36px;
						color: #323232;
						overflow: hidden !important;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.el-col.rightHeader {
					text-align: right !important;
					.addRole {
						margin-right: 23px;
						font-size: 16px;
						color: #2c5ac2;
					}
					.batchDel {
						font-size: 16px;
						color: #ed5151;
					}
					.el-input {
						margin-left: 23px;
						width: 200px;
						.el-icon-search {
							color: #68c161;
						}
					}
					.search {
						position: relative;
						left: -30px;
						top: -2px;
					}
				}
			}
			.showOtherInfo {
				font-size: 14px;
				color: #969696;
				padding: 0 40px;
				p:first-child {
					margin-bottom: 12px;
				}
				p:last-child {
					max-width: 600px;
					overflow: hidden !important;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.showDevices {
				margin-top: 25px;
				padding: 0 40px;
				
				p {
					border: solid 1px #bebebe;
					display: flex;
					justify-content: space-evenly;
					span {
						font-size: 14px;
						color: #323232;
						border-right: solid 1px #bebebe;
						display: inline-block;
						text-align: center;
						width: 33.33%;
						// overflow: hidden !important;
						// text-overflow: ellipsis;
						// white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
					}
					.describe{
  						word-break: break-all;
						text-align:center;
						line-height:2;
  						word-wrap: break-word;
						overflow: hidden !important;
						span{
							width:90%;
							margin:10px auto;
							overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						}
						// min-width:277px; 
					}
					span:last-child {
						border-right: none;
					}
					img {
						width: 80%;
						height: 82px;
					}
				}
				p:first-child {
					height: 48px;
					line-height: 48px;
					/*background-color: #f0f0f0;*/
					border-radius: 3px 3px 0 0;
				}
				p:last-child {
					border-top: none;
					height: 92px;
					line-height: 92px;
					background-color: #FFFFFF;
					border-radius:0 0 3px 3px;
				}
			}
			.table-title {
				height: 48px;
				line-height: 48px;
				margin: 24px 40px 0;
				padding: 0 16px;
				/*background-color: #f0f0f0;*/
				border: solid 1px #bebebe;
				border-bottom: none;
				border-radius: 3px 3px 0 0;
				/*display: flex;*/
				/*justify-content: space-between;*/
		        span{
	            	font-weight: bold;
	            	font-size: 18px;
	            	margin-right: 10px;
	            }
			}
			.container {
				background-color: #FFFFFF;
				/*height: 100%;*/
				margin: 0 40px 0;
				padding-left: 22px;
				border: solid 1px #bebebe;
				border-radius: 0 0 3px 3px;
				.pagination {
					margin: 20px 0 0 22px;
				}
			}
		}
	}
</style>