<template>
	<view class="contain">
		<u-mask :show="payMask" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }"> </u-mask>
		<view class="account-box">
			<view>
				<view class="u-m-40">账户余额：</view>
				<navigator url="../rechargeRecord/rechargeRecord" class="u-m-40">
					<view>充值记录 <text class="icon-arrow-right iconfont"></text> </view>
				</navigator>
			</view>
			<view class="account u-m-l-40">{{ account }} </view>
		</view>
		<view class="active-box">
			<view class="active-item" :class="{ ifchoose: item.active }" @tap="tapView(i)" v-for="(item, i) in records" :key="i">
				<img src="/static/img/duigou.png" class="imgs" v-if="item.active" />
				<view class="iconfont icon-check-mark"> </view>
				<text>{{ item.msg }}</text>
			</view>
		</view>
		<view class="bot-button-box u-p-t-7 u-p-r-10 u-p-b-7 u-flex u-row-between">
			<view class="subtotal">
				<text class="u-font-18">¥{{ payamount }}</text>
			</view>
			<view :class="[{ alive: !activityId }, 'button u-font-18 u-text-center']" @tap="payFuc">去支付</view>
		</view>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	export default {
		data() {
			return {
				account: 0, //账户余额
				payamount: 0, //充值数额
				activityId: null, //
				records: [],
				payMask: false,
			};
		},
		onLoad(options) {
			this.account = options.balance;
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
				let successFuc = res => {
					this.records = res.data.map((it, i) => {
						i == 0 ? (it.active = true) : (it.active = false);
						return it;
					});
					this.payamount = this.records[0].rechargeAmount;
					this.activityId = this.records[0].activityId;
				};
				AjaxApi("RechargeList", {}, successFuc);
			},
			gotoPay() {},
			async payFuc() {
				if (!this.activityId) return;
				const that = this;
				uni.showLoading({
					title: "正在支付",
					mask: true,
				});
				uni.showNavigationBarLoading();
				that.payMask = true;
				let params = {
					amount: this.payamount,
					activityId: this.activityId,
					payType: 1,
				};
				let successFuc = res => {
					uni.hideNavigationBarLoading();
					let respons = res.data.payResp;
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
				};
				AjaxApi("Recharge", params, successFuc);
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
						uni.showToast({
							title: "支付成功！",
							icon: "success",
							mask: true,
							duration: 2000,
							success: function (res) {
								setTimeout(function () {
									that.backTo();
								}, 2000);
							},
						});
					},
					fail(res) {
						uni.showToast({
							title: "支付失败",
							icon: "none",
							mask: true,
							duration: 2000,
							success: function (res) {
								setTimeout(function () {
									that.backTo();
								}, 2000);
							},
						});
					},
				});
			},
			tapView(i) {
				this.records.forEach((element, inx) => {
					i == inx ? (element.active = !element.active) : (element.active = false);
				});
				this.payamount = this.records[i].active ? this.records[i].rechargeAmount : 0;
				this.activityId = this.records[i].active ? this.records[i].activityId : null;
			},
			backTo() {
				uni.navigateBack();
			},
		},
	};
</script>

<style lang="scss" scoped>
	.contain {
		width: 100%;
		min-height: 100vh;
		background: #f6f6f7;
		.account-box {
			position: relative;
			margin: 20rpx 24rpx;
			background: url("https://oss.dianddian.cn/xs/other/chongzhi_bg.jpg");
			background-size: cover;
			background-repeat: no-repeat;
			border-radius: 18rpx;
			height: 250rpx;
			display: flex;
			flex-direction: column;
			> view {
				&:first-child {
					display: flex;
					justify-content: space-between;
					font-size: 32rpx;
					color: #ffffff;
				}
				&:last-child {
					font-size: 80rpx;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					color: #ffffff;
					line-height: 94rpx;
				}
			}
			.account {
				font-size: 48rpx;
				font-weight: bold;
			}
		}
		.active-box {
			padding: 0rpx 24rpx;
			padding-bottom: 200rpx;
			display: flex;
			flex-wrap: wrap;
			.active-item {
				background: #ffffff;
				margin-bottom: 20rpx;
				height: 180rpx;
				text-align: center;
				line-height: 180rpx;
				border: 2rpx solid #ffffff;
				width: calc(50% - 11rpx);
				border-radius: 18rpx;
				position: relative;
				&:nth-child(odd) {
					margin-right: 20rpx;
				}
				.imgs {
					position: absolute;
					top: 0;
					left: 0;
					width: 40rpx;
					height: 40rpx;
				}
				.icon-check-mark {
					display: none;
				}
				text {
					height: 44rpx;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 44rpx;
					color: #333333;
					opacity: 1;
				}
			}
			.ifchoose {
				border: 2rpx solid#FE6B00;
				text {
					color: #fe6b00;
				}
			}
		}
		.bot-button-box {
			width: 100%;
			padding: 16rpx 0;
			background: rgba(255, 255, 255, 1);
			font-size: 36rpx;
			position: fixed;
			bottom: 0;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom, 0);
			padding-bottom: env(safe-area-inset-bottom, 0);
			.subtotal {
				color: #1e1f21;
				margin-left: 62rpx;
			}
			.button {
				width: 220rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: #fe6b00;
				border-radius: 44rpx;
				color: #ffffff;
				&.alive {
					color: #fff;
					background: #999999;
				}
			}
		}
	}
</style>
