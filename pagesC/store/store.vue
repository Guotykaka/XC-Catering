<template>
	<view class="index">
		<!-- <u-navbar :border-bottom="false" :is-back="false" title=" " :is-fixed="true"> </u-navbar> -->
		<!-- 弹窗 -->
		<ScanCoupon :scanMask="scanMask" :scanType="scanType" :list="scanCouponList" :mark="scanCouponMark" @inVite="hideScan"></ScanCoupon>
		<u-mask class="load-mask" :show="loadingMask" z-index="10090" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<image class="banner-img" src="https://oss.dianddian.cn/common/ddd_log.png" mode="aspectFill"></image>
		</u-mask>
		<view v-if="!loadingMask">
			<InviteCode :inviteMask="inviteMask" :inviteLoading="inviteLoading" :maxAmount="maxAmount" @inVite="hideInvite"></InviteCode>
			<official-account style="height: 200rpx" v-if="wxPublicNumberAppid()"></official-account>
			<view class="search-box">
				<u-search
					:clearabled="true"
					shape="square"
					:disabled="true"
					placeholder="搜索商家或商品名称"
					:show-action="false"
					@click="searchStore"
					height="80"
					bg-color="#F9F9F9"
				></u-search>
			</view>
			<view class="u-p-20 bg-white">
				<view class="banner">
					<swiper
						class="swiper u-skeleton-rect"
						:indicator-dots="true"
						:autoplay="true"
						interval="3000"
						duration="300"
						indicator-color="rgba(255, 255, 255, 0.34)"
						indicator-active-color="#FFFFFF"
					>
						<swiper-item v-if="bannerList.length == 0">
							<view class="swiper-item uni-bg-red">
								<image class="banner-img" src="https://oss.dianddian.cn/v2/activity/goods-img.png" mode="aspectFill"></image>
							</view>
						</swiper-item>
						<swiper-item v-else v-for="(item, i) in bannerList" :key="i" @tap="tabBanner(item)">
							<view class="swiper-item uni-bg-red">
								<image class="banner-img" :src="item.imgUrl" mode="aspectFill"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<view class="u-font-32 current-store" v-if="shoppingMode">
				<view @click="chooseStore">
					<view class="u-line-1">
						<u-icon name="map" class="u-m-l-20 u-m-r-12"></u-icon> {{ currentStore.storeName }}
						<u-icon name="arrow-right" class="u-m-l-16"></u-icon>
					</view>
					<view class="u-m-l-60"> 距离您 {{ currentStore.distance1 }}</view>
				</view>
				<view :class="[{ active: currentStore.isCollect == 0 }, 'u-m-r-60']" @tap="doCollect">
					<text class="iconfont iconxinshixin u-m-r-12 u-font-32"></text>
					{{ currentStore.isCollect == 0 ? "已收藏" : "收藏" }}
				</view>
			</view>
			<view class="recomm-box" v-if="recommendShop.length > 0">
				<view class="recomm-name">推荐商户</view>
				<scroll-view scroll-x="true" class="scroll-x">
					<view class="recomm">
						<view class="recomm-item" v-for="(item, index) in recommendShop" :key="index" @click="jumpShop(item)">
							<u-image v-if="item.shopLogo" :src="item.shopLogo" width="160" height="160" border-radius="8"></u-image>
							<u-image v-else :src="shopImg" width="160" height="160" border-radius="8"></u-image>
							<view class="item-name u-line-2">{{ item.shopName }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<scroll-view scroll-x class="scroll-view" :style="{ top: shoppingMode ? '60rpx' : '-2rpx' }">
				<view class="u-relative">
					<view class="tab-item" :class="{ active: index === current }" v-for="(i, index) in typeList" :key="index" @click="tabChange(index)">
						<image :src="i.label" v-if="stickyShow"></image>
						<text>{{ i.remark }}</text>
					</view>
				</view>
			</scroll-view>
			<view class="filter-box">
				<view style="width: 450rpx">
					<u-tabs
						:list="list"
						:is-scroll="false"
						height="88"
						bar-height="4"
						bar-width="40"
						active-color="#ceae73"
						:current="currentType"
						@change="change"
					></u-tabs>
				</view>
			</view>
			<view class="u-m-t-20 u-m-b-20" style="min-height: 290rpx; background: #f9fafb" v-if="shopList.length">
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
		<view class="car-box" @click="jumpShopingCar">
			<image src="https://oss.dianddian.cn/v2/shopping_car.png"></image>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { appInit, paramConversion, getObjType } from "@/utils";
import inviteCode from "../../components/u-act/u-act";
import scanCoupon from "../../components/scancoupon/scancoupon";
import store from "@/store";
export default {
	components: {
		scanCoupon,
		inviteCode,
	},
	data() {
		return {
			scanCouponList: [], //扫码进店红包列表
			scanCouponMark: "",
			scanMask: false, //扫码弹窗
			scanType: 0, //扫码红包类别
			current: 0, //当前高亮的店铺类别
			shareId: 0,
			tabIndex: 0,
			maxAmount: 0,
			currentType: 0,
			tableId: null,
			isOpen: false,
			pageDown: true, //翻页标识
			inviteMask: false, //助力loading
			stickyShow: true,
			loadingMask: true,
			inviteLoading: false, //助力
			shoppingMode: getApp().globalData.shoppingMode,
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
			typeList: [],
			shopList: [], //当前门店店铺列表
			shareList: [],
			bannerList: [], //店铺banner图列表
			recommendShop: [],
			shopImg: getApp().globalData.shopImg, //默认店铺图片
			search: {
				saleStoreId: "",
				pageIndex: 1,
				pageSize: 10,
				sortDistance: null,
				sortSaleCount: null,
			},
			redPackage: {
				amount: 0,
				isHidden: false,
				isHiddenPlat: false,
				redPacketName: {},
			},
			currentStore: {
				storeName: "",
				distance1: "",
				isCollect: 0,
				storeId: 0,
				storeName: "******",
			}, //当前门店信息
			deliveryText: {
				0: "",
				1: "自配送",
				2: "达达专送",
				3: "蜂鸟专送",
				4: "顺丰专送",
			},
		};
	},
	onPageScroll: function (e) {
		if (e.scrollTop > 390 && e.scrollTop < 480) return;
		this.stickyShow = e.scrollTop < 390;
	},
	onShareTimeline: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
		};
	},
	onShareAppMessage: function (res) {
		if (res.from === "button") {
			return {
				title: "帮我助力，你也得红包",
				imageUrl: "https://oss.dianddian.cn/activity/zhuli/zhuli_top_1.png?x-oss-process=image/resize,w_700",
				path: `/pagesC/sharingInvite/sharingInvite?shareId=${this.shareId}`,
			};
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},
	onHide() {
		this.inviteMask = false;
		uni.hideLoading();
	},
	onReachBottom(e) {
		if (getApp().globalData.shoppingMode || !this.pageDown) return;
		this.search.pageIndex++;
		this.getStorePage(this.typeList[this.current].value);
	},
	onLoad(id) {
		let fuc = async () => {
			this.currentStore = id;
			if (id?.q) {
				let link = paramConversion(decodeURIComponent(id?.q));
				this.currentStore.storeId = link.storeId;
				this.tableId = link?.tableId ?? null;
				this.getScanCoupon();
			} else if (!id?.storeId) {
				let GetStore = await store.dispatch("GetStore", {
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1,
				});
				this.currentStore = GetStore.data;
			}
			this.loadingMask = true;
			uni.setNavigationBarTitle({
				title: `${getApp().globalData.shoppingMode ? "到店" : "外卖"}点餐`,
			});
			this.search.saleStoreId = this.currentStore.storeId;
			this.init();
		};
		appInit(fuc);
	},
	onPullDownRefresh() {
		let page = getCurrentPages().pop(); //获取当前页面实例
		if (page == undefined || page == null) return;
		page.onLoad();
	},
	methods: {
		async init() {
			let proList = [
				store.dispatch("SelectShopTypeList", {}), //
				store.dispatch("GetBanner", {
					platType: this.shoppingMode ? 1 : 0,
					...(!this.shoppingMode ? {} : { storeId: this.currentStore.storeId }), //平台类型；0：平台；1：门店
				}),
				store.dispatch("SearchStore", {
					storeId: this.currentStore.storeId,
					userLatitude: getApp().globalData.location.latitude,
					userLongitude: getApp().globalData.location.longitude,
				}), //
			];
			let thenFuc = async res => {
				let resArr = res.map(a => a.data);
				this.typeList = resArr[0] ?? {};
				this.bannerList = resArr[1] ?? [];
				this.currentStore = resArr[2]?.storeId ? resArr[2] : this.currentStore;
				let id = !getApp().globalData.shoppingMode ? 0 : this.currentStore.storeId;
				let recommendShop = await store.dispatch("SelectShopRecommendList", { storeId: id });
				this.recommendShop = recommendShop.data;
				this.getStorePage(this.typeList[0].value);
			};
			let catchFuc = err => {
				this.loadingMask = false;
				if (err == 1001) this.init();
			};
			PromiseAll(proList, thenFuc, catchFuc);
		},
		hideScan() {
			this.scanMask = false;
		},
		getScanCoupon() {
			// "type",value="类型,0:门店,1:店铺")
			const params = {
				relationId: this.currentStore.storeId,
				type: 0,
			};
			const successFuc = res => {
				if (res.code === 81201 || res.code === 81202 || res.code === 81203 || res.code === 81204) return;
				this.scanType = res.data?.length ? 1 : 0;
				this.scanCouponList = res.data;
				this.scanCouponMark = res.msg;
				this.scanMask = true;
			};
			AjaxApi("TakeRedPacketPin", params, successFuc);
		},
		async getStorePage(val) {
			// delete this.search.name
			//获取店铺列表
			let params = {};
			params = {
				saleStoreId: this.currentStore.storeId,
				shopType: val,
				type: getApp().globalData.shoppingMode == 1 ? 0 : 1,
				sortDistance: this.search.sortDistance,
				sortSaleCount: this.search.sortSaleCount,
				userLatitude: getApp().globalData.location.latitude,
				userLongitude: getApp().globalData.location.longitude,
			};
			if (!this.shoppingMode) {
				params.pageIndex = this.search.pageIndex;
				params.pageSize = this.search.pageSize;
			}
			let res = await store.dispatch(this.shoppingMode ? "GetSelectShopPage" : "GetSelectShop", params);
			if (!this.shoppingMode) {
				this.shopList = (this.search.pageIndex == 1 ? [] : this.shopList).concat(
					res.data.records.map(el => {
						console.log("🚀 ~ file: store.vue ~ line 389 ~ onLoad ~ getApp().globalData.location", getApp().globalData.location);
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

			this.loadingMask = false;
			uni.hideLoading();
		},
		itClick(i) {
			this.shopList[i].click = !this.shopList[i].click;
		},
		change(e) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.currentType = e;
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
			this.search.pageIndex = 1;
			this.getStorePage(this.typeList[this.current].value);
		},
		doCollect() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			const params = { relationId: this.currentStore.storeId, type: 0 }; //0:门店,1:店铺
			let successFuc = res => {
				this.currentStore.isCollect = !this.currentStore.isCollect;
			};
			AjaxApi("DoCollect", params, successFuc);
		},
		jumpShop(val) {
			this.currentShop = val;
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
		async getInvite() {
			this.inviteMask = true;
			this.inviteLoading = true;
			let sucFuc = res => {
				this.inviteLoading = false;
				this.shareId = res.data.id;
				this.maxAmount = res.data.maxAmount;
			};
			let elseF = () => {
				this.inviteMask = false;
				uni.showToast({
					title: "创建分享活动失败!",
					icon: "none",
					mask: true,
					duration: 2000,
				});
			};
			let AuthCoupon = await store.dispatch("AuthCoupon", {});
			if (AuthCoupon.code !== 0) {
				while (that.counter < 3) {
					that.counter++;
					AuthCoupon = await store.dispatch("AuthCoupon", {});
					if (AuthCoupon.code == 0) break;
				}
				uni.hideLoading();
				if (AuthCoupon.code == 0) return;
				this.inviteMask = false;
				uni.showToast({
					title: "获取领取资格验证失败！",
					icon: "none",
					mask: true,
					duration: 2000000,
				});
				return;
			}
			AjaxApi(
				"SetInviteShare",
				{
					header: { idem_token: AuthCoupon.data },
				},
				sucFuc,
				elseF
			);
		},
		tabBanner(it) {
			switch (it.jumpType) {
				//跳转类型；0：小程序；1：图片；2：H5 ;3: 弹窗
				case "0":
					if (it.jumpUrl.split("?")[1]) {
						const URL = it.jumpUrl.split("?")[0];
						if (URL == "/pages/home/home") {
							const STR = JSON.parse(it.jumpUrl.split("?")[1]);
							const inx = this.shopList.findIndex(item => item.shopId == STR.shopId);
							uni.navigateTo({
								url: `/pages/home/home?shopId=${STR.shopId}`,
							});
						} else {
							uni.navigateTo({
								url: `${it.jumpUrl}`,
								fail(res) {
									uni.switchTab({
										url: URL,
										fail(res) {},
									});
								},
							});
						}
						return;
					}
					uni.navigateTo({
						url: `${it.jumpUrl}`,
						fail(res) {
							uni.switchTab({
								url: `${it.jumpUrl}`,
								fail(res) {},
							});
						},
					});
					break;
				case "1":
					uni.navigateTo({
						url: `/pagesB/propaganda/propaganda?url=${it.jumpUrl}&type=${it.jumpType}`,
					});
					break;
				case "2":
					uni.navigateTo({
						url: `/pagesB/propaganda/propaganda?url=${it.jumpUrl}&type=${it.jumpType}`,
					});
					break;
				case "3":
					const activityFuc = it.jumpUrl;
					this[activityFuc]();
					break;
				default:
					break;
			}
		},
		hideInvite() {
			this.inviteMask = false;
			this.inviteLoading = false;
		},
		// 点击某一个tab菜单
		tabChange(index) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.current = index;
			this.search.pageIndex = 1;
			this.getStorePage(this.typeList[index].value);
		},
		chooseStore() {
			uni.navigateTo({
				url: "/pagesA/shopList/shopList",
			});
		},
		searchStore() {
			uni.navigateTo({
				url: `/pagesB/searchList/searchList`,
			});
		},
		jumpShopingCar() {
			uni.showLoading({
				title: "正在跳转",
				mask: true,
			});
			uni.navigateTo({
				url: `/pagesC/shopCar/shopCar`,
				success() {
					uni.hideLoading();
				},
			});
		},
		wxPublicNumberAppid() {
			return Boolean(!getApp().globalData.wxPublicNumberAppid);
		},
	},
};
</script>

<style lang="scss" scoped>
.index {
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
	.search-box {
		background: #fff;
		padding: 10rpx 40rpx;
	}
	.bg-white {
		background-color: #fff;
	}
	.banner {
		.swiper {
			height: 220rpx;
		}
		.banner-img {
			width: 710rpx;
			height: 220rpx;
			background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
			box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
			opacity: 1;
			border-radius: 8rpx;
		}
	}
	.filter-box {
		background: #fff;
		line-height: 40rpx;
	}
	.current-store {
		position: sticky;
		top: 0rpx;
		z-index: 900;
		background-color: #fff;
		padding-top: 20rpx;
		min-height: 120rpx;
		display: flex;
		> view {
			&:first-child {
				flex: 1;
				width: 0;
				display: flex;
				flex-direction: column;
			}
			> view {
				&:last-child {
					font-size: 24rpx;
					line-height: 40rpx;
					color: #666666;
				}
			}
			&:last-child {
				.iconfont {
					font-size: 24rpx;
				}
				text-align: right;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #666666;
				&.active {
					color: #ff4d4f;
				}
			}
		}
	}
	.recomm-box {
		background: #ffffff;
		width: 100vw;
		// margin-bottom: 20rpx;
		// padding-bottom: 62rpx;
		.recomm-name {
			background: #ffffff;
			font-size: 30rpx;
			font-weight: bold;
			line-height: 42rpx;
			color: #333333;
			padding: 20rpx;
		}
		.recomm {
			display: inline-flex;
			.recomm-item {
				width: 160rpx;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				margin-left: 24rpx;
				margin-bottom: 22rpx;
				&:first-child {
					margin-left: 20rpx;
				}
				&:last-child {
					margin-right: 20rpx;
				}
				.item-name {
					font-size: 24rpx;
					font-weight: 400;
					line-height: 32rpx;
					color: #333333;
					margin: 12rpx 12rpx 0 4rpx;
					word-wrap: break-word;
					word-break: normal;
				}
			}
		}
	}
	.scroll-view {
		position: sticky;
		z-index: 900;
		width: 100%;
		white-space: nowrap;
		background-color: #fff;
		.tab-item {
			display: inline-flex;
			flex-flow: column;
			align-items: center;
			padding: 28rpx 24rpx 0;
			font-size: 30rpx;
			&.active {
				color: #ceae73;
				font-weight: bold;
			}
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				margin-bottom: 16rpx;
			}
			text {
				display: inline-block;
				padding-bottom: 28rpx;
			}
		}
	}
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
	.car-box {
		position: fixed;
		bottom: 174rpx;
		right: 14rpx;
		width: 88rpx;
		height: 88rpx;
		background: #ffffff;
		box-shadow: 0px 3px 10px rgba(197, 202, 213, 0.3);
		border-radius: 50%;
		opacity: 1;
		z-index: 1000;
		image {
			width: 88rpx;
			height: 88rpx;
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
