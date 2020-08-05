<template>
    <div class="dhlk-collapse-dashboard-line" :id="reportId"></div>
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
			reportId:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				option:{},
				reportChart: null ,
				renderData: []
			}
		},
		created() {
			
		},
		mounted() {
		},
		methods: {
			collapsePanel() {
			},
			setOption (option) {
				this.option = option
			},
			clearOption (option) {
				this.reportChart.setOption({})
			},
			//初始化reportDom的對象
			initReport (repOption) {
				let reportScope = this;
				let reportDom = document.getElementById(reportScope.reportId)
				reportScope.reportChart = echarts.getInstanceByDom(reportDom)
				if(reportScope.reportChart == undefined){
					reportScope.reportChart = echarts.init(reportDom)
                }else{
					reportScope.reportChart.setOption({})
				}
                let reportOption = this.buildOption(repOption)
                reportScope.reportChart.setOption(reportOption)
			},
			loadReportData(dataValue,reportData){
				this.renderReportData(this.renderData)
			},
			renderReportData (renderData) {
				let scope = this
				let reportData = scope.formatterReportData(renderData)
                this.$nextTick(() => {
                    let option = scope.buildOption(reportData['xData'], reportData['seriesData'])
					scope.initReport(scope)
					scope.reportChart.setOption(option)
                })
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
			buildOption(option){
				return {
                    title: {
						text: option.title,
						left: 'center'
                    },
                    color: option.color,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: option.xData,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {type: 'value'}
                    ],
                    series: [
                        {
                            name: '接入数',
                            type: 'bar',
                            barWidth: '60%',
                            data: option.yData
                        }
                    ]
                }
			}
		}
	}
</script>

<style lang="scss" scoped type="text/css">
    .dhlk-collapse-dashboard-line{
        height: 220px;
		overflow: auto;
    }
</style>