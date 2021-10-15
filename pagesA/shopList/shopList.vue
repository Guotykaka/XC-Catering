<template>
	<view class="container" style="height: 100vh">
		<view class="search-box">
			<u-search placeholder="请输入门店名称" :show-action="false" shape="square" height="80" bg-color="#F9F9F9" @search="searchStore"></u-search>
		</view>
		<view class="map-box" v-if="mapCtx">
			<map
				id="mapCtx"
				:longitude="curLocation.longitude"
				:latitude="curLocation.latitude"
				scale="11"
				:markers="markers"
				:include-points="markers"
				bindmarkertap="markertap"
				:polyline="polyline"
				bindregionchange="regionchange"
				style="width: 100%; height: 100%"
			>
				<cover-view class="cover-view" v-if="show_cover" @tap="getAuthorizeInfo()">
					<cover-image src="../../static/img/location.png"></cover-image>
					<cover-view>点击设置您的定位权限</cover-view>
				</cover-view>
			</map>
		</view>
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
		<view class="shop-list-box">
			<view class="shop-list">
				<scroll-view scroll-y @scrolltoupper="upper" @scroll="scroll" class="scroll-view" :scroll-top="0">
					<view class="shop-box" v-for="(item, index) in shopList" :key="index">
						<image
							:src="`${item.logo ? item.logo + '?x-oss-process=image/resize,w_700' : 'https://oss.dianddian.cn/shop/defult-store.png'}`"
							mode="aspectFill"
							@tap="jumpStore({ item })"
						></image>
						<view class="shop-info">
							<view class="shop-name">{{ item.storeName }}</view>
							<view class="shop-address">
								<text class="tag-text u-m-r-10" v-if="index == 0 && !show_cover">离我最近</text>
								<text class="text u-m-r-10" v-if="!show_cover">{{ item.distance1 }}</text>
								{{ `${item.province}${item.city}${item.area}${item.address}` }}
							</view>
							<view class="shop-btn-box">
								<view class="span-style1" v-if="!show_cover" @tap="lookMap({ item })">查看地图</view>
								<view class="span-style2 u-m-l-10" @tap="jumpStore({ item })">进店</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { BASE64 } from "@/utils";
