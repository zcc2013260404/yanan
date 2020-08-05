<template>
    <el-container class="relationDeviceList">
	  	<el-aside class="outAside" width="320px">
            <div class="leftAsideTitle">
                <span style="display: inline-block;height: 40px;line-height: 40px">配置列表</span>
<!--                <el-button type="text" v-if="hasPermission('productNet/insert')" icon="el-icon-plus"  style="padding-left: 10px;" @click="editHandle('add')">添加配置</el-button>-->
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
		  		<el-table ref="singleTable" :data="filterRelationDeviceTableData" class="table" highlight-current-row :show-header=false  :row-style="{background:'#f0f0f0'}" @row-click="handleCurrentChange">
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
	                            <p class="topP">
	                                <img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
	                                <span>{{scope.row.name}}</span>
	                                <i class="iconfont leansite-shouchang rightListIcon"></i>
	                            </p>
		                        <p class="mediumP">{{scope.row.license}}</p>
		                        <p class="bottomP">{{scope.row.note == null||scope.row.note.length==0?'暂无数据':scope.row.note}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
            </div>
	  	</el-aside>
	  	<el-container class="rightContainer"  v-if="!relationAddAndEditVisble">
	        <el-header>
	        	<el-row>
				  <el-col :span="16" class="leftHeader">
				  	<span v-if="oChioceObject.name" class="showName">{{oChioceObject.name}}</span>
                      <span v-else-if="!oChioceObject.name" class="showName">暂无数据</span>
				  </el-col>
				  <el-col :span="8" class="rightHeader">
				  	<el-button type="text" style="display: inline-block" v-if="hasPermission('productNet/update')" icon="el-icon-edit" @click="editHandle('edit')">编辑</el-button>
				  	<!--<el-button type="text" style="display: inline-block" v-if="hasPermission('productNet/delete')" icon="el-icon-delete" class="batchDel" @click="handleDelete">删除</el-button>-->
				  </el-col>
				</el-row>
			</el-header>
			<div class="showOtherInfo">
				<p>{{oChioceObject.desc}}</p>
			</div>
			<div class="table-title"> - 网络设备</div>
			<div class="container">
				<el-table stripe :data="oChioceObject.netDevicesList" class="table" ref="multipleTable" height="330" empty-text="暂无数据">
					<el-table-column prop="name" label="网络设备名称" align="left" min-width="200"></el-table-column>
					<el-table-column prop="license" label="SN码" align="left" min-width="200"></el-table-column>
				</el-table>
			</div>
			<div v-if="(deviceType=='2'||deviceType=='3'||deviceType=='4')">
				<div class="table-title"> - 工业设备</div>
				<div class="container">
					<el-table stripe :data="oChioceObject.productDevicesList" class="table" ref="multipleTable" height="330" empty-text="暂无数据">
						<el-table-column prop="name" label="工业资产名称" align="left" min-width="200"></el-table-column>
					</el-table>
				</div>
			</div>
		</el-container>

		<el-container class="rightContainer" v-else-if="relationAddAndEditVisble">
			<RelationDeviceListAddAndEdit :typeObj="oChioceObject" @RelationEditCallBack=relationEditCallBack></RelationDeviceListAddAndEdit>
		</el-container>
	</el-container>
</template>

<script>
	import RelationDeviceListAddAndEdit from "./RelationDeviceListAddAndEdit";
	export default {
		name: 'RelationDeviceList', //关联配置列表
		components: {
			RelationDeviceListAddAndEdit
		},
		data() {
			return {
				deviceId:'',
				relationDeviceTableData: [],
				filterRelationDeviceTableData: [], //过滤后的网络类型数据
				filterText: '', //搜索类型文本
				oChioceObject: {}, //表格选中的数据
				relationAddAndEditVisble: false, //关联配置添加或者编辑
				networkDeviceData: [], //网络设备
				industrialDeviceData: [], //工业设备
				deviceType: '', //设备类型  1是大数据一体机   2 ，3 ，4 是BI控制器
				deviceId: '', //设备Id
				deviceName: '', //设备姓名
			}
		},
		created() {

		},
		mounted() {
			this.getNetworkDeviceRequest()
		},
		methods: {
			/**
			 * 角色搜索过滤
			 */
			filterRole() {
				if(this.filterText.length == 0) {
					this.filterRelationDeviceTableData = this.relationDeviceTableData;
				} else {
					this.filterRelationDeviceTableData = this.relationDeviceTableData;
					this.filterRelationDeviceTableData = this.filterRelationDeviceTableData.filter((currentValue, index, arr) => {
						return currentValue.name.indexOf(this.filterText) != -1;
					})
				}
			},
			/**
			 * 	当表格的当前行发生变化的时候会触发该事件
			 */
			handleCurrentChange(currentRow, oldCurrentRow) {
				this.oChioceObject = currentRow;
				this.deviceType = currentRow.typeId;
				this.deviceId = currentRow.id;
				this.deviceName = currentRow.name;
				this.relationAddAndEditVisble = false;
			},
			/**
			 * 编辑设备信息
			 */
			editHandle() {
				this.relationAddAndEditVisble = true;
			},
			/**
			 * 删除角色
			 */
			handleDelete() {
				this.$confirm('确定删除该角色', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteRelationRequest(); //批量删除请求
				}).catch(() => {});
			},
			/**
			 * 删除角色接口
			 */
			deleteRelationRequest() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteDevicesTypeById,
					params: {
						id: this.deviceId
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.relationDeviceTableData = resData.data;
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除设备失败：'+resData.msg
						});
					}
				})
			},
			/**
			 * 获取所有网络设备请求
			 */
			getNetworkDeviceRequest(autoSelect) {
				if(autoSelect){
					this.deviceId = this.oChioceObject.id
				}else{
					this.deviceId = ''
				}

				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getNetworkDevice
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.relationDeviceTableData = resData.data;
						if(autoSelect){
							for(let i = 0 ; i< this.relationDeviceTableData.length ; i++){
								if(this.deviceId == this.relationDeviceTableData[i].id){
									this.oChioceObject = resData.data[i]
									this.filterRelationDeviceTableData = this.relationDeviceTableData;
									this.$refs.singleTable.setCurrentRow(this.filterRelationDeviceTableData[i])
								}
							}
						}else{
							this.oChioceObject = resData.data[0]
							this.filterRelationDeviceTableData = this.relationDeviceTableData;
							this.$refs.singleTable.setCurrentRow(this.filterRelationDeviceTableData[0])
						}
						
						
					} 
				})
			},
			/*
			 * 用户信息组件回调方法--子组件回调数据的方法
			 * @param {Boolean} isRefresh是否需要刷新数据 true=刷新；false=不刷新
			 */
			relationEditCallBack(isRefresh) {
				this.relationAddAndEditVisble = false;
				// this.roleWebVisible = false;
				if(isRefresh) {
					// this.pageObj.pageIndex = this.API.leansite.constObj.pageIndex;
					this.getNetworkDeviceRequest(true);
				}
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.relationDeviceList {
		height: 100%;
		background-color: #f0f0f0;
		.outAside {
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
			height: 90vh;
			overflow: hidden;
			/*min-height: 640px;*/
			margin-bottom: 50px;
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
				p {
					max-width: 600px;
					overflow: hidden !important;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.showDevices {
				margin-top: 23px;
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
					}
					span:last-child {
						border-right: none;
					}
					img {
						width: 248px;
						height: 91px;
					}
				}
				p:first-child {
					height: 48px;
					line-height: 48px;
					background-color: #f0f0f0;
				}
				p:last-child {
					border-top: none;
					height: 92px;
					line-height: 92px;
					background-color: #FFFFFF;
				}
			}
			.table-title {
				height: 48px;
				line-height: 48px;
				margin: 24px 40px 0;
				padding: 0 16px;
				/*background-color: #f0f0f0;*/
				border: solid 1px #bebebe;
				/*border-bottom: none;*/
				display: flex;
				justify-content: space-between;
				border-radius: 3px 3px 0 0;
			}
			.container {
				background-color: #FFFFFF;
				height: 100%;
				margin: 0 40px 0;
				padding-left: 22px;
				border: solid 1px #bebebe;
				border-top: none;
				border-radius: 0 0 3px 3px;
				.pagination {
					margin: 20px 0 0 22px;
				}
			}
		}
	}
</style>