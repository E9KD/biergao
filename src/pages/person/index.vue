<template>
  <div class="user">
    <div class="userinfobox">
      <div class="userinfoimg">
        <img :src="GetUserInfo.avatarUrl" class="userimg">
      </div>
      <div class="userinfoname">
        <p class="username">{{GetUserInfo.nickName}}</p>
      </div>
      <button
        v-if="isPhone"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        class="changephonenumber"
      >绑定手机号</button>
      <div class="userinfoa" @click="GoUserInfo">个人资料</div>
    </div>
    <div class="fucbox">
      <div class="box_com">
        <div class="funame">
          <div class="funame_box" @click="GoChildrenPage(0)">
            <img class="funame_img" src="../../../static/image/group.png" alt>
            <p class="funame_p">成长报告</p>
          </div>
        </div>
        <div class="funame">
          <div class="funame_box" @click="GoChildrenPage(1)">
            <img class="funame_img" src="../../../static/image/addman.png" alt>
            <p class="funame_p">添加孩子</p>
          </div>
        </div>
      </div>
      <div class="box_com">
        <div class="funame">
          <div class="funame_box" @click="GoChildrenPage(2)">
            <img class="funame_img" src="../../../static/image/order.png" alt>
            <p class="funame_p">订单</p>
          </div>
        </div>
        <div class="funame">
          <div class="funame_box" @click="GoChildrenPage(3)">
            <img class="funame_img" src="../../../static/image/vip.png" alt>
            <p class="funame_p">VIP</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="userfuncbox">
              <div class="userfunc" @click="GoChildrenPage(0)">成长报告</div>
              <div class="userfunc" @click="GoChildrenPage(1)">添加孩子</div>
              <div class="userfunc" @click="GoChildrenPage(2)">我的订单</div>
              <div class="userfunc" @click="GoChildrenPage(3)">成为VIP</div>
    </div>-->
  </div>
</template>

<script>
import ajax from "@/utils/ajax.js";
import { changePhoneUrl } from "@/utils/api.js";
export default {
  data() {
    return {
      canIUse: wx.canIUse("button.open-type.getUserInfo"),
      openid: "",
      isPhone: false
    };
  },
  methods: {
    // 默认执行
    init() {
      this.$store.state.userParam.mobile
        ? (this.isPhone = false)
        : (this.isPhone = true);
    },

    // 获取手机号
    getPhoneNumber(e) {
      ajax
        .Get(changePhoneUrl, {
          iv: e.mp.detail.iv,
          encryptedData: e.mp.detail.encryptedData,
          sessionKey: this.$store.state.userParam.sessionKey,
          userid: this.$store.state.userParam.userid
        })
        .then(result =>
          this.$store.commit("ChangePhoneNumber", result.phoneNumber)
        )
        .catch(err => console.log(err));
    },

    // 前往用户信息页面
    GoUserInfo() {
      wx.navigateTo({
        url: `/pages/userinfo/main`
      });
    },

    //去不同的页面
    GoChildrenPage(x) {
      switch (x) {
        case 0:
          wx.navigateTo({
            url: "/pages/groupreport/main"
          });
          break;
        case 1:
          wx.navigateTo({
            url: "/pages/addchildren/main"
          });
          break;
        case 2:
          wx.navigateTo({
            url: "/pages/order/main"
          });
          break;
        case 3:
          wx.navigateTo({
            url: "/pages/vip/main"
          });
          break;
      }
    }
  },
  computed: {
    // 获取用户信息
    GetUserInfo(e) {
      return this.$store.state.userInfo;
    }
  }
};
</script>

<style scoped>
.userinfoa {
  background-color: #45b7b8;
  position: absolute;
  top: 10%;
  bottom: none;
  right: 0px;
  color: white;
  padding: 10rpx 40rpx;
  font-size: 30rpx;
  border-bottom-left-radius: 30rpx;
  border-top-left-radius: 30rpx;
}

.funame_box {
  width: 100rpx;
  margin: 0 auto;
}

.funame_p {
  display: block;
  font-size: 30rpx;
  white-space: nowrap;
  width: 100rpx;
  text-align: center;
}

.funame_img {
  width: 80rpx;
  height: 80rpx;
  display: block;
  margin: 0 auto;
}

.funame {
  width: 50%;
  display: inline-block;
}

.box_com {
  width: 100%;
  margin: 70rpx 0px;
}

.fucbox {
  box-shadow: 0 0 20rpx #999;
  border-radius: 20rpx;
  background-color: #eee;
  z-index: 999;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.loginbtn {
  width: 30%;
  height: 60rpx;
  margin: 0 auto;
  text-align: center;
  font-size: 30rpx;
  line-height: 60rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.userfunc {
  width: 90%;
  height: 70rpx;
  margin: 0 auto;
  line-height: 70rpx;
  font-size: 30rpx;
  border-bottom: 1px solid #eeeeee;
  padding: 10rpx 0px 10rpx 20rpx;
}

.userfuncbox {
  width: 100%;
  height: 60vh;
  background-color: white;
}

.username {
  font-size: 30rpx;
  color: white;
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
}

.userimg {
  display: block;
  width: 100%;
  height: 100%;
}

.userinfoimg {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150rpx;
  height: 150rpx;
  border-radius: 180rpx;
  overflow: hidden;
}

.userinfoname {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 50rpx;
  line-height: 50rpx;
}

.changephonenumber {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200rpx;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 30rpx;
}

.userinfobox {
  width: 100%;
  height: 45vh;
  background-color: #228c7b;
  position: relative;
}
</style>