import axios from 'axios'
/**
 * E2C 平台和用户中心接口api
 */
const interface_s = {
	baseURL: 'http://192.168.2.161:90/dhlk-web/', //非生产环境
	hdfsURL: 'http://192.168.2.161:8087/', //hadoop下载文件--非生产环境
	requestIP: { //非生产环境
		devOps: 'http://192.168.2.59:8880/', //运维中心
		dataControl: 'http://192.168.2.161:7180/cmf/home', //数据中台
		analysisControl: 'http://bi.k8s.leansite-cloud.com/decision' //商业智能
	},
	// hdfsURL: window.configs.hdfsURL, //hadoop下载文件--生产环境
	// prodBaseURL: window.configs.leansiteAPI, //生产环境
	// requestIP: { //生产环境
	// 	devOps: window.configs.devOps, //运维中心
	// 	dataControl: window.configs.dataControl, //数据中台
	// 	analysisControl: window.configs.analysisControl //商业智能
	// },
	//登录模块
	getKaptcha: 'kaptcha', //获取验证码
	login: 'login', //登录
	logout: 'logout', //退出登录
	getDepts: 'org/findTreeList', //获取所有部门
	getUserByDeptId: 'org/findPageUserByOrg', //根据部门id获取用户
	addAndEditDept: 'org/save', //新增和编辑部门
	delDept: 'org/delete', //删除部门
	getAllUserName: 'user/findList', //获取用户列表中的所有用户名
	getLogFile: 'logFile/searchLogFile', //获取日志文件
	downLogFile: 'logFile/downZipFile', //下载日志文件  (单个下载)
	deleteUser: 'user/delete', //根据id删除用户
	saveUser: 'user/save', //添加和编辑保存
	isEnable: 'user/isEnable', //是否禁用或启动  根据status  1为启动  0为禁用
	getUserOwnDep: 'user/findOrg', //获取用户现在所属的部门
	getUserOwnRole: 'role/selectRoleByUserId', //获取用户现在拥有的角色
	getAllRole: 'role/findAllList', //获取所有角色
	getUsersPageByRoleId: 'role/selectUserByRoleId', //根据角色id获取用户列表
	saveRole: 'role/save', //新增或编辑角色
	deleteRoles: 'role/delete', //删除角色
	getMenuByRoleId: 'menu/getMenuCheckedListByRoleId', //根据角色id获取权限列表
	saveMenuState: 'permissions/save', //保存权限
	getDeviceParameter: 'devicesAttrSet/findList', //获取所有设备参数
	saveDeviceParameter: 'devicesAttrSet/save', //保存设备参数
	deleteDeviceParameter: 'devicesAttrSet/delete', //删除设备参数
	getNetworkDevice: 'netDevices/findList', //获取所有网络设备
	getOnLineNetDevices: 'netDevices/findOnLineNetDevices', //按照tb信息获取关联网络设备信息
	saveNetworkDevice: 'netDevices/save', //保存网络设备
	deleteNetworkDevice: 'netDevices/delete', //删除网络设备
	getIndustryDevice: 'productDevices/findList', //获取所有工业设备
	saveIndustryDevice: 'productDevices/save', //保存工业设备
	deleteIndustryDevice: 'productDevices/delete', //删除工业设备
	getIndustryDeviceTree: 'productDevices/findTreeList', //获取所有组织机构下的工业设备
	getOnLineDevicesCount: 'productDevices/findOnLineDevicesCount', //获取工业设备总数和在线设备数
	deleteRelationDevices: 'productNet/delete', //删除关联设备
	integratedMachineNotBind: 'productNet/findNotComputerList', //未绑定一体机
	integratedMachine: 'productNet/findComputerList', //已绑定一体机
	allIntegratedMachine: '', //所有一体机设备
	BIControl: 'productNet/findBiList', //已绑定BI控制器
	BIControlNotBind: 'productNet/findNotBiList', //未绑定BI控制器
	allBIControl: '', //所有BI控制器
	saveRelation: 'productNet/save', //关联编辑保存
	getRelationList: 'productNet/findList', //获取关联设备列表
	getNetworkDeviceTypeList: 'dmNetType/findList', //获取网络设备分类列表
	//租户管理
	getTenantsByPage: 'tenant/findList', //多条件分页获取租户列表
	saveTenant: 'tenant/save', //保存租户
	tenantNameCheck: 'tenant/findTenantRepeat', //校验是否重名
	deleteTenant: 'tenant/delete', //删除租户
	exportToExcel: 'tenant/exportExcel', //导出到excel
	getTenantAdminsByPage: 'tenant/findTenantAdminList', //多条件分页获取租户管理员列表
	getTenantPower: 'menu/getMenuCheckedListByTeanantId', //获取租户权限
	saveTenantPower: 'menu/saveTenantAndMenu', //保存租户权限
	//设备检测
	getEventLidt: 'event/getAlarms', //获取事件列表信息
	getEventList: 'event/findList', //获取事件列表信息(修改之后的)
	getOutputList: 'hadoop/listFile', //获取事件列表
	deleteEvent: 'event/delete', //事件删除
	findAttrByClassifyById: 'productDevices/findAttrByClassifyById', //按照類型ID獲取生产设备的屬性
	getTimeseries: 'telemetry/getTimeseries', //按照生產設備的屬性獲取對應的報表圖
	//(设备类型)
	getDeviceTypeList: 'devicesClassify/findList', //获取类型管理列表
	getDeviceAttrList: 'devicesAttrSet/findList', //获取设备属性列表
	deleteDeveiceType: 'devicesClassify/delete', //设备类型删除
	upLoadImg: 'attachment/upload', //上传图片接口
	downImgById: 'attachment/downByDataId', //下载图片
	getClassifyType: 'dmClassifyType/findList', //获取上级类型列表
	saveAddDeviceType: 'devicesClassify/save', //保存类型管理添加
	deleteDevicesTypeById: 'devicesClassify/delete', //删除设备类型
	getNetDeviceErrorList: 'netFault/findList', //按照tbId和status获取网络设备故障信息
	getDeviceStatusBytbid: 'telemetry/getAttributesByScope', //按照tbId获取当前设备状态
	getMonitorIndex: 'monitor/indexData', //预警监控的首页数据
	//施工信息
	getConstructionsByPage: 'construction/findList', //获取施工信息
	saveConstruction: 'construction/save', //保存施工信息
	deleteConstruction: 'construction/delete', //删除施工信息
	//施工区域
	getAreaFindList: 'area/findList', //获取施工区域信息
	saveArea: 'area/save', //保存施工信息
	deleteArea: 'area/delete', //删除施工信息
	//智能开关
	getSwitchByPage: 'switch/findList', //获取智能开关信息
	saveSwitch: 'switch/save', //保存智能开关信息
	deleteSwitch: 'switch/delete', //删除智能开关信息
	wifiSwitch: '/wifi/switchWifiContro', // 
	restartSwitch: 'led/switchRestart', // 
	//定时控制
	getTaskByPage: 'scheduler/findTaskSchedulerList', //获取定时任务数据
	saveTask: 'scheduler/saveTask', //保存定时任务
	deleteTask: 'scheduler/deleteTask', //删除任务
	startTask: 'scheduler/startTask', //启用任务
	stopTask: 'scheduler/stopTask', //禁用任务
	getTaskLogByPage: 'scheduler/selectTaskSchedulerLogList', //获取定时任务执行结果
	// 智慧照明统计汇总
	statisticsCompanyQuery: '/lightQuery/lastCompanyQuery', // 企业查询
	statisticsInstallQuery: '/lightQuery/ledIntallQuery', // 企业设备安装查询
	statisticsLedQuery: '/lightQuery/provinceQuery', // 企业灯查询
	energyComRanking: '/lightQuery/energyComRanking', // 企业灯查询
	// 智慧照明企业列表
	getCompanyList: 'companylist/findCompanyList', // 企业列表
	// 智慧照明一体机
	getComputerByPage: 'computer/findList', //获取一体机信息
	deleteComputerList: '/computer/delete', // 一体机修改
	saveComputer: '/computer/save', // 一体机删除
	// 智慧照明照明设置
	getLedList: '/switch/findList', // 获取开关列表
	getAreaList: '/led/findAreasByLed', // 获取区域列表
	saveSwitchByLed: '/led/saveSwitchBoundLed', // 绑定
	saveLightBright: '/led/setLedBrightness', // 设置亮度
	saveLightOpenClose: '/led/openOrCloseLed', // 设置开关开关
	getPowerList: '/ledPowerStatistics/findList', // 能耗列表
	getLedPower: '/ledPowerStatistics/findRealEnergyByLedId', // 灯的能耗查询
	getSwitchGroup: '/switch/findGroupList',
	restartLed: '/led/ledRestart',
	findLedParamInfos: '/led/findLedParamInfos',
	refreshParamInfo: '/led/refreshParamInfo',
	findPeopleFeelNumber: '/ledPowerStatistics/findPeopleFeelNumber',
	// 智慧照明在线售后
	afterQuestionList: '/question/findList', // 在线售后列表
	afterQuestionCompanyList: '/question/getCompanyList', // 在线售后企业列表
	deleteQuestion: '/question/delete', // 在线售后删除
	questionSave: '/question/save', //在线售后新增保存
	answerSave: '/questionAnswer/save', // 在线售后问题解决
	questionSave: '/question/save',
	//故障信息
	errorMsgExport: '/led/exportExcel', // 故障信息导出
	errorMsgInfo: '/led/findLedFault', // 故障信息查询
	// 故障代码
	faultCodeList: '/faultCode/findList', // 故障代码列表
	deleteFaultCode: '/faultCode/delete', // 故障代码列表删除
	saveFaultCode: '/faultCode/save', // 故障代码列表修改
	// 固件版本
	firmwareVersionList: '/ledVersionInfo/findList', // 固件版本
	firmwareVersionUpload: '/ledVersionInfo/save', // 上传提交
	firmwareVersionDelete: '/ledVersionInfo/delete', // 固件删除
	firmwareVersionUpdate: '/ledVersionInfo/firmwareUpgrade', // 固件升级
	// 验收报告
	executeInspection: '/inspectionReport/executeInspection',
	findLampList: '/inspectionReport/findLampList',
	getResult: '/inspectionReport/getInspection',
	// 系统设置
	saveSysConfig: '/originalPower/save', // 系统设置
	getSysConfig: '/originalPower/find', // 获取系统设置
	wifiConfig: '/wifi/find', // wifi 配置
	wifiSave: '/wifi/wifiContro', // wifi 保存
	luminanceConfig: '/intensity/find', // 光感 配置
	luminanceSave: '/intensity/intensityContro', // 光感 保存
	peopleConfig: '/peopleFeel/find', // 人感 配置
	peopleSave: '/peopleFeel/peopleFeelingContro', // 人感 保存
	// 桌面配置
	saveDeskTop: '/deskTop/save',
	findDeskTop: '/deskTop/findList',
	// websocket ip
	getWebsocketUrl: '/websocked/getIpPort', // 获取socekurl
	//待定接口
	getThirdApp: 'app/getAll', //获取主页第三方应用菜单
	getSysApp: '/app/getSysApp', //获取系统应用
	checkPhoneOrEmail: '/user/phoneAndEmailEnable', //验证手机号或邮箱
	//常量对象
	constObj: {
		pageIndex: 1,
		pageSize: 10,
		requestFilter: [
			//拦截器不拦截的请求集合
			'login', //登录
			'kaptcha' //获取验证码
		],
		vueFilter: [
			//拦截器不拦截的vue界面集合
		],
		projectName: 'E2C-', //用户本地存储添加前缀
		DEFAULTPASSWORD: '000000' //添加用户时默认密码
	}
}
//配置生产环境和非生产环境之间的切换
if (process.env.NODE_ENV == 'development') {
	//非生产环境
	interface_s.baseURL = interface_s.baseURL
} else if (process.env.NODE_ENV == 'production') {
	//生产环境
	interface_s.baseURL = interface_s.prodBaseURL
}
export default interface_s