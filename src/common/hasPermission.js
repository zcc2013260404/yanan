import store from '../store/index';
//控制按钮权限
const hasPermission=function(permission){
	let myBtns = store.getters['userCenter/getOperationAuthority'];
	return myBtns.indexOf(permission) > -1;
};
export default hasPermission;