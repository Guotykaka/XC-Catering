<template>
	<view class="container">
		<view class="btn" @tap="switchTab">开始拼餐</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType, onLogin } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {};
	},
	onShareAppMessage: function (res) {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
	},
	methods: {
		switchTab() {
			uni.switchTab({
				url: `/pages/spellOrder/spellOrder`,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	height: 1300rpx;
	background: url("https://oss.dianddian.cn/v2/pindan/pd_rule.png") #FA7F29 no-repeat ;
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	.btn {
		width: 702rpx;
		height: 112rpx;
		position: absolute;
		bottom: 40rpx;
		left: 50%;
		text-align: center;
		line-height: 112rpx;
		font-size: 36rpx;
		color: #ff0e00;
		transform: translate(-50%, 0);
		background: linear-gradient(180deg, #ffe89d 0%, #ff9d00 100%);
		box-shadow: 0 10rpx 20rpx -10rpx #d38400, 0 -2rpx 6rpx 0 #ffebc8;
		border-radius: 62rpx;
	}
}
</style>
