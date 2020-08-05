<template>
	<div class="outputBox">
		<div class="event_body">
			<div class="table-title"><span>-</span> 基本信息</div>
			<div class="container">
				<div class="baseMessage">
					<div class="baseMessage_left">
						<img :src='deviceObject.classifySet.imagePath?baseUrl+deviceObject.classifySet.imagePath:imgUrl' alt="设备图片"/>
					</div>
					<div class="baseMessage_right">
						<span>类型：{{deviceObject.classifyName}}</span>
						<span>描述：{{deviceObject.note}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span> 网络设备</div>
			<div class="container">
				<div class="networkDevices" v-if="deviceObject.netDevicesList.length>0">
					<p>连接状态 &nbsp;&nbsp;:&nbsp;&nbsp;<span :class="[selectDeviceStatus?'green':'gray']">
						{{selectDeviceStatus?'在线中':'离线'}}
					</span> </p>
					<p>网络设备名称 &nbsp;&nbsp;:&nbsp;&nbsp;{{deviceObject.netDevicesList[0].name}}</p>
					<p>网络设备SN码 &nbsp;&nbsp;:&nbsp;&nbsp;{{deviceObject.netDevicesList[0].license}}</p>
					<p>IP &nbsp;&nbsp;:&nbsp;&nbsp;{{deviceObject.netDevicesList[0].ip}}</p>
					<p>子网掩码 &nbsp;&nbsp;:&nbsp;&nbsp;{{deviceObject.netDevicesList[0].gateway}}</p>
					<p>默认网关 &nbsp;&nbsp;:&nbsp;&nbsp;{{deviceObject.netDevicesList[0].mask}}</p>
				</div>
				<div class="networkDevices" v-else-if="deviceObject.netDevicesList.length==0">
					<p>连接状态 &nbsp;&nbsp;:&nbsp;&nbsp;<span :class="[selectDeviceStatus?'green':'gray']">
						{{selectDeviceStatus?'在线中':'离线'}}</span> </p>
					<p>网络设备名称 &nbsp;&nbsp;:&nbsp;&nbsp;暂无数据</p>
					<p>网络设备SN码 &nbsp;&nbsp;:&nbsp;&nbsp;暂无数据</p>
					<p>IP &nbsp;&nbsp;:&nbsp;&nbsp;暂无数据</p>
					<p>子网掩码 &nbsp;&nbsp;:&nbsp;&nbsp;暂无数据</p>
					<p>默认网关 &nbsp;&nbsp;:&nbsp;&nbsp;暂无数据</p>
				</div>
			</div>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span> 设备健康</div>
			<div class="container">
				<div class="networkDevices">
					<p>目前状态：<span>无警报</span> </p>
					<p>历史状态：30次报警</p>
				</div>
			</div>
		</div>
		<div class="event_body">
			<div class="table-title"><span>-</span> 位置信息</div>
			<div class="container">
				<div class="position">
					<div class="position_left">
						<div class="singleMessage">
							<span>省份</span>
							<span>陕西省</span>
						</div>
						<div class="singleMessage">
							<span>路段</span>
							<span>高新六路46号</span>
						</div>
						<div class="singleMessage">
							<span>城市</span>
							<span>西安市</span>
						</div>
						<div class="singleMessage">
							<span>具体位置</span>
							<span>大航联科实验室</span>
						</div>
						<div class="singleMessage">
							<span>地区</span>
							<span>雁塔区</span>
						</div>
						<div class="singleMessage">
							<span>地区</span>
							<span>雁塔区</span>
						</div>
					</div>
					<div class="position_right">
						<img src="../../assets/img/monitorCenter/defalutMap.png" alt="位置信息图片"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Information',	
		components: {
		},
		props: {
			deviceObject: { //deviceObject设备信息
				type: Object,
				required: true
			},
		},
		data() {
			let baseImageUrl = this.API.leansite.baseURL;
			let substrUrl = baseImageUrl.substr(0, baseImageUrl.length - 1)
			return {
				baseUrl:substrUrl,
				imgUrl: require('../../assets/img/defaultImg.png'), //图片示例
				selectDeviceStatus:null,//当前选中设备状态
				timer:null,
			}
		},
		mounted() {
			this.getselectDeviceStatusRequest()
			this.timer=window.setInterval(()=>{
				this.getselectDeviceStatusRequest();
			},300000);
		},
		beforeDestroy(){
        	clearInterval(this.timer);
        },
		methods: {
			/**
			 * 获取选中设备状态请求
			 */
			getselectDeviceStatusRequest() {
				this.$axios.leansite({
					method: 'get',
					url: this.API.leansite.getDeviceStatusBytbid,
					params:{
						tbId:this.deviceObject.tbId
					}
				}).then((res) => {
					var resData = res.data;
					if(resData.code == 0) {
						this.selectDeviceStatus = resData.data.active;
					}
				});
			},
		}

	}
</script>

<style lang="scss" scoped type="text/css">
	.outputBox {
		background: #fff;
		width: 100%;
		height: calc(100vh - 171px);
		height: -webkit-calc(100vh - 171px);
		height: -moz-calc(100vh - 171px);
		overflow: hidden;
		padding-bottom: 540px;
		.event_body {
			width: 95%;
			margin: 20px auto;
			div.table-title {
				margin-top: 24px;
				height: 48px;
				line-height: 48px;
				border-radius: 3px 3px 0 0;
				/*margin: 24px 40px 0;*/
				padding: 0 16px;
				background-color: #FFFFFF;
				border: solid 1px #bebebe;
				/*border-bottom:none;*/
				span {
					font-weight: bold;
					font-size: 18px;
					margin-right: 10px;
				}
			}
			.container {
				border: 1px solid #bebebe;
				border-top: none;
				border-radius: 0 0 3px 3px;
				overflow: hidden;
				/*min-height: 787px;*/
				.baseMessage{
					display: flex;
					width:100%;
					.baseMessage_left{
						width: 25%;
						height: 254px;
						background-color: #f0f0f0;
						text-align: center;
						line-height: 254px;
						margin: 23px 16px;
						img{
							width: 91.67%;
							height: 136px;
						}
					}
					.baseMessage_right{
						margin: 24px 0 0 24px;
						width: 75%;
						span{
							width: 50%;
							display: block;
							color: #323232;
							margin-bottom: 16px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 3;
							overflow:hidden;
							/*! autoprefixer: off */
							-webkit-box-orient: vertical;
						}
					}
					
				}
				.networkDevices{
					overflow: hidden;
					padding-bottom: 14px;
					p{
						margin: 14px 0 0 16px;
						color: #323232;
						.gray{
					    	color: #969696;
					    }
					    .green{
					    	color: #65c728;
					    }
					}
				}
				.position{
					display: flex;
					justify-content: space-between;
					width: 100%;
					.position_left{
						width: 45%;
						display:flex;
						justify-content: left;
						flex-wrap: wrap;
						margin-left:16px;
						.singleMessage{
							width: 50%;
							margin: 38px 0 0 0;
							span{
								display: block;
								&:first-child{
									font-size: 12px;
									color: #969696;
								}
								&:last-child{
									font-size: 14px;
									color: #323232;
								}
							}
						}
						
					}.position_right{
						width: 50%;
						img{
							width: 100%;
							height: 306px;
						}
					}
				}
				.el-form-item {
					width: 70%;
					margin: 17px;
					/deep/ .el-form-item__label {
						padding: 0!important;
						
					}
				}
			}
		}
	}
</style>