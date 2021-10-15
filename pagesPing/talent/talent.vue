<template>
  <!-- 推广达人 -->
  <view class="container">
    <u-navbar
      :is-back="true"
      title="推广达人"
      back-icon-color="#fff"
      titleColor="#fff"
      :background="backgroundImg"
      :border-bottom="false"
    ></u-navbar>

    <scroll-view :scroll-y="true" class="content">
      <view class="head">
        <img
          class="avatar"
          :src="
            userInfo.avatarUrl
              ? userInfo.avatarUrl
              : 'https://oss.dianddian.cn/v2/default_avatar.png'
          "
        />
        <view>
          <view class="name">{{ userInfo.wxNickName }}</view>
          <!-- <view class="iconfont">vip</view> -->
        </view>
      </view>

      <view class="top section">
        <view class="item">
          <view class="label">可提现金额（元）</view>
          <view class="num fs60">{{ accountData.availableAmount }}</view>
        </view>
        <view class="item"></view>
        <view class="item">
          <view class="label">总收益（元）</view>
          <view class="num">{{ accountData.totalIncome }}</view>
        </view>
        <view class="item">
          <view class="label">已提现（元）</view>
          <view class="num">{{ accountData.totalWithdraw }}</view>
        </view>
      </view>

      <view class="section">
        <view class="item">
          <view class="label">今日推广人数</view>
          <view class="num">{{ pageData.todayPersonCount }}</view>
        </view>
        <view class="item">
          <view class="label">今日收益</view>
          <view class="num">￥{{ pageData.todayIncome }}</view>
        </view>
        <view class="item">
          <view class="label">今日成交订单数</view>
          <view class="num">{{ pageData.todayOrderCount }}</view>
        </view>
        <view class="item">
          <view class="label">今日实付金额</view>
          <view class="num">￥{{ pageData.todayActualAmount }}</view>
        </view>
      </view>

      <view class="section">
        <view class="item">
          <view class="label">总推广人数</view>
          <view class="num">{{ pageData.sumPersonCount }}</view>
        </view>
        <view class="item">
          <view class="label">总收益</view>
          <view class="num">￥{{ pageData.sumIncome }}</view>
        </view>
        <view class="item">
          <view class="label">总成交订单数</view>
          <view class="num">{{ pageData.sumOrderCount }}</view>
        </view>
        <view class="item">
          <view class="label">总实付金额</view>
          <view class="num">￥{{ pageData.sumActualAmount }}</view>
        </view>
      </view>
    </scroll-view>

    <view class="invite-btn" @click="createInviteImg"> 邀请好友拼餐 </view>

    <!-- 弹窗 -->
    <view
      :class="[
        'invite-wrap',
        invitePoupStatus ? 'popup-btm-show' : 'popup-btm-hide',
      ]"
    >
      <view class="canvas-wrap">
        <canvas
          class="hidden"
          canvas-id="bg"
          :style="{ width: `${width}px`, height: `${height}px` }"
        ></canvas>

        <tki-qrcode
          class="hidden"
          cid="qrcode"
          ref="qrcode"
          :val="qrcodeText"
          :size="size"
          :unit="unit"
          :icon="icon"
          :iconSize="iconsize"
          :lv="lv"
          :onval="onval"
          :loadMake="loadMake"
          :usingComponents="true"
          @result="qrR"
        />

        <scroll-view class="scroll-box" scroll-y>
          <image class="canvas-img" :src="imgSrc" mode="widthFix" />
        </scroll-view>
      </view>

      <view class="btm">
        <text
          class="close-btn iconfont iconclose"
          @click="invitePoupStatus = false"
        >
        </text>
        <view class="item" @click="askSaveImgAuth">
          <text class="iconfont iconxiazai"></text>
          <text class="label">保存海报</text>
        </view>
        <!-- <view class="item">
          <text class="iconfont icon-wechat"></text>
          <text class="label">分享好友</text>
        </view> -->
      </view>
    </view>

    <!-- 相册授权弹窗 -->
    <u-modal
      v-model="openSettingShow"
      :mask-close-able="true"
      cancel-text="关闭"
      title="您暂未授权，请选择是否授权！"
      :show-confirm-button="false"
      :show-cancel-button="true"
      z-index="100000"
    >
      <view class="slot-content">
        <button type="primary" class="auth-btn" open-type="openSetting">
          去设置相册权限
        </button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import tkiQrcode from "../components/tki-qrcode/tki-qrcode.vue";

