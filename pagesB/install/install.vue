<template>
	<view class="wrap">
		<button @tap="signOut">
			<view class="out-text">退出登录</view>
		</button>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
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
		signOut() {
			uni.reLaunch({
				url: "/pagesB/login/login",
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	width: 100%;
	height: 100%;
	background: #f9fafb;
	padding-top: 140rpx;
	button {
		color: #666;
		width: 670rpx;
		height: 100rpx;
		line-height: 100rpx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		border-radius: 4px;
		vertical-align: middle;
		.out-text {
			font-size: 36rpx;
			font-weight: 500;
			color: #666666;
		}
	}
}
</style>
