import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import baseValidator from '../../../common/baseValidator.js'
export default {
	components: {
		leftmenu,
		Pagination
	},
	data() {
		return {
			dialogVisible: false,
			tableData: [],
			currentId: '',
			editIndex: 0,
			pageObj: {
				pageIndex: this.API.leansite.constObj.pageIndex, //当前页码
				total: 0, //数据总数
				pageSize: this.API.leansite.constObj.pageSize //页大小
			},
			machineForm: {
				name: '',
				code: ''
			},
			editResult: null,
			rules: {
				name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					},
					{
						validator: baseValidator.validateDeviceName,
						trigger: 'blur'
					}
				],
				code: [{
					required: true,
					message: '请输入Code',
					trigger: 'blur'
				}]
			},
			disabled: false
		}
	},
	mounted() {
		this.fetchDate()
	},
	methods: {
		fetchDate() {
			this.$axios
				.leansite({
					method: 'get',
					url: this.API.leansite.faultCodeList,
					params: {
						pageNum: this.pageObj.pageIndex,
						pageSize: this.pageObj.pageSize
					}
				})
				.then((res) => {
					if (res.data.code === 0) {
						this.tableData = []
						for (const item of res.data.data.list) {
							this.tableData.push({
								id: item.id,
								name: item.name,
								code: item.code,
								content: item.content,
								isEdit: false
							})
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
		PageTurning(page_obj) {
			this.pageObj.pageIndex = page_obj.page_index
			this.pageObj.pageSize = page_obj.page_size
			this.fetchDate()
		},
		editItem(item, index) {
			this.editResult = JSON.parse(JSON.stringify(this.tableData[index]))
			this.tableData[index].isEdit = true
			this.currentId = item.id
			this.editIndex = index
		},
		cancelEdit(index) {
			this.tableData[index].isEdit = false
			this.tableData[index].name = this.editResult.name
			this.tableData[index].code = this.editResult.code
			console.log(this.tableData)
			this.editResult = null
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false
				}
				this.disabled = true
				this.$axios
					.leansite({
						method: 'post',
						url: this.API.leansite.saveFaultCode,
						data: {
							name: this.machineForm.name,
							code: this.machineForm.code
						}
					})
					.then((res) => {
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
		editsubmitForm() {
			if (this.tableData[this.editIndex].name === '') {
				this.$message({
					type: 'error',
					message: '请输入名称'
				})
				return
			}
			if (this.tableData[this.editIndex].code === '') {
				this.$message({
					type: 'error',
					message: '请输入代码'
				})
				return
			}
			this.$axios
				.leansite({
					method: 'post',
					url: this.API.leansite.saveFaultCode,
					data: {
						name: this.tableData[this.editIndex].name,
						code: this.tableData[this.editIndex].code,
						id: this.currentId
					}
				})
				.then((res) => {
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '修改成功！'
						})
						this.fetchDate()
					} else {
						this.$message({
							type: 'error',
							message: res.data.msg
						})
					}
				})
		},
		resetFrom(formName) {
			this.$refs[formName].resetFields()
		},
		deleteEnt(item, index) {
			this.$confirm('<div class="iconsde">&nbsp;</div><div><div class="headers">删除代码?</div><div class="contents">删除代码之后，信息将不可恢复。</div></div>', '', {
				customClass: 'deleteclass',
				dangerouslyUseHTMLString: true,
				showClose: false,
				confirmButtonText: '确认删除',
				cancelButtonText: '取消'
			}).then(() => {
				this.$axios
					.leansite({
						method: 'get',
						url: this.API.leansite.deleteFaultCode,
						params: {
							ids: item.id
						}
					})
					.then((res) => {
						if (res.data.code === 0) {
							this.$message({
								type: 'success',
								message: '删除成功！'
							})
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