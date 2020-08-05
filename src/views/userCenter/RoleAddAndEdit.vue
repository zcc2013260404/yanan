<template>
    <div class="box">
        <div class="top">
            <div>
                <span class="backMain" @click="cancelOpt">角色管理</span>
                <span class="el-icon-arrow-right">
                    <span></span>{{pageType}}角色
                </span>
            </div>
            <div>{{pageType}}角色</div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header" >
                    <span>-</span>基本信息
                </div>
                <div class="formText">
                    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="ruleForm.name" maxlength="20" show-word-limit placeholder="请输入角色名称(汉字、字母或数字组成的2~20位字符)"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="note">
                            <el-input type="textarea" v-model="ruleForm.note" maxlength="50" show-word-limit placeholder="请输入角色描述(汉字、字母或数字组成的2~50位字符)"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="bottom">
            <p>*&nbsp;必填字段</p>
            <el-row >
                <el-button type="primary" @click="saveRoleInfo('ruleForm')">提交</el-button>
                <el-button @click="cancelOpt">取消</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import baseValidator from "../../common/baseValidator.js"
    export default {
        name: "RoleAndEdit",//添加或编辑角色信息
        props:{
			roleObj:{//roleObj用户信息
				type: Object,
				required:true
			}
		},
        data(){
            return{
            	pageType:'add',//页面类型 pageType=add 新增/pageType=edit 修改
                ruleForm: {
                	id:'',
                    name: '',
                    note: ''
                },   
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {
                            validator:baseValidator.validateRoleName,
                            trigger: 'blur'
                        }
                    ],
                    note: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {
                            validator:baseValidator.validateRoleDesc,
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        mounted() {
			if(this.roleObj.id){
				this.pageType = '编辑';
				this.setFormData();//表单赋值
			}else{
				this.pageType ='添加';
			}
		},
		methods: {
			/**
			 * 表单赋值
			 */
			setFormData(){
				this.ruleForm.id=this.roleObj.id;
				this.ruleForm.name=this.roleObj.name;
				this.ruleForm.note=this.roleObj.note;
			},
			/**
			 * 保存角色信息
			 * @param formName {Object} form表单名称
			 */
			saveRoleInfo(formName) {
				let self = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.saveRoleRequest();
					} else {
						return false;
					}
				});
			},
			/*
			 * 取消
			 */
			cancelOpt(){
				this.resetForm();//重置表单
				//调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("RoleEditCallBack",false);
			},
			/*
			 * 重置表单
			 */
			resetForm(){
				this.pageType ='add';
				this.$refs['ruleForm'].resetFields();
			},
			/**
			 * 保存角色请求
			 */
			saveRoleRequest() {
			    let self =this;
				let oOrg={};
				let sMsg = "添加";
				if(self.ruleForm.id){
					sMsg = "编辑";
				}else{
					delete self.ruleForm.id;
				}
	    		this.$axios.leansite({
            		method:'post',
                	url:this.API.leansite.saveRole,
                	data:this.ruleForm
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0){
                    	self.$message({
				            type: 'success',
				            message: sMsg+'角色成功!'
				        });
				        self.resetForm();//重置表单
				        //调用父组件方法--isRefresh=true需要刷新父组件的数据
						self.$emit("RoleEditCallBack",true);
                    } else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: sMsg+'角色失败：'+resData.msg
						});
					}
                })
			},
			/**
			 * 取消
			 */
			cancelOpt() {
				// //调用父组件方法--isRefresh=false不需要刷新父组件的数据
				this.$emit("RoleEditCallBack", false);
			}
		}
    }
</script>

<style lang="scss" scoped type="text/css">
    .box {
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
                    width: 100%;
                    height: 48px;
                    line-height: 48px;
                    background-color: #FFFFFF;
			        span{
		            	font-weight: bold;
		            	font-size: 18px;
		            	margin-right: 10px;
                        margin-left: 16px;
		            }
                }
                .tab_body_select{
                    width: 93%;
                    margin: 20px auto;
                    .el-select{
                        width: 30% ;
                    }
                    .el-button{
                        width: 90px;
                        height: 35px;
                        border-radius: 4px;
                        border: solid 1px #006fe6;
                        margin-left: 8px;
                    }
                }
                .tab_body {
                    width: 93%;
                    height: 55px;
                    line-height: 55px;
                    border-bottom: solid 1px #969696;
                    margin: 0 auto;
                    display:flex;
                    justify-content: space-around;
                    div{
                        width: 40%;
                    }
                    span{
                        display: inline-block;
                        width: 30%;
                        font-size:14px;
                        line-height: 55px;
                        text-align: center;
                    }
                    .el-icon-delete{
                        color:red ;
                    }
                }
                .formText{
                    width: 93%;
                    // margin: 0 auto;
                        margin-left: 16px;
                    .el-form{
                        width: 30%;
                        /deep/ .el-textarea .el-input__count{
                        	height: 24px !important;
                        }
                    }
                }
            }
        }
        .bottom{
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
        padding:0px !important;
    }
</style>
