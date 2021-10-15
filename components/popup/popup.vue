<template>
	<u-mask :show="popMask" z-index="10090" :duration="0" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" @click="hidePop()" :zoom="false">
		<view class="everyday-slot slotbox" v-if="popType == 0">
			<image class="pop-banner" src="https://oss.dianddian.cn/v2/activity/everyday-slot.png" mode="widthFix"></image>
			<view :class="[{ long: list.length == 1 }, 'pop-con']">
				<scroll-view scroll-y="true" class="scroll-Y" :style="{ height: list.length == 1 ? '200rpx' : '400rpx' }">
					<view class="coupons" v-for="(item, index) in list" :key="index">
						<view>
							<view>
								<view class="u-font-24">¥</view>
								<view style="font-size: 48rpx; height: 30px;line-height:1.5">{{item.amount}}</view>
							</view>
							<view class="u-m-t-18">{{ item.usedAmount == 0 ? "无门槛" : "满" + item.usedAmount + "元可用" }}</view>
						</view>
						<view>
							<view class="u-font-32"> {{ item.redPacketName }} </view>
							<view class="u-font-24 u-m-t-10 u-line-2"> {{ item.validateTime }} </view>
						</view>
						<view class="u-font-24" @tap="tapCoupon(item.saleType)"> 去使用 </view>
					</view>
				</scroll-view>
			</view>
			<image class="close" src="../../static/img/newyear-close.png" @tap="hidePop()"></image>
		</view>
		<view class="first-slot slotbox" v-if="popType == 1 || popType == 4 || popType == 9">
			<image
				class="pop-banner"
				:src="`https://oss.dianddian.cn/v2/activity/${popType == 4 ? 'fourth' : popType == 1 ? 'first' : 'new'}-slot.png`"
				mode="widthFix"
			></image>
			<view :class="[{ long: list.length == 1 }, 'pop-con']">
				<scroll-view scroll-y="true" class="scroll-Y" :style="{ height: list.length == 1 ? '200rpx' : '400rpx' }">
					<view class="coupons" v-for="(item, index) in list" :key="index">
						<view>
							<view>
								<view class="u-font-24">¥</view>
								<view style="font-size: 48rpx; height: 30px;line-height:1.5">{{ item.amount }}</view>
							</view>
							<view class="u-m-t-18">{{ item.usedAmount == 0 ? "无门槛" : "满" + item.usedAmount + "元可用" }}</view>
						</view>
						<view>
							<view class="u-font-32"> {{ item.redPacketName }} </view>
							<view class="u-font-24 u-m-t-10 u-line-2">
								{{ item.validateTime }}
							</view>
						</view>
						<view class="u-font-24" @tap="tapCoupon(item.saleType)"> 去使用 </view>
					</view>
				</scroll-view>
			</view>
			<image class="close" src="../../static/img/newyear-close.png" @tap="hidePop()"></image>
		</view>
		<view class="second-slot slotbox" v-if="popType == 2">
			<view class="pop-con">
				<view>{{ 1 ? "恭喜您!" : "您的体验卡已失效" }}</view>
				<view class="u-m-t-10">{{ 1 ? "获得一张尊享卡体验卡" : "您的尊享卡体验卡已失效，点击按钮去激活" }}</view>
				<view v-show="card.equityRedPacketName">
					内含
					<text>{{ card.equityRedPacketName || "" }}+{{ card.equityDeliveryName || "" }}</text>
				</view>
				<view class="u-m-t-26" @tap.stop="turnTo">{{ 1 ? "去查看" : "去激活" }}</view>
				<view class="u-m-t-26">
					失效倒计时:
					<u-count-down
						class="u-m-l-10"
						:timestamp="timestamp"
						font-size="24"
						bg-color="#ff3b3b"
						separator-color="#ff3b3b"
						color="#ffffff"
					></u-count-down>
				</view>
			</view>
			<image class="close" src="../../static/img/newyear-close.png" @tap="hidePop()"></image>
		</view>
		<view class="third-slot slotbox" v-if="popType == 3">
			<view class="pop-con" @tap.stop="turnTo"> </view>
			<image class="close" src="../../static/img/newyear-close.png" @tap="hidePop()"></image>
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
		popType: {
			type: Number, //0:天天领券;1:首单福利;2:拼餐日卡体验卡;3:拼餐月卡;4:下单奖励;9:新人券
			default: 0,
		},
		card: {
			type: Object,
			default: {},
		},
		popMask: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		timestamp() {
			//2021-04-02 18:47:05
			if (!this.card?.validEndTime) return 0;
			let timenow = Date.parse(new Date());
			let timecard = Date.parse(new Date(this.card.validEndTime.replace(/\-/g, "/")));
			let interval = new Decimal(timecard ?? 0).sub(new Decimal(timenow ?? 0));
			let data = new Decimal(interval ?? 0).div(new Decimal(1000));
			return data * 1 || 0;
		},
	},
	watch: {
		popType: {
			handler: "someMethod",
			deep: true,
			immediate: true,
		},
	},
	methods: {
		someMethod(newV, oldV) {
			switch (newV) {
				case 1:
				case 4:
					if (this.list.length) this.$parent.popMask = true;
					break;
				case 2:
				case 3:
					if (this.card.cardId) this.$parent.popMask = true;
					break;
				default:
					break;
			}
		},
		turnTo() {
			// this.$emit("inVite");
			switch (this.popType) {
				case 2:
					uni.navigateTo({
						url: "/pagesD/freeCard/freeCard",
					});
					break;
				case 3:
					uni.navigateTo({
						url: `/pagesD/membershipCard/membershipCard?cardId=${this.card.cardId}`,
					});
					break;

				default:
					break;
			}
		},
		hidePop() {
			const that = this;
			that.$emit("inVite");
			// switch (this.popType) {
			// 	case 1:
			// 		// 优惠券到账通知 2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU
			// 		// 优惠券过期提醒 VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w
			// 		// 卡券到账通知 e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4
			// 		// 会员到期提醒 uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM
			// 		uni.requestSubscribeMessage({
			// 			tmplIds: ["2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU", "VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w"],
			// 			complete() {
			// 				that.$emit("inVite");
			// 			},
			// 		});
			// 		break;
			// 	case 2:
			// 		uni.requestSubscribeMessage({
			// 			tmplIds: ["e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4"],
			// 			complete() {
			// 				that.$emit("inVite");
			// 			},
			// 		});
			// 		break;
			// 	default:
			// 		this.$emit("inVite");
			// 		break;
			// }
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
.second-slot {
	padding: 0 70rpx;
	.pop-con {
		height: 514rpx;
		// background: url("https://oss.dianddian.cn/v2/activity/second-solt-none.png");
		background: url("https://oss.dianddian.cn/v2/activity/second-slot.png");
		background-size: contain;
		background-repeat: no-repeat;
		padding: 166rpx 24rpx 0 24rpx;
		> view {
			text-align: center;
			&:first-of-type {
				color: #1c1c1d;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 50rpx;
			}
			&:nth-of-type(2) {
				font-size: 28rpx;
				color: #ababaf;
				line-height: 40rpx;
			}
			&:nth-of-type(3) {
				font-size: 28rpx;
				color: #ababaf;
				line-height: 40rpx;
				text {
					color: #ff3b3b;
				}
			}
			&:nth-of-type(4) {
				width: 556rpx;
				height: 88rpx;
				background: #fe6b00;
				border-radius: 50rpx;
				line-height: 88rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ffffff;
			}
			&:nth-of-type(5) {
				font-size: 24rpx;
				color: #ff3b3b;
				u-count-down {
					vertical-align: middle;
				}
			}
		}
	}
}
.third-slot {
	padding: 0 80rpx;
	.pop-con {
		height: 514rpx;
		background: url("https://oss.dianddian.cn/v2/activity/third-slot.png");
		background-size: contain;
		background-repeat: no-repeat;
		padding: 0;
	}
}
</style>
