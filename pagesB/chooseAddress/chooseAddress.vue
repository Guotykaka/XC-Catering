<template>
	<view class="container" style="height: 100vh">
		<view class="search-box">
			<u-search
				placeholder="请输入您的收货地址"
				:show-action="false"
				shape="square"
				height="80"
				bg-color="#F9F9F9"
				@search="searchFuc"
				@change="searchFuc"
				@focus="focusSearch = true"
				@blur="focusSearch = false"
				v-model="searchText"
			></u-search>
		</view>
		<view v-if="searchText == '' && mapCtx">
			<view class="map-box">
				<map
					id="mapCtx"
					:longitude="longitude || curLocation.longitude"
					:latitude="latitude || curLocation.latitude"
					scale="14"
					:markers="markers"
					bindmarkertap="markertap"
					:polyline="polyline"
					:circles="circle"
					bindregionchange="regionchange"
					style="width: 100%; height: 100%"
					@regionchange="regionchange"
				>
					<!-- show-location -->
					<!-- :include-points="markers" -->
					<cover-view class="cover-view">
						<cover-image src="../../static/img/location.png"></cover-image>
					</cover-view>
					<cover-view class="cover-view-now" @tap="fixedPosition()">
						<cover-image src="../../static/img/focu.png"></cover-image>
					</cover-view>
				</map>
			</view>
			<view class="list-box">
				<scroll-view scroll-y @scrolltoupper="upper" @scroll="scroll" class="scroll-view" :scroll-top="0">
					<view :class="[{ active: item.active }, 'scro-box']" v-for="(item, index) in currentList" :key="index" @tap="tapAdreess(item)">
						<view class="scro-title"><text v-if="!index">[当前]</text>{{ item.title }}</view>
						<view class="scro-address">{{ item.address }}</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-else class="ser-box">
			<view v-if="searchText !== '' && searchResults.length == 0" class="ser-none"> 搜索不到该地址，换个地方试试？ </view>
			<scroll-view v-else scroll-y @scrolltoupper="upper" @scroll="scroll" class="scroll-view" :scroll-top="0">
				<view :class="[{ active: item.active }, 'scro-box']" v-for="(item, index) in searchResults" :key="index" @tap="tapAdreess(item)">
					<view class="scro-title"
						><text>{{ item.title }}</text
						><text>{{ item.distance }}</text></view
					>
					<view class="scro-address">{{ item.address }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import QQMapWX from "@/utils/qqmap-wx-jssdk.min.js";
import store from "@/store";
export default {
	data() {
		return {
			range: 0,
			latitude: 0,
			longitude: 0,
			focusSearch: false,
			qqmapsdk: "",
			currentCity: "",
			searchText: "",
			location: [],
			searchResults: [],
			currentList: [],
			mapCtx: null,
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
			polyline: [
				{
					points: [
						{
							longitude: 113.3245211,
							latitude: 23.10229,
						},
						{
							longitude: 113.32452,
							latitude: 23.21229,
						},
					],
					color: "#E5CDA1",
					width: 2,
					dottedLine: true,
				},
			],
			circle: [
				{
					longitude: 113,
					latitude: 23,
					color: "#E5CDA1",
					fillColor: "#ffffff00",
					radius: 1000,
					strokeWidth: 10,
				},
			],
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
			shopList: [],
		};
	},
	onReady(e) {
		// 使用 wx.createMapContext 获取 map 上下文
		this.mapCtx = uni.createMapContext("mapCtx");
	},
	async onLoad(query) {
		let res = await store.dispatch("GetRange", {});
		this.range = res?.data ?? 5000;
		this.qqmapsdk = new QQMapWX({
			key: "AVFBZ-36ERX-NIL44-7HAJB-JWVNQ-YEBMA",
		});
		// if (query.LOC !== "") {
		// 	this.getGeocoder(query.LOC);
		// } else {
		// 	this.getLocationInfo();
		// }
		if (query.location !== "") {
			const location = {
				longitude: query.location.split(",")[0] * 1 || 0,
				latitude: query.location.split(",")[1] * 1 || 0,
			};
			this.getLocationInfo(location);
		} else {
			this.getLocationInfo();
		}
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
		getPOIList(loc) {
			const that = this;
			this.qqmapsdk.reverseGeocoder({
				location: {
					...loc,
				},
				get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认)
				poi_options:
					"radius=500;page_size=20;page_index=1;policy=2;category=住宅区,美食,公司企业,购物,娱乐休闲,医疗保健,酒店宾馆,旅游景点,文化场馆,银行金融,教育学校",
				/**policy=1[默认] 以地标+主要的路+近距离poi为主，着力描述当前位置；
						policy=2 到家场景：筛选合适收货的poi，并会细化收货地址，精确到楼栋；
						policy=3 出行场景：过滤掉车辆不易到达的POI(如一些景区内POI)，增加道路出路口、交叉口、大区域出入口类POI，排序会根据真实API大用户的	用户点击自动优化。 */
				success: function (res) {
					that.currentList = [];
					that.currentCity = res.result.address_component.city;
					console.log("getPOIList -> that.range", that.range);
					if (!res?.result.formatted_addresses) return;
					that.currentList.push({
						title: res.result.formatted_addresses.recommend,
						address: res.result.address,
						province: res.result.address_component.province,
						city: res.result.address_component.city,
						district: res.result.address_component.district,
						location: res.result.location,
						distance: Number(that.juli(that.latitude, that.longitude, res.result.location.lat, res.result.location.lng)).toFixed(1) + "公里",
						active: that.circle.some(
							ele => Number(that.juli(ele.latitude, ele.longitude, res.result.location.lat, res.result.location.lng)) < that.range / 1000
						),
					});
					res.result.pois.forEach(element => {
						that.currentList.push({
							title: element.title,
							address: element.address,
							province: element.ad_info.province,
							city: element.ad_info.city,
							district: element.ad_info.district,
							location: element.location,
							distance: Number(that.juli(that.latitude, that.longitude, element.location.lat, element.location.lng)).toFixed(1) + "公里",
							active: that.circle.some(
								ele => Number(that.juli(ele.latitude, ele.longitude, element.location.lat, element.location.lng)) < that.range / 1000
							),
						});
					});
				},
				fail: function (res) {},
				complete: function (res) {},
			});
		},
		getSuggestion(locationStr = "") {
			const that = this;
			uni.request({
				url: "https://apis.map.qq.com/ws/place/v1/suggestion",
				data: {
					keyword: that.searchText,
					region: "",
					region_fix: 0, //	0：[默认]当前城市无结果时，自动扩大范围到全国匹配,1：固定在当前城市
					location: locationStr,
					policy: 1,
					key: "AVFBZ-36ERX-NIL44-7HAJB-JWVNQ-YEBMA",
					page_index: 1,
					page_size: 20,
				},
				success: res => {
					that.searchResults = [];
					const obj = res.data?.data ?? [];
					obj.forEach(element => {
						that.searchResults.push({
							title: element.title,
							address: element.address,
							province: element.province,
							city: element.city,
							district: element.district,
							location: element.location,
							distance: Number(that.juli(that.latitude, that.longitude, element.location.lat, element.location.lng)).toFixed(1) + "公里",
							active: that.circle.some(
								ele => Number(that.juli(ele.latitude, ele.longitude, element.location.lat, element.location.lng)) < that.range / 1000
							),
						});
					});
				},
			});
		},
		regionchange() {
			//拖动地图
			const that = this;
			this.mapCtx.getCenterLocation({
				success: res => {
					that.getPOIList(res);
				},
			});
		},
		juli(lat1, lng1, lat2, lng2) {
			var radLat1 = (lat1 * Math.PI) / 180.0;
			var radLat2 = (lat2 * Math.PI) / 180.0;
			var a = radLat1 - radLat2;
			var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
			var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
			s = s * 6378.137;
			s = Math.round(s * 10000) / 10000;
			return s;
		},
		tapAdreess(it) {
			console.log("tapAdreess -> it", it);
			if (!it.active) {
				uni.showToast({
					icon: "none",
					mask: true,
					title: "该地址不在配送范围",
					duration: 1000,
				});
				return;
			}
			const pages = getCurrentPages();
			const lastpage = pages[pages.length - 2];
			lastpage.setData({
				adrN: {
					province: it.province,
					city: it.city,
					area: it.district,
					location: `${it.location.lng},${it.location.lat}`,
					// 	longitude: e.item.location.split(",")[0] * 1,
					// latitude: e.item.location.split(",")[1] * 1,
				},
				addressN: it.title,
			});
			uni.navigateBack({
				delta: 1,
			});
		},
		searchFuc(val) {
			this.getSuggestion(`${this.curLocation.latitude || this.latitude},${this.curLocation.longitude || this.longitude}`);
		},
		getStoreList() {
			let that = this;
			that.markers = [];
			let params = {
				userLatitude: that.latitude * 1,
				userLongitude: that.longitude * 1,
				storeName: that.storeName,
			};
			let successFuc = res => {
				const unary = fn => val => fn(val);
				res.data.forEach((item, i) => {
					let location = item.location.split(",").map(unary(parseFloat));
					that.circle.push({
						longitude: location[0],
						latitude: location[1],
						color: "#00ff0000",
						fillColor: "#00ff0011",
						radius: that.range,
						strokeWidth: 0,
					});
					that.markers.push({
						iconPath: "/static/img/marker.png",
						id: i,
						zIndex: 100,
						longitude: location[0],
						latitude: location[1],
						width: 22,
						height: 29,
						title: item.storeName,
					});
				});
			};
			AjaxApi("GetStoreList", params, successFuc);
		},
		getGeocoder(address) {
			const that = this;
			this.qqmapsdk.geocoder({
				address: address,
				success: function (res) {
					that.latitude = res.result.location.lat;
					that.longitude = res.result.location.lng;
					that.getPOIList({
						longitude: res.result.location.lng,
						latitude: res.result.location.lat,
					});
					that.getStoreList();
				},
				fail: function (res) {},
				complete: function (res) {},
			});
		},
		getLocationInfo(location = "") {
			//获取地理位置
			let that = this;
			if (location) {
				that.latitude = location.latitude.toString();
				that.longitude = location.longitude.toString();
				that.curLocation = {
					longitude: location.longitude,
					latitude: location.latitude,
				};
				that.getPOIList(that.curLocation);
				that.getStoreList();
				return;
			}
			uni.getLocation({
				// type: "wgs84 ",
				type: "gcj02",
				success(res) {
					that.latitude = res.latitude.toString();
					that.longitude = res.longitude.toString();
					that.curLocation = {
						longitude: res.longitude,
						latitude: res.latitude,
					};
					that.getPOIList(that.curLocation);
					that.getStoreList();
				},
				fail(res) {},
			});
		},
		fixedPosition() {
			let that = this;
			uni.getSetting({
				success(res) {
					if (res.authSetting["scope.userLocation"]) {
						uni.getLocation({
							type: "gcj02",
							success(res) {
								that.latitude = res.latitude.toString();
								that.longitude = res.longitude.toString();
								that.curLocation = {
									longitude: res.longitude,
									latitude: res.latitude,
								};
								that.mapCtx.moveToLocation({
									longitude: res.longitude,
									latitude: res.latitude,
								});
								that.getPOIList(that.curLocation);
							},
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
		position: relative;
		height: calc(100vh - 700rpx);
		width: 100%;
		.cover-view {
			width: 46rpx;
			height: 46rpx;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
		.cover-view-now {
			width: 46rpx;
			height: 46rpx;
			background: #fff;
			border-radius: 8rpx;
			position: absolute;
			right: 40rpx;
			bottom: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			cover-image {
				width: 70%;
				height: 70%;
			}
		}
	}
	.list-box {
		.scroll-view {
			width: auto;
			margin: 0rpx 44rpx;
			height: 600rpx;
			display: flex;
			flex-direction: column;
			.scro-box {
				display: flex;
				flex-direction: column;
				padding: 24rpx 0;
				border-bottom: 2rpx solid #eee;
				&.active {
					color: #000;
					.scro-title {
						color: #000;
					}
				}
				.scro-title {
					color: #999999;
					font-size: 28rpx;
					text {
						color: #228b22;
					}
				}
				.scro-address {
					color: #999999;
					margin-top: 12rpx;
					font-size: 24rpx;
				}
			}
		}
	}
	.ser-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: auto;
		padding: 0rpx 44rpx;
		justify-content: center;
		height: calc(100vh - 100rpx);
		.scroll-view {
			width: 100%;
			margin: 0rpx 44rpx;
			height: calc(100vh - 100rpx);
			display: flex;
			flex-direction: column;
			.scro-box {
				display: flex;
				flex-direction: column;
				padding: 24rpx 0;
				border-bottom: 2rpx solid #eee;
				&.active {
					color: #000;
					.scro-title {
						color: #000;
					}
				}
				.scro-title {
					display: flex;
					justify-content: space-between;
					color: #999999;
					font-size: 28rpx;
				}
				.scro-address {
					color: #999999;
					margin-top: 12rpx;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
