<template>
  <div class="senseStatistics">
    <div class="leftmenu">
      <leftmenu />
    </div>
    <div class="contant">
      <div class="title">
        <SecondBreadcrumb />
      </div>
      <div>
        <span class="spansty">数据周期</span>
        <el-select v-model="areaValue" placeholder="选择区域" size="small" @change="changeArea()">
          <el-option v-for="(item, index) in areaOptions" :key="index" :label="item.area" :value="index">
          </el-option>
        </el-select>
        <span class="spansty">统计周期</span>
        <el-date-picker v-model="datavalue" :editable="false" :clearable="false" :picker-options="startpickerOptions" type="date" placeholder="选择日期" />
      </div>
      <div class="mapsty">
        <div id="mapLight">
          <img v-show="backImg !== undefined && backImg !== null && backImg !== ''" :src="backImg" alt="">
          <div id="hotMap" class="hotcls" :style="{width:chartsWidth+'px',height:chartsHeight+'px'}" />
          <div v-for="(item, index) of lightList" :key="index" :style="{left:item.xaxis*100+'%',top:item.yaxis*100+'%'}" class="lightcls">
            <img :id="`lightsImg${item.id}`" :style="{width:lightSize}" :src="lightImg1" alt="" click='false' :ref="index" :index="index" class="lightsImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./manage.js"/>
<style lang="scss" scoped>
.senseStatistics {
  .leftmenu {
    float: left;
    height: calc(100vh - 97px);
  }
  .contant {
    height: calc(100vh - 97px);
    padding: 0px 30px;
    overflow: auto;
    .title {
      padding: 0px 10px;
      font-size: 14px;
    }
    .spansty {
      margin-left: 10px;
      margin-right: 10px;
    }
    .mapsty {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      padding: 0px 10px;
    }
    #mapLight {
      position: relative;
      overflow: hidden;
      height: auto;
      display: inline-block;
      .hotcls {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 99;
      }
      > img {
        max-width: 100%;
        height: auto;
        filter: blur(0px);
      }
      .chooseImg {
        position: relative;
      }
      .lightcls {
        position: absolute;
        cursor: pointer;
        width: 60px;
      }
    }
  }
}
</style>
