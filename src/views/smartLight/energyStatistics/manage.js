import leftmenu from './../leftMenu'
import lightImg1 from '../../../assets/img/LightCtrl/light.png'
import lightImg0 from '../../../assets/img/LightCtrl/light-off.png'
import lightImg2 from '../../../assets/img/LightCtrl/light-lx.png'
import factoryImg from '../../../assets/img/LightCtrl/factory.png'
import factoryImg1 from '../../../assets/img/LightCtrl/factory1.png'
import Pagination from '../../../components/Pagination.vue'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
export default {
    components: {
        leftmenu,
        Pagination,
        SecondBreadcrumb
    },
    data() {
        return {
            activeName: '0',
            switchValue: '', // 开关value
            switchOptions: [], // 开关列表
            areaValue: '', // 区域值
            areaOptions: [], // 区域列表
            tableData: [],
            dateRange: [],
            lightImg1: lightImg1,
            lightImg2: lightImg2,
            lightImg0: lightImg0,
            factoryImg: factoryImg,
            factoryImg1: factoryImg1,
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            lightSize: '60px', // 默认灯大小60
            lightList: [],
            startpickerOptions: {
                disabledDate: time => {
                    if (this.endTime !== '' && this.endTime !== null) {
                        return time.getTime() > this.endTime.getTime()
                    } else {
                        return false
                    }
                }
            },
            endpickerOptions: {
                disabledDate: time => {
                    if (this.startTime !== '' && this.startTime !== null) {
                        return time.getTime() < this.startTime.getTime()
                    } else {
                        return false
                    }
                }
            },
            checkIndex: 0,
            powers: 0,
            electric: 0,
            voltage: 0,
            companyName: '',
            websock: null,
            sendWsTime: null,
            startTime: '',
            endTime: '',
            charts: require('echarts'),
            chart1: null,
            chart2: null,
            chart3: null,
            options1: null,
            options2: null,
            options3: null,
            options: {
                title: {
                    text: '',
                    left: 'center',
                    textStyle: {
                        color: '#323232',
                        fontSize: '14',
                        fontWeight: 'normal'
                    }
                },
                grid: {
                    top: 35,
                    left: 55
                },
                tooltip: {
                    trigger: 'axis',
                    alwaysShowContent: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#bebebe'
                        }
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true
                    },
                    min: 0,
                    max: 100
                },
                series: {
                    name: '',
                    type: 'line',
                    symbol: 'circle',
                    smooth: true,
                    symbolSize: 8,
                    showSymbol: false,
                    hoverAnimation: false,
                    lineStyle: {
                        width: 2
                    },
                    data: []
                }
            },
            rightBarRightClass: 'rightBarControlHide',
            arrowName: 'el-icon-caret-left',
            isShowChart: false,
            isAbleCheck: false,
            currLedsn: '', //当前需要查询统计图的灯
            backImg: ''
        }
    },
    mounted() {
        this.company = null
        if (this.$store.getters['smartLight/getcurrCompany']) {
            this.company = this.$store.getters['smartLight/getcurrCompany']
        }
        if (this.company) {
            this.companyName = this.company.name
        }
        this.getLedLists()
        this.getAreaLists()
        this.fetchDate()
    },
    methods: {
        searchInfo() {
            this.pageObj.pageIndex = 1
            this.fetchDate()
        },
        PageTurning(page_obj) {
            this.pageObj.pageIndex = page_obj.page_index
            this.pageObj.pageSize = page_obj.page_size
            this.fetchDate()
        },
        handleClick(row, column, event) {
            this.backImg = []
            this.lightList = []
            this.currLedsn = ''
            for (const items of this.areaOptions) {
                if (items.area === row.area) {
                    for (const item of items.leds) {
                        this.lightList.push({
                            areaId: item.areaId,
                            brightness: item.brightness,
                            createTime: item.createTime,
                            id: item.id,
                            indBright: item.indBright,
                            indStatus: item.indStatus,
                            indTime: item.indTime,
                            ip: item.ip,
                            sn: item.sn,
                            tenantId: item.tenantId,
                            unindBright: item.unindBright,
                            xaxis: item.xaxis,
                            yaxis: item.yaxis,
                            alias: item.alias,
                            status: '-1',
                            checked: false
                        })
                    }
                    this.backImg = this.API.leansite.baseURL + items.imagePath
                    break
                }
            }
            if (this.lightList.length > 0) {
                if (this.websock) {
                    this.websocketonsend()
                } else {
                    this.initWebpack()
                }
            }
        },
        fetchDate() {
            let startDate = ''
            let endDate = ''
            if (this.startTime !== null && this.startTime.length !== 0) {
                startDate = this.commonFun.dateFormat(this.startTime, 'yyyy-MM-dd') + ' 00:00:00'
            }
            if (this.endTime !== null && this.endTime.length !== 0) {
                endDate = this.commonFun.dateFormat(this.endTime, 'yyyy-MM-dd') + ' 23:59:59'
            }
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getPowerList,
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    pageNum: this.pageObj.pageIndex,
                    pageSize: this.pageObj.pageSize,
                    area: (this.areaValue !== '' && this.areaValue !== null) ? this.areaOptions[this.areaValue].area : '',
                    led_switch: (this.switchValue !== '' && this.switchValue !== null) ? this.switchOptions[this.switchValue].name : ''
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.tableData = []
                    for (const item of res.data.data.list) {
                        item.time = item.time.replace('T', ' ')
                        item.time = item.time.substring(0, 10)
                        this.tableData.push(item)
                    }
                    if (this.tableData.length > 0) {
                        try {
                            this.$refs.multipleTable.setCurrentRow(this.tableData[0])
                        } catch (e) {}
                        this.handleClick(this.tableData[0])
                    }
                    this.pageObj.total = res.data.data.total
                } else {
                    this.$message({
                        type: 'error',
                        message: '查询失败，请刷新重试！'
                    })
                }
            })
        },
        handleClicks() {
            if (this.activeName === '0') {
                clearInterval(this.sendWsTime)
                this.sendWsTime = null
            }
        },
        // 获取开关列表
        getLedLists() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getLedList
            }).then((res) => {
                if (res.data.code === 0) {
                    this.switchOptions = res.data.data
                }
            })
        },
        // 获取区域列表
        getAreaLists() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getAreaList
            }).then((res) => {
                if (res.data.code === 0) {
                    this.areaOptions = res.data.data
                }
            })
        },
        changeArea() {
            // this.lightList = this.areaOptions[this.areaValue].leds
            // this.backImg = this.API.leansite.baseURL + this.areaOptions[this.areaValue].imagePath
        },
        // 返回企业列表
        jumpCompany() {
            this.$store.dispatch("smartLight/setLightChildMenuPath", {
                data: '/enterprisesList'
            });
        },
        /**
         * 切换右侧图表区域显示与隐藏
         */
        changeChartsShow() {
            if (this.isShowChart) {
                this.isShowChart = false
                this.arrowName = 'el-icon-caret-left'
                this.rightBarRightClass = 'rightBarControlHide'
                this.chart1 = null
                this.chart2 = null
                this.chart3 = null
            } else {
                this.isShowChart = true
                this.arrowName = 'el-icon-caret-right'
                this.rightBarRightClass = 'rightBarControlShow'
                setTimeout(() => {
                    this.initCharts()
                }, 100);
            }
        },
        initCharts() {
            this.chart1 = this.charts.init(document.getElementById('chart1'))
            this.chart2 = this.charts.init(document.getElementById('chart2'))
            this.chart3 = this.charts.init(document.getElementById('chart3'))
            this.options1 = JSON.parse(JSON.stringify(this.options))
            this.options2 = JSON.parse(JSON.stringify(this.options))
            this.options3 = JSON.parse(JSON.stringify(this.options))
            this.options1.xAxis.axisLabel = {
                formatter: function (value, index) {
                    return value.substring(11)
                }
            }
            this.options2.xAxis.axisLabel = {
                formatter: function (value, index) {
                    return value.substring(11)
                }
            }
            this.options3.xAxis.axisLabel = {
                formatter: function (value, index) {
                    return value.substring(11)
                }
            }
            this.options1.tooltip.formatter = function (params, ticket, callback) {
                // <i class="el-icon-caret-right" style="color: #006fe6;position: absolute;right: -10px;top: 30px;font-size: 18px"></i>
                return [
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span> 电流',
                    params[0].name,
                    params[0].value
                ].join('<br>')
            }
            this.options1.tooltip.position = function (params) {
                if (params[0] > 130) {
                    return [params[0] - 160, params[1] - 40]
                } else {
                    return [params[0], params[1]]
                }
            }
            this.options2.tooltip.position = function (params) {
                if (params[0] > 130) {
                    return [params[0] - 160, params[1] - 40]
                } else {
                    return [params[0], params[1]]
                }
            }
            this.options3.tooltip.position = function (params) {
                if (params[0] > 130) {
                    return [params[0] - 160, params[1] - 40]
                } else {
                    return [params[0], params[1]]
                }
            }
            this.options2.tooltip.formatter = function (params, ticket, callback) {
                return [
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span> 电压',
                    params[0].name,
                    params[0].value
                ].join('<br>')
            }
            this.options3.tooltip.formatter = function (params, ticket, callback) {
                return [
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span> 功率',
                    params[0].name,
                    params[0].value
                ].join('<br>')
            }
            this.options1.title.text = '电流实时数据'
            this.options2.title.text = '电压实时数据'
            this.options3.title.text = '能耗'
            this.options1.yAxis.name = '(A)'
            this.options2.yAxis.name = '(V)'
            this.options3.yAxis.name = '(kW·h)'
            this.options1.tooltip.backgroundColor = '#006fe6'
            this.options2.tooltip.backgroundColor = '#72c8ff'
            this.options3.tooltip.backgroundColor = '#0b16a0'
            this.options1.series.itemStyle = {
                normal: {
                    color: '#006fe6'
                }
            }
            this.options2.series.itemStyle = {
                normal: {
                    color: '#72c8ff'
                }
            }
            this.options3.series.itemStyle = {
                normal: {
                    color: '#0b16a0'
                }
            }
            this.chart1.setOption(this.options1)
            this.chart2.setOption(this.options2)
            this.chart3.setOption(this.options3)
        },
        setChecked(item, index) {
            this.lightList[index].checked = !item.checked
            this.isAbleCheck = this.lightList[index].checked
            this.currLedsn = this.lightList[index].alias ? this.lightList[index].alias : this.lightList[index].sn
            this.lightList.forEach((item2, index2) => {
                if (index !== index2) {
                    item2.checked = false
                }
            })
            if (this.isShowChart) {
                this.chart1 = null
                this.chart2 = null
                this.chart3 = null
                this.initCharts()
            } else {
                this.changeChartsShow()
            }
            // if (this.lightList[index].checked) {
            //     this.checkIndex = index
            //     this.sendWsTime = setInterval(() => {
            //         this.getLightPower()
            //     }, 5000)
            // } else {
            //     clearInterval(this.sendWsTime)
            //     this.sendWsTime = null
            // }
        },
        getLightPower() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getLedPower,
                params: {
                    ledId: this.lightList[this.checkIndex].sn
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    const dt = JSON.parse(res.data.data)
                    this.powers = dt.energy
                    this.electric = dt.electricity
                    this.voltage = dt.voltage
                } else {
                    this.powers = '暂无信息'
                    this.electric = '暂无信息'
                    this.voltage = '暂无信息'
                }
            })
        },
        initWebpack() {
            //初始化websocket
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getWebsocketUrl
            }).then((res) => {
                if (res.data.code === 0) {
                    this.websock = `ws://${res.data.data}/websocket/${this.$store.getters['userCenter/getToken']}`
                    this.websock = new WebSocket(this.websock) //这里面的this都指向vue
                    this.websock.onopen = this.websocketopen
                    this.websock.onmessage = this.websocketonmessage
                    this.websock.onclose = this.websocketclose
                    this.websock.onerror = this.websocketerror
                }
            })
        },
        websocketopen() {
            //打开
            console.log('WebSocket连接成功')
            this.websocketonsend()
        },
        websocketonmessage(e) {
            //数据接收
            if (e.data !== undefined && e.data !== null && e.data.length > 0) {
                const info = JSON.parse(e.data)
                this.lightList.forEach((item, index) => {
                    if (info[item.sn]) {
                        item.status = info[item.sn].status
                        if (this.activeName === '1' && item.checked && this.isAbleCheck) {
                            // this.powers = info[item.sn].power ? info[item.sn].power : '暂无信息'
                            // this.electric = info[item.sn].electric ? info[item.sn].electric + ' A' : '暂无信息'
                            // this.voltage = info[item.sn].voltage ? info[item.sn].voltage + ' V' : '暂无信息'
                            this.options1.xAxis.data.push(info[item.sn].createTime)
                            this.options2.xAxis.data.push(info[item.sn].createTime)
                            this.options3.xAxis.data.push(info[item.sn].createTime)
                            let min1 = 1000
                            let max1 = -1000
                            let min2 = 1000
                            let max2 = -1000
                            let min3 = 1000
                            let max3 = -1000
                            this.options1.series.data.push(info[item.sn].electric ? info[item.sn].electric : 0)
                            this.options2.series.data.push(info[item.sn].voltage ? info[item.sn].voltage : 0)
                            this.options3.series.data.push(info[item.sn].energy ? info[item.sn].energy : 0)
                            for (const item of this.options1.series.data) {
                                if (item < min1) {
                                    min1 = item
                                }
                                if (item > max1) {
                                    max1 = item
                                }
                            }
                            for (const item of this.options2.series.data) {
                                if (item < min2) {
                                    min2 = item
                                }
                                if (item > max2) {
                                    max2 = item
                                }
                            }
                            for (const item of this.options3.series.data) {
                                if (item < min3) {
                                    min3 = item
                                }
                                if (item > max3) {
                                    max3 = item
                                }
                            }
                            const splitmun1 = parseFloat(((max1 - min1) / 8).toFixed(3))
                            const splitmun2 = parseFloat(((max2 - min2) / 8).toFixed(3))
                            const splitmun3 = parseFloat(((max3 - min3) / 8).toFixed(3))
                            min1 = parseFloat((min1 - ((splitmun1 === 0) ? 0.1 : splitmun1)).toFixed(3))
                            max1 = parseFloat((max1 + ((splitmun1 === 0) ? 0.1 : splitmun1)).toFixed(3))
                            min2 = parseFloat((min2 - ((splitmun2 === 0) ? 0.1 : splitmun2)).toFixed(3))
                            max2 = parseFloat((max2 + ((splitmun2 === 0) ? 0.1 : splitmun2)).toFixed(3))
                            min3 = parseFloat((min3 - ((splitmun3 === 0) ? 0.1 : splitmun3)).toFixed(3))
                            max3 = parseFloat((max3 + ((splitmun3 === 0) ? 0.1 : splitmun3)).toFixed(3))
                            this.options1.yAxis.min = min1 < 0 ? 0 : min1
                            this.options1.yAxis.max = max1
                            this.options2.yAxis.min = min2 < 0 ? 0 : min2
                            this.options2.yAxis.max = max2
                            this.options3.yAxis.min = min3 < 0 ? 0 : min3
                            this.options3.yAxis.max = max3
                            this.chart1.setOption(this.options1)
                            this.chart2.setOption(this.options2)
                            this.chart3.setOption(this.options3)
                            const currentIndex = this.options1.series.data.length - 1
                            // 取消之前高亮的图形
                            this.chart1.dispatchAction({
                                type: 'downplay',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 高亮当前图形
                            this.chart1.dispatchAction({
                                type: 'highlight',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 显示 tooltip
                            this.chart1.dispatchAction({
                                type: 'showTip',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 取消之前高亮的图形
                            this.chart2.dispatchAction({
                                type: 'downplay',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 高亮当前图形
                            this.chart2.dispatchAction({
                                type: 'highlight',
                                seriesIndex: 0,
                                dataIndex: currentIndex,
                            })
                            // 显示 tooltip
                            this.chart2.dispatchAction({
                                type: 'showTip',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 取消之前高亮的图形
                            this.chart3.dispatchAction({
                                type: 'downplay',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                            // 高亮当前图形
                            this.chart3.dispatchAction({
                                type: 'highlight',
                                seriesIndex: 0,
                                dataIndex: currentIndex,
                            })
                            // 显示 tooltip
                            this.chart3.dispatchAction({
                                type: 'showTip',
                                seriesIndex: 0,
                                dataIndex: currentIndex
                            })
                        }
                    }
                })
            }
        },
        websocketonsend() {
            if (this.websock && this.lightList.length > 0) {
                const sns = this.lightList.map(function (obj, index) {
                    return obj.sn
                }).join(',')
                this.websock.send(sns)
            }
        },
        websocketclose(source) {
            //关闭
            if (this.websock) {
                console.log('WebSocket关闭')
                this.websock.close()
                this.websock = null
            }
            let _this = this
            if (this.$store.getters['smartLight/getLightChildMenuPath'] === '/lightSetting' && (!!window.ActiveXObject || 'ActiveXObject' in window)) {
                setTimeout(() => {
                    _this.initWebpack()
                    _this = null
                }, 15000)
            }
        },
        websocketerror() {
            //失败
            console.log('WebSocket连接失败')
        }
    },
    destroyed() {
        if (this.sendWsTime) {
            clearInterval(this.sendWsTime)
            this.sendWsTime = null
        }
        if (this.websock) {
            this.websock.close()
            this.websock = null
        }
    }
}