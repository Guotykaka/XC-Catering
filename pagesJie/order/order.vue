<template>
	<view class="content">
		<view class="goods-obj">
			<!-- 已参与 -->
			<view class="topview u-flex">
				<image v-if="chainsDetail.shopLogo && !chainsDetail.singleShop" :src="`${chainsDetail.shopLogo}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
				<image v-else-if="!chainsDetail.singleShop" :src="`${shopImg}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
				<view :class="[{ 'u-m-l-24': !chainsDetail.singleShop }, 'u-flex u-row-between']">
					<view class="toptit">
						<view class="u-font-26" v-if="!chainsDetail.singleShop">{{ chainsDetail.shopName }}({{ chainsDetail.storeName }})</view>
						<view class="u-font-26" v-else>{{ chainsDetail.activityName }}</view>
					</view>
					<!-- (-1待付款,0待核销,1已核销) -->
				</view>
			</view>
			<view class="u-m-t-40 u-flex u-row-between">
				<view class="u-m-t-8">
					<image :src="`${cart.shoppingCarts[0].coverPic}?x-oss-process=image/resize,w_700`" style="width: 240rpx; height: 180rpx; rder-radius: 8rpx" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
				</view>
				<view class="u-m-l-24" style="display: flex; flex-direction: column; justify-content: space-between; height: 180rpx; flex: 1">
					<view class="u-font-32">{{ chainsDetail.goodsName }}</view>
					<view class="u-flex u-row-between">
						<view>
							<text class="u-font-24">×</text>
							<text class="u-font-32">{{ cart.shoppingCarts[0].number }}</text>
						</view>
						<view>
							<text class="u-font-24 bold">¥</text>
							<text class="u-font-32 bold">{{ cart.shoppingCarts[0].discountPrice }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="reverse u-flex u-row-between u-font-28 u-m-t-40">
				<view>
					<text class="u-font-24 u-m-r-10 bold">¥</text>
					<text class="u-font-24 bold">合计</text>
					<text class="u-font-36 bold">{{ cart.totalPrice }}</text>
				</view>
				<!-- (-1待付款,0待核销,1已核销) -->
			</view>
		</view>
		<view class="block u-m-t-20 u-flex" style="flex-direction: column">
			<view @tap="tapRadio(1)" class="u-flex u-row-between radio">
				<view class="u-font-32">微信支付</view>
				<view>
					<u-radio-group v-model="payType">
						<u-radio active-color="#FE6B00" :name="1"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view @tap="tapRadio(3)" class="u-flex u-row-between radio">
				<view class="u-font-32">
					账户余额<text class="u-font-24 u-m-l-20">¥</text> <text class="u-font-32">{{ balance }}</text>
				</view>
				<view>
					<u-radio-group v-model="payType">
						<u-radio :disabled="!balance" active-color="#FE6B00" :name="3"></u-radio>
					</u-radio-group>
				</view>
			</view>
		</view>
		<view @tap="showRemark = !showRemark" class="block u-m-t-20 u-flex u-row-between">
			<view class="u-font-32">备注</view>
			<view>
				<text :class="showRemark ? 'iconfont icon-arrow-up' : 'iconfont icon-arrow-right'"></text>
			</view>
		</view>
		<view class="block u-m-t-20 u-flex u-row-between" v-if="showRemark" style="padding: 20rpx">
			<textarea placeholder="请输入备注" placeholder-style="font-size:28rpx;color:#DDDDDD" maxlength="50" :value="remark" @input="getValue" cursor-spacing="200" height="240"></textarea>
		</view>
		<view class="btnview">
			<view class="btn u-font-32" @tap="joinFuc">
				<text class="u-m-r-10">立即支付</text>
				<text class="u-font-24 u-m-r-10 bold">¥</text>
				<text class="u-font-34 bold">{{ cart.totalPrice }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { PromiseAll, AjaxApi } from "@/utils/api";
	import store from "@/store";
	export default {
		data() {
			return {
				chainsDetail: {
					id: 0,
					goodsName: "***",
					storeName: "***",
					shopName: "***",
					activityName: "***",
					startTime: "2021-08-19 00:00:01",
					endTime: "2021-09-30 23:59:59",
					status: 1,
					shopLogo: "",
					bigPic: null,
					pic: "",
					records: [],
					basicPrice: 20.0,
					price: 0,
					storeId: 0,
					shopId: 0,
					goodsId: 0,
					stockId: 0,
					availableStock: 999,
					copies: 0,
					content: "",
					settlementPrice: 0,
					delFlag: 0,
					buyCount: 0,
				},
				cart: {
					shoppingCarts: [],
					totalPrice: 0,
					count: 0,
				},
				showRemark: false,
				balance: 0,
				idemToken: "",
				payType: 1, //'支付方式1:微信,2:支付宝,3:余额,4:银行卡转账,5:微信转账,6:支付宝转账',
				shopImg: getApp().globalData.shopImg,
				remark: "",
			};
		},
		onLoad(query) {
			let thisPages = getCurrentPages();
			let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
			this.cart = thisPrevPage.$vm.cart;
			this.chainsDetail = thisPrevPage.$vm.chainsDetail;
			this.init();
		},
		methods: {
			init() {
				uni.showLoading({
					title: "加载中...",
					mask: true,
				});
				let proList = [store.dispatch("GetUserBalance", {}), store.dispatch("AuthCoupon", {})];
				let thenFuc = async res => {
					let resArr = res.map(a => a.data);
					this.balance = resArr[0]?.availableAmount ?? 0;
					this.idemToken = resArr[1] ?? "";
				};
				let catchFuc = err => {
					if (err == 1001) {
						this.init();
					} else {
						uni.navigateBack();
					}
				};
				PromiseAll(proList, thenFuc, catchFuc);
			},
			tapRadio(i) {
				switch (i) {
					case 1:
						this.payType = 1;
						break;
					case 3:
						if (!this.balance) return;
						this.payType = 3;
						break;

					default:
						break;
				}
			},
			getValue(e) {
				this.remark = e.detail.value;
			},
			joinFuc() {
				uni.showLoading({
					title: "加载中...",
					mask: true,
				});
				const successFuc = res => {
					this.payFuc(res.data);
				};
				AjaxApi("CreatChains", { activityId: this.chainsDetail.id, remark: this.remark }, successFuc);
			},
			async payFuc(it) {
				const that = this;
				uni.showLoading({
					title: "正在支付",
					mask: true,
				});
				let successFuc = res => {
					if (this.payType == 3) {
						uni.vibrateLong();
						uni.reLaunch({
							url: `/pagesJie/chains/chains`,
						});
						return;
					}
					uni.showLoading({
						title: "等待支付",
						mask: true,
					});
					let respons = res.data.payResp;
					that.totalMenu(respons.timeStamp, respons.nonceStr, respons.packageValue, respons.signType, respons.paySign);
				};
				let elseFuc = () => {
					uni.hideLoading();
					uni.showToast({
						title: "支付失败！",
						icon: "none",
						mask: true,
						duration: 2000,
						success: () => {
							setTimeout(function () {
								uni.reLaunch({
									url: `/pagesJie/chains/chains`,
								});
							}, 2000);
						},
					});
				};
				AjaxApi(
					"PayOrder",
					{
						...{
							orderId: it.orderId,
							payType: this.payType,
						},
						header: { idem_token: this.idemToken },
					},
					successFuc,
					elseFuc
				);
			},
			totalMenu(timeStampa, nonceStra, packageValue, signTypea, paySigna) {
				const that = this;
				uni.requestPayment({
					timeStamp: timeStampa,
					nonceStr: nonceStra,
					package: packageValue,
					signType: signTypea,
					paySign: paySigna,
					success() {
						uni.hideLoading();
						uni.vibrateLong();
						uni.reLaunch({
							url: `/pagesJie/chains/chains`,
						});
					},
					fail() {
						uni.hideLoading();
						uni.showToast({
							title: "取消支付！",
							icon: "none",
							mask: true,
							duration: 2000,
							success: () => {
								setTimeout(function () {
									uni.reLaunch({
										url: `/pagesJie/chains/chains`,
									});
								}, 2000);
							},
						});
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		background: #f9fafb;
		padding: 20rpx;
		min-height: 100vh;
		.goods-obj {
			color: #1c1c1d;
			background: #ffffff;
			border-radius: 8rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			.topview {
				image {
					width: 68rpx;
					height: 68rpx;
					border-radius: 10rpx;
				}
				.toptit {
					display: flex;
					flex-direction: column;
					.history {
						color: #ababaf;
					}
				}
			}
			.midview {
				.midtit {
					.price {
						color: #ff4d4f;
						.linethrough {
							text-decoration: line-through;
							color: #999999;
						}
					}
				}
				image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 10rpx;
				}
			}
			.fotview {
				image {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
				}
				> view {
					display: flex;
					> view {
						&:first-of-type {
							width: 140rpx;
						}
						&:nth-of-type(2) {
							width: 112rpx;
							color: #999999;
						}
						&:nth-of-type(3) {
							width: 320rpx;
						}
					}
				}
			}
			.reverse {
				flex-direction: row-reverse;
			}
		}
		.btnview {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 0 26rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom, 0);
			padding-bottom: env(safe-area-inset-bottom, 0);
			.btn {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				color: #ffffff;
				background: #fe6b00;
				border-radius: 50rpx;
			}
		}
		.block {
			min-height: 110rpx;
			background: #ffffff;
			box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
			border-radius: 8rpx;
			padding: 0 20rpx;
			.radio {
				height: 100rpx;
				width: 100%;
				padding: 20rpx 0 10rpx 0;
				/deep/ .u-radio__label {
					display: none;
				}
			}
			.iconfont {
				color: #d5d5d5;
				font-size: 24rpx;
				&.icon-arrow-up {
					font-size: 18rpx;
				}
			}
		}
	}
</style>
