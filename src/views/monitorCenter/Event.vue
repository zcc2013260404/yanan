<template>
	<div class="eventBox">
		<div class="event_header">
			<span class="choseDate" >
					<el-date-picker
						v-model="dateValue"
						type="datetimerange"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:editable="false"
						align="right">
					</el-date-picker>
					<el-button @click="searchMonitorTime()">搜索</el-button>
			</span>
			<el-dropdown @command='screenChange'>
			  <span class="el-dropdown-link">
			   		 筛选<i class="el-icon-arrow-down el-icon--right"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown" >
			  	<el-dropdown-item v-for="(item,index) in screen" :key="'screen'+index" command='item'>{{item}}</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
			<span v-if="!hasPermission('event/delete')" style="display:inline-block; width:40px"></span>
			<span class="el-icon-delete" v-if="hasPermission('event/delete')" @click="deleteEvent" style="cursor:pointer"> 删除</span>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span>所有事件</div>
			<div class="container">
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" show-overflow-tooltip>
					<el-table-column type="selection" align="center" width="55">
					</el-table-column>
					<el-table-column label="严重程度" align="center" width="">
						<template slot-scope="scope">
							<i v-if="scope.row.severity=='警告'">
								<img src="../../assets/img/monitorCenter/xinxi-jinggao.png"/>
							</i>
							<i  v-if="scope.row.severity=='危险'">
								<img src="../../assets/img/monitorCenter/xinxi-weixian.png"/>
							</i>
							<i  v-if="scope.row.severity=='严重'">
								<img src="../../assets/img/monitorCenter/xinxi-yanzhong.png"/>
							</i>
							<i  v-if="scope.row.severity=='轻微'">
								<img src="../../assets/img/monitorCenter/xinxi-qingwei.png"/>
							</i>
							<i  v-if="scope.row.severity=='不确定'">
								<img src="../../assets/img/monitorCenter/xinxi-buqueding.png"/>
							</i>
        					<span style="margin-left: 10px">{{ scope.row.severity }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="endts" align="center" label="时间" width="" :formatter='dateFormat' show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="details" align="center" label="描述"  show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="status" label="状态" align="center" width="" show-overflow-tooltip>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'Event',
		components: {
			// EditableCell
		},
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			},
		},
		data() {
			return {
				pickerOptions: {
					onPick: ({ maxDate, minDate }) => {
						this.pickerMinDate = minDate.getTime()
						if (maxDate) {
						this.pickerMinDate = ''
						}
					},
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}],
					disabledDate:(time) => {
					}
				},
				tableData: [],
				multipleSelection: [],
				sizeForm: {
					date1: '',
					date2: ''
				},
				screen:[],
				dateValue: [new Date(), new Date()],
				status:'',
				eventId:[]
			}
		},
		mounted() {
				if(this.sizeForm.date1==''||this.sizeForm.date2==''){
					var day = new Date();
					day.setTime(day.getTime());
					this.sizeForm.date1 = this.dateValue[0];
					this.sizeForm.date2 = this.dateValue[1];
				}
				// this.getEventList()
				let nowDate = new Date();
				this.dateValue = [new Date(nowDate.getTime() - 3600 * 1000 * 24),  new Date()]
				this.searchMonitorTime()
		},
		methods: {
			/*
             * 点击删除
             */
			deleteEvent(){
				if(this.eventId.length==0){
						this.$message({
							type: 'watning',
							message: '请先选择事件'
						});
						return
				};
				this.$axios.leansite({
					method: 'GET',
					url: this.API.leansite.deleteEvent,
					params:{
						ids:this.eventId.toString()
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
							this.$message({
							type: 'success',
							message: '删除成功'
						});
							this.getEventList()
					}else if (resData.code == 1000){
						this.$message({
							type: 'error',
							message: '删除失败：'+resData.msg
						});
					}
				})
			},
			/*
             * 点击搜索
             */
			searchMonitorTime(){
				this.sizeForm.date1 = this.dateValue[0]
				this.sizeForm.date2 = this.dateValue[1]
				this.getEventList()
			},
			
			screenChange(command){
				this.status = command
				this.getEventList()
			},
			handleSelectionChange(val) {
				let self = this;
				this.eventId=[];
				this.multipleSelection = val;
				this.multipleSelection.forEach((item,index)=>{
					self.eventId.push(item.id)
				})

			},
			/*
             * 日期格式化
             */
            dateFormat(row, column, cellValue, index) {
				console.log( cellValue)
            	return this.commonFun.dateFormat(cellValue,"yyyy-MM-dd HH:mm");	
            },
			/*
			 * 获取事件列表接口
			 */
			getEventList() {
				this.$axios.leansite({
					method: 'GET',
					url: this.API.leansite.getEventList,
					params:{
						tbId:this.deviceObject.tbId,
						searchStatus:this.status,
						startTime:this.sizeForm.date1.getTime(this.sizeForm.date1),
						endTime:this.sizeForm.date2.getTime(this.sizeForm.date2)
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						if(resData.data.length>0){
							this.tableData = resData.data;
							this.tableData.forEach((item,index)=>{
								
								if(item.severity=='CRITICAL'){
									item.severity='危险'
								}else if(item.severity=='MAJOR'){
									item.severity='严重'
								}else if(item.severity=='MINOR'){
									item.severity='轻微'
								}else if(item.severity=='WARNING'){
									item.severity='警告'
								}else if(item.severity=='INDETERMINATE'){
									item.severity='不确定'
								};
								if(this.screen.indexOf(item.status)===-1){
									this.screen.push(item.status);
								}
							})
						}
					}
				})
			},
//			getEventList(searchStatus) {
//				this.$axios.leansite({
//					method: 'GET',
//					url: this.API.leansite.getEventLidt,
//					params:{
//						deviceId:this.deviceObject.id,
//						searchStatus:searchStatus,
//						limit:100,
//						ascOrder:true,
//						offset:"",
//						fetchOriginator:true,
//						startTime:this.sizeForm.date1.getTime(this.sizeForm.date1),
//						endTime:this.sizeForm.date2.getTime(this.sizeForm.date2)
//					}
//				}).then((res) => {
//					var resData = res.data;
//					if(resData.code == 0) {
//						if(resData.data.data.length>0){
//							this.tableData = resData.data.data;
//							this.tableData.forEach((item,index)=>{
//								
//								if(item.severity=='CRITICAL'){
//									item.severity='危险'
//								}else if(item.severity=='MAJOR'){
//									item.severity='严重'
//								}else if(item.severity=='MINOR'){
//									item.severity='轻微'
//								}else if(item.severity=='WARNING'){
//									item.severity='警告'
//								}else if(item.severity=='INDETERMINATE'){
//									item.severity='不确定'
//								};
//								if(this.screen.indexOf(item.status)===-1){
//									this.screen.push(item.status);
//								}
//							})
//						}
//					}
//				})
//			},
		}

	}
</script>
<style lang="scss" scoped type="text/css">
	.eventBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		overflow: auto;
		/*margin-top: -15px;*/
		.event_header {
			width: 100%;
			height: 44px;
			line-height: 44px;
			text-align: right;
			background-color: #ffffff;
			box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.2);
			position: relative;
			/deep/ .el-dropdown-link {
			    cursor: pointer;
			    color: #006fe6 !important;
			}
			/deep/ .el-icon-arrow-down {
			    font-size: 12px;
			}
			/deep/ .el-button{
				height: 35px !important;
				margin-left: 5px !important;
			}
			/deep/ .eventBox .event_header span {
				&:last-child{
					margin: 0 !important; 
					color: #006fe6 !important;	
				}
			}
			.choseDate{
				position: absolute;
				top: 3px;
				right: 250px;
				display: inline-flex;
				span{
					margin: 0 !important; 
				 	color: #006fe6 !important; 
				}
				button{
					margin-left: 10px;
				}
			}
			.el-icon-delete{
				margin: 0 40px 0 16px;
					color: #f62447;
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
				min-height: 850px;
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