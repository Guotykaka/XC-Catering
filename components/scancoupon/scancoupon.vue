<template>
	<u-mask :show="scanMask" z-index="10090" :duration="0" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" @click="hideScan()" :zoom="false">
		<view class="first-slot slotbox">
			<image class="pop-banner" src="https://oss.dianddian.cn/v2/activity/scan-coupon.png" mode="widthFix"></image>
			<view v-if="scanType == 0" class="received u-flex u-col-center u-row-center">
				<text class="u-font-30">{{mark}}</text>
			</view>
			<view :class="[{ long: list.length == 1 }, 'pop-con']" v-if="scanType == 1">
				<scroll-view scroll-y="true" class="scroll-Y" :style="{ height: list.length == 1 ? '200rpx' : '400rpx' }">
					<view class="coupons" v-for="(item, index) in list" :key="index">
						<view>
							<view>
								<view class="u-font-24">¥</view>
								<view style="font-size: 48rpx; height: 30px">{{ item.amount }}</view>
							</view>
							<view class="u-m-t-18">{{ item.usedAmount == 0 ? "无门槛" : "满" + item.usedAmount + "元可用" }}</view>
						</view>
						<view>
							<view class="u-line-2 u-font-32"> {{ item.redPacketName }} </view>
							<view class="u-font-24 u-m-t-10 u-line-2">
								{{ item.validateTime }}
							</view>
						</view>
						<view class="u-font-24" @tap="hideScan()"> 去使用 </view>
					</view>
				</scroll-view>
			</view>
			<image class="close" src="../../static/img/newyear-close.png" @tap="hideScan()"></image>
		</view>
	</u-mask>
</template>

<script>
import store from "@/store";
import { getObjType } from "@/utils";
import { Decimal } from "decimal.js";
export default {
	name: "popUp",
	props: {
		// 通过双向绑定控制组件的弹出与收起
		list: {
			type: Array,
			default: [],
		},
		mark: {
			type: String,
			default: [],
		},
		scanType: {
			type: Number, //0:天天领券;1:首单福利;2:拼餐日卡体验卡;3:拼餐月卡;4:下单奖励;9:新人券
			default: 0,
		},
		scanMask: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	watch: {
	},
	methods: {
		hideScan() {
			const that = this;
			that.$emit("inVite");
		},
		tapCoupon(saleType) {
			uni.showLoading({
				title: "跳转中",
				mask: true,
			});
			this.$emit("inVite");
			/**
			 * 	0: "堂食",
				1: "外卖",
				2: "通用",
				3: "拼餐",
			 *  */
			switch (saleType) {
				case 3:
					uni.reLaunch({
						url: `/pages/spellOrder/spellOrder`,
					});
					break;
				default:
					uni.reLaunch({
						url: `/pages/index/index`,
					});
					break;
			}
		},
	},
};
</script>
<style lang="scss">
.pop-banner {
	width: 100%;
	vertical-align: bottom;
}
.close {
	width: 60rpx;
	height: 60rpx;
	margin: 0 auto;
	margin-top: 50rpx;
}
.slotbox {
	z-index: 10090;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.everyday-slot {
	padding: 0 54rpx;
	.pop-con {
		margin-top: -40rpx;
		height: 408rpx;
		&.long {
			height: 208rpx;
		}
		background: #ff4545;
		border-radius: 0 0 20rpx 20rpx;
		padding: 0 24rpx;
		.coupons {
			height: 180rpx;
			width: auto;
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			overflow: hidden;
			&:last-of-type {
				margin-bottom: 24rpx;
			}
			&:not(:first-of-type) {
				margin-top: 24rpx;
			}
			> view {
				&:first-of-type {
					width: 168rpx;
					height: 100%;
					background: #fff1f1;
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #ff3b3b;
					> view {
						width: 100%;
						text-align: center;
						&:first-of-type {
							font-weight: bold;
							flex: 1;
							display: flex;
							align-items: flex-end;
							justify-content: center;
						}
						&:nth-of-type(2) {
							flex: 1;
							font-size: 24rpx;
						}
					}
				}
				&:nth-of-type(2) {
					width: 294rpx;
					display: flex;
					padding: 46rpx 0 0 22rpx;
					flex-direction: column;
					> view {
						&:first-of-type {
							color: #1c1c1d;
							font-weight: bold;
						}
						&:nth-of-type(2) {
							color: #ababaf;
						}
					}
				}
				&:nth-of-type(3) {
					width: 112rpx;
					height: 56rpx;
					background: #ff3b3b;
					border-radius: 32px;
					line-height: 56rpx;
					text-align: center;
					font-weight: bold;
					color: #ffffff;
					margin: auto 0;
				}
			}
		}
	}
}
.first-slot {
	padding: 0 64rpx;
	.pop-con {
		height: 430rpx;
		background: #e24648;
		border-left: 6rpx solid #ffdc8a;
		border-bottom: 6rpx solid #ffdc8a;
		border-right: 6rpx solid #ffdc8a;
		border-radius: 0 0 20rpx 20rpx;
		padding: 10rpx 24rpx 0 24rpx;
		&.long {
			height: 220rpx;
		}
		.coupons {
			height: 180rpx;
			width: auto;
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			overflow: hidden;
			&:last-of-type {
				margin-bottom: 24rpx;
			}
			&:not(:first-of-type) {
				margin-top: 24rpx;
			}
			> view {
				&:first-of-type {
					width: 168rpx;
					height: 100%;
					background: #fff1f1;
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #ff3b3b;
					> view {
						width: 100%;
						text-align: center;
						&:first-of-type {
							font-weight: bold;
							flex: 1;
							display: flex;
							align-items: flex-end;
							justify-content: center;
						}
						&:nth-of-type(2) {
							flex: 1;
							font-size: 24rpx;
						}
					}
				}
				&:nth-of-type(2) {
					width: 262rpx;
					display: flex;
					padding: 0 0 0 22rpx;
					justify-content: center;
					flex-direction: column;
					> view {
						&:first-of-type {
							color: #1c1c1d;
							font-weight: bold;
						}
						&:nth-of-type(2) {
							color: #ababaf;
						}
					}
				}
				&:nth-of-type(3) {
					width: 112rpx;
					height: 56rpx;
					background: #ff3b3b;
					border-radius: 32px;
					line-height: 56rpx;
					text-align: center;
					font-weight: bold;
					color: #ffffff;
					margin: auto 0;
				}
			}
		}
	}
	.received {
		height: 430rpx;
		background: #e24648;
		border-left: 6rpx solid #ffdc8a;
		border-bottom: 6rpx solid #ffdc8a;
		border-right: 6rpx solid #ffdc8a;
		border-radius: 0 0 20rpx 20rpx;
		color: #ffffff;
		text{
			margin: -60rpx 0 0 -20rpx;
		}
	}
}
</style>
