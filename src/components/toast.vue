<template>
  <div class="toastbox" v-show="toastshow">
    <!-- loading -->
    <div class="toast">
      <!-- <img src="/static/image/close.png" alt="#" class="toastclose" v-show="toastcom[1]" @click="toastclose"> -->
      <img :src="toastcom.img" class="toastimg">
      <p class="toastext">{{toastcom.content}}</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      toastcom: {
        img: "",
        content: ""
      },
      loadUrl: "/static/image/loading.gif",
      completeUrl: "/static/image/success.png",
      warningUrl: "/static/image/error.png"
    };
  },
  methods: {},
  computed: {
    ...mapState(["toastshow", "toasttype", "toastContent"])
  },
  watch: {
    // 监视toasttype的改变，每次
    toastshow() {
      /**
       * @msg: 0loading 1完成 2警告
       * @param {type}
       * @return:
       */
      if (this.toasttype == 0) {
        this.toastcom.img = this.loadUrl;
      } else if (this.toasttype == 1) {
        this.toastcom.img = this.completeUrl;
      } else if (this.toasttype == 2) {
        this.toastcom.img = this.warningUrl;
      }
      this.toastcom.content = this.toastContent;
    }
  }
};
</script>

<style>
/* 外围 mark*/

.toastbox {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
}

.all {
  background-color: white;
}

/* box */

.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 50rpx;
}

/* 图片 */

.toastimg {
  width: 160rpx;
  height: 160rpx;
  padding: 60rpx 80rpx 0px 80rpx;
}

/* 文字 */

.toastext {
  display: block;
  width: 160rpx;
  white-space: nowrap;
  font-size: 30rpx;
  height: 40rpx;
  line-height: 40rpx;
  padding: 10rpx 80rpx 30rpx 80rpx;
  text-align: center;
}

/* 关闭按钮 */

.toastclose {
  width: 30rpx;
  height: 30rpx;
  position: absolute;
  top: 10%;
  right: 10%;
}
</style>
