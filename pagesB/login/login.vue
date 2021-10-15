<template>
	<view class="container">
		<!-- <view class="login-title u-text-center">您好，请登录</view> -->
		<view class="image-box">
			<image class="login-image" src="https://oss.dianddian.cn/logo.png"></image>
		</view>
		<button class="login-wx-btn u-fonnt-25 u-text-center" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
			<view class="u-flex u-row-center">
				<text class="iconfont icon-wechat"></text>
				<view class="u-font-18 u-m-l-8">微信一键登录</view>
			</view>
		</button>
		<view class="open-new-shop u-text-center" @tap="jumpPage"> 手机号登录/注册 </view>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL } from "@/utils/api";
import { onLogin} from "@/utils";
import store from "@/store";
export default {
	data() {
		return {};
	},
	onShow() {
		// uni.hideHomeButton();
	},
	onReady: function () {
		onLogin();
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		getPhoneNumber(e) {
			// 手机号码授权
			if (e.detail.encryptedData && e.detail.iv) {
				uni.showLoading({
					title: "正在登录",
					mask: true,
				});
				let params = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
				};
				let successFuc = async res => {
					let ress = await store.dispatch("QueryUserInfo", {});
					getApp().globalData.UserInfo = ress?.data ?? { phone: null };
					uni.switchTab({
						url: "/pages/index/index",
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
		jumpPage: function () {
			uni.navigateTo({
				url: "/pagesB/auth/auth",
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
	padding: 22rpx 40rpx 0rpx 40rpx;
	.login-title {
		width: 100%;
		height: 72rpx;
		font-size: 50rpx;
		line-height: 50rpx;
		color:#E5CDA1;
		font-weight: bold;
		opacity: 1;
	}
	.image-box {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.login-image {
		width: 460rpx;
		height: 240rpx;
		margin: 100rpx auto 112rpx;
	}
	.login-wx-btn {
		height: 100rpx;
		background: #E5CDA1;
		opacity: 1;
		border-radius: 8rpx;
		width: 100%;
		line-height: 100rpx;
		color: #343434;
		font-size: 32rpx;
		border: 0;
		font-weight: bold;
	}
	.open-new-shop {
		height: 100rpx;
		opacity: 1;
		border-radius: 8rpx;
		width: 100%;
		line-height: 100rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333333;
	}
}
</style>
