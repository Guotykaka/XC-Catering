<template>
	<view class="bill">
		<view class="head">
			<view class="u-flex">共支付</view>
			<view class="u-flex">
				<text>¥</text>
				<text>{{ billData.actualPayment }}</text>
			</view>
			<view class="u-flex"> 已帮您计算好配送费和活动优惠 </view>
		</view>
		<view class="aaborder">
			<image src="../../static/img/AA_border.png" mode="widthFix"></image>
		</view>
		<view v-for="(per, i) in billData.users" :key="i">
			<view :class="[{ last: i == billData.users.length - 1 }, 'person']">
				<view class="name">
					<image :src="per.url" mode="aspectFit" class="u-m-r-40"></image>
					<text>{{ per.name }}</text>
				</view>
				<view class="foods">
					<view>
						<view>名称</view>
						<view>单价</view>
						<view>数量</view>
						<view>金额</view>
					</view>
					<view v-for="(food, inx) in per.orderDetails" :key="inx">
						<view class="u-line-2">{{ food.goodsName }}</view>
						<view class="u-line-1">¥{{ food.discountPrice }}</view>
						<view class="u-line-1">{{ food.quantity }}</view>
						<view class="u-line-1">¥{{ food.subtotal }}</view>
					</view>
				</view>
				<view class="project">
					<text>包装费</text>
					<text>¥{{ orderPackageFee(per) }}</text>
				</view>
				<view class="project">
					<text>配送费(平摊)</text>
					<text>¥{{ per.shoppingFee }}</text>
				</view>
				<view class="project">
					<text>优惠金额</text>
					<text class="red">-¥{{ per.redPackageFee }}</text>
				</view>
				<view class="project">
					<text class="yellow">会员优惠</text>
					<text class="red">-¥{{ per.customerGoodsAmount }}</text>
				</view>
				<view class="prborder"></view>
				<view class="price">
					<view>
						<text class="u-font-28">已优惠</text>
						<text class="red u-font-28">¥{{ per.reduceFee }}</text>
					</view>
					<view>
						<text class="u-font-24" style="font-weight: 400">小计</text>
						<text class="u-font-24 u-m-l-8">¥</text>
						<text class="u-font-36">{{ per.subPrice }}</text>
					</view>
				</view>
			</view>
			<view class="aaborder" v-if="i !== billData.users.length - 1">
				<image src="../../static/img/AA_border.png" mode="widthFix"></image>
			</view>
		</view>
		<button class="btn" open-type="share" plain="true">分享好友</button>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL } from "@/utils/api";
import store from "@/store";
import { appInit } from "@/utils";
import { Decimal } from "decimal.js";
export default {
	data() {
		return {
			orderId: 0,
			billData: {},
		};
	},
	onShareAppMessage: function (res) {
		if (res.from === "button") {
			return {
				title: "账单来啦",
				imageUrl: "https://oss.dianddian.cn/share/pc_bill_share.png",
				path: `/pagesPing/AAbill/AAbill?orderId=${this.orderId}`,
			};
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},
	onLoad(query) {
		uni.showLoading({
			title: " ",
			mask: true,
		});
		this.orderId = query?.orderId ?? 0;
		appInit(this.init)
	},
	methods: {
		async init() {
			let res = await store.dispatch("GetPdBill", { orderId: this.orderId });
			uni.hideLoading();
			if (res.code !== 0) {
				uni.showToast({
					title: `${res.message || "网络错误!！"}`,
					icon: "none",
					mask: true,
					duration: 2000,
					success: () => {
						setTimeout(function () {
							uni.switchTab({
								url: "/pages/index/index",
							});
						}, 2000);
					},
				});
			}
			this.billData = res.data;
		},
		orderPackageFee(it) {
			let val = new Decimal(it.pdPackageFee ?? 0).add(new Decimal(it.packageFee ?? 0));
			return val > 0 ? val : 0;
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7 !important;
}
.bill {
	padding: 20rpx 24rpx 200rpx 24rpx;
	.head {
		background: #ffffff;
		min-height: 242rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		> view {
			flex: 1;
			justify-content: center;
			&:first-of-type {
				padding-top: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
			&:nth-of-type(2) {
				font-weight: bold;
				> text {
					&:first-of-type {
						font-size: 36rpx;
					}
					&:nth-of-type(2) {
						font-size: 60rpx;
					}
				}
				font-size: 32rpx;
				font-weight: bold;
			}
			&:nth-of-type(3) {
				font-size: 28rpx;
				color: #ababaf;
			}
		}
	}
	.aaborder {
		background: #ffffff;
		width: auto;
		image {
			width: 100%;
			vertical-align: middle;
		}
	}
	.person {
		background: #ffffff;
		color: #1c1c1d;
		padding: 40rpx 24rpx;
		&.last {
			border-bottom-left-radius: 16rpx;
			border-bottom-right-radius: 16rpx;
		}
		.name {
			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 10rpx;
				vertical-align: middle;
			}
			text {
				line-height: 68rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.foods {
			background: #f6f6f7;
			border-radius: 10rpx;
			padding: 20rpx;
			margin: 24rpx 0;
			> view {
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				font-weight: bold;
				> view {
					&:not(:last-of-type) {
						flex: 1;
					}
					&:last-of-type {
						width: 100rpx;
					}
				}
				&:first-of-type {
					font-weight: 400;
					color: #636367;
				}
				&:not(:last-of-type) {
					margin-bottom: 20rpx;
				}
			}
		}
		.project {
			display: flex;
			justify-content: space-between;
			font-weight: bold;
			font-size: 28rpx;
			line-height: 20px;
			margin-bottom: 24rpx;
			.red {
				color: #ff3b3b;
			}
			.yellow {
				color: #e58744;
				font-weight: 400;
			}
		}
		.prborder {
			height: 2rpx;
			background: #f1f1f4;
		}
	}
	.price {
		display: flex;
		justify-content: space-between;
		margin-top: 28rpx;
		font-weight: bold;
	}
	.btn {
		border: 0;
		width: 702rpx;
		height: 80rpx;
		background: #fe6b00;
		border-radius: 38rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #ffffff;
		line-height: 80rpx;
		text-align: center;
		position: fixed;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: 40rpx;
		bottom: constant(safe-area-inset-bottom, 40rpx);
		bottom: env(safe-area-inset-bottom, 40rpx);
	}
}
</style>
