<template>
  <div class="chartpage">
    <div class="pickbox">
      <picker @change="ChangeChildren($event)" :value="index" :range="childrenList" class="pick">
        <view class="picker">{{childrenList[index]}}</view>
      </picker>
      <div style="height:8rpx;"></div>
    </div>
    <div class="echarts-wrap">
      <mpvue-echarts :echarts="echarts" :onInit="Init" ref="echarts"/>
    </div>
    <div class="chartpage_bottom">
      <div class="bottom_button">
        <img class="btn" src="../../../static/image/add.png" alt @click="ChangeHightNow">
      </div>
      <div class="bottom_content">
        <p class="content_p">连续添加数据，</p>
        <p class="content_p">即可自动生成您或（孩子）的身高曲线图，</p>
        <p class="content_p">根据曲线图判断您或（孩子）生长情况。</p>
      </div>
    </div>
  </div>
</template>



<script>
import ajax from "@/utils/ajax.js";
import echarts from "echarts";
import mpvueEcharts from "mpvue-echarts";
import { man, woman } from "@/utils/data.js";
let chart = null;
// 时间线
let timeList = [];
let allHightparam = {
  allNormalhight: null,
  allPerfecthight: null,
  allLowhight: null,
  allMyhight: null
};
//总optios
let option = {
  legend: {
    itemWidth: 10,
    itemHeight: 7,
    data: ["正常身高", "完美身高", "矮小身高", "你的身高"],
    itemGap: 5
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      handleSize: false,
      start: 0,
      end: 30,
      default: false,
      type: "inside"
    }
  ],
  calculable: true,
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: timeList
    }
  ],
  yAxis: [
    {
      type: "value",
      max: "dataMax",
      min: "dataMin",
      nameGap: 0
    }
  ],
  series: [
    {
      itemStyle: { normal: { label: { show: true } } },
      name: "正常身高",
      type: "line",
      data: allHightparam.allNormalhight
    },
    {
      itemStyle: { normal: { label: { show: true } } },
      name: "完美身高",
      type: "line",
      data: allHightparam.allPerfecthight
    },
    {
      itemStyle: { normal: { label: { show: true } } },
      name: "矮小身高",
      type: "line",
      data: allHightparam.allLowhight
    },
    {
      itemStyle: { normal: { label: { show: true } } },
      name: "你的身高",
      type: "line",
      data: allHightparam.allMyhight
    }
  ]
};

