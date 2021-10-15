<template>
	<view class="container u-p-b-40">
		<view class="inx-head">
			<image class="img" src="https://oss.dianddian.cn/v2/activity/groupImg.png" mode="widthFix"></image>
			<view class="coupons">
				<scroll-view scroll-y="true" class="scroll-Y" :style="{ height: list.length == 1 ? '200rpx' : '400rpx' }">
					<view class="coupon" v-for="(item, index) in list" :key="index">
						<view>
							<view>
								<text class="u-font-24">¥</text>
								<text style="font-size: 48rpx">{{ item.amount }}</text>
							</view>
							<view class="u-m-t-18 u-line-2">{{ item.usedAmount == 0 ? "全平台可用" : "满" + item.usedAmount + "元可用" }}</view>
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
		</view>
		<view class="inx-to-tit">
			<view class="u-font-32 bold" style="color: #ffffff">市集拼餐</view>
		</view>
		<view class="inx-to-goods" v-for="(item, inx) in groupGoods" :key="inx">
			<view class="u-m-b-20" @tap="toSpellOrder(item)">
				<view>
					<image class="img-a" :src="groupPic" mode="widthFix"></image>
					<view class="u-m-l-20">
						<view class="u-font-28 bold" style="color: #1c1c1d">{{ item.name }}</view>
						<view class="u-font-24" style="color: #ababaf">距离{{ item.distance }}</view>
					</view>
				</view>
				<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-arrow-r.png" mode="aspectFill"></image>
			</view>
			<view>
				<view
					class="inx-to-good"
					v-for="(its, i) in item.listGroupShopGoodsInfo"
					:key="i"
					:style="{
						marginRight: Boolean((i + 1) % 3 == 0) ? '0' : Boolean(i + 1 == item.listGroupShopGoodsInfo.length) ? '122px' : 'auto',
					}"
					@tap="toSpellOrder(its)"
				>
					<view>
						<image :src="`${its.coverPic ? its.coverPic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`" mode="aspectFill"></image>
					</view>
					<view class="u-p-10">
						<view class="u-font-24 u-line-1" style="color: #1c1c1d">{{ its.goodsName }}</view>
						<view style="color: #ff3b3b">
							<text class="bold u-font-20">¥</text>
							<text class="bold u-font-24">{{ its.wmDiscountPrice }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL, PromiseAll } from "@/utils/api";
	import store from "@/store";
	import { appInit } from "@/utils";
	import { getUserLocation } from "@/utils";
	export default {
		data() {
			return {
				time: 0,
				shopImg: "https://oss.dianddian.cn/shop/%E9%BB%98%E8%AE%A4%E5%BA%97%E9%93%BAlogo%403x.png",
				groupPic: "https://oss.dianddian.cn/v2/activity/newindex/groupPic.png", //市集头像
				orderDetail: {},
				list: [],
				recommendId: 0,
				groupGoods: [],
				pagesPram: {
					pageDown: false,
					pageIndex: 1,
					pageSize: 3,
				},
			};
		},
		onReachBottom(e) {
			if (this.pagesPram.pageDown) {
				this.pagesPram.pageIndex++;
				this.getGroupGoods();
			}
		},
		onLoad(options) {
			this.recommendId = options.recommendId;
		},
		onShow() {
			uni.showLoading({
				title: "",
			});
			this.pagesPram.pageIndex = 1;
			getUserLocation(this.init, true);
		},
		onShareAppMessage: function () {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		},
		methods: {
			init() {
				this.getGroupGoods(true);
				let proList = [
					store.dispatch("IsNewUser", {}), //是否新人
				];
				let thenFuc = async res => {
					let resArr = res.map(a => a.data);
					let isNewUser = resArr[0] ?? false;
					if (isNewUser) {
						this.checkNewUser();
					} else {
						this.checkOrders();
					}
				};
				let catchFuc = err => {
					uni.hideLoading();
				};
				PromiseAll(proList, thenFuc, catchFuc);
			},
			getGroupGoods(first = false) {
				let { pageIndex, pageSize } = this.pagesPram;
				let successFuc = async res => {
					if (first) {
						this.groupGoods = [];
						this.pagesPram = {
							pageDown: false,
							pageIndex: 1,
							pageSize: 3,
						};
					}
					if (!res?.data?.data.length) return;
					this.groupGoods = this.groupGoods.concat(res.data?.data);
					let { pageCount, pageIndex } = res.data;
					this.pagesPram.pageIndex = pageIndex;
					this.pagesPram.pageDown = Boolean(pageIndex < pageCount);
				};
				AjaxApi("SelectMakeUpList2", { pageIndex, pageSize, userLatitude: getApp().globalData.location.latitude, userLongitude: getApp().globalData.location.longitude * 1 }, successFuc);
			},
			checkOrders() {
				uni.showLoading({
					title: "",
				});
				const params = {
					recommendId: this.recommendId || 1006888,
				};
				let successFuc = res => {
					this.list = res.data;
				};
				let elseFuc = async res => {};
				AjaxApi("OrdersRedPacket", params, successFuc, elseFuc);
			},
			checkNewUser() {
				uni.showLoading({
					title: "",
				});
				const params = {
					recommendId: this.recommendId || 1006888,
				};
				let successFuc = res => {
					this.list = res.data;
				};
				let elseFuc = async res => {};
				AjaxApi("NewRedP", params, successFuc, elseFuc);
			},
			tapCoupon(saleType) {
				uni.showLoading({
					title: "跳转中",
					mask: true,
				});
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
					case 1:
						getApp().globalData.shoppingMode = 0;
						uni.reLaunch({
							url: `/pagesC/store/store`,
						});
						break;
					default:
						getApp().globalData.shoppingMode = 1;
						uni.reLaunch({
							url: `/pagesC/store/store`,
						});
						break;
				}
			},
			toSpellOrder(its) {
				uni.reLaunch({
					url: `/pages/spellOrder/spellOrder?storeId=${its?.storeId ?? 0}&shopId=${its?.shopId ?? 0}`,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		background: url("https://oss.dianddian.cn/v2/activity/groupBg.png") no-repeat, #ffb056;
		background-size: contain;
		background-repeat: no-repeat;
		min-height: 100vh;
		.bold {
			font-weight: bold;
		}
		.inx-head {
			padding: 0 24rpx;
		}
		.img {
			width: 100%;
			vertical-align: bottom;
		}
		.coupons {
			// height: 204rpx;
			background: #ff4545;
			border-radius: 0 0 20rpx 20rpx;
			padding: 0 24rpx;
			margin-top: -40rpx;
			.coupon {
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
						width: 200rpx;
						height: 100%;
						background: #fff1f1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						color: #ff3b3b;
						> view {
							width: 100%;
							text-align: center;
							&:first-of-type {
								font-weight: bold;
								> text {
									width: 100%;
								}
							}
							&:nth-of-type(2) {
								font-size: 24rpx;
							}
						}
					}
					&:nth-of-type(2) {
						width: 302rpx;
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
		.inx-to-tit {
			margin: 36rpx 24rpx 0 24rpx;
		}
		.inx-to-goods {
			margin: 20rpx 24rpx;
			padding: 20rpx;
			background: white;
			> view {
				&:first-of-type {
					display: flex;
					justify-content: space-between;
					> view {
						display: flex;
						> view {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
						}
					}
					image {
						vertical-align: middle;
						&.img-a {
							width: 74rpx;
							height: 74rpx;
						}
						&.img-b {
							width: 16rpx;
							height: 24rpx;
						}
					}
				}
				&:nth-of-type(2) {
					display: flex;
					flex-wrap: wrap;
					image {
						width: 208rpx;
						height: 160rpx;
					}
					.inx-to-good {
						border-radius: 6rpx;
						overflow: hidden;
						width: 208rpx;
						min-width: 0;
						> view {
							&:first-of-type {
								height: 160rpx;
							}
							&:nth-of-type(2) {
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								height: 88rpx;
								background: #f6f6f7;
							}
						}
					}
				}
			}
		}
	}
</style>
