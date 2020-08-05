import lightImg1 from '../../../assets/img/LightCtrl/light.png'
import lightImg0 from '../../../assets/img/LightCtrl/light-off.png'
import lightImg2 from '../../../assets/img/LightCtrl/light-lx.png'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
import factoryImg from '../../../assets/img/LightCtrl/factory.png'
import factoryImg1 from '../../../assets/img/LightCtrl/factory1.png'
import choose from '../../../assets/img/LightCtrl/choose.png'
import rgoff from '../../../assets/img/LightCtrl/rgoff.png'
import rgon from '../../../assets/img/LightCtrl/rgon.png'
import ggoff from '../../../assets/img/LightCtrl/ggoff.png'
import ggon from '../../../assets/img/LightCtrl/ggon.png'
import leftmenu from './../leftMenu'
import baseValidator from '../../../common/baseValidator.js'
const validateParameterDesc = (rule, value, callback) => {
    let newValue = value.trim()
    if (!Number(newValue) && newValue !== '0') {
        callback(new Error('请输入正确有效的数字'))
    } else {
        callback()
    }
}
export default {
    components: {
        leftmenu,
        SecondBreadcrumb
    },
    data() {
        return {
            choose: choose,
            lightImg1: lightImg1,
            lightImg2: lightImg2,
            lightImg0: lightImg0,
            factoryImg: factoryImg,
            rgoff: rgoff,
            rgon: rgon,
            ggoff: ggoff,
            ggon: ggon,
            factoryImg1: factoryImg1,
            lightSize: '60px', // 默认灯大小60
            lightList: [],
            defaultLight: 1, // 初始化亮度控制
            switchValue: '', // 开关value
            switchOptions: [], // 开关列表
            areaValue: '', // 区域值
            areaOptions: [], // 区域列表
            checkAll: false, // 全选
            drawer: false, // 打开抽屉
            companyName: '',
            company: null,
            activeName: '0', // 切换
            sendWsTime: null,
            websock: null,
            backImg: '',
            newMsgNum: '0',
            updateOptions: [],
            showType: this.$store.getters['userCenter/getUser'].tenantId ? false : true,
            msgShow: false,
            activeName: '0',
            msgList: [],
            switchListValue: '',
            switchListOptions: [],
            modelList: [{
                    id: 0,
                    name: 'WG219'
                },
                {
                    id: 1,
                    name: 'E103 W01'
                },
                {
                    id: 2,
                    name: '汉枫 HF_LPD130'
                }
            ],
            rangList: [{
                    id: 1,
                    name: '2.4G'
                },
                {
                    id: 2,
                    name: '5G'
                },
                {
                    id: 3,
                    name: '2.4G和5G'
                }
            ],
            peoplemachineForm: {
                delayTime: '10',
                triggerValue: '3',
                lowValue: '5',
                hiValue: '100',
                status: false
            },
            lightmachineForm: {
                hilightValue: '1000',
                lowlightValue: '0',
                lowValues: '5',
                hiValues: '100',
                contronStatus: false,
                status: false
            },
            wifimachineForm: {
                ip: '192.168.10.2',
                ssid: 'Trem_AP',
                wifipwd: 'dhlktech',
                wifimodel: 2,
                wifirange: 2
            },
            rules: {
                ip: [{
                        required: true,
                        message: '请输入IP地址',
                        trigger: 'blur'
                    },
                    {
                        validator: baseValidator.validateIP,
                        trigger: 'blur'
                    }
                ],
                wifipwd: [{
                    required: true,
                    message: '请输入Wifi密码',
                    trigger: 'blur'
                }],
                wifimodel: [{
                    required: true,
                    message: '请选择WIFI模块',
                    trigger: 'blur'
                }],
                wifirange: [{
                    required: true,
                    message: '请选择射频范围',
                    trigger: 'blur'
                }],
                ssid: [{
                    required: true,
                    message: '请输入SSID',
                    trigger: 'blur'
                }],
                delayTime: [{
                        required: true,
                        message: '请输入延迟时间',
                        trigger: 'blur'
                    },
                    {
                        validator: validateParameterDesc,
                        trigger: 'blur'
                    }
                ],
                triggerValue: [{
                        required: true,
                        message: '请输入渐变时间',
                        trigger: 'blur'
                    },
                    {
                        validator: validateParameterDesc,
                        trigger: 'blur'
                    }
                ],
                lowValue: [{
                        required: true,
                        message: '请输入最低亮度',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.peoplemachineForm.hiValue !== '') {
                                if (parseFloat(this.peoplemachineForm.hiValue) <= parseFloat(newValue)) {
                                    callback(new Error('最低亮度必须小于最高亮度'))
                                } else if (parseFloat(newValue) > 100) {
                                    callback(new Error('最低亮度不能大于100%'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                hiValue: [{
                        required: true,
                        message: '请输入最高亮度',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            console.log(newValue)
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.peoplemachineForm.lowValue !== '') {
                                if (parseFloat(this.peoplemachineForm.lowValue) >= parseFloat(newValue)) {
                                    callback(new Error('最高亮度必须大于最低亮度'))
                                } else if (parseFloat(newValue) > 100) {
                                    callback(new Error('最高亮度不能大于100%'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                lowValues: [{
                        required: true,
                        message: '请输入最低亮度',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.lightmachineForm.hiValues !== '') {
                                if (parseFloat(this.lightmachineForm.hiValues) <= parseFloat(newValue)) {
                                    callback(new Error('最低亮度必须小于最高亮度'))
                                } else if (parseFloat(newValue) > 100) {
                                    callback(new Error('最低亮度不能大于100%'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                hiValues: [{
                        required: true,
                        message: '请输入最高亮度',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            console.log(newValue)
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.lightmachineForm.lowValues !== '') {
                                if (parseFloat(this.lightmachineForm.lowValues) >= parseFloat(newValue)) {
                                    callback(new Error('最高亮度必须大于最低亮度'))
                                } else if (parseFloat(newValue) > 100) {
                                    callback(new Error('最高亮度不能大于100%'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                lowlightValue: [{
                        required: true,
                        message: '请输入照度下限值',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.lightmachineForm.hilightValue !== '') {
                                if (parseFloat(this.lightmachineForm.hilightValue) <= parseFloat(newValue)) {
                                    callback(new Error('照度下限值必须小于照度上限值'))
                                } else if (parseFloat(newValue) > 65535) {
                                    callback(new Error('照度下限值不能大于65535'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                hilightValue: [{
                        required: true,
                        message: '请输入照度上限值',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            let newValue = value.trim()
                            console.log(newValue)
                            if (!Number(newValue) && newValue !== '0') {
                                callback(new Error('请输入正确有效的数字'))
                            } else if (this.lightmachineForm.lowlightValue !== '') {
                                if (parseFloat(this.lightmachineForm.lowlightValue) >= parseFloat(newValue) && !this.lightmachineForm.contronStatus) {
                                    callback(new Error('照度上限值必须大于照度下限值'))
                                } else if (parseFloat(newValue) > 65535) {
                                    callback(new Error('照度上限值不能大于65535'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            gjUpdate: ''
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
    },
    methods: {
        handleClicks() {
            this.refleshList()
        },
        refreshParamInfos() {
            const sns = this.lightList.map(function (obj, index) {
                return obj.sn
            }).join(',')
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.refreshParamInfo,
                params: {
                    sns: sns
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.refleshList()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        refleshList() {
            const sns = this.lightList.map(function (obj, index) {
                return obj.sn
            }).join(',')
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.findLedParamInfos,
                params: {
                    sns: sns
                }
            }).then((res) => {
                this.lightList.forEach((item, index) => {
                    for (const data of res.data.data) {
                        if (data.sn === item.sn) {
                            item.ip = data.ip
                            item.group_id = data.group_id
                            item.illumi_flr = data.illumi_flr
                            item.illumi_flr_max = data.illumi_flr_max
                            item.illumi_top = data.illumi_top
                            item.illumi_top_min = data.illumi_top_min
                            item.maxval = data.maxval
                            item.minval = data.minval
                            item.n_ramp_tm = data.n_ramp_tm
                            item.password = data.password
                            item.ssid = data.ssid
                            item.switchNames = data.switchNames
                            item.trig_delay_tm = data.trig_delay_tm
                            item.version = data.version
                            item.wf_dev = data.wf_dev
                            item.wf_mode = data.wf_mode
                            item.people_on_off = data.people_on_off
                            item.light_on_off = data.light_on_off
                            break
                        }
                    }
                })
            })
        },
        // 获取开关列表
        getLedLists() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getLedList
            }).then((res) => {
                if (res.data.code === 0) {
                    this.switchOptions = res.data.data
                    if (this.switchOptions && this.switchValue) {
                        this.switchGroup(this.switchOptions[this.switchValue].id)
                    }
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
                                group_id: '',
                                illumi_flr: '',
                                illumi_flr_max: '',
                                illumi_top: '',
                                illumi_top_min: '',
                                maxval: '',
                                minval: '',
                                n_ramp_tm: '',
                                password: '',
                                ssid: '',
                                switchNames: '',
                                trig_delay_tm: '',
                                version: '',
                                people_on_off: '',
                                light_on_off: '',
                                wf_dev: '',
                                wf_mode: ''
                            })
                        }
                        this.initWebpack()
                        this.backImg = this.API.leansite.baseURL + this.areaOptions[0].imagePath
                    }
                }
            })
        },
        restartled() {
            const list = this.getLightChecks()
            if (list.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择需要设置的灯!'
                })
                return
            }
            const leds = []
            for (const item of list) {
                leds.push(item.sn)
            }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.restartLed,
                params: {
                    sns: leds.join(',')
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '指令已发送!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
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
                    checked: false,
                    group_id: '',
                    illumi_flr: '',
                    illumi_flr_max: '',
                    illumi_top: '',
                    illumi_top_min: '',
                    maxval: '',
                    minval: '',
                    n_ramp_tm: '',
                    password: '',
                    ssid: '',
                    switchNames: '',
                    trig_delay_tm: '',
                    version: '',
                    people_on_off: '',
                    light_on_off: '',
                    wf_dev: '',
                    wf_mode: ''
                })
            }
            this.checkAll = false
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
            this.$store.dispatch('smartLight/setLightChildMenuPath', {
                data: '/enterprisesList'
            })
        },
        getGJLists() {
            this.$axios
                .leansite({
                    method: 'get',
                    url: this.API.leansite.firmwareVersionList,
                    params: {
                        pageNum: 1,
                        pageSize: 99999999
                    }
                })
                .then(res => {
                    if (res.data.code === 0) {
                        this.updateOptions = res.data.data.list
                    }
                })
        },
        setChecked(item, index) {
            this.lightList[index].checked = !item.checked
            if (!this.lightList[index].checked) {
                this.checkAll = false
            }
        },
        changeLightStates() {
            // this.defaultLight = value
            const list = this.getLightChecks()
            if (list.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择需要调节亮度的灯!'
                })
                return
            }
            if (this.defaultLight === '' || parseFloat(this.defaultLight) < 1) {
                this.$message({
                    type: 'error',
                    message: '请输入1~999之间的瓦数!'
                })
                return
            }
            const leds = []
            for (const item of list) {
                leds.push(item.sn)
            }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.saveLightBright,
                params: {
                    sns: leds.join(','),
                    brightness: this.defaultLight
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '设置成功!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        msgclose() {
            this.msgShow = false
        },
        msgOpen() {
            this.newMsgNum = '0'
            this.msgShow = true
        },
        resetLigthStates() {
            this.drawer = true
            this.defaultLight = 1
            this.gjUpdate = ''
            this.peoplemachineForm = {
                delayTime: '10',
                triggerValue: '3',
                lowValue: '5',
                hiValue: '100',
                status: false
            }
            this.wifimachineForm = {
                ip: '192.168.10.2',
                ssid: 'Trem_AP',
                wifipwd: 'dhlktech',
                wifimodel: 2,
                wifirange: 2
            }
            this.lightmachineForm = {
                hilightValue: '1000',
                lowlightValue: '0',
                lowValues: '5',
                hiValues: '100',
                contronStatus: false,
                status: false
            }
            this.getGJLists()
        },
        updateGJ() {
            const list = this.getLightChecks()
            if (list.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择需要升级固件的灯!'
                })
                return
            }
            if (this.gjUpdate === null || this.gjUpdate === '') {
                this.$message({
                    type: 'error',
                    message: '请选择升级包!'
                })
                return
            }
            const leds = []
            for (const item of list) {
                leds.push(item.sn)
            }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.firmwareVersionUpdate,
                data: {
                    sns: leds.join(','),
                    dev_type: '0',
                    t: {
                        id: this.updateOptions[this.gjUpdate].id,
                        address: this.updateOptions[this.gjUpdate].address,
                        name: this.updateOptions[this.gjUpdate].name,
                        version: this.updateOptions[this.gjUpdate].version
                    }
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '指令已发送!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        hideBtn() {
            this.drawer = false
            this.$refs['lightmachineForm'].resetFields()
            this.$refs['peoplemachineForm'].resetFields()
            this.$refs['wifimachineForm'].resetFields()
        },
        switchChange() {
            if (this.switchValue === null || this.switchValue === '') {
                this.switchListValue = ''
                return
            }
            const self = this
            this.lightList.forEach((item, index) => {
                item.checked = false
            })
            this.switchListValue = ''
            this.checkAll = false
            this.switchGroup(this.switchOptions[this.switchValue].id)
        },
        switchgetLend() {
            if (this.switchListValue === null || this.switchListValue === '') {
                return
            }
            this.checkAll = false
            const self = this
            this.lightList.forEach((item, index) => {
                const keyItem = self.switchListOptions[self.switchListValue].leds.find(function (elem) {
                    return item.id === elem.id
                })
                if (keyItem !== undefined) {
                    item.checked = true
                } else {
                    item.checked = false
                }
            })
        },
        switchGroup(id) {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getSwitchGroup,
                params: {
                    switchId: id
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.switchListOptions = res.data.data
                    this.switchgetLend()
                }
            })
        },
        checkedAlls() {
            this.lightList.forEach((item, index) => {
                item.checked = this.checkAll
            })
        },
        setSwitch(type) {
            const list = this.getLightChecks()
            if (list.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择需要设置的灯!'
                })
                return
            }
            const leds = []
            for (const item of list) {
                leds.push(item.sn)
            }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.saveLightOpenClose,
                params: {
                    sns: leds.join(','),
                    status: type
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '指令已发送!'
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        bindByLight() {
            const list = this.getLightChecks()
            if (this.switchListValue.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择开关组!'
                })
                return
            }
            // if (list.length === 0) {
            //     this.$message({
            //         type: 'error',
            //         message: '请选择需要绑定的灯!'
            //     })
            //     return
            // }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.saveSwitchByLed,
                data: {
                    areaID: this.areaOptions[this.areaValue].id,
                    computerID: this.switchOptions[this.switchValue].computerID,
                    id: this.switchOptions[this.switchValue].id,
                    ip: this.switchOptions[this.switchValue].ip,
                    groupId: this.switchListOptions[this.switchListValue].id,
                    groupNo: this.switchListOptions[this.switchListValue].groupId,
                    leds: list,
                    name: this.switchOptions[this.switchValue].name,
                    sn: this.switchOptions[this.switchValue].sn
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                    this.getLedLists()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        getLightChecks() {
            const list = []
            for (const item of this.lightList) {
                if (item.checked) {
                    list.push(item)
                }
            }
            return list
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
                        item.status = info[item.sn].status + ''
                        item.peopleStatus = info[item.sn].peopleStatus ? info[item.sn].peopleStatus + '' : null
                        item.linghtStatus = info[item.sn].linghtStatus ? info[item.sn].linghtStatus + '' : null
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
        },
        submitForm(formName) {
            const list = this.getLightChecks()
            if (list.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请选择需要设置的灯!'
                })
                return
            }
            const leds = []
            for (const item of list) {
                leds.push(item.sn)
            }
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                if (formName === 'lightmachineForm') {
                    this.$axios
                        .leansite({
                            method: 'post',
                            url: this.API.leansite.luminanceSave,
                            data: {
                                t: {
                                    illumi_flr: this.lightmachineForm.lowlightValue,
                                    illumi_flr_max: this.lightmachineForm.hilightValue,
                                    illumi_top: this.lightmachineForm.hiValues,
                                    illumi_top_min: this.lightmachineForm.lowValues,
                                    on_off: this.lightmachineForm.status ? '1' : '0'
                                },
                                controlParam: this.lightmachineForm.contronStatus ? '1' : '0',
                                sns: leds.join(',')
                            }
                        })
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '指令发送成功！'
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                })
                            }
                        })
                } else if (formName === 'peoplemachineForm') {
                    this.$axios
                        .leansite({
                            method: 'post',
                            url: this.API.leansite.peopleSave,
                            data: {
                                t: {
                                    trig_delay_tm: this.peoplemachineForm.delayTime,
                                    n_ramp_tm: this.peoplemachineForm.triggerValue,
                                    maxvalue: this.peoplemachineForm.hiValue,
                                    minvalue: this.peoplemachineForm.lowValue,
                                    on_off: this.peoplemachineForm.status ? '1' : '0'
                                },
                                sns: leds.join(',')
                            }
                        })
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '指令发送成功！'
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                })
                            }
                        })
                } else if (formName === 'wifimachineForm') {
                    this.$axios
                        .leansite({
                            method: 'post',
                            url: this.API.leansite.wifiSave,
                            data: {
                                ledWifiInfo: {
                                    ip: this.wifimachineForm.ip,
                                    ssid: this.wifimachineForm.ssid,
                                    password: this.wifimachineForm.wifipwd,
                                    wf_mode: this.wifimachineForm.wifirange,
                                    wf_dev: this.wifimachineForm.wifimodel
                                },
                                sns: leds.join(',')
                            }
                        })
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '指令发送成功！'
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                })
                            }
                        })
                }
            })
        }
    },
    destroyed() {
        if (this.websock) {
            this.websock.close()
            this.websock = null
        }
    }
}