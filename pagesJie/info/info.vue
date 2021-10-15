<template>
	<view class="content">
		<u-navbar :back-icon-color="backColor" :custom-back="backFuc" :is-back="true" title=" " :title-width="0" :border-bottom="false" :background="backgroundImg"> </u-navbar>
		<view class="bg-banner">
			<image v-if="chainsDetail.shopHeadPic" :src="chainsDetail.shopHeadPic" mode="aspectFill"></image>
			<image v-else :src="shopBgImg" mode="aspectFill"></image>
		</view>
		<view class="bg-banner backg"></view>
		<view class="scrolling" v-if="inList.length">
			<swiper vertical="true" autoplay="true" circular="true" :interval="2000" :display-multiple-items="inList.length > 3 ? 3 : 1" :style="{ height: inList.length * 60 + 'rpx' }">
				<block v-for="(it, i) in inList" :key="i">
					<swiper-item catchtouchmove="catchTouchMove" catchtap="catchTouchMove" catchtouchstart="catchTouchMove">
						<view class="mark-item" v-if="i < inList.length">
							<view>
								<image :src="it.avatarUrl" mode="aspectFill"></image>
								<view class="name u-line-1 u-m-r-20">{{ it.nickName || "匿名" }}</view>
								刚刚来了
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view class="topview">
			<image v-if="chainsDetail.shopLogo" :src="`${chainsDetail.shopLogo}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5" :class="{ hidden: chainsDetail.singleShop }"></image>
			<image v-else :src="`${shopImg}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5" :class="{ hidden: chainsDetail.singleShop }"></image>
			<text class="u-font-26 u-m-l-24" :class="{ hidden: chainsDetail.singleShop }">{{ chainsDetail.shopName }}({{ chainsDetail.storeName }})</text>
			<button open-type="share" data-type="share" plain="true"><view class="u-font-26 iconfont icon-chains-share"></view></button>
		</view>
		<view class="midview">
			<view class="u-font-36 bold">
				{{ chainsDetail.activityName }}
			</view>
			<view class="u-font-24 bold u-m-t-10 u-flex u-row-between">
				<view style="color: #ababaf"> {{ formatTime(chainsDetail.startTime) }} | {{ inTotal }}人看过 | {{ total }}人参与</view>
				<view style="color: #666666" v-if="chainsDetail.status == 1">
					距结束
					<text class="u-m-l-10" style="color: #fe6b00">{{ timestamp.time }}天</text>
					<u-count-down class="u-m-l-10" :timestamp="timestamp.stamp" font-size="24" color="#FE6B00" separator-color="#FE6B00" :show-days="false" @end="backFuc" bg-color="rgb(251, 251, 251)"></u-count-down>
				</view>
				<view v-else-if="chainsDetail.status == 2" class="u-font-24" style="color: #666666"> 活动已于 {{ chainsDetail.startTime.slice(5, 16) }} 结束 </view>
			</view>
			<view class="u-font-24 addr" @tap="shopLoc">
				<view style="color: #302929">{{ chainsDetail.singleShop ? "最近店铺：" : "取货地址：" }}</view>
				<view class="shops">
					<view>{{ chainsDetail.address }}</view>
					<view class="u-font-24 shop-num u-m-t-24" @tap.stop="turnShop()" v-if="chainsDetail.singleShop">
						{{ chainsDetail.shopCount }}家店可用
						<text class="iconfont icon-arrow-right u-m-l-12"></text>
					</view>
				</view>
				<view style="color: #fe6b00" class="iconfont icondingwei u-flex u-row-center"> </view>
			</view>
			<view style="background: #d5d5d5; height: 2rpx; margin-top: 40rpx; margin-bottom: 28rpx"></view>
			<view style="white-space: pre-wrap" class="u-font-28">
				{{ chainsDetail.content }}
			</view>
			<view v-if="chainsDetail.bigPic" class="pic-big u-m-t-20">
				<image v-for="(it, i) in chainsDetail.bigPic.split(',')" :key="i" :src="`${it}?x-oss-process=image/resize,w_700`" mode="widthFix" lazy-load lazy-load-margin="0.5" :class="{ 'u-m-t-20': i }" @tap="preImg(i)"></image>
			</view>
			<view v-if="chainsDetail.pic" class="pic-mid u-m-t-20">
				<image v-for="(it, i) in chainsDetail.pic.split(',')" :key="i" :src="`${it}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5" :class="{ 'u-m-l-20': i }" @tap="preImg(i)"></image>
			</view>
			<view class="u-font-32 u-m-t-20 u-flex u-row-between">
				{{ chainsDetail.goodsName }}
				<text class="u-font-24 bold" style="color: #666666; flex-shrink: 0">已团购{{ total }}</text>
			</view>
			<view class="u-m-t-24 u-flex u-row-between">
				<view>
					<text class="u-font-24 bold">¥</text>
					<text class="u-font-32 bold">{{ chainsDetail.price }}</text>
					<text class="linethrough u-font-22 u-m-l-14 bold">¥{{ chainsDetail.basicPrice }}</text>
				</view>
				<view class="counts" v-if="chainsDetail.status == 1">
					<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart('minus')"> </view>
					<span>{{ cart.count }}</span>
					<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart('plus')"> </view>
				</view>
				<view style="color: #ff4d4f; flex-shrink: 0" class="u-m-l-28 u-font-32" v-if="chainsDetail.status == 2">已结束</view>
			</view>
			<view class="u-font-24 u-m-t-40" style="color: #fe6b00; line-height: 26rpx"> <text class="u-font-26 u-m-r-10 iconfont icon-chains-alert"></text>每人每天最多购买{{ chainsDetail.copies }}件 </view>
			<button v-if="!userInfo.phone" class="btn u-font-32 bold u-m-t-40" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="border: 0">
				<text>登录</text>
			</button>
			<view class="btn u-font-32 bold u-m-t-40" @tap="updateUser" v-else-if="!userInfo.avatarUrl">获取头像</view>
			<view class="btn done u-font-32 bold u-m-t-40" v-else-if="chainsDetail.status == 2">活动已结束</view>
			<view class="btn u-font-32 bold u-m-t-40" @tap="continueFuc" v-else-if="firstbuyCount >= chainsDetail.copies">您已参与该活动，去查看</view>
			<view class="btn u-font-32 bold u-m-t-40" @tap="joinFuc" v-else-if="!cart.count && chainsDetail.status == 1">我要接龙</view>
			<view class="btnjoin u-font-32 bold u-m-t-40 u-flex u-row-between" v-else>
				<view class="u-flex" @tap="cartModel = true">
					<view class="image-box u-m-r-40">
						<image src="../../static/img/car1.png" mode="widthFix"></image>
						<u-badge type="error" size="small" :count="cart.count || 0" :offset="[0, 0]"></u-badge>
					</view>
					<text class="u-font-24 bold">¥</text>
					<text class="u-font-32 bold">{{ cart.totalPrice }}</text>
				</view>
				<view class="u-flex" @tap="joinFuc">我要接龙</view>
			</view>
			<view class="fotview u-m-t-20 u-font-28" v-if="total && total <= 10">
				<view class="u-m-t-20" v-for="(re, rei) in recordList" :key="rei">
					<image :src="`${re.avatarUrl}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
					<view class="u-m-l-12 u-line-1">{{ re.nickName }}</view>
					<view class="u-m-l-12 u-line-1">{{ re.formatTime }}</view>
					<view class="u-line-1">{{ re.goodsName }}</view>
					<view>+{{ re.quantity || 1 }}</view>
				</view>
			</view>
			<!-- <view class="u-m-t-20 u-font-28" v-else-if="total">
				<swiper :indicator-dots="false" :circular="true" :vertical="true" :display-multiple-items="10" :interval="1000" autoplay style="height: 640rpx">
					<swiper-item class="fotview u-m-t-20" v-for="(re, rei) in recordList" :key="rei">
						<view>
							<image :src="`${re.avatarUrl}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
							<view class="u-m-l-12 u-line-1">{{ re.nickName }}</view>
							<view class="u-m-l-12 u-line-1">{{ re.formatTime }}</view>
							<view class="u-line-1">{{ re.goodsName }}</view>
							<view>+{{ re.quantity || 1 }}</view>
						</view>
					</swiper-item>
				</swiper>
			</view> -->
			<scroll-view :scroll-top="scroll" scroll-y="true" class="scroll-Y" :scroll-into-view="topId" @scrolltolower="lowerFuc" :lower-threshold="100" scroll-with-animation style="height: 610rpx" v-else-if="total">
				<view class="fotview u-m-t-20 u-font-28">
					<view class="u-m-t-20" v-for="(re, rei) in recordList" :key="rei">
						<image :src="`${re.avatarUrl}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
						<view class="u-m-l-12 u-line-1">{{ re.nickName }}</view>
						<view class="u-m-l-12 u-line-1">{{ re.formatTime }}</view>
						<view class="u-line-1">{{ re.goodsName }}</view>
						<view>+{{ re.quantity || 1 }}</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 购物车弹框 -->
		<u-popup class="cart-class" v-model="cartModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" :duration="50" :mask="true" :closeable="false" :safe-area-inset-bottom="true" border-radius="8" close-icon-pos="top-left">
			<view>
				<scroll-view class="cart-scroll" scroll-y="true" show-scrollbar="true">
					<view class="shop-list" :key="index">
						<view class="shop-name">
							<view class="u-line-1">已选商品</view>
							<view @tap="deleteCartFuc" style="color: #f01d1f">
								<tetx class="iconfont icon-delete u-m-r-12 u-font-28"></tetx>
								清空
							</view>
						</view>
						<view v-for="(i, index) in cart.shoppingCarts" class="cart-item" :key="index">
							<view class="goods-pic">
								<image :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" lazy-load lazy-load-margin="0.5"></image>
							</view>
							<view class="goods-detail">
								<view class="u-font-32 u-line-1">{{ i.goodsName }}</view>
								<view class="u-flex u-row-between">
									<view>
										<text class="u-font-24 bold">¥</text>
										<text class="u-font-36 bold">{{ i.discountPrice }}</text>
									</view>
									<view class="goods-count">
										<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart('minus')"> </view>
										<text>{{ i.number }}</text>
										<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart('plus')"> </view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="cart-join u-font-32 bold u-flex u-row-between">
					<view class="u-flex" @tap="cartModel = true">
						<view class="image-box u-m-r-40">
							<image src="../../static/img/car1.png" mode="widthFix"></image>
							<u-badge type="error" size="small" :count="cart.count || 0" :offset="[0, 0]"></u-badge>
						</view>
						<text class="u-font-24 bold">¥</text>
						<text class="u-font-32 bold">{{ cart.totalPrice }}</text>
					</view>
					<view class="u-flex" @tap="joinFuc">我要接龙</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
	import store from "@/store";
	import { formatTime2, getUserLocation } from "@/utils";
	export default {
		data() {
			return {
				timestamp: {
					time: 0,
					stamp: 0,
				},
				backColor: "#ffffff",
				backgroundImg: {
					background: "rgba(255, 255, 255, 0)",
				},
				cartModel: false,
				userInfo: {
					phone: null,
					avatarUrl: null,
				},
				firstbuyCount: 0,
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
				inList: [],
				inTotal: 0,
				cart: {
					shoppingCarts: [],
					totalPrice: 0,
					count: 0,
				},
				params: {
					id: 0,
					pageIndex: 1,
					pageSize: 15,
				},
				pageDown: true,
				recordList: [],
				total: 0,
				shopImg: getApp().globalData.shopImg,
				shopBgImg: getApp().globalData.shopBgImg,
				shoppingMode: getApp().globalData.shoppingMode,
			};
		},
		onShareAppMessage: function (res) {
			const that = this;
			const pic = that.chainsDetail.sharepic.split(",");
			const activityName = that.chainsDetail.activityName;
			let url = `${pic[0]}?x-oss-process=image/resize,w_500,h_400,m_lfit`;
			if (res.from === "button") {
				// 来自页面内转发按钮
				return {
					title: activityName,
					imageUrl: url,
					path: `/pagesJie/info/info?activityId=${that.activityId}`,
				};
			} else {
				return {
					title: "进入餐典到了",
					imageUrl: SHARE_URL,
					path: `/pages/index/index`,
				};
			}
		},
		onPageScroll(e) {
			if ((e.scrollTop || 1) / 200 > 0.8) {
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
					animation: {
						duration: 400,
						timingFunc: "easeIn",
					},
				});
				this.backColor = "#000000";
			} else {
				uni.setNavigationBarColor({
					frontColor: "#ffffff",
					backgroundColor: "#000000",
					animation: {
						duration: 400,
						timingFunc: "easeIn",
					},
				});
				this.backColor = "#ffffff";
			}
			this.backgroundImg.background = `rgba(255, 255, 255, ${e.scrollTop / 250})`;
		},
		onShow() {
			if (getApp().globalData.previewImage) {
				getApp().globalData.previewImage = false;
				return;
			}
			getUserLocation(this.init);
		},
		onLoad(query) {
			// uni.enableAlertBeforeUnload({
			// 	message: "不参与接龙了?",
			// });
			this.activityId = query?.activityId ?? 0;
			this.params.id = query?.activityId ?? 0;
		},
		watch: {
			"cart.count": {
				handler(newValue, oldValue) {
					if (newValue == 0) this.cartModel = false;
				},
			},
		},
		methods: {
			shopLoc() {
				const address = this.chainsDetail.address;
				const name = this.chainsDetail.shopName;
				const latitude = this.chainsDetail.location.split(",")[1] * 1;
				const longitude = this.chainsDetail.location.split(",")[0] * 1;
				getApp().globalData.previewImage = true;
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name,
					address: address,
					scale: 15,
					fail: () => {
						getApp().globalData.previewImage = false;
					},
				});
			},
			continueFuc() {
				uni.navigateTo({
					url: `/pagesJie/chains/chains?tabs=3`,
				});
			},
			lowerFuc(e, flag = false) {
				if (!this.pageDown) return;
				this.params.pageIndex++;
				if (flag) {
					this.recordList = [];
					this.params.pageIndex = 1;
				}
				let successFuc = res => {
					this.recordList = flag ? res.data?.records : this.recordList.concat(res.data?.records);
					this.pageDown = Boolean(res.data.pages > res.data.current);
					this.total = res.data?.total ?? 0;
				};
				AjaxApi("ChainsPurchaseRecord", this.params, successFuc);
			},
			backFuc() {
				let pages = getCurrentPages();
				pages.length !== 1
					? uni.navigateBack()
					: uni.reLaunch({
							url: `/pagesJie/chains/chains`,
					  });
			},
			init() {
				this.userInfo = getApp().globalData.UserInfo;
				uni.showLoading({
					title: "加载中...",
					mask: true,
				});
				let { longitude, latitude } = getApp().globalData.location;
				let proList = [
					store.dispatch("GetChainsInfo", {
						id: this.activityId,
						userLatitude: latitude,
						userLongitude: longitude,
					}),
					store.dispatch("GetChainsSeen", {
						id: this.activityId,
					}),
					// store.dispatch("GetChainsCart", {
					// 	activityId: this.activityId,
					// }),
				];
				let thenFuc = async res => {
					let resArr = res.map(a => a.data);
					resArr[0].sharepic = resArr[0].pic + resArr[0].bigPic;
					this.chainsDetail = resArr[0];
					this.firstbuyCount = this.chainsDetail.buyCount;
					this.getTimeStamp();
					this.inList = resArr[1]?.record ?? [];
					this.inTotal = resArr[1]?.total ?? 0;
					if (this.chainsDetail.status == 2) return;
					// <!-- 活动状态,0:未发布,1:进行中,2:已结束 -->
					let DATA = await store.dispatch("GetChainsCart", {
						activityId: this.activityId,
					});
					this.cart = DATA.data ?? {
						shoppingCarts: [],
						totalPrice: 0,
						count: 0,
					};
					this.chainsDetail.buyCount = this.chainsDetail.buyCount + this.cart.count;
				};
				let catchFuc = err => {
					if (err == 1001) this.init();
					if (err == 0 || err == 2) this.backFuc();
				};
				PromiseAll(proList, thenFuc, catchFuc);
				this.lowerFuc(1, true);
			},
			preImg(current) {
				const that = this;
				getApp().globalData.previewImage = true;
				uni.previewImage({
					current: current,
					urls: that.chainsDetail.sharepic.split(","),
					longPressActions: {
						itemList: ["发送给朋友", "保存图片", "收藏"],
					},
				});
			},
			formatTime(time) {
				return formatTime2(time);
			},
			getCart() {
				uni.showLoading({
					title: "获取购物车",
					mask: true,
				});
				let params = {
					activityId: this.activityId,
				};
				let successFuc = res => {
					uni.hideLoading();
					this.cart = res.data ?? {
						shoppingCarts: [],
						totalPrice: 0,
						count: 0,
					};
				};
				AjaxApi("GetChainsCart", params, successFuc);
			},
			async changeSPcart(type) {
				uni.vibrateShort();
				let good = await store.dispatch("GetGoodsDetail", { goodsId: this.chainsDetail.goodsId });
				const { coverPic, goodsName, shopId, storeId, goodsId } = good.data;
				const { price, id, stockId } = this.chainsDetail;
				const params = {
					coverPic,
					goodsId,
					goodsName,
					shopId,
					storeId,
					stockId,
					activityId: id,
					discountPrice: price,
					isAdd: true,
					number: 1,
					specification: "接龙",
				};
				switch (type) {
					case "plus":
						if (this.chainsDetail.buyCount >= this.chainsDetail.copies) {
							uni.showToast({
								title: `限购${this.chainsDetail.copies}件!`,
								icon: "none",
								duration: 1500,
							});
							return;
						}
						const successAdd = res => {
							this.chainsDetail.buyCount++;
							this.getCart();
							if (res.data) {
								uni.showToast({
									title: res.data,
									icon: "none",
									duration: 1500,
								});
							}
						};
						AjaxApi("SaveChainsCart", params, successAdd);
						break;
					case "minus":
						if (!this.cart.count) return;
						params.isAdd = false;
						const successFuc = () => {
							this.chainsDetail.buyCount--;
							this.getCart();
						};
						AjaxApi("SaveChainsCart", params, successFuc);
						break;
					default:
						break;
				}
			},
			joinFuc() {
				if (!this.cart.count) {
					this.changeSPcart("plus");
					return;
				}
				uni.navigateTo({
					url: `/pagesJie/order/order`,
				});
				// const successFuc = () => {
				// 	this.getCart();
				// };
				// AjaxApi("CreatChains", { activityId: this.activityId, remark: "remark" }, successFuc);
			},
			deleteCartFuc() {
				const successFuc = () => {
					this.getCart();
				};
				AjaxApi("DelChainsCart", { activityId: this.chainsDetail.id }, successFuc);
			},
			getTimeStamp() {
				let date = this.chainsDetail.endTime;
				let timenow = Date.parse(new Date());
				let timethen = new Date((date || "").replace(/\-/g, "/")).getTime();
				let time = ((timethen - timenow) / 86400000).toFixed(2) + "";
				this.timestamp = {
					time: time.split(".")[0],
					stamp: (timethen - timenow - 86400000 * time.split(".")[0]) / 1000,
				};
			},
			getPhoneNumber(e) {
				// 手机号码授权
				if (e.detail.encryptedData && e.detail.iv) {
					uni.showLoading({
						title: "正在登录",
						mask: true,
					});
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
					};
					let successFuc = async res => {
						let ress = await store.dispatch("QueryUserInfo", {});
						getApp().globalData.UserInfo = ress?.data ?? {
							phone: null,
						};
						this.userInfo = getApp().globalData.UserInfo;
					};
					AjaxApi("GetUserPhone", params, successFuc);
				} else {
					uni.showModal({
						title: "温馨提示",
						content: "您点击了拒绝授权，将无法下单",
						showCancel: false,
						confirmText: "确定",
					});
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
			turnShop() {
				uni.navigateTo({
					url: `/pagesJie/shopList/shopList?Id=${this.chainsDetail.id}`,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		font-family: custom;
		color: #1c1c1d;
		.bold {
			font-weight: bold;
		}
		.bg-banner {
			&.backg {
				background: #000000;
				opacity: 0.3;
				z-index: 1;
			}
			width: 100%;
			height: 520rpx;
			overflow: hidden;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			image {
				width: 100%;
				height: 520rpx;
			}
		}

		.scrolling {
			z-index: 10;
			position: absolute;
			top: 160rpx;
			left: 40rpx;
			width: 80vw;
			height: 60rpx;
			overflow: hidden;
			.target {
				position: relative;
				.name {
					max-width: 100rpx;
				}
				> view {
					display: inline-flex;
					align-items: center;
					min-width: 360rpx;
					height: 56rpx;
					line-height: 56rpx;
					margin-bottom: 20px;
					background: rgba(0, 0, 0, 0.5);
					padding-right: 8rpx;
					border-radius: 80rpx;
					color: #ffffff;
					font-size: 24rpx;
					image {
						margin: 0 8rpx;
						height: 40rpx;
						width: 40rpx;
						border-radius: 50%;
					}
					text {
						color: #fec20d;
					}
				}
				animation: 12s rowup linear infinite normal;
			}
			.mark-item {
				position: relative;
				.name {
					max-width: 100rpx;
				}
				> view {
					display: inline-flex;
					align-items: center;
					// min-width: 360rpx;
					height: 56rpx;
					line-height: 56rpx;
					margin-bottom: 20px;
					background: rgba(0, 0, 0, 0.5);
					padding-right: 16rpx;
					border-radius: 80rpx;
					color: #ffffff;
					font-size: 24rpx;
					image {
						margin: 0 8rpx;
						height: 40rpx;
						width: 40rpx;
						border-radius: 50%;
					}
					text {
						color: #fec20d;
					}
				}
			}
		}
		.topview {
			position: relative;
			z-index: 10;
			margin-top: 100rpx;
			padding: 0 20rpx 0 40rpx;
			display: flex;
			color: #ffffff;
			.hidden {
				opacity: 0;
			}
			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 10rpx;
			}
			button {
				width: 64rpx;
				height: 64rpx;
				line-height: 62rpx;
				text-align: center;
				background: #000000;
				border-radius: 50%;
				opacity: 0.5;
				color: #ffffff;
				padding: 0;
				margin: 0;
				margin-left: auto;
			}
		}
		.midview {
			background: #ffffff;
			width: calc(100vw - 40rpx);
			min-height: 50vh;
			border-radius: 16rpx;
			margin: 20rpx;
			padding: 20rpx;
			padding-bottom: 20rpx;
			padding-bottom: calc(20rpx + constant(safe-area-inset-bottom, 0));
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom, 0));
			position: relative;
			z-index: 10;
			.iconfont {
				vertical-align: middle;
			}
			.addr {
				margin-top: 50rpx;
				display: flex;
				> view {
					&:not(:nth-of-type(2)) {
						flex-shrink: 0;
					}
					&:nth-of-type(3) {
						margin-left: auto;
						align-items: flex-start;
						font-size: 40rpx;
						width: 80rpx;
					}
				}
				.shops {
					color: #666666;
					display: flex;
					flex-direction: column;
					.shop-num {
						color: #999999;
						.iconfont {
							font-size: 18rpx;
							vertical-align: middle;
						}
					}
				}
			}
			.btn {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				background: #fe6b00;
				border-radius: 50rpx;
				color: #ffffff;
				&.done {
					background: #d5d5d5;
				}
			}
			.btnjoin {
				> view {
					height: 100rpx;
					line-height: 100rpx;
					flex: 1;
					justify-content: center;
					&:first-of-type {
						box-sizing: border-box;
						color: #333333;
						border: 2rpx solid #fe6b00;
						border-top-left-radius: 50rpx;
						border-bottom-left-radius: 50rpx;
						position: relative;
						.image-box {
							position: absolute;
							left: 30rpx;
							display: flex;
							align-items: center;
							image {
								width: 80rpx;
								height: auto;
								vertical-align: middle;
							}
							text {
								position: absolute;
								top: 0;
								right: 5rpx;
								line-height: 28rpx;
								padding: 0rpx 10rpx;
								background: #ff3c3b;
								color: #fff;
								font-size: 20rpx;
								border: 4rpx solid #fff;
								border-radius: 50%;
							}
						}
					}
					&:last-of-type {
						color: #ffffff;
						background: #fe6b00;
						border-top-right-radius: 50rpx;
						border-bottom-right-radius: 50rpx;
					}
				}
			}
			.fotview {
				margin-top: 60rpx;
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
		}
		.pic-big {
			image {
				width: 100%;
				height: auto;
				border-radius: 10rpx;
			}
		}
		.pic-mid {
			image {
				width: 210rpx;
				height: 210rpx;
				border-radius: 10rpx;
			}
		}
		.linethrough {
			text-decoration: line-through;
			color: #999999;
		}
		.counts {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			min-width: 140rpx;
			font-size: 30rpx;
			line-height: 30rpx;
			.count-minus {
				width: 46rpx;
				height: 46rpx;
				font-size: 20rpx;
				color: #666666;
				text-align: center;
				line-height: 46rpx;
				border-radius: 50%;
				border: 2rpx solid #ddd;
			}
			.count-plus {
				width: 46rpx;
				height: 46rpx;
				font-size: 20rpx;
				color: #ffffff;
				text-align: center;
				line-height: 46rpx;
				border-radius: 50%;
				background: #fe6b00;
			}
			span {
				padding: 0 14rpx;
			}
		}

		.cart-class {
			min-height: 600rpx;
			background-color: #f9fafb;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			/deep/.u-icon__icon {
				top: 18rpx !important;
				left: 10rpx;
			}
			.cart-scroll {
				height: 400rpx;
				box-sizing: border-box;
				.shop-list {
					padding: 0 40rpx;
					.shop-name {
						margin-top: 40rpx;
						line-height: 40rpx;
						font-size: 28rpx;
						box-sizing: border-box;
						height: 40rpx;
						color: #333333;
						display: flex;
						justify-content: space-between;
						> view {
							&:first-child {
								flex: 1;
								width: 0;
							}
							&:nth-child(2) {
								width: 100rpx;
								display: flex;
								justify-content: flex-end;
							}
						}
					}
					.cart-item {
						display: flex;
						justify-content: space-between;
						padding: 32rpx 0 44rpx 0;
						.goods-pic {
							width: 240rpx;
							height: 180rpx;
							margin-right: 24rpx;
							border-radius: 8rpx;
							overflow: hidden;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.goods-detail {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.goods-count {
								display: flex;
								align-items: center;
								min-width: 100rpx;
								font-size: 30rpx;
								line-height: 30rpx;
								.count-minus {
									width: 46rpx;
									height: 46rpx;
									font-size: 20rpx;
									color: #666666;
									text-align: center;
									line-height: 46rpx;
									border-radius: 50%;
									border: 2rpx solid #ddd;
								}
								.count-plus {
									width: 46rpx;
									height: 46rpx;
									font-size: 20rpx;
									color: #fff;
									text-align: center;
									line-height: 46rpx;
									border-radius: 50%;
									background: #fe6b00;
								}
								text {
									padding: 0 14rpx;
								}
							}
						}
					}
				}
			}
			.cart-join {
				> view {
					height: 100rpx;
					line-height: 100rpx;
					&:first-of-type {
						flex: 1;
						box-sizing: border-box;
						color: #333333;
						position: relative;
						padding-left: 160rpx;
						.image-box {
							position: absolute;
							left: 30rpx;
							display: flex;
							align-items: center;
							image {
								width: 110rpx;
								height: auto;
								vertical-align: middle;
							}
							text {
								position: absolute;
								top: 0;
								right: 5rpx;
								line-height: 28rpx;
								padding: 0rpx 10rpx;
								background: #ff3c3b;
								color: #fff;
								font-size: 20rpx;
								border: 4rpx solid #fff;
								border-radius: 50%;
							}
						}
					}
					&:last-of-type {
						margin-right: 20rpx;
						justify-content: center;
						width: 240rpx;
						height: 88rpx;
						background: #fe6b00;
						border-radius: 46rpx;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>
