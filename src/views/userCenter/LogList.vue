<template>
	<div class="logBox">
		<div class="logBox_header">
			<div class="logBox_header_left"><span>活动日志</span></div>
			<div class="logBox_header_right">
				<el-button class="el-icon-download" :class="{isDown:downFLag==true}" @click="down" v-if="hasPermission('sysLog/downZipFile')"> 下载</el-button>
				<el-input placeholder="search" prefix-icon="el-icon-search" @input="filterUser" v-model="inputSearch" >
				</el-input>
			</div>
		</div>
		<el-table height="600" ref="multipleTable" :data="filterAllUserName" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center" width="75">
			</el-table-column>
			<el-table-column prop="fileName" label="文件名称" width="550">
			</el-table-column>
			<el-table-column prop="fileSize" label="大小" show-overflow-tooltip>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>

	export default {
		name: 'LogList',
		components: {
		},
		props: {
	        
	    },
		data() {
			return {
				tableData: [],//表格数据
				multipleSelection: [], //监听到的点击选择了哪一行的数据 所有数据
				downFLag: false, //下载按钮的样式
				inputSearch: "", //搜索框绑定的值
				checkedFilesPath:'',//选中的文件路径集合
				filterAllUserName:[],//过滤所有日志文件名
			}
		},
		created() {

		},
		mounted() {
				this.getLogFileData()
		},
		methods: {
			/**
			 *下载文件 
			 */
			down() {
				if(this.checkedFilesPath==''){
					this.$message({
	                        type: 'warning',
	                        message: '请先选择要下载的文件！'
	                    });
				}else{
					this.downLogFileRequest()
				}
			},
			/**
			 *监听tab点击选择
			 */
			handleSelectionChange(val) {
				var fliePath = [];
				this.multipleSelection = val;
				this.multipleSelection.forEach((item,index)=>{
					fliePath.push(item.fileName)
				})
				this.checkedFilesPath = fliePath.toString()
				if(val.length > 0) {
					this.downFLag = true;
				} else {
					this.downFLag = false
				}
			},
			/**
             * 用户搜索过滤
             */
             filterUser(){
             	if(this.inputSearch.length == 0){
                	this.filterAllUserName = this.tableData;
                }else{
                	this.filterAllUserName = this.tableData;
                	let returnObj={};
                		returnObj = this.filterAllUserName.filter((currentValue,index,arr)=>{
		                	return currentValue.fileName.indexOf(this.inputSearch) !=-1;
		                })
                	this.filterAllUserName = returnObj;
                }
            },
			/**
	         * 获取列表数据
	         */
	        getLogFileData() {
	            this.$axios.leansite({
	                method: 'get',
	                url: this.API.leansite.getLogFile,
	            }).then((res) => {
	                var resData = res.data;
	                if (resData.code == 0) {
	                	if(resData.data.length>0){
	                		this.tableData = resData.data
	                		this.filterAllUserName = resData.data;

	                	}
	                } 
	            })
	        },
	        /**
	         * 下载日志文件接口
	         */
	        downLogFileRequest() {
	        	let requestUrl = this.API.leansite.baseURL+'logFile/downZipFile?fileName='+this.checkedFilesPath;
	        	window.open(requestUrl);
	        },
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.logBox {
		width: 94%;
		margin: 0 auto;
		height:900px;
		overflow-y:auto;
		.logBox_header {
			display: flex;
			justify-content: space-between;
			margin: 24px 0 35px;
			.logBox_header_left {
				font-size: 36px;
				color: #323232;
			}
			.logBox_header_right {
				display: flex;
				.el-button {
					// border: none;
					margin:0 10px 7px 0;
					height:36px;
				}
				// .el-input{
				// 	width: 201px;
				// 	height: 32px;
				// 	line-height: 32px;
				// 	border-radius: 4px;
				// 	border: solid 1px #969696;
				// 	/deep/ .el-input__inner {
				// 	    height: 32px;
				// 	    line-height: 32px;
				// 	}
				// }
				.isDown {
					font-size: 14px;
					color: #006fe6;
				}
				.nothing {
					font-size: 14px;
					color: #969696;
				}
			}
		}
		/deep/ .el-table {
			margin-bottom50px
			/deep/ .el-pagination {
				margin-top: 30px!important;
				text-align: center;
				
			}
		}
	}
</style>