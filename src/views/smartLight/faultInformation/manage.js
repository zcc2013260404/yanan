import lightImg1 from '../../../assets/img/LightCtrl/light.png'
import lightImg0 from '../../../assets/img/LightCtrl/light-gz.png'
import lightImg2 from '../../../assets/img/LightCtrl/light-lx.png'
import factoryImg from '../../../assets/img/LightCtrl/factory.png'
import factoryImg1 from '../../../assets/img/LightCtrl/factory1.png'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
import leftmenu from './../leftMenu'
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
            lightList: [{ // 灯列表
                lightBright: 0,
                checked: false,
                shortAddr: "00201944000136",
                xAxis: "0.5535224153705398",
                yAxis: "0.3181818181818182",
            }, {
                lightBright: 0,
                checked: true,
                shortAddr: "00201944000138",
                xAxis: "0.559012153705398",
                yAxis: "0.2920718181818182",
            }],
            areaValue: '', // 开关value
            areaOptions: [], // 开关列表
            dialogVisible: false, // 弹框
            websock: null,
            sns: '',
            backImg: '',
            tableData: [],
            companyName: ''
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
                                fault: null,
                                checked: false
                            })
                        }
                        this.backImg = this.API.leansite.baseURL + this.areaOptions[this.areaValue].imagePath
                        this.initWebpack()
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
                    fault: null,
                    checked: false
                })
            }
            this.backImg = this.API.leansite.baseURL + this.areaOptions[this.areaValue].imagePath
            if (this.lightList.length > 0) {
                if (this.websock) {
                    this.websocketonsend()
                } else {
                    this.initWebpack()
                }
            }
        },
        // 返回企业列表
        jumpCompany() {
            this.$store.dispatch("smartLight/setLightChildMenuPath", {
                data: '/enterprisesList'
            })
        },
        switchChange(item, index) {
            this.sns = item.sn
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.errorMsgInfo,
                params: {
                    ledSn: item.sn
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.dialogVisible = true
                    this.tableData = res.data.data
                }
            })
        },
        exportExcel() {
            let requestUrl = this.API.leansite.baseURL + this.API.leansite.errorMsgExport + '?ledSn=' + this.sns
            window.open(encodeURI(requestUrl))
        },
        openErrorDialog() {
            this.dialogVisible = true
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
                        item.fault = info[item.sn].fault
                    }
                })
            }
            console.log('收到', e)
        },
        websocketonsend(e) {
            if (this.websock) {
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
        if (this.websock) {
            this.websock.close()
            this.websock = null
        }
    }
}