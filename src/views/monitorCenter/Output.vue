<template>
  <div class="box">
    <div class="title">实时数据示例</div>
    <div class="box_top">
      <div class="box_top_left">
        <div class="title_b">message数据格式示例：</div>
        <xmp>
          {
          "code": 200,
          "data": [
          {
          "topic": "topicName",
          “entity": {
          "device_number": "HP-PGTF-005",
          "device_name": "新流水线2",
          "params_name": "bei_yong_3",
          "params_value": 4.367766,
          "create_time": "2020-04-17 12:23:09",
          "ts": 1587097389.2884068,
          "factoryCode": "dhlk"
          }
          }
          ],
          "msg": "数据传输成功"
          }
        </xmp>

      </div>
      <div class="box_top_right">

        <div class="box_top_right_top">
          <div class="title_b">message数据格式示例：</div>
          <xmp>
            code：200表示传输成功
            data：传输的数据体
            msg：提示消息
            Topic：主题
            Entity：数据体
          </xmp>
        </div>
        <div class="box_top_right_top">
          <div class="title_b">参数：</div>
          <xmp>

            方式 Post
            参数 message 类型jsonobject
            接口示例 http://IP/topic/{topic}

          </xmp>
        </div>
      </div>
    </div>

    <div class="title title_bottom">离线数据接口</div>
    <div class="box_top">

      <div class="box_top_right">

        <div class="box_top_right_top">
          <div class="title_b">1.按天下载离线数据</div>
          <xmp>
            API：http://IP/offlinedata/token/{token}/day/{day}/download
            token：认证字符
            day： 制定的日期 2020-4-17
            返回：csv

          </xmp>
        </div>
        <div class="box_top_right_top">
          <div class="title_b">2.离线数据列表</div>
          <xmp>

            API：http://IP/offlinedata/token/{token}/list
            token：认证字符
            返回：列表格式，用户自行选择下载

          </xmp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Output',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.box {
  border: 1px solid #b4b4b4;
  width: 90%;
  margin: 20px auto;
  // padding:10px 20px;
  .title {
    font-size: 24px;
    color: #323232;
    border-bottom: 1px solid #b4b4b4;
    padding: 15px 25px;
  }
  .box_top {
    width: 100%;
    display: flex;
    .title_b {
      // text-align:center;
      padding-left: 20px;
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      color: #323232;
      margin-top: 15px;
      // border-bottom:1px solid #b4b4b4;
    }
    .box_top_left {
      width: 50%;
      border-right: 1px solid #b4b4b4;
      xmp {
        // width:200px;
        font-size: 14px;
        font-family: 'PingFang-SC-Medium', 'Microsoft Yahei', 'Helvetica Neue', Arial, sans-serif;
        padding-left: 20px;
        margin-top: -10px;
      }
    }
    .box_top_right {
      width: 50%;

      xmp {
        // width:200px;
        font-family: 'PingFang-SC-Medium', 'Microsoft Yahei', 'Helvetica Neue', Arial, sans-serif;
        padding-left: 20px;
        margin: 0;
        margin-top: -10px;
      }
    }
  }
}
/deep/ .title_bottom {
  border-top: 1px solid #b4b4b4;
}
</style>