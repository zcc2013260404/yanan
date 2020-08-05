<template>
    <div class="deviceListTree">
        <div class="leftAsideSearch">
        	<!--<el-button icon="el-icon-sort" @click="handleSort" title="按时间排序"></el-button>-->
            <el-input
            	class="searchDept"
            	prefix-icon="el-icon-search"
			  	placeholder="search"
			  	v-model="filterText"
			  	clearable>
			</el-input>
        </div>
        <el-tree
  		  ref="orgDeviceTree"
	      :data="aDeptDeviceDatas"
	      node-key="id"
	      :props="defaultProps"
	      highlight-current
	      :indent="10"
	      @node-click="treeClick"
	      :filter-node-method="filterNode"
	      :expand-on-click-node="false">
	       <span class="custom-tree-node" slot-scope="{ node, data }"  style="padding-right:10px;">
	        <i :class="node.level == 1?'iconfont leansite-zuzhijiagou':node.isLeaf==false?'el-icon-folder':''" ></i>
	        <span style="display:inline-block;margin-left:5px;width: 220px;overflow: hidden !important;text-overflow:ellipsis;white-space: nowrap;" :title="node.label">{{ node.label }}</span>
	      </span>
	   </el-tree>
	</div>
</template>

<script>
    export default {
        name: 'DeviceListTree',//树状设备列表
        components: {},
        data() {
            return {
            	aDeptDeviceDatas:[],//组织架构数据
		        defaultProps: {//tree与data字段映射
		          children: 'children',
		          label: 'title',
		          id:'id'
		        },
				filterText:'',//搜索类型文本
				oChioceDeptDevice:{},//选中部门下的设备
            }
        },
	    watch: {
	      filterText(val) {
	        this.$refs.orgDeviceTree.filter(val);
	      }
	    },
        created() {

        },
        mounted(){
        	this.getDeptDeviceData();
        },
        methods: {
			/**
			 * tree搜索事件 
			 */
			filterNode(value, data) {
		        if (!value) return true;
		        return data.title.indexOf(value) !== -1;
		   },
			/**
			 * 监听部门树点击事件
			 */
			treeClick(nodeObj,nodes,nodeSelf){
				if(nodes.isLeaf){
					this.oChioceDeptDevice = nodeObj;
					this.$emit('DeviceListCallBack',nodeObj);
				}
			},
			/**
			 * 获取所有组织机构下的工业设备请求
			 */
			getDeptDeviceData() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getIndustryDeviceTree,
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
                        this.aDeptDeviceDatas = resData.data;
                        this.getFirstDept(resData.data); 
					}
				})
			},
            /**
             * 获取部门下的首个设备
             */
            getFirstDept(arr) {
            	
            	if(arr.length > 0){
	                for(let i = 0;i < arr.length;i++ ){
	                    if(arr[i].hasChildren){
	                        this.getFirstDept(arr[i].children);
	                        return;
	                    }else{
	                        this.oChioceDeptDevice = arr[i];
	                        this.$emit('DeviceListCallBack',this.oChioceDeptDevice);
	                        this.$nextTick(()=>{
	                        	this.$refs.orgDeviceTree.setCurrentKey(this.oChioceDeptDevice.id);	
	                        });
	                        break;
	                    }
	                }
                }else{
                	this.oChioceDeptDevice = {};
                	this.$emit('DeviceListCallBack',this.oChioceDeptDevice);
                }
            }
        }
    }

</script>

<style lang="scss" scoped type="text/css">
    .deviceListTree {
	    height: 100%;
	    background-color: #f0f0f0;
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
        		width:290px;
			    line-height: 31px;
			    border: solid 1px #969696;
			    border-radius: 4px;
        	}
        }
        .el-tree{
    		width: 320px;
		    height: calc(100vh - 215px);
		    height: -webkit-calc(100vh - 215px);
		    height: -moz-calc(100vh - 215px);
        	overflow: auto;
		    background-color: #f0f0f0;
		    border-top: solid 1px #969696;
		    overflow-y: auto;
    	}
        /deep/ .el-tree-node>.el-tree-node__children{
            overflow: visible;
        }
        /deep/ .deptList .el-tree-node__content{
        	border: solid 1px #b4b4b4;
        }
    	/deep/ .el-tree-node__content{
	    	height: 33px !important;
	    	font-size: 14px;
	    }
	    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
	    		background-color: #FFFFFF;
	    		color: #3f78f6;
	    }
        /deep/ .custom-tree-node{
            line-height: 12px;
            span{
                overflow: visible !important;
            }
        }
    }
</style>
