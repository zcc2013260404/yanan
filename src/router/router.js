import Vue from 'vue'
import VueRouter from 'vue-router'
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch((error) => error)
}
import api from '../common/api.js'
import store from '../store/index.js'
Vue.use(VueRouter)
const login = () => import('@/views/login.vue')
const index = () => import('@/views/index.vue')
const error404 = () => import('@/views/404.vue')
const testView = () => import('@/views/testView.vue')
const userCenterHome = () => import('@/views/userCenter/UserCenterHome.vue')
const userList = () => import('@/views/userCenter/UserList.vue')
const roleList = () => import('@/views/userCenter/RoleList.vue')
const tenantList = () => import('@/views/userCenter/TenantList.vue')
const deptList = () => import('@/views/userCenter/DeptList.vue')
const logList = () => import('@/views/userCenter/LogList.vue')
const monitorList = () => import('@/views/userCenter/MonitorList.vue')
const deviceCenterHome = () => import('@/views/deviceCenter/DeviceCenterHome.vue')
const networkDeviceList = () => import('@/views/deviceCenter/NetworkDeviceList.vue')
const deviceTypeList = () => import('@/views/deviceCenter/DeviceTypeList.vue')
const industryDeviceList = () => import('@/views/deviceCenter/IndustryDeviceList.vue')
const relationDeviceList = () => import('@/views/deviceCenter/RelationDeviceList.vue')
const deviceParameterList = () => import('@/views/deviceCenter/DeviceParameterList.vue')
const output = () => import('@/views/output.vue')
const monitorIndex = () => import('@/views/monitorCenter/MonitorIndex.vue')
const smartLightCenterHome = () => import('@/views/smartLight/SmartLightCenterHome.vue')
const constructionInfoList = () => import('@/views/smartLight/ConstructionInfoList.vue')
const constructionAreaList = () => import('@/views/smartLight/ConstructionAreaList.vue')
const smartSwitchList = () => import('@/views/smartLight/SmartSwitchList.vue')
const timingControlList = () => import('@/views/smartLight/TimingControlList.vue')
// 梁沛杰2020-06-04 start
const statisticalSum = () => import('@/views/smartLight/statisicalSum/index.vue')
const enterprisesList = () => import('@/views/smartLight/enterprisesList/index.vue')
const afterSales = () => import('@/views/smartLight/afterSales/index.vue')
const lightMachine = () => import('@/views/smartLight/lightMachine/index.vue')
const acceptanceReport = () => import('@/views/smartLight/acceptanceReport/index.vue')
const energyStatistics = () => import('@/views/smartLight/energyStatistics/index.vue')
const faultInformation = () => import('@/views/smartLight/faultInformation/index.vue')
const lightSetting = () => import('@/views/smartLight/lightSetting/index.vue')
const senseStatistics = () => import('@/views/smartLight/senseStatistics/index.vue')
const errorCode = () => import('@/views/smartLight/errorCode/index.vue')
const firmwareVersion = () => import('@/views/smartLight/FirmwareVersion.vue')
const systemConfig = () => import('@/views/smartLight/systemConfig/index.vue')
// end
const routes = [
	{
		name: 'login',
		path: '/login',
		component: login,
		meta: {
			title: '登录',
			requiresAuth: false //是否登录验证
		}
	},
	{
		name: 'index',
		path: '/',
		component: index,
		meta: {
			title: '首页',
			requiresAuth: true
		}
	},
	//用户中心模块
	{
		name: 'userCenterHome',
		path: '/userCenterHome',
		component: userCenterHome,
		meta: {
			title: '用户中心主页',
			requiresAuth: true
		}
	},
	//智慧照明模块
	{
		name: 'smartLightCenterHome',
		path: '/smartLightCenterHome',
		component: smartLightCenterHome,
		meta: {
			title: '智慧照明主页',
			requiresAuth: true
		}
	},
	{
		name: 'userList',
		path: '/userList',
		component: userList,
		meta: {
			title: '用户管理',
			requiresAuth: true
		}
	},
	{
		name: 'roleList',
		path: '/roleList',
		component: roleList,
		meta: {
			title: '角色管理',
			requiresAuth: true
		}
	},
	{
		name: 'tenantList',
		path: '/tenantList',
		component: tenantList,
		meta: {
			title: '组织架构管理',
			requiresAuth: true
		}
	},
	{
		name: 'deptList',
		path: '/deptList',
		component: deptList,
		meta: {
			title: '组织架构管理',
			requiresAuth: true
		}
	},
	{
		name: 'logList',
		path: '/logList',
		component: logList,
		meta: {
			title: '活动日志',
			requiresAuth: true
		}
	},
	{
		name: 'monitor',
		path: '/monitor',
		component: monitorList,
		meta: {
			title: '预警监控',
			requiresAuth: true
		}
	},
	{
		name: 'constructionInfoList',
		path: '/constructionInfoList',
		component: constructionInfoList,
		meta: {
			title: '施工信息列表',
			requiresAuth: true
		}
	},
	{
		name: 'constructionAreaList',
		path: '/constructionAreaList',
		component: constructionAreaList,
		meta: {
			title: '施工区域列表',
			requiresAuth: true
		}
	},
	{
		name: 'smartSwitchList',
		path: '/smartSwitchList',
		component: smartSwitchList,
		meta: {
			title: '智慧开关列表',
			requiresAuth: true
		}
	},
	{
		name: 'timingControlList',
		path: '/timingControlList',
		component: timingControlList,
		meta: {
			title: '定时控制列表',
			requiresAuth: true
		}
	},
	//梁沛杰start
	{
		name: 'enterprisesList',
		path: '/enterprisesList',
		component: enterprisesList,
		meta: {
			title: '企业列表',
			requiresAuth: true
		}
	},
	{
		name: 'statisticalSum',
		path: '/statisticalSum',
		component: statisticalSum,
		meta: {
			title: '统计汇总',
			requiresAuth: true
		}
	},
	{
		name: 'firmwareVersion',
		path: '/firmwareVersion',
		component: firmwareVersion,
		meta: {
			title: '固件版本',
			requiresAuth: true
		}
	},
	{
		name: 'lightMachine',
		path: '/lightMachine',
		component: lightMachine,
		meta: {
			title: '智慧照明一体机',
			requiresAuth: true
		}
	},
	//
	{
		name: 'acceptanceReport',
		path: '/acceptanceReport',
		component: acceptanceReport,
		meta: {
			title: '验收报告',
			requiresAuth: true
		}
	},
	{
		name: 'afterSales',
		path: '/afterSales',
		component: afterSales,
		meta: {
			title: '在线售后',
			requiresAuth: true
		}
	},
	//
	{
		name: 'energyStatistics',
		path: '/energyStatistics',
		component: energyStatistics,
		meta: {
			title: '能源统计',
			requiresAuth: true
		}
	},
	//
	{
		name: 'faultInformation',
		path: '/faultInformation',
		component: faultInformation,
		meta: {
			title: '故障信息',
			requiresAuth: true
		}
	},
	//
	{
		name: 'lightSetting',
		path: '/lightSetting',
		component: lightSetting,
		meta: {
			title: '照明设置',
			requiresAuth: true
		}
	},
	{
		name: 'senseStatistics',
		path: '/senseStatistics',
		component: senseStatistics,
		meta: {
			title: '人感统计',
			requiresAuth: true
		}
	},
	{
		name: 'systemConfig',
		path: '/systemConfig',
		component: systemConfig,
		meta: {
			title: '系统配置',
			requiresAuth: true
		}
	},
	{
		name: 'errorCode',
		path: '/errorCode',
		component: errorCode,
		meta: {
			title: '故障代码',
			requiresAuth: true
		}
	},
	// 梁沛杰end
	{
		path: '/404',
		component: error404
	},
	{
		path: '/testView',
		component: testView
	},
	{
		path: '/output',
		component: output
	},
	{
		path: '*',
		redirect: {
			path: '/403'
		}
	},
	//设备中心模块
	{
		name: 'deviceCenterHome',
		path: '/deviceCenterHome',
		component: deviceCenterHome,
		meta: {
			title: '设备中心主页',
			requiresAuth: true
		}
	},
	{
		name: 'networkDeviceList',
		path: '/networkDeviceList',
		component: networkDeviceList,
		meta: {
			title: '网络设备列表',
			requiresAuth: true
		}
	},
	{
		name: 'deviceTypeList',
		path: '/deviceTypeList',
		component: deviceTypeList,
		meta: {
			title: '类型列表',
			requiresAuth: true
		}
	},
	{
		name: 'industryDeviceList',
		path: '/industryDeviceList',
		component: industryDeviceList,
		meta: {
			title: '工业设备列表',
			requiresAuth: true
		}
	},
	{
		name: 'relationDeviceList',
		path: '/relationDeviceList',
		component: relationDeviceList,
		meta: {
			title: '关联设备列表',
			requiresAuth: true
		}
	},
	{
		name: 'deviceParameterList',
		path: '/deviceParameterList',
		component: deviceParameterList,
		meta: {
			title: '参数列表',
			requiresAuth: true
		}
	},
	//监测管理
	{
		name: 'monitorIndex',
		path: '/monitorIndex',
		component: monitorIndex,
		meta: {
			title: '监测管理首页',
			requiresAuth: true
		}
	}
]

// 实例化
let router = new VueRouter({
	mode: 'hash', //hash模式
	routes // （缩写）相当于 routes: routes
})
// 路由拦截
router.beforeEach((to, from, next) => {
	if (to.name === 'index' && from.name === 'login') {
		next()
	} else {
		next()
	}
})
export default router