export default {
	data() {
		return {
			show_cover: false,
			mapCtx: null,
			mapBoxActive: false,
			//当前位置
			curLocation: {},
			//缩放视野以包含所有给定的坐标点
			//标记点
			markers: [
				{
					iconPath: "/static/img/marker.png",
					id: 0,
					latitude: 23.099994,
					longitude: 113.32452,
					width: 10,
					height: 10,
				},
			],
			//路线
			polyline: [],
			shopListLength: 0,
			storeName: "",
			list: [
				{
					//tab栏
					name: "全部门店",
				},
				{
					name: "去过的店",
				},
			],
			current: 0,
			shopList: [],
			// latitude: 0,
			// longitude: 0,
		};
	},
	onReady(e) {
		// 使用 wx.createMapContext 获取 map 上下文
		this.mapCtx = uni.createMapContext("mapCtx");
	},
	onLoad() {
		this.getLocationInfo(); //获取用户授权信息
	},
	onShow() {
		this.getLocationInfo(); //获取用户授权信息
	},
	mounted() {},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		scroll(event) {},
		upper() {},
		searchStore(val) {
			this.current = 0;
			this.shopList = [];
			this.storeName = val;
			this.getStoreList();
		},
		change(e) {
			//tab栏切换
			this.current = e;
			this.shopList = [];
			if (e == 0) {
				this.getStoreList();
			} else {
				this.getHistoryList();
			}
		},
		lookMap(e) {
			//查看门店地图
			const LOC = {
				longitude: e.item.location.split(",")[0] * 1,
				latitude: e.item.location.split(",")[1] * 1,
			};
			this.mapCtx.moveToLocation(LOC);
			this.polyline = [
				{
					points: [this.curLocation, LOC],
					color: "#E5CDA1",
					width: 2,
					dottedLine: true,
				},
			];
		},
		jumpStore(e) {
			uni.showLoading({
				title: "正在跳转",
				mask: true,
			});
			uni.navigateTo({
				url: `/pagesC/store/store?storeId=${e.item.storeId}`,
			});
			uni.hideLoading();
		},
		getHistoryList() {
			let that = this;
			let params = {
				userLatitude: this.curLocation.latitude * 1,
				userLongitude: this.curLocation.longitude * 1,
			};
			let successFuc = res => {
				that.shopList = res.data;
				that.markers = [];
				let arr = res.data.forEach((item, i) => {
					let str = item.logo.replace("https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/", "").replace("https://oss.dianddian.cn/", "");
					let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,m_fill,h_67,w_74");
					// let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,P_80");
					let iconPath = `https://oss.dianddian.cn/v2/shop_bg.png?x-oss-process=image/watermark,image_${baseStr},g_south,y_17`;
					that.markers.push({
						iconPath: iconPath,
						id: i,
						latitude: item.location.split(",")[1] * 1,
						longitude: item.location.split(",")[0] * 1,
						width: 22,
						height: 29,
						title: item.storeName,
					});
				});
				that.$nextTick(function () {
					that.shopList = arr;
				});
			};
			AjaxApi("SelectStoreForHistory", params, successFuc);
		},
		getStoreList() {
			let that = this;
			that.markers = [];
			let params = {
				userLatitude: this.curLocation.latitude ?? 0 * 1,
				userLongitude: this.curLocation.longitude ?? 0 * 1,
				storeName: this.storeName,
			};
			let successFuc = res => {
				that.shopList = res.data;
				let arr = res.data.forEach((item, i) => {
					let str = item.logo.replace("https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/", "").replace("https://oss.dianddian.cn/", "");
					let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,m_fill,h_67,w_74");
					// let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,P_80");
					let iconPath = `https://oss.dianddian.cn/v2/shop_bg.png?x-oss-process=image/watermark,image_${baseStr},g_south,y_17`;
					that.markers.push({
						iconPath: iconPath,
						id: i,
						latitude: item.location.split(",")[1] * 1,
						longitude: item.location.split(",")[0] * 1,
						width: 22,
						height: 29,
						title: item.storeName,
					});
				});
				that.$nextTick(function () {
					that.shopList = arr;
				});
			};
			AjaxApi("GetStoreList", params, successFuc);
		},
		getAuthorizeInfo() {
			//授权
			let that = this;
			uni.getSetting({
				success(res) {
					if (res.authSetting["scope.userLocation"]) {
						uni.getLocation({
							type: "gcj02",
							success(res) {},
							fail(res) {
								uni.showModal({
									title: "提示",
									content: "请先打开系统定位！",
									success: function (res) {
										if (res.confirm) {
										} else if (res.cancel) {
										}
									},
								});
							},
						});
					} else {
						uni.openSetting();
					}
				},
			});
		},
		getLocationInfo() {
			//获取地理位置
			let that = this;
			uni.getLocation({
				type: "gcj02",
				success(res) {
					that.show_cover = false;
					that.curLocation = {
						longitude: res.longitude,
						latitude: res.latitude,
					};
					that.getStoreList();
				},
				fail(res) {
					that.show_cover = true;
					that.getStoreList();
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	width: 100%;
	background-color: #f9fafb;
	.search-box {
		width: 100%;
		height: 100rpx;
		padding: 10rpx 40rpx;
		background: #fff;
	}

	.map-box {
		// height: calc(100vh - 850rpx);
		height: 380rpx;
		width: 100%;
		.cover-view {
			width: 100%;
			height: 100%;
			background: #d5d5d5;
			color: #333;
			line-height: 380rpx;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			cover-image {
				vertical-align: middle;
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
	.shop-list-box {
		background: #fff;
	}

	.shop-list {
		.scroll-view {
			width: auto;
			margin: 0rpx 44rpx;
			height: calc(100vh - 568rpx);
		}
	}

	.border-style {
		border-bottom: none;
	}

	.shop-box {
		display: flex;
		justify-content: flex-start;
		padding: 26rpx 0rpx 26rpx 0rpx;
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
</style>
