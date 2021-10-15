<template>
  <view class="container">
    <!-- 成为推广达人 -->
    <img
      class="bg-img"
      mode="widthFix"
      src="https://oss.dianddian.cn/v2/pindan/dashi_1.png"
    />
      <!-- src="https://oss.dianddian.cn/20201207/fe614515fa374e8da2f3ec2c328f20ea.png" -->
    <img
      class="bg-img"
      mode="widthFix"
      src="https://oss.dianddian.cn/v2/pindan/dashi_3.png"
    />
      <!-- src="https://oss.dianddian.cn/20201207/3f4202eba7474b11a51235e951843cbd.png" -->
    <img
      class="bg-img"
      mode="widthFix"
      src="https://oss.dianddian.cn/v2/pindan/dashi_2.png"
    />
      <!-- src="https://oss.dianddian.cn/20201207/beee364b9bf744ee98e43d59bacbb33e.png" -->
    <view class="btm">
      <!-- <view class="apply-btn" @click="goTalentForm">申请成为推广达人</view> -->

      <button
        class="apply-btn"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        申请成为推广达人
      </button>
    </view>
  </view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";

export default {
  components: {},
  data() {
    return {
      agentId: "",
    };
  },
  onHide() {},
  computed: {},
  onLoad(option) {
    console.log("推广达人邀请页链接参数", option);
    if (option?.q) {
      let link = decodeURIComponent(option?.q);
      this.agentId = link.split("=")[1];
    }
    this.agentId = this.agentId;
    console.log("推广达人邀请页---大使id", this.agentId);
  },
  onShow() {},
  methods: {
    getPhoneNumber(e) {
      // 手机号码授权
      if (e.detail.encryptedData && e.detail.iv) {
        uni.showLoading({
          title: "加载中",
          mask: true,
        });
        let params = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        };
        let successFuc = async (res) => {
          let ress = await store.dispatch("QueryUserInfo", {});
          getApp().globalData.UserInfo = ress?.data ?? { phone: null };
          uni.navigateTo({
            url: `/pagesPing/talentForm/talentForm?agentId=${this.agentId}`,
          });
        };
        AjaxApi("GetUserPhone", params, successFuc);
      } else {
        uni.showModal({
          title: "温馨提示",
          content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入",
          showCancel: false,
          confirmText: "确定",
        });
      }
    },
    // goTalentForm() {
    //   uni.navigateTo({
    //     url: `/pagesPing/talentForm/talentForm?agentId=${this.agentId}`,
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .bg-img {
    display: block;
    width: 100%;
  }
  .btm {
    background-image: linear-gradient(45deg, #14a2ec 0%, #2770fa 100%);

    padding: 50rpx 40rpx;
    margin-top: -1rpx;
  }
  .apply-btn {
    line-height: 100rpx;
    background-image: linear-gradient(180deg, #ffe100 0%, #ffa300 100%);
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
  }
}
</style>
