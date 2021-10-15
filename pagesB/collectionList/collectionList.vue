<template>
	<view class="wrapper">
		<u-mask :duration="0" class="load-mask" :show="loadingMask" z-index="10090" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<image class="banner-img" src="https://oss.dianddian.cn/common/ddd_log.png" mode="aspectFill"></image>
		</u-mask>
		<view class="tab-list">
			<u-tabs
				:list="list"
				:is-scroll="false"
				height="88"
				bar-height="4"
				bar-width="335"
				active-color="#E5CDA1"
				:current="current"
				@change="change"
			></u-tabs>
		</view>
		<u-mask :show="modeMask" z-index="10090" :custom-style="{ background: 'rgba(0, 0, 0, 0.7)' }">
			<view class="mask-slot">
				<view>
					<image src="../../static/img/choose.png"></image>
					<view>请先选择到店或者外卖</view>
				</view>
				<view>
					<view @tap.stop="choodsMode(1)">到店</view>
					<view @tap.stop="choodsMode(0)">外卖</view>
				</view>
			</view>
		</u-mask>
		<view v-if="current == 1" class="collection-box">
			<view class="collection">
				<view class="every" v-for="(item, index) in collectShopList" :key="index" @click="openMask(item)">
					<u-image v-if="item.shopLogo" :src="item.shopLogo" width="156" height="156" border-radius="8"></u-image>
					<u-image v-else :src="shopImg" width="156" height="156" border-radius="8"></u-image>
					<view class="u-flex-1 u-m-l-24" style="width: 0">
						<view>
							<view class="name u-line-1">{{ item.shopName }}</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text :class="[{ red: item.shopScore }, 'u-m-r-24']">{{ item.shopScore ? `${item.shopScore}分` : "暂无评价" }}</text>
								<text>月售 {{ item.saleCount > 9999 ? "9999+" : item.saleCount }}</text>
							</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text v-if="item.expectedTime">出餐时间 {{ item.expectedTime }}分钟内</text>
							</view>
						</view>
						<view class="coupon-remark u-rela">
							<view class="remark-title" :class="{ click: it.click == true }">
								<view>
									<view>
										<view class="u-m-r-10" style="display: inline-block" v-for="(it, i) in item.activityList" :key="i">
											<span v-if="i < 3">满{{ it.maxAmount }}减{{ it.reduceFee }}</span>
										</view>
									</view>
									<view v-if="item.activityList.length > 3" class="u-abso" style="right: -20rpx">
										<text v-if="item.click" class="iconfont u-m-l-30 icon-arrow-up" @tap.stop="itClick(index)"></text>
										<text v-else class="iconfont u-m-l-30 icon-arrow-down" @tap.stop="itClick(index)"></text>
									</view>
								</view>
							</view>
							<view v-if="item.activityList.length > 3 && item.click == true" style="word-break: break-all; line-height: 28rpx">
								<view style="display: inline-block" v-for="(it, i) in item.activityList" :key="i">
									<span v-if="i > 2" class="u-m-r-10 u-m-b-10">满{{ it.maxAmount }}减{{ it.reduceFee }}</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="line" v-if="shopList.length > 0" :style="{ 'padding-top': collectShopList.length > 0 ? '60rpx' : '20rpx' }">
				<span style="margin-right: 10rpx"></span>
				超出配送范围的店铺
				<span style="margin-left: 10rpx"></span>
			</view>
			<view class="collection" v-if="shopList.length > 0">
				<view class="every" v-for="(item, index) in shopList" :key="index" @click="openMask(item)">
					<u-image v-if="item.shopLogo" :src="item.shopLogo" width="156" height="156" border-radius="8"></u-image>
					<u-image v-else :src="shopImg" width="156" height="156" border-radius="8"></u-image>
					<view class="u-flex-1 u-m-l-24" style="width: 0">
						<view>
							<view class="name u-line-1">{{ item.shopName }}</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text :class="[{ red: item.shopScore }, 'u-m-r-24']">{{ item.shopScore ? `${item.shopScore}分` : "暂无评价" }}</text>
								<text>月售 {{ item.saleCount > 9999 ? "9999+" : item.saleCount }}</text>
							</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text v-if="item.expectedTime">出餐时间 {{ item.expectedTime }}分钟内</text>
							</view>
						</view>
						<view class="coupon-remark u-rela">
							<view class="remark-title" :class="{ click: it.click == true }">
								<view>
									<view>
										<view class="u-m-r-10" style="display: inline-block" v-for="(it, i) in item.activityList" :key="i">
											<span v-if="i < 3">满{{ it.maxAmount }}减{{ it.reduceFee }}</span>
										</view>
									</view>
									<view v-if="item.activityList.length > 3" class="u-abso" style="right: -20rpx">
										<text v-if="item.click" class="iconfont u-m-l-30 icon-arrow-up" @tap.stop="itClick(index)"></text>
										<text v-else class="iconfont u-m-l-30 icon-arrow-down" @tap.stop="itClick(index)"></text>
									</view>
								</view>
							</view>
							<view v-if="item.activityList.length > 3 && item.click == true" style="word-break: break-all; line-height: 28rpx">
								<view style="display: inline-block" v-for="(it, i) in item.activityList" :key="i">
									<span v-if="i > 2" class="u-m-r-10 u-m-b-10">满{{ it.maxAmount }}减{{ it.reduceFee }}</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="nomore u-margin-top-40" v-if="shopList.length == 0 && collectShopList.length == 0">暂无收藏店铺</view>
		</view>
		<view v-if="current == 0" class="collection-box">
			<view class="shop-list">
				<view class="shop-box" v-for="(item, index) in collectStoreList" :key="index">
					<image
						:src="`${item.logo ? item.logo + '?x-oss-process=image/resize,w_700' : 'https://oss.dianddian.cn/shop/defult-store.png'}`"
						mode="aspectFill"
						@tap="openMask(item)"
					></image>
					<view class="shop-info" @tap="openMask(item)">
						<view class="shop-name">{{ item.storeName }}</view>
						<view class="shop-address">
							<text class="tag-text u-m-r-10" v-if="index == 0 && !show_cover">离我最近</text>
							<text class="text u-m-r-10" v-if="!show_cover">{{ item.distance1 }}</text>
							{{ `${item.province}${item.city}${item.area}${item.address}` }}
						</view>
						<view class="shop-btn-box">
							<view class="span-style2 u-m-l-10" @tap="openMask(item)">进店</view>
						</view>
					</view>
				</view>
			</view>
			<view class="line" v-if="storeList.length > 0" :style="{ 'padding-top': collectStoreList.length > 0 ? '60rpx' : '20rpx' }">
				<span style="margin-right: 10rpx"></span>
				超出配送范围的门店
				<span style="margin-left: 10rpx"></span>
			</view>
			<view class="shop-list" v-if="storeList.length > 0">
				<view class="shop-box" v-for="(item, index) in storeList" :key="index">
					<image
						:src="`${item.logo ? item.logo + '?x-oss-process=image/resize,w_700' : 'https://oss.dianddian.cn/shop/defult-store.png'}`"
						mode="aspectFill"
						@tap="openMask(item)"
					></image>
					<view class="shop-info">
						<view class="shop-name">{{ item.storeName }}</view>
						<view class="shop-address">
							<text class="tag-text u-m-r-10" v-if="index == 0 && !show_cover">离我最近</text>
							<text class="text u-m-r-10" v-if="!show_cover">{{ item.distance1 }}</text>
							{{ `${item.province}${item.city}${item.area}${item.address}` }}
						</view>
						<view class="shop-btn-box">
							<view class="span-style2 u-m-l-10" @tap="openMask(item)">进店</view>
						</view>
					</view>
				</view>
			</view>
			<view class="nomore u-margin-top-40" v-if="storeList.length == 0 && collectStoreList.length == 0">暂无收藏门店</view>
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
			loadingMask: false,
			current: 0,
			shopImg: getApp().globalData.shopImg, //默认店铺图片
			modeMask: false, //扫码进店选择类型
			userLatitude: getApp().globalData.location.latitude,
			userLongitude: getApp().globalData.location.longitude,
			list: [
				{
					name: "门店",
				},
				{
					name: "店铺",
				},
			],
			shopList: [],
			storeList: [],
			collectShopList: [],
			collectStoreList: [],
			currentShop: {},
			currentStore: {},
		};
	},
	onShow() {
		this.loadingMask = true;
		this.getSelectCollectList();
	},
	methods: {
		itClick(i) {
			this.collectShopList[i].click = !this.collectShopList[i].click;
		},
		change(e) {
			uni.pageScrollTo({
				scrollTop: 0,
			});
			this.current = e;
			this.getSelectCollectList();
		},
		openMask(obj) {
			this.currentShop = obj;
			if (obj.shopId) {
				if (obj.type == 2) {
					this.modeMask = true;
				} else {
					getApp().globalData.shoppingMode = !this.currentShop.type ? 1 : 0;
					this.shoppingMode = getApp().globalData.shoppingMode;
					uni.showLoading({
						title: "正在跳转",
						mask: true,
					});
					uni.navigateTo({
						url: `/pages/home/home`,
						success() {
							uni.hideLoading();
						},
					});
				}
			} else {
				this.currentStore = obj;
				getApp().globalData.shoppingMode = 1;
				this.shoppingMode = 1;
				uni.navigateTo({
					url: `/pagesC/store/store?storeId=${this.currentStore.storeId}`,
				});
			}
		},
		choodsMode(num) {
			getApp().globalData.shoppingMode = num;
			this.shoppingMode = num;
			this.modeMask = false;
			uni.showLoading({
				title: "正在跳转",
				mask: true,
			});
			uni.navigateTo({
				url: `/pages/home/home`,
				success() {
					uni.hideLoading();
				},
			});
		},
		getSelectCollectList() {
			let params = {
				type: this.current,
				userLatitude: this.userLatitude,
				userLongitude: this.userLongitude,
			};
			let successFuc = res => {
				this.loadingMask = false;
				if (this.current == 0) {
					this.collectStoreList = [];
					this.storeList = [];
					if (res.data.list1) {
						this.collectStoreList = res.data.list1;
					}
					if (res.data.list2) {
						this.storeList = res.data.list2;
					}
				}
				if (this.current == 1) {
					this.collectShopList = [];
					this.shopList = [];
					if (res.data.list1) {
						this.collectShopList = res.data.list1.map(el => {
							el.click = false;
							return el;
						});
					}
					if (res.data.list2) {
						this.shopList = res.data.list2.map(el => {
							el.click = false;
							return el;
						});
					}
				}
			};
			AjaxApi("GetSelectCollectList", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	.tab-list {
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
		padding-bottom: 20rpx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 5000;
		background: #fff;
	}
	.collection-box {
		.collection {
			background: #fff;
		}
		.every {
			display: flex;
			padding: 32rpx;
			.delivery-type {
				position: absolute;
				right: 0;
				top: 0rpx;
				display: block;
				width: 120rpx;
				font-size: 24rpx;
				line-height: 150%;
				background: #4c70e8;
				font-weight: 400;
				text-align: center;
				color: #fff;
				&.redbg {
					background: #ff4d4f;
				}
			}
			.distance-time {
				position: absolute;
				right: 0;
				top: 0;
				text-align: center;
			}
			.name {
				line-height: 44rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.red {
				color: #ff4d4f;
			}

			.coupon-remark {
				// box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				border-radius: 8rpx;
				font-size: 20rpx;
				font-weight: 400;
				line-height: 44rpx;
				color: rgba(153, 153, 153, 1);
				span {
					line-height: 28rpx;
					border-radius: 4rpx;
					padding: 0 12rpx;
					border: 1rpx solid rgba(255, 77, 79, 1);
					color: rgba(255, 77, 79, 1);
					font-size: 20rpx;
					display: inline-block;
				}
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
					}
				}
			}
		}
		.line {
			padding: 20rpx 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 34rpx;
			color: #666666;
			span {
				width: 8rpx;
				height: 8rpx;
				background: #666666;
				border-radius: 50%;
			}
		}
		.shop-list {
			background: #fff;
			.shop-box {
				display: flex;
				justify-content: flex-start;
				padding: 32rpx;
				// border-bottom: 2rpx solid rgba(226, 226, 226, 1);

				image {
					width: 168rpx;
					height: 168rpx;
					margin-right: 20rpx;
					border-radius: 8rpx;
				}

				.shop-info {
					position: relative;
					flex: 1;

					.shop-name {
						height: 40rpx;
						font-size: 28rpx;
						font-weight: bold;
						line-height: 40rpx;
						color: rgba(0, 0, 0, 1);
						opacity: 1;
						margin-top: 8rpx;
						margin-bottom: 4rpx;
					}

					.shop-address {
						font-size: 20rpx;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
						opacity: 1;

						.tag-text {
							font-weight: 500;
							color: #ff0000;
						}

						.text {
							font-weight: bold;
							padding-right: 10rpx;
							border-right: 2rpx solid #666666;
						}
					}
				}

				.shop-btn-box {
					position: absolute;
					right: 0;
					bottom: 0;
					display: flex;
					justify-content: flex-end;

					.span-style1 {
						font-size: 24rpx;
						color: #e5cda1;
						width: 108rpx;
						height: 44rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: rgba(255, 255, 255, 1);
						border: 2rpx solid#E5CDA1;
						opacity: 1;
						border-radius: 4rpx;
					}

					.span-style2 {
						font-size: 24rpx;
						color: #343434;
						width: 108rpx;
						height: 44rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #e5cda1;
						border: 2rpx solid#E5CDA1;
						opacity: 1;
						border-radius: 4rpx;
					}
				}
			}
		}
		.nomore {
			width: 100vw !important;
			color: #999999;
			text-align: center;
			font-size: 20rpx;
			margin-bottom: 20rpx;
			position: relative;
			&::after,
			&::before {
				content: "";
				position: absolute;
				top: 50%;
				background: #dddddd;
				height: 2rpx;
				width: 35%;
			}
			&::after {
				left: 40rpx;
			}
			&::before {
				right: 40rpx;
			}
		}
	}
	.mask-slot {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #333333;
		width: 608rpx;
		height: 540rpx;
		background: #fff;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		> view {
			&:nth-child(1) {
				margin: 0 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				height: 400rpx;
				> view {
					&:nth-child(1) {
						padding: 52rpx 0 20rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 40rpx;
						color: #333333;
					}
					&:nth-child(2) {
						height: 56rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 56rpx;
						color: #333333;
					}
				}
				image {
					margin: 52rpx 0 20rpx;
					width: 277rpx;
					height: 200rpx;
				}
			}
			&:nth-child(2) {
				height: 140rpx;
				display: flex;
				justify-content: space-around;
				align-content: center;
				font-weight: 500;
				font-size: 36rpx;
				color: #666666;
				> view {
					font-size: 36rpx;
					height: 100rpx;
					width: 274rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: blod;
					border-radius: 8rpx;
					&:nth-child(1) {
						background: #343434;
						color: #fff;
					}
					&:nth-child(2) {
						background: #e5cda1;
						color: #343434;
					}
				}
			}
		}
	}
}
</style>
