<template>
	<view class="container">
		<!-- <u-navbar :is-back="true" back-icon-color="#FFFFFF" title="餐典币" title-color="#FFFFFF" :background="backgroundImg" :border-bottom="false"></u-navbar> -->
		<view v-if="convertMol" class="guide closeimg">
			<view class="convert-img">
				<view>兑换满减券</view>
				<view>
					本次兑换消耗
					<text>{{ cdbitem.cdbPrice }}</text>
					餐典币
				</view>
				<view
					>拼餐券有效期
					<text>{{ cdbitem.days }}</text>
				</view>
				<view>
					<view class="flex">
						<image src="../../static/img/cdb_base.png" style="width: 90rpx; height: 90rpx"></image>
						{{ cdbitem.cdbPrice }}餐典币
					</view>
					<image src="../../static/img/cdb_row.png" style="width: 68rpx; height: 52rpx"></image>
					<view class="cdbitem">
						<view><text>¥</text>{{ cdbitem.amount }}</view>
						<image src="../../static/img/cbd_line.png"></image>
						<view>{{ cdbitem.usedAmount ? `满${cdbitem.usedAmount}可用` : "无门槛" }}</view>
					</view>
				</view>
				<view @tap="convert">确认兑换</view>
			</view>
			<image class="convert-close" src="../../static/img/newyear-close.png" @tap="convertMol = false"></image>
		</view>
		<view
			class="upper-half"
			:style="{
				marginTop: -navigationHeight + 'px',
				paddingTop: navigationHeight + 'px',
			}"
		>
			<view class="name">
				<view>
					<view class="avatar" @tap="turnTo('goldInfo')">
						<image src="../../static/img/cdb_base.png"></image>
					</view>
					<view class="nick" @tap="turnTo('goldInfo')">
						<view><u-count-to :start-val="0" :end-val="week.cdb" font-size="60" color="#FFFFFF"></u-count-to></view>
						<view>明细></view>
					</view>
					<view class="sign" @tap="doSubscribe" v-if="!mainSwitch"> 开启提醒 </view>
				</view>
			</view>
			<view class="card">
				<view class="explain" @tap="turnTo('signList')">
					<view>连续签到30天，共可获得{{ week.totalAmount }}元红包</view>
					<view>连续{{ week.continuous }}/30天></view>
				</view>
				<view class="date" v-if="week.days.length == 2">
					<block v-for="(it, i) in week.days" :key="i">
						<view :class="[{ recorded: it.signIn }, 'record-all']">
							<view>
								<view>{{ it.signIn ? "已签到" : `第${it.day}天` }}</view>
								<view>{{ it.cdb }}餐典币</view>
								<view v-if="it.amount">{{ it.amount }}元红包</view>
							</view>
							<image
								class="twoimg"
								:src="it.amount ? '../../static/img/cdb_amount2.png' : '../../static/img/cdb_base2.png'"
								mode="aspectFill"
							></image>
						</view>
					</block>
				</view>
				<view class="date" v-else>
					<block v-for="(it, i) in week.days" :key="i">
						<view :class="[{ recorded: it.signIn }, 'record-all']" v-if="i == week.days.length - 1 && it.amount">
							<view>
								<view>{{ it.signIn ? "已签到" : `第${it.day}天` }}</view>
								<view>{{ it.cdb }}餐典币</view>
								<view v-if="it.amount">{{ it.amount }}元红包</view>
							</view>
							<image class="oneimg" :src="it.amount ? '../../static/img/cdb.png' : '../../static/img/cdb_base.png'" mode="aspectFill"></image>
						</view>
						<view :class="[{ recorded: it.signIn }, 'record']" v-else>
							<view>{{ it.signIn ? "已签到" : `第${it.day}天` }}</view>
							<image
								:src="it.amount ? '../../static/img/cdb_amount.png' : '../../static/img/cdb_base.png'"
								:style="{ width: it.amount ? '74rpx' : '60rpx' }"
								mode="aspectFill"
							></image>
							<view>{{ it.cdb }}餐典币</view>
						</view>
					</block>
				</view>
				<view class="btnsign" :style="{ background: week.signIn ? '#ababaf' : '#FE6B00' }" @tap="doSign">{{
					week.signIn ? "今日已签到" : "签到"
				}}</view>
			</view>
		</view>
		<view class="lower-half" :style="{ paddingTop: Boolean(week.days.length == 7) ? '510rpx' : '290rpx' }">
			<view class="window">
				<view class="special" v-if="redPlist.length">热门兑换</view>
				<view class="each" v-for="(it, i) in redPlist" :key="i">
					<view>
						<view><text>¥</text>{{ it.amount }}</view>
						<image src="../../static/img/cbd_line.png"></image>
						<view>{{ it.usedAmount ? `满${it.usedAmount}可用` : "无门槛" }}</view>
					</view>
					<view>{{ it.redPacketName }}</view>
					<view @tap="convertFuc(it)">
						<image src="../../static/img/cdb_coin_mini.png"></image>
						<view>{{ it.cdbPrice }}兑</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { appInit } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			//导航栏和状态栏的高度
			navigationHeight: getApp().globalData.statusBarHeight,
			backgroundImg: {
				background: "linear-gradient(180deg, #52556200 0%, #23263500 100%)",
			},
			userInfo: getApp().globalData.UserInfo,
			AuthCoupon: {},
			week: {
				cdb: 0,
				totalAmount: 0,
				continuous: 0,
				signIn: false,
				days: [],
			},
			redPlist: [],
			mainSwitch: false,
			convertMol: false,
			cdbitem: {
				amount: 30,
				cdbPrice: 10,
				createTime: "2021-01-27 18:45:20",
				delFlag: 0,
				id: 7,
				number: 24,
				redPacketId: 785,
				redPacketName: "兑换专享4",
				reveal: 1,
				sumQuantity: 999999,
				usedAmount: 0,
			},
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
		appInit(this.getWeek);
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
		turnTo(key) {
			switch (key) {
				case "signList":
					uni.navigateTo({
						url: "/pagesD/signList/signList",
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
		getWeek() {
			this.getAuth();
			let proList = [store.dispatch("GetSignWeek", {}), store.dispatch("CdbredPlist", {})];
			let thenFuc = res => {
				let resArr = res.map(a => a.data);
				this.week = { ...this.week, ...(resArr[0] ?? {}) };
				this.redPlist = resArr[1] ?? [];
			};
			PromiseAll(proList, thenFuc);
		},
		async getAuth() {
			this.AuthCoupon = await store.dispatch("AuthCoupon", {});
			if (this.AuthCoupon.code !== 0) {
				uni.showToast({
					title: "获取领取资格验证失败！",
					icon: "none",
					mask: true,
					duration: 2000000,
				});
			}
		},
		doSubscribe() {
			const that = this;
			uni.requestSubscribeMessage({
				tmplIds: ["Y0qWVxXyB_Jon43Kuz0AnHLHwjPeov_QlhH0pIBH8pI"],
				success(res) {
					uni.getSetting({
						withSubscriptions: true,
						success(res) {
							const dyid = "Y0qWVxXyB_Jon43Kuz0AnHLHwjPeov_QlhH0pIBH8pI";
							const mainSwitch = res.subscriptionsSetting.mainSwitch; // 订阅消息总开关
							const itemSettings = res.subscriptionsSetting?.itemSettings; // 每一项开关（类型：对象）
							console.log(mainSwitch, itemSettings);
							if (itemSettings && itemSettings[dyid] == "accept" && mainSwitch) that.mainSwitch = true;
						},
					});
				},
				fail(res) {},
			});
		},
		doSign() {
			if (this.week.signIn) return;
			const that = this;
			uni.requestSubscribeMessage({
				tmplIds: ["Y0qWVxXyB_Jon43Kuz0AnHLHwjPeov_QlhH0pIBH8pI"],
				success(res) {
					that.signFuc();
				},
				fail(res) {
					that.signFuc();
				},
			});
		},
		signFuc() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let successFuc = res => {
				this.getWeek();
			};
			AjaxApi(
				"Cdbsign",
				{
					header: { idem_token: this.AuthCoupon.data },
				},
				successFuc
			);
		},
		convertFuc(it) {
			if (this.week.cdb < it.cdbPrice) {
				uni.showToast({
					title: "餐典币不足,无法兑换!",
					icon: "none",
					duration: 1500,
				});
				return;
			}
			this.cdbitem = it;
			this.convertMol = true;
		},
		convert() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.convertMol = false;
			let successFuc = res => {
				uni.showToast({
					title: "兑换成功!",
					icon: "none",
					duration: 1500,
				});
				this.getWeek();
			};
			AjaxApi("CdbredPconvert", { param: { id: this.cdbitem.id }, header: { idem_token: this.AuthCoupon.data } }, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	background: #f6f6f7;
	min-height: 100vh;
	.guide {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10090;
		opacity: 1;
		color: #fff;
		background: rgba(0, 0, 0, 0.6);
		width: auto;
		height: 100vh;
		&.closeimg {
			/deep/u-icon {
				position: absolute;
				bottom: 10%;
				left: 50%;
				transform: translate(-50%, 0);
				margin: auto;
			}
			.convert-close {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				bottom: 18%;
				left: 50%;
				transform: translate(-50%, 0);
				margin: auto;
			}
			.convert-img {
				position: fixed;
				margin: auto;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				width: 530rpx;
				height: 560rpx;
				background: #ffffff;
				border-radius: 16rpx;
				padding: 40rpx;
				> view {
					text-align: center;
					&:first-of-type {
						font-size: 36rpx;
						font-weight: bold;
						color: #1c1c1d;
						line-height: 50rpx;
					}
					&:nth-of-type(2) {
						font-size: 28rpx;
						color: #ababaf;
						line-height: 40rpx;
						> text {
							color: #ff3b3b;
						}
					}
					&:nth-of-type(3) {
						font-size: 28rpx;
						color: #ababaf;
						line-height: 40rpx;
						> text {
							color: #ff3b3b;
						}
					}
					&:nth-of-type(4) {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 40rpx;
						.flex {
							font-size: 28rpx;
							color: #1c1c1d;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}
						.cdbitem {
							width: 130rpx;
							height: auto;
							background: #fff4ed;
							border-radius: 10rpx;
							color: #fe6b00;
							display: flex;
							flex-direction: column;
							image {
								width: 130rpx;
								height: 16rpx;
							}
							> view {
								&:first-of-type {
									width: 130rpx;
									height: 98rpx;
									line-height: 98rpx;
									text-align: center;
									font-size: 48rpx;
									font-weight: bold;
									text {
										font-size: 24rpx;
									}
								}
								&:nth-of-type(2) {
									width: 130rpx;
									height: 46rpx;
									line-height: 46rpx;
									text-align: center;
									font-size: 24rpx;
								}
							}
						}
					}
					&:nth-of-type(5) {
						width: 458rpx;
						height: 88rpx;
						background: #fe6b00;
						border-radius: 50rpx;
						text-align: center;
						font-size: 32rpx;
						font-weight: bold;
						color: #ffffff;
						line-height: 88rpx;
						margin-top: 74rpx;
					}
				}
			}
		}
	}
	.upper-half {
		width: auto;
		height: 460rpx;
		background: #30343a;
		color: #ffffff;
		position: relative;
		.name {
			padding-left: 30rpx;
			padding-top: 30rpx;
			> view {
				display: flex;
			}
			.avatar {
				image {
					width: 70rpx;
					height: 70rpx;
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
				display: flex;
				align-items: center;
				margin-left: 10rpx;
				max-width: 50%;
				> view {
					&:first-of-type {
						line-height: 66rpx;
						height: 100%;
					}
					&:nth-of-type(2) {
						margin-left: 10rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.6);
						line-height: 34rpx;
					}
				}
			}
			.sign {
				margin-left: auto;
				text-align: center;
				margin-right: 24rpx;
				line-height: 70rpx;
				width: 148rpx;
				height: 70rpx;
				border-radius: 16rpx;
				border: 2rpx solid rgba(255, 255, 255, 0.2);
			}
		}
		.card {
			width: 702rpx;
			min-height: 150rpx;
			background: #ffffff;
			border-radius: 16rpx;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, 298rpx);
			margin-left: auto;
			display: flex;
			flex-direction: column;
			padding-left: 20rpx;
			.explain {
				padding: 30rpx 0 15rpx 0;
				display: flex;
				justify-content: space-between;
				line-height: 40rpx;
				font-size: 28rpx;
				> view {
					&:first-of-type {
						font-weight: 500;
						color: #1c1c1d;
					}
					&:nth-of-type(2) {
						font-weight: 400;
						color: #ababaf;
						padding-right: 20rpx;
					}
				}
			}
			.date {
				display: flex;
				flex-wrap: wrap;
				.record {
					width: 150rpx;
					height: 200rpx;
					background: #f6f6f7;
					border-radius: 16rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-top: 28rpx;
					margin-right: 20rpx;
					margin-top: 20rpx;
					image {
						width: 60rpx;
						height: 60rpx;
						margin: 14rpx 0 12rpx 0;
					}
					> view {
						&:first-of-type {
							font-size: 24rpx;
							font-weight: bold;
							color: #1c1c1d;
							line-height: 40rpx;
						}
						&:nth-of-type(2) {
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
							line-height: 34rpx;
						}
					}
					&.recorded {
						background: #fff4ed;

						> view {
							color: #fe6b00;
						}
					}
				}
				.record-all {
					width: 320rpx;
					height: 200rpx;
					background: #f6f6f7;
					border-radius: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-right: 20rpx;
					margin-top: 20rpx;
					.oneimg {
						width: 160rpx;
						height: 146rpx;
						margin: 40rpx 26rpx 17rpx auto;
					}
					.twoimg {
						width: 145rpx;
						height: 154rpx;
						margin-top: auto;
					}
					> view {
						padding-top: 28rpx;
						height: 100%;
						width: 150rpx;
						text-align: center;
						> view {
							&:first-of-type {
								font-size: 24rpx;
								font-weight: bold;
								color: #1c1c1d;
								line-height: 40rpx;
							}
							&:nth-of-type(2) {
								margin-top: 20rpx;
							}
							&:nth-of-type(2),
							&:nth-of-type(3) {
								font-size: 24rpx;
								font-weight: 400;
								color: #ababaf;
								line-height: 34rpx;
							}
						}
					}
					&.recorded {
						background: #fff4ed;
						> view {
							> view {
								color: #fe6b00;
							}
						}
					}
				}
				margin-bottom: 80rpx;
			}
			.btnsign {
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translate(-50%, 50%);
				width: 570rpx;
				height: 100rpx;
				background: #ababaf;
				border-radius: 50rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
				color: #ffffff;
			}
		}
	}
	.lower-half {
		background: #f6f6f7;
		padding: 400rpx 24rpx 0 24rpx;
		.window {
			border-radius: 16rpx;
			padding: 0 20rpx;
			background: #ffffff;
			.special {
				color: #1e1f21;
				font-size: 36rpx;
				font-weight: 500;
				color: #1e1f21;
				line-height: 50rpx;
				padding: 30rpx 0;
			}
			.each {
				line-height: 160rpx;
				padding-bottom: 30rpx;
				display: flex;
				align-items: center;
				> view {
					&:first-of-type {
						width: 130rpx;
						height: auto;
						background: #fff4ed;
						border-radius: 10rpx;
						color: #fe6b00;
						display: flex;
						flex-direction: column;
						image {
							width: 130rpx;
							height: 16rpx;
						}
						> view {
							&:first-of-type {
								width: 130rpx;
								height: 98rpx;
								line-height: 98rpx;
								text-align: center;
								font-size: 48rpx;
								font-weight: bold;
								text {
									font-size: 24rpx;
								}
							}
							&:nth-of-type(2) {
								width: 130rpx;
								height: 46rpx;
								line-height: 46rpx;
								text-align: center;
								font-size: 24rpx;
							}
						}
					}
					&:nth-of-type(2) {
						margin-left: 20rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: #1e1f21;
					}
					&:nth-of-type(3) {
						margin-left: auto;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 170rpx;
						height: 68rpx;
						line-height: 68rpx;
						border-radius: 36rpx;
						border: 2rpx solid rgba(0, 0, 0, 0.1);
						font-size: 28rpx;
						font-weight: 400;
						color: #1c1c1d;
						text-align: center;
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 6rpx;
						}
					}
				}
			}
		}
	}
}
</style>
