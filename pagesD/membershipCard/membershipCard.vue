<template>
	<view class="wrapper" v-if="cardList.length">
		<view class="car_box">
			<SwiperList
				:list="cardList"
				mode="none"
				height="398"
				:autoplay="false"
				:circular="false"
				:effect3dInx="current"
				:effect3d="true"
				@change="changeCard"
				effect3dPreviousMargin="100"
				:current="isBuyInx == -1 ? currentInx : isBuyInx"
				:img-mode="aspectFit"
			></SwiperList>
		</view>
		<view class="discount_info">
			<view class="discount_box" v-if="cardDetail.equityRedPacket">
				<view>{{ cardDetail.equityRedPacketName }}</view>
				<view class="block">
					<view
						:class="[{ used: item.isUsed }, 'each']"
						v-for="(item, inx) in cardDetail.list1"
						:key="inx"
						:style="{
							marginRight: Boolean((inx + 1) % 4 == 0) ? '0' : Boolean(inx + 1 == cardDetail.list1.length) ? 'auto' : '24rpx',
						}"
					>
						<view>
							<view><text>¥</text>{{ item.amount }}</view>
							<image :src="!item.isUsed ? '../../static/img/cbd_line.png' : '../../static/img/cbd_line_gray.png'"></image>
							<view>{{ item.isUsed ? "已使用" : `${item.usedAmount ? `满${item.usedAmount}可用` : "无门槛"}` }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="discount_box" v-if="cardDetail.equityDelivery">
				<view>{{ cardDetail.equityDeliveryName }}</view>
				<view class="block">
					<view
						:class="[{ used: i < cardDetail.delivery.count1 }, 'each']"
						v-for="(it, i) in cardDetail.delivery.deliveryCount <= 0 ? 1 : cardDetail.delivery.deliveryCount"
						:key="i"
						:style="{
							marginRight: Boolean((i + 1) % 4 == 0) ? '0' : Boolean(i + 1 == cardDetail.delivery.deliveryCount) ? 'auto' : '24rpx',
						}"
					>
						<view>
							<view>免</view>
							<image :src="i < cardDetail.delivery.count1 ? '../../static/img/cbd_line_gray.png' : '../../static/img/cbd_line.png'"></image>
							<view>{{ cardDetail.delivery.count1 > i ? "已使用" : "免配送费" }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="cardList[current].isPay && cardList[current].isSaleOut" class="btn">已售罄</view>
		<view v-else-if="cardList[current].isPay && !cardList[current].isSaleOut" class="btn isBuy" @tap="payFuc">{{ cardList[current].msg }}</view>
		<view v-else-if="cardList[current].isBuy" class="btn">{{ cardList[current].msg }} </view>
	</view>
	<view class="wrapper" v-else style="background: transparent">
		<image class="none-img" src="https://oss.dianddian.cn/v2/vip/vip_card_none.png"></image>
	</view>
</template>

<script>
import { AjaxApi } from "@/utils/api";
import { appInit } from "@/utils";
import store from "@/store";
import swiperList from "./swiper/u-swiper";
export default {
	components: {
		swiperList,
	},
	data() {
		return {
			cardList: [],
			current: 0,
			isBuyInx: 0,
			cardDetail: {
				isSaleOut: 0,
				cardId: 0,
				buyPrice: 0,
				cardName: "月卡",
				validEndTime: null,
			},
			validEndTime: "",
			cardType: {
				0: "日",
				1: "周",
				2: "季",
				3: "年",
			},
			optId: 0,
			currentInx: 0,
		};
	},
	onLoad(opt) {
		this.optId = opt?.cardId ?? 0;
	},
	onShow() {
		appInit(this.init);
	},
	methods: {
		async init() {
			// 	cardId: 847
			// cardName: "月卡"
			// cardType: 2
			// equityDelivery: null
			// equityRedPacket: null
			// isBuy: 0 是否购买,0:否,1:是
			// isSaleOut: 0 1:售光 0:未售光
			// list: null
			// recordId: null
			// validEndTime: null
			let res = await store.dispatch("LevelCardList", {});
			if (res.code == 0) {
				if (!res.data.length) return;
				// 0:日卡,1:周卡,2:月卡,3:季卡,4:年卡cardType;
				this.cardList = res.data.map(i => {
					switch (i.cardType) {
						case 2:
							i.image = "https://oss.dianddian.cn/v2/vip/car_bg_2.png";
							break;
						case 1:
							i.image = "https://oss.dianddian.cn/v2/vip/car_bg_1.png";
							break;
						case 0:
							i.image = "https://oss.dianddian.cn/v2/activity/newindex/freecard.png";
							break;
						default:
							i.image = "https://oss.dianddian.cn/v2/vip/car_bg_1.png";
							break;
					}
					return i;
				});
				this.isBuyInx = this.cardList.findIndex(element => element.isBuy);
				let currentInx = this.cardList.findIndex(element => element.cardId == this.optId);
				this.currentInx = currentInx == -1 ? 0 : currentInx;
				this.changeCard(this.isBuyInx == -1 ? this.currentInx : this.isBuyInx);
			}
		},
		changeCard(i) {
			this.current = i;
			this.validEndTime = (this.cardList[i]?.validEndTime || "").slice(0, 10).replace(/-/g, ".");
			let params = {
				cardId: this.cardList[i].cardId,
				isBuy: this.cardList[i].isBuy,
				recordId: this.cardList[i].recordId,
			};
			if (!params.recordId) delete params.recordId;
			let successFuc = res => {
				this.cardDetail = res.data;
			};
			AjaxApi("LevelCardDetail", params, successFuc);
		},
		async payFuc() {
			if (this.cardList[this.current].isSaleOut) return;
			const that = this;
			uni.showLoading({
				title: "正在支付",
				mask: true,
			});
			uni.showNavigationBarLoading();
			let params = {
				cardId: this.cardDetail.cardId,
				payType: 1,
				payAmt: this.cardList[this.current].buyPrice,
				activityId: this.cardList[this.current].activityId,
			};
			if (!this.cardList[this.current].activityId) delete params.activityId;
			let successFuc = res => {
				let respons = res.data.payResp;
				that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
			};
			AjaxApi("BuyCard", params, successFuc);
		},
		totalMenu(timeStampa, nonceStra, packageValue, signTypea, paySigna) {
			uni.showLoading({
				title: "调起支付",
				mask: true,
			});
			uni.requestPayment({
				timeStamp: timeStampa,
				nonceStr: nonceStra,
				package: packageValue,
				signType: signTypea,
				paySign: paySigna,
				success() {
					uni.hideLoading();
					// 优惠券到账通知 2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU
					// 优惠券过期提醒 VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w
					// 卡券到账通知 e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4
					// 会员到期提醒 uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM
					uni.requestSubscribeMessage({
						tmplIds: ["uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM"],
						complete() {
							uni.hideNavigationBarLoading();
							uni.showToast({
								title: "支付成功！",
								icon: "success",
								mask: true,
								duration: 1500,
								success: function (res) {
									setTimeout(function () {
										getCurrentPages().pop().onShow();
									}, 1500);
								},
							});
						},
					});
				},
				fail() {
					uni.hideLoading();
					uni.hideNavigationBarLoading();
					uni.showToast({
						title: "支付失败",
						icon: "none",
						mask: true,
						duration: 1500,
						success: function (res) {
							setTimeout(function () {
								getCurrentPages().pop().onShow();
							}, 1500);
						},
					});
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7;
}
.wrapper {
	.none-img {
		width: 400rpx;
		height: 400rpx;
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: auto;
	}
	background: #ffffff;
	// padding: 20rpx 24rpx;
	padding-bottom: 148rpx;
	padding-bottom: calc(148rpx + constant(safe-area-inset-bottom, 0));
	padding-bottom: calc(148rpx + env(safe-area-inset-bottom, 0));
	.car_box {
		width: 100%;
		height: 398rpx;
		margin-bottom: 22rpx;
		image {
			width: 100%;
			height: 100%;
		}
		/deep/ .u-list-image-wrap {
			transform: scaleY(1) !important;
		}
	}
	.discount_info {
		width: 100%;
		padding: 20rpx 24rpx;
		.discount_box {
			> view {
				&:first-child {
					font-size: 36rpx;
					font-weight: 500;
					color: #1c1c1d;
					line-height: 50rpx;
				}
			}
			.block {
				margin-top: 20rpx;
				display: flex;
				flex-wrap: wrap;
			}
			.each {
				line-height: 160rpx;
				padding-bottom: 30rpx;
				display: flex;
				align-items: center;
				> view {
					&:first-of-type {
						width: 158rpx;
						height: auto;
						background: #fff4ed;
						border-radius: 10rpx;
						color: #fe6b00;
						display: flex;
						flex-direction: column;
						image {
							width: 158rpx;
							height: 32rpx;
						}
						> view {
							&:first-of-type {
								width: 158rpx;
								height: 110rpx;
								line-height: 110rpx;
								text-align: center;
								font-size: 48rpx;
								font-weight: bold;
								text {
									font-size: 24rpx;
								}
							}
							&:nth-of-type(2) {
								width: 158rpx;
								height: 58rpx;
								line-height: 58rpx;
								text-align: center;
								font-size: 24rpx;
							}
						}
					}
				}
				&.used {
					> view {
						&:first-of-type {
							background: #ececee;
							color: #ababaf;
						}
					}
				}
			}
		}
	}
	.btn {
		width: 702rpx;
		min-height: 100rpx;
		border-radius: 50rpx;
		position: fixed;
		bottom: 48rpx;
		bottom: calc(48rpx + constant(safe-area-inset-bottom, 0));
		bottom: calc(48rpx + env(safe-area-inset-bottom, 0));
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 999;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		line-height: 100rpx;
		background: #ababaf;
		color: #ffffff;
		&.isBuy {
			background: linear-gradient(90deg, #525b67 0%, #262c35 100%);
			color: #ffc695;
		}
	}
}
</style>
