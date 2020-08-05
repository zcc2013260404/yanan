<template>
	<div>
		<div class="dhlk-collapse-item" :style="{height: panelHeight}">
			<div class="dhlk-collapse-header">
				<span>{{title}}{{tips}}</span>
				<i :class="collapseCss" v-on:click='collapsePanel()'></i>
			</div>
			<div class="dhlk-collapse-content" v-show='showPanel' :style="{width:contentWidth}" >
				<div class="dhlk-collapse-dashboard-line"  :id="reportId" :style="{width:contentWidth}" ></div>
			</div>
		</div>
	</div>
</template>
<script>
	// 引入基本模板
	let echarts = require('echarts/lib/echarts')
	// 引入柱状图组件
	require('echarts/lib/chart/bar')
	// 引入提示框和title组件
	require('echarts/lib/component/tooltip')
	require('echarts/lib/component/title')

	export default {
		name: 'MonitorTime', //监测管理菜单页
		components: {},
		props:{
			dateValue: {
				type: Array,
				required: true
			},
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			},
			title:{
				type:String,
				default:{
					title:'状态'
				}
			},
			code:{
				type:String,
				require:true
			},
			reportId:{
				type:String,
				default:''
			},
			cycleValue: {
				type: Number,
				default:1000
			},
			calcValue: {
				type: String,
				default: 'NONE'
			}	
		},
		data() {
			return {
				collapseCss: 'dhlk-collapse-item__arrow el-icon-caret-top',
				panelHeight: '47px',
				showPanel: false,
				tips:'',
				option:{},
				reportChart: null ,
				renderData: [],
				contentWidth:'auto',
				searchParam:{
					deviceId:0,
					keys:'',
					startTs:'',
					endTs:'',
					interval: 1000,
					limit: 1000,
					agg: 'NONE'
				}
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			collapsePanel() {
				this.collapseCss = this.collapseCss == 'dhlk-collapse-item__arrow el-icon-caret-bottom'?'dhlk-collapse-item__arrow el-icon-caret-top':'dhlk-collapse-item__arrow el-icon-caret-bottom';
				this.showPanel = !this.showPanel
				if(this.showPanel){
					this.panelHeight = '327px'
					this.drawReport()
				}else{
					this.panelHeight = '47px'
				}
			},
			setOption (option) {
				this.option = option
			},
			clearOption (option) {
				this.reportChart.setOption({})
			},
			//初始化reportDom的對象
			initReport (reportScope) {
				let reportDom = document.getElementById(reportScope.reportId)
				reportScope.reportChart = echarts.getInstanceByDom(reportDom)
				if(reportScope.reportChart == undefined){
					reportScope.reportChart = echarts.init(reportDom)
				}
			},
			loadReportData(dateValue,reportData){

				this.searchParam = {
					deviceId: this.deviceObject.id,
					keys: this.titleList,
					startTs: dateValue[0].getTime(),
					endTs: dateValue[1].getTime(),
					interval: this.cycleValue,
					limit: 1000,
					agg: this.calcValue
				}

				
				//如果面板是显示出来的，则直接加载数据，如果面板没有显示出来就把数据存起来，等打开面板时，再加载数据
				this.renderData = reportData
				if(this.showPanel){
					this.renderReportData(this.renderData)
				}
			},
			//加載數據然後畫出來報表
			drawReport () {
				let scope = this
				let param = scope.searchParam

				param.deviceId = this.deviceObject.id
				param.keys = scope.code
				param.startTs = this.dateValue[0].getTime()
				param.endTs = this.dateValue[1].getTime()
				
				if(this.renderData.length != 0){
					scope.renderReportData(this.renderData)
				}else{
					this.$axios.leansite({
						method: 'get',
						url: this.API.leansite.getTimeseries,
						params: param
					}).then((res) => {
						var resData = res.data;
						if(JSON.stringify(resData.data) == '{}'){
							this.$message({
								type: 'warning',
								message: '没有查询到对应的数据'
							});
							return;
						}
						if(resData.code == 0) {
							let response = resData.data || []
							//如果时间是反过来的，则将数据倒过来显示
							if(response.length > 1 && response[0]['ts'] > response[2]['ts']){
								response = response.reverse()
							}

							for(let i = 0 ; i < response.length ; i++){
								let val = response[i]['value']
								if(val.toString.length > 4){
									response['value'][i] = val.toFixed(2)
								}
							}

							scope.renderReportData(response[this.title])
						}
						
					})
				}
			},
			renderReportData (renderData) {
				let scope = this
				let reportData = scope.formatterReportData(renderData)

				setTimeout(function(){						
					let option = scope.buildOption(reportData['xData'], reportData['seriesData'])
					
					//contentWidth
					//获取需要显示数据的数量，如果数量太多，则需要通过控制contentWidth来给dhlk-content生成一个滚动条
					// 等有数据的时候再进行测试
					// setTimeout(function(){
					// 	let data = option.series[0].data
					// 	if(data.length > 300){
					// 		this.contentWidth = '12000px'
					// 	}
					// },50)

					// setTimeout(function(){
					// 	scope.initReport(scope)
					// 	scope.reportChart.setOption(option)
					// },3000)

					scope.initReport(scope)
					scope.reportChart.setOption(option)

				},50)
			},
			formatterReportData (reportData) {
				let scope = this
				reportData = reportData || []
				let returnData = {
					seriesData:[],
					xData:[]
				}
				for(let i = 0 ; i<reportData.length ; i++){
					returnData['seriesData'].push(reportData[i]['value'])  //放顯示的值
					returnData['xData'].push(scope.formatDate(reportData[i]['ts'])) //放時間
				}
				return returnData
			},
			formatDate(inputTime) {
				var date = new Date(inputTime);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				var minute = date.getMinutes();
				var second = date.getSeconds();
				minute = minute < 10 ? ('0' + minute) : minute;
				second = second < 10 ? ('0' + second) : second;
				return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
			},
			buildOption(xData,seriesData){

				return {
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let showDate = params[0].axisValue
							let showValue = params[0].data
							return '时间:'+showDate+ ';数值:' + showValue;
						},
						axisPointer: {
							animation: false
						}
					},
					xAxis: {
						type: 'category',
						data: xData,
						axisLabel:{
							interval: 11,
                    		formatter: function (value) {
								var texts = [];
								texts.push(parseInt(value/10)*10);
								return value.split(' ')[1];
							}
                		}
					},
					yAxis: {
						type: 'value',
						name: '',
						nameLocation: 'middle',
						nameTextStyle: {
							fontStyle: 'normal'
						},
						nameGap: 30,
  						nameRotate: 0
					},
					series: [{
						data: seriesData,
						smooth: true,
						type: 'line'
					}],
					grid: {
						show: true,
						borderColor: '#FFF',
						x: 50,
						x2: 50,
						y: 50,
						y2: 50
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
	.dhlk-collapse-item {
		width: calc(100% - 80px);
		height: 325px;
		justify-content: space-evenly;
		align-items: center;
		border: 1px solid #C2C2C2;
		border-radius: 2px;
		margin: 20px auto;
		.dhlk-collapse-header {
			background: #F0F0F0;
			border-bottom: 1px solid #C2C2C2;
			padding: 0px 0px 0px 15px;
			line-height: 47px;
			i {
				line-height: 47px;
				float: right;
				padding-right: 22px;
			}
		}
		.dhlk-collapse-content {
			height: 278px;
			overflow: auto;
		}
	}
    .dhlk-collapse-dashboard-line{
        height: 278px;
		overflow: auto;
    }
</style>