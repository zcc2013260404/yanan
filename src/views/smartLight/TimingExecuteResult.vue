<template>
	<div class="timingBox">
        <div class="top">
            <div>
                <span class="backMain" @click="backOpt">定时任务</span>
                <span class="el-icon-arrow-right">
                    <span></span>执行结果
                </span>
            </div>
        </div>
		<div class="listArea">
			<el-table :data="tableData" max-height="660" border empty-text="暂无数据" style="width: 100%">
				<el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
				<el-table-column prop="name" align="center" label="任务名称" width="300"></el-table-column>
				<el-table-column prop="onOff" align="center" label="执行操作" width="250">
					<template slot-scope="scope">
						<el-tag :type="scope.row.onOff == 0?'success':'warning'" effect="dark">{{scope.row.onOff == 0?'开启':'关闭'}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" align="center" label="执行时间" width="250"></el-table-column>
				<el-table-column prop="result" align="center" label="执行结果" min-width="300"></el-table-column>
			</el-table>
			<Pagination :pageIndex="pageObj.pageIndex" :total="pageObj.total" :pageSize="pageObj.pageSize" @PageTurning="PageTurning"></Pagination>
		</div>
	</div>
</template>

<script>
	import Pagination from '../../components/Pagination.vue';
	export default {
		name: 'TimingExecuteResult',//定时任务执行结果
        props:{
			timingObj:{//定时任务
				type: Object,
				required:true
			}
		},
		components: {
			Pagination
		},
		data() {
			return {
				pageObj: {
					pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
					total: 0, //数据总数
					pageSize: this.API.leansite.constObj.pageSize, //页大小
				},
				tableData: []
			}
		},
		created() {
			this.getExecuteResults();
		},
		mounted() {

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
				this.getExecuteResults();
			},
			/*
			 * 返回 
			 */
			backOpt(){
				this.$emit("TimingExecuteResultCallBack");
			},
            /**
			 * 多条件分页查询获取定时控制列表请求
			 */
			getExecuteResults() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getTaskLogByPage,
					params:{
						taskSchedulerId:this.timingObj.id,
			            pageNum: this.pageObj.pageIndex,
			            pageSize: this.pageObj.pageSize
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.tableData = resData.data.list;
						this.pageObj.total = resData.data.total;
					} 
				})
			},
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.timingBox {
		height: calc(100vh - 105px);
	    height: -webkit-calc(100vh - 105px);
	    height: -moz-calc(100vh - 105px);
	    overflow-y: auto;
		margin: 0 auto;
		padding:0;
        .top{
        	margin-bottom:20px;
            div{
                font-size: 14px;
                margin-top: 24px;
                .backMain{
                	cursor: pointer;
                }
                span{
                    color: #006fe6;
                    margin-right: 10px;
                 }
                .el-icon-arrow-right{
                    color: #969696;
                }
            }
        }
		h2{
			margin: 10px 0;
			font-size: 36px;
    		color: #323232;
    		font-weight: normal;
		}
		.el-row {
			margin-bottom: 20px;
			.el-col{
				&:last-child{
					text-align: right;
				}
			}
		}
		.table {
			width: 100%;
			.el-table {
				border-radius: 3px;
			}
		}
	}
</style>