// 默认函数
let HandleInit = function(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
};
export default {
  data() {
    return {
      childrenList: [],
      index: 99,
      childrenInfolist: [],
      echarts,
      Init: HandleInit,
      childrenSex: null,
      childrenAge: null,
      normalHight: [],
      perfectHight: [],
      lowHight: [],
      youHightlist: [],
      id: [],
      nowHeightneed: null
    };
  },

  components: {
    mpvueEcharts
  },

  methods: {
    // 添加x轴
    InitChart() {
      let yearnow = new Date().getFullYear();
      let monthnow = new Date().getMonth() + 1;
      for (let i = monthnow; i <= 12; i++) {
        timeList.push(`${yearnow}年/${i}月`);
        if (i == 12) {
          for (let z = 0; z <= monthnow - 1; z++) {
            timeList.push(`${yearnow + 1}年/${z + 1}月`);
          }
        }
      }
    },

    //各项高度函数
    HightComputed(x, y, z) {
      let age = JSON.parse(this.childrenAge);
      let num = z[x][`${age + 1}`] - z[x][`${age}`];
      let fixNum = num.toFixed(1) / 12;
      for (let i = 0; i < 11; i++) {
        let item = JSON.parse(z[x][`${age}`]) + i * fixNum;
        y.push(item.toFixed(1));
      }
    },

    //计算高度
    ChangeData() {
      this.normalHight = [];
      this.perfectHight = [];
      this.lowHight = [];
      if (this.childrenSex == 1) {
        let mandata = man;
        this.HightComputed(0, this.normalHight, mandata);
        this.HightComputed(1, this.perfectHight, mandata);
        this.HightComputed(2, this.lowHight, mandata);
      } else {
        let womandata = woman;
        this.HightComputed(0, this.normalHight, womandata);
        this.HightComputed(1, this.perfectHight, womandata);
        this.HightComputed(2, this.lowHight, womandata);
      }
    },

    //切换孩子
    ChangeChildren(e) {
      this.youHightlist = [];
      this.index = e.mp.detail.value;
      this.Requesta();
    },

    //获取当前身高
    Requesta() {
      let url2 = `https://wx.biergao.vip/api/Child/clist/`;
      let data2 = {
        cid: this.id[this.index]
      };
      ajax
        .Post(url2, data2)
        .then(result => {
          // 判断是否有数据，有就计算当前身高，没有跳过
          let list = [];
          if (result != 0) {
            for (let i = 0; i < result.length; i++) {
              list.push(result[i].nowheight);
            }
            this.nowHeightneed = result[0].nowheight;
          } else {
            // 传递的身高设置为0
            this.nowHeightneed = null;
          }
          //正常操作
          this.childrenSex = this.childrenInfolist[this.index].sex;
          this.childrenAge = this.childrenInfolist[this.index].age;
          this.ChangeData();
          option.series[0].data = this.normalHight;
          option.series[1].data = this.perfectHight;
          option.series[2].data = this.lowHight;
          option.series[3].data = list;
          chart.setOption(option);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取十二个月的数据
    init() {
      //  请求获取孩子的数量和信息，获取成功push到childrenList中,获取年龄和性别，还有自己的身高
      // 如今之后第一次更新图表
      let url1 = `https://wx.biergao.vip/api/Child/childlist`;
      let data1 = {
        openid: this.$store.state.userParam.openId
      };
      ajax
        .Post(url1, data1)
        .then(result => {
          if (this.childrenList.length == 0) {
            for (let i = 0; i < result.length; i++) {
              this.childrenList.push(result[i].name);
              this.id.push(result[i].id);
            }
          }
          this.childrenInfolist = result;
          this.index = 0;
          this.InitChart();
          this.Requesta();
        })
        .catch(err => {
          if (this.childrenList.length == 0) {
            for (let i = 0; i < result.length; i++) {
              this.childrenList.push(result[i].name);
              this.id.push(result[i].id);
            }
          }
          this.childrenInfolist = result;
          this.index = 0;
          this.InitChart();
          this.Requesta();
          console.log(err);
        });
    },

    // 默认数据
    EchartsDefaultParam() {
      this.childrenSex = 0;
      this.childrenAge = 1;
      this.youHightlist = [];
    },

    //去修改身高页面
    ChangeHightNow() {
      wx.navigateTo({
        url: `/pages/changehight/main?hight=${this.nowHeightneed}&id=${
          this.childrenInfolist[this.index].id
        }&openId=${this.childrenInfolist[this.index].pid}&name=${
          this.childrenInfolist[this.index].name
        }`
      });
    }
  },

  created() {
    this.EchartsDefaultParam();
  },

  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.chartpage_bottom {
  margin-top: 30rpx;
}

.bottom_button {
  text-align: center;
}

.bottom_content {
  margin-top: 20rpx;
}

.content_p {
  color: #999;
  font-size: 30rpx;
  text-align: center;
}

.btn {
  width: 50rpx;
  height: 50rpx;
  background-color: rgb(250, 124, 34);
  border-radius: 80rpx;
  padding: 20rpx;
}

.echarts-wrap {
  width: 100%;
  height: 300px;
}

.pick {
  color: #ec881d;
  text-align: center;
  background-color: white;
  width: 90%;
  margin: 0 auto;
  border-radius: 30rpx;
  padding: 10rpx 0px;
  margin-bottom: 5rpx;
}

.pickbox {
  background-color: blue;
}
</style>
