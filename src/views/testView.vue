<template>
	<div class="eventBox">
		<div class="event_header">
			<span class="el-icon-guide"> 筛选</span>
			<span class="el-icon-delete"> 删除</span>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span>所有时间</div>
			<div class="container">
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark"  show-overflow-tooltip>
					<el-table-column type="selection" align="center" width="55">
					</el-table-column>
					<el-table-column label="严重程度" align="center" width="">
						<template slot-scope="scope">
							<i class="el-icon-time" style="color: #f62447;font-size: 18px;" v-if="scope.row.date=='警告'"></i>
							<i class="el-icon-time" style="color: #ffcd06;font-size: 18px;" v-if="scope.row.date=='严重'"></i>
							<i class="el-icon-info" style="color: #006fe6;font-size: 18px;" v-if="scope.row.date=='提示'"></i>
        					<span style="margin-left: 10px">{{ scope.row.date }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="name" align="center" label="时间" width="" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="address" align="center" label="描述" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="date" label="状态" align="center" width="" show-overflow-tooltip>
						
					</el-table-column>
					<el-table-column prop="name" label="来源" align="center" width="" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="address" label="变量" align="center" show-overflow-tooltip>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<TestViewChild :validateFun="varNameCheck"></TestViewChild>
	</div>
</template>
<script>
	import TestViewChild from './testViewChild.vue'
	export default {
		name: 'testView',
		components: {
			TestViewChild
		},
		props: {
	        deviceObject: { //deviceObject设备信息
	            type: Object,
	            required: true
	        },
	    },
		data() {
			return {
				varNameCheck:function(varCode){
					let reg = /^[A-Za-z]{1,20}$/;
					let checkResult = true;
					if(!reg.test(varCode)){
						this.$message({
							type: 'warning',
							message: '编码必须是1~20位的字母!'
						});
						checkResult = false;
					}
					return checkResult;
				},
				websock: null,
				tableData: [{
					date: '严重',
					name: '王小虎上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄',
					address: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
				}, {
					date: '警告',
					name: '警告',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '提示',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '警告',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '严重',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '提示',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '严重',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}],
				multipleSelection: []
			}
		},
        created(){
           //页面刚进入时开启长连接
            this.initWebSocket()
        },
        destroyed: function() {
	       　		//页面销毁时关闭长连接
	　　　　　　this.websocketclose();
	　　　},
		methods: {
			initWebSocket(){ //初始化weosocket 
	　　　　　　　　const wsuri = this.API.leansite.baseURL + "/websocket/threadsocket";//ws地址
	　　　　　　　　this.websock = new WebSocket(wsuri); 
	　　　　　　　　this.websocket.onopen = this.websocketonopen;
	　　　　　　　　this.websocket.onerror = this.websocketonerror;
	　　　　　　　　this.websock.onmessage = this.websocketonmessage; 
	　　　　　　　　this.websock.onclose = this.websocketclose;
	　　　　   	},
	　　　　　　websocketonopen() {
	　　　　　　　　console.log("WebSocket连接成功");
	　　　　　　},
	　　　　　　websocketonerror(e) { //错误
	 　　　　　　 console.log("WebSocket连接发生错误");
	　　　　　　},
	　　　　　　websocketonmessage(e){ //数据接收 
	　　　　　　　　const redata = JSON.parse(e.data);
	　　　　       // 接收数据
	　　　　　　　　console.log(redata.value); 
	　　　　　　}, 
	
	　　　　　　websocketsend(agentData){//数据发送 
	　　　　　　　　this.websock.send(agentData); 
	　　　　　　}, 
	　　　　　 websocketclose(e){ //关闭 
	　　　　　　　　console.log("connection closed (" + e.code + ")"); 
	　　　　　}
		}

	}
</script>
<style lang="scss">
	.eventBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		.event_header {
			width: 100%;
			height: 44px;
			line-height: 44px;
			text-align: right;
			background-color: #ffffff;
			box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.2);
			span {
				color: #006fe6;
				&:last-child {
					margin: 0 40px 0 16px;
					color: #f62447;
				}
			}
		}
		.event_body {
			width: 95%;
			margin: 0 auto;
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
				/*min-height: 787px;*/
				.el-table {
					width: 98%;
					margin: 0 auto;
					text-align: center;
					/deep/ .el-table-column {
						border: solid 1px #969696;
					}
				}
			}
		}
	}
</style>