<template>
	<view class="container" v-if="idemToken">
		<view v-show="maskTakeCoupon" class="guide">
			<view class="guide-bg-container">
				<view class="plat-bg" @tap="closeMask">
					<u-icon class="u-font-34" name="close" @tap="closeMask"></u-icon>
				</view>
				<view class="plat-con">
					<text style="font-size: 52rpx; font-weight: bold; line-height: 74rpx; color: #ffffff"> 恭喜您成功领取 </text>
					<text style="line-height: 214rpx; font-size: 84rpx; font-weight: 800; color: #fde51b"
						><text style="font-size: 52rpx; display: inline-bolck; height: 20rpx">￥</text> {{ coupon.amount.toFixed(2) }}
					</text>
					<text style="font-size: 52rpx; font-weight: bold; line-height: 78rpx; color: #ffffff"> 红包券 </text>
					<text style="font-size: 28rpx; font-weight: 400; line-height: 44rpx; margin-top: 28rpx; color: #ffffff60"> 已放入您的账户 </text>
					<view class="bttn" @tap="turntohome">去下单</view>
				</view>
			</view>
		</view>
		<view v-if="take">
			<view :class="[{ unactive: isUsed }, 'quan']">
				<view>
					<view
						><text class="u-line-1">{{ coupon.redPacketName }}</text></view
					>
					<view style="min-width: 0">
						<view>{{ couponType[coupon.type] }}</view>
						<view>{{ coupon.saleType == 0 ? "堂食" : coupon.saleType == 1 ? "外卖" : it.saleType == 2 ? "通用" : "拼餐" }}</view>
						<view class="u-line-1" style="border: 0">
							{{ coupon.validType == 0 ? "长期有效" : "领取后" + coupon.days + "天内有效" }} |
							{{ coupon.usedAmount == 0 ? "全平台可用" : "满" + coupon.usedAmount + "元可用" }}
						</view>
					</view>
				</view>
				<view>
					<image v-if="take && !isUsed" src="../../static/img/wancheng.png"></image>
					<image v-if="isUsed" src="../../static/img/isused.png"></image>
					<text style="font-size: 20rpx; display: inline-bolck; height: 20rpx; line-height: 190rpx">￥</text>{{ coupon.amount.toFixed(2) }}
				</view>
			</view></view
		>
		<view v-else-if="activityEnd && !take" class="can-get">您来晚啦，红包已被领取完！</view>
		<button class="btn" v-if="!activityEnd && !take && !phone" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">试试手气</button>
		<view class="btn" v-if="!activityEnd && !take && phone" @tap="shareCoupon()">试试手气</view>
		<view class="btn" v-if="activityEnd && !take" @tap="shareCoupon()">看看其他活动</view>
		<view class="btn" v-if="take && !isUsed" @tap="shareCoupon()">去下单</view>
		<view class="tit"><view></view> 看看朋友手气如何 <view></view></view>
		<view class="mark">
			<view style="text-align: center; line-height: 136rpx" v-if="!userList.length">暂无人领取</view>
			<view v-if="userList.length">
				<block v-for="(it, i) in userList" :key="i">
					<view class="mark-item" v-if="i < userList.length">
						<image :src="it.avatarUrl" mode="aspectFill" :class="[it.luck ? 'luck' : '']"></image>
						<view>
							<view>
								<text>{{ it.nickName }}</text>
								<text>￥{{ it.amount.toFixed(2) }}</text>
							</view>
							<view>
								<text>{{ it.takeTime }}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="tit"><view></view> 活动规则 <view></view></view>
		<view class="note">
			<image src="https://oss.dianddian.cn/activity/order_share/share_rule.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import { AjaxApi } from "@/utils/api";
