<template>
    <div class="deviceListMap" :style="isShowMap?'min-width:960px;max-width:978px;':'min-width:320px;max-width:338px;'">
    	<div class="map"  v-show="isShowMap">
    		<div class="mapChart" id="mapChart"></div>
    	</div>
    	<div class="rightList">
	        <div class="leftAsideSearch">
	        	<!--<el-button icon="el-icon-sort" @click="handleSort" title="按时间排序"></el-button>-->
	            <el-input
	            	class="searchDept"
	            	prefix-icon="el-icon-search"
				  	placeholder="search"
				  	@input="filterIndustryDevice"
				  	v-model="filterText"
				  	clearable>
				</el-input>
	        </div>
	        <div class="tableDiv">
	        	<span class="topLayoutTag" @click="changeMap">
	        		<i :class="isShowMap?'el-icon-arrow-left':'el-icon-arrow-right'"></i>
	        	</span>
		  		<el-table ref="singleIndustryTable" :data="filterDeviceTableData" class="table" highlight-current-row :show-header=false :row-style="{background:'#f0f0f0'}" @row-click="handleClick">
	                <el-table-column  align="left">
	                    <template slot-scope="scope">
	                    	<div class="listDiv">
		                        <p class="topP">
									<img src="../../assets/img/deviceCenter/liebiaotubiao.png" alt="图标">
		                        	<span>{{scope.row.name}}</span>
		                        	<i class="iconfont leansite-shouchang rightListIcon"></i>
		                        </p>
		                        <p class="mediumP">{{scope.row.classifySet?scope.row.classifySet.classify_name:'暂无数据'}}</p>
		                        <p class="bottomP">{{scope.row.note == null||scope.row.note.length==0?'暂无数据':scope.row.note}}</p>
	                        </div>
	                    </template>
	                </el-table-column>
	            </el-table>
	       	</div>
       	</div>
	</div>
</template>

