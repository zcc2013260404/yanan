import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import baseValidator from '../../../common/baseValidator.js'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
import {
    regionData
} from 'element-china-area-data'

const validateDeviceName = (rule, value, callback) => {
    let newValue = value.trim();
    if (newValue.length == 0) {
        callback(new Error('请输入(2~10个字符)'));
    } else if (newValue.length < 2 || newValue.length > 10) {
        callback(new Error('必须是2~10个字符'));
    } else {
        callback();
    }
}
const validateDeviceName1 = (rule, value, callback) => {
    let newValue = value.trim();
    if (newValue.length == 0) {
        callback(new Error('请输入(2~50个字符)'));
    } else if (newValue.length < 2 || newValue.length > 10) {
        callback(new Error('必须是2~50个字符'));
    } else {
        callback();
    }
}
const validateDeviceContent = (rule, value, callback) => {
    let newValue = value.trim();
    if (newValue.length == 0) {
        callback(new Error('请输入(2~1000个字符)'));
    } else if (newValue.length < 2 || newValue.length > 1000) {
        callback(new Error('必须是2~1000个字符'));
    } else {
        callback();
    }
}
export default {
    components: {
        leftmenu,
        Pagination,
        SecondBreadcrumb
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
            datavalue: [],
            startTime: '', //搜索开始时间
            endTime: '', //搜索结束时间
            startpickerOptions: {
                disabledDate: (time) => {
                    if (this.endTime !== "" && this.endTime !== null) {
                        return time.getTime() > this.endTime
                    } else {
                        return false
                    }

                },
            }, //开始日期配置
            endpickerOptions: {
                disabledDate: (time) => {
                    if (this.startTime != '' && this.startTime != null) {
                        return time.getTime() < this.startTime
                    } else {
                        return false
                    }

                },
            }, //结束日期配置
            questions: '',
            companyName: '',
            options: regionData, //省级联动数据
            dialogVisible: false,
            addDialog: false,
            machineForm: {
                content: '',
                linkMan: '',
                phone: '',
                title: '',
                filePath: ''
            },
            actionUrl: '',
            fileList: [],
            rules: {
                content: [{
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    },
                    {
                        validator: validateDeviceContent,
                        trigger: 'blur'
                    }
                ],
                linkMan: [{
                        required: true,
                        message: '请输入联系人',
                        trigger: 'blur'
                    },
                    {
                        validator: validateDeviceName,
                        trigger: 'blur'
                    }
                ],
                title: [{
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        validator: validateDeviceName1,
                        trigger: 'blur'
                    }
                ],
                phone: [{
                        required: false,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    },
                    {
                        validator: baseValidator.validatePhoneTwo,
                        trigger: 'blur'
                    }
                ]
            },
            textarea: '',
            currentId: '',
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            questionInfo: {
                sn: '',
                title: '',
                createTime: '',
                linkMan: '',
                phone: '',
                content: '',
                createUser: '',
                name: '',
                fileName: '',
                questionAnswer: [],
                id: ''
            },
            value: '',
            companyOptions: [],
            dataId: '',
            tableList: [],
            company: null,
            disabled: false
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
        this.getCompany()
        this.fetchDate()
    },
    methods: {
        /**
         * 文件上传之前 判断格式
         */
        beforeFile(file) {
            let name = file.name
            let type = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
            // if (type != 'gz' && type != 'rar' && type != 'zip') {
            //   this.$message({
            //     type: 'warning',
            //     message: '请上传gz/rar/zip格式图片！'
            //   })
            //   return false
            // }
            this.fileList = [file]
        },
        removeFile(file, fileList) {
            this.fileList = []
            this.machineForm.filePath = ''
        },
        uploadImage(item) {
            let formDatas = new FormData()
            formDatas.append('file', item.file)
            formDatas.append('isAdd', true)
            this.$axios
                .leansite({
                    method: 'POST',
                    url: this.API.leansite.upLoadImg,
                    data: formDatas,
                    heards: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    if (res.data.code == 0) {
                        this.machineForm.filePath = res.data.data.dataId
                        let self = this
                        setTimeout(() => {
                            self.$refs.machineForm.validateField('filePath')
                        }, 500)
                        this.$message({
                            type: 'success',
                            message: '上传成功！'
                        })
                    }
                })
        },
        download() {
            let requestUrl = this.API.leansite.baseURL + 'attachment/downByPath?path=' + this.dataId
            console.log(requestUrl)
            window.open(encodeURI(requestUrl))
        },
        jumpCompany() {
            this.$store.dispatch(smartLight / setLightChildMenuPath, {
                data: '/enterprisesList'
            })
        },
        getCompany() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.afterQuestionCompanyList,
                params: {}
            }).then((res) => {
                this.companyOptions = res.data.data
            })
        },
        searchInfo() {
            this.pageObj.pageIndex = 1
            this.fetchDate()
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
                url: this.API.leansite.afterQuestionList,
                params: {
                    pageNum: this.pageObj.pageIndex,
                    pageSize: this.pageObj.pageSize,
                    sn: this.questions,
                    tenantId: this.keywords,
                    startDate: startDate,
                    endDate: endDate
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
        PageTurning(page_obj) {
            this.pageObj.pageIndex = page_obj.page_index
            this.pageObj.pageSize = page_obj.page_size
            this.fetchDate()
        },
        resetFrom(formName) {
            this.$refs[formName].resetFields()
        },
        getInfo(item) {
            this.dataId = item.filePath ? item.filePath : ''
            this.questionInfo = {
                sn: item.sn,
                title: item.title,
                createTime: item.createTime,
                linkMan: item.linkMan,
                phone: item.phone,
                content: item.content,
                name: item.name,
                createUser: item.createUser,
                fileName: item.filePath ? item.fileName + item.filePath.substring(item.filePath.lastIndexOf('.')) : '',
                questionAnswer: item.questionAnswer,
                id: item.id
            }
            this.textarea = ''
            this.dialogVisible = true
        },
        addProblem() {
            this.machineForm = {
                content: '',
                linkMan: '',
                phone: '',
                title: ''
            }
            this.addDialog = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.disabled = true
                this.$axios.leansite({
                        method: 'post',
                        url: this.API.leansite.questionSave,
                        data: {
                            content: this.machineForm.content,
                            linkMan: this.machineForm.linkMan,
                            phone: this.machineForm.phone,
                            title: this.machineForm.title,
                            fileId: this.machineForm.filePath
                        }
                    }).then((res) => {
                        this.disabled = false
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            })
                            this.$refs[formName].resetFields()
                            this.addDialog = false
                            this.fetchDate()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            })
                        }
                    })
                    .catch(err => {
                        this.disabled = false
                    })
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
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.deleteQuestion,
                    params: {
                        ids: item.id
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        if (this.tableList.length === 1 && this.pageObj.pageIndex > 1) {
                            this.pageObj.pageIndex = this.pageObj.pageIndex - 1
                        }
                        this.fetchDate()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
            })
        },
        handleChange() {
            console.log(this.address)
        },
        replyInfo() {
            if (this.textarea === '') {
                this.$message({
                    type: 'error',
                    message: '请填写回复内容！'
                })
                return
            }
            this.$axios.leansite({
                method: 'post',
                url: this.API.leansite.answerSave,
                data: {
                    questionId: this.questionInfo.id,
                    answer: this.textarea
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '处理成功！'
                    })
                    if (this.tableList.length === 1 && this.pageObj.pageIndex > 1) {
                        this.pageObj.pageIndex = this.pageObj.pageIndex - 1
                    }
                    this.dialogVisible = false
                    this.fetchDate()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        }
    }
}