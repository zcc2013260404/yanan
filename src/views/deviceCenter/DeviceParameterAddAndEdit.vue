<template>
    <div class="deviceParameterAddAndEdit">
        <div class="top">
            <div >
                <span class="backMain" @click="cancelOpt">参数管理</span>
                <span class="el-icon-arrow-right">
                    <span></span>{{pageType}}参数
                </span>
            </div>
            <div>{{pageType}}参数</div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header"><span>-</span>属性信息</div>
                <div class="formText">
                    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="10px" class="submitForm">
                        <el-form-item label="属性ID" prop="attrSetId">
                            <el-input v-model="ruleForm.attrSetId" placeholder="请输入属性ID(2~50个字符)" style="width:260px;"></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入名称(2~50个字符)" style="width:260px;"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="describe">
                            <el-input type="textarea" v-model="ruleForm.describe" placeholder="请输入描述(2~50个字符)" maxlength="50" show-word-limit></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="tableTitle"><span>-</span>变量</div>
        <div class="container" v-if="ruleForm.attrDetails.length > 0">
        	<div class="tipsMsg">
        		<i class="el-icon-warning"></i>
        		<ul>
        			<li>1.参数的变量名必须唯一</li>
        			<li>2.一旦变量添加后不能删除</li>
        		</ul>
        	</div>
        	<el-button type="primary" icon="el-icon-plus" @click="addVariable">添加变量</el-button>
        	<el-table :data="ruleForm.attrDetails" >
        		<el-table-column label="编码" min-width="200">
					<editable-cell 
						:show-input="row.editMode" 
						slot-scope="{row}" 
						v-model="row.code" 
						:validateFun="varNameCheck">
						<span slot="content">{{row.code}}</span>
					</editable-cell>
				</el-table-column>
				<el-table-column label="名称" min-width="200">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" v-model="row.attr">
						<span slot="content">{{row.attr}}</span>
					</editable-cell>
				</el-table-column>
				<el-table-column min-width="150" label="数据类型">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" editable-component="el-select" close-event="change" v-model="row.dataType">
						<el-tag size="medium" :type="row.dataType" slot="content">
							{{row.dataType}}
						</el-tag>
						<template slot="edit-component-slot">
							<el-option value="varchar" label="字符"></el-option>
							<el-option value="integer" label="整数"></el-option>
							<el-option value="boolean" label="布尔型"></el-option>
							<el-option value="double" label="小数"></el-option>
						</template>
					</editable-cell>
				</el-table-column>
				<el-table-column label="单位" min-width="150">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" maxLength="10" v-model="row.unit">
						<span slot="content">{{row.unit}}</span>
					</editable-cell>
				</el-table-column>
				<!--<el-table-column label="最大数据长度" min-width="180">
					<editable-cell :show-input="row.editMode" slot-scope="{row}" editable-component="el-input-number"  v-model="row.dataLength">
						<span slot="content">{{row.dataLength}}</span>
					</editable-cell>
				</el-table-column>-->
			</el-table>
        </div>
        <div class="container" v-else>
        	<div class="emptyTipsMsg">
        		<i class="el-icon-warning"></i>
        		<span>请至少添加一个变量</span>
        	</div>
        	<div class="centerOpt">
        		<i class="el-icon-setting"></i>
        		<span>还没有输入变量</span>
        		<span>请在此添加第一个变量</span>
        		<el-button type="primary" icon="el-icon-plus" @click="addVariable">添加变量</el-button>
        	</div>
        </div>
        <div class="bottom">
            <p>*&nbsp;必填字段</p>
            <el-row >
                <el-button type="primary" @click="saveParameterInfo('ruleForm')">提交</el-button>
                <el-button @click="cancelOpt">取消</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>
	import EditableCell from '../../components/EditableCell.vue'
    import baseValidator from "../../common/baseValidator.js"
    export default {
        name: "DeviceParameterAddAndEdit",//设备参数添加或编辑
        components: {
			EditableCell
		},
        props:{
			parameterObj:{//parameterObj用户信息
				type: Object,
				required:true
			}
		},
        data(){
            return{
            	pageType:'添加',//页面类型 添加/编辑
                ruleForm: {
                	id:'',
                	attrSetId:'',
                    name: '',
                    describe: '',
                    attrDetails:[]//变量列表
                },
				checkResultFlag:true,//编码格式错误时不提交  true可以提交   false不能提交
                varNameCheck:(varCode)=>{
					let reg = /^[A-Za-z]{1,20}$/;
					let checkResult = true;
					if(!reg.test(varCode)){
						this.$message({
							type: 'warning',
							message: '编码必须是1~20位的字母!'
						});
						checkResult = false;
						this.checkResultFlag = false;
					}else{
						 this.checkResultFlag = true; 
					}
					return checkResult;
				},
                rules: {
                    attrSetId: [
                        {required: true, message: '请输入属性ID', trigger: 'blur'},
                        {
                            validator:baseValidator.validateAttrSetId,
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {
                            validator:baseValidator.validateParameterName,
                            trigger: 'blur'
                        }
                    ],
                    describe: [
                        {required: true, message: '请输入参数描述', trigger: 'blur'},
                        {
                            validator:baseValidator.validateParameterDesc,
                            trigger: 'blur'
                        }
                    ]
                },
            }
        },
        mounted() {
			if(this.parameterObj.id){
				this.pageType = '编辑';
				this.setFormData();//表单赋值
			}else{
				this.pageType ='添加';
			}
			this.ruleForm.attrDetails = this.ruleForm.attrDetails.map(row => {
				return {
					...row,
					editMode: false
				};
			});
		},
		methods: {
			/**
             * 删除
             */
//      	deleteClick(index,rows){
//      		 rows.splice(index, 1);
//      	},
			/*
			 * 取消 按钮点击事件
			 */
			cancelOpt(){
				this.resetForm();//重置表单
				//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("ParameterEditCallBack",false);
			},
			/**
			 * 监听 添加变量 按钮点击事件 
			 */
			addVariable(){
				this.ruleForm.attrDetails.push({
					"code":"",
		          	"attr": "",
		          	"dataType": "varchar",
		          	"dataLength": 100,
		          	"unit": ""
				});
			},
			/**
			 * 监听表格 删除 按钮点击事件 
			 */
			handleDelete(index,row){
				this.ruleForm.attrDetails.splice(index,1);
			},
			/**
			 * 提交 按钮点击事件
			 * @param formName {Object} form表单名称
			 */
			saveParameterInfo(formName) {
				let self = this;
				let oResult= this.ifRepeatedName();
				this.$refs[formName].validate((valid) => {
					if(this.ruleForm.attrDetails.length == 0){
						this.$message({
							type: 'warning',
							message: '您还没有添加变量!'
						});
						return;
					}else if(this.hasEmptyValForTable()){
						this.$message({
							type: 'error',
							message: '变量表格信息不能存在值为空的数据!'
						});
						return;
					}else if(oResult.isRepeat){
						this.$message({
							type: 'error',
							message: '变量名称：['+oResult.repeatVal+"]重复，请修改!"
						});
						return;
					}else if(!self.checkResultFlag){
						this.$message({
							type: 'warning',
							message: '编码必须是1~20位的字母!'
						});
						return;
					}else if(valid) {
						this.saveParameterRequest();
					} else {
						return false;
					}
				});
			},
			/**
			 * 表单赋值
			 */
			setFormData(){
				this.ruleForm.id=this.parameterObj.id;
				this.ruleForm.attrSetId=this.parameterObj.attrSetId;
				this.ruleForm.name=this.parameterObj.name;
				this.ruleForm.describe=this.parameterObj.describe;
				this.ruleForm.attrDetails=this.parameterObj.attrDetails;
			},
			/*
			 * 重置表单
			 */
			resetForm(){
				this.pageType ='添加';
				this.$refs['ruleForm'].resetFields();
			},
			/**
			 * 验证table是否存在字段值为空的数据
			 * @return {Boolean} isExistEmpty 是否存在空数据的字段
			 */
			hasEmptyValForTable(){
				let isExistEmpty = false;
				let whileCount =0;
				while(whileCount < this.ruleForm.attrDetails.length){
					for(let item in this.ruleForm.attrDetails[whileCount]){
						if(this.ruleForm.attrDetails[whileCount][item].toString().length == 0){
							isExistEmpty = true;
							break;
						}
					}
					whileCount=whileCount+1;
				}
				return isExistEmpty;
			},
			/**
			 * 判断变量名称是否重复
			 * @return {Object} oResult 判断结果
			 * @return {String} oResult.repeatVal 重复的值
			 * @return {Boolean} oResult.isRepeat 是否重复
			 */
			ifRepeatedName(){
				var aTableData = this.ruleForm.attrDetails;
			    var otestObj={};
			    let oResult = {
			    	repeatVal:'',
			    	isRepeat:false
			    };
			    for(var i=0;i<aTableData.length;i++){
			        if(!otestObj[aTableData[i].attr]){
			        	otestObj[aTableData[i].attr]=true;
			        }else{
			        	oResult.repeatVal = aTableData[i].attr;
			        	oResult.isRepeat = true;
			        	break;
			        }
			    }
			    return oResult;
			},
			/**
			 * 保存设备参数请求
			 */
			saveParameterRequest() {
			    let self =this;
				let oper = 'modity'
				if(this.pageType == "添加"){
					oper = 'add'
					delete self.ruleForm.id;
				}
	    		this.$axios.leansite({
            		method:'post',
                	url:this.API.leansite.saveDeviceParameter,
                	data:this.ruleForm
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0){
                    	self.$message({
				            type: 'success',
				            message: this.pageType+'参数成功!'
				        });
				        self.resetForm();//重置表单
				        //调用父组件方法--isRefresh=true需要刷新父组件的数据
						self.$emit("ParameterEditCallBack",true, oper);
                    } else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: this.pageType+'参数失败：'+resData.msg
						});
					}
                })
			}
		}
    }
