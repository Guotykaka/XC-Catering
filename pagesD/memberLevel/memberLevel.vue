<template>
	<view class="wrapper">
		<u-navbar
			:is-back="true"
			back-icon-color="#FFFFFF"
			title="会员等级"
			title-color="#FFFFFF"
			:background="backgroundImg"
			:border-bottom="false"
		></u-navbar>
		<view
			class="member"
			:style="{
				marginTop: -navigationHeight + 'px',
				paddingTop: navigationHeight + 'px',
			}"
		>
			<view class="info-top">
				<image :src="`https://oss.dianddian.cn/v2/vip/medal_${initData.levelId}.png`" mode="aspectFill"></image>
				<view class="level-name">{{ initData.levelName }}</view>
				<view class="level-num"
					>当前经验值：<u-count-to :start-val="0" :end-val="initData.levelValue" font-size="24" color="color: rgba(255, 255, 255, 0.6);"></u-count-to
				></view>
			</view>
			<view class="info-bot">
				<view class="level-bar" v-if="levels.length">
					<block v-for="(it, i) in levels" :key="i">
						<view class="image-box">
							<image :src="`https://oss.dianddian.cn/v2/vip/medal_${it.level}.png`" mode="aspectFill"></image>
						</view>
						<view v-if="i + 1 !== levels.length" class="bar-box">
							<view
								class="bar-box1"
								:style="{
									width: canTrans ? getWidth(it) + 'rpx' : 0,
								}"
							></view>
						</view>
					</block>
				</view>
				<view class="bar-info" v-if="levels.length">
					<block v-for="(it, i) in levels" :key="i">
						<view>
							<view>{{ it.name }}</view>
							<view>{{
								it.leftInterval == 0
									? `≦${it.rightInterval}`
									: i + 1 == levels.length
									? `≧${it.leftInterval}`
									: `${it.leftInterval}～${it.rightInterval}`
							}}</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="rule">
			<view class="rule-con">
				<!-- <view class="rule-title">等级规则</view> -->
				<view class="rule-info">
					<image src="https://oss.dianddian.cn/v2/vip/vip_level_rule.png" style="width:100%" mode='widthFix'></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType, onLogin } from "@/utils";
import store from "@/store";
import { Decimal } from "decimal.js";
export default {
	data() {
		return {
			navigationHeight: getApp().globalData.statusBarHeight,
			backgroundImg: {
				background: "linear-gradient(180deg, transparent, #23263500 100%)",
			},
			canTrans: false,
			canTrans2: false,
			canTrans3: false,
			canTrans4: false,
			initData: {
				levelId: 1,
				levelValue: 0,
				levelName: "",
			},
			levels: [],
		};
	},
	onLoad(options) {
		this.initData = options;
		this.navigationHeight =
			uni.getSystemInfoSync().platform == "ios" ? 44 + uni.getSystemInfoSync().statusBarHeight : 48 + uni.getSystemInfoSync().statusBarHeight;
	},
	onShow() {
		const that = this;
		// setTimeout(() => {
		// 	that.canTrans = true;
		// }, 100);
		// setTimeout(() => {
		// 	that.canTrans2 = true;
		// }, 1100);
		// setTimeout(() => {
		// 	that.canTrans3 = true;
		// }, 2100);
		// setTimeout(() => {
		// 	that.canTrans4 = true;
		// }, 3100);
		this.getLevel();
	},
	methods: {
		getLevel() {
			const that = this;
			let successFuc = res => {
				this.levels = res.data;
				setTimeout(() => {
					that.canTrans = true;
				}, 1000);
				this.$forceUpdate();
			};
			AjaxApi(
				"GetMemberSettings",
				{
					status: 1,
				},
				successFuc
			);
		},
		getWidth(it) {
			if (this.initData.levelValue < it.leftInterval) return 0;
			let level = new Decimal(it.rightInterval).sub(new Decimal(it.leftInterval));
			let nowlevel = new Decimal(this.initData.levelValue).sub(new Decimal(it.leftInterval));
			return nowlevel * 1 > level * 1 ? 116 : nowlevel.div(new Decimal(level)).mul(116);
		},
	},
};
</script>

<style lang="scss">
@keyframes memScale {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.4);
	}
	100% {
		transform: scale(1);
	}
}
.wrapper {
	.member {
		width: 100%;
		height: 760rpx;
		background: linear-gradient(180deg, #525562 0%, #232635 100%);
		padding: 30rpx 24rpx 0rpx 24rpx;
		.info-top {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 30rpx;
			margin-bottom: 50rpx;
			image {
				width: 190rpx;
				height: 190rpx;
				margin-bottom: 18rpx;
			}
			.level-name {
				font-size: 32rpx;
				font-weight: 500;
				color: #ffffff;
				line-height: 44rpx;
			}
			.level-num {
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.6);
				line-height: 34rpx;
			}
		}
		.info-bot {
			width: 100%;
			.level-bar {
				padding: 0 26rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.image-box {
					width: 60rpx;
					height: 60rpx;
					image {
						width: 100%;
						height: 100%;
						&.trans {
							animation: memScale 1s linear 1 normal forwards;
						}
					}
				}
				.bar-box {
					width: 116rpx;
					height: 4rpx;
					background: rgba(255, 255, 255, 0.15);
					border-radius: 4rpx;
					position: relative;
					.bar-box1 {
						width: 0;
						height: 4rpx;
						background: #ffffff;
						border-radius: 4rpx;
						position: absolute;
						top: 0;
						left: 0;
						transition: width 0.5s ease-in-out;
					}
				}
			}
			.bar-info {
				width: 100%;
				display: flex;
				justify-content: space-between;
				view {
					display: flex;
					flex-direction: column;
					align-items: center;
					> view {
						&:first-child {
							font-size: 28rpx;
							font-weight: 500;
							color: #ffffff;
							line-height: 40rpx;
						}
						&:last-child {
							font-size: 24rpx;
							font-weight: 400;
							color: rgba(255, 255, 255, 0.6);
							line-height: 34rpx;
						}
					}
				}
			}
		}
	}
	.rule {
		position: relative;
		.rule-con {
			background: #fff;
			width: 100%;
			box-sizing: border-box;
			position: absolute;
			top: -74rpx;
			left: 0rpx;
			border-radius: 20rpx 20rpx 0px 0px;
			padding: 30rpx 24rpx;
			.rule-title {
				font-size: 32rpx;
				font-weight: 500;
				color: #1e1f21;
				line-height: 44rpx;
				margin-bottom: 20rpx;
			}
			.rule-info {
				width: 100%;
				min-height: 900rpx;
			}
		}
	}
}
</style>
