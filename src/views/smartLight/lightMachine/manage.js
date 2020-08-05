import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import baseValidator from '../../../common/baseValidator.js'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
const validateDeviceName = (rule, value, callback) => {
    let newValue = value.trim();
    if (newValue.length == 0) {
        callback(new Error('请输入(2~20个包含中文字母数字的字符)'));
    } else if (newValue.length < 2 || newValue.length > 20) {
        callback(new Error('必须是2~20个包含中文字母数字的字符'));
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
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            keywords: '',
            companyName: '',
            currentId: '',
            pageObj: {
                pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
                total: 0, //数据总数
                pageSize: this.API.leansite.constObj.pageSize, //页大小
            },
            machineForm: {
                name: '',
                sn: '',
                ip: ''
            },
            editmachineForm: {
                name: '',
                sn: '',
                ip: ''
            },
            rules: {
                name: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    },
                    {
                        validator: validateDeviceName,
                        trigger: 'blur'
                    }
                ],
                sn: [{
                        required: true,
                        message: '请输入SN',
                        trigger: 'blur'
                    },
                    {
                        validator: baseValidator.validateLicense,
                        trigger: 'blur'
                    }
                ],
                ip: [{
                        required: true,
                        message: '请输入IP',
                        trigger: 'blur'
                    },
                    {
                        validator: baseValidator.validateIP,
                        trigger: 'blur'
                    }
                ]
            },
            disabled: false
        }
    },
    mounted() {
        let company = null
        if (this.$store.getters['smartLight/getcurrCompany']) {
            company = this.$store.getters['smartLight/getcurrCompany']
        }
        if (company) {
            this.companyName = company.name
        }
        this.fetchDate()
    },
    methods: {
        fetchDate() {
            this.$axios.leansite({
                method: 'get',
                url: this.API.leansite.getComputerByPage,
                params: {
                    pageNum: this.pageObj.pageIndex,
                    pageSize: this.pageObj.pageSize,
                    name: this.keywords
                }
            }).then((res) => {
                if (res.data.code === 0) {
                    this.tableData = res.data.data.list
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
        editItem(item) {
            this.dialogVisible = true
            this.currentId = item.id
            this.editmachineForm.name = item.name
            this.editmachineForm.sn = item.sn
            this.editmachineForm.ip = item.ip
        },
        jumpCompany() {
            this.$store.dispatch("smartLight/setLightChildMenuPath", {
                data: '/enterprisesList'
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.disabled = true
                this.$axios.leansite({
                        method: 'post',
                        url: this.API.leansite.saveComputer,
                        data: {
                            sn: this.machineForm.sn,
                            name: this.machineForm.name,
                            ip: this.machineForm.ip
                        }
                    }).then((res) => {
                        this.disabled = false
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            })
                            this.$refs[formName].resetFields()
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
        editsubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false
                }
                this.$axios.leansite({
                    method: 'post',
                    url: this.API.leansite.saveComputer,
                    data: {
                        id: this.currentId,
                        sn: this.editmachineForm.sn,
                        name: this.editmachineForm.name,
                        ip: this.editmachineForm.ip
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        })
                        this.dialogVisible = false
                        this.$refs[formName].resetFields()
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
        resetFrom(formName) {
            this.$refs[formName].resetFields()
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
                    url: this.API.leansite.deleteComputerList,
                    params: {
                        ids: item.id
                    }
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        })
                        if (this.tableData.length === 1 && this.pageObj.pageIndex > 1) {
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
        }
    }
}