<script>
	import chinaData from '../../common/china.json';
    export default {
        name: 'DeviceListMap',//设备列表地图模式
        components: {},
        data() {
            return {
            	isShowMap:true,//是否显示地图
            	filterDeviceTableData:[],//过滤后的工业设备数据
            	DeviceTableData:[],
				filterText:'',//搜索类型文本
				oChioceObject:{
					isShowMap:this.isShowMap
				},//表格选中的数据
				mapChart:{},
				oEcharts:{},
				deviceTotal:0//陕西省设备总数
            }
        },
        created() {

        },
        mounted(){
        	this.oEcharts = require('echarts');
			this.mapChart = this.oEcharts.init(document.getElementById('mapChart'));
        	this.getDeviceRequest();
        	
        },
        methods: {
            /**
             * 监听左侧搜索文本框input事件
             */
             filterIndustryDevice(){
             	if(this.filterText.length == 0){
                	this.filterDeviceTableData = this.DeviceTableData;
                }else{
                	this.filterDeviceTableData = this.DeviceTableData;
                	this.filterDeviceTableData = this.filterDeviceTableData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })
                }
            },
            /**
             * 	监听左侧表格的click事件
             */
            handleClick(row, column, event) {
		        this.oChioceObject = row;
		        this.oChioceObject.isShowMap = this.isShowMap;
		        this.$emit('DeviceListCallBack',row);
		    },
            /**
             * 监听span按钮click事件
             */
            changeMap(){
                this.isShowMap = !this.isShowMap;
                this.oChioceObject.isShowMap = this.isShowMap;
                this.$emit('DeviceListCallBack',this.oChioceObject);
                if(this.isShowMap){
                	this.mapChartLoad();
                }
            },
            /**
             * 地图组件加载
             */
			mapChartLoad() {
			    this.oEcharts.registerMap('China', chinaData);
			    let option = {
			    	title: {
			            text: '区域设备分布',
			            left: 'center'
				    },
			        series: [
			            {
			                name: '引入中国地图',
			                type: 'map',
			                roam: true,
			                map: 'china',
			                emphasis: {
			                    label: {
			                        show: true
			                    }
			                },
			                // 文本位置修正
			                textFixed: {
			                    Alaska: [20, -20]
			                },
			                data:[
			                    {
			                    	name: '陕西', value: this.deviceTotal,
				                    label: {
		                                normal: {
		                                    show: true,
		                                    formatter: function (params) {
		                                        return params.name+"\n"+ params.value;    //地图上展示文字 + 数值
		                                    },
		                                    textStyle: {
					                            color: "#323232"
					                        }
		                                }
		                            },
		                            
			 						itemStyle: {
			                            normal: {
			                                areaColor: '#FF6900'
			                            }
			                        }
		                     	}
			                ],
			                zoom: 1.3,
							itemStyle: {
					            normal: {
					              borderWidth: 0.5, // 区域边框宽度
					              borderColor: '#ffffff', // 区域边框颜色
					              areaColor: '#B0E2FF' // 区域颜色
					            }
					        }
			            }
			        ]
			    }
			    this.mapChart.setOption(option);
			    //监听地图click事件
			    this.mapChart.on('click',  (params)=> {
			    	if(params.name == "陕西"){
			    		this.getDeviceRequest();	
			    	}else{
			    		this.deviceOptData([]);
			    	}
				});
			},
			/**
			 * 处理工业设备数据
			 */
			deviceOptData(resData){
				this.DeviceTableData = resData;
				this.filterDeviceTableData = resData;
				if(resData.length > 0){
					this.oChioceObject = this.filterDeviceTableData[0];
					this.oChioceObject.isShowMap = this.isShowMap;
					this.$refs.singleIndustryTable.setCurrentRow(resData[0])
					this.$emit('DeviceListCallBack',this.oChioceObject);
				}else{
					this.$emit('DeviceListCallBack',{});
				}
			},
			/**
			 * 获取所有工业设备请求
			 */
			getDeviceRequest() {
				let self = this;
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getIndustryDevice
				}).then((res) => {
					var resData = res.data;
					this.deviceTotal = resData.data.length;
					this.mapChartLoad();
					if(resData.code == 0) {
						this.deviceOptData(resData.data);
					}
				});
			},
            /**
             * 批量删除工业设备请求
             */
            deleteRequest(paramsId){
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.deleteIndustryDevice,
					params:{
						ids:paramsId //逗号分隔
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.$message({
							type: 'success',
							message: '删除设备成功！'
						});
						this.getIndustryDeviceRequest();
					} else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '删除设备失败：'+resData.msg
						});
					}
				})
            }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .deviceListMap {
    	min-width: 960px;
    	max-width: 978px;
	    height: 100%;
	    display: flex;
	    background-color: #f0f0f0;
    	/deep/ .current-row > td {
		   background: #FFFFFF !important;
		}
    	/deep/ .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
		  border-color: #b4b4b4;
		}
		/deep/ .el-table--border::after, .el-table--group::after, .el-table::before{
		  background-color: #b4b4b4;
		}
		.map{
			width: 640px;
			display: flex;
			justify-content: center;
			align-items: center;
			.mapChart{
				width: 620px;
				height: 477px;
			}
		}
		.rightList{
			width: 320px;
            .leftAsideSearch{
			    padding: 0 15px 0;
			    height: 41px;
			    line-height: 41px;
			    border: solid 1px #b4b4b4;
			    border-top: none;
			    border-bottom: none;
			    display: flex;
			    align-items: center;
            	.el-button{
				    width: 32px;
				    height: 32px;
				    margin-right: 5px;
				    text-align: center;
				    padding: 0;
				    border-radius: 4px;
				    color: #323232;
				    border: solid 1px #323232;
            	}
				    /deep/ .el-input--medium .el-input__inner {
					    height: 31px;
					    line-height: 31px;
					}
					/deep/ .el-input--medium .el-input__icon {
					    line-height: 29px;
					}
            	.el-input{
            		width: 297px;
				    line-height: 31px;
				    border: solid 1px #969696;
				    border-radius: 4px;
            	}
            }
            .tableDiv{
            	height: calc(100vh - 215px);
			    height: -webkit-calc(100vh - 215px);
			    height: -moz-calc(100vh - 215px);
			    border: solid 1px #b4b4b4;
	            overflow-y: auto;
	            position: relative;
	            .topLayoutTag{
	            	z-index: 1;
	            	position: absolute;
	            	top: 50%;
	            	margin-top: -50%;
				    width: 12px;
				    height: 64px;
				    line-height: 64px;
				    background-color: #d2d2d2;
				    cursor: pointer;
	            }
	            .topLayoutTag:hover{
	            	background-color:#b4b4b4;
	            }
		    	.el-table{
		    		.listDiv{
		    			padding:3px 8px 5px 5px;
		    			.topP{
		    				img{
		    					width: 15px;
								height: 17px;
								vertical-align: baseline;
		    				}
		    				span{
		    					margin-left: 20px;
							    font-size: 14px;
							    width: 180px;
							    min-width: 180px;
		    					max-width: 200px;
							    overflow: hidden !important;
							    text-overflow:ellipsis;
							    white-space: nowrap;
							    color: #323232;
							    display: inline-block;
		    				}
		    				.rightListIcon{
								margin-left: 26px;
							    font-size: 16px;
							    color: #969696;
							    vertical-align: super;
		    				}
		    			}
		    			.mediumP{
		    				padding-left: 38px;
		    				font-size: 12px;
							color: #006fe6;
							width: 180px;
							min-width: 180px;
		    				max-width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    			.bottomP{
		    				padding-left: 38px;
		    				font-size: 12px;
		    				color: #969696;
		    				/*width: 180px;*/
		    				min-width: 180px;
		    				max-width: 200px;
						    overflow: hidden !important;
						    text-overflow:ellipsis;
						    white-space: nowrap;
		    			}
		    		}
		    	}
	    	}
    	}
    }
</style>
