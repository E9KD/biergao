<template>
  <div class="changehight">
    <div class="changehight_box">
      <div class="box_p">
        <p>修改目前身高</p>
      </div>
      <div class="box_picker">
        <picker
          @change="ChangeChildren($event)"
          :value="index"
          :range="childrenHightlist"
          class="pick"
        >
          <view class="picker">{{content}}</view>
        </picker>
      </div>
      <div class="box_botton">
        <p class="btn" @click="ChangeHightButton">GO</p>
      </div>
    </div>
    <img src="../../../static/image/nutrition.png" alt class="bgi">
  </div>
</template>

<script>
import ajax from "@/utils/ajax.js";
import { changeHightNowUrl } from "@/utils/api.js";
export default {
  data() {
    return {
      childrenHightlist: [],
      index: 0,
      hightNow: null,
      openId: null,
      id: null,
      name: null,
      hight: null,
      content: null
    };
  },
  methods: {
    ChangeHightButton() {
      // 进行请求，发送数据
      let heightNow = Number(this.index) + 50;
      let data = {
        openid: this.openId,
        id: this.id,
        name: this.name,
        nowheight: heightNow
      };
      ajax
        .Get(`${changeHightNowUrl}${this.$store.state.userParam.openId}`, data)
        .then(res => {
          if (res) {
            wx.navigateBack({
              delta: 2
            });
          }
        });
    },
    AddList() {
      if (this.childrenHightlist.length > 0) return;
      for (let i = 50; i <= 180; i++) {
        this.childrenHightlist.push(i);
      }
    },
    ChangeChildren(e) {
      this.index = e.mp.detail.value;
    },
    init(x) {
      this.openId = x.openId;
      this.name = x.name;
      this.id = x.id;
      if (x.hight != "null") {
        this.hight = x.hight;
        this.index = x.hight - 50;
        this.content = `当前身高：${this.childrenHightlist[this.index]}CM`;
        return;
      }
      this.content = `未选择当前身高！`;
    }
  },
  onLoad(x) {
    this.AddList();
    this.init(x);
  }
};
</script>

<style scoped>
.changehight_box {
  margin-top: 175rpx;
  position: relative;
  z-index: 22;
}

.box_p {
  color: #999;
  text-align: center;
  font-size: 35rpx;
}

.box_picker {
  color: #999;
  position: relative;
  margin-top: 20rpx;
  overflow: hidden;
  height: 50rpx;
}

.pick {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 400rpx;
  height: 50rpx;
  font-size: 30rpx;
  line-height: 50rpx;
  padding-left: 20rpx;
  border-radius: 10rpx;
}

.box_botton {
  position: relative;
  margin-top: 40rpx;
  height: 100rpx;
}

.btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30rpx;
  color: white;
  padding: 20rpx;
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  background-color: #ec881d;
  border-radius: 50rpx;
}
</style>
