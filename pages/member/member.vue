<template>
	<view class="container">
		<!-- <image src="https://oss.dianddian.cn/v2/vip_pic.png" mode="aspectFill"></image> -->
		<tab-bar pagePath="pages/member/member"></tab-bar>
		<u-navbar :is-back="false" title="会员中心" title-color="#FFFFFF" :background="backgroundImg" :border-bottom="false"></u-navbar>
		<view
			class="upper-half"
			:style="{
				marginTop: -navigationHeight + 'px',
				paddingTop: navigationHeight + 'px',
			}"
		>
			<view class="name">
				<view>
					<view class="avatar" v-if="userInfo.wxNickName">
						<image :src="userInfo.avatarUrl ? userInfo.avatarUrl : 'https://oss.dianddian.cn/v2/default_avatar.png'" mode="aspectFill"></image>
					</view>
					<view class="avatar" v-else @tap="updateUser">
						<image src="https://oss.dianddian.cn/v2/default_avatar.png" mode="aspectFill"></image>
					</view>
					<view class="nick">
						<view class="u-line-1"
							>{{ userInfo.wxNickName || "点击头像获取用户信息" }}
							<image :src="`../../static/img/VIP${userInfo.levelId}.png`" mode="aspectFill" v-if="userInfo.wxNickName"></image>
						</view>
						<view @tap="turnTo('memberLevel')">经验值{{ userInfo.experienceValue }}></view>
					</view>
					<view class="sign" @tap="turnTo('canDianCoin')">
						<image src="../../static/img/cdb_redP.png" mode="aspectFill"></image>
						<view>
							<view>签到领取</view>
							<view>大额红包</view>
						</view>
					</view>
				</view>
				<view class="coin">
					<view @tap="turnTo('couponList')">
						<view class="figure">{{ userInfo.couponNum }}</view>
						<view class="entrance">我的红包 <image src="../../static/img/cdb_play.png"></image></view>
					</view>
					<view @tap="turnTo('goldInfo')">
						<view class="figure">{{ userInfo.cdb }}</view>
						<view class="entrance">我的餐典币 <image src="../../static/img/cdb_play.png"></image></view>
					</view>
				</view>
			</view>
			<view class="card" @tap="turnTo('membershipCard')">
				<view>
					<view>
						拼餐·尊享卡
						<text v-if="cardInfo.isBuy">{{ cardInfo.validateTime.slice(0, 10).replace(/-/g, ".") }}到期</text>
					</view>
					<view v-if="cardInfo.marketMsg">{{ cardInfo.marketMsg }}</view>
				</view>
				<view>{{ cardInfo.isBuy ? "查看详情" : "立即开通" }}</view>
			</view>
		</view>
		<view class="lower-half">
			<view class="special" v-if="goodsLsit.length">会员专享</view>
			<view class="window">
				<view class="each" v-for="(it, i) in goodsLsit" :key="i">
					<block v-if="it.goods.length">
						<view class="sname">
							<view>{{ it.storeName }}</view>
							<view>{{ it.distanceStr }}</view>
						</view>
						<view class="wares">
							<view
								v-for="(its, inx) in it.goods"
								:key="inx"
								:style="{
									marginRight: Boolean((inx + 1) % 3 == 0) ? '0' : Boolean(inx + 1 == it.goods.length) ? '122px' : 'auto',
								}"
								@tap="jumpGoodDetails(its, i)"
							>
								<text class="discount">{{ its.discount * 10 }}折</text>
								<image
									:src="`${its.covePic ? its.covePic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`"
									mode="aspectFill"
								></image>
								<view class="u-line-1">{{ its.goodsName }}</view>
								<view>
									<text>￥</text>{{ its.wmDiscountPrice }}<text>¥{{ its.wmOriginalPrice }}</text>
								</view>
							</view>
						</view></block
					>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType, onLogin } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			shopImg: getApp().globalData.shopImg,
			//导航栏和状态栏的高度
			navigationHeight: getApp().globalData.statusBarHeight,
			backgroundImg: {
				background: "linear-gradient(180deg, #52556200 0%, #23263500 100%)",
			},
			userInfo: {
				cdb: 0,
				experienceValue: 0,
				levelId: 1,
				levelName: "白银会员",
				wxNickName: "",
				phone: "***********",
				avatarUrl: "https://oss.dianddian.cn/v2/default_avatar.png",
				couponNum: 0,
				avatarUrl: null,
			},
			goodsLsit: [],
			chosen: {},
			cardInfo: {},
		};
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	async onShow() {
		if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
			uni.reLaunch({
				url: "/pagesB/login/login",
			});
			return;
		}
		// this.userInfo = getApp().globalData.UserInfo;
		this.init();
	},
	onLoad() {
		this.navigationHeight =
			uni.getSystemInfoSync().platform == "ios" ? 44 + uni.getSystemInfoSync().statusBarHeight : 48 + uni.getSystemInfoSync().statusBarHeight;
	},
	onPageScroll(e) {
		if (e.scrollTop < 100) {
			this.backgroundImg.background = "linear-gradient(180deg, #52556200 0%, #23263500 100%)";
		} else {
			this.backgroundImg.background = "linear-gradient(180deg, #525562 0%, #4a4d5a 100%)";
		}
	},
	methods: {
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
					let successFuc = async res => {
						let user = await store.dispatch("QueryUserInfo", {});
						getApp().globalData.UserInfo = user.data;
						onLogin();
					};
					AjaxApi("PostUpdateUser", prams, successFuc);
				},
				fail: err => {
					console.log(err);
				},
			});
		},
		turnTo(key) {
			switch (key) {
				case "memberLevel":
					uni.navigateTo({
						url: `/pagesD/memberLevel/memberLevel?levelValue=${this.userInfo.experienceValue}&levelName=${this.userInfo.levelName}&levelId=${this.userInfo.levelId}`,
					});
					break;
				case "couponList":
					uni.navigateTo({
						url: "/pagesC/couponList/couponList",
					});
					break;
				case "membershipCard":
					uni.navigateTo({
						url: "/pagesD/membershipCard/membershipCard",
					});
					break;
				case "canDianCoin":
					uni.navigateTo({
						url: "/pagesD/canDianCoin/canDianCoin",
					});
					break;
				case "goldInfo":
					uni.navigateTo({
						url: "/pagesD/goldInfo/goldInfo",
					});
					break;

				default:
					break;
			}
		},
		jumpGoodDetails(i, inx) {
			this.chosen = i;
			uni.navigateTo({
				url: `/pagesPing/foodDetails/foodDetails?storeId=${this.goodsLsit[inx].storeId}&id=${i.goodsId}&storeStatus=1`,
			});
		},
		init() {
			let proList = [
				store.dispatch("GetRedPCount", {
					isExpire: 1, //是否过期,0:是,1:否
					isUsed: 0, //是否使用,0:待使用,1:已使用
					isTake: 0, //是否领取,0:是,1:否
					userId: getApp().globalData.UserInfo.userId,
				}),
				store.dispatch("QueryUserInfo", {}),
				store.dispatch("GetMemberLevel", {}),
				store.dispatch("GetMemberGoods", {
					location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
				}),
				store.dispatch("LevelCardStatus", {}),
			];
			let thenFuc = res => {
				let resArr = res.map(a => a.data);
				let couponNum = resArr[0]?.COUNT ?? 0;
				let { wxNickName, avatarUrl, phone } = resArr[1];
				let { levelId, cdbUser, experienceValue, levelName } = resArr[2];
				this.userInfo = {
					...this.userInfo,
					couponNum,
					wxNickName,
					avatarUrl,
					phone,
					levelId,
					experienceValue,
					levelName,
					cdb: cdbUser.cdb,
				};
				console.log("🚀 ~ file: member.vue ~ line 242 ~ init ~ this.userInfo", this.userInfo);

				this.goodsLsit = resArr[3];
				this.cardInfo = resArr[4];
			};
			PromiseAll(proList, thenFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	padding-bottom: 100rpx;
	padding-bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
	background: #f6f6f7;
	min-height: 100vh;
	image {
		height: 600rpx;
		width: 600rpx;
		margin: 0 auto;
	}
	.upper-half {
		width: auto;
		height: 576rpx;
		background: linear-gradient(180deg, #525562 0%, #232635 100%);
		color: #ffffff;
		position: relative;
		.name {
			padding-left: 30rpx;
			margin-top: 30rpx;
			> view {
				display: flex;
				align-items: center;
			}
			.avatar {
				image {
					width: 100rpx;
					height: 100rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.1);
					border-radius: 50%;
				}
			}
			button {
				display: contents;
				width: 108rpx;
				background-color: transparent;
				color: #ffffff;
				font-size: 24rpx;
				border: 0;
				image {
					background: #ffffff;
					width: 100rpx;
					height: 100rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.1);
					border-radius: 50%;
				}
			}
			.nick {
				margin-left: 20rpx;
				max-width: 50%;
				> view {
					&:first-of-type {
						height: 50rpx;
						font-size: 36rpx;
						font-weight: 500;
						line-height: 50rpx;
						image {
							width: 84rpx;
							height: 36rpx;
							vertical-align: middle;
							margin-left: 10rpx;
						}
					}
					&:nth-of-type(2) {
						margin-top: 16rpx;
						height: 34rpx;
						font-size: 24rpx;
						line-height: 34rpx;
					}
				}
			}
			.sign {
				margin-left: auto;
				display: flex;
				align-items: center;
				padding-right: 30rpx;
				min-width: 210rpx;
				height: 84rpx;
				background: rgba(0, 0, 0, 0.1);
				border-radius: 200rpx 0rpx 0rpx 200rpx;
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}
				> view > view {
					font-size: 24rpx;
					line-height: 34rpx;
					font-weight: 400;
					&:nth-of-type(2) {
						color: #ff3b3b;
					}
				}
			}
			.coin {
				margin-top: 50rpx;
				display: flex;
				> view {
					width: 50%;
					image {
						width: 16rpx;
						height: 18rpx;
						margin-left: 10rpx;
					}
				}
				.figure {
					font-size: 48rpx;
					font-weight: bold;
					line-height: 56rpx;
					font-family: DINAlternate-Bold, DINAlternate;
				}
				.entrance {
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(255, 255, 255, 0.6);
					line-height: 40rpx;
				}
			}
		}
		.card {
			width: 702rpx;
			height: 160rpx;
			background: url("https://oss.dianddian.cn/v2/vip/cdb_card_bg.png") no-repeat, linear-gradient(180deg, #ffe0c3 0%, #f5b57e 100%);
			background-size: 100%;
			border-radius: 16rpx;
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translate(-50%, 50%);
			margin-left: auto;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			> view {
				&:first-of-type {
					> view {
						color: #2f3241;
						&:first-of-type {
							font-size: 36rpx;
							font-weight: 500;
							line-height: 44rpx;
							text {
								margin-left: 10rpx;
								font-size: 20rpx;
								line-height: 28rpx;
							}
						}
						&:nth-of-type(2) {
							font-size: 24rpx;
							font-weight: 400;
							line-height: 34rpx;
							margin-top: 8rpx;
						}
					}
				}
				&:nth-of-type(2) {
					margin-left: auto;
					width: 168rpx;
					height: 68rpx;
					background: #2f3241;
					border-radius: 36rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #ffd2ac;
					line-height: 68rpx;
					text-align: center;
				}
			}
		}
	}
	.lower-half {
		background: #f6f6f7;
		padding: 120rpx 24rpx 0 24rpx;
		.special {
			color: #1e1f21;
			font-size: 36rpx;
			font-weight: 500;
			color: #1e1f21;
			line-height: 50rpx;
			margin-bottom: 20rpx;
		}
		.window {
			.each {
				background: #ffffff;
				padding: 0 20rpx;
				margin-bottom: 20rpx;
				border-radius: 16rpx;
				.sname {
					height: 100rpx;
					line-height: 100rpx;
					display: flex;
					color: #1c1c1d;
					font-size: 24rpx;
					font-weight: 500;
					> view {
						&:nth-of-type(2) {
							margin-left: auto;
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
						}
					}
				}
				.wares {
					display: flex;
					flex-wrap: wrap;
					> view {
						flex: 0;
						display: flex;
						flex-direction: column;
						margin-bottom: 30rpx;
						width: 214rpx;
						position: relative;
						.discount {
							position: absolute;
							left: 0;
							top: 0;
							display: block;
							width: 48rpx;
							height: 24rpx;
							line-height: 24rpx;
							font-size: 18rpx;
							text-align: center;
							background: #ffd5b0;
							color: #a5662f;
							border-radius: 10rpx 0rpx 10rpx 0rpx;
						}
						> view {
							&:first-of-type {
								font-size: 24rpx;
								font-weight: 400;
								color: #1c1c1d;
								line-height: 40rpx;
							}
							&:nth-of-type(2) {
								font-size: 32rpx;
								font-weight: bold;
								color: #1c1c1d;
								line-height: 44rpx;
								> text {
									font-size: 24rpx;
									&:nth-of-type(2) {
										font-size: 24rpx;
										color: #ababaf;
										text-decoration: line-through;
										margin-left: 8rpx;
										font-weight: 400;
									}
								}
							}
						}
						image {
							width: 214rpx;
							height: 214rpx;
							background: #f6f6f7;
							border-radius: 10rpx;
						}
					}
				}
			}
		}
	}
}
</style>
