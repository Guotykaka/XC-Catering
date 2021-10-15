<template>
	<view class="container" v-if="idemToken" :class="[!coupon.share ? 'container share-false' : 'container']">
		<u-mask :show="inviteMask" :custom-style="{ background: 'rgba(0, 0, 0, 0.71)' }" @click="turnTo()">
			<view class="mask-new" v-if="(isNew && coupon.status !== 0) || (isNew && coupon.type == 2)">
				<view class="invite-con">
					<view>
						<view class="btn-invite">领券</view>
					</view>
				</view>
			</view>
			<view class="mask-slot" v-else @click="hideInvite()">
				<u-loading :show="inviteLoading" class="mask-slot" color="#E5CDA1"></u-loading>
				<view class="invite-con" v-show="!inviteLoading">
					<view class="mask-content"
						><text>{{ maxAmount }}</text
						><text>元</text>
					</view>
					<view catchtap="catchtap">
						<button class="btn-invite" open-type="share" plain="true" :hover-stop-propagation="true">喊好友马上领红包</button>
					</view>
				</view>
				<u-icon name="close" color="#fff" size="32" v-show="!inviteLoading"></u-icon>
			</view>
		</u-mask>
		<!-- <view class="scrolling">
			<view class="target">
				<view>
					<image src="https://oss.dianddian.cn/activity/zhuli/zhuli_touxiang.png" mode="aspectFill"></image>
					<view class="name u-line-1">666</view>
					<view style="width: 2rpx; height: 24rpx; background: #ffffff; opacity: 0.5; margin: 0 8rpx"></view>已累计领取 <text>5元</text>
				</view>
			</view>
		</view> -->
		<view class="scrolling" v-if="inList.length">
			<swiper
				vertical="true"
				autoplay="true"
				circular="true"
				:interval="2000"
				:display-multiple-items="inList.length > 3 ? 3 : inList.length"
				:style="{ height: inList.length * 60 + 'rpx' }"
			>
				<block v-for="(it, i) in inList" :key="i">
					<swiper-item catchtouchmove="catchTouchMove" catchtap="catchTouchMove" catchtouchstart="catchTouchMove">
						<view class="mark-item" v-if="i < inList.length">
							<view>
								<image :src="it.avatarUrl" mode="aspectFill"></image>
								<view class="name u-line-1">{{ it.nickName }}</view>
								<view style="width: 2rpx; height: 24rpx; background: #ffffff; opacity: 0.5; margin: 0 8rpx"></view>已累计领取
								<text>{{ it.amount }}元</text>
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view v-if="coupon.status !== -1" class="content">
			<view class="avatar">
				<image :src="avatarUrl" mode="aspectFill"></image>
			</view>
			<view class="before u-line-1">{{ coupon.share ? "我的助力" : coupon.nickName }}</view>
			<view class="invite-tips" v-if="!coupon.share && coupon.type !== 1">{{
				!coupon.share && coupon.status == 1
					? "您的好友已完成助力啦！"
					: !coupon.share && coupon.type == 2
					? "已帮TA助力啦！"
					: !coupon.share && coupon.type == 3
					? "每天只能帮同一个好友助力1次哦！"
					: "每天只能帮同一个好友助力1次哦！"
			}}</view>
			<view class="invite-num">{{ title }}</view>
			<view class="invite-count" v-if="coupon.share && coupon.status == 1">
				<text>{{ mainMaxAmount }}</text
				><text>元</text>
			</view>
			<view class="invite-time" v-if="coupon.share && coupon.status == 0">
				<text style="margin-right: 10rpx">还有</text>
				<u-count-down
					:timestamp="timeStamp"
					:show-border="true"
					font-size="28"
					height="48"
					width="48"
					bg-color="#E5CDA1"
					color="#343434"
					border-color="#E5CDA1"
				></u-count-down>
				<text style="margin-left: 10rpx">结束</text>
			</view>
			<button
				class="invite-btn"
				v-if="!coupon.share && coupon.type == 1 && coupon.status == 0 && !phone"
				plain="true"
				open-type="getPhoneNumber"
				@getphonenumber="getPhoneNumber"
			>
				{{ btnText }}
			</button>
			<view class="invite-btn" v-else-if="!coupon.share && coupon.type == 1 && coupon.status == 0 && phone" @tap="boost">{{ btnText }}</view>
			<view
				class="invite-btn"
				v-else-if="
					Boolean(coupon.share && coupon.status == 1) || Boolean(!coupon.share && coupon.type !== 1) || Boolean(!coupon.share && coupon.status == 1)
				"
				@tap="inviteFuc"
				>{{ btnText }}</view
			>
			<button class="invite-btn" open-type="share" data-type="invite" plain="true" v-else>{{ btnText }}</button>
			<view class="invite-tit"
				><view></view> <text space="ensp">好友助力进度 {{ coupon.records.length }}/3 人</text> <view></view
			></view>
			<view class="invite-avatar">
				<view
					><image
						:src="coupon.records[0].avatarUrl || 'https://oss.dianddian.cn/activity/zhuli/zhuli_touxiang.png'"
						:class="[!coupon.records[0].avatarUrl ? 'none' : '']"
						mode="aspectFill"
					></image>
					<view
						:class="[!coupon.records[0].avatarUrl ? 'none' : '', !coupon.status == 0 ? 'name u-line-3' : 'name u-line-1']"
						:style="{ 'line-height': !coupon.status == 0 ? '30rpx' : '40rpx', 'border-radius': !coupon.status == 0 ? '15rpx' : '30rpx' }"
						>{{ coupon.records[0].avatarUrl ? (coupon.status == 0 ? "已助力" : `获得${coupon.minAmount}元红包`) : "待助力" }}</view
					>
				</view>
				<view
					><image
						:src="coupon.records[1].avatarUrl || 'https://oss.dianddian.cn/activity/zhuli/zhuli_touxiang.png'"
						:class="[!coupon.records[1].avatarUrl ? 'none' : '']"
						mode="aspectFill"
					></image>
					<view
						:class="[!coupon.records[1].avatarUrl ? 'none' : '', !coupon.status == 0 ? 'name u-line-3' : 'name u-line-1']"
						:style="{ 'line-height': !coupon.status == 0 ? '30rpx' : '40rpx', 'border-radius': !coupon.status == 0 ? '15rpx' : '30rpx' }"
						>{{ coupon.records[1].avatarUrl ? (coupon.status == 0 ? "已助力" : `获得${coupon.minAmount}元红包`) : "待助力" }}</view
					>
				</view>
				<view
					><image
						:src="coupon.records[2].avatarUrl || 'https://oss.dianddian.cn/activity/zhuli/zhuli_touxiang.png'"
						:class="[!coupon.records[2].avatarUrl ? 'none' : '']"
						mode="aspectFill"
					></image>
					<view
						:class="[!coupon.records[2].avatarUrl ? 'none' : '', !coupon.status == 0 ? 'name u-line-3' : 'name u-line-1']"
						:style="{ 'line-height': !coupon.status == 0 ? '30rpx' : '40rpx', 'border-radius': !coupon.status == 0 ? '15rpx' : '30rpx' }"
						>{{ coupon.records[2].avatarUrl ? (coupon.status == 0 ? "已助力" : `获得${coupon.minAmount}元红包`) : "待助力" }}</view
					>
				</view>
			</view>
		</view>
		<view v-else class="content-else">抱歉，该活动已结束~</view>
		<view class="tit"><view></view> 活动规则 <view></view></view>
		<view class="note">
			<image src="https://oss.dianddian.cn/activity/zhuli/zhuli_rule.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL } from "@/utils/api";
