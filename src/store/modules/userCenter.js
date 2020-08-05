import vue from 'vue';
import api from "../../common/api.js" //引入接口 

/**
 * 用户中心模块
 */
const state = {
	user: null, //存储用户信息
	operationAuthority: null, //功能操作权限
	roles: null, //角色列表
	token: null, //请求令牌
	internetToken: null, //物联网中心token
	loginUser: null, //登录用户信息
	childMenuPath: null //智慧照明企业子菜单路径
};
//修改state中的值
const mutations = {
	/**
	 * 操作 user
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_user(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "user", JSON.stringify(oOptData.data));
			if (state.user) { //判断state中的该属性是否已存在
				state.user = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'user', oOptData.data);
			}
		} else {
			localStorage.removeItem("user");
			vue.delete(state, 'user');
		}
	},
	/**
	 * 操作 operationAuthority
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_operationAuthority(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "operationAuthority", JSON.stringify(oOptData.data));
			if (state.operationAuthority) { //判断state中的该属性是否已存在
				state.operationAuthority = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'operationAuthority', oOptData.data);
			}
		} else {
			localStorage.removeItem("operationAuthority");
			vue.delete(state, 'operationAuthority');
		}
	},
	/**
	 * 操作 roles
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_roles(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "roles", JSON.stringify(oOptData.data));
			if (state.roles) { //判断state中的该属性是否已存在
				state.roles = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'roles', oOptData.data);
			}
		} else {
			localStorage.removeItem("roles");
			vue.delete(state, 'roles');
		}
	},
	/**
	 * 操作 token
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_token(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "token", oOptData.data);
			if (state.token) { //判断state中的该属性是否已存在
				state.token = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'token', oOptData.data);
			}
		} else {
			localStorage.removeItem("token");
			vue.delete(state, 'token');
		}
	},
	/**
	 * 操作 internetToken
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_internetToken(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "internetToken", oOptData.data);
			if (state.internetToken) { //判断state中的该属性是否已存在
				state.internetToken = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'internetToken', oOptData.data);
			}
		} else {
			localStorage.removeItem("internetToken");
			vue.delete(state, 'internetToken');
		}
	},
	/**
	 * 操作 loginUser
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_loginUser(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "loginUser", JSON.stringify(oOptData.data));
			if (state.loginUser) { //判断state中的该属性是否已存在
				state.loginUser = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'loginUser', oOptData.data);
			}
		} else {
			localStorage.removeItem("loginUser");
			vue.delete(state, 'loginUser');
		}
	},
	/**
	 * 操作childMenuPath
	 * @params {Object} oOptData
	 * @params {Number} oOptData.data
	 * @params {Number} oOptData.optType ：save/del 
	 */
	set_childMenuPath(state, oOptData) {
		if (oOptData.optType == 'save') {
			localStorage.setItem(api.constObj.projectName + "childMenuPath", oOptData.data);
			if (state.childMenuPath) { //判断state中的该属性是否已存在
				state.childMenuPath = oOptData.data;
			} else {
				//state中的该属性不存在时，新增属性并赋值
				vue.set(state, 'childMenuPath', oOptData.data);
			}
		} else {
			localStorage.removeItem("childMenuPath");
			vue.delete(state, 'childMenuPath');
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
	 * 设置user数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setUser: (store, options) => {
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
		store.commit('set_user', oNewObj);
	},
	/**
	 * 设置operationAuthority数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setOperationAuthority: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: [],
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save" && typeof dataValue != "string") {
			oNewObj.data = dataValue;
		}
		store.commit('set_operationAuthority', oNewObj);
	},
	/**
	 * 设置roles数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setRoles: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: [],
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save" && typeof dataValue != "string") {
			oNewObj.data = dataValue;
		}
		store.commit('set_roles', oNewObj);
	},
	/**
	 * 设置token数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setToken: (store, options) => {
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
		store.commit('set_token', oNewObj);
	},
	/**
	 * 设置internetToken数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setInternetToken: (store, options) => {
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
		store.commit('set_internetToken', oNewObj);
	},
	/**
	 * 设置loginUser数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setLoginUser: (store, options) => {
		if (!options.optType) {
			options.optType = "save";
		}
		let oNewObj = {
			data: {},
			optType: options.optType
		};
		var dataValue = options.data;
		if (oNewObj.optType == "save" && typeof dataValue != "string") {
			oNewObj.data = JSON.stringify(dataValue);
		}
		store.commit('set_loginUser', oNewObj);
	},
	/**
	 * 设置lightChildMenuPath数据
	 * @params {Object} options 参数对象
	 * @params {Object} options.data 参数数据
	 * @params {Object} options.optType 操作类型 save/delete
	 * @return {Object} 响应数据
	 */
	setChildMenuPath: (store, options) => {
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
		store.commit('set_childMenuPath', oNewObj);
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
	 * 获取user数据
	 */
	getUser: (state) => {
		let aNewVal = state.user;
		if (!state.user) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'user');
			aNewVal = aLocalStorage != null ? JSON.parse(aLocalStorage) : {};
		}
		return aNewVal;
	},
	/**
	 * 获取operationAuthority数据
	 */
	getOperationAuthority: (state) => {
		let aNewVal = state.operationAuthority;
		if (!state.operationAuthority) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'operationAuthority');
			aNewVal = aLocalStorage != null ? JSON.parse(aLocalStorage) : [];
		}
		return aNewVal;
	},
	/**
	 * 获取roles数据
	 */
	getRoles: (state) => {
		let aNewVal = state.roles;
		if (!state.roles) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'roles');
			aNewVal = aLocalStorage != null ? JSON.parse(aLocalStorage) : [];
		}
		return aNewVal;
	},
	/**
	 * 获取token数据
	 */
	getToken: (state) => {
		let aNewVal = state.token;
		if (!state.token) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'token');
			aNewVal = aLocalStorage != null ? aLocalStorage : "";
		}
		return aNewVal;
	},
	/**
	 * 获取internetToken数据
	 */
	getInternetToken: (state) => {
		let aNewVal = state.internetToken;
		if (!state.internetToken) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'internetToken');
			aNewVal = aLocalStorage != null ? aLocalStorage : {};
		}
		return aNewVal;
	},
	/**
	 * 获取lightChildMenuPath数据
	 */
	getChildMenuPath: (state) => {
		let aNewVal = state.childMenuPath;
		if (!state.childMenuPath) {
			aNewVal = localStorage.getItem(api.constObj.projectName + 'childMenuPath');
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'childMenuPath');
			aNewVal = aLocalStorage != null ? aLocalStorage : '';
		}
		return aNewVal;
	},
	/**
	 * 获取loginUser数据
	 */
	getLoginUser: (state) => {
		let aNewVal = state.loginUser;
		if (!state.loginUser) {
			let aLocalStorage = localStorage.getItem(api.constObj.projectName + 'loginUser');
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