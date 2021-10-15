<template>
	<view class="wrap">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="msg-box">
			<view class="msg-item" v-for="(item, index) in noticList" :key="index">
				<view class="item-top">
					<view class="top-left u-line-1">{{ item.title }}</view>
					<view class="top-time">{{ getTime(item.createTime) }}</view>
				</view>
				<view class="item-bot">{{ item.content }}</view>
			</view>
			<view class="bot-txt">已经到底啦~</view>
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
		this.init();
	},
	onReachBottom() {
		this.noticParameter.current++;
		let currentIndex = this.total / this.noticParameter.size;
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
						title: "暂无消息通知！",
						duration: "1500",
					});
					return;
				}
				this.total = res.data.total;
				this.noticList = this.noticList.concat(res.data.records);
			};
			AjaxApi("GetNotice", params, successFuc);
		},
		getTime(val) {
			return val.slice(0, 16);
			//        return val.split(" ")[0]
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
		padding-bottom: 50rpx;
		box-sizing: border-box;
		.msg-item {
			padding: 32rpx 40rpx 0rpx 40rpx;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			background: #fff;
			margin-bottom: 20rpx;
			.item-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				.top-left {
					height: 44rpx;
					min-width: 0;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 44rpx;
					color: #333333;
					opacity: 1;
				}
				.top-time {
					white-space:nowrap;
					height: 34rpx;
					font-size: 24rpx;
					font-weight: 500;
					line-height: 28rpx;
					color: rgba(153, 153, 153, 1);
					opacity: 1;
				}
			}
			.item-bot {
				padding-bottom: 24rpx;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 42rpx;
				color: rgba(102, 102, 102, 1);
				opacity: 1;
			}
		}
		.bot-txt{
			width: 100%;
			line-height: 30rpx;
			font-size: 20rpx;
			color: #666;
			text-align: center;
		}
	}
}
</style>