import { appInit } from "@/utils";
import store from "@/store";
import { setTimeout } from "timers";
export default {
	data() {
		return {
			phone: null,
			counter: 0,
			maskTakeCoupon: false,
			activityEnd: false,
			take: false,
			isUsed: false,
			shareId: 0,
			userList: [],
			coupon: {
				amount: 0,
				channel: "WX_PROGRAM",
				createTime: "2020-09-09 14:02:48",
				customerId: 11,
				isTake: 0,
				isUsed: 0,
				note: "",
				recordId: 102307,
				redPacketId: 404,
				redPacketName: "",
				remark: null,
				saleType: 2,
				sendType: null,
				shopId: null,
				source: 0,
				takeTime: "2020-09-09 14:02:48",
				transNo: "2",
				type: 1,
				updateTime: null,
				usedAmount: 0,
				usedTime: null,
				userId: 586,
				validEndTime: "2020-09-14 14:02:48",
				validStartTime: "2020-09-09 14:02:48",
			},
			couponType: {
				0: "新人券",
				1: "活动券",
				2: "分享券",
			},
			idemToken: null,
		};
	},
	onReady(e) {},
	async onLoad(query) {
		uni.showLoading({
			title: "加载中",
		});
		this.shareId = query?.shareId ?? this.shareId;
		let fuc = () => {
			this.phone = getApp().globalData.UserInfo.phone;
			this.init();
		};
		appInit(fuc);
	},
	mounted() {},
	methods: {
		init() {
			const that = this;
			uni.login({
				success: function (res) {
					let params = {
						code: res.code,
						userType: "customer",
					};
					let successFuc = async res => {
						uni.setStorageSync("token", res.data.token);
						let AuthCoupon = await store.dispatch("AuthCoupon", {});
						if (AuthCoupon.code !== 0) {
							while (that.counter < 3) {
								that.counter++;
								AuthCoupon = await store.dispatch("AuthCoupon", {});
								if (AuthCoupon.code == 0) break;
							}
							uni.hideLoading();
							if (AuthCoupon.code == 0) return;
							uni.showToast({
								title: "获取领取资格验证失败！",
								icon: "none",
								mask: true,
								duration: 2000000,
							});
							return;
						}
						that.idemToken = AuthCoupon.data;
						that.getList();
					};
					AjaxApi("AuthUrl", params, successFuc);
				},
				fail: function (res) {
					console.log(res);
				},
			});
		},
		async getList() {
			let res = await store.dispatch("GetShareOrderDetail", { randomShareId: this.shareId });
			if ((res?.code ?? 1) !== 0) {
				uni.hideLoading();
				uni.showToast({
					title: res?.msg ?? "网络错误请重试",
					icon: "none",
					mask: true,
					duration: 2000000,
				});
				return;
			}
			this.take = res.data.take;
			this.activityEnd = res.data.activityEnd;
			this.userList = res.data.records;
			this.coupon = !res.data.current ? this.coupon : res.data.current;
			this.isUsed = (this.coupon?.isUsed ?? 0) === 0 ? false : true;
			uni.hideLoading();
			this.$forceUpdate();
		},
		turntohome() {
			uni.switchTab({
				url: "/pages/index/index",
			});
		},
		async shareCoupon() {
			if (this.take || this.activityEnd) {
				this.turntohome();
				return;
			}
			uni.showLoading({
				title: "正在领取",
				mask: true,
			});
			let params = {
				channel: "WX_PROGRAM",
				randomShareId: this.shareId,
				header: { idem_token: this.idemToken },
			};
			let successFuc = res => {
				this.coupon = res.data;
				this.maskTakeCoupon = true;
			};
			let elseFuc = err => {
				const that = this;
				if (err.code == 10010) {
					uni.showToast({
						title: "您已经领取过了！",
						icon: "none",
						mask: true,
						duration: 2000,
						success: () => {
							setTimeout(function () {
								that.getList();
							}, 2000);
						},
					});
					return;
				} else {
					let page = getCurrentPages().pop(); //获取当前页面实例
					if (page == undefined || page == null) return;
					page.onLoad();
				}
				that.getList();
				return;
			};
			AjaxApi("GetShareOrderRedPacket", params, successFuc, elseFuc);
		},
		closeMask() {
			this.maskTakeCoupon = false;
			this.getList();
		},
		getPhoneNumber(e) {
			// 手机号码授权
			if (e.detail.encryptedData && e.detail.iv) {
				uni.showLoading({
					title: "授权中",
					mask: true,
				});
				let params = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
				};
				let successFuc = async res => {
					let ress = await store.dispatch("QueryUserInfo", {});
					getApp().globalData.UserInfo = ress?.data ?? { phone: null };
					this.shareCoupon();
				};
				AjaxApi("GetUserPhone", params, successFuc);
			} else {
				uni.showModal({
					title: "温馨提示",
					content: "您点击了拒绝授权，将无法参加活动",
					showCancel: false,
					confirmText: "确定",
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	min-height: 100vh;
	width: 100vw;
	background: url("https://oss.dianddian.cn/activity/order_share/share_random.jpg") no-repeat, linear-gradient(90deg, #f5156c 0%, #fa8a34 100%);
	background-size: 100%;
	padding: 548rpx 40rpx 40rpx 40rpx;
	.quan {
		position: relative;
		width: auto;
		height: 180rpx;
		background: radial-gradient(circle at right top, transparent 20rpx, #ffffff 0) top left / 514rpx 51% no-repeat,
			radial-gradient(circle at right bottom, transparent 20rpx, #ffffff 0) bottom left / 514rpx 51% no-repeat,
			radial-gradient(circle at left top, transparent 20rpx, #ffffff 0) top right / 160rpx 51% no-repeat,
			radial-gradient(circle at left bottom, transparent 20rpx, #ffffff 0) bottom right / 160rpx 51% no-repeat;
		// filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3));
		&:before {
			content: "";
			height: 130rpx;
			border: 2rpx dashed #ff4d4f;
			position: absolute;
			left: 512rpx;
			top: 0;
			bottom: 0;
			margin: auto;
		}
		display: flex;
		justify-content: space-between;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		> view {
			display: flex;
			&:first-child {
				width: 512rpx;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 0 40rpx;
				> view {
					display: flex;
					&:first-child {
						color: #333333;
						font-size: 32rpx;
						font-weight: 400;
						align-items: flex-end;
						padding-bottom: 10rpx;
					}
					&:nth-child(2) {
						> view {
							white-space: nowrap;
							border: 2rpx solid #ff4d4f;
							color: #ff4d4f;
							&:last-child {
								border: 0;
								color: #666666;
								margin-right: 0rpx;
							}
							padding: 0 6rpx;
							line-height: 28rpx;
							margin-right: 10rpx;
						}
						padding-top: 10rpx;
						color: #666666;
						font-size: 20rpx;
						font-weight: 400;
						align-items: start;
					}
					height: 50%;
					width: 100%;
				}
			}
			&:nth-child(2) {
				flex: 1;
				width: 0;
				justify-content: center;
				color: #666666;
				// color: #ff4d4f;
				line-height: 180rpx;
				font-weight: bold;
				font-size: 34rpx;
				image {
					width: 90rpx;
					height: 70rpx;
					position: absolute;
					right: 12rpx;
					top: 12rpx;
				}
			}
		}
		&.unactive {
			&:before {
				content: "";
				height: 130rpx;
				border: 2rpx dashed #c5cad5;
				position: absolute;
				left: 512rpx;
				top: 0;
				bottom: 0;
				margin: auto;
			}
			> view {
				&:first-child {
					> view {
						display: flex;
						&:first-child {
							color: #666666;
						}
						&:nth-child(2) {
							> view {
								white-space: nowrap;
								border: 2rpx solid #666666;
								color: #666666;
								&:last-child {
									border: 0;
									color: #666666;
									margin-right: 0rpx;
								}
							}
							color: #666666;
						}
					}
				}
				&:nth-child(2) {
					color: #666666;
					position: relative;
					image {
						width: 90rpx;
						height: 70rpx;
						position: absolute;
						right: 12rpx;
						top: 12rpx;
					}
				}
			}
		}
	}
	.can-get {
		width: auto;
		height: 180rpx;
		border-radius: 8rpx;
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0px 10rpx 60rpx rgba(197, 202, 213, 0.15);
		font-size: 36rpx;
		font-weight: 400;
		color: #ffffff;
		line-height: 180rpx;
		text-align: center;
	}
	.can-get-tit {
		text-align: center;
		line-height: 50rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #ffffff;
		text-shadow: 0rpx 6rpx 12rpx #ff4d4f;
	}
	.btn {
		margin-top: 30rpx;
		width: auto;
		height: 90rpx;
		background: #ffe336;
		border-radius: 8rpx;
		border: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		font-weight: bold;
		color: #ff4d4f;
	}
	.tit {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 80rpx;
		width: auto;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		> view {
			width: 10rpx;
			height: 10rpx;
			background: linear-gradient(90deg, rgba(254, 194, 13, 1) 0%, rgba(255, 77, 79, 1) 100%);
			border-radius: 50%;
			&:first-child {
				margin-right: 12rpx;
			}
			&:nth-child(2) {
				margin-left: 12rpx;
			}
		}
	}
	.mark {
		margin-top: 24rpx;
		width: auto;
		// height: 660rpx;
		border-radius: 8rpx;
		background: rgba(255, 255, 255, 0.1);
		border: 2rpx solid #ffffff40;
		box-shadow: 0px 10rpx 60rpx rgba(197, 202, 213, 0.15);
		font-size: 36rpx;
		font-weight: 400;
		color: #ffffff;
		padding: 20rpx;
		.mark-item {
			display: flex;
			padding: 10rpx 20rpx;
			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				position: relative;
				&.luck {
					border: 2rpx solid #ffaa29;
					&::before {
						background: url("https://oss.dianddian.cn/activity/order_share/random_lucky.png") no-repeat;
						background-size: cover;
						position: absolute;
						bottom: -2rpx;
						left: 28rpx;
						content: "";
						width: 42rpx;
						height: 40rpx;
					}
				}
			}
			> view {
				margin-left: 24rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				> view {
					&:first-child {
						display: flex;
						justify-content: space-between;
						font-size: 32rpx;
						font-weight: 400;
						line-height: 34rpx;
					}
					&:nth-child(2) {
						margin-top: 10rpx;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #ffffff60;
					}
				}
			}
		}
	}
	.note {
		margin-top: 24rpx;
		width: auto;
		image {
			width: 100%;
			min-height: 0;
			vertical-align: top;
		}
	}
	.guide {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1110;
		opacity: 1;
		color: #fff;
		background: rgba(0, 0, 0, 0.6);
		width: auto;
		height: 100vh;
		.guide-bg-container {
			position: fixed;
			top: 45%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 608rpx;
			// height: 640rpx;
			background: #ff4d4f;
			border-radius: 16rpx;
			padding: 32rpx 48rpx;
			.plat-bg {
				text-align: right;
			}
			.plat-con {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.bttn {
					width: 100%;
					height: 90rpx;
					background: #ffe336;
					border-radius: 8rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					font-weight: bold;
					color: #ff4d4f;
				}
			}
		}
	}
}
</style>
