<template>
	<view class="wrap">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="msg-box">
			<view class="msg-item" v-for="(item, index) in noticList" :key="index">
				<view class="top-left">{{ item.memo }}</view>
				<view class="top-time">{{ item.time }}&nbsp;•&nbsp;{{ item.payType }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			noticList: [],
			noticParameter: {
				current: 1,
				size: 10,
			},
			total: 0,
		};
	},
	onShow() {
		this.noticList = [];
		this.noticParameter = {
			current: 1,
			size: 10,
		};
		this.total = 0;
		this.init();
	},
	onReachBottom() {
		this.noticParameter.current++;
		let currentIndex = this.total / this.noticParameter.current;
		if (this.noticParameter.current > currentIndex) return;
		this.init();
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		init() {
			let params = this.noticParameter;
			let successFuc = res => {
				if (!res?.data.records.length) {
					this.$refs.uTips.show({
						title: "暂无充值记录！",
						duration: "1500",
					});
					return;
				}
				this.total = res.data.total;
				this.noticList = this.noticList.concat(res.data.records);
			};
			AjaxApi("GetRechargeRecord", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	background: #f9fafb;
	width: 100%;
	height: 100%;
	.msg-box {
		width: 100%;
		height: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		.msg-item {
			padding: 32rpx 40rpx 32rpx 40rpx;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			background: #fff;
			display: flex;
			flex-direction: column;
			margin-bottom: 20rpx;
			.top-left {
				height: 44rpx;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 44rpx;
				color: #333333;
				margin-bottom: 12rpx;
				opacity: 1;
			}
			.top-time {
				height: 34rpx;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 28rpx;
				color: rgba(153, 153, 153, 1);
				opacity: 1;
			}
		}
	}
}
</style>