import { appInit } from "@/utils";
import store from "@/store";
import { setTimeout } from "timers";
export default {
	data() {
		return {
			isNew: false,
			phone: getApp().globalData.UserInfo.phone,
			maxAmount: 5,
			NewShareId: null,
			mainMaxAmount: 5,
			title: "",
			btnText: "",
			inviteMask: false,
			inviteLoading: false,
			counter: 0,
			timeStamp: 0,
			maskTakeCoupon: false,
			activityEnd: false,
			avatarUrl: "",
			isUsed: false,
			shareId: 0,
			userList: [],
			inList: [],
			coupon: {},
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
	onShareAppMessage: function (res) {
		if (res.from === "button") {
			return {
				title: "帮我助力，你也得红包",
				imageUrl: "https://oss.dianddian.cn/activity/zhuli/zhuli_top_1.png?x-oss-process=image/resize,w_700",
				path: `/pagesC/sharingInvite/sharingInvite?shareId=${!this.inviteMask ? this.shareId : this?.NewShareId ?? this.shareId}`,
			};
			// 来自页面内转发按钮
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
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
						uni.showLoading({
							title: "加载中",
						});
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
						let inList = await store.dispatch("GetInviteHistory", {});
						that.inList = inList?.data ?? [];
					};
					AjaxApi("AuthUrl", params, successFuc);
				},
				fail: function (res) {
					console.log(res);
				},
			});
		},
		catchTouchMove() {
			return !1;
		},
		catchtap() {
			this.inviteLoading = true;
		},
		async inviteFuc() {
			this.getList();
			this.inviteMask = true;
			this.inviteLoading = true;
			let sucFuc = res => {
				this.inviteLoading = false;
				this.NewShareId = res.data.id;
				this.maxAmount = res.data.maxAmount;
			};
			let elseF = () => {
				this.inviteMask = false;
				uni.showToast({
					title: "创建分享活动失败!",
					icon: "none",
					mask: true,
					duration: 2000,
				});
			};
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
			setTimeout(() => {
				AjaxApi(
					"SetInviteShare",
					{
						header: { idem_token: AuthCoupon.data },
					},
					sucFuc,
					elseF
				);
			}, 1000);
		},
		hideInvite() {
			this.inviteMask = false;
			this.inviteLoading = false;
		},
		boost() {
			uni.showLoading({
				title: "加载中",
			});
			const that = this;
			let params = {
				channel: "WX_PROGRAM",
				shareHelpId: this.shareId,
				header: { idem_token: this.idemToken },
			};
			let successFuc = async res => {
				that.getList();
			};
			let elseFuc = res => {
				that.getList();
			};
			AjaxApi("PostInviteShare", params, successFuc);
		},
		turnTo() {
			uni.switchTab({
				url: "/pages/index/index",
			});
		},
		async getList() {
			let res = await store.dispatch("GetShareHelpDetail", { shareHelpId: this.shareId });
			if ((res?.code ?? 1) !== 0) {
				uni.hideLoading();
				uni.showToast({
					title: res?.msg ?? "网络错误请重试",
					icon: "none",
					mask: true,
					duration: 2000000,
				});
				this.idemToken = null;
				return;
			}
			this.avatarUrl = res.data.avatarUrl;
			this.timeStamp = (14400000 - (Date.parse(new Date()) - Date.parse(new Date(res.data.createTime.replace(/-/g, "/"))))) / 1000;
			this.coupon = res.data;
			this.mainMaxAmount = res.data.maxAmount;
			if ((this.isNew && res.data.status !== 0) || (this.isNew && res.data.type == 2)) {
				uni.hideLoading();
				this.inviteMask = true;
				return;
			}
			switch (res.data.share) {
				//status 状态(-1,失败, 0,进行中,1已完成)
				//share 当前发起人,True是,false不是
				//type 类型,1未助力,2.已助力,3.超过助力次数
				case true:
					this.title = res.data.status == 0 ? "仅需3人助力，即可领取大红包~" : res.data.status == 1 ? "集齐好友助力，轻松获得红包" : "";
					this.btnText = res.data.status == 0 ? "喊好友马上领红包" : res.data.status == 1 ? "再来一轮，我还要领红包" : "";
					break;
				case false:
					this.title = res.data.type == 1 && res.data.status == 0 ? "帮TA助力，惊喜奖励等着你" : "发起你的助力，惊喜红包等你拿";
					this.btnText = res.data.type == 1 && res.data.status == 0 ? "帮TA一下，成功你也能领红包" : "我也要助力领红包";
					break;
				default:
					break;
			}
			uni.hideLoading();
			this.$forceUpdate();
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
					getApp().globalData.UserInfo = ress?.data ?? null;
					this.boost();
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
	@keyframes rowup {
		0% {
			-webkit-transform: translateY(0);
			-moz-transform: translateY(0);
			-o-transform: translateY(0);
		}
		100% {
			transform: translateY(calc(-100% + 56rpx));
			-webkit-transform: translateY(calc(-100% + 56rpx));
			-moz-transform: translateY(calc(-100% + 56rpx));
			-o-transform: translateY(calc(-100% + 56rpx));
		}
	}
	.scrolling {
		position: absolute;
		top: 370rpx;
		left: 20rpx;
		width: 100vw;
		height: 60rpx;
		overflow: hidden;
		.target {
			position: relative;
			.name {
				max-width: 100rpx;
			}
			> view {
				display: inline-flex;
				align-items: center;
				min-width: 360rpx;
				height: 56rpx;
				line-height: 56rpx;
				margin-bottom: 20px;
				background: rgba(0, 0, 0, 0.5);
				padding-right: 8rpx;
				border-radius: 80rpx;
				color: #ffffff;
				font-size: 24rpx;
				image {
					margin: 0 8rpx;
					height: 40rpx;
					width: 40rpx;
					border-radius: 50%;
				}
				text {
					color: #fec20d;
				}
			}
			animation: 12s rowup linear infinite normal;
		}
		.mark-item {
			position: relative;
			.name {
				max-width: 100rpx;
			}
			> view {
				display: inline-flex;
				align-items: center;
				// min-width: 360rpx;
				height: 56rpx;
				line-height: 56rpx;
				margin-bottom: 20px;
				background: rgba(0, 0, 0, 0.5);
				padding-right: 16rpx;
				border-radius: 80rpx;
				color: #ffffff;
				font-size: 24rpx;
				image {
					margin: 0 8rpx;
					height: 40rpx;
					width: 40rpx;
					border-radius: 50%;
				}
				text {
					color: #fec20d;
				}
			}
		}
	}
	button[plain] {
		border: 0;
	}
	@keyframes scaleDrew {
		/* 定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称 */
		0% {
			transform: scale(1);
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-o-transform: scale(1);
		}
		25% {
			transform: scale(1.05);
			-webkit-transform: scale(1.05);
			-moz-transform: scale(1.05);
			-o-transform: scale(1.05);
		}
		50% {
			transform: scale(1);
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-o-transform: scale(1);
		}
		75% {
			transform: scale(1.05);
			-webkit-transform: scale(1.05);
			-moz-transform: scale(1.05);
			-o-transform: scale(1.05);
		}
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	min-height: 100vh;
	width: 100vw;
	background: url("https://oss.dianddian.cn/activity/zhuli/zhuli_top_1.png") no-repeat, #e5cda1;
	&.share-false {
		background: url("https://oss.dianddian.cn/activity/zhuli/zhuli_top_2.png") no-repeat, #e5cda1;
		background-size: 100%;
	}
	background-size: 100%;
	padding: 518rpx 20rpx 40rpx 20rpx;
	position: relative;
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
				background: #ffe336;
				opacity: 1;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 90rpx;
				color: #ff4d4f;
			}
		}
	}
	.mask-slot {
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
			top: -200rpx;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 582rpx;
			height: 722rpx;
			background: url("https://oss.dianddian.cn/activity/zhuli/zhuli_share_1.png");
			background-size: contain;
			background-repeat: no-repeat;
			text-align: center;
			.mask-content {
				margin-top: 300rpx;
				text {
					&:first-child {
						font-size: 108rpx;
						font-weight: bold;
						line-height: 52rpx;
						color: #6a5735;
					}
					&:last-child {
						font-size: 32rpx;
						font-weight: bold;
						line-height: 52rpx;
						color: #6a5735;
					}
				}
			}
			.btn-invite {
				border: 0;
				position: absolute;
				bottom: 8%;
				left: 50%;
				transform: translate(-50%, 0);
				background: radial-gradient(circle, #e5cda1 0%, #ceae73 100%);
				box-shadow: 0 10rpx 20rpx rgba(106, 85, 22, 0.2);
				border-radius: 16rpx;
				width: 440rpx;
				height: 90rpx;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 90rpx;
				color: #6a5735;
			}
		}
	}
	.content {
		position: relative;
		width: 100%;
		background: #ffffff;
		border-radius: 16rpx;
		padding-top: 150rpx;
		padding-bottom: 110rpx;
		.avatar {
			display: flex;
			justify-content: center;
			image {
				position: absolute;
				top: -80rpx;
				height: 156rpx;
				width: 156rpx;
				margin: 0 auto;
				border-radius: 50%;
				border: 6rpx solid #ceae73;
				box-shadow: 0 0 0 6rpx #fff;
			}
		}
		.before {
			color: #fff;
			width: 200rpx;
			height: 52rpx;
			line-height: 52rpx;
			text-align: center;
			background: #ceae73;
			border-radius: 30rpx;
			font-size: 28rpx;
			font-weight: bold;
			top: 72rpx;
			padding: 0 15rpx;
			left: calc(50% - 100rpx);
			z-index: 200;
			position: absolute;
			margin: auto;
		}
		.invite-tips {
			font-size: 28rpx;
			font-weight: bold;
			line-height: 40rpx;
			color: #404041;
			text-align: center;
			padding-bottom: 16rpx;
		}
		.invite-num {
			font-size: 36rpx;
			font-weight: bold;
			color: #ceae73;
			padding-bottom: 60rpx;
			text-align: center;
		}
		.invite-count {
			text-align: center;
			text {
				&:first-child {
					font-size: 108rpx;
					font-weight: bold;
					line-height: 52rpx;
					color: #ceae73;
				}
				&:last-child {
					font-size: 32rpx;
					font-weight: bold;
					line-height: 52rpx;
					color: #ceae73;
				}
			}
		}
		.invite-time {
			margin-top: 40rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 400;
			color: #404041;
		}
		.invite-btn {
			width: 572rpx;
			height: 90rpx;
			background: radial-gradient(circle, #e5cda1 0%, #ceae73 100%);
			box-shadow: 0 10rpx 20rpx rgba(106, 85, 22, 0.2);
			line-height: 90rpx;
			text-align: center;
			border-radius: 16rpx;
			margin: 40rpx auto 0 auto;
			font-size: 32rpx;
			font-weight: bold;
			color: #6a5735;
			animation: scaleDrew 2s ease-in-out infinite;
			z-index: 1000;
		}
		.invite-tit {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 80rpx;
			width: auto;
			font-size: 24rpx;
			font-weight: 400;
			color: #404041;
			> view {
				width: 10rpx;
				height: 10rpx;
				background: #ceae73;
				border-radius: 50%;
				&:first-child {
					margin-right: 12rpx;
					position: relative;
					&:after {
						content: "";
						width: 60rpx;
						height: 2rpx;
						right: 0;
						top: 50%;
						transform: translate(0, -50%);
						position: absolute;
						margin: auto;
						background: linear-gradient(90deg, rgba(255, 77, 79, 0) 0%, #ceae73 100%);
					}
				}
				&:nth-child(3) {
					margin-left: 12rpx;
					position: relative;
					&:after {
						content: "";
						width: 60rpx;
						height: 2rpx;
						left: 0;
						top: 50%;
						transform: translate(0, -50%);
						position: absolute;
						margin: auto;
						background: linear-gradient(90deg, #ceae73 0%, rgba(255, 77, 79, 0) 100%);
					}
				}
			}
		}
		.invite-avatar {
			display: flex;
			margin-top: 60rpx;
			> view {
				width: calc(100% / 3);
				display: flex;
				justify-content: center;
				position: relative;
				.name {
					color: #ffffff;
					width: 120rpx;
					min-height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					background: #e5cda1;
					border-radius: 30rpx;
					font-size: 24rpx;
					font-weight: 400;
					top: 86rpx;
					left: calc(50% - 60rpx);
					z-index: 200;
					padding: 0 10rpx;
					position: absolute;
					margin: auto;
					&.none {
						background: #d5d5d5;
					}
				}
			}
			image {
				height: 104rpx;
				width: 104rpx;
				margin: 0 auto;
				border-radius: 50%;
				border: 4rpx solid #e5cda1;
				&.none {
					border: 0;
				}
			}
		}
	}
	.content-else {
		background: #ffffff;
		height: 180rpx;
		width: auto;
		text-align: center;
		line-height: 180rpx;
		font-size: 36rpx;
		font-weight: bold;
		color: #404041;
		border: 2rpx solid #ceae73;
		border-radius: 16rpx;
	}
	.tit {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 80rpx;
		width: auto;
		font-size: 24rpx;
		font-weight: 400;
		color: #ffffff;
		> view {
			width: 10rpx;
			height: 10rpx;
			background: #ceae73;
			border-radius: 50%;
			&:first-child {
				margin-right: 12rpx;
				position: relative;
				&:after {
					content: "";
					width: 60rpx;
					height: 2rpx;
					right: 0;
					top: 50%;
					transform: translate(0, -50%);
					position: absolute;
					margin: auto;
					background: linear-gradient(90deg, rgba(255, 77, 79, 0) 0%, #ceae73 100%);
				}
			}
			&:nth-child(2) {
				margin-left: 12rpx;
				position: relative;
				&:after {
					content: "";
					width: 60rpx;
					height: 2rpx;
					left: 0;
					top: 50%;
					transform: translate(0, -50%);
					position: absolute;
					margin: auto;
					background: linear-gradient(90deg, #ceae73 0%, rgba(255, 77, 79, 0) 100%);
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
}
</style>
