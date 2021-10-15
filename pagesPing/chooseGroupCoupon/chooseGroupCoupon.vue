<template>
	<view class="container">
		<view class="coupon-box" v-for="(it, i) in couponList" :key="i">
			<view class="coupon" :class="{ ifchoose: it.active }" @tap="tapView(i)">
				<img src="/static/img/xuanzhong1.png" v-if="it.active" />
				<view class="coupon-info">
					<view class="coupon-name u-flex-nowrap u-line-1" style="width: 60vw">{{ it.redPacketName }}</view>
					<view class="remark">
						<text class="span-style u-m-r-8" :class="[{ 'cant-pay': it.isPay == 1 }, it.type ? 'span-style-r' : 'span-style-b']">{{
							couponType[it.type]
						}}</text>
						<text :class="[{ 'cant-pay': it.isPay == 1 }, 'span-style u-m-r-8 span-style-r']">{{
							it.saleType == 0 ? "堂食" : it.saleType == 1 ? "外卖" : it.saleType == 2 ? "通用" : "拼餐"
						}}</text>
						<text>{{ getCurrent(it.validRemark) }}</text>
					</view>
				</view>
				<view class="coupon-top-right">
					<view :class="{ amount: it.isPay == 0 }">
						<text style="font-size: 28rpx">￥</text>
						<text style="font-size: 48rpx">{{ it.amount }}</text>
					</view>
					<view class="amount-info">满{{ it.usedAmount ? it.usedAmount : 0 }}元可用</view>
				</view>
			</view>
			<view class="coupon-remark">
				<!-- u-collapse -->
				<view class="remark-title" :class="{ click: it.click == true }">
					<view @tap="itClick(i)">
						<view>{{ it.isShare == 0 ? "同享券（与折扣优惠同享）" : "不同享券（与折扣优惠不同享）" }}</view>
						<view v-if="it.note.length > 0">
							<u-icon name="arrow-up u-m-l-20" v-if="it.click" color="#999" size="20"></u-icon>
							<u-icon name="arrow-down u-m-l-20" v-else color="#999" size="20"></u-icon>
						</view>
					</view>
				</view>
				<view v-if="it.note.length > 0 && it.click == true" style="word-break: break-all; line-height: 28rpx">
					{{ it.note }}
				</view>
			</view>
		</view>
		<view class="bot-button-box u-p-t-7 u-p-r-10 u-p-b-7 u-flex u-row-between">
			<view class="subtotal" v-if="count == 0">请选择优惠券</view>
			<view class="subtotal u-line-1" v-else
				>已选择{{ count }}张，可抵扣 <text style="color: #ff0000">￥{{ totalAmt }}</text></view
			>
			<button class="u-font-18 u-text-center" :class="[flagSubmit == -1 ? 'button' : 'button1']" @tap="sureUse">确定使用</button>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			isShare: false, //同享/不同享(都可以)
			flagSubmit: -1,
			preId: -1, //上一次选择的券
			couponList: [],
			userRedPacketReq: {},
			couponParameter: {
				isExpire: 1,
				isTake: 0,
				isUsed: 0,
				saleType: 0, //0:堂食券,1:外卖券,2:通用券（堂食+外卖）
				source: null, //0平台1商家
				usedAmount: null,
				shopId: null,
			},
			totalAmt: 0,
			count: 0,
			couponType: {
				0: "新人券",
				1: "活动券",
				2: "分享券",
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
	onLoad(options) {
		let thisPages = getCurrentPages();
		let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
		this.userRedPacketReq = thisPrevPage.$vm.groupMsg.userRedPacketReq;
	},
	onShow() {
		this.couponList = [];
		this.totalAmt = 0;
		this.count = 0;
		this.init();
	},
	onUnload() {},
	methods: {
		getNowDate(v) {
			let time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
			let format = v.replace(/-/g, "/");
			return `还剩${parseInt((new Date(format).getTime() - new Date(time).getTime()) / 84600000)}天到期`;
		},
		getCurrent(v) {
			if (v == "长期有效") {
				return "长期有效";
			}
			return this.getcurentDate(v) > 5 ? `${v.split(" ")[0]}到期` : this.getcurentDate(v) < 1 ? `${v.slice(0, 16)}到期` : this.getNowDate(v);
		},
		init() {
			//优惠券列表
			let successFuc = res => {
				const thisPages = getCurrentPages();
				const prevPage = thisPages[thisPages.length - 2];
				this.couponList = this.couponList.concat(
					res.data.map(it => {
						if (prevPage.$vm.redPacketIds == it.recordId) {
							it.active = true;
							this.count = 1;
							this.totalAmt = it.amount;
							this.preId = it.recordId;
						} else {
							it.active = false;
						}
						it.click = false;
						return it;
					})
				);
				this.flagSubmit = this.couponList.findIndex(it => it.active == true);
			};
			AjaxApi("SelectGroupTicket", this.userRedPacketReq, successFuc);
		},
		tapView(i) {
			if (Boolean(this.couponList[i].isPay)) return;
			const pages = getCurrentPages();
			const prevPage = pages[pages.length - 2]; //上一个页面
			this.couponList = this.couponList.map((item, index) => {
				if (i == index) {
					item.active = !item.active;
					if (item.active) {
						prevPage.$vm.redPacketIds = item.recordId;
						prevPage.$vm.redPacket = item.amount;
					} else {
						prevPage.$vm.redPacketIds = 0;
						prevPage.$vm.redPacket = 0;
					}
				} else {
					item.active = false;
				}
				return item;
			});
			this.flagSubmit = this.couponList.findIndex(it => it.active == true);
			if (this.couponList[i].active) {
				this.totalAmt = this.couponList[i].amount;
				this.count = 1;
			} else {
				this.totalAmt = 0;
				this.count = 0;
			}
		},
		itClick(i) {
			this.couponList[i].click = !this.couponList[i].click;
		},
		sureUse() {
			if (this.flagSubmit == -1) return;
			uni.navigateBack({
				delta: 1,
			});
		},
		getcurentDate(val) {
			let time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
			let format = val.replace(/-/g, "/");
			return (new Date(format).getTime() - new Date(time).getTime()) / 86400000;
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding-top: 20rpx;
	.coupon-box {
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 20rpx;
		margin-bottom: 20rpx;
		.ifchoose {
			overflow: hidden;
			.icon-check-mark {
				position: absolute;
				display: block !important;
				width: 48rpx;
				height: 48rpx;
				font-size: 14rpx;
				color: #ffffff;
				background: #fe6b00;
				border-radius: 50%;
				right: -24rpx;
				top: -24rpx;
				&:before {
					position: absolute;
					left: 10rpx;
					bottom: 8rpx;
				}
			}
		}
		.coupon {
			position: relative;
			width: 100%;
			padding: 38rpx 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
			opacity: 1;
			border-radius: 8rpx;
			image {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 0;
				right: 0;
			}
			.icon-check-mark {
				display: none;
			}
			.image-style {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 0;
				right: 0;
			}
			.coupon-top-right {
				margin-right: 14rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.amount {
					color: #ff4d4f;
					vertical-align: bottom;
					&.cant-pay {
						color: #999999;
					}
				}
				.amount-info {
					height: 28rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					opacity: 1;
				}
			}
			.coupon-name {
				height: 44rpx;
				font-size: 32rpx;
				font-weight: 400;
				line-height: 44rpx;
				color: #333333;
				opacity: 1;
				margin-bottom: 12rpx;
			}
			.remark {
				font-size: 10px;
				font-weight: 400;
			}
			.span-style {
				height: 28rpx;
				font-size: 20rpx;
				text-align: center;
				line-height: 28rpx;
				box-sizing: border-box;
				border-radius: 4rpx;
				padding: 0rpx 12rpx;
			}
			.span-style-b {
				border: 2rpx solid #fe6b00;
				color: #fe6b00;
				&.cant-pay {
					border: 1px solid#999999;
					color: #999999;
				}
			}
			.span-style-r {
				border: 1px solid rgba(255, 77, 79, 1);
				color: #ff4d4f;
				&.cant-pay {
					border: 1px solid#999999;
					color: #999999;
				}
			}
			.expiration-date {
				color: rgba(102, 102, 102, 1);
			}
		}
		.coupon-remark {
			background: #fff;
			padding: 16rpx 32rpx;
			box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
			border-radius: 8rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 44rpx;
			color: rgba(153, 153, 153, 1);
			text {
				font-size: 10rpx;
				// margin-bottom: 10rpx;
			}
			.click {
				height: auto !important;
			}
			.remark-title {
				height: 44rpx;
				line-height: 44rpx;
				display: flex;
				overflow: hidden;
				justify-content: space-between;
				text {
					vertical-align: middle;
					display: inline-block;
					height: 100%;
					width: 50rpx;
				}
				> view {
					width: 100%;
					display: flex;
					&:nth-child(2) {
						margin-left: 30rpx;
						width: 104rpx;
						height: 40rpx;
						background: #ff4d4f;
						color: #ffffff;
						border-radius: 20rpx;
					}
				}
			}
		}
	}
	.history-coupon-box {
		padding: 20rpx;
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 40rpx;
		color: rgba(102, 102, 102, 1);
		text-align: center;
		box-sizing: border-box;
		padding-bottom: 180rpx;
	}
	.bot-button-box {
		width: 100%;
		padding: 16rpx 0;
		background: rgba(255, 255, 255, 1);
		position: fixed;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom, 0);
		padding-bottom: env(safe-area-inset-bottom, 0);
		.subtotal {
			margin-left: 62rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			line-height: 40rpx;
			color: rgba(153, 153, 153, 1);
		}
		.sub-text {
			color: #ff0000;
		}
		button {
			margin-right: 0;
			outline: none;
			width: 248rpx;
			height: 92rpx;
			line-height: 92rpx;
			font-weight: 500;
			font-weight: bold;
			border-radius: 8rpx;
			color: #fff;
			outline: none;
		}
		.button1 {
			background: #fe6b00;
		}
		.button {
			background: #999999;
			color: #fff;
		}
	}
}
</style>
