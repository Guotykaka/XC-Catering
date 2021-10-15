<template>
	<view class="container">
		<u-navbar :is-back="false" :title="scrollTit" :background="backgroundImg"></u-navbar>
		<u-mask :duration="0" :show="mask" :custom-style="{ background: 'rgba(249,250,251, .5)' }">
			<view class="mask-slot">
				<u-loading show class="mask-slot" color="#E5CDA1"></u-loading>
			</view>
		</u-mask>
		<!-- 助力 -->
		<InviteCode :inviteMask="inviteMask" :inviteLoading="inviteLoading" :maxAmount="maxAmount" @inVite="hideInvite"></InviteCode>
		<u-mask :duration="0" :show="shareMask">
			<view class="mask-slot-share">
				<button open-type="share" data-type="share" plain="true">
					<image src="https://oss.dianddian.cn/activity/yy_share/yy_share_01.png" mode="widthFix"></image>
				</button>
				<view> <image src="https://oss.dianddian.cn/activity/yy_share/bt_del.png" mode="widthFix" @tap="shareMask = false"></image></view>
			</view>
		</u-mask>
		<view
			class="head"
			:style="{
				marginTop: -(statusBarHeight + 50) + 'px',
			}"
		>
		</view>
		<view class="recharge">
			<view v-if="userInfo.wxNickName">
				<view>{{ greetTo }}，{{ userInfo.wxNickName }}</view>
				<view><img :src="userInfo.avatarUrl ? userInfo.avatarUrl : 'https://oss.dianddian.cn/v2/default_avatar.png'" alt="" /></view>
			</view>
			<view v-else @tap="updateUser">
				<view>点击获取用户信息</view>
				<view><img src="https://oss.dianddian.cn/v2/default_avatar.png" alt="" /></view>
			</view>
			<view>
				<view @tap="turnTo('address')"><image style="background: #fff" src="https://oss.dianddian.cn/v2/address.png" alt="" />地址管理</view>
				<view @tap="turnTo('collection')"><image src="https://oss.dianddian.cn/v2/my_collect.png" alt="" />我的收藏</view>
				<view @tap="turnTo('coupon')"><image class="redbg" src="https://oss.dianddian.cn/v2/my_red_bg1.png" alt="" />我的红包</view>
				<view @tap="gotoUp"><image src="https://oss.dianddian.cn/v2/my_vip.png" alt="" />我的会员</view>
			</view>
		</view>
		<view class="opeation">
			<view class="opt-item">
				<view class="bd" @tap="turnTo('history')">
					<view class="l iconfont iconlishijilu">
						<text class="u-margin-left-16">浏览记录</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="opt-item">
				<view class="bd" @tap="turnTo('msgInfo')">
					<view class="l iconfont icon-msg">
						<text class="msg" v-if="tag"></text>
						<text class="u-margin-left-16">消息通知</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="opt-item">
				<button open-type="contact">
					<view class="bd" @tap="mask = true">
						<view class="l iconfont icon-kefu">
							<text class="u-margin-left-16">客服帮助</text>
						</view>
						<u-icon class="tip-right" name="arrow-right"></u-icon>
					</view>
				</button>
			</view>
			<view class="opt-item" v-if="shareAuth">
				<view class="bd" @tap="turnTo('share')">
					<view class="l iconfont">
						<u-icon name="coupon"></u-icon>
						<text class="u-margin-left-16">运营分享</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>

			<view class="opt-item">
				<view class="bd" @tap="signOut">
					<view class="l iconfont icon-setting">
						<text class="u-margin-left-16">退出登录</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>
			<!-- <view class="opt-item">
				<cell url="https://work.weixin.qq.com/gm/753e972faf9caece21db35a5a298bb52" contactText="55555555"></cell>
			</view> -->
		</view>

		<view class="notice" @tap="turnTo('invite')">
			<image src="https://oss.dianddian.cn/activity/zhuli/zhuli_banner_2.png" mode="widthFix"></image>
		</view>

		<view class="opeation pb100">
			<view class="opt-item" v-if="grpRecmdUserType === 0">
				<view class="bd" @tap="turnTo('ambassador')">
					<view class="l iconfont iconqizhi">
						<text class="u-margin-left-16">推广大使</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>

			<view class="opt-item" v-if="grpRecmdUserType === 1">
				<view class="bd" @tap="turnTo('talent')">
					<view class="l iconfont icondaren">
						<text class="u-margin-left-16">推广达人</text>
					</view>
					<u-icon class="tip-right" name="arrow-right"></u-icon>
				</view>
			</view>
		</view>

		<view class="notice2" v-if="wxPublicNumberAppid()">
			<official-account style="height: 200rpx"></official-account>
			<view>
				<u-notice-bar type="primary" :list="list" :close-icon="false" :volume-icon="false" bg-color=" rgba(0, 0, 0, 0.7)" color="#fff" :is-circular="false"></u-notice-bar>
				<view class="copy" @tap="copyFuc">点击复制</view>
				<u-icon name="close" class="close" @tap="showCopy = false"></u-icon>
			</view>
		</view>
		<tab-bar pagePath="pages/mine/mine"></tab-bar>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
	import { getToken, getObjType, onLogin } from "@/utils";
	import inviteCode from "../../components/u-act/u-act";
	import store from "@/store";
	export default {
		components: {
			inviteCode,
		},
		data() {
			return {
				backgroundImg: {
					background: "#fff",
					opacity: 0,
				},
				scrollTit: "",
				statusBarHeight: getApp().globalData.statusBarHeight,
				maxAmount: 5,
				showCopy: true,
				shareId: 0,
				inviteMask: false,
				inviteLoading: false,
				shareAuth: false,
				shareMask: false,
				tag: false,
				mask: false,
				userInfo: {
					wxNickName: "",
					phone: "***********",
					avatarUrl: "",
					balance: 0,
					couponNum: 0,
				},
				list: ["关注“餐点到了”公众号", "及时获取最新订单动态"],
				grpRecmdUserType: null, // 0:大使,1:达人,2:用户
			};
		},
		onPageScroll(e) {
			var scrollTop = e.scrollTop;
			this.backgroundImg.opacity = (e.scrollTop || 1) / 50;
			this.scrollTit = e.scrollTop > 50 ? "我的" : "";
		},
		onHide() {
			this.shareMask = false;
			this.inviteMask = false;
		},
		computed: {
			greetTo() {
				let now = new Date(),
					hour = now.getHours();
				if (hour < 6) {
					return "凌晨好";
				} else if (hour < 9) {
					return "早上好";
				} else if (hour < 12) {
					return "上午好";
				} else if (hour < 14) {
					return "中午好";
				} else if (hour < 17) {
					return "下午好";
				} else if (hour < 19) {
					return "傍晚好";
				} else if (hour < 22) {
					return "晚上好";
				} else {
					return "夜里好";
				}
			},
		},
		async onShow() {
			uni.setNavigationBarTitle({
				title: "我的",
			});
			this.mask = false;
			let res = await store.dispatch("GetShareAuth", {});
			this.shareAuth = res?.data ?? false;
			console.log("onShow -> res", res);
			if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
				uni.reLaunch({
					url: "/pagesB/login/login",
				});
				return;
			}
			// let grpRecmdUsTp = await store.dispatch("GroupRecmdUserType", {});
			// this.grpRecmdUserType = grpRecmdUsTp.data;
			this.init();
			this.checkReadCount();
		},
		onShareAppMessage: function (res) {
			if (res.from === "button") {
				switch (res.target.dataset.type) {
					case "share":
						return {
							title: "拼手气领红包",
							imageUrl: "https://oss.dianddian.cn/v2/activity/newindex/yy_share_card.jpg",
							path: `/pagesA/sharingVoucherAuth/sharingVoucherAuth?shareId=${this.shareId}`,
						};
						break;
					case "invite":
						return {
							title: "帮我助力，你也得红包",
							imageUrl: "https://oss.dianddian.cn/activity/zhuli/zhuli_top_1.png?x-oss-process=image/resize,w_700",
							path: `/pagesC/sharingInvite/sharingInvite?shareId=${this.shareId}`,
						};
						break;
					default:
						break;
				}
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
			signOut() {
				uni.navigateTo({
					url: "/pagesB/login/login",
				});
			},
			wxPublicNumberAppid() {
				return Boolean(!getApp().globalData.wxPublicNumberAppid && this.showCopy);
			},
			copyFuc() {
				uni.setClipboardData({
					data: "餐典到了",
					success: function () {
						uni.showToast({
							title: "公众号已复制，请粘贴至微信搜索添加",
							icon: "none",
							mask: true,
							duration: 2000,
						});
					},
				});
			},
			checkReadCount() {
				let params = {};
				let successFuc = res => {
					if (res.data > 0) {
						this.tag = true;
						uni.vibrateShort();
					}
				};
				AjaxApi("GetUnReadCount", params, successFuc);
			},
			updateCount() {
				let params = {};
				let successFuc = res => {
					if (res.code == 0) {
						this.tag = false;
					}
				};
				AjaxApi("UpdateStatus", params, successFuc);
			},
			gotoUp() {
				uni.navigateTo({
					url: `/pagesB/rechargeCentre/rechargeCentre?balance=${this.userInfo.balance}`,
				});
			},
			async turnTo(key) {
				switch (key) {
					case "coupon":
						//选择优惠券
						uni.navigateTo({
							url: "/pagesC/couponList/couponList?",
						});
						break;
					case "logout":
						uni.navigateTo({
							url: "/pagesB/install/install",
						});
						break;
					case "address":
						//地址列表
						uni.navigateTo({
							url: "/pagesB/addressList/addressList?from=true",
						});
						break;
					case "collection":
						uni.navigateTo({
							url: "/pagesB/collectionList/collectionList",
						});
						break;
					case "share":
						let successFuc = res => {
							this.shareMask = true;
							this.shareId = res.data;
						};
						let elseFuc = () => {
							uni.showToast({
								title: "创建分享活动失败!",
								icon: "none",
								mask: true,
								duration: 2000,
							});
						};
						AjaxApi("PostShareAuth", {}, successFuc, elseFuc);
						break;
					case "ambassador":
						uni.navigateTo({
							url: "/pagesPing/ambassador/ambassador",
						});
						break;
					case "talent":
						uni.navigateTo({
							url: "/pagesPing/talent/talent",
						});
						break;
					case "invite":
						this.inviteMask = true;
						this.inviteLoading = true;
						uni.setNavigationBarTitle({
							title: "邀好友领红包",
						});
						let sucFuc = res => {
							this.inviteLoading = false;
							this.shareId = res.data.id;
							this.maxAmount = res.data.maxAmount;
						};
						let elseF = () => {
							this.inviteMask = false;
							uni.setNavigationBarTitle({
								title: "个人中心",
							});
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
							this.inviteMask = false;
							uni.showToast({
								title: "获取领取资格验证失败！",
								icon: "none",
								mask: true,
								duration: 2000000,
							});
							return;
						}
						AjaxApi(
							"SetInviteShare",
							{
								header: { idem_token: AuthCoupon.data },
							},
							sucFuc,
							elseF
						);
						break;
					case "msgInfo":
						this.updateCount();
						this.$nextTick(function () {
							uni.navigateTo({
								url: "/pagesB/notification/notification",
							});
						});
						break;
					case "history":
						uni.navigateTo({
							url: "/pagesB/historyRecord/historyRecord",
						});
						break;
					default:
						break;
				}
			},
			hideInvite() {
				this.inviteMask = false;
				this.inviteLoading = false;
				uni.setNavigationBarTitle({
					title: "个人中心",
				});
			},
			async init() {
				let proList = [
					store.dispatch("CreateAccount", {}),
					store.dispatch("GetRedPCount", {
						isExpire: 1, //是否过期,0:是,1:否
						isUsed: 0, //是否使用,0:待使用,1:已使用
						isTake: 0, //是否领取,0:是,1:否
						userId: getApp().globalData.UserInfo.userId,
					}),
					store.dispatch("QueryUserInfo", {}),
					store.dispatch("GroupRecmdUserType", {}),
				];
				let thenFuc = res => {
					let resArr = res.map(a => a.data);
					let balance = resArr[0]?.availableAmount ?? 0;
					let couponNum = resArr[1]?.COUNT ?? 0;
					let { wxNickName, avatarUrl, phone } = resArr[2];
					this.userInfo = {
						balance,
						couponNum,
						wxNickName,
						avatarUrl,
						phone,
					};
					this.grpRecmdUserType = resArr[3];
				};
				PromiseAll(proList, thenFuc);
			},
			updateUser() {
				uni.getUserProfile({
					desc: "获取头像",
					success: res => {
						console.log(res);
						let { nickName, avatarUrl } = res.userInfo;
						let prams = {
							wxNickName: nickName,
							avatarUrl: avatarUrl,
						};
						let successFuc = res => {
							onLogin();
						};
						AjaxApi("PostUpdateUser", prams, successFuc);
					},
					fail: err => {
						console.log(err);
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.groupCell--arrow {
		display: none !important;
	}
	/deep/.groupCell--group_chat_icon {
		display: none !important;
	}
	.container {
		min-height: 1800rpx;
		padding-bottom: 100rpx;
		padding-bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
		.notice2 {
			/deep/.u-notice-bar {
				padding: 18rpx 232rpx 18rpx 32rpx !important;
			}
			position: fixed;
			bottom: 100rpx;
			bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
			bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
			left: 0;
			width: 100vw;
			> view {
				position: relative;
				.copy {
					position: absolute;
					// top: 14rpx;
					top: 50%;
					transform: translate(0, -50%);
					right: 62rpx;
					width: 144rpx;
					flex-wrap: nowrap;
					line-height: 48rpx;
					text-align: center;
					font-size: 28rpx;
					color: #ffffff;
					background: #e5cda1;
				}
				.close {
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					right: 12rpx;
					color: #ffffff;
				}
			}
		}
		.notice {
			padding: 0 20rpx;
			width: 100vw;
			min-height: 21.1vw;
			image {
				width: 100%;
			}
			// background-size: contain;
			// background-repeat: no-repeat;
			// margin-bottom: 80rpx;
			// margin-bottom: 444rpx;
		}
		.pb100 {
			padding-bottom: 100rpx;
			padding-bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
			padding-bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
			min-height: 1px;
			width: 100%;
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
				.content {
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
		.mask-slot-share {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			color: #333333;
			width: 608rpx;
			height: 716rpx;
			background: #ffffff00;
			// padding: 0 68rpx;
			button {
				border: 0;
				padding: 0;
				image {
					width: 100%;
				}
				&:after {
					content: none;
				}
			}
			> view {
				margin-top: 50rpx;
				text-align: center;
				image {
					width: 60rpx;
				}
			}
		}
		.head {
			height: 330rpx;
			display: flex;
			justify-content: space-between;
			background: url(https://oss.dianddian.cn/common/mine_bg.png) top no-repeat;
			background-size: 100% auto;
			button {
				padding: 30rpx 56rpx 40rpx 60rpx;
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 100%;
				background-color: #e5cda1;
				color: #ffffff;
				position: relative;
				margin-left: auto;
				margin-right: auto;
				padding-left: 0;
				padding-right: 0;
				box-sizing: border-box;
				text-align: left;
				text-decoration: none;
				line-height: 1;
				-webkit-tap-highlight-color: transparent;
				overflow: hidden;
				&:after {
					content: none;
				}
				.name {
					font-size: 36rpx;
				}
			}
			.name {
				font-size: 48rpx;
				color: #e7ecff;
				font-weight: bold;
				line-height: 66rpx;
				margin-bottom: 6rpx;
			}

			.phone {
				color: #bbcaff;
				font-size: 28rpx;
				line-height: 40rpx;
			}

			.avatar {
				width: 116rpx;
				height: 116rpx;
				background-color: #f1f5ff;
			}
			image {
				border-radius: 50%;
			}
		}
		.vip-bar {
			background-color: #e5cda1;
			margin: 20rpx;
			box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
			border-radius: 8rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			color: #ffffff;
			padding: 0 40rpx;
			.right {
				font-size: 24rpx;
				.tip-right {
					display: inline-block;
					margin-left: 24rpx;
				}
			}
		}
		.recharge {
			background: linear-gradient(to bottom, #fcf0d6 0%, #fcf0d6 30%, #f9fafb 31%, #f9fafb 100%);
			background-clip: border-box;
			width: auto;
			height: 360rpx;
			box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
			opacity: 1;
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			button {
				padding: 32rpx 32rpx 0 32rpx;
				height: 188rpx;
				display: flex;
				width: 100%;
				background: #fff;
				color: #333333;
				position: relative;
				margin-left: auto;
				margin-right: auto;
				box-sizing: border-box;
				text-align: left;
				text-decoration: none;
				line-height: 1;
				-webkit-tap-highlight-color: transparent;
				overflow: hidden;
				&:after {
					content: none;
				}
				view {
					flex: 1;
					font-size: 40rpx;
					font-weight: bold;
					color: #333333;
					&:last-child {
						display: flex;
						justify-content: flex-end;
						image {
							width: 144rpx;
							height: 144rpx;
							background: #f1f5ff;
							border-radius: 50%;
						}
					}
				}
			}
			> view {
				background: #fff;
				&:first-child {
					padding: 32rpx 32rpx 0 32rpx;
					height: 188rpx;
					display: flex;
					view {
						flex: 1;
						font-size: 40rpx;
						font-weight: bold;
						color: #333333;
						&:last-child {
							display: flex;
							justify-content: flex-end;
							image {
								width: 144rpx;
								height: 144rpx;
								background: #f1f5ff;
								border-radius: 50%;
							}
						}
					}
				}
				&:last-child {
					flex: 1;
					display: flex;
					padding: 40rpx 0 30rpx 0;
					font-size: 24rpx;
					color: #343434;
					> view {
						flex: 1;
						image {
							width: 52rpx;
							height: 52rpx;
							&.redbg {
								width: 46rpx;
							}
							background: #fff;
						}
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
					}
				}
			}
		}
		.opeation {
			margin-top: 20rpx;
			.opt-item {
				background-color: #ffffff;
				font-size: 32rpx;
				color: #333333;
				padding: 0 40rpx;
				button {
					color: #333333;
					display: inline !important;
					position: relative;
					display: block;
					margin-left: auto;
					margin-right: auto;
					padding-left: 0;
					padding-right: 0;
					box-sizing: border-box;
					font-size: 32rpx;
					text-align: left;
					text-decoration: none;
					line-height: 32rpx;
					border-radius: 0;
					-webkit-tap-highlight-color: transparent;
					overflow: hidden;
					background-color: #ffffff;
					&:after {
						content: none;
					}
				}
				&:last-of-type .bd {
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					border-bottom: none;
				}

				&:nth-last-of-type(2) .bd {
					border-bottom: none;
				}

				.bd {
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1rpx solid #e2e2e2;
					padding: 32rpx 0;
				}

				.l {
					line-height: 44rpx;
					font-size: 32rpx;
					height: 44rpx;
					color: #e5cda1;
					position: relative;
					text {
						color: #333333;
					}
					.msg {
						background: #ff4d4f;
						border-radius: 50%;
						width: 12rpx;
						height: 12rpx;
						position: absolute;
						top: 0rpx;
						left: 30rpx;
					}
				}

				.tip {
					width: 44rpx;
					height: 44rpx;
					margin-right: 12rpx;
					vertical-align: middle;
				}

				.tip-right {
					color: #d5d5d5;
				}
			}
		}
	}
</style>