import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
export default {
  components: {
    tkiQrcode,
  },
  data() {
    return {
      backgroundImg: {
        background: "#FE6B00",
        opacity: 1,
      },
      statusBarHeight: getApp().globalData.statusBarHeight,
      userInfo: getApp().globalData.UserInfo,
      accountData: {
        availableAmount: 0, //可提现金额
        totalIncome: 0, //总收益
        totalWithdraw: 0, //已提现
      },
      pageData: {
        todayPersonCount: 0, //今日推广人数
        todayIncome: 0, //今日收益
        todayOrderCount: 0, //今日成交订单数
        todayActualAmount: 0, //今日实付金额

        sumPersonCount: 0, //历史推广人数
        sumIncome: 0, //总收益
        sumOrderCount: 0, //历史成交订单数
        sumActualAmount: 0, //历史实付金额
      },
      invitePoupStatus: false,
      imgCreating: false,

      unit: null,
      width: 275,
      height: 366,
      imgBg: "https://oss.dianddian.cn/v2/pindan/pincan_0205.png",

      qrcodeText: "https://ddd.dianddian.cn/yqpd",
      imgSrc: "",

      openSettingShow: false,

      ifShow: true,
      // val: "https://ddd.dianddian.cn/yqpd?userId=649", // 要生成的二维码值
      size: 200, // 二维码大小
      unit: "upx", // 单位
      icon: "", // 二维码图标
      iconsize: 40, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: false, // val值变化时自动重新生成二维码
      loadMake: false, // 组件加载完成后自动生成二维码
      avatarSrc: "", // 二维码生成后的图片地址或base64
    };
  },
  onPageScroll() {},
  onHide() {},
  computed: {},
  async onShow() {
    uni.setNavigationBarTitle({
      title: "推广大使",
    });
    this.init();
  },
  methods: {
    init() {
      uni.showLoading({
        title: "加载中",
        mask: true,
      });

      let proList = [
        store.dispatch("SelectRecommendAccount", {}),
        store.dispatch("SelectRecommendOrderSum", {}),
      ];
      let thenFuc = (res) => {
        uni.hideLoading();

        let resArr = res.map((a) => a.data);
        this.accountData = resArr[0];
        this.pageData = resArr[1];
      };
      PromiseAll(proList, thenFuc);

      uni.getSystemInfo({
        success: (res) => {
          this.unit = res.pixelRatio;
          this.width = this.width * this.unit;
          this.height = this.height * this.unit;
        },
      });

      this.qrcodeText = `${this.qrcodeText}?userId=${this.userInfo.userId}`;

      uni.getImageInfo({
        src: this.userInfo.avatarUrl.replace(
          "https://thirdwx.qlogo.cn",
          "https://wx.qlogo.cn"
        ),
        success: (res) => {
          this.icon = res.path;
        },
      });
    },
    createInviteImg() {
      this.invitePoupStatus = true;
      this.make();
    },
    qrR(res) {
      this.avatarSrc = res;
    },
    async make() {
      uni.showLoading({
        title: "海报生成中",
        mask: true,
      });
      this.imgCreating = true;
      this.imgSrc = "";

      await this.$refs.qrcode._makeCode();
      console.log("二维码", this.avatarSrc);

      this.drawImg(this.avatarSrc);
    },
    drawImg(filePath) {
      let ctx = uni.createCanvasContext("bg", this);
      ctx.clearRect(0, 0, this.width, this.height);

      uni.getImageInfo({
        src: this.imgBg,
        success: (res) => {
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, this.width, this.height);

          ctx.drawImage(res.path, 0, 0, this.width, this.width);

          ctx.setFontSize(14 * this.unit);
          ctx.fillStyle = "#000";
          ctx.fillText(
            "识别二维码开始拼餐",
            6 * this.unit,
            this.width + 40 * this.unit
          );

          ctx.setFontSize(12 * this.unit);
          ctx.fillStyle = "#FE6B00";
          ctx.fillText(
            "单人拼、多人拼、多种选择等着你",
            6 * this.unit,
            this.width + 56 * this.unit
          );

          // 绘制二维码
          ctx.drawImage(
            filePath,
            190 * this.unit,
            284 * this.unit,
            74 * this.unit,
            74 * this.unit
          );

          ctx.draw(false, () => {
            uni.canvasToTempFilePath(
              {
                canvasId: "bg",
                x: 0, //指定的画布区域的左上角横坐标
                y: 0, //指定的画布区域的左上角纵坐标
                width: this.width, //指定的画布区域的宽度
                height: this.height, //指定的画布区域的高度
                destWidth: this.width * 4, //输出的图片的宽度
                destHeight: this.height * 4, //输出的图片的高度
                fileType: "jpg", //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
                quality: 1,

                success: (res) => {
                  console.log("最终img 9046", res.tempFilePath);
                  this.imgSrc = res.tempFilePath;
                  uni.hideLoading();
                  this.imgCreating = false;
                },
                fail: (error) => {
                  uni.showToast({
                    icon: "none",
                    title: error,
                  });
                },
              },
              this
            );
          });
        },
      });
    },
    saveImg() {
      console.log("保存图片");
      uni.saveImageToPhotosAlbum({
        filePath: this.imgSrc,
        success: () => {
          uni.showToast({
            title: "已保存",
          });
        },
      });
    },
    askSaveImgAuth() {
      if (this.imgCreating) return;

      // 相册授权
      uni.getSetting({
        success: (res) => {
          // 进行授权检测，未授权则进行弹层授权
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            uni.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => {
                this.saveImg();
              },
              // 拒绝授权时，则进入手机设置页面，可进行授权设置
              fail: () => {
                this.openSettingShow = true;
              },
            });
          } else {
            // 已授权则直接进行保存图片
            this.saveImg();
          }
        },
        fail: (err) => {
          console.log(err);
        },
      });
    },
    gossssss() {
      uni.navigateTo({
        url: "/pagesPing/becomeTalent/becomeTalent",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f6f6f7;
  .content {
    height: calc(100% - 150px);
  }

  .head {
    height: 336rpx;
    padding: 34rpx;
    display: flex;
    background-image: linear-gradient(
      180deg,
      #fe6b00 0%,
      #fd8630 84%,
      #f6f6f7 100%
    );
    .avatar {
      width: 100rpx;
      height: 100rpx;
      // background-color: #f1f5ff;
      margin-right: 20rpx;
      border-radius: 50%;
      overflow: hidden;
    }
    .name {
      font-size: 40rpx;
      color: #e7ecff;
      font-weight: bold;
      line-height: 56rpx;
      margin-bottom: 4rpx;
    }

    .phone {
      color: #bbcaff;
      font-size: 28rpx;
      line-height: 40rpx;
    }

    .iconfont {
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }

  .section {
    background-color: #f1f1f4;
    margin: 0 24rpx;
    border-radius: 16rpx;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    .item {
      padding: 24rpx;
      background-color: #fff;
    }
    .label {
      font-size: 28rpx;
      color: #ababaf;
      line-height: 40rpx;
      margin-bottom: 4rpx;
    }
    .num {
      font-size: 44rpx;
      font-weight: bold;
      color: #1c1c1d;
      line-height: 52rpx;
    }
  }

  .top {
    margin-top: -170rpx;
    .item {
      border: none;
    }
    .num {
      color: #fe6b00;
    }

    .fs60 {
      font-size: 60rpx;
      line-height: 70rpx;
    }
  }

  .invite-btn {
    background-color: #fe6b00;
    border-radius: 50rpx;
    font-weight: 500;
    color: #ffffff;
    font-size: 32rpx;
    line-height: 44rpx;
    padding: 28rpx 0;
    margin: 0 24rpx;
    text-align: center;
    position: absolute;
    bottom: 30rpx;
    left: 0;
    right: 0;
  }

  .invite-wrap {
    transition: 0.3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.2);
    width: 100vw;
    position: absolute;
    z-index: 9999;

    .canvas-wrap {
      margin: 0 100rpx;
      height: 760rpx;
      position: absolute;
      overflow: hidden;
      bottom: 350rpx;
      left: 0;
      width: 550rpx;
      .scroll-box {
        height: 760rpx;
      }
      .canvas-img {
        width: 100%;
      }
      .avatar {
        position: absolute;
        top: 760rpx;
        left: 256rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .btm {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 340rpx;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      .close-btn {
        position: absolute;
        right: 0;
        top: 0;
        width: 70rpx;
        height: 70rpx;
        text-align: center;
        line-height: 70rpx;
      }

      .item {
        text-align: center;
        .iconfont {
          background-color: #f1f1f4;
          width: 120rpx;
          height: 120rpx;
          border-radius: 120rpx;
          line-height: 120rpx;
          text-align: center;
          font-size: 40rpx;
          margin-bottom: 10rpx;
          display: block;
        }
      }
      .label {
        font-size: 32rpx;
        color: #1c1c1d;
        line-height: 44rpx;
        text-align: center;
      }
    }
  }
}

.auth-btn {
  display: block;
  margin: 40rpx 100rpx;
}

// popup
.popup-btm-show {
  height: 100vh;
  bottom: 0;
  left: 0;
}

.popup-btm-hide {
  height: 0;
  bottom: -2000rpx;
  left: 0;
}

.hidden {
  position: absolute;
  left: 9999rpx;
  z-index: -999;
  opacity: 0;
}

.mask-slot-share {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  color: #333333;
  width: 608rpx;
  height: 716rpx;
  background: #ffffff00;
  // padding: 0 68rpx;
  button {
    border: 0;
    padding: 0;
    image {
      width: 100%;
      display: block;
    }
    &:after {
      content: none;
    }
  }
  > view {
    margin-top: 50rpx;
    text-align: center;
    image {
      width: 60rpx;
    }
  }
  .btm {
    background-color: #fff;
    padding: 30rpx;
  }
  .btn {
    background-image: linear-gradient(180deg, #fd8630 0%, #fe6b00 100%);
    border-radius: 50rpx;
    font-weight: 500;
    color: #ffffff;
    font-size: 32rpx;
    line-height: 44rpx;
    padding: 28rpx 0;
    margin: 0 24rpx;
    text-align: center;
    display: block;
  }
}
</style>
