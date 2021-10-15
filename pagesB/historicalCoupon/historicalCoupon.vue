<template>
	<view class="container">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="coupon-box" v-for="(it, i) in couponList" :key="i">
			<view class="coupon">
				<view class="coupon-info">
					<view class="coupon-name u-flex-nowrap u-line-1" style="width: 60vw">{{ it.redPacketName }} </view>
					<view class="remark">
						<text class="span-style u-m-r-8 span-style-b">{{ couponType[it.type] }}</text>
						<text class="span-style u-m-r-8 span-style-b">{{
							it.saleType == 0 ? "堂食" : it.saleType == 1 ? "外卖" : it.saleType == 2 ? "通用" : "拼餐"
						}}</text>
						<text class="expiration-date">{{ `${it.validEndTime}到期` }}</text>
					</view>
				</view>
				<view class="amount">
					<text style="font-size: 28rpx">￥</text>
					<text style="font-size: 48rpx">{{ it.amount }}</text>
				</view>
				<view class="iconfont icon-coupon-expired" v-if="it.isUsed == 0"></view>
				<view class="iconfont icon-coupon-used" v-if="it.isUsed == 1"></view>
			</view>
			<view class="coupon-remark">
				<view class="remark-title" :class="{ click: it.click == true }">
					<view>
						<view>{{ it.isShare == 0 ? "同享券（与折扣优惠同享）" : "不同享券（与折扣优惠不同享）" }}</view>
						<view v-if="it.note.length > 0">
							<text v-if="it.click" class="iconfont u-m-l-30 icon-arrow-up"></text>
							<text v-else class="iconfont u-m-l-30 icon-arrow-down"></text>
						</view>
					</view>
				</view>
				<view v-if="it.note.length > 0 && it.click == true" style="word-break: break-all; line-height: 28rpx">
					{{ it.note }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
export default {
	data() {
		return {
			couponParameter: {
				pageIndex: 1,
				pageSize: 10,
				isExpire: 0,
				isUsed: 1,
			},
			couponList: [],
			couponType: {
				0: "新人券",
				1: "活动券",
				2: "分享券",
			},
		};
	},
	onShow() {
		this.couponParameter.pageIndex = 1;
		this.init();
	},
	onReachBottom(e) {
		if (this.pageDown) {
			this.couponParameter.pageIndex++;
			this.init();
		} else {
			this.$refs.uTips.show({
				title: "无更多历史优惠券",
				duration: "1500",
			});
		}
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
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			//订单列表
			let params = this.couponParameter;
			let successFuc = res => {
				if (!res?.data.records.length) {
					this.$refs.uTips.show({
						title: "暂无历史优惠券",
						duration: "1500",
					});
					return;
				}
				this.couponList = this.couponList.concat(res.data.records);
				let { pages, current } = res.data;
				this.couponParameter.pageIndex = current;
				this.pageDown = Boolean(pages > current);
			};
			AjaxApi("SelectUserHistoryRedPacketRecord", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding-top: 20rpx;
	.coupon-box {
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 20rpx;
		margin-bottom: 20rpx;
		.coupon {
			position: relative;
			width: 100%;
			padding: 38rpx 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
			opacity: 1;
			border-radius: 8rpx;
			.icon-coupon-used {
				font-size: 70rpx;
				width: 90rpx;
				height: 90rpx;
				position: absolute;
				bottom: -35%;
				right: 70rpx;
			}
			.icon-coupon-expired {
				font-size: 70rpx;
				width: 90rpx;
				height: 90rpx;
				position: absolute;
				bottom: -35%;
				right: 70rpx;
			}
			.icon-check-mark {
				display: none;
			}
			.image-style {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 0;
				right: 0;
			}
			// .coupon-info {
			// }
			.amount {
				margin-right: 14rpx;
				color: #999999;
				height: 66rpx;
				vertical-align: bottom;
			}
			.coupon-name {
				height: 44rpx;
				font-size: 32rpx;
				font-weight: 400;
				line-height: 44rpx;
				color: #999999;
				opacity: 1;
				margin-bottom: 12rpx;
			}
			.remark {
				font-size: 10px;
				font-weight: 400;
			}
			.span-style {
				height: 28rpx;
				font-size: 20rpx;
				text-align: center;
				line-height: 28rpx;
				box-sizing: border-box;
				border-radius: 4rpx;
				padding: 0rpx 12rpx;
			}
			.span-style-b {
				border: 2rpx solid rgba(153, 153, 153, 1);
				color: #999999;
			}
			.expiration-date {
				color: rgba(153, 153, 153, 1);
			}
		}
		.coupon-remark {
			background: #fff;
			padding: 16rpx 32rpx;
			box-shadow: 0px 5px 30px rgba(153, 153, 153, 1);
			border-radius: 8rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 44rpx;
			color: rgba(153, 153, 153, 1);
			text {
				font-size: 10rpx;
				// margin-bottom: 10rpx;
			}
			.click {
				height: auto !important;
			}
			.remark-title {
				height: 44rpx;
				line-height: 44rpx;
				display: flex;
				overflow: hidden;
				justify-content: space-between;
				text {
					vertical-align: middle;
					display: inline-block;
					height: 100%;
					width: 50rpx;
				}
				> view {
					width: 100%;
					display: flex;
					&:nth-child(2) {
						margin-left: 30rpx;
						width: 104rpx;
						height: 40rpx;
						background: #ff4d4f;
						color: #ffffff;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
}
</style>
