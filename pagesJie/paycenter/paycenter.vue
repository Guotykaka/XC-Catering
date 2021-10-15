<template>
	<view class="container">
		<view class="pay-info-box">
			<view class="shop-name">{{ orderDetail.storeName }}</view>
			<view class="pay-num">
				<text>￥</text>
				<view>{{ orderDetail.actualPayment }} </view>
			</view>
			<view class="pay-time u-m-t-16"
				>支付剩余时间
				<u-count-down class="count-down-demo" :timestamp="time" font-size="28" color="#FF3B3B" :showDays="false" :show-hours="false" @change="change" @end="backTo" ref="uCountDown" bg-color="rgb(251, 251, 251)"></u-count-down>
			</view>
		</view>
		<view class="pay-type-box">
			<radio-group>
				<view class="pay-item border-style" @tap="radioChange('3')">
					<view class="left"> <text class="u-m-r-11">账户余额</text>￥{{ balance }} </view>
					<!-- <radio value="3" :checked="para.payType == '3'" color="#E5CDA1" :disabled="balance < orderDetail.actualPayment" /> -->
					<image src="https://oss.dianddian.cn/v2/428/radio_check.png" mode="aspectFill" v-if="para.payType == '3'"></image>
					<image src="https://oss.dianddian.cn/v2/428/radio.png" mode="aspectFill" v-else-if="balance >= orderDetail.actualPayment"></image>
					<text v-else>余额不足</text>
				</view>
				<view class="pay-item" @tap="radioChange('1')">
					<view class="left">微信支付</view>
					<!-- <radio value="1" :checked="para.payType == '1'" color="#E5CDA1" /> -->
					<image src="https://oss.dianddian.cn/v2/428/radio_check.png" mode="aspectFill" v-if="para.payType == '1'"></image>
					<image src="https://oss.dianddian.cn/v2/428/radio.png" mode="aspectFill" v-else></image>
				</view>
			</radio-group>
		</view>
		<view class="pay-btn-box u-m-t-40" @tap.stop="payFuc()">支付￥{{ orderDetail.actualPayment }}</view>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
	import checkAuth from "@/utils/soter-auth";
	import store from "@/store";
	export default {
		data() {
			return {
				luckNum: 0,
				shareId: 0,
				couponType: {
					0: "新人券",
					1: "活动券",
					2: "分享券",
				},
				isShowCouponBox: false,
				time: null,
				payType: "余额付款",
				balance: 0,
				orderDetail: {
					orderId: 200181,
					shopId: 350,
					stallName: "牛肉面馆",
					storeName: "赵伟开店",
					shopName: "牛肉面馆",
					orderType: 1,
					recipientName: "",
					status: 0,
					statusName: "待支付",
					pdType: 0,
					payType: null,
					sendTime: "2020-07-08 18:31:36",
					expireTime: "2020-07-08 18:46:36",
					expectTime: "2020-07-08 18:31:35",
					actualPayment: 0,
				},
				para: {
					orderId: "100298",
					payType: "3",
				},
				idemToken: "",
				typePop: null,
			};
		},
		async onLoad(options) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.para = { ...options, payType: "3" };
			let AuthCoupon = await store.dispatch("AuthCoupon", {});
			this.idemToken = AuthCoupon.data;
			let api = {};

			api = store.dispatch("OrderDetail", {
				orderId: this.para.orderId,
			});
			let proList = [api, store.dispatch("GetUserBalance", {}), store.dispatch("GetOrderCount", {})];
			let thenFuc = res => {
				let resArr = res.map(a => a.data);
				this.orderDetail = resArr[0]?.orderInfo ? resArr[0]?.orderInfo : resArr[0];
				let format = this.orderDetail.expireTime.replace(/-/g, "/");
				this.time = parseInt((new Date(format).getTime() - new Date().getTime()) / 1000);
				this.balance = resArr[1]?.availableAmount ?? 0;
				if (this.balance < this.orderDetail.actualPayment) {
					this.para.payType = 1;
					this.payType = "微信付款";
				}
				this.typePop = resArr[2];
				uni.hideLoading();
			};
			PromiseAll(proList, thenFuc);
		},
		methods: {
			change(timestamp) {},
			// 停止倒计时
			radioChange(avl) {
				//支付类型切换
				if (this.balance < this.orderDetail.actualPayment) return;
				this.para.payType = avl;
				if (avl == 1) {
					this.payType = "微信付款";
				} else {
					this.payType = "余额付款";
				}
			},
			async payFuc() {
				const that = this;
				uni.showLoading({
					title: "正在支付",
					mask: true,
				});
				uni.showNavigationBarLoading();
				let successFuc = res => {
					if (this.para.payType == 3 || this.para.payType == 4) {
						uni.vibrateLong();
						that.turnTo();
						return;
					}
					uni.showLoading({
						title: "等待支付",
						mask: true,
					});
					let respons = res.data.payResp;
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
				};
				let elseFuc = () => {
					uni.hideLoading();
					uni.hideNavigationBarLoading();
					uni.showToast({
						title: "支付失败！",
						icon: "none",
						mask: true,
						duration: 2000,
						success: () => {
							setTimeout(function () {
								uni.navigateBack();
							}, 2000);
						},
					});
				};
				AjaxApi("PayOrder", { ...this.para, header: { idem_token: this.idemToken } }, successFuc, elseFuc);
			},
			totalMenu(timeStampa, nonceStra, packageValue, signTypea, paySigna) {
				const that = this;
				uni.requestPayment({
					timeStamp: timeStampa,
					nonceStr: nonceStra,
					package: packageValue,
					signType: signTypea,
					paySign: paySigna,
					success(res) {
						uni.hideLoading();
						uni.vibrateLong();
						uni.hideNavigationBarLoading();
					},
					fail(res) {
						uni.hideLoading();
						uni.hideNavigationBarLoading();
						uni.showToast({
							title: "取消支付！",
							icon: "none",
							mask: true,
							duration: 2000,
							success: () => {
								setTimeout(function () {
									uni.navigateBack();
								}, 2000);
							},
						});
					},
				});
			},
			turnTo() {
				uni.reLaunch({
					url: `/pagesJie/chains/chains`,
				});
			},
			backTo() {
				uni.navigateBack();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		.pay-info-box {
			width: auto;
			margin: 20rpx 24rpx;
			padding: 30rpx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// height: 360rpx;
			background: #ffffff;
			border-radius: 16rpx;
			.shop-name {
				height: 40rpx;
				font-size: 14px;
				font-weight: 400;
				line-height: 40rpx;
				color: #636367;
			}
			.pay-num {
				display: flex;
				align-items: flex-end;
				color: #333333;
				font-weight: bold;
				height: 90rpx;
				margin-left: -10rpx;
				text {
					font-size: 36rpx;
					margin-bottom: 8rpx;
				}
				view {
					font-size: 64rpx;
				}
			}
			.pay-time {
				height: 28rpx;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 30rpx;
				color: #636367;
			}
		}
		.pay-type-box {
			background: #ffffff;
			border-radius: 16rpx;
			margin: 0 24rpx;
			// margin-bottom: 140rpx;
			.pay-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;
				height: 110rpx;
				font-weight: bold;
				.left {
					height: 44rpx;
					font-size: 32rpx;
					color: #333333;
					opacity: 1;
				}
				image {
					width: 40rpx;
					height: 40rpx;
					vertical-align: middle;
					margin-right: 10rpx;
				}
			}
			.border-style {
				border-bottom: 2rpx solid #f1f1f4;
			}
		}
		.pay-btn-box {
			margin: 0rpx 24rpx;
			width: auto;
			box-sizing: border-box;
			height: 96rpx;
			line-height: 96rpx;
			background: #fe6b00;
			border-radius: 16rpx;
			color: #ffffff;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
		}
		.pay-btn-boxs {
			width: auto;
			margin: 0rpx 24rpx;
			display: flex;
			justify-content: space-between;
			> view {
				text-align: center;
				width: 340rpx;
				height: 96rpx;
				font-size: 28rpx;
				font-weight: bold;
				line-height: 96rpx;
				border-radius: 16rpx;
				text-align: center;
				&:first-of-type {
					background: #fff6f1;
					color: #fe6b00;
					border: 2rpx solid #fe6b00;
				}
				&:last-of-type {
					color: #ffffff;
					background: #fe6b00;
					position: relative;
					image {
						width: 96rpx;
						height: 42rpx;
						position: absolute;
						top: -16rpx;
						left: 50%;
						transform: translate(-50%, 0);
					}
				}
			}
		}
	}
</style>
