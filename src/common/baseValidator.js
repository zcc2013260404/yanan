const formValidate = {
	/*是否合法IP地址*/
	validateIP: (rule, value, callback) => {
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/;
			if ((!reg.test(value)) && value != '') {
				callback(new Error('请输入正确的IP地址'));
			} else {
				callback();
			}
		}
	},
	/*是否合法子网掩码地址*/
	validateMask: (rule, value, callback) => {
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			const reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
			if ((!reg.test(value)) && value != '') {
				callback(new Error('请输入正确的子网掩码'));
			} else {
				callback();
			}
		}
	},
	/*是否合法默认网关地址*/
	validateGateway: (rule, value, callback) => {
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			const reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/;
			if ((!reg.test(value)) && value != '') {
				callback(new Error('请输入正确的默认网关'));
			} else {
				callback();
			}
		}
	},
	/* 是否手机号码或者固话*/
	validatePhoneTwo: (rule, value, callback) => {
		const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;;
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			if ((!reg.test(value)) && value != '') {
				callback(new Error('请输入正确的电话号码或者固话号码'));
			} else {
				callback();
			}
		}
	},
	/* 是否固话*/
	validateTelphone: (rule, value, callback) => {
		let newValue = value.trim();
		if (/^0\d{2}-\d{7,8}$/.test(newValue) == false) {
			callback(new Error('请输入正确的电话号码  如010-1234567(8)'));
		} else {
			callback();
		}

	},
	/* 验证是否为汉字、字母或数字组成的2~20位字符*/
	validateContext: (rule, value, callback) => {
		const reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/;
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			if ((!reg.test(value)) && value != '') {
				callback(new Error('必须是汉字、字母或数字组成的2~20位字符'));
			} else {
				callback();
			}
		}
	},
	/* 是否身份证号码*/
	validateIdNo: (rule, value, callback) => {
		const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			if ((!reg.test(value)) && value != '') {
				callback(new Error('请输入正确的身份证号码'));
			} else {
				callback();
			}
		}
	},
	/* 合法uri*/
	validateURL: (textval) => {
		const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
		return urlregex.test(textval);
	},

	/*验证内容是否英文数字以及下划线*/
	isPassword: (rule, value, callback) => {
		const reg = /^[_a-zA-Z0-9]+$/;
		if (value == '' || value == undefined || value == null) {
			callback();
		} else {
			if (!reg.test(value)) {
				callback(new Error('密码仅由英文字母，数字以及下划线组成'));
			} else {
				callback();
			}
		}
	},

	/*自动检验数值的范围*/
	checkMax20000: (rule, value, callback) => {
		if (value == '' || value == undefined || value == null) {
			callback();
		} else if (!Number(value)) {
			callback(new Error('请输入[1,20000]之间的数字'));
		} else if (value < 1 || value > 20000) {
			callback(new Error('请输入[1,20000]之间的数字'));
		} else {
			callback();
		}
	},

	//验证数字输入框最大数值,32767
	checkMaxVal: (rule, value, callback) => {
		if (value < 0 || value > 32767) {
			callback(new Error('请输入[0,32767]之间的数字'));
		} else {
			callback();
		}
	},
	//验证是否1-99之间
	isOneToNinetyNine: (rule, value, callback) => {
		if (!value) {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入正整数'));
			} else {
				const re = /^[1-9][0-9]{0,1}$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入正整数，值为【1,99】'));
				} else {
					callback();
				}
			}
		}, 0);
	},

	// 验证是否整数  （租户管理最多设备数）
	isInteger: (rule, value, callback) => {
		if (!Number(value)) {
			callback(new Error('请输入正整数'));
		} else {
			const re = /^([1-9][0-9]{0,7}|100000000)$/;
			const rsCheck = re.test(value);
			if (!rsCheck) {
				callback(new Error('请输入大于0的正整数，最大为亿'));
			} else {
				callback();
			}
		}
	},
	// 验证是否整数,非必填
	isIntegerNotMust: (rule, value, callback) => {
		if (!value) {
			callback();
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入正整数'));
			} else {
				const re = /^[0-9]*[1-9][0-9]*$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入正整数'));
				} else {
					callback();
				}
			}
		}, 1000);
	},

	// 验证是否是[0-1]的小数
	isDecimal: (rule, value, callback) => {
		if (!value) {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入[0,1]之间的数字'));
			} else {
				if (value < 0 || value > 1) {
					callback(new Error('请输入[0,1]之间的数字'));
				} else {
					callback();
				}
			}
		}, 100);
	},

	// 验证是否是[1-10]的小数,即不可以等于0
	isBtnOneToTen: (rule, value, callback) => {
		if (typeof value == 'undefined') {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入正整数，值为[1,10]'));
			} else {
				if (!(value == '1' || value == '2' || value == '3' || value == '4' || value == '5' || value == '6' || value == '7' || value == '8' || value == '9' || value == '10')) {
					callback(new Error('请输入正整数，值为[1,10]'));
				} else {
					callback();
				}
			}
		}, 100);
	},
	// 验证是否是[1-100]的小数,即不可以等于0
	isBtnOneToHundred: (rule, value, callback) => {
		if (!value) {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入整数，值为[1,100]'));
			} else {
				if (value < 1 || value > 100) {
					callback(new Error('请输入整数，值为[1,100]'));
				} else {
					callback();
				}
			}
		}, 100);
	},
	// 验证是否是[0-100]的小数
	isBtnZeroToHundred: (rule, value, callback) => {
		if (!value) {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (!Number(value)) {
				callback(new Error('请输入[1,100]之间的数字'));
			} else {
				if (value < 0 || value > 100) {
					callback(new Error('请输入[1,100]之间的数字'));
				} else {
					callback();
				}
			}
		}, 100);
	},

	// 验证端口是否在[0,65535]之间
	isPort: (rule, value, callback) => {
		if (!value) {
			return callback(new Error('输入不可以为空'));
		}
		setTimeout(() => {
			if (value == '' || typeof (value) == undefined) {
				callback(new Error('请输入端口值'));
			} else {
				const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入在[0-65535]之间的端口值'));
				} else {
					callback();
				}
			}
		}, 100);
	},
	// 验证端口是否在[0,65535]之间，非必填,isMust表示是否必填
	isCheckPort: (rule, value, callback) => {
		if (!value) {
			callback();
		}
		setTimeout(() => {
			if (value == '' || typeof (value) == undefined) {
				//callback(new Error('请输入端口值'));
			} else {
				const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
				const rsCheck = re.test(value);
				if (!rsCheck) {
					callback(new Error('请输入在[0-65535]之间的端口值'));
				} else {
					callback();
				}
			}
		}, 100);
	},

	/* 小写字母*/
	validateLowerCase: (str) => {
		const reg = /^[a-z]+$/;
		return reg.test(str);
	},
	/*保留2为小数*/
	validatetoFixedNew: (str) => {
		return str;
	},

	/* 大写字母*/
	validateUpperCase: (str) => {
		const reg = /^[A-Z]+$/;
		return reg.test(str);
	},
	/* 大小写字母*/
	validateAlphabets: (str) => {
		const reg = /^[A-Za-z]+$/;
		return reg.test(str);
	},
	/**
	 * 验证姓名
	 */
	validateName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^([\u4e00-\u9fa5]|[a-zA-Z]){1}[\u4e00-\u9fa5a-z0-9A-Z]{1,19}$/;
		if (!reg.test(newValue)) {
			callback(new Error("姓名必须是汉字、字母或数字组成的2~20位字符,不能以数字开头"));
		} else {
			callback();
		}
	},
	/**
	 * 验证租户姓名
	 */
	validateTenantName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /(^[\u4e00-\u9fa5]{2,6}$)|(^[a-zA-Z]{3,20}$)/;
		if (!reg.test(newValue)) {
			callback(new Error("联系人姓名必须是2-6个纯汉字或者3~20位纯英文字母"));
		} else {
			callback();
		}
	},
	/**
	 * 验证登陆名
	 */
	validateLoginName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9]{3,20}$/
		if (!reg.test(newValue)) {
			callback(new Error("用户名必须是字母和数字组成的3~20位字符!"));
		} else {
			callback();
		}
	},
	/**
	 * 验证租户名
	 */
	validateTenantLoginName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/
		if (!reg.test(newValue)) {
			callback(new Error("集团名称必须是汉字、字母或数字组成的2~20位字符"));
		} else {
			callback();
		}
	},
	/**
	 * 验证用户名
	 */
	validateUserName: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入用户名(2~20个字符)'));
		} else if (newValue.length < 2 || newValue.length > 20) {
			callback(new Error('用户名必须是2~20个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证密码
	 */
	validatePassword: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9]{6,15}$/
		if (rule.required) {
			if (newValue.length == 0) {
				callback(new Error('请输入密码(字母、数字组成的6~15位字符)'));
			} else if (!reg.test(newValue)) {
				callback(new Error('密码必须是字母、数字组成的6~15位字符'));
			} else {
				callback();
			}
		} else {
			if (newValue.length > 0 && !reg.test(newValue)) {
				callback(new Error('密码必须是字母、数字组成的6~15位字符'));
			} else {
				callback();
			}
		}
	},
	/**
	 * 验证邮箱
	 */
	validateEmail: (rule, value, callback) => {
		let newValue = value.trim();

		if (/^([a-z0-9A-Z]+[-|_\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(newValue) == false) {
			// if(/^([A-Za-z0-9\u4e00-\u9fa5]|[0-9])(\w|\-)+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(newValue)==false){
			callback(new Error("邮箱无效!"));
		} else {
			callback();
		}
	},
	/**
	 * 验证手机号
	 */
	validatePhone: (rule, value, callback) => {
		let newValue = value.trim();
		if (/^1[3456789]\d{9}$/.test(newValue) == false) {
			callback(new Error("手机号码无效!"));
		} else {
			callback();
		}
	},
	/**
	 * 验证角色名称
	 */
	validateRoleName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入角色(汉字、字母或数字组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('角色名必须是汉字、字母或数字组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证角色描述
	 */
	validateRoleDesc: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入角色描述(汉字、字母或数字组成的2~50位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('角色描述必须是汉字、字母或数字组成的2~50位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证属性id
	 */
	validateAttrSetId: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入属性ID(2~50个字符)'));
		} else if (newValue.length < 2 || newValue.length > 50) {
			callback(new Error('属性ID必须是2~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证参数名称
	 */
	validateParameterName: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入名称(2~50个字符)'));
		} else if (newValue.length < 2 || newValue.length > 50) {
			callback(new Error('名称必须是2~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证参数描述
	 */
	validateParameterDesc: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入描述(2~50个字符)'));
		} else if (newValue.length < 2 || newValue.length > 50) {
			callback(new Error('描述必须是2~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证区域部门
	 */
	validateDeviceOrg: (rule, value, callback) => {
		let newValue = value;
		if (newValue.length == 0) {
			callback(new Error('请选择区域1'));
		} else {
			callback();
		}
	},
	/**
	 * 验证工业设备名称
	 */
	validateDeviceName: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入名称(2~50个字符)'));
		} else if (newValue.length < 2 || newValue.length > 50) {
			callback(new Error('名称必须是2~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证工业设备描述
	 */
	validateDeviceDesc: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length > 50) {
			callback(new Error('描述必须是0~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证网络设备SN
	 */
	validateLicense: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[\u4e00-\u9fa5a-zA-Z0-9\w]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入字母数字下划线组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('字母数字下划线组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证公司名称
	 */
	validateCompanyName: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入公司名称(2~50个字符)'));
		} else if (newValue.length < 2 || newValue.length > 50) {
			callback(new Error('公司名称必须是2~50个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证商务人员姓名
	 */
	validateBusinessman: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z\u4e00-\u9fa5]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入商务人员姓名(汉字、字母组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('商务人员姓名必须是汉字、字母组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证施工人员姓名
	 */
	validateConstructor: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z\u4e00-\u9fa5]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入施工人员姓名(汉字、字母组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('施工人员姓名必须是汉字、字母组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证开关名称
	 */
	validateSwitchName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入开关名称(汉字、字母或数字组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('开关名称必须是汉字、字母或数字组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证任务名称
	 */
	validateTimingName: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入任务名称(2~20个字符)'));
		} else if (newValue.length < 2 || newValue.length > 20) {
			callback(new Error('任务名称必须是2~20个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证任务描述
	 */
	validateDescription: (rule, value, callback) => {
		let newValue = value.trim();
		if (newValue.length == 0) {
			callback(new Error('请输入任务描述(2~100个字符)'));
		} else if (newValue.length < 2 || newValue.length > 100) {
			callback(new Error('任务描述必须是2~100个字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证区域名称
	 */
	validateAreaName: (rule, value, callback) => {
		let newValue = value.trim();
		let reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入区域名称(汉字、字母或数字组成的2~20位字符)'));
		} else if (!reg.test(newValue)) {
			callback(new Error('区域名称必须是汉字、字母或数字组成的2~20位字符'));
		} else {
			callback();
		}
	},
	/**
	 * 验证灯瓦数名称
	 */
	validateBrightness: (rule, value, callback) => {
		let newValue = (value + '').trim();
		let reg = /^[1-9][0-9]{0,2}$/;
		if (newValue.length == 0) {
			callback(new Error('请输入1~999的整数'));
		} else if (!reg.test(newValue)) {
			callback(new Error('请输入1~999的整数'));
		} else {
			callback();
		}
	}
};
export default formValidate;