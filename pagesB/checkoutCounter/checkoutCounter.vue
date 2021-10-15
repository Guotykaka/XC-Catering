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
		<view class="pay-type-box" v-if="para.payType !== '4'">
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
		<view v-if="rechargeFree.amount" class="pay-btn-boxs">
			<view @tap.stop="getSetting(true)">
				<text>支付￥{{ orderDetail.actualPayment }}，</text>
				<text style="color: #ff3b3b"> 放弃免单 </text>
			</view>
			<view @tap.stop="getSetting(false)">
				<image src="https://oss.dianddian.cn/v2/428/payment.png" mode="aspectFit"></image>
				{{ rechargeFree.name || "" }}
			</view>
		</view>
		<view class="pay-btn-box u-m-t-40" @tap.stop="getSetting(true)" v-else>{{ para.payType == 4 ? "确认支付" : payType }} ￥{{ orderDetail.actualPayment }}</view>
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
				paid: false,
				recharged: false, //是否充值
				isShowCouponBox: false,
				time: null,
				payType: "余额付款",
				rechargeFree: {}, //充值免单
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
			this.para = options;
			let AuthCoupon = await store.dispatch("AuthCoupon", {});
			this.idemToken = AuthCoupon.data;
			let api = {};
			if (options.pdType * 1 !== 0) {
				api = store.dispatch("GroupOrderDetail", {
					orderId: this.para.orderId,
				});
			} else {
				api = store.dispatch("OrderDetail", {
					orderId: this.para.orderId,
				});
			}
			let proList = [
				api,
				store.dispatch("GetUserBalance", {}),
				store.dispatch("GetOrderCount", {}),
				store.dispatch("RechargeGet", {
					orderId: this.para.orderId,
				}),
			];
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
				this.rechargeFree = resArr[3] || {};
				uni.hideLoading();
			};
			PromiseAll(proList, thenFuc);
		},
		onShareAppMessage: function (res) {
			if (res.from === "button") {
				const orderId = this.para.orderId;
				const shareId = this.shareId;
				const luckNum = this.luckNum;
				// 来自页面内转发按钮
				return {
					title: `第${luckNum}个领取的红包最大！`,
					imageUrl: "https://oss.dianddian.cn/activity/order_share/share_random.jpg",
					path: `/pagesC/sharingOrder/sharingOrder?shareId=${shareId}`,
				};
			} else {
				return {
					title: "进入餐典到了",
					imageUrl: SHARE_URL,
					path: `/pages/index/index`,
				};
			}
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
			authPay() {
				// this.payMask = true;
				if (this.para.payType == 3 || this.para.payType == 4) {
					uni.showNavigationBarLoading();
					let sfuc = res => this.payFuc();
					let elseFuc = () => {
						// this.payMask = false;
						uni.hideNavigationBarLoading();
					};
					checkAuth(sfuc, elseFuc);
					return;
				}
				this.payFuc();
			},
			getSetting(type) {
				if (this.paid) return;
				uni.showLoading({
					title: "",
					mask: true,
				});
				const that = this;
				//<!-- 0:外卖,1:堂食,2:到店自取 -->
				let tmplIds = [];
				switch (this.orderDetail.orderType) {
					case 0:
						tmplIds = [
							"lbtexH3tspTLscU0tCAct8-syIY-m1HG2n272dDLnbQ", //下单成功通知
							"ERzDc1e7-ObVHmeEJGv5prtwZdqKU50kwDIIKqSZTQA", //订单配送通知
							"gUFDySWUiJzKNaB9W-AY8sezG-iAbnfIidl6iSr85vM", //商品送达通知
						];
						break;
					default:
						tmplIds = [
							"lbtexH3tspTLscU0tCAct8-syIY-m1HG2n272dDLnbQ", //下单成功通知
							"dH09F_-KdFbQvlHqm-BzZZwYWo6YTVox4BQ1X2ar4Vs", //取餐提醒
							"l0FBMn9nknehllJqjQsMLa39onWxGJm6xVdLY6QlZ5E", //取餐完成通知
						];
						break;
				}
				uni.requestSubscribeMessage({
					tmplIds: tmplIds,
					success(res) {
						uni.hideLoading();
						type ? that.payFuc() : that.recharge();
					},
					fail(res) {
						uni.hideLoading();
						type ? that.payFuc() : that.recharge();
					},
				});
			},
			subscribeMessage() {
				const that = this;
				switch (this.typePop) {
					case 0:
						// 优惠券到账通知 2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU
						// 优惠券过期提醒 VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w
						// 卡券到账通知 e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4
						// 会员到期提醒 uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM
						uni.requestSubscribeMessage({
							tmplIds: ["2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU", "VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w"],
							complete() {
								that.turnTo();
							},
						});
						break;
					case 1:
					case 2:
						uni.requestSubscribeMessage({
							tmplIds: ["e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4"],
							complete() {
								that.turnTo();
							},
						});
						break;
					default:
						that.turnTo();
						break;
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
					this.paid = true;
					if (this.para.payType == 3 || this.para.payType == 4) {
						uni.vibrateLong();
						that.turnTo();
						return;
					}
					let respons = res.data.payResp;
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
				};
				let elseFuc = () => {
					this.paid = true;
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
			async recharge() {
				// if (!this.activityId) return;
				const that = this;
				uni.showLoading({
					title: "正在支付",
					mask: true,
				});
				uni.showNavigationBarLoading();
				// that.payMask = true;
				let params = {
					amount: this.rechargeFree.amount,
					orderId: this.orderDetail.orderId,
					payType: 1,
				};
				let successFuc = res => {
					this.paid = true;
					this.recharged = true;
					uni.hideNavigationBarLoading();
					let respons = res.data.payResp;
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
				};
				let elseFuc = () => {
					this.paid = true;
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
				AjaxApi("Recharge", params, successFuc, elseFuc);
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
						that.subscribeMessage();
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
				uni.redirectTo({
					url: `/pagesD/payment/payment?orderId=${this.orderDetail.orderId}&recharged=${this.recharged ? 1 : 0}`,
				});
			},
			async backTo() {
				let url = "";
				switch (this.orderDetail.pdType) {
					case 0:
						url = `/pagesA/orderDetail/orderDetail?orderId=${this.orderDetail.orderId}`;
						break;
					case 1:
						url = `/pagesPing/orderStatusDetails/orderStatusDetails?orderId=${this.orderDetail.orderId}`;
						break;
					case 2:
						if (this.orderDetail.status == 1) {
							url = `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${this.orderDetail.orderId}`;
							break;
						}
						let spell = await store.dispatch("SelPdRecord", { pdId: this.orderDetail.pdId });
						url = spell?.data?.status == 0 ? `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${this.orderDetail.pdId}&type=0` : `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${this.orderDetail.orderId}`;
						break;
					default:
						break;
				}
				uni.redirectTo({
					url: `${url}&checkCoupon=1`,
				});
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
