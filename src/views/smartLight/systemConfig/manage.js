import leftmenu from './../leftMenu'
import Pagination from '../../../components/Pagination.vue'
import SecondBreadcrumb from '../../../components/SecondBreadcrumb'
const validateParameterDesc = (rule, value, callback) => {
	let newValue = value.trim()
	console.log(newValue)
	if (!Number(newValue) && value !== '0') {
		callback(new Error('请输入正确有效的数字'))
	} else {
		callback()
	}
}
const validateParameterDescs = (rule, value, callback) => {
	let newValue = value.trim()
	console.log(newValue)
	if (!Number(newValue) && value !== '0') {
		callback(new Error('请输入正确有效的数字'))
	} else if (parseFloat(newValue) > 24) {
		callback(new Error('每天运行时长在0~24小时'))
	} else if (value.indexOf('.') !== -1 && (value.substring(value.indexOf('.'))).length > 2) {
		callback(new Error('每日运行时长小数点保留一位'))
	} else {
		callback()
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
			machineForm: {
				lightNum: '',
				singleLightW: '',
				dayRunTime: '',
				wifipwd: '',
				lightIntensity: '',
				delayTime: ''
			},
			wifimachineForm: {
				wifipwd: ''
			},
			lightmachineForm: {
				lightIntensity: ''
			},
			peoplemachineForm: {
				delayTime: '',
				triggerValue: '',
				lowValue: '',
				hiValue: '',
				status: true
			},
			companyName: '',
			company: null,
			rules: {
				lightNum: [{
						required: true,
						message: '请输入灯数',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							let newValue = value.trim()
							console.log(newValue)
							if (!Number(newValue) && value !== '0') {
								callback(new Error('请输入灯数(1~10000)'))
							} else if (parseInt(newValue) > 10000) {
								callback(new Error('请输入灯数(1~10000)'))
							} else {
								callback()
							}
						},
						trigger: 'blur'
					}
				],
				singleLightW: [{
						required: true,
						message: '请输入单灯功率',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							let newValue = value.trim()
							console.log(newValue)
							if (!Number(newValue) && value !== '0') {
								callback(new Error('请输入功率(1~1000)'))
							} else if (parseInt(newValue) > 1000) {
								callback(new Error('请输入功率(1~1000)'))
							} else {
								callback()
							}
						},
						trigger: 'blur'
					}
				],
				dayRunTime: [{
						required: true,
						message: '请输入每日运行时长',
						trigger: 'blur'
					},
					{
						validator: validateParameterDescs,
						trigger: 'blur'
					}
				],
				wifipwd: [{
					required: true,
					message: '请输入统一Wifi密码',
					trigger: 'blur'
				}],
				lightIntensity: [{
						required: true,
						message: '请输入光感强度',
						trigger: 'blur'
					},
					{
						validator: validateParameterDesc,
						trigger: 'blur'
					}
				],
				delayTime: [{
						required: true,
						message: '请输入人感延迟时间',
						trigger: 'blur'
					},
					{
						validator: validateParameterDesc,
						trigger: 'blur'
					}
				],
				triggerValue: [{
						required: true,
						message: '请输入人感触发阈值',
						trigger: 'blur'
					},
					{
						validator: validateParameterDesc,
						trigger: 'blur'
					}
				],
				lowValue: [{
						required: true,
						message: '请输入人感目标最低亮度',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							let newValue = value.trim()
							console.log(newValue)
							if (!Number(newValue)) {
								callback(new Error('请输入正确有效的数字'))
							} else if (this.peoplemachineForm.hiValue !== '') {
								if (parseInt(this.peoplemachineForm.hiValue) <= parseInt(newValue)) {
									callback(new Error('人感目标最低亮度必须小于最高亮度'))
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
						message: '请输入人感目标最高亮度',
						trigger: 'blur'
					},
					{
						validator: (rule, value, callback) => {
							let newValue = value.trim()
							console.log(newValue)
							if (!Number(newValue)) {
								callback(new Error('请输入正确有效的数字'))
							} else if (this.peoplemachineForm.lowValue !== '') {
								if (parseInt(this.peoplemachineForm.lowValue) >= parseInt(newValue)) {
									callback(new Error('人感目标最高亮度必须大于最低亮度'))
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
			}
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
		this.fetchDate()
	},
	methods: {
		fetchDate() {
			this.$axios
				.leansite({
					method: 'get',
					url: this.API.leansite.getSysConfig,
					params: {
						tenantId: this.$store.getters['userCenter/getUser'].tenantId
					}
				})
				.then((res) => {
					if (res.data.data !== null && res.data.data.ledCount !== undefined) {
						this.machineForm.lightNum = res.data.data.ledCount + ''
						this.machineForm.singleLightW = res.data.data.ledPower + ''
						this.machineForm.dayRunTime = res.data.data.ledOpentime + ''
					}
				})
			// this.$axios
			// 	.leansite({
			// 		method: 'get',
			// 		url: this.API.leansite.wifiConfig
			// 	})
			// 	.then((res) => {
			// 		if (res.data.data !== null && res.data.data.wifi !== undefined) {
			// 			this.wifimachineForm.wifipwd = res.data.data.wifi + ''
			// 		}
			// 	})
			// this.$axios
			// 	.leansite({
			// 		method: 'get',
			// 		url: this.API.leansite.luminanceConfig
			// 	})
			// 	.then((res) => {
			// 		if (res.data.data !== null && res.data.data.luminance !== undefined) {
			// 			this.lightmachineForm.lightIntensity = res.data.data.luminance + ''
			// 		}
			// 	})
			// this.$axios
			// 	.leansite({
			// 		method: 'get',
			// 		url: this.API.leansite.peopleConfig
			// 	})
			// 	.then((res) => {
			// 		if (res.data.data !== null && res.data.data.timeLong !== undefined) {
			// 			this.peoplemachineForm.delayTime = res.data.data.timeLong + ''
			// 			this.peoplemachineForm.triggerValue = res.data.data.feelValue + ''
			// 			this.peoplemachineForm.lowValue = res.data.data.minValue + ''
			// 			this.peoplemachineForm.hiValue = res.data.data.maxValue + ''
			// 			this.peoplemachineForm.status = res.data.data.status === 0
			// 		}
			// 	})
		},
		jumpCompany() {
			this.$store.dispatch('smartLight/setLightChildMenuPath', {
				data: '/enterprisesList'
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false
				}
				if (formName === 'machineForm') {
					this.$axios
						.leansite({
							method: 'post',
							url: this.API.leansite.saveSysConfig,
							data: {
								ledCount: this.machineForm.lightNum,
								ledOpentime: this.machineForm.dayRunTime,
								ledPower: this.machineForm.singleLightW
							}
						})
						.then((res) => {
							if (res.data.code === 0) {
								this.$message({
									type: 'success',
									message: '保存成功！'
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
								wifi: this.wifimachineForm.wifipwd
							}
						})
						.then((res) => {
							if (res.data.code === 0) {
								this.$message({
									type: 'success',
									message: '保存成功！'
								})
							} else {
								this.$message({
									type: 'error',
									message: res.data.msg
								})
							}
						})
				} else if (formName === 'lightmachineForm') {
					this.$axios
						.leansite({
							method: 'post',
							url: this.API.leansite.luminanceSave,
							data: {
								luminance: this.lightmachineForm.lightIntensity
							}
						})
						.then((res) => {
							if (res.data.code === 0) {
								this.$message({
									type: 'success',
									message: '保存成功！'
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
								feelValue: this.peoplemachineForm.triggerValue,
								maxValue: this.peoplemachineForm.hiValue,
								minValue: this.peoplemachineForm.lowValue,
								status: this.peoplemachineForm.status ? '0' : '1',
								timeLong: this.peoplemachineForm.delayTime
							}
						})
						.then((res) => {
							if (res.data.code === 0) {
								this.$message({
									type: 'success',
									message: '保存成功！'
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
	}
}