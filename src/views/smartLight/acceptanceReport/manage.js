import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'
export default {
    components: {
        leftmenu,
        Pagination,
        SecondBreadcrumb
    },
    data() {
        return {
            loading: false,
            companyName: '',
            dialogs: false,
            tableList: [],
            tableAllList: [],
            keys: '',
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            dimming: '',
            timed: '',
            onOff: '',
            startTime: '',
            endTime: '',
            errorInfo: '',
            msgList: [],
            sn: '',
            areaValue: '',
            areaList: [],
            testList: [{
                    id: '1',
                    name: '开灯'
                },
                {
                    id: '2',
                    name: '调光'
                },
                {
                    id: '3',
                    name: '关灯'
                }
            ],
            testValue: [],
            resultValue: '',
            resultList: [{
                    id: '1',
                    name: '合格'
                },
                {
                    id: '0',
                    name: '不合格'
                }
            ],
            isFinish: false,
            heNum: 0
        }
    },
    mounted() {
        let company = null
        if (this.$store.getters['smartLight/getcurrCompany']) {
            company = this.$store.getters['smartLight/getcurrCompany']
        }
        if (company) {
            this.companyName = company.name
            this.startTime = company.startTime
            this.endTime = company.endTime
        }
        this.getAreaLists()
    },
    methods: {
        searchInfo() {
            this.pageObj.pageIndex = 1
            this.fetchDate()
        },
        // 获取区域列表
        getAreaLists() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getAreaList
            }).then((res) => {
                if (res.data.code === 0) {
                    this.areaList = res.data.data
                }
            })
        },
        PageTurning(page_obj) {
            this.pageObj.pageIndex = page_obj.page_index
            this.pageObj.pageSize = page_obj.page_size
            this.fetchDate()
        },
        fetchDate() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.findLampList,
                params: {
                    pageNum: this.pageObj.pageIndex,
                    pageSize: this.pageObj.pageSize,
                    areaId: this.areaValue,
                    sn: this.sn,
                    onOffBri: (this.testValue !== null && this.testValue.length > 0) ? this.testValue.join(',') : '',
                    result: this.resultValue
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
        allDate() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.findLampList,
                params: {
                    pageNum: 1,
                    pageSize: 99999999
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.tableAllList = res.data.data.list
                    this.heNum = 0
                    for (const item of this.tableAllList) {
                        if (item.off === '1' && item.dimming === '1' && item.ons === '1') {
                            this.heNum = this.heNum + 1
                        }
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '查询失败，请刷新重试！'
                    })
                }
            })
        },
        exportExcel() {
            let requestUrl = this.API.leansite.baseURL + '/inspectionReport/exportExcel?areaId=' + this.areaValue + '&sn=' + this.sn + '&onOffBri=' + ((this.testValue !== null && this.testValue.length > 0) ? this.testValue.join(',') : '') + '&result=' + this.resultValue
            window.open(encodeURI(requestUrl))
        },
        jumpCompany() {
            this.$store.dispatch("smartLight/setLightChildMenuPath", {
                data: '/enterprisesList'
            })
        },
        getText() {
            this.tableList = []
            this.loading = true
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.executeInspection
            }).then((res) => {
                if (res.data.code === 0) {
                    this.keys = res.data.data
                    this.msgList = []
                    this.isFinish = false
                    this.getResults()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        },
        getResults() {
            if (this.keys === '') {
                this.loading = false
                return
            }
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getResult,
                params: {
                    key: this.keys
                }
            }).then((res) => {
                if (res.data.data === null) {
                    const self = this
                    setTimeout(() => {
                        self.getResults()
                    }, 1000)
                } else {
                    if (res.data.data.length > 0) {
                        res.data.data.forEach(item => {
                            const keyindex = this.msgList.findIndex((chitem, chindex) => {
                                return chitem === item.msg
                            })
                            if (keyindex === undefined || keyindex === null || keyindex < 0) {
                                this.msgList.push(item.msg)
                            }
                        })
                        if (res.data.data[res.data.data.length - 1].code === 1) {
                            const self = this
                            setTimeout(() => {
                                self.getResults()
                            }, 1000)
                        } else {
                            this.errorInfo = ''
                            if (res.data.data[res.data.data.length - 1].code === 0) {
                                this.areaValue = ''
                                this.testValue = ''
                                this.sn = ''
                                this.resultValue = ''
                                this.isFinish = true
                                this.fetchDate()
                            }
                            this.keys = ''
                            this.loading = false
                        }
                    }
                }
            }).catch((res) => {
                this.loading = false
            })
        },
        openPDF() {
            this.dialogs = true
            this.allDate()
        },
        downloadPDF() {
            var that = this
            var target = document.getElementById("pdfreport")
            //target.style.background = "#FFFFFF"
            html2canvas(target, {
                "imageTimeout": 0,
                'scale': 2,
            }).then(canvas => {
                var contentWidth = canvas.width
                var contentHeight = canvas.height
                //一页pdf显示html页面生成的canvas高度
                var pageHeight = contentWidth / 592.28 * 841.89
                //未生成pdf的html页面高度
                var leftHeight = contentHeight
                //页面偏移
                var position = 0
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28
                var imgHeight = 592.28 / contentWidth * contentHeight
                var pageData = canvas.toDataURL('image/jpeg', 1.0)
                var pdf = new jspdf('', 'pt', 'a4')

                //有两个高度需区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        //避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage()
                        }
                    }
                }
                var name = this.companyName + '智慧照明验收报告.pdf' // 定义生成的pdf的文件名字
                pdf.save(name)
                this.dialogs = false
            })
        }
    },
    destroyed() {
        this.keys = ''
    }
}