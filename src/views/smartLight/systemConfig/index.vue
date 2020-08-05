<template>
  <div class="energy">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contant">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <!-- <div class="table-title">
				<div>
					<div class="tits"><span class="spanti">- </span> 配置信息</div>
				</div>
			</div> -->
      <div class="addsty">
        <div class="addtitl">历史配置</div>
        <el-form ref="machineForm" :model="machineForm" :rules="rules" label-width="120px">
          <el-row style="margin-left: -70px">
            <el-col :span="6">
              <el-form-item label="灯数" prop="lightNum">
                <el-input v-model="machineForm.lightNum" size="small" placeholder="请输入灯数(1~10000)" maxlength="5" style="width: 80%" @input="machineForm.lightNum = machineForm.lightNum.replace(/[^\d]/g, '')" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="单灯功率" prop="singleLightW">
                <el-input v-model="machineForm.singleLightW" size="small" placeholder="请输入功率(1~1000)" maxlength="4" style="width: 80%" @input="
										machineForm.singleLightW = machineForm.singleLightW.replace(/[^\d]/g, '')
									" />
                W
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="每日运行时长" prop="dayRunTime">
                <el-input v-model="machineForm.dayRunTime" size="small" placeholder="请输入每日运行时长(0~24)" maxlength="4" style="width: 80%" @input="machineForm.dayRunTime = machineForm.dayRunTime.replace(/[^\d.]/g, '')" />
                小时
              </el-form-item>
            </el-col>
            <el-col :span="3" class="btnsty">
              <el-button v-if="hasPermission('originalPower/insert')" size="mini" type="primary" @click="submitForm('machineForm')">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- <el-form ref="wifimachineForm" :model="wifimachineForm" :rules="rules" label-width="135px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="统一Wifi密码" prop="wifipwd">
                <el-input v-model="wifimachineForm.wifipwd" placeholder="请输入统一Wifi密码" maxlength="30" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="3" class="btnsty">
              <el-button v-if="hasPermission('originalPower/insert')" type="primary" @click="submitForm('wifimachineForm')">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-form ref="lightmachineForm" :model="lightmachineForm" :rules="rules" label-width="135px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="光感强度" prop="lightIntensity">
                <el-input v-model="lightmachineForm.lightIntensity" placeholder="请输入光感强度" maxlength="5" style="width: 80%" @input="
										lightmachineForm.lightIntensity = lightmachineForm.lightIntensity.replace(
											/[^\d]/g,
											''
										)
									" />
              </el-form-item>
            </el-col>
            <el-col :span="3" class="btnsty">
              <el-button v-if="hasPermission('originalPower/insert')" type="primary" @click="submitForm('lightmachineForm')">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-form ref="peoplemachineForm" :model="peoplemachineForm" :rules="rules" label-width="135px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="人感延迟时间" prop="delayTime">
                <el-input v-model="peoplemachineForm.delayTime" placeholder="请输入人感延迟时间" maxlength="3" style="width: 80%" @input="
										peoplemachineForm.delayTime = peoplemachineForm.delayTime.replace(/[^\d]/g, '')
									" />
                秒
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人感触发阈值" prop="triggerValue">
                <el-input v-model="peoplemachineForm.triggerValue" placeholder="请输入人感触发阈值" maxlength="5" style="width: 80%" @input="
										peoplemachineForm.triggerValue = peoplemachineForm.triggerValue.replace(
											/[^\d]/g,
											''
										)
									" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人感目标最低亮度" prop="lowValue">
                <el-input v-model="peoplemachineForm.lowValue" placeholder="请输入人感目标最低亮度" maxlength="5" style="width: 80%" @input="
										peoplemachineForm.lowValue = peoplemachineForm.lowValue.replace(/[^\d]/g, '')
									" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="人感目标最高亮度" prop="hiValue">
                <el-input v-model="peoplemachineForm.hiValue" placeholder="请输入人感目标最高亮度" maxlength="5" style="width: 80%" @input="
										peoplemachineForm.hiValue = peoplemachineForm.hiValue.replace(/[^\d]/g, '')
									" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开启关闭" prop="status">
                <el-switch v-model="peoplemachineForm.status" />
              </el-form-item>
            </el-col>
            <el-col :span="3" class="btnsty">
              <el-button v-if="hasPermission('originalPower/insert')" type="primary" @click="submitForm('peoplemachineForm')">
                保存
              </el-button>
            </el-col>
          </el-row>
        </el-form> -->
      </div>
    </div>
  </div>
</template>
<script src="./manage.js" />
<style lang="scss" scoped>
.energy {
  height: calc(100vh - 97px);
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contant {
    height: calc(100vh - 97px);
    padding: 15px 40px;
    overflow: auto;
    h1 {
      font-weight: bold;
      font-size: 36px;
      color: #323232;
      padding: 10px;
    }
    .addsty {
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
      margin-bottom: 15px;
      border: 1px solid #bebebe;
      height: calc(100vh - 190px);
      /deep/ .el-button--mini {
        padding: 7px 25px;
        background-color: #006fe6;
        border-color: #006fe6;
        margin-top: 3px;
      }
      /deep/ .el-button--text {
        color: #006fe6;
      }
      .btnsty {
        text-align: left;
      }
      .addtitl {
        padding: 15px 0px;
      }
    }
    .tabsty {
      margin: 10px;
      margin-top: 0px;
      border-left: 1px solid #bebebe;
      border-right: 1px solid #bebebe;
      border-bottom: 1px solid #bebebe;
      padding: 0px 10px;
      padding-bottom: 75px;
      padding-top: 20px;
      .el-table td,
      .el-table th.is-leaf,
      .el-table--border,
      .el-table--group {
        border-color: #bebebe;
      }
      .el-table--border::after,
      .el-table--group::after {
        background-color: #bebebe;
      }
      .el-table::before {
        background: #fff;
      }
      /deep/ .is-leaf {
        border-bottom: 1px solid #bebebe;
        border-right: 1px solid #bebebe;
      }
      /deep/ .el-table__row td {
        border-bottom: 1px solid #bebebe;
        border-right: 1px solid #bebebe;
      }
    }
    .table-title {
      height: 40px;
      margin: 10px 0px;
      margin-bottom: 0px;
      border: 1px solid #bebebe;
      .tits {
        padding-left: 15px;
        padding-top: 5px;
      }
      .spanti {
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }
    }
    .title {
      margin-top: -15px;
      font-size: 14px;
    }
    .imgposi {
      float: right;
    }
    .cols {
      text-align: center;
      margin-top: 20px;
    }
    .ssupd {
      line-height: 35px;
      font-size: 18px;
      margin-top: 50px;
      font-weight: bold;
    }
    /deep/ .pagination-con {
      margin: 20px 0 0 22px;
      float: right;
    }
    #mapLight {
      position: relative;
      overflow: hidden;
      height: auto;
      display: inline-block;
      > img {
        max-width: 100%;
        height: auto;
        filter: blur(0px);
      }
      .chooseImg {
        position: relative;
      }
      > div {
        position: absolute;
        cursor: pointer;
        width: 60px;
      }
    }
  }
}
</style>
