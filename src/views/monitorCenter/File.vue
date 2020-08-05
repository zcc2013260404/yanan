<template>
	<div class="outputBox">
		<div class="event_body">
			<div class="table-title" style="overflow: hidden;display:flex;justify-content: space-between;">
				<div><span>-</span> 输出事件</div>
				<div >
					<el-button class="el-icon-download" :class="{isDown:downFLag==true}" @click="down"> 下载</el-button>
					<el-input style="width:200px" placeholder="search" prefix-icon="el-icon-search" @input="filterUser" v-model="inputSearch"></el-input>
				</div>
			</div>
			<div class="container">
				<div class="logBox">
					<el-table
						v-loading="loading" 
						ref="multipleTable" height="530" :data="filterAllUserName" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" align="center" width="75">
						</el-table-column>
						<el-table-column prop="fileName" label="文件名称" width="550">
						</el-table-column>
						<el-table-column prop="fileSize" label="大小" show-overflow-tooltip>
						</el-table-column>
					</el-table>
					<Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
				</div>
			</div>
			<div class="bottom">
				<!--<el-button type="primary" @click="down">下载</el-button>-->
			</div>
		</div>
	</div>
</template>

<script>
	import Pagination from '../../components/Pagination.vue';
	export default {
		name: 'File',
		components: {
			Pagination //分页组件
		},
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			},
		},
		data() {
			return {
				sizeForm: {
					region: '',
					date1: '',
					date2: ''
				},
				tableData: [{
						fileName: "huahua",
						fileSize: "12M"
					},
					{
						fileName: "huahua",
						fileSize: "12M"
					},
					{
						fileName: "huahua",
						fileSize: "12M"
					},
					{
						fileName: "huahua",
						fileSize: "12M"
					}
				], //表格数据
				multipleSelection: [], //监听到的点击选择了哪一行的数据 所有数据
				downFLag: false, //下载按钮的样式
				inputSearch: "", //搜索框绑定的值
				checkedFilesPath: '', //选中的文件路径集合
				filterAllUserName: [], //过滤所有日志文件名
				pageObj: {
					pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
					total: 0, //数据总数
					pageSize: this.API.leansite.constObj.pageSize, //页大小
				},
				loading: true//没有数据时的 loading
			}
		},
		mounted() {
			this.getLogFileData()
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
				this.getLogFileData();
			},
			/**
			 *下载文件 
			 */
			down() {
				let substrUrl = this.API.leansite.baseURL.substr(0, this.API.leansite.baseURL.length - 12)
				if(this.checkedFilesPath == '') {
					this.$message({
						type: 'warning',
						message: '请先选择要下载的文件！'
					});
				} else {
					this.downLogFileRequest()
				}
			},
			/**
			 *监听tab点击选择
			 */
			handleSelectionChange(val) {
				var fliePath = [];
				this.multipleSelection = val;
				this.multipleSelection.forEach((item, index) => {
					fliePath.push(item.filePath)
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
			filterUser() {
				if(this.inputSearch.length == 0) {
					this.filterAllUserName = this.tableData;
				} else {
					this.filterAllUserName = this.tableData;
					let returnObj = {};
					returnObj = this.filterAllUserName.filter((currentValue, index, arr) => {
						return currentValue.fileName.indexOf(this.inputSearch) != -1;
					})
					this.filterAllUserName = returnObj;
				}
			},
			/**
			 * 获取事件列表
			 */
			getLogFileData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getOutputList,
					params: {
						'filePath': '/data/'+this.deviceObject.tenantCode+'/'+this.deviceObject.code,
						'pageNum': this.pageObj.pageIndex,
						'pageSize': this.pageObj.pageSize
					}
				}).then((res) => {
					var resData = res.data;
					this.loading = false;
					if(resData.code == 0) {
						if(resData.data.list.length > 0) {
							this.tableData = resData.data.list
							this.filterAllUserName = resData.data.list;
						}
						this.pageObj.total = resData.data.total;
					}else if(resData.code == 1000){
						this.tableData = [];
						this.filterAllUserName = [];
						this.$message({
							type: 'error',
							message: resData.msg
						});
					}
				})
			},
			/**
			 * 下载日志文件接口
			 */
			downLogFileRequest() {
				let requestUrl = this.API.leansite.hdfsURL+'hadoop/downFile?filePath=' + this.checkedFilesPath;
				window.open(encodeURI(requestUrl));
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.outputBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		overflow: hidden;
		.event_body {
			width: 95%;
			margin: 20px auto;
			div.table-title {
				margin-top: 24px;
				height: 48px;
				line-height: 48px;
				border-radius: 3px 3px 0 0;
				/*margin: 24px 40px 0;*/
				padding: 0 16px;
				background-color: #FFFFFF;
				border: solid 1px #bebebe;
				/*border-bottom:none;*/
				.isDown {
							font-size: 14px;
							color: #006fe6;
						}
				span {
					font-weight: bold;
					font-size: 18px;
					margin-right: 10px;
				}
			}
			.container {
				border: 1px solid #bebebe;
				border-top: none;
				border-radius: 0 0 3px 3px;
				overflow: hidden;
			}
			.logBox {
				width: 99%;
				margin: 0 auto;
				/deep/ .el-table {
					min-height: 440px;
				}
			}
			.bottom {
				width: 100%;
				text-align: right;
				padding: 24px 0;
			}
		}
	}
</style>