</script>

<style lang="scss" scoped type="text/css">
    .deviceParameterAddAndEdit {
    	margin: 0 40px 0;
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
        .userMessageRight_bottom {
            margin-top:20px !important;
            .tab {
                border: solid 1px #bebebe;
                font-size: 14px;
                color: #323232;
                margin-bottom: 23px;
                padding-bottom:20px;
				border-radius: 3px 3px 3px 3px;
                .tab_header {
                    height: 48px;
                    line-height: 48px;
                    background-color: #FFFFFF;
                    border-bottom: solid 1px #bebebe;
                    border-bottom: none;
                    padding-left: 16px;
                    span{
                    	font-weight: bold;
                    	font-size: 18px;
                    	margin-right: 10px;
                    }
                }
                .formText{
                    margin: 0 auto;
                    padding: 0 16px;
                    .el-form{
                        width: 50%;
                        /deep/ .el-textarea .el-input__count{
                        	height: 24px !important;
                        }
                    }
                }
            }
        }
        .tableTitle{
        	height: 48px;
        	line-height: 48px;
        	margin: 24px 0 0;
        	padding:0 16px;
			background-color: #FFFFFF;
			border: solid 1px #bebebe;
			border-bottom: none;
			border-radius: 3px 3px 0 0;
	        span{
            	font-weight: bold;
            	font-size: 18px;
            	margin-right: 10px;
            }
        }
        .container{
    		border: solid 1px #bebebe;
			border-top: none;
			padding: 16px;
			border-radius: 0 0 3px 3px;
        	.tipsMsg{
				display: flex;
			    align-items: center;
			    height: 64px;
			    background-color: #ffedb5;
			    border-radius: 3px;
			    border: solid 1px #e6dbb7;
			    i{
			    	padding: 0 15px;
					font-size: 20px;
			    }
			    ul li{
			    	list-style: none;
				    font-size: 14px;
				    font-weight: normal;
				    font-stretch: normal;
				    line-height: 24px;
				    letter-spacing: 0px;
				    color: #665e48;
			    }
            }
            .el-button{
            	margin: 15px 0 5px;
            }
            .emptyTipsMsg{
            	height: 32px;
            	line-height: 32px;
				background-color: #fcd3d2;
				border-radius: 3px;
				border: solid 1px #d6b4b4;
				i{
					font-size: 17px;
					color: #811211;
					margin: 0 10px 0 16px;
				}
				span{
					font-size: 14px;
					font-weight: normal;
					font-stretch: normal;
					line-height: 24px;
					letter-spacing: 0px;
					color: #811211;
				}
            }
            .centerOpt{
            	display: flex;
				justify-content: center;
			    align-items: center;
			    flex-direction: column;
			    height: 258px;
			    i{
			    	font-size: 50px;
			    }
			    span{
				    &:first-child{
				    	margin: 10px 0 16px;
				    	font-size: 14px;
						color: #323232;
				    }
				    &:last-child{
						font-size: 14px;
						color: #969696;
				    }
			    }
            }
        }
        .bottom{
        	padding: 23px 0;
            p{
                color: #d0021b;
            }
            div{
                margin-top: 20px;
                .el-button{
                    &:first-child{
                         width: 90px;
                         height: 32px;
                         background-color: #006fe6;
                         border-radius: 4px;
                     }
                    &:last-child{
                          width: 90px;
                          height: 32px;
                          border-radius: 4px;
                          border: solid 1px #006fe6;
                          color:  #006fe6;
                    }
                }
            }
        }
    }
	/deep/ .el-form--label-top .el-form-item__label {
			 padding: 0 !important; 
		}
</style>
