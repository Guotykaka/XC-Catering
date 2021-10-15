<template>
	<view class="container">
		<view class="form">
			<view class="u-m-b-40">{{ orderPara.shopName }}</view>
			<u-field v-model="amount" placeholder="请填写金额" :border-bottom="false" :field-style="{ color: '#333333', 'font-size': '48rpx' }" label-width="0">
			</u-field>
		</view>
		<view class="coupons u-m-t-20">
			<view class="coupon u-flex u-row-between eborder">
				<view class="coupon-title u-font-32">平台券</view>
				<view class="coupon-right u-flex u-row-left" @tap="chooseCoupon(0)">
					<text class="info-1" v-if="orderPara.redPackageFee[0]" style="color: #ff4d4f"><text class="u-font-10">-￥</text></text>
					<text class="info-2" v-if="orderPara.redPackageFee[0]" style="color: #ff4d4f">{{ orderPara.redPackageFee[0] }}</text>
					<text class="info" v-if="!orderPara.redPackageFee[0]">使用优惠券</text>
					<text class="iconfont icon-arrow-right icon-right u-m-l-14"></text>
				</view>
			</view>
			<view class="coupon u-flex u-row-between">
				<view class="coupon-title u-font-32">商家券</view>
				<view class="coupon-right u-flex u-row-left" @tap="chooseCoupon(1)">
					<text class="info-1" v-if="orderPara.redPackageFee[1]" style="color: #ff4d4f"><text class="u-font-10">-￥</text></text>
					<text class="info-2" v-if="orderPara.redPackageFee[1]" style="color: #ff4d4f">{{ orderPara.redPackageFee[1] }}</text>
					<text class="info" v-if="!orderPara.redPackageFee[1]">使用优惠券</text>
					<text class="iconfont icon-arrow-right icon-right u-m-l-14"></text>
				</view>
			</view>
		</view>
		<view :class="[{ isBuy: !(amount * 1) }, 'btn']" @tap="order">
			去支付
			<text class="u-m-l-10" v-if="amount * 1">￥{{ countCost() }}</text>
		</view>
	</view>
