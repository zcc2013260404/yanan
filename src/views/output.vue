<template>
	<div class="outputBox">
		
		<div class="event_body">
			<h1>数据更新</h1>
			<div class="container_header">
				<el-button type="primary" @click="dataSync">同步数据</el-button>
			</div>
			<div class="table-title" style="overflow: hidden;"><span>-</span> 更新数据</div>
			<div class="container">
				<div class="logBox">
					<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" min-height='500' >
						<el-table-column prop="fileName" label="文件名称" width="420" >
						</el-table-column>
						<el-table-column prop="fileSize" label="大小" show-overflow-tooltip>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'output',
		components: {
			// EditableCell
		},
		props: {
		},
		data() {
			return {
				tableData: [], //表格数据
			}

			
		},
		mounted() {
		},
		methods: {
			/**
			 *同步文件
			 */
			dataSync() {
					this.dataSyncRequest()
			},
			/**
			 * 同步数据接口
			 */
			dataSyncRequest() {
					this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getLogFile,
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						if(resData.data.length > 0) {
							this.tableData = resData.data
							this.tableData.push({fileName:'完成！'})
						}
					}
				})
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
			h1{
			font-size: 30px;
			color: #323232;
			margin-bottom: 20px;
		}
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
				/*min-height: 787px;*/
			}
			.logBox {
				width: 99%;
				margin: 0 auto;
				/deep/ .el-table {
					max-height: 440px;
					/deep/ .is-leaf{
						border-bottom:none !important;
					}
					td{
						border-bottom:none !important;
					}
					/deep/ .el-pagination {
						margin-top: 30px!important;
						text-align: center;
					}
				}
			}
			.bottom {
				width: 100%;
				padding: 24px 0;
			}
		}
	}
</style>