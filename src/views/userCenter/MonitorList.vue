<template>
    <div>
        <el-container>
            <el-header>
                <el-row v-show='false'>
                    <el-col :span="24" class="dhlk-condition">
                        时间维度：
                    <el-select v-model="searchParam.timeDimension" placeholder="请选择">
                            <el-option
                            v-for="item in timeList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                            </el-option>
                        </el-select>
                        时间：
                        <el-date-picker
                            v-model="searchParam.dateTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                        <el-button>查询</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside width="460px">
                    <el-row class="dhlk-report-panel">
                        <el-col :span="24" class="card-panel-col">
                            <MonitorBar ref="deviceReport" :reportId="deviceNumId"></MonitorBar>
                        </el-col>
                    </el-row>
                    <el-row class="dhlk-report-panel">
                        <el-col :span="24" class="card-panel-col">
                            <MonitorBar ref="biReport" :reportId="biNumId"></MonitorBar>
                        </el-col>
                    </el-row>
                    <el-row class="dhlk-report-panel">
                        <el-col :span="24" class="card-panel-col">
                            <MonitorBar ref="dataReport" :reportId="allDataReportId" ></MonitorBar>
                        </el-col>
                    </el-row>
                </el-aside>
                <el-main >
                    <el-row>
                        <el-col style="height:500px;min-height:50px">
                            <MonitorListMap></MonitorListMap>
                        </el-col>
                    </el-row>
                    <el-row style="align:center">
                        <el-col >
                            <el-table
                                :data="tenant_list"
                                style="width: 100%"
                                :row-class-name="tableRowClassName">
                                <el-table-column
                                prop="tenantName"
                                label="租户名称"
                                align='center'
                               >
                            </el-table-column>
                            <el-table-column
                                align='center'
                                prop="totalVal"
                                label="累计数据量"
                                >
                            </el-table-column>
                            <el-table-column
                                align='center'
                                prop="endTime"
                                label="过期时间">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-main>
                <el-aside width="550px">
                    <el-row >
                        <el-col :span="24" style="height:40px;line-height:40px;">
                            <div class="wrap">
                                <div id="box">
                                    <div id="marquee">{{playText}}</div>
                                    <div id="copy"></div>
                                </div>
                                <div id="node">{{playText}}</div> 
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="dhlk-report-panel">
                        <el-col :span="24" class="card-panel-col">
                             <MonitorPie ref="rateReport" :reportId="pieReportId" ></MonitorPie>
                        </el-col>
                    </el-row>
                    <el-row class="dhlk-report-panel">
                        <el-col :span="12" class="card-panel-col">
                            <MonitorGauge ref="gaugeReport" :reportId="gaugeReportId" ></MonitorGauge>
                        </el-col>
                        <el-col :span="12" class="card-panel-col">
                            <MonitorGauge ref="gaugeReport2" :reportId="autoGaugeReportId" ></MonitorGauge>
                        </el-col>
                    </el-row>
                </el-aside>
            </el-container>
        </el-container>

    </div>
</template>
<script>
    // 引入折线图
    import MonitorBar from './monitor/MonitorBarReport.vue';
    import MonitorPie from './monitor/MonitorPieReport.vue';
    import MonitorGauge from './monitor/MonitorGaugeReport.vue';
    import MonitorListMap from './monitor/MonitorMap.vue';

	export default {
		name: 'MonitorTime', //监测管理菜单页
		components: { MonitorBar , MonitorListMap, MonitorPie , MonitorGauge},
		props:{},
		data() {
			return {
                tableRowClassName:"",
                playText:'',
                timeList:[
                    {id:'1',text:'日'},
                    {id:'2',text:'周'},
                    {id:'3',text:'月'}
                ],
                reportData:{},
                tenant_list:[],
                month:'',
				collapseCss: 'dhlk-collapse-item__arrow el-icon-caret-top',
				panelHeight: '47px',
				showPanel: false,
				tips:'',
				option:{},
				reportChart: null ,
				renderData: [],
                contentWidth:'auto',
                autoGaugeReportId: 'gaugeReport2',
                gaugeReportId:'gaugeReport',
                pieReportId: 'pieReport',
                deviceNumId:'deviceNum',
                biNumId:'biNum',
                allDataReportId:'allDataReport',
				searchParam:{
                    
				}
			}
		},
		created() {
			
		},
		mounted() {
            let nowDate = new Date();
            this.month = nowDate.getMonth() + 1
            this.initData()
            
		},
		methods: {
             move () {
                // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
                let width = document.getElementById('node').getBoundingClientRect().width 
                let box = document.getElementById('box')
                let copy = document.getElementById('copy')
                copy.innerText = this.playText // 文字副本填充
                let distance = 0 // 位移距离
                //设置位移
                setInterval(function () { 
                    distance = distance - 1
                    // 如果位移超过文字宽度，则回到起点
                    if (distance <= -1800) {
                        distance = 16
                    }
                    // console.log('distance:'+distance+":width:"+width);
                    box.style.transform = 'translateX(' + distance + 'px)'
                }, 20) 
            },
            initData(){
                let scope = this
                //按照参数
				this.$axios.leansite({
					method: 'get',
					// url: this.API.leansite.getDeviceParameter, 
					url: this.API.leansite.getMonitorIndex,
					params: this.searchParam
				}).then((res) => {
                    //debugger
                    scope.reportData = res.data.data
                    let date = new Date()
                    scope.playText = '截止【'+this.commonFun.dateFormat(date, "yyyy年MM月")+'】共入住企业@allUser家，其中已到期【@validNum】家，本月内到期【@currMon】家，共计【@deviceCnt】台设备接入本平台，共采集了【@dataCntMB的】数据'
                    let osList = scope.reportData.osList;
                    for(let i = 0 ; i < osList.length ; i++){
                        let key = osList[i].dataType
                        let val = osList[i].totalVal
                        scope.playText = scope.playText.replace("@"+key,val)
                    }
                    console.log(scope.playText)
                    this.move()
					scope.loadReport();
                });
            },
			//加載數據然後畫出來報表
			loadReport () {
                let reportScope = this;
               
                
                this.$refs.biReport.initReport(this.buildBiReportOpt())
                this.$refs.deviceReport.initReport(this.buildDeviceReportOpt())
                this.$refs.dataReport.initReport(this.buildDataReportOpt())
                this.$refs.rateReport.initReport(this.buildRateReportOpt())
                this.$refs.gaugeReport.initReport(this.buildGaugeReportOpt())
                this.$refs.gaugeReport2.initReport(this.buildGauge2ReportOpt())
                this.tenant_list = reportScope.reportData.tenList.splice(0,5)
                this.tenant_list.forEach( o => {
                    
                    o.endTime = this.commonFun.dateFormat(o.endTime, "yyyy-MM-dd HH:mm")
                })
                setInterval(function () {
                    reportScope.$refs.gaugeReport.loadReportData()
                    reportScope.$refs.gaugeReport2.loadReportData()
                },2000);
            },

            buildReportData(key){
                let reportList = this.reportData[key] || [] ,tenantList = [] , dataList = [];
                for(let i = 0 ; i < reportList.length ; i++ ){
                    let reportData = reportList[i]
                    tenantList.push(reportData['tenantName']);
                    dataList.push(reportData['totalVal']);
                }

                return {
                    tenant:tenantList,
                    data:dataList
                }
            },
            buildDeviceReportOpt() {
                let renderData = this.buildReportData('device')
                return {
                    title: '设备接入Top10',
                    xData: renderData['tenant'],
                    yData: renderData['data'],
                    color: ['#3398DB']
                }
            },
            buildBiReportOpt() {
                let renderData = this.buildReportData('bi')
                return {
                    title: 'BI控制器接入Top10',
                    xData: renderData['tenant'],
                    yData: renderData['data'],
                    color: ['#3398DB']
                }
            },
            buildDataReportOpt() {
                
                let renderData = this.buildReportData('totalList')
                return {
                    title: '数据流量Top10',
                    xData: renderData['tenant'],
                    yData: renderData['data'],
                    color: ['#3398DB']
                }
            },
            buildRateReportOpt() {
                return {
                    title: '数据流量Top10',
                    xData: ['厂商1', '厂商2', '厂商3', '厂商4', '厂商5', '厂商6', '厂商7', '厂商8', '厂商9', '厂商10'],
                    yData: [Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000],
                    color: ['#3398DB']
                }
            },
            buildGaugeReportOpt() {
                return {
                    title: ' 主节点内存使用率',
                    xData: ['厂商1', '厂商2', '厂商3', '厂商4', '厂商5', '厂商6', '厂商7', '厂商8', '厂商9', '厂商10'],
                    yData: [Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000],
                    color: ['#3398DB']
                }
            },
            buildGauge2ReportOpt() {
                return {
                    title: '主节点CPU使用率',
                    xData: ['厂商1', '厂商2', '厂商3', '厂商4', '厂商5', '厂商6', '厂商7', '厂商8', '厂商9', '厂商10'],
                    yData: [Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000,Math.random()*1000],
                    color: ['#3398DB']
                }
            }
		}
	}
</script>

<style lang="scss" scoped type="text/css">

    .dhlk-condition{
        height:50px;
        line-height: 50px;
        margin: 0px 0px 0px 20px;
    }
    
    .dhlk-report-panel{
        height: 220px;
        width: 100%;
        margin-top: 20px;
    }
    .dhlk-collapse-dashboard-line{
        height: 240px;
		overflow: auto;
    }
    .render-panel{
        display:flex;
    }
    
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
    }
    
    body > .el-container {
        margin-bottom: 40px;
    }
    
    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    // 限制外框宽度，隐藏多余的部分
    .wrap {
        overflow: hidden;
    }
    // 移动框宽度设置
    #box {
        width: 80000%;
    }
    // 文字一行显示
    #box div {
        float: left;
    }
    // 设置前后间隔
    #marquee {
     margin: 0 16px 0 0;
    }
    // 获取宽度的节点，隐藏掉
    #node {
        position: absolute;
        z-index: -999;
        top: -999999px;
    }
</style>