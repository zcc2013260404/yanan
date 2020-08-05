<template>
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item>
			<a @click="jumpCompany()">{{ companyName }}</a>
		</el-breadcrumb-item>
		<el-breadcrumb-item>{{currModuleName}}</el-breadcrumb-item>
	</el-breadcrumb>
</template>
<script>
	export default {
		name: "SecondBreadcrumb",//企业列表子页面面包屑
		data() {
			return {
				companyName: '',
				currModuleName:''
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				let oCompany = this.$store.getters['smartLight/getcurrCompany'];
				let sModulePathName = this.$store.getters['smartLight/getLightChildMenuPath'];
				let aSecondMenu = this.$store.getters['smartLight/getLightChildMenuList'];
				let chioceIndex = -1;
			    if (oCompany) {
			      this.companyName = this.$store.getters['smartLight/getcurrCompany'].name;
			    }
			    if (sModulePathName && aSecondMenu) {
			       chioceIndex = aSecondMenu.findIndex((item,index)=>{
			      	return item.links == sModulePathName;
			      });
			      if(chioceIndex != -1){
			      	this.currModuleName = aSecondMenu[chioceIndex].name;
			      }
			    }
			},
		    /**
		     * 跳转至企业列表
		     */
		    jumpCompany() {
		      this.$store.dispatch('smartLight/setLightChildMenuPath', {
		        data: '/enterprisesList'
		      })
		    }
		}
	};
</script>
<style lang="scss" scoped type="text/css">
    .el-breadcrumb{
    	margin:23px 0 22px;
    	.el-breadcrumb-item{
    		a{	
    			cursor: pointer;	
    		}
    	}
    	/deep/ .el-breadcrumb__inner{
    		a {
    			color: #006fe6 !important;	
    			font-weight: normal;
    			cursor: pointer;
    		}
		}
    }
</style>