import leftmenu from './../leftMenu'
import backImg from '../../../assets/img/back.png'
export default {
    components: {
        leftmenu
    },
    data() {
        return {
            installNum: 0, // 安装企业数量
            smartSwitch: 0, // 智慧开关
            accessNum: 0, // 接入灯数
            faultyEquipment: 0, // 故障设备
            charts: require('echarts'),
            mapCharts: null, // 地图
            barCharts: null, // 柱状图
            newList: [], // 新购买安装企业
            newJNList: [],
            backImg: backImg,
            companyObjList: {},
            dataList: [{ // 地图类型
                    name: "南海诸岛",
                    value: 0
                },
                {
                    name: '北京',
                    value: 0
                },
                {
                    name: '天津',
                    value: 0
                },
                {
                    name: '上海',
                    value: 0
                },
                {
                    name: '重庆',
                    value: 0
                },
                {
                    name: '河北',
                    value: 0
                },
                {
                    name: '河南',
                    value: 0
                },
                {
                    name: '云南',
                    value: 0
                },
                {
                    name: '辽宁',
                    value: 0
                },
                {
                    name: '黑龙江',
                    value: 0
                },
                {
                    name: '湖南',
                    value: 0
                },
                {
                    name: '安徽',
                    value: 0
                },
                {
                    name: '山东',
                    value: 0
                },
                {
                    name: '新疆',
                    value: 0
                },
                {
                    name: '江苏',
                    value: 0
                },
                {
                    name: '浙江',
                    value: 0
                },
                {
                    name: '江西',
                    value: 0
                },
                {
                    name: '湖北',
                    value: 0
                },
                {
                    name: '广西',
                    value: 0
                },
                {
                    name: '甘肃',
                    value: 0
                },
                {
                    name: '山西',
                    value: 0
                },
                {
                    name: '内蒙古',
                    value: 0
                },
                {
                    name: '陕西',
                    value: 0
                },
                {
                    name: '吉林',
                    value: 0
                },
                {
                    name: '福建',
                    value: 0
                },
                {
                    name: '贵州',
                    value: 0
                },
                {
                    name: '广东',
                    value: 0
                },
                {
                    name: '青海',
                    value: 0
                },
                {
                    name: '西藏',
                    value: 0
                },
                {
                    name: '四川',
                    value: 0
                },
                {
                    name: '宁夏',
                    value: 0
                },
                {
                    name: '海南',
                    value: 0
                },
                {
                    name: '台湾',
                    value: 0
                },
                {
                    name: '香港',
                    value: 0
                },
                {
                    name: '澳门',
                    value: 0
                }
            ],
            mapInfo: {},
            province: '',
            provinces: ''
        }
    },
    mounted() {
        this.mapCharts = this.charts.init(document.getElementById('mapInfo'))
        this.barCharts = this.charts.init(document.getElementById('barInfo'))
        this.getMapInfo()
        this.getBarInfo()
        this.getInstall()
        this.getJNInstall()
        this.getInfos()
        this.getCompany()
        setTimeout(() => {
            this.mapCharts.resize()
            this.barCharts.resize()
        })
        var self = this
        // 监听页面变化，从而改变图大小
        window.addEventListener("resize", function (event) {
            setTimeout(() => {
                self.mapCharts.resize()
                self.barCharts.resize()
            }, 100)
        }, false)
    },
    methods: {
        backToAll() {
            this.province = ''
            this.provinces = ''
            this.getInstall()
            this.getJNInstall()
            this.getInfos()
            this.getBarInfo()
        },
        getCompany() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getCompanyList,
                params: {
                    pageNum: 1,
                    pageSize: 999999999,
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    for (const item of res.data.data.list) {
                        this.companyObjList[item.name] = item
                    }
                }
            })
        },
        getMapInfo() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.statisticsLedQuery
            }).then((res) => {
                if (res.data.code === 0) {
                    let max = 0
                    this.mapInfo = {}
                    var self = this
                    this.dataList.forEach((item, index) => {
                        const keyItem = res.data.data.find(function (elem) {
                            if (elem.province) {
                                if (max < elem.count) {
                                    max = elem.count
                                }
                                return elem.province.indexOf(item.name) > -1
                            } else {
                                return false
                            }
                        })
                        if (keyItem !== undefined) {
                            item.value = keyItem.count
                            item.id = keyItem.province
                            self.mapInfo[item.name] = keyItem
                        } else {
                            item.id = ''
                            item.value = 0
                        }
                    })
                    const option = {
                        tooltip: {
                            triggerOn: "mousemove",
                            alwaysShowContent: false,
                            position: 'inside',
                            formatter: function (e, t, n) {
                                return e.name + "：" + e.value
                            }
                        },
                        visualMap: {
                            min: 0,
                            max: max === 0 ? 10 : max,
                            left: 26,
                            bottom: 40,
                            inRange: {
                                color: ['#EFF4FB', '#006edd']
                            },
                            top: 50,
                            show: false
                        },
                        geo: {
                            map: "china",
                            roam: !1,
                            scaleLimit: {
                                min: 1,
                                max: 2
                            },
                            top: 80,
                            label: {
                                normal: {
                                    show: !0,
                                    fontSize: "14",
                                    color: "rgba(0,0,0,0.7)"
                                }
                            },
                            itemStyle: {
                                normal: {
                                    //shadowBlur: 50,
                                    //shadowColor: 'rgba(0, 0, 0, 0.2)',
                                    borderColor: "rgba(0, 0, 0, 0.2)"
                                },
                                emphasis: {
                                    areaColor: "#f2d5ad",
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    borderWidth: 0
                                }
                            }
                        },
                        series: [{
                            name: "",
                            type: "map",
                            geoIndex: 0,
                            data: this.dataList
                        }]
                    }
                    this.mapCharts.setOption(option)
                    this.mapCharts.on('click', function (params) { //点击事件
                        self.province = params.name
                        self.provinces = params.name
                        if (self.mapInfo[params.name]) {
                            self.province = self.mapInfo[params.name].province
                        }
                        self.getInstall()
                        self.getJNInstall()
                        self.getInfos()
                        self.getBarInfo()
                    })
                }
            })
        },
        getBarInfo() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.statisticsLedQuery,
                params: {
                    province: this.province
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    const xdata = []
                    const data = []
                    for (const item of res.data.data) {
                        if (item.province.indexOf('西藏') > -1) {
                            xdata.push('西藏')
                        } else if (item.province.indexOf('新疆') > -1) {
                            xdata.push('新疆')
                        } else if (item.province.indexOf('广西') > -1) {
                            xdata.push('广西')
                        } else if (item.province.indexOf('内蒙古') > -1) {
                            xdata.push('内蒙古')
                        } else if (item.province.indexOf('宁夏') > -1) {
                            xdata.push('宁夏')
                        } else {
                            const str = item.province.replace('省', '').replace('市', '').replace('特别行政区', '')
                            xdata.push(str.substring(0, (str.indexOf('@') > -1 ? str.indexOf('@') : str.length)))
                        }
                        data.push(item.count)
                    }
                    const option = {
                        title: {
                            text: '节能企业分布',
                            left: 'center',
                            top: 0
                        },
                        grid: {
                            bottom: '20px',
                            top: 45
                        },
                        tooltip: {
                            trigger: 'axis',
                            alwaysShowContent: false,
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: function (e, t, n) {
                                return e[0].name + "：" + e[0].value
                            }
                        },
                        xAxis: {
                            type: 'category',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                interval: 0
                            },
                            data: xdata
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            splitLine: {
                                lineStyle: {
                                    type: 'dashed'
                                }
                            },
                        },
                        series: [{
                            data: data,
                            type: 'bar',
                            barMaxWidth: 30,
                            barCategoryGap: '40%',
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: '#006edd'
                                }
                            }
                        }]
                    }
                    this.barCharts.setOption(option)
                }
            })
        },
        getInstall() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.statisticsCompanyQuery,
                params: {
                    province: this.province,
                    limit: 10
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.newList = res.data.data
                }
            })
        },
        getJNInstall() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.energyComRanking,
                params: {
                    province: this.province,
                    limit: 10
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.newJNList = res.data.data
                }
            })
        },
        getInfos() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.statisticsInstallQuery,
                params: {
                    province: this.province
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.installNum = res.data.data[0]
                    this.smartSwitch = res.data.data[1]
                    this.accessNum = res.data.data[2]
                }
            })
        },
        jumpQYLB(item) {
            if (this.companyObjList[item.name]) {
                this.$store.dispatch("smartLight/setcurrCompany", {
                    data: this.companyObjList[item.name]
                })
                this.$store.dispatch("smartLight/setLightChildMenuPath", {
                    data: '/enterprisesList'
                })
                let list = []
                if (this.$store.getters['smartLight/getLightChildMenuList']) {
                    list = this.$store.getters['smartLight/getLightChildMenuList']
                }
                if (list.length > 0) {
                    var self = this
                    setTimeout(() => {
                        self.$store.dispatch('smartLight/setLightChildMenuPath', {
                            data: list[0].links
                        })
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '暂无权限!'
                    })
                }
            }
        }
    }
}