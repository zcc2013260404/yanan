import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import {
    regionData
} from 'element-china-area-data'
export default {
    components: {
        leftmenu,
        Pagination
    },
    props: {
        // username: {
        //     //用户名
        //     type: String,
        //     default: '',
        //     required: true
        // },
        // leansiteToken: {
        //     //token信息
        //     type: String,
        //     required: true
        // }
    },
    data() {
        return {
            keywords: '', // 柱状图
            address: '',
            options: regionData, //省级联动数据
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            oldAsideList: [
                //原始侧边栏菜单
                {
                    icon: [
                        'icon iconfont leansite-2-shigongxinxi',
                        require('../../../assets/img/userCenter/jueseguanli-xz.png')
                    ],
                    name: '施工信息',
                    links: '/constructionInfoList',
                    powerName: 'construction/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-shigongquyu',
                        require('../../../assets/img/userCenter/yonghu-xz.png')
                    ],
                    name: '施工区域',
                    links: '/constructionAreaList',
                    powerName: 'area/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-yitiji',
                        require('../../../assets/img/userCenter/huodongrizhi-xz.png')
                    ],
                    name: '照明一体机',
                    links: '/lightMachine',
                    powerName: 'computer/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-zhihuikaiguan',
                        require('../../../assets/img/userCenter/huodongrizhi-xz.png')
                    ],
                    name: '智慧开关',
                    links: '/smartSwitchList',
                    powerName: 'switch/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-zhaomingshezhi',
                        require('../../../assets/img/userCenter/zuhu-xz.png')
                    ],
                    name: '照明设置',
                    links: '/lightSetting',
                    powerName: 'led/findAreasByLed'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-dingshi',
                        require('../../../assets/img/userCenter/zuzhijiagou-xz.png')
                    ],
                    name: '定时控制',
                    links: '/timingControlList',
                    powerName: 'scheduler/findTaskSchedulerList'
                },
                // {
                //     icon: [
                //         'icon iconfont leansite-2-renwu',
                //         require('../../../assets/img/userCenter/jueseguanli-xz.png')
                //     ],
                //     name: '任务设置',
                //     links: '/roleList',
                //     powerName: 'role/view'
                // },
                {
                    icon: [
                        'icon iconfont leansite-2-yanshoubaogao',
                        require('../../../assets/img/userCenter/yonghu-xz.png')
                    ],
                    name: '验收报告',
                    links: '/acceptanceReport',
                    powerName: 'inspectionReport/findLampList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-nengyuantongji',
                        require('../../../assets/img/userCenter/huodongrizhi-xz.png')
                    ],
                    name: '能源统计',
                    links: '/energyStatistics',
                    powerName: 'ledPowerStatistics/findList'
                },
                {
                    icon: ['icon iconfont leansite-yonghuxinxi', require('../../../assets/img/userCenter/huodongrizhi-xz.png')],
                    name: '人感统计',
                    links: '/senseStatistics',
                    powerName: 'ledPowerStatistics/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-zaixianshouhou',
                        require('../../../assets/img/userCenter/yonghu-xz.png')
                    ],
                    name: '在线售后',
                    links: '/afterSales',
                    powerName: 'question/findList'
                },
                {
                    icon: [
                        'icon iconfont leansite-shouye-guzhang',
                        require('../../../assets/img/userCenter/huodongrizhi-xz.png')
                    ],
                    name: '故障信息',
                    links: '/faultInformation',
                    powerName: 'faultmessage'
                },
                {
                    icon: [
                        'icon iconfont leansite-2-xitongpeizhi',
                        require('../../../assets/img/userCenter/huodongrizhi-xz.png')
                    ],
                    name: '系统配置',
                    links: '/systemConfig',
                    powerName: 'originalPower/findList'
                }
            ],
            asideList: [], //显示的菜单列表
            showType: this.$store.getters['userCenter/getUser'].tenantId ? false : true,
            tableList: []
        }
    },
    mounted() {
        this.setUpList(this.options)
        this.fetchDate()
        this.menuPower()
    },
    methods: {
        /**
         * 左侧菜单权限
         */
        menuPower() {
            var self = this
            let powerList = this.$store.getters['userCenter/getOperationAuthority']
            if (powerList.length > 0) {
                let newList = []
                self.oldAsideList.forEach(function (item, index) {
                    let bMenuExist = self.hasPermission(item.powerName)
                    if (bMenuExist) {
                        newList.push(item)
                    }
                })
                self.asideList = newList
            } else {
                self.asideList = newList
            }
            this.$store.dispatch("smartLight/setLightChildMenuList", {
                data: self.asideList
            })
            if (!this.showType) {
                var item = JSON.parse(JSON.stringify(this.$store.getters['userCenter/getUser'].factory))
                item.id = item.tenantId
                this.jumpQR(item)
            }
        },
        setUpList(value) {
            for (let i = 0; i < value.length; i++) {
                value[i].value = value[i].label
                if (value[i].children !== undefined && value[i].children.length > 0) {
                    this.setUpList(value[i].children)
                }
            }
        },
        searchInfo() {
            this.pageObj.pageIndex = 1
            this.fetchDate()
        },
        PageTurning(page_obj) {
            this.pageObj.pageIndex = page_obj.page_index
            this.pageObj.pageSize = page_obj.page_size
            this.fetchDate()
        },
        fetchDate() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getCompanyList,
                params: {
                    pageNum: this.pageObj.pageIndex,
                    pageSize: this.pageObj.pageSize,
                    name: this.keywords,
                    address: (this.address !== '' && this.address !== null) ? this.address.join(',') : ''
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.tableList = res.data.data.list
                    this.pageObj.total = res.data.data.total
                } else {
                    this.$message({
                        type: 'error',
                        message: '查询失败，请刷新重试！'
                    })
                }
            })
        },
        jumpQR(item) {
            this.$store.dispatch("smartLight/setcurrCompany", {
                data: item
            })
            this.$store.dispatch("smartLight/setLightChildMenuPath", {
                data: this.asideList[0].links
            })
        },
        deleteEnt(item, index) {
            this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">确定删除该数据吗?</div><div class="contents">删除数据之后，数据将不可恢复。</div></div>', '', {
                customClass: 'deleteclass',
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: '确认删除',
                cancelButtonText: '取消'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                })
                this.tableList.splice(index, 1)
            })
        },
        handleChange() {
            console.log(this.address)
        }
    }
}