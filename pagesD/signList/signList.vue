<template>
	<view class="container">
		<view class="head">
			<image src="../../static/img/cdb_base.png"></image>
			<view><u-count-to :start-val="0" :end-val="cdbdata.cdb || 0" font-size="60" color="#FFFFFF" :bold="true"></u-count-to></view>
		</view>
		<view class="calendar">
			<block v-for="(it, i) in cdbdata.days" :key="i">
				<view :class="[{ dated: it.signIn }, 'date']">
					<view>
						<image src="../../static/img/cdb_get.png" v-if="it.signIn"></image>
						<view v-else>{{ it.day }}天</view>
					</view>
					<view>
						<image src="../../static/img/cdb_coin_mini.png" :style="{ marginLeft: Boolean(it.cdb > 99) ? '0' : '10rpx' }"></image>
						<view class="u-line-1">
							{{ it.cdb }}
						</view>
					</view>
					<view class="amount" v-if="it.amount">¥{{ it.amount }}红包</view>
				</view>
			</block>
			<view class="btnsign" :style="{ background: cdbdata.signIn ? '#ababaf' : '#FE6B00' }" @tap="doSign">{{
				cdbdata.signIn ? "今日已签到" : "签到"
			}}</view>
		</view>
		<view style="background:#fff">
			<image src="https://oss.dianddian.cn/v2/vip/sign_rule.png" style="width: 100%" mode="widthFix"></image>
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
			cdbdata: {},
			AuthCoupon: {},
		};
	},
	onShareAppMessage: function (res) {
		if (res.from === "button") {
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},

	async onShow() {
		this.getAuth();
		this.init();
	},
	onLoad() {},
	methods: {
		init() {
			let successFuc = res => {
				this.cdbdata = res.data;
			};
			AjaxApi("Cdbmonth", {}, successFuc);
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
		doSign() {
			if (this.cdbdata.signIn) return;
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
				this.init();
			};
			AjaxApi(
				"Cdbsign",
				{
					header: { idem_token: this.AuthCoupon.data },
				},
				successFuc
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	background: #30343a;
	.head {
		height: 310rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		image {
			width: 130rpx;
			height: 130rpx;
			margin: 40rpx 0 10rpx 0;
		}
	}
	.calendar {
		width: auto;
		min-height: 500rpx;
		background: #ffffff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx 0 30rpx 24rpx;
		display: flex;
		flex-wrap: wrap;
		.date {
			width: 80rpx;
			height: 106rpx;
			background: #f6f6f7;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-right: 24rpx;
			margin-bottom: 30rpx;
			position: relative;
			> view {
				text-align: center;
				&:first-of-type {
					margin-bottom: 14rpx;
					height: 34rpx;
					image {
						width: 28rpx;
						height: 28rpx;
					}
					> view {
						font-size: 24rpx;
						font-weight: bold;
						color: #1c1c1d;
						line-height: 34rpx;
					}
				}
				&:nth-of-type(2) {
					display: flex;
					width: 100%;
					align-items: center;
					justify-content: center;
					image {
						width: 30rpx;
						height: 30rpx;
						box-sizing: border-box;
					}
					font-size: 24rpx;
					color: #ababaf;
					line-height: 30rpx;
					> view {
						flex: 1;
						text-align: center;
					}
				}
			}
			&.dated {
				background: #fff4ed;
				> view {
					&:nth-of-type(2) {
						color: #fe6b00;
					}
				}
			}
			.amount {
				width: 88rpx;
				height: 30rpx;
				line-height: 30rpx;
				background: #ff3b3b;
				border-radius: 16rpx;
				border: 2rpx solid #ffffff;
				font-size: 18rpx;
				font-weight: 500;
				color: #ffffff;
				position: absolute;
				left: 50%;
				top: 0;
				transform: translate(-50%, -50%);
			}
		}

		.btnsign {
			width: 702rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			background: #fe6b00;
			border-radius: 50rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #ffffff;
		}
	}
}
</style>
