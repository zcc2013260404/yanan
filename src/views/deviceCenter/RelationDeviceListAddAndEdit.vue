<template>
    <div class="deviceTypeAddAndEdit">
        <div class="top">
            <div>
                <span class="backMain" @click="cancelOpt">工业设备</span>
                <span class="el-icon-arrow-right">
                    <span></span>编辑配置
                </span>
            </div>
            <div>填写信息</div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header "> <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span> 选择网络配置</div>
                <div class="emptyTipsMsg">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-info"></i>
                    <span>&nbsp;请选择将要配置的网络设备</span>
                </div>
                <div class="tab_body">
                    <div class="formText">
                        <div style="height: 40px;line-height: 40px">网络设备</div>
<!--                        <hr>-->
                            <el-input type="text" disabled v-model="typeObj.name" style="background-color: #fff" ></el-input>
<!--                        <hr>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="userMessageRight_bottom" >
            <div class="user_message tab">
                <div class="tab_header"> <span class="el-icon-minus" style="font-size: 14px; font-weight: 800;"></span>  关联设备</div>
                <div class="el-transfer-box">
                    <el-transfer
                        filterable
                        filter-placeholder="seach"
                        :titles="['可用设备', '已分配设备']"
                        v-model="bindData"
                        :props="props"
                        @change="transferChange"
                        clearable
                        :data="data">
                    </el-transfer>
                </div>
            </div>
        </div>
        <div class="bottom">
<!--            <p>*&nbsp;必填字段</p>-->
            <el-row >
                <el-button style="display: inline-block" type="primary" @click="saveTypeInfo()">提交</el-button>
                <el-button style="display: inline-block" @click="cancelOpt">取消</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import baseValidator from "../../common/baseValidator.js"
    export default {
        name: "RelationDeviceListAddAndEidt",//设备类型添加或编辑
        props:{
            typeObj:{//typeObj用户信息
                type: Object,
                required:true
            }
        },
        data(){
            return{
                data:[],//穿梭框的数据
                value: [],
                props: {
                    multiple: true, //让选择框可以多选
                    key: 'id', //value和label是映射级联选择中的数据
                    label: 'name',
                    city:'name'
                },
                bindData:[],//已绑定的值
                variable:'',//变量绑定的值
                productIds: [],//绑定了的设备的id
                timer:''
            }
        },
        mounted() {
//          if(this.typeObj.typeId==1){
//          	let self = this;
//          	this.$axios.leansite.all([this.BIControlNotBindRequest(), this.BIControlRequest()])
//				.then(self.$axios.spread((res1, res2) => {
//					console.log(res1, res2)
//				    this.data=res1.data;
//				    if(res2.code == 0) {
//                      res2.data.forEach((item,index)=>{
//                          this.bindData.push(item.id)
//                          if(this.data.indexOf(item)==-1){
//                          	this.data.push(item)
//                          }
//                      })
//                  }
//				}))
//              
//         }else if(this.typeObj.typeId==2||this.typeObj.typeId==3||this.typeObj.typeId==4){
//              this.$axios.leansite.all([this.integratedMachineNotBindRequest(), this.integratedMachineRequest()])
//				.then(this.$axios.spread((res1, res2) => {
//				    this.data=res1.data;
//				    if(res2.code == 0) {
//                      res2.data.forEach((item,index)=>{
//                          this.bindData.push(item.id)
//                          if(this.data.indexOf(item)==-1){
//                          	this.data.push(item)
//                          }
//                      })
//                  }
//				}))
//         }
           if(this.typeObj.typeId==1){
           	this.BIControlNotBindRequest()
           }else if(this.typeObj.typeId==2||this.typeObj.typeId==3||this.typeObj.typeId==4){
           	this.integratedMachineNotBindRequest()
           }
        },
        methods: {
            /**
             * 取消
             */
            cancelOpt() {
                //调用父组件方法--isRefresh=false不需要刷新父组件的数据
                this.$emit("RelationEditCallBack", false);
            },
            /**
             * 点击把保存
             */
            saveTypeInfo(){
                this.saveRequest();
            },
            /**
             * 监听穿梭狂的变化
             */
            transferChange(val){
                this.productIds = val.toString()
                
            },
            /**
             * 已绑定一体机接口
             */
            integratedMachineRequest(){
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.integratedMachine,
                    params:{
                        netId:this.typeObj.id
                    }
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0) {
                        resData.data.forEach((item,index)=>{
                            this.bindData.push(item.id)
                            if(this.data.indexOf(item)==-1){
                            	this.data.push(item)
                            }
                        })
                    }
                })
            },
            /**
             * 未绑定一体机接口
             */
            integratedMachineNotBindRequest(){

                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.integratedMachineNotBind,
                    params:{
                        // netId:this.typeObj.id
                    }
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0) {
                        this.data = resData.data;
                        this.integratedMachineRequest()
                    }
                })
            },
            /**
             * 已绑定BI控制器接口
             */
            BIControlRequest(){
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.BIControl,
                    params:{
                        netId:this.typeObj.id
                    }
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0) {
                        resData.data.forEach((item,index)=>{
                            this.bindData.push(item.id)
                            if(this.data.indexOf(item)==-1){
                            	this.data.push(item)
                            }
                        })
                    }
                })
            },
            /**
             * 未绑定BI控制器接口
             */
            BIControlNotBindRequest(){
                this.$axios.leansite({
                    method: 'get',
                    url: this.API.leansite.BIControlNotBind,
                    params:{
                        // netId:this.typeObj.id
                    }
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0) {
                        this.data = resData.data;
                        this.BIControlRequest()
                    }
                })
            },
            /**
             * 保存编辑接口
             */
            saveRequest(){
            	if(this.productIds.length==0){
            		this.productIds = this.bindData.toString()
            	}
                this.$axios.leansite({
                    method: 'POST',
                    url: this.API.leansite.saveRelation,
                    params:{
                        netId:this.typeObj.id,
                        productIds:this.productIds,
                        type:this.typeObj.typeId
                    }
                }).then((res) => {
                    var resData = res.data;
                    if(resData.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '编辑保存成功！'
                        });
                        this.$emit("RelationEditCallBack", true);
                    } else if(resData.code == 1000) {
						this.$message({
							type: 'error',
							message: '关联配置失败'+resData.msg
						});
					}
                })
            }
        },
         beforeDestroy() {
		      clearTimeout(this.timer);
		    }
    }
