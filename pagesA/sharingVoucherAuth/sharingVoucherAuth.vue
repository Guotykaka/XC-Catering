<template>
	<view class="container" v-if="idemToken">
		<u-mask :show="showMask" :custom-style="{ background: 'rgba(0, 0, 0, 0.71)' }" @click="turntohome()">
			<view class="mask-new">
				<view class="invite-con">
					<view>
						<view class="btn-invite">领券</view>
					</view>
				</view>
			</view>
		</u-mask>
		<!-- <view v-show="maskTakeCoupon" class="guide">
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
					<view class="bttn" @tap="turntohome">去使用</view>
				</view>
			</view>
		</view> -->
		<view v-if="take">
			<view :class="[{ unactive: isUsed }, 'quan']">
				<view>
					<view class="u-line-1">
						<text class="u-line-1" style="font-weight: bold">{{ coupon.redPacketName }}</text>
						<text class="tag">{{ couponType[coupon.type] }}</text>
						<text class="tag">{{ coupon.saleType == 0 ? "堂食" : coupon.saleType == 1 ? "外卖" : it.saleType == 2 ? "通用" : "拼餐" }}</text>
					</view>
					<view style="min-width: 0">
						<view class="u-line-1" style="border: 0">
							{{ coupon.validType == 0 ? "长期有效" : "领取后" + coupon.days + "天内有效" }}
						</view>
					</view>
				</view>
				<view>
					<text style="color: rgba(254, 118, 19, 1); font-weight: bold; margin-top: -16rpx">
						<text style="font-size: 24rpx">￥</text>
						{{ coupon.amount.toFixed(2) }}
					</text>
					<text style="font-size: 24rpx; margin-top: 10rpx">
						{{ coupon.usedAmount == 0 ? "全平台可用" : "满" + coupon.usedAmount + "元可用" }}
					</text>
				</view>
			</view>
			<view class="btn" v-if="take && !isUsed" @tap="shareCoupon()">
				<image src="https://oss.dianddian.cn/activity/yy_share/bt_2.png"></image>
			</view>
		</view>
		<view v-else class="box-main">
			<view :class="[{ shake: maskTakeCoupon }, 'animated']">
				<!-- <view :class="[{ wobble: maskTakeCoupon }, 'animated']"> -->
				<image src="https://oss.dianddian.cn/activity/yy_share/yy_share_red.png" class="redp"></image>
			</view>
			<view v-if="activityEnd" class="can-get">您来晚啦，红包已被领取完！</view>
			<view v-else-if="!activityEnd && !isUsed" class="can-get-tit">人品大爆发，快来试试你的手气！</view>
			<button class="btn animated infinite pulse" v-if="!activityEnd && !phone" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<image src="https://oss.dianddian.cn/activity/yy_share/bt_1.png" mode="widthFix"></image>
			</button>
			<view class="btn animated infinite pulse" v-if="!activityEnd && phone" @tap="shareCoupon()">
				<image src="https://oss.dianddian.cn/activity/yy_share/bt_1.png" mode="widthFix"></image>
			</view>
		</view>
		<view style="text-align: center">
			<image src="https://oss.dianddian.cn/activity/yy_share/bt_3.png" class="tit" mode="widthFix"></image>
		</view>
		<view :class="[{ alive: Boolean(!userList.length) }, 'mark']">
			<view style="text-align: center; line-height: 326rpx" v-if="!userList.length">暂无人领取</view>
			<view v-if="userList.length">
				<swiper
					vertical="true"
					autoplay="true"
					circular="true"
					interval="2000"
					:display-multiple-items="userList.length > 3 ? 3 : userList.length"
					:style="{ height: userList.length * 136 + 'rpx', 'max-height': '408rpx', 'min-height': '136rpx' }"
				>
					<block v-for="(it, i) in userList" :key="i">
						<swiper-item>
							<view class="mark-item" v-if="i < userList.length">
								<image :src="it.avatarUrl" mode="aspectFill"></image>
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
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
		<view class="titt"><view></view> 活动规则 <view></view></view>
		<view class="note">
			<image src="https://oss.dianddian.cn/share/share_rule.png" mode="widthFix"></image>
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
			counter: 0,
			isNew: false,
			showMask: false,
			maskTakeCoupon: false,
			phone: null,
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
	async onLoad(query) {
		const that = this;
		this.shareId = query?.shareId ?? this.shareId;
		uni.showLoading({
			title: "加载中",
		});
		let fuc = () => {
			this.phone = getApp().globalData.UserInfo.phone;
			this.init();
		};
		appInit(fuc);
	},
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
						let isNewUser = await store.dispatch("IsNewUser", {});
						that.isNew = isNewUser?.data ?? false;
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
			let res = await store.dispatch("GetShareAuthDetail", { shareOperationId: this.shareId });
			if ((res?.code ?? 1) !== 0) {
				uni.hideLoading();
				uni.showToast({
					title: res?.msg ?? "网络错误请重试",
					icon: "none",
					mask: true,
					duration: 2000000,
				});
				this.showMask = this.isNew ? true : false;
				return;
			}
			this.take = res.data.take;
			this.activityEnd = res.data.activityEnd;
			this.showMask = Boolean(this.isNew && this.activityEnd) || Boolean(this.isNew && this.take) ? true : false;
			this.userList = res.data.records;
			this.coupon = !res.data.current ? this.coupon : res.data.current;
			this.isUsed = (this.coupon?.isUsed ?? 0) === 0 ? false : true;
			uni.hideLoading();
		},
		turntohome() {
			uni.switchTab({
				url: "/pages/index/index",
			});
		},
		async shareCoupon() {
			if (this.take) {
				this.turntohome();
				return;
			}
			// uni.showLoading({
			// 	title: "正在领取",
			// 	mask: true,
			// });
			this.maskTakeCoupon = true;
			let params = {
				channel: "WX_PROGRAM",
				shareOperationId: this.shareId,
				header: { idem_token: this.idemToken },
			};
			let successFuc = res => {
				this.coupon = res.data;
				this.getList();
				// this.maskTakeCoupon = true;
			};
			let elseFuc = err => {
				const that = this;
				if (err.code == 10010) {
					uni.showToast({
						title: "超过领取次数！",
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
				}
				that.getList();
				return;
			};
			setTimeout(() => {
				if (!this.maskTakeCoupon) return;
				uni.showLoading({
					title: "正在领取",
					mask: true,
				});
				AjaxApi("GetShareAuthPacket", params, successFuc, elseFuc);
				console.log(66);
				this.maskTakeCoupon = false;
			}, 1000);
			// AjaxApi("GetShareAuthPacket", params, successFuc, elseFuc);
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
@import url("/static/animate.css");
.container {
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	min-height: 100vh;
	width: 100vw;
	// background: url("https://oss.dianddian.cn/share/%E6%8B%BC%E6%89%8B%E6%B0%94.png") no-repeat;
	background: url("https://oss.dianddian.cn/activity/yy_share/yy_share_bg.png") no-repeat;
	background-position: 0 -160rpx;
	background-size: 100%;
	background-attachment: scroll;
	// height: 100vh;
	// overflow: auto;
	background-color: #e71935;
	padding: 738rpx 24rpx 40rpx 24rpx;
	.mask-new {
		/deep/.u-loading {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
		/deep/u-icon {
			position: absolute;
			bottom: 10%;
			left: 50%;
			transform: translate(-50%, 0);
			margin: auto;
		}
		.invite-con {
			position: fixed;
			top: -120rpx;
			left: 0rpx;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 682rpx;
			height: 952rpx;
			background: url("https://oss.dianddian.cn/activity/new_user.png");
			background-size: contain;
			background-repeat: no-repeat;
			text-align: center;
			.btn-invite {
				position: absolute;
				bottom: 8%;
				left: 51%;
				transform: translate(-50%, 0);
				width: 510rpx;
				height: 90rpx;
				border-radius: 8rpx;
				border: 0;
				background: #ffe336;
				opacity: 1;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 90rpx;
				color: #ff4d4f;
			}
		}
	}
	.quan {
		position: relative;
		width: auto;
		height: 180rpx;
		background: radial-gradient(circle at right top, transparent 20rpx, #ffffff 0) top left / 514rpx 51% no-repeat,
			radial-gradient(circle at right bottom, transparent 20rpx, #ffffff 0) bottom left / 514rpx 51% no-repeat,
			radial-gradient(circle at left top, transparent 20rpx, #ffffff 0) top right / 190rpx 51% no-repeat,
			radial-gradient(circle at left bottom, transparent 20rpx, #ffffff 0) bottom right / 190rpx 51% no-repeat;
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
						.tag {
							border-radius: 8rpx;
							margin-left: 16rpx;
							color: rgba(254, 118, 19, 1);
							font-size: 18rpx;
							padding: 8rpx 12rpx;
							background: rgba(254, 118, 19, 0.1);
						}
					}
					&:nth-child(2) {
						> view {
							white-space: nowrap;
							border: 2rpx solid #ff4d4f;
							color: #ff4d4f;
							&:last-child {
								border: 0;
								color: rgba(177, 177, 181, 1);
								margin-right: 0rpx;
							}
							padding: 0 6rpx;
							line-height: 28rpx;
							margin-right: 10rpx;
						}
						padding-top: 10rpx;
						color: #666666;
						font-size: 24rpx;
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
				display: flex;
				flex-direction: column;
				justify-content: center;
				color: rgba(177, 177, 181, 1);
				font-size: 34rpx;
				text {
					text-align: center;
				}
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
		// border-radius: 8rpx;
		// background: rgba(255, 255, 255, 0.2);
		// box-shadow: 0px 10rpx 60rpx rgba(197, 202, 213, 0.15);
		font-size: 36rpx;
		font-weight: 400;
		color: #343434;
		line-height: 180rpx;
		text-align: center;
	}
	.can-get-tit {
		// margin-top: 20rpx;
		width: 100%;
		font-weight: bold;
		color: #ed4137;
		text-align: center;
		line-height: 50rpx;
		font-size: 36rpx;
	}
	.box-main {
		width: auto;
		display: flex;
		flex-direction: column;
		// justify-content: flex-end;
		align-items: center;
		background: #ffffff;
		box-shadow: 0 0 20rpx 0 rgba(233, 26, 56, 0.6);
		border-radius: 20rpx;
		.redp {
			margin-top: 20rpx;
			width: 300rpx;
			height: 313rpx;
		}
	}
	.btn {
		border: 0;
		padding: 0;
		text-align: center;
		image {
			width: 610rpx;
			height: 120rpx;
		}
		margin: 20rpx 0 20rpx 0;
	}
	.tit {
		color: #c5cad5;
		width: 288rpx;
		height: 44rpx;
		width: 288rpx;
		height: 44rpx;
		margin: 40rpx 0 10rpx 0;
	}
	.titt {
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
		font-size: 36rpx;
		min-height: 136rpx;
		&.alive {
			min-height: 326rpx;
		}
		font-weight: 400;
		background: #ffffff;
		color: #636367;
		box-shadow: 0 0 10rpx 0 rgba(233, 26, 56, 0.6);
		border-radius: 20rpx;
		padding: 20rpx;
		.mark-item {
			display: flex;
			padding: 20rpx;
			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
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
						opacity: 0.5;
						// color: #ffffff60;
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
