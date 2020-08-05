<template>
    <div class="DeviceList">
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
	  		<el-table ref="singleIndustryTable" :data="filterIndustryDeviceTableData" class="table" highlight-current-row :show-header=false :row-style="{background:'#f0f0f0'}" @row-click="handleClick">
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
</template>

<script>
    export default {
        name: 'DeviceList',//设备列表
        components: {
		},
        data() {
            return {
            	filterIndustryDeviceTableData:[],//过滤后的工业设备数据
            	industryDeviceTableData:[],
				filterText:'',//搜索类型文本
				oChioceObject:{},//表格选中的数据
            }
        },
        created() {

        },
        mounted(){
        	this.getIndustryDeviceRequest();
        },
        methods: {
            /**
             * 监听左侧搜索文本框input事件
             */
             filterIndustryDevice(){
             	if(this.filterText.length == 0){
                	this.filterIndustryDeviceTableData = this.industryDeviceTableData;
                }else{
                	this.filterIndustryDeviceTableData = this.industryDeviceTableData;
                	this.filterIndustryDeviceTableData = this.filterIndustryDeviceTableData.filter((currentValue,index,arr)=>{
	                	return currentValue.name.indexOf(this.filterText) !=-1;
	                })
                }
            },
            /**
             * 	监听左侧表格的click事件
             */
            handleClick(row, column, event) {
		        this.oChioceObject = row;
		        this.$emit('DeviceListCallBack',row);
		    },
            /**
             * 监听排序按钮click事件
             */
            handleSort(){
                
            },
			/**
			 * 获取所有工业设备请求
			 */
			getIndustryDeviceRequest() {
				let self = this;
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getIndustryDevice
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.industryDeviceTableData = resData.data;
						this.filterIndustryDeviceTableData = resData.data;
						if(resData.data.length > 0){
							this.oChioceObject = this.filterIndustryDeviceTableData[0];
							self.$refs.singleIndustryTable.setCurrentRow(resData.data[0]);
							this.$emit('DeviceListCallBack',this.oChioceObject);
						}else{
							this.$emit('DeviceListCallBack',{});
						}
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
    .DeviceList {
    	min-width: 320px;
    	max-width: 338px;
	    height: 100%;
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
        .leftAsideSearch{
		    padding: 0 15px 0;
		    height: 41px;
		    line-height: 41px;
		    border-bottom: solid 1px #b4b4b4;
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
        	width: 320px;
        	height: calc(100vh - 215px);
		    height: -webkit-calc(100vh - 215px);
		    height: -moz-calc(100vh - 215px);
            overflow-y: auto;
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
</style>