</script>

<style lang="scss" scoped type="text/css">
    .deviceTypeAddAndEdit {
        width: 90%;
        margin: 0 40px;
        height:100%;
        overflow-y:auto;
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
        width: 100%;
        border: solid 1px #bebebe;
        font-size: 14px;
        color: #323232;
        margin-bottom: 23px;
        padding-bottom:20px;
        border-radius: 3px 3px 3px 3px;
        text-algin:center;
        .emptyTipsMsg{
            margin: 10px 0 10px 20px;
            width: 95%;
            height: 32px;
            background-color: #d1e8f0;
            border-radius: 3px;
            border: solid 1px #bbd0d7;
            line-height: 32px;
        }
    .tab_header {
        height: 48px;
        line-height: 48px;
        /*background-color: #f0f0f0;*/
        /*border-bottom: solid 1px #bebebe;*/
        padding-left: 16px;
    }
    .el-transfer-box{
        margin: 20px;
        /deep/ .el-button--primary.is-disabled{
            display: block;
            color:#006fe6;
            background-color: transparent;
            margin: 10px 0;
            border: none;
        }
        /deep/ .el-transfer-panel .el-transfer-panel__header{
            background-color:transparent !important;
            border-bottom: none;
            text-align: center;
        }
    /deep/ .el-icon-arrow-left:before {
        content: "\E6DD";
        font-size: 20px;
    }
    /deep/ .el-icon-arrow-right:before {
        content: "\E6DC";
        font-size: 20px;
    }

    }

    .tab_body{
        width: 100%;
        overflow: hidden;
    }
    .formText{
        width: 50%;
        margin: 0 auto;
        padding: 0 16px;
        float:left;
    .el-form{
        width:100%;
    }
    }
    }
    }
    .tableTitle{
        height: 48px;
        line-height: 48px;
        margin: 24px 0 0;
        padding:0 16px;
        background-color: #f0f0f0;
        border: solid 1px #bebebe;
    }
    .container{
        border: solid 1px #bebebe;
        border-top: none;
        padding: 16px;
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


</style>
