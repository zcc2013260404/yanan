<template>
    <div class="chioceNetworkDeviceType">
        <div class="top">
            <div>
                <span class="backMain" @click="cancelOpt(2)">网络设备</span>
                <span class="el-icon-arrow-right">
                    <span></span>添加设备
                </span>
            </div>
            <div>选择类型</div>
        </div>
        <div class="rightSearch">
            <el-input
            	class="searchDept"
            	prefix-icon="el-icon-search"
			  	placeholder="search"
			  	@input="filterDeviceType"
			  	v-model="filterText">
			</el-input>
        </div>
        <div class="container">
        	<div class="deviceTypeDiv" v-for="(deviceType,index) in filterDeviceTypeData" :key="'deviceType'+index" @click="handleClick(deviceType)">
        		<div class="leftImg">
        			<img src="../../assets/img/deviceCenter/zhusuji.png" alt="设备类型图" />
        		</div>
        		<div class="rightContent">
        			<span>{{deviceType.name}}</span>
        			<span>核心类型</span>
        			<span>一</span>
        		</div>
        	</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ChioceNetworkDeviceType",//选择网络设备类型
        components: {},
        props:{},
        data(){
            return{
            	filterDeviceTypeData:[],//过滤设备数据
                deviceTypeData:[],
				filterText:'',//搜索设备文本
				oChioceObject:{}//选中的数据
            }
        },
        mounted() {
			this.getNetworkDeviceRequest();
		},
		methods: {
            /**
             * 监听 网络设备 面包屑 点击事件
             * @param {Number} optType 操作类型 0:刷新表格数据;1:返回到选择设备类型界面;2:不刷新数据关闭，返回至列表界面
             */
            cancelOpt(optType) {
				this.$emit("ChioceNetworkDeviceTypeCallBack",optType);
			},
			/**
             * 监听左侧搜索文本框input事件
             */
             filterDeviceType(){
             	if(this.filterText.length == 0){
                	this.filterDeviceTypeData = this.deviceTypeData;
                }else{
                	this.filterDeviceTypeData = this.deviceTypeData;
                	this.filterDeviceTypeData = this.filterDeviceTypeData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })
                }
            },
            /**
             * 监听类型点击事件 
             */
            handleClick(oChioceObj){
            	//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("ChioceNetworkDeviceTypeCallBack",oChioceObj);
            },
			/**
			 * 获取所有网络设备分类请求
			 */
			getNetworkDeviceRequest() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getNetworkDeviceTypeList,
					params:{
						name:''
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.deviceTypeData = resData.data;
						this.filterDeviceTypeData = resData.data;
					} 
				})
			},
		}
    }
</script>

<style lang="scss" scoped type="text/css">
    .chioceNetworkDeviceType{
    	margin: 0 40px;
        .top{
            div{
                font-size: 14px;
                margin-top: 24px;
                .backMain{
                	cursor: pointer;
                }
                span{
                    color: #006fe6;
                    margin-right: 10px;
                 }
                .el-icon-arrow-right{
                    color: #969696;
                }
                &:last-child{
                     height: 36px;
                     font-family: MicrosoftYaHei-Bold;
                     font-size: 36px;
                     line-height: 36px;
                     color: #323232;
                     margin: 25px 0;
                 }
            }
        }
        .rightSearch{
        	.el-input{
        		width: 250px;
        		border: none;
        		border-radius: 4px;
				border: solid 1px #969696;
        	}
        }
        .container{
		    border-top: none;
		    display: flex;
		    flex-wrap: wrap;
		    justify-content: flex-start;
			.deviceTypeDiv{
				width: 330px;
			    height: 96px;
			    border: solid 1px #bebebe;
			    display: flex;
			    margin-top:24px;
			    margin-right: 25px;
			    flex-grow: 0;/*放大比例*/ 
			    cursor: pointer;
			    .leftImg{
			    	width: 88px;
				    height: 96px;
				    line-height: 96px;
				    background-color: #f0f0f0;
				    border-right: solid 1px #bebebe;
				    text-align: center;
				    img{
				    	width: 33px;
						height: 33px;
				    }
			    }
			    .rightContent{
			    	display: flex;
				    flex-direction: column;
				    justify-content: space-around;
				    padding: 0 24px;
				    span{
				    	&:first-child{
				    		font-size: 14px;
							font-weight: normal;
							font-stretch: normal;
							line-height: 24px;
							letter-spacing: 0px;
							color: #323232;
				    	}
				    	&:nth-child(1){
				    		font-size: 14px;
							font-weight: normal;
							font-stretch: normal;
							line-height: 24px;
							letter-spacing: 0px;
							color: #006fe6;
				    	}
				    	&:last-child{
				    		font-size: 14px;
							color: #bebebe;
				    	}
				    }
			    }
			}
        }
    }
</style>
