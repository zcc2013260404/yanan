import lightImg1 from '../../../assets/img/LightCtrl/light.png'
import lightImg0 from '../../../assets/img/LightCtrl/light-off.png'
import lightImg2 from '../../../assets/img/LightCtrl/light-lx.png'
import factoryImg from '../../../assets/img/LightCtrl/factory.png'
import factoryImg1 from '../../../assets/img/LightCtrl/factory1.png'
import leftmenu from './../leftMenu'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
export default {
    components: {
        leftmenu,
        SecondBreadcrumb
    },
    data() {
        return {
            lightImg1: lightImg1,
            lightImg2: lightImg2,
            lightImg0: lightImg0,
            factoryImg: factoryImg,
            factoryImg1: factoryImg1,
            lightSize: '60px', // 默认灯大小60
            lightList: [],
            areaValue: '', // 区域值
            areaOptions: [], // 区域列表
            datavalue: new Date().getTime() - (24000 * 3600),
            startpickerOptions: {
                disabledDate: time => {
                    return time.getTime() > new Date().getTime() - (24000 * 3600)
                }
            },
            options: {
                xAxis: {
                    min: 0,
                    max: 10,
                    scale: true,
                    show: false
                },
                tooltip: {
                    show: true
                },
                visualMap: [{
                    show: false,
                    left: 'right',
                    top: '10%',
                    dimension: 2,
                    inRange: {
                        color: ['#fff', '#fc9700', '#f44336']
                    },
                    min: 0,
                    max: 5
                }],
                grid: {
                    left: 0,
                    bottom: 1,
                    top: 0,
                    right: 1
                },
                yAxis: {
                    min: 0,
                    max: 10,
                    scale: true,
                    show: false
                },
                series: [{
                    type: 'effectScatter',
                    rippleEffect: {
                        scale: 2
                    },
                    symbolSize: 40,
                    data: [],
                    itemStyle: {
                        color: 'rgba(220, 20, 60, 0.7)',
                        opacity: 0.4
                    }
                }]
            },
            charts: require('echarts'),
            chartsWidth: '',
            chartsHeight: '',
            hotIsShow: false,
            mapCharts: null,
            company: null,
            companyName: '',
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
        this.hotCharts = this.charts.init(document.getElementById('hotMap'))
        // 监听页面变化，从而改变图大小
        var self = this
        window.addEventListener("resize", function (event) {
            setTimeout(() => {
                self.checkSize()
            }, 200)
        }, false)
        this.getAreaLists()
    },
    methods: {
        // 获取区域列表
        getAreaLists() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getAreaList
            }).then((res) => {
                if (res.data.code === 0) {
                    this.areaOptions = res.data.data
                    if (this.areaOptions.length > 0) {
                        this.areaValue = 0
                        this.lightList = []
                        for (const item of this.areaOptions[this.areaValue].leds) {
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
                                peopleStatus: null,
                                linghtStatus: null,
                                checked: false,
                            })
                        }
                        this.backImg = this.API.leansite.baseURL + this.areaOptions[0].imagePath
                        setTimeout(() => {
                            this.getHotMap()
                        }, 100)
                    }
                }
            })
        },
        changeArea() {
            this.lightList = []
            for (const item of this.areaOptions[this.areaValue].leds) {
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
                    peopleStatus: null,
                    linghtStatus: null,
                    checked: false
                })
            }
            this.backImg = this.API.leansite.baseURL + this.areaOptions[this.areaValue].imagePath
            if (this.lightList.length > 0) {
                setTimeout(() => {
                    this.checkSize()
                })
            }
        },
        checkSize() {
            this.getImgSize()
            this.getHotMap()
        },
        // 获取图片宽高
        getImgSize() {
            const mapLight = document.getElementById('mapLight')
            this.chartsWidth = mapLight.childNodes[0].width
            this.chartsHeight = mapLight.childNodes[0].height
        },
        // 人感热力图
        getHotMap() {
            this.getImgSize()
            this.setMap()
        },
        // 返回企业列表
        jumpCompany() {
            this.$store.commit('setLightChldMenu', '/enterprisesList')
        },
        setMap() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.findPeopleFeelNumber,
                params: {
                    areaId: this.areaOptions[this.areaValue].id,
                    date: this.commonFun.dateFormat(this.datavalue, 'yyyy-MM-dd')
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    const heatData = []
                    let max = -1
                    for (const item of this.lightList) {
                        let value = 0
                        for (const values of res.data.data) {
                            if (values.ledSn === item.sn) {
                                value = values.number
                                break
                            }
                        }
                        if (max < value) {
                            max = value
                        }
                        heatData.push([
                            Math.round(this.chartsWidth * item.xaxis + 30),
                            Math.round(this.chartsHeight - (this.chartsHeight * item.yaxis) - 30), value
                        ])
                    }
                    if (max === 0) {
                        max = 10
                    }
                    this.options.xAxis.max = this.chartsWidth
                    this.options.yAxis.max = this.chartsHeight
                    this.options.series[0].data = heatData
                    this.options.visualMap[0].max = max
                    var self = this
                    this.options.tooltip.formatter = function (params, ticket, callback) {
                        return [
                            '<div style="line-height: 10px;height: 10px;margin-top:5px;margin-bottom: -15px;text-align: left"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff;"></span>' +
                            (self.lightList[params.dataIndex].alias ? self.lightList[params.dataIndex].alias : self.lightList[params.dataIndex].sn) + '</div>',
                            '人感次数: ' + params.data[2]
                        ].join('<br>')
                    }
                    this.options.tooltip.backgroundColor = '#006fe6'
                    this.hotCharts.setOption(this.options)
                    this.hotCharts.resize()
                }
            })
        }
    },
    destroyed() {
        this.hotCharts = null
    }
}