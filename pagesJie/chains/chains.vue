<template>
	<view class="content">
		<view class="search-box" v-if="tabs == 1">
			<u-search v-model="search.keyword" :clearabled="true" shape="square" placeholder="请输入店铺、商品名称" :show-action="false" @change="getGoodsList(true)" @search="getGoodsList(true)" @clear="getGoodsList(true)" height="80" bg-color="#F9F9F9"></u-search>
		</view>
		<!-- 二维码弹窗 -->
		<u-mask class="scan-mask" :show="scanPayMask" :duration="0" z-index="10090" :custom-style="{ background: 'rgba(0, 0, 0, 0.7)' }">
			<view class="scan-pay">
				<u-icon name="close" color="#ffffff" size="36" @tap="doneQr" class="closeit"></u-icon>
				<u-image width="400rpx" height="400rpx" :src="tempFilePath"></u-image>
				<view class="bold u-font-36 u-text-center u-m-t-28">{{ qrcode }}</view>
				<view class="u-font-32 u-text-center qrshop u-line-2">{{ qrshop }}</view>
			</view>
		</u-mask>
		<scroll-view :scroll-top="scroll" scroll-y="true" class="scroll-Y" :scroll-into-view="topId" @scrolltolower="lower" @scrolltoupper="upperFuc" @refresherrefresh="refreshFuc" :refresher-triggered="ifRefresh" @scroll="scrollFuc" :lower-threshold="100" scroll-with-animation refresher-enabled>
			<view class="goods-box" v-if="goodsList.length">
				<view v-for="(i, indx) in goodsList" :key="indx">
					<!-- 已参与 -->
					<view class="goods-obj" :id="!indx ? 'firstId' : ''" v-if="tabs == 3" @tap="goOrderDetail(i)">
						<view class="topview u-flex">
							<u-image width="68rpx" height="68rpx" :border-radius="10" v-if="i.shopLogo && !i.singleShop" :src="`${i.shopLogo}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
							<u-image width="68rpx" height="68rpx" :border-radius="10" v-else-if="!i.singleShop" :src="`${shopImg}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
							<view :class="[{ 'u-m-l-24': !i.singleShop }, 'u-flex u-row-between']" style="width: 100%">
								<view class="toptit">
									<view class="u-font-26" v-if="!i.singleShop">{{ i.shopName }}({{ i.storeName }})</view>
									<view class="u-font-32 bold" v-else>{{ i.activityName }}</view>
									<view class="u-font-20" style="color: #ababaf">下单时间：{{ i.createTime }}</view>
								</view>
								<view style="color: #13ec78; flex-shrink: 0" class="u-m-l-28" v-if="i.status == 0">待取货</view>
								<view style="color: #999999; flex-shrink: 0" class="u-m-l-28" v-if="i.status == 1">已完成</view>
								<view style="color: #999999; flex-shrink: 0" class="u-m-l-28" v-if="i.status == 3">已取消</view>
								<view style="color: #999999; flex-shrink: 0" class="u-m-l-28" v-if="i.status == 2">已退款</view>
								<view style="color: #f62027; flex-shrink: 0" class="u-m-l-28" v-if="i.status == -1">待付款</view>
								<!-- (-1待付款,0待核销, 1已核销, 2已退款,3已取消,) -->
							</view>
						</view>
						<view class="u-m-t-40 u-flex u-row-between">
							<view class="u-m-t-8">
								<image :src="`${i.pic}?x-oss-process=image/resize,w_700`" style="width: 240rpx; height: 180rpx; rder-radius: 8rpx" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
							</view>
							<view class="u-m-l-24" style="display: flex; flex-direction: column; justify-content: space-between; height: 180rpx; flex: 1">
								<view class="u-font-32">{{ i.goodsName }}</view>
								<view class="u-flex u-row-between">
									<view>
										<text class="u-font-24">×</text>
										<text class="u-font-32">{{ i.quantity }}</text>
									</view>
									<view>
										<text class="u-font-24 bold">¥</text>
										<text class="u-font-32 bold">{{ i.subtotal }}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="btnview u-flex u-row-between u-font-28 u-m-t-40">
							<view class="u-flex u-row-between">
								<view class="u-m-r-20 participation" @tap.stop="drawCode(i)" v-if="i.status == 0">确定取货</view>
								<view class="u-m-r-20 participation" @tap.stop="goPaycenter(i.orderId)" v-if="i.status == -1">去支付</view>
								<view class="share" @click.stop="">
									<button open-type="share" :data-type="i.id" plain="true"><text class="iconfont icon-chains-share u-m-r-12"></text>分享</button>
								</view>
							</view>
						</view>
					</view>
					<!-- 进行中和已结束 -->
					<view class="goods-obj" :id="!indx ? 'firstId' : ''" v-else @tap="goDoneDetail(i)">
						<view class="topview u-flex" v-if="!i.singleShop">
							<u-image width="68rpx" height="68rpx" :border-radius="10" v-if="i.shopLogo" :src="`${i.shopLogo}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
							<u-image width="68rpx" height="68rpx" :border-radius="10" v-else :src="`${shopImg}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
							<view class="toptit u-m-l-24">
								<view class="u-font-26">{{ i.shopName }}({{ i.storeName }})</view>
								<view class="u-font-20 history">{{ formatTime(i.startTime) }} | {{ i.recordCount }}人买过</view>
							</view>
						</view>
						<view class="topview u-flex" v-else>
							<view class="toptit">
								<view class="u-font-32 bold">{{ i.activityName }}</view>
								<view class="u-font-20 history">{{ formatTime(i.startTime) }} | {{ i.recordCount }}人买过</view>
							</view>
						</view>
						<view :class="[{ 'u-m-t-40': !i.singleShop }, 'midview']">
							<view class="u-font-32 bold" v-if="!i.singleShop">{{ i.activityName }}</view>
							<view :class="[{ 'u-m-t-20': i.singleShop }, 'midtit']">
								<view class="price">
									<text class="u-font-20">¥</text>
									<text class="u-font-32">{{ i.price }}</text>
									<text class="linethrough u-font-22 u-m-l-14">¥{{ i.basicPrice }}</text>
								</view>
								<view class="u-font-24 shop-num" @tap="turnShop(i.id)" v-if="i.singleShop">
									{{ i.shopCount }}家店可用
									<text class="iconfont icon-arrow-right u-m-l-12"></text>
								</view>
							</view>
							<view class="u-m-t-20">
								<block v-for="(it, inx) in i.pic.split(',')" :key="inx">
									<u-image width="160rpx" height="160rpx" :border-radius="10" :class="{ 'u-m-l-20': inx }" :src="`${it}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
								</block>
							</view>
						</view>
						<view class="fotview u-m-t-20 u-font-28" v-if="i.records.length && i.records.length <= 5">
							<view class="u-m-t-20" v-for="(re, rei) in i.records" :key="rei">
								<u-image width="40rpx" height="40rpx" :border-radius="20" :src="`${re.avatarUrl}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
								<view class="u-m-l-12 u-line-1">{{ re.nickName }}</view>
								<view class="u-m-l-12 u-line-1">{{ re.formatTime }}</view>
								<view class="u-line-1">{{ re.goodsName }}</view>
								<view>+{{ re.quantity || 1 }}</view>
							</view>
						</view>
						<view class="u-m-t-20 u-font-28" v-else-if="i.records.length">
							<swiper :indicator-dots="false" :circular="true" :vertical="true" :display-multiple-items="5" style="height: 320rpx" :interval="1000" autoplay>
								<swiper-item class="fotview" v-for="(re, rei) in i.records" :key="rei">
									<view>
										<u-image width="40rpx" height="40rpx" :border-radius="20" :src="`${re.avatarUrl}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></u-image>
										<view class="u-m-l-12 u-line-1">{{ re.nickName }}</view>
										<view class="u-m-l-12 u-line-1">{{ re.formatTime }}</view>
										<view class="u-line-1">{{ re.goodsName }}</view>
										<view>+{{ re.quantity || 1 }}</view>
									</view>
								</swiper-item>
							</swiper>
						</view>
						<view v-else class="u-font-24 u-m-t-40" style="color: #fe6b00; line-height: 26rpx">
							<text class="u-font-26 u-m-r-12 iconfont icon-chains-alert" style="vertical-align: middle"> </text>
							一群人正赶来接龙
						</view>
						<view class="btnview u-flex u-row-between u-font-28 u-m-t-40">
							<view class="u-flex u-row-between">
								<view class="u-m-r-20 participation" @tap.stop="updateUser" v-if="!userInfo.avatarUrl">我要接龙</view>
								<view class="u-m-r-20 participation" @tap.stop="goInfo(i.id)" v-else-if="tabs !== 2">我要接龙</view>
								<view class="share" @click.stop="">
									<button open-type="share" :data-type="i.id" plain="true"><text class="iconfont icon-chains-share u-m-r-12"></text>分享</button>
								</view>
							</view>
							<view style="color: #13ec78" v-if="i.status == 1">正在接龙</view>
							<view style="color: #999999" v-if="i.status == 2">已结束</view>
							<!-- 活动状态,0:未发布,1:进行中,2:已结束 -->
						</view>
					</view>
				</view>
			</view>
			<view v-else class="goods-else u-font-32 u-flex u-col-center u-row-center">暂无活动</view>
			<view style="height: 120rpx" v-if="goodsList.length"></view>
		</scroll-view>
		<view class="iconfont icon-chains-totop" @tap="toTop" v-if="upper"></view>
		<view class="options u-flex u-col-center u-row-around">
			<view @tap="changeOp(1)" :class="{ choose: tabs == 1 }">
				<text class="iconfont icon-chains-being"></text>
				<text class="u-m-t-8 u-font-20">进行中</text>
			</view>
			<view @tap="changeOp(3)" :class="{ choose: tabs == 3 }">
				<text class="iconfont icon-chains-already"></text>
				<text class="u-m-t-8 u-font-20">已参与</text>
			</view>
			<view @tap="changeOp(2)" :class="{ choose: tabs == 2 }">
				<text class="iconfont icon-chains-done"></text>
				<text class="u-m-t-8 u-font-20">已结束</text>
			</view>
		</view>
		<canvas class="cav" canvas-id="myQrcode" v-if="scanPayMask"></canvas>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
	import store from "@/store";
	import { getUserLocation, formatTime2 } from "@/utils";
	import drawQrcode from "@/utils/qrcode";
	export default {
		data() {
			return {
				shopImg: getApp().globalData.shopImg,
				scanPayMask: false,
				ifRefresh: false,
				scroll: 0,
				tempFilePath: "",
				qrcode: "",
				qrshop: "",
				upper: false,
				topId: "",
				phoneNumber: getApp().globalData.UserInfo.phone,
				shopImg: getApp().globalData.shopImg, //默认店铺图片
				goodsList: [],
				userInfo: {
					phone: null,
					avatarUrl: null,
				},
				search: {
					keyword: "",
					pageIndex: 1,
					pageSize: 5,
					status: 1,
				},
				pageDown: false,
				orderPara: {}, //订单信息
				shoppingMode: getApp().globalData.shoppingMode,
				tabs: 1,
			};
		},
		onShareAppMessage: function (res) {
			const that = this;
			const id = res?.target?.dataset?.type ?? 0;
			let inx = that.goodsList.findIndex(item => item.id == id);
			const activityName = that.goodsList[inx]?.activityName ?? "接龙活动";
			const activityId = that.tabs == 3 ? that.goodsList[inx].jlId : that.goodsList[inx].id;
			const pic = ((that.goodsList[inx].pic ?? "") + (that.goodsList[inx]?.bigPic ?? "")).split(",");
			let url = `${pic[0]}?x-oss-process=image/resize,w_500,h_400,m_lfit`;
			if (res.from === "button") {
				// 来自页面内转发按钮
				return {
					title: activityName,
					imageUrl: url,
					path: `/pagesJie/info/info?activityId=${activityId}`,
				};
			} else {
				return {
					title: "进入餐典到了",
					imageUrl: SHARE_URL,
					path: `/pages/index/index`,
				};
			}
		},
		onLoad(query) {
			this.tabs = (query?.tabs ?? 1) * 1;
			this.phoneNumber = getApp().globalData.UserInfo.phone;
			this.shoppingMode = getApp().globalData.shoppingMode;
		},
		onShow() {
			if (getApp().globalData.previewImage) {
				getApp().globalData.previewImage = false;
				return;
			}
			getUserLocation(this.init, true);
		},
		watch: {
			scanPayMask(newValue, oldValue) {
				if (!newValue) {
					this.tempFilePath = "";
				}
			},
		},
		methods: {
			init() {
				this.userInfo = getApp().globalData.UserInfo;
				this.search.pageIndex = 1;
				uni.showLoading({
					title: "搜索中...",
					mask: true,
				});
				let { longitude, latitude } = getApp().globalData.location;
				let proList = [
					this.tabs == 3
						? store.dispatch("GetChainsBein", {
								pageIndex: this.search.pageIndex,
								pageSize: this.search.pageSize,
						  })
						: store.dispatch("GetChains", {
								...this.search,
								userLatitude: latitude,
								userLongitude: longitude,
								status: this.tabs,
						  }),
				];
				let thenFuc = async res => {
					let resArr = res.map(a => a.data);
					let { pages, current, total } = resArr[0];
					if (this.tabs !== 3) {
						resArr[0].records.map(it => {
							it.pic = it.pic + it?.bigPic ?? "";
						});
					}
					this.goodsList = resArr[0].records;
					this.search.pageIndex = current;
					this.pageDown = Boolean(pages > current);
					this.toTop();
				};
				let catchFuc = err => {
					if (err == 1001) this.init();
				};
				PromiseAll(proList, thenFuc, catchFuc);
			},
			goDoneDetail(i) {
				if (this.tabs !== 2) return;
				this.goInfo(i.id);
			},
			getGoodsList(ifInit = false) {
				uni.showLoading({
					title: "搜索中...",
					mask: true,
				});
				let { longitude, latitude } = getApp().globalData.location;
				let params = {
					keyword: this.search.keyword,
					status: this.tabs,
					pageIndex: ifInit ? 1 : this.search.pageIndex,
					pageSize: this.search.pageSize,
					userLatitude: latitude,
					userLongitude: longitude,
				};
				let successFuc = res => {
					uni.hideLoading();
					let { pages, current, total } = res.data;
					res.data.records.map(it => {
						it.pic = it.pic + it.bigPic;
					});
					this.goodsList = ifInit ? res.data.records : this.goodsList.concat(res.data.records);
					this.search.pageIndex = current;
					this.pageDown = Boolean(pages > current);
				};
				AjaxApi("GetChains", params, successFuc);
			},
			async getListBeIn(ifInit = false) {
				uni.showLoading({
					title: "搜索中...",
					mask: true,
				});
				let params = {
					pageIndex: ifInit ? 1 : this.search.pageIndex,
					pageSize: this.search.pageSize,
				};
				let successFuc = res => {
					uni.hideLoading();
					let { pages, current, total } = res.data;
					this.goodsList = ifInit ? res.data.records : this.goodsList.concat(res.data.records);
					this.search.pageIndex = current;
					this.pageDown = Boolean(pages > current);
				};
				AjaxApi("GetChainsBein", params, successFuc);
			},
			lower() {
				if (this.pageDown) {
					this.search.pageIndex++;
					this.tabs == 3 ? this.getListBeIn() : this.getGoodsList();
				}
			},
			toTop() {
				this.topId = "firstId";
			},
			refreshFuc() {
				this.ifRefresh = true;
				const that = this;
				setTimeout(function () {
					that.ifRefresh = false;
				}, 200);
				getUserLocation(this.init, true);
			},
			upperFuc() {
				this.upper = false;
			},
			scrollFuc(e) {
				this.topId = "";
				this.upper = e.target.scrollTop > 300 ? true : false;
			},
			formatTime(time) {
				return formatTime2(time);
			},
			changeOp(op) {
				this.goodsList = [];
				this.search = {
					keyword: "",
					pageIndex: 1,
					pageSize: 5,
					status: 1,
				};
				switch (op) {
					case 1:
						this.tabs = 1;
						this.getGoodsList(true);
						break;
					case 2:
						this.tabs = 2;
						this.getGoodsList(true);
						break;
					case 3:
						this.tabs = 3;
						this.getListBeIn(true);
						break;

					default:
						break;
				}
			},
			updateUser() {
				const that = this;
				uni.getUserProfile({
					desc: "获取头像",
					success: res => {
						console.log(res);
						let { nickName, avatarUrl } = res.userInfo;
						let prams = {
							wxNickName: nickName,
							avatarUrl: avatarUrl,
						};
						let successFuc = async () => {
							let ress = await store.dispatch("QueryUserInfo", {});
							getApp().globalData.UserInfo = ress?.data ?? {
								phone: null,
							};
							that.userInfo = getApp().globalData.UserInfo;
						};
						AjaxApi("PostUpdateUser", prams, successFuc);
					},
					fail: err => {
						console.log(err);
					},
				});
			},
			goInfo(id) {
				uni.showLoading({
					title: "跳转中",
					mask: true,
				});
				uni.navigateTo({
					url: `/pagesJie/info/info?activityId=${id}`,
				});
			},
			goPaycenter(orderId) {
				uni.showLoading({
					title: "跳转中",
					mask: true,
				});
				uni.navigateTo({
					url: `/pagesJie/paycenter/paycenter?orderId=${orderId}`,
				});
			},
			goOrderDetail(it) {
				if (this.tabs !== 3) return;
				uni.navigateTo({
					url: `/pagesJie/detail/detail?recordId=${it.id}&orderId=${it.orderId}`,
				});
			},
			drawCode(it) {
				this.qrcode = it.code;
				this.qrshop = it.goodsName;
				this.scanPayMask = true;
				const that = this;
				setTimeout(() => {
					drawQrcode({
						width: (400 / 750) * uni.getSystemInfoSync().windowWidth,
						height: (400 / 750) * uni.getSystemInfoSync().windowWidth,
						foreground: "#333333",
						canvasId: "myQrcode",
						text: it.code || 0,
						callback: () => {
							setTimeout(() => {
								uni.canvasToTempFilePath({
									width: (400 / 750) * uni.getSystemInfoSync().windowWidth,
									height: (400 / 750) * uni.getSystemInfoSync().windowWidth,
									canvasId: "myQrcode",
									success(res) {
										that.tempFilePath = res.tempFilePath;
										console.log(res.tempFilePath);
									},
									fail(err) {
										console.log(err);
									},
								});
							}, 200);
						},
					});
				}, 200);
			},
			doneQr() {
				this.scanPayMask = false;
				// this.tabs = 3;
				// this.getListBeIn(true);
			},
			turnShop(id) {
				uni.navigateTo({
					url: `/pagesJie/shopList/shopList?Id=${id}`,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		font-family: custom;
		.bold {
			font-weight: bold;
		}
		.icon-chains-totop {
			position: fixed;
			bottom: 30vh;
			color: #fe6b00;
			box-shadow: 0px 3px 10px rgba(254, 107, 0, 0.3);
			border-radius: 50%;
			right: 3vw;
			z-index: 999;
			font-size: 32rpx;
		}
		.search-box {
			background: #ffffff;
			padding: 10rpx 40rpx;
		}
		.scroll-Y {
			height: calc(100vh - 120rpx);
		}
		.goods-box {
			min-height: 100vh;
			padding: 0 20rpx;
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom, 0);
			padding-bottom: env(safe-area-inset-bottom, 0);
			background: #f9fafb;
		}
		.goods-else {
			height: 100%;
			margin: 0 auto;
		}
		.goods-obj {
			position: relative;
			color: #1c1c1d;
			background: #ffffff;
			padding: 20rpx 20rpx 38rpx 20rpx;
			margin-bottom: 20rpx;
			.topview {
				/deep/u-image {
					flex-shrink: 0;
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
					display: flex;
					align-items: center;
					.price {
						color: #ff4d4f;
						.linethrough {
							text-decoration: line-through;
							color: #999999;
						}
					}
					.shop-num {
						margin-left: auto;
						color: #999999;
						.iconfont {
							font-size: 18rpx;
							vertical-align: middle;
						}
					}
				}
				/deep/u-image {
					display: inline-block;
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
			.btnview {
				flex-direction: row-reverse;
				.participation {
					width: 160rpx;
					height: 64rpx;
					line-height: 64rpx;
					background: #fe6b00;
					border-radius: 32rpx;
					text-align: center;
					color: #ffffff;
				}
				.share {
					button {
						width: 160rpx;
						line-height: 64rpx;
						font-size: 28rpx;
						background: #ffffff;
						border: 2rpx solid #fe6b00;
						border-radius: 32rpx;
						text-align: center;
						color: #fe6b00;
						padding: 0;
						margin: 0;
					}
					.iconfont {
						vertical-align: middle;
					}
				}
			}
		}
		.options {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 999;
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 16rpx 0;
			min-height: 100rpx;
			min-height: calc(100rpx + constant(safe-area-inset-bottom, 0));
			min-height: calc(100rpx + env(safe-area-inset-bottom, 0));
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom, 0);
			padding-bottom: env(safe-area-inset-bottom, 0);
			background: #ffffff;
			.choose {
				color: #fe6b00;
			}
			.iconfont {
				font-size: 36rpx;
			}
			> view {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.scan-mask {
			/deep/ .u-mask-zoom {
				transform: scale(1, 1) !important;
			}
			.scan-pay {
				position: fixed;
				left: 50%;
				top: 48%;
				transform: translate(-50%, -50%);
				width: 480rpx;
				height: 560rpx;
				padding-top: 20rpx;
				background: #ffffff;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				border-radius: 8rpx;
				/deep/.u-image {
					margin: 0 auto;
				}
				.qrshop {
					color: #ffffff;
					position: absolute;
					width: 480rpx;
					left: 50%;
					bottom: -80rpx;
					transform: translate(-50%, 0);
				}
				.closeit {
					position: absolute;
					left: 50%;
					bottom: -200rpx;
					transform: translate(-50%, 0);
				}
			}
		}
		.cav {
			position: absolute;
			top: -10000rpx;
			width: 400rpx;
			height: 400rpx;
			background: #f6f6f7;
		}
	}
</style>
