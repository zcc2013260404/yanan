import vue from 'vue';
import api from "../../common/api.js" //引入接口 
/**
 * 智慧照明模块
 */
const state = {
	lightChildMenuPath: null, //智慧照明企业子菜单路径
	lightChildMenuList: null, // 智慧照明企业子菜单权限列表
	currCompany: null, // 当前选中的公司名
};
//修改state中的值
const mutations = {
	/**
	 * 操作lightChildMenuPath
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_lightChildMenuPath(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "lightChildMenuPath", oOptData.data);
			if (state.lightChildMenuPath) { //判断state中的该属性是否已存在
				state.lightChildMenuPath = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'lightChildMenuPath', oOptData.data);
			}
		} else {
			localStorage.removeItem("lightChildMenuPath");
			vue.delete(state, 'lightChildMenuPath');
		}
	},
	/**
	 * 操作lightChildMenuList
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_lightChildMenuList(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "lightChildMenuList", JSON.stringify(oOptData.data));
			if (state.lightChildMenuList) { //判断state中的该属性是否已存在
				state.lightChildMenuList = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'lightChildMenuList', oOptData.data);
			}
		} else {
			localStorage.removeItem("lightChildMenuList");
			vue.delete(state, 'lightChildMenuList');
		}
	},
	/**
	 * 操作currCompany
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_currCompany(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "currCompany", JSON.stringify(oOptData.data));
			if (state.currCompany) { //判断state中的该属性是否已存在
				state.currCompany = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'currCompany', oOptData.data);
			}
		} else {
			localStorage.removeItem("currCompany");
			vue.delete(state, 'currCompany');
		}
	},
	/**
	 * 清空该模块下所有数据
	 * 该方法各个模块下建议添加上
	 */
	clear_moduleStore(state) {
		let oState = {
			...state
		};
		for (let k in oState) {
			localStorage.removeItem(api.constObj.projectName + k);
			vue.delete(state, k);
		}
	}
};
// 接收组件的发送过来的请求，提交给mutations处理 
const actions = {
	/**
	 * 设置lightChildMenuPath数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setLightChildMenuPath: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: '',
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save") {
			oNewObj.data = dataValue;
		}
		store.commit('set_lightChildMenuPath', oNewObj);
	},
	/**
	 * 设置lightChildMenuList数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setLightChildMenuList: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: {},
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save" && typeof dataValue != "string") {
			oNewObj.data =dataValue;
		}
		store.commit('set_lightChildMenuList', oNewObj);
	},
	/**
	 * 设置currCompany数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setcurrCompany: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: {},
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save" && typeof dataValue != "string") {
			oNewObj.data = dataValue;
		}
		store.commit('set_currCompany', oNewObj);
	},
	/**
	 * 清空该模块下所有数据
	 * 该方法各个模块下建议添加上
	 */
	clearModuleStore: (store) => {
		store.commit('clear_moduleStore');
	}
};
/**
 * 用来获取更新后的数据
 */
const getters = {
	/**
	 * 获取lightChildMenuPath数据
	 */
	getLightChildMenuPath: (state) => {
		let aNewVal = state.lightChildMenuPath;
		if (!state.lightChildMenuPath) {
			aNewVal = localStorage.getItem(api.constObj.projectName + 'lightChildMenuPath');
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'lightChildMenuPath');
			aNewVal = aLocalStorage != null ? aLocalStorage : '';
		}
		return aNewVal;
	},
	/**
	 * 获取lightChildMenuList数据
	 */
	getLightChildMenuList: (state) => {
		let aNewVal = state.lightChildMenuList;
		if (!state.lightChildMenuList) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'lightChildMenuList');
			aNewVal = aLocalStorage != null ? JSON.parse(aLocalStorage) : [];
		}
		return aNewVal;
	},
	/**
	 * 获取currCompany数据
	 */
	getcurrCompany: (state) => {
		let aNewVal = state.currCompany;
		if (!state.currCompany) {
			aNewVal = localStorage.getItem(api.constObj.projectName + 'currCompany');
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'currCompany');
			aNewVal = aLocalStorage != null ? JSON.parse(aLocalStorage) : {};
		}
		return aNewVal;
	}
};
export default {
	namespaced: true, //启用命名控件模式
	state,
	mutations,
	actions,
	getters
};