</template>
<script>
import { AjaxApi, PromiseAll } from "@/utils/api";
import { getObjType } from "@/utils";
import { Decimal } from "decimal.js";
export default {
	data() {
		return {
			share: 0, // 1 同享, 2不同享 , 0 都可以用
			candianCouponCount: 0,
			shopCouponCount: 0,
			amount: "0",
			orderPara: {
				shopId: 0,
				storeId: 0,
				shopName: "",
				redPacketIds: [0, 0],
				redPackageFee: [0, 0],
			},
		};
	},
	onLoad(options) {
		this.orderPara = { ...this.orderPara, ...options };
	},
	onShow() {
		this.$forceUpdate();
	},
	methods: {
		init() {
			let countPra = {
				isExpire: 1, //是否过期,0:是,1:否
				isUsed: 0, //是否使用,0:待使用,1:已使用
				isTake: 0, //是否领取,0:是,1:否
				saleType: 0, //0:堂食券,1:外卖券
				userId: getApp().globalData.UserInfo.userId,
				source: 1, //0平台1商家
				usedAmount: this.amount > 0 ? this.amount * 1 : 0,
				shopId: this.orderPara?.shopId,
				storeId: this.orderPara?.storeId,
			};
			let proList = [
				store.dispatch("GetRedPCount", countPra), //商家券数量
				store.dispatch("GetRedPCount_01", { ...countPra, source: 0 }), //平台券数量
			];
			let thenFuc = res => {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				let resArr = res.map(a => a.data);
				this.shopCouponCount = resArr[0].COUNT ?? 0;
				this.candianCouponCount = resArr[1].COUNT ?? 0;
			};
			PromiseAll(proList, thenFuc);
		},
		chooseCoupon(val) {
			let SOUCE = val !== 0 ? 1 : 0;
			uni.showLoading({
				title: "载入中",
				mask: true,
			});
			uni.navigateTo({
				url: `/pagesB/chooseCoupon/chooseCoupon?source=${SOUCE}&usedAmount=${this.amount}`,
			});
		},
		getCoupons() {
			let params = {
				isExpire: 1, //是否过期,0:是,1:否
				isUsed: 0, //是否使用,0:待使用,1:已使用
				isTake: 0, //是否领取,0:是,1:否
				saleType: 0, //0:堂食券,1:外卖券
				userId: getApp().globalData.UserInfo.userId,
				usedAmount: this.amount * 1,
				shopId: this.orderPara?.shopId,
				storeId: this.orderPara?.storeId,
			};
			// uni.showLoading({
			// 	title: "获取最优优惠券",
			// 	mask: true,
			// });
			let successFuc = res => {
				if (res.data?.length) {
					res.data.sort((a, b) => {
						return a.source - b.source;
					});
				}
				this.orderPara.redPacketIds = [];
				this.orderPara.redPackageFee = [0, 0];
				if (res.data?.length == 1) {
					this.orderPara.redPacketIds = res.data.map(it => it.recordId);
					this.orderPara.redPackageFee[res.data[0]?.source == 0 ? 0 : 1] = res.data[0]?.amount;
				} else if (res.data?.length > 1) {
					this.orderPara.redPacketIds = res.data.map(it => it.recordId);
					this.orderPara.redPackageFee = res.data.map(it => it.amount);
				}
			};
			AjaxApi("GetSelectedRedPacket", params, successFuc);
		},
		order() {
			if (!(this.amount * 1)) return;
			let params = {
				productAmount: this.amount * 1,
				redPacketIds: this.orderPara.redPacketIds.filter(n => n),
				shopId: this.orderPara.shopId,
				storeId: this.orderPara.storeId,
			};
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "下单中",
				mask: true,
			});
			let successFuc = res => {
				if (res.data.actualPayment == 0) {
					uni.redirectTo({
						url: `/pagesA/orderDetail/orderDetail?orderId=${res.data.orderId}`,
					});
				} else {
					uni.redirectTo({
						url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${res.data.orderId}&payType=3&pdType=0`,
					});
				}
			};
			let elseFuc = () => {
				uni.hideNavigationBarLoading();
			};
			AjaxApi("JustPay", params, successFuc, elseFuc);
		},
		countCost() {
			if (!(this.amount * 1)) return "";
			let total = new Decimal(this.amount * 1 ?? 0).sub(
				new Decimal(
					this.orderPara?.redPackageFee.reduce((acc, cur) => {
						return new Decimal(acc).add(new Decimal(cur));
					}) ?? 0
				)
			);
			return Math.sign(total) == -1 ? 0 : total;
		},
	},
	watch: {
		amount(nVal, oVal) {
			if (nVal != oVal) {
				var reg = /^\d+(?=\.{0,1}\d+$|$)/;
				if (reg.test(nVal * 1)) {
					this.amount = nVal * 1;
				} else {
					this.amount = 0;
				}
				this.getCoupons();
			}
		},
	},
	computed: {
		REDP() {
			let dis = this.shopCouponCount;
			if (getObjType(this.shopCouponCount) === "number") {
				return `${dis}张可用`;
			} else if (getObjType(this.shopCouponCount) === "null") {
				return "暂无优惠劵";
			}
		},
		MCREDP() {
			let dis = this.candianCouponCount;
			if (getObjType(this.candianCouponCount) === "number") {
				return `${dis}张可用`;
			} else if (getObjType(this.candianCouponCount) === "null") {
				return "暂无优惠劵";
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	background: #f9fafb;
	.form {
		background: white;
		padding: 62rpx 48rpx 20rpx 48rpx;
		/deep/u-field {
			.u-field {
				input {
					height: 110rpx;
				}
				padding: 0;
				background: #ffffff;
				background-clip: content-box;
			}
		}
	}
	.coupons {
		background: white;
		padding: 0 28rpx 0 48rpx;
	}
	.eborder {
		&::after {
			content: "";
			background: #e2e2e2;
			height: 2rpx;
			width: 94%;
			position: absolute;
			left: 20rpx;
			bottom: 0;
			margin: auto;
		}
	}
	.coupon {
		position: relative;
		height: 110rpx;
		line-height: 110rpx;
		.coupon-title {
			color: #333333;
		}
		.coupon-right {
			height: 40rpx;
			line-height: 40rpx;
			color: rgba(153, 153, 153, 1);
		}
		.info-1 {
			height: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 20px;
			color: #333333;
		}
		.info-2 {
			height: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 20px;
			color: #333333;
			position: relative;
			&.u-font-24 {
				&::before {
					border-bottom: 2rpx solid #999999;
					position: absolute;
					content: "";
					width: 110%;
					height: 50%;
				}
			}
		}
		.info {
			font-weight: 400;
			display: flex;
			align-items: center;
		}
		.icon-right {
			font-size: 24rpx;
			margin-top: 4rpx;
		}
	}
	.btn {
		width: 670rpx;
		height: 100rpx;
		border-radius: 8rpx;
		position: fixed;
		bottom: 48rpx;
		bottom: calc(48rpx + constant(safe-area-inset-bottom, 0));
		bottom: calc(48rpx + env(safe-area-inset-bottom, 0));
		left: 50%;
		transform: translate(-50%, 0);
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		line-height: 100rpx;
		background: #fe6b00;
		color: #ffffff;
		&.isBuy {
			background: #999999;
		}
	}
}
</style>
