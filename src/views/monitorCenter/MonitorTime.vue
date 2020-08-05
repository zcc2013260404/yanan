<template>
	<div id="mtime-panel" class="">
		<div class="dhlk-search-panel" >
			 <span>统计类型：</span>
			  <el-select v-model="calcValue" placeholder="请选择" :style="{width:'120px'}">
			 <el-option
				v-for="item in calcTypeOption"
				:key="item.value"
				:label="item.label"
				:value="item.value">
				</el-option>
			 </el-select>

			 <span>时间粒度：</span>
			 <el-select v-model="cycleValue" placeholder="请选择" :style="{width:'80px'}">
			 <el-option
				v-for="item in timeCycleOption"
				:key="item.value"
				:label="item.label"
				:value="item.value">
				</el-option>
			 </el-select>

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
		</div>
		<MonitorLine v-for="panelObj in panelList" :key="panelObj.title" ref='runStatusChild' :cycleValue="cycleValue" :calcValue="calcValue" :title='panelObj.title' :code='panelObj.code' :reportId="panelObj.reportId" :deviceObject='deviceObject' :dateValue='dateValue' ></MonitorLine>
	</div>
</template>
<script>
	// 引入折线图
	import MonitorLine from './MonitorLine.vue';
	let echarts = require('echarts/lib/echarts')
	// 引入柱状图组件
	require('echarts/lib/chart/bar')
	// 引入提示框和title组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')

	export default {
		name: 'MonitorTime', //监测管理菜单页
		components: {
			MonitorLine
		},
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			}
		},
		data() {
			return {
				calcTypeOption: [{
					value: 'AVG',
					label: '平均值'
				},{
					value: 'COUNT',
					label: '总数'
				},{
					value: 'SUM',
					label: '求和'
				},{
					value: 'MAX',
					label: '最大值'
				},{
					value: 'MIN',
					label: '最小值'
				},{
					value: 'NONE',
					label: '原始数据'
				}],
				calcValue:'NONE',
				timeCycleOption: [{
					value: 1000,
					label: '秒'
				}, {
					value: 60*1000,
					label: '分'
				}, {
					value: 3600*1000,
					label: '小时'
				}, {
					value:  86400*1000,
					label: ' 天'
				}, {
					value:  604800*1000, 
					label: '周'
				}],
				cycleValue: 1000,
				panelList:[],
				titleList:[],
				searchParam: {
					deviceId: this.deviceObject.id,
					keys:'',
					startTs:'',
					endTs:'',
					interval: 1000,
					limit: 1000,
					agg: 'NONE'
				},
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
				dateValue: [new Date(), new Date()],
			}
		},
		created() {
			
		},
		mounted() {
			this.initReportPanel()
			let nowDate = new Date();
			this.dateValue = [new Date(nowDate.getTime() - 600 * 1000),  new Date()]
		},
		methods: {
			validateSearchParam (){

				if(this.dateValue == null){
					this.$message({
						type: 'warning',
						message: '请选择查询时间段'
					})
					return false
				}
				let startTime = this.dateValue[0]
				let endTime = this.dateValue[1]

				if(startTime == endTime){
					this.$message({
						type: 'warning',
						message: '开始时间不能和结束时间相等'
					})
					return false
				}

				if(startTime.getTime() > endTime.getTime()){
					this.$message({
						type: 'warning',
						message: '开始时间不能晚于结束时间'
					})
					return false
				}

				if(startTime.getTime() > endTime.getTime()){
					this.$message({
						type: 'warning',
						message: '开始时间不能晚于结束时间'
					})
					return false
				}

				return true;
			},
			searchMonitorTime(){
				
				if(!this.validateSearchParam()){
					return 
				}

				let startTs = new Date(this.dateValue[0])
				let endTs = new Date(this.dateValue[1])

				this.searchParam = {
					deviceId: this.deviceObject.id,
					keys: this.titleList.join(","),
					startTs: startTs.getTime(),
					endTs: endTs.getTime(),
					interval: this.cycleValue,
					limit: 1000,
					agg: this.calcValue
				}
				
				
				//按照参数
				this.$axios.leansite({
					method: 'get',
					// url: this.API.leansite.getDeviceParameter, 
					url: this.API.leansite.getTimeseries,
					params: this.searchParam
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						let response = resData.data

						if(JSON.stringify(response) == '{}'){
							this.$message({
								type: 'warning',
								message: '没有查询到对应的数据'
							});
							return;
						}

						for(let i = 0 ; i < this.$refs.runStatusChild.length ;i++){
							let code = this.$refs.runStatusChild[i].code
							let reportData = response[code]  || []
							//如果时间是翻过来的，则将数据倒过来显示
							if(reportData.length > 1 && reportData[0]['ts'] > reportData[2]['ts']){
								reportData = reportData.reverse()
							}

							for(let i = 0 ; i < reportData.length ; i++){
								let val = reportData[i]['value']
								if(val.toString.length > 4){
									reportData['value'][i] = val.toFixed(2)
								}
							}

							this.$refs.runStatusChild[i].loadReportData(this.dateValue,reportData); 
						}
					}
				});

				

			},
			initReportPanel(){
				let scope = this
				let param = {
					classifyId: this.deviceObject.classifyId
				}

				//按照设备的ID获取该设备对应的属性
				this.$axios.leansite({
					method: 'get',
					//url: this.API.leansite.getDeviceParameter, 
					url: this.API.leansite.findAttrByClassifyById,
					params: param
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.objList = resData.data
						this.panelList = new Array()
						for(var i = 0 ; i < this.objList.length ;i++){
							this.panelList[i] = {
								reportId: 'dhlk_monitor_line_'+parseInt(Math.random()*100000),
								title: this.objList[i]['attr'],
								code: this.objList[i]['code']
							}
							this.titleList[i] = this.objList[i]['code']
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.dhlk-search-panel {
		width: 100%;
		line-height: 44px;
		height:44px;
		justify-content: space-evenly;
		align-items: center;
		border-bottom: 1px solid #EBEBEB;
		text-align: right;
		background-color: #ffffff;
		overflow: hidden;
		box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.2);
		.el-range-editor--medium.el-input__inner {
			margin-right: 15px
		}
		.el-button--medium{
			margin:0px 15px 0px 0px
		}
	}
</style>