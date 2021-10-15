<template>
	<view class="container">
		<u-mask :show="showMask" :custom-style="{ background: 'rgba(0, 0, 0, 0.71)' }" @click="turntohome()">
			<view class="mask-new">
				<view class="invite-con">
					<view>
						<view class="btn-invite">领券</view>
					</view>
				</view>
			</view>
		</u-mask>
		<view v-if="canGet">
			<view :class="[{ unactive: it.isTake == 0 }, 'quan']" v-for="(it, i) in shareList" :key="i">
				<view>
					<view
						><text class="u-line-1">{{ it.redPacketName }}</text></view
					>
					<view
						><view>{{ couponType[it.type] }}</view
						>{{ it.validType == 0 ? "长期有效" : "领取后" + it.days + "天内有效" }} |
						{{ it.usedAmount == 0 ? "全平台可用" : "满" + it.usedAmount + "元可用" }}</view
					>
				</view>
				<view>
					<image v-if="it.isTake == 0" src="../../static/img/wancheng.png"></image>
					<text style="font-size: 28rpx">￥</text>{{ it.amount }}
				</view>
			</view></view
		>
		<view v-else class="can-get">该活动已过期!</view>
		<button
			class="btn"
			v-if="canGet && coupon.type == 1 && isTake !== 0 && !phone"
			plain="true"
			open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber"
		>
			{{ btnText }}
		</button>
		<view class="btn" v-else-if="canGet" @tap="shareCoupon()">{{ isTake == 0 ? "立即使用" : "立即领取" }}</view>
		<view class="btn" v-else @tap="turntohome()">返回首页</view>
		<view class="tit"><view></view> 活动规则 <view></view></view>
		<view class="mark">
			<image src="https://oss.dianddian.cn/activity/activity_share.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll } from "@/utils/api";
import { appInit } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			isNew: false,
			showMask: false,
			phone: getApp().globalData.UserInfo.phone,
			canGet: true,
			isTake: 1,
			orderId: 0,
			shareList: [],
			couponType: {
				0: "新人券",
				1: "活动券",
				2: "分享券",
			},
		};
	},
	onReady(e) {},
	async onLoad(query) {
		const that = this;
		this.orderId = query.orderId;
		let fuc = () =>{
			this.phone = getApp().globalData.UserInfo.phone;
			this.init();
		}
		appInit(fuc)
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
			let res = await store.dispatch("GetShareList", { orderId: this.orderId });
			if (!res.data?.length) {
				this.canGet = false;
				this.showMask = Boolean(this.isNew && !this.canGet) ? true : false;
				return;
			}
			this.shareList = res.data;
			this.isTake = this.shareList[0].isTake;
			this.showMask = Boolean(this.isNew && !this.isTake) ? true : false;
		},
		turntohome() {
			uni.switchTab({
				url: "/pages/index/index",
			});
		},
		shareCoupon() {
			if (this.isTake == 0) {
				this.turntohome();
				return;
			}
			let params = {
				channel: "WX_PROGRAM",
				orderId: this.orderId,
			};
			let successFuc = res => {
				this.getList();
			};
			AjaxApi("PostShareCoupon", params, successFuc);
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
	background: url(https://oss.dianddian.cn/activity/activity_share_bg.png) no-repeat;
	background-size: cover;
	padding: 0 20rpx;
	padding-top: 548rpx;
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
				border: 0;
				border-radius: 8rpx;
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
		background: radial-gradient(circle at right top, transparent 20rpx, #ffffff 0) top left / 512rpx 51% no-repeat,
			radial-gradient(circle at right bottom, transparent 20rpx, #ffffff 0) bottom left / 512rpx 51% no-repeat,
			radial-gradient(circle at left top, transparent 20rpx, #ffffff 0) top right / 204rpx 51% no-repeat,
			radial-gradient(circle at left bottom, transparent 20rpx, #ffffff 0) bottom right / 204rpx 51% no-repeat;
		// filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.3));
		&:before {
			content: "";
			height: 130rpx;
			border: 2rpx dashed #ff4d4f;
			position: absolute;
			left: 510rpx;
			top: 0;
			bottom: 0;
			margin: auto;
		}
		// display: grid;
		// grid-template-columns: 512rpx 1fr;
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
				// border-right: 2rpx dashed #ff4d4f;
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
							border: 2rpx solid #ff4d4f;
							color: #ff4d4f;
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
				color: #ff4d4f;
				line-height: 180rpx;
				font-weight: bold;
				font-size: 56rpx;
			}
		}
		&.unactive {
			&:before {
				content: "";
				height: 130rpx;
				border: 2rpx dashed #666666;
				position: absolute;
				left: 510rpx;
				top: 0;
				bottom: 0;
				margin: auto;
			}
			> view {
				&:first-child {
					// border-right: 2rpx dashed #666666;
					> view {
						display: flex;
						&:first-child {
							color: #666666;
						}
						&:nth-child(2) {
							> view {
								border: 2rpx solid #666666;
								color: #666666;
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
		height: 380rpx;
		border: 2rpx solid rgba(254, 194, 13, 0.3);
		background: rgba(255, 255, 255, 0.1);
		box-shadow: 0rpx 5rpx 60rpx rgba(197, 202, 213, 0.15);
		font-size: 48rpx;
		font-weight: 400;
		line-height: 380rpx;
		color: rgba(255, 255, 255, 1);
		text-align: center;
	}
	.btn {
		margin-top: 30rpx;
		width: auto;
		height: 90rpx;
		background: rgba(255, 227, 54, 1);
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		font-weight: 400;
		color: rgba(255, 77, 79, 1);
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
		width: auto;
		padding: 20rpx;
		image {
			width: 100%;
		}
	}
}
</style>
