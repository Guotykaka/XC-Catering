<template>
	<view class="wrapper">
		<view class="search-box">
			<u-search
				v-model="search.name"
				:clearabled="true"
				shape="square"
				placeholder="搜索商家或商品名称"
				:show-action="false"
				@change="searchStore"
				@search="searchStore"
				@clear="searchStore"
				height="80"
				bg-color="#F9F9F9"
			></u-search>
		</view>
		<view class="filter-box">
			<view style="width: 450rpx">
				<u-tabs
					:list="list"
					:is-scroll="false"
					height="88"
					bar-height="4"
					bar-width="40"
					active-color="#E5CDA1"
					:current="current"
					@change="change"
				></u-tabs>
			</view>
		</view>
		<view class="store-box" v-if="shopList.length > 0">
			<view class="every-box bg-white" v-for="(item, index) in shopList" :key="index" @click="jumpShop(item)">
				<view class="every">
					<view style="position: relative" :style="{ opacity: !item.status ? 0.5 : 1 }">
						<view class="new-shop" v-if="item.isNewShop">新店</view>
						<view class="new-bond" v-if="item.isBrand">品牌</view>
						<u-image v-if="item.shopLogo" :src="item.shopLogo" width="156" height="156" border-radius="8"></u-image>
						<u-image v-else :src="shopImg" width="156" height="156" border-radius="8"></u-image>
					</view>
					<view class="sell-out" v-if="!item.status">休息中</view>
					<view class="u-flex-1 u-m-l-24" style="width: 0" :style="{ opacity: !item.status ? 0.5 : 1 }">
						<view>
							<view class="name u-line-1">{{ item.shopName }}</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text v-if="item.shopScore" :class="[{ red: item.shopScore }, 'u-m-r-24']">{{ `${item.shopScore}分` }}</text>
								<text>已售 {{ item.saleCount > 9999 ? "9999+" : item.saleCount }}</text>
								<text style="float: right">
									<text>{{ item.distance }}</text>
								</text>
							</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<!-- <text v-show="item.expectedTime" style="text-align: left">出餐时间{{ item.expectedTime }}分钟内</text> -->
								<text v-if="!shoppingMode" style="float: right">
									<text :class="[{ redbg: item.type == 0 }, 'delivery-type']">{{
										item.type == 0 ? "堂食" : deliveryText[item.deliveryType]
									}}</text>
								</text>
							</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-rela">
								<text class="u-m-r-24" v-if="!shoppingMode">起送￥{{ item.startDeliveryAmount }}</text>
								<text class="u-m-r-24" v-else>起点￥{{ item.buyAmount }}</text>
								<text class="u-m-r-24">
									<text v-if="!shoppingMode">{{ item.deliveryTime }}</text>
									<text v-else>出餐时间{{ item.expectedTime }}分钟内</text>
								</text>
							</view>
							<view class="u-font-24 u-tips-color u-m-b-8 u-line-1" style="width: 100%">{{ item.description || "" }}</view>
						</view>
						<view
							:class="[{ 'line-2': !item.click }, 'coupon-remark u-rela']"
							@tap.stop="itClick(index)"
							:style="{ opacity: !item.status ? 0.5 : 1 }"
						>
							<text
								v-if="
									item.activityList.length > 0 ||
									Boolean(item.marketMsg2Dto) ||
									Boolean(item.marketMsg1Dto) ||
									Boolean(item.marketMsg3Dto) ||
									Boolean(item.marketMsg4Dto)
								"
							>
								<text v-if="item.click" class="iconfont u-m-l-30 icon-arrow-up" @tap.stop="itClick(index)"></text>
								<text v-else class="iconfont u-m-l-30 icon-arrow-down" @tap.stop="itClick(index)"></text>
							</text>

							<view class="active-text1" v-if="!item.click">
								<view v-if="item.activityList.length">满{{ item.activityList[0].maxAmount }}减{{ item.activityList[0].reduceFee }}</view>
								<view v-if="item.marketMsg2Dto">新客减{{ item.marketMsg2Dto.amount }}</view>
								<view v-if="item.marketMsg1Dto">集单赠{{ item.marketMsg1Dto.amount }}</view>
								<view v-if="item.marketMsg3Dto">下单返{{ item.marketMsg3Dto.amount }}</view>
								<view v-if="item.marketMsg4Dto">配送费满{{ item.marketMsg4Dto.amount1 }}减{{ item.marketMsg4Dto.amount2 }}</view>
							</view>
							<view class="active-text" v-if="item.activityList.length && item.click">
								<view class="u-m-r-20">减</view>
								<view :class="{ 'u-line-1': !item.click }">
									<text v-for="(i, ind) in item.activityList" :key="ind">
										满{{ i.maxAmount }}减{{ i.reduceFee }}
										<text v-if="ind < item.activityList.length - 1">、</text>
									</text>
								</view>
							</view>
							<view class="active-text" v-if="item.marketMsg1Dto.str1 && item.click">
								<view class="u-m-r-20">返</view>
								<view>
									<text>
										{{ item.marketMsg1Dto.str1 }}
									</text>
								</view>
							</view>
							<view class="active-text" v-if="item.marketMsg2Dto && item.click">
								<view class="u-m-r-20">首</view>
								<view>
									<text>
										{{ item.marketMsg2Dto.str2 }}
									</text>
								</view>
							</view>
							<view class="active-text" v-if="item.marketMsg3Dto && item.click">
								<view class="u-m-r-20">赠</view>
								<view>
									<text>
										{{ item.marketMsg3Dto.str3 }}
									</text>
								</view>
							</view>
							<view class="active-text" v-if="item.marketMsg4Dto.str4 && !shoppingMode && item.click">
								<view class="u-m-r-20">配</view>
								<view>
									<text>
										{{ item.marketMsg4Dto.str4 }}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-divider color="#999999" v-if="!shoppingMode">{{ pageDown ? "下划加载更多" : "到底了" }}</u-divider>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			shopImg: getApp().globalData.shopImg, //默认店铺图片
			deliveryText: {
				0: "",
				1: "自配送",
				2: "达达专送",
				3: "蜂鸟专送",
				4: "顺丰专送",
			},
			storeId: null,
			list: [
				{
					name: "智能排序",
				},
				{
					name: "距离",
				},
				{
					name: "销量",
				},
			],
			pageDown: true,
			current: 0,
			search: {
				name: "",
				pageIndex: 1,
				pageSize: 10,
				saleStoreId: "",
				sortDistance: null,
				sortSaleCount: null,
				type: getApp().globalData.shoppingMode == 1 ? 0 : 1,
				userLatitude: getApp().globalData.location.latitude,
				userLongitude: getApp().globalData.location.longitude,
			},
			shoppingMode: getApp().globalData.shoppingMode,
			shopList: [],
			currentShop: {},
		};
	},
	onLoad(query) {
		let thisPages = getCurrentPages();
		let thisPrevPage = thisPages[thisPages.length - 2];
		this.search.saleStoreId = thisPrevPage.$vm.currentStore.storeId;
		if (!getApp().globalData.shoppingMode) {
			delete this.search.saleStoreId;
		}
		this.getStoreList();
	},
	onReachBottom(e) {
		if (getApp().globalData.shoppingMode || !this.pageDown) return;
		this.search.pageIndex++;
		this.getStoreList();
	},
	methods: {
		searchStore() {
			this.search.pageIndex = 1;
			this.getStoreList();
		},
		change(e) {
			this.current = e;
			if (e == 0) {
				this.search.sortDistance = null;
				this.search.sortSaleCount = null;
			}
			if (e == 1) {
				this.search.sortDistance = "sortDistance";
				this.search.sortSaleCount = null;
			}
			if (e == 2) {
				this.search.sortDistance = null;
				this.search.sortSaleCount = "sortSaleCount";
			}
			this.getStoreList();
		},
		getStoreList() {
			// if (!this.search.name) return;
			uni.showLoading({
				title: "获取数据",
				mask: true,
			});
			let params = {
				type: getApp().globalData.shoppingMode == 1 ? 0 : 1,
				name: this.search.name,
				sortDistance: this.search.sortDistance,
				sortSaleCount: this.search.sortSaleCount,
				userLatitude: getApp().globalData.location.latitude,
				userLongitude: getApp().globalData.location.longitude,
			};
			if (!this.shoppingMode) {
				params.pageIndex = this.search.pageIndex;
				params.pageSize = this.search.pageSize;
			} else {
				params.saleStoreId = this.search.saleStoreId;
			}
			let successFuc = res => {
				if (!this.shoppingMode) {
					this.shopList = (this.search.pageIndex == 1 ? [] : this.shopList).concat(
						res.data.records.map(el => {
							el.click = false;
							return el;
						})
					);
					this.pageDown = Boolean(res.data.pages > res.data.current);
				} else {
					this.shopList = res.data.map(el => {
						el.click = false;
						return el;
					});
				}
				uni.hideLoading();
			};
			AjaxApi(this.shoppingMode ? "GetSelectShopPage" : "GetSelectShop", params, successFuc);
		},
		jumpShop(obj) {
			this.currentShop = obj;
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
		itClick(i) {
			this.shopList[i].click = !this.shopList[i].click;
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	.search-box {
		background: #fff;
		padding: 10rpx 40rpx;
	}
	.filter-box {
		padding: 0 40rpx;
		background: #fff;
	}
	.store-box {
		padding: 20rpx;
		background: #f9fafb;

		.every-box {
			.every {
				padding: 32rpx 20rpx;
				margin-bottom: 20rpx;
				position: relative;
				display: flex;
				.delivery-type {
					padding: 0 10rpx;
					font-size: 20rpx;
					line-height: 32rpx;
					background: #e5cda120;
					font-weight: 400;
					color: #ceae73;
					&.redbg {
						background: #e5cda160;
						color: #ceae73;
					}
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
					color: rgba(153, 153, 153, 1);
					padding-right: 40rpx;
					.iconfont {
						font-size: 10rpx !important;
						position: absolute;
						top: 14rpx;
						right: 8rpx;
					}
					&.line-2 {
						max-height: 80rpx;
						overflow: hidden;
					}
					.active-text1 {
						display: flex;
						flex-wrap: wrap;
						margin-bottom: 10rpx;
						height: auto;
						view {
							line-height: 28rpx;
							padding: 0 4rpx;
							border: 1px solid #ff4d4f;
							color: #ff4d4f;
							border-radius: 4rpx;
							margin-right: 8rpx;
							box-sizing: border-box;
							font-size: 20rpx;
							margin-bottom: 10rpx;
						}
					}
					.active-text {
						display: flex;
						margin-bottom: 10rpx;
						> view {
							&:first-child {
								width: 34rpx;
								height: 34rpx;
								text-align: center;
								line-height: 34rpx;
								border-radius: 8rpx;
								font-size: 24rpx;
								background: #ff4d4f;
								color: #ffffff;
							}
							&:last-child {
								line-height: 34rpx;
								flex: 1;
								text {
									font-size: 24rpx;
								}
							}
						}
					}
				}
			}
			.active-box {
				padding-top: 14rpx;
			}
		}
	}
	.sell-out {
		position: absolute;
		right: 0;
		top: 0;
		text-align: center;
		padding: 0 12rpx 0 20rpx;
		height: 40rpx;
		color: #343434;
		background: rgba(52, 52, 52, 0.4);
		border-radius: 8rpx 0 0 30rpx;
		font-size: 20rpx;
		font-weight: bold;
		line-height: 40rpx;
	}
	.new-shop {
		z-index: 100;
		position: absolute;
		right: 0;
		top: 0;
		text-align: center;
		padding: 0 12rpx 0 20rpx;
		height: 32rpx;
		color: #fff;
		background: #ff4d4f;
		border-radius: 8rpx 0 0 30rpx;
		font-size: 20rpx;
		line-height: 32rpx;
	}
	.new-bond {
		z-index: 100;
		position: absolute;
		left: 0rpx;
		top: 0rpx;
		text-align: center;
		padding: 0 12rpx;
		height: 34rpx;
		background: linear-gradient(180deg, #e5cda1 0%, #ceae73 100%);
		box-shadow: 0rpx 10rpx 40rpx rgba(52, 52, 52, 0.2);
		border-bottom-left-radius: 40% 20%;
		border-bottom-right-radius: 40% 20%;
		color: #fff;
		font-size: 20rpx;
		line-height: 34rpx;
	}
}
</style>
