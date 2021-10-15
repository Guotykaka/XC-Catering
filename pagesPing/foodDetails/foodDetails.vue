<template>
	<view class="container">
		<u-navbar
			back-icon-color="#ffffff"
			:is-back="true"
			:custom-back="backFuc"
			title=" "
			title-color="#FFFFFF"
			:background="backgroundImg"
			:border-bottom="false"
		></u-navbar>
		<view
			class="image-box"
			:style="{
				marginTop: -navigationHeight + 'px',
			}"
		>
			<swiper class="swiper u-skeleton-rect" :indicator-dots="true">
				<swiper-item v-if="picArr.length == 0">
					<view class="swiper-item uni-bg-red">
						<image class="banner-img" src="https://oss.dianddian.cn/v2/activity/goods-img.png" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item v-else v-for="(item, i) in picArr" :key="i">
					<view class="swiper-item uni-bg-red">
						<image class="banner-img" :src="`${item}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="detail">
			<view class="goods-detail">
				<view style="flex: 1">
					<view class="goods-name">{{ goodsDetail.goodsName }}</view>
					<view class="goods-number">{{ goodsDetail.description ? goodsDetail.description : "此商品暂无描述" }}</view>
					<view class="goods-number">月销售 {{ tag ? "9999+" : goodsDetail.count ? goodsDetail.count : 0 }}</view>
					<view class="goods-price">
						<view>
							<view style="font-size: 18rpx; height: 27rpx; align-self: center; margin-top: auto">￥</view>
							<view>{{ shoppingMode ? goodsDetail.discountPrice : goodsDetail.wmDiscountPrice }}</view>
							<view class="discount-text" v-if="goodsDetail.discount">{{ goodsDetail.customerName + `${goodsDetail.discount}折` }}</view>
						</view>
						<view v-if="storeStatus">
							<view class="origin-num" v-if="goodsDetail.specsFlag && !goodsDetail.sellOut" @tap.stop="changeSPcart(goodsDetail, 'plus')">
								<text v-if="goodsDetail.number" class="has-stocks">{{ goodsDetail.number }}</text>
								选规格
							</view>
							<view
								class="origin-num"
								v-else-if="Boolean(goodsDetail.originNum > 1 && goodsDetail.number == 0) && !goodsDetail.sellOut"
								@tap.stop="changeSPcart(goodsDetail, 'plus')"
							>
								{{ `${goodsDetail.originNum}份起点` }}
							</view>
							<view class="origin-num" v-else-if="!goodsDetail.sellOut" @tap.stop="changeSPcart(goodsDetail, 'plus')"> 加入购物车 </view>
						</view>
					</view>
				</view>
			</view>
			<view class="line"></view>
		</view>

		<view :class="{ 'sticky-box': scrollActive }" style="padding: 0 24rpx">
			<view class="evaluation-top">
				<view class="top-left">
					<text @tap="tapTab(0)">评价</text>
				</view>
				<view class="top-right" v-if="!(goodsDetail.favorableRate == 0 || goodsDetail.favorableRate == null)">
					<view>
						<u-rate
							min-count="1"
							:disabled="true"
							v-model="goodsDetail.score"
							active-color="#FF4D4F"
							inactive-color="#DDDDDD"
							size="24"
							gutter="8"
						></u-rate>
					</view>
					<view class="shop-score">好评度 &nbsp; {{ goodsDetail.favorableRate }}%</view>
				</view>
			</view>
			<view class="evaluation-tag">
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 0 }]" @tap="chooseEvaluateTag(0)"
					>全部{{ evaluateCount.totalCount || "" }}</view
				>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 1 }]" @tap="chooseEvaluateTag(1)">最新</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 2 }]" @tap="chooseEvaluateTag(2)" v-if="evaluateCount.goodsCount"
					>好评{{ evaluateCount.goodsCount }}</view
				>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 3 }]" @tap="chooseEvaluateTag(3)" v-if="evaluateCount.badCount"
					>差评{{ evaluateCount.badCount }}</view
				>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 4 }]" @tap="chooseEvaluateTag(4)" v-if="evaluateCount.picCount"
					>有图{{ evaluateCount.picCount }}</view
				>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 5 }]" @tap="chooseEvaluateTag(5)" v-if="evaluateCount.replyCount"
					>商家回复{{ evaluateCount.replyCount }}</view
				>
			</view>
		</view>
		<view class="evaluation">
			<view class="evaluation-box">
				<view v-for="(it, i) in evaluateList" :key="i" class="evaluation">
					<view>
						<view class="evaluate-fa">
							<view>
								<image :src="it.createPic || '../../static/img/default-man.png'" mode="aspectFill"></image>
							</view>
							<view style="flex: 1">
								<view class="evaluate-top">
									<view class="top-left">
										<text>{{ it.createName }}</text>
										<text class="time">{{ it.createTime.slice(0, 10) }}</text>
									</view>
									<u-rate
										v-model="evaluateList[i].score"
										active-color="#FF4D4F"
										:disabled="true"
										inactive-color="#DDDDDD"
										size="20"
										gutter="6"
									></u-rate>
								</view>
								<view class="evaluate-content" v-if="it.content">{{ it.content }}</view>
							</view>
						</view>
						<view class="evaluate-pic">
							<scroll-view scroll-x="true" v-if="it.pic.length">
								<view style="display: inline-flex">
									<image
										@tap="preEveImg(i, inx)"
										:src="`${item}?x-oss-process=image/resize,w_700`"
										mode="aspectFill"
										v-for="(item, inx) in it.pic"
										:key="inx"
									></image>
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="recommen-box" v-if="it.evaluateGoods || it.evaluateGoods.length < 1">
						<view class="recommen-title">TA的推荐</view>
						<view class="recommen-name" v-for="(item, index) in it.evaluateGoods" :key="index">{{ item.goodsName }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 选择规格 -->
		<u-popup
			class="coupon-popup-stocks"
			v-model="stocks.model"
			:custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }"
			mode="bottom"
			z-index="10090"
			duration="50"
			:mask="true"
			:closeable="true"
			:safe-area-inset-bottom="true"
			border-radius="8"
		>
			<view class="popup-stocks">
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh; padding-bottom: 120rpx">
					<view class="ps-tittle" @tap="stocks.model = false">
						<view>
							<image class="banner-img" :src="`${stocks.goods.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
						</view>
						<view>
							<view>{{ stocks.goods.goodsName }}</view>
							<view>已售{{ stocks.goods.count || 0 }}</view>
							<view style="height: 56rpx">
								<view style="font-size: 28rpx; align-self: center">￥</view>
								<view style="align-self: center">{{ stocks.price }}</view>
								<view class="original" v-if="stocks.originalPrice !== stocks.price">原价:{{ stocks.originalPrice }}</view>
								<view class="discount-text" v-if="Boolean(goodsDetail.discount) && Boolean(stocks.wmCustomerPrice)">{{
									goodsDetail.customerName + `价¥${stocks.wmCustomerPrice}`
								}}</view>
								<view> </view>
							</view>
						</view>
					</view>
					<view class="ps-mini-tittle" style="margin-top: 0; margin-bottom: 0">{{ stocks.goods.typeName }}</view>
					<view class="ps-content" v-if="stocks.list.length > 1">
						<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, i) in stocks.list" :key="i" @tap="chooseStocks(i)">
							<text> {{ it.specification }}</text>
						</view>
					</view>
					<div v-for="(item, i) in stocks.specList" :key="i">
						<view class="ps-mini-tittle" style="margin-bottom: 0">{{ item.name }}</view>
						<view class="ps-content">
							<view
								class="ps-content-view"
								:class="{ ifchoose: it.choose }"
								v-for="(it, inx) in item.children"
								:key="inx"
								@tap="chooseSpec(i, inx)"
							>
								<text> {{ it.name }}</text>
							</view>
						</view>
					</div>
				</scroll-view>
				<view class="ps-footer">
					<view @tap="conformStocks(i)" :class="{ gray: !stocks.id }"> 加入购物车</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL } from "@/utils/api";
import store from "@/store";
import { appInit } from "@/utils";
import { paramConversion } from "@/utils";
export default {
	data() {
		return {
			//导航栏和状态栏的高度
			navigationHeight: getApp().globalData.statusBarHeight,
			backgroundImg: {
				background: "transparent",
			},
			scrollActive: false,
			shoppingMode: 0, //用户下单类型:0外卖1堂食
			orderType: ["外卖", "堂食", "到店自取"],
			shopScore: 4,
			goodsScore: 3,
			options: {
				shopId: 0,
				number: 0,
				id: 0,
			},
			goodsId: null,
			goodsDetail: {
				basicPrice: 0,
				count: 0,
				coverPic: "",
				createTime: "",
				delFlag: "",
				description: "",
				discountNum: 0,
				discountPrice: 0,
				elmPrice: 0,
				favorableRate: 0,
				goodsId: 0,
				goodsName: "",
				goodsSpecifications: [],
				isLatest: 0,
				isPublish: 0,
				isRecommend: 0,
				isSignboard: 0,
				isWaiterClick: 0,
				merchantId: 0,
				mtPrice: 0,
				number: 0,
				originNum: 0,
				originalPrice: 0,
				pic: "",
				rank: 1,
				remark: "",
				required: false,
				score: 0,
				shopId: 0,
				singleOrder: 1,
				sort: 0,
				status: 0,
				typeName: "",
				updateTime: "",
				wmDiscountPrice: 0,
				wmOriginalPrice: 0,
			},
			tag: false,
			picArr: [],
			dishesList: [],
			evaluateList: [], //评论列表
			evaluateParams: {
				pageIndex: 1,
				pageSize: 10,
				type: 0, //0外卖1堂食
				goodsId: 0,
				status: 0,
			},
			pageDownEva: true, //评论翻页标识
			evaluateCount: {
				totalCount: 0,
				goodsCount: 0,
				badCount: 0,
				picCount: 0,
				replyCount: 0,
			},
			stocks: {
				id: 0,
				price: 0,
				originalPrice: 0,
				wmCustomerPrice: 0,
				goods: {}, //规格商品
				specList: [], //规格描述列表
				chosen: {}, //选中的库存对象
				model: false, //规格弹窗
				list: [], //规格列表
			},
			storeStatus: 1,
			storeId: 0,
		};
	},
	onLoad(option) {
		this.navigationHeight =
			uni.getSystemInfoSync().platform == "ios" ? 44 + uni.getSystemInfoSync().statusBarHeight : 48 + uni.getSystemInfoSync().statusBarHeight;
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		if (option?.q) {
			let link = paramConversion(decodeURIComponent(option?.q));
			this.storeId = link.storeId * 1;
			this.evaluateParams.goodsId = link.id * 1;
			this.goodsId = link.id * 1;
			this.storeStatus = link.storeStatus * 1;
		} else {
			this.storeId = option.storeId * 1;
			this.evaluateParams.goodsId = option.id * 1;
			this.goodsId = option.id * 1;
			this.storeStatus = option.storeStatus * 1;
		}
		let fuc = ()=>{
			this.init();
			this.getGoodsEvaluateCount();
			this.getEvaluateList(true);
		}
		appInit(fuc)
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	onReachBottom() {
		if (this.pageDownEva) {
			this.evaluateParams.pageIndex++;
			this.getEvaluateList();
		}
	},
	onPageScroll(e) {
		this.scrollActive = e.scrollTop > 495 ? true : false;
	},
	methods: {
		backFuc() {
			let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
			let prevPage = pages[pages.length - 2];
			let route = prevPage?.route ?? "";
			if (route) {
				uni.navigateBack();
			} else {
				uni.reLaunch({
					url: `/pages/spellOrder/spellOrder?storeId=${this.goodsDetail.storeId}&shopId=${this.goodsDetail.shopId}`,
				});
			}
		},
		goHome() {
			let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
			let prevPage = pages[pages.length - 2];
			let route = prevPage?.route ?? "";
			const type = Boolean(route == "pages/member/member" || route == "pages/index/index");
			if (type || !route) {
				uni.reLaunch({
					url: `/pages/spellOrder/spellOrder?storeId=${this.goodsDetail.storeId}&shopId=${this.goodsDetail.shopId}`,
				});
				return;
			}
			prevPage?.$vm?.getCart();
			uni.navigateBack();
		},
		init() {
			let params = {
				goodsId: this.goodsId,
			};
			let successFun = res => {
				this.goodsDetail = res.data;
				this.picArr = this.goodsDetail.pic.split(",");
				if (this.goodsDetail.number > 9999) {
					this.tag = true;
				}
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				let route = prevPage.route;
				const type = Boolean(route == "pages/member/member" || route == "pages/index/index");
				if (type && Boolean(this.goodsDetail.goodsSpecifications.length !== 0 || this.goodsDetail.stocks.length > 1)) {
					this.changeSPcart(prevPage.$vm.chosen, "plus", prevPage.$vm.chosen.stockId);
				}
			};
			let elseFun = () => {};
			AjaxApi("GetGoodsDetail", params, successFun, elseFun);
		},
		tapTab(i) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			uni.pageScrollTo({
				scrollTop: 480,
			});
			this.evaluateParams.type = i;
			this.evaluateParams.pageIndex = 1;
			this.getEvaluateList(true);
		},
		chooseEvaluateTag(val) {
			this.evaluateParams.status = val;
			this.evaluateParams.pageIndex = 1;
			this.getEvaluateList(true);
		},
		getEvaluateList(flag) {
			let successFun = res => {
				res.data?.records.forEach(element => {
					element.pic = element.pic ? element.pic.split(",") : [];
				});
				this.evaluateList = flag ? res.data?.records ?? [] : this.evaluateList.concat(res.data.records);
				this.pageDownEva = Boolean(res.data.pages > res.data.current);
			};
			let elseFun = () => {};
			AjaxApi("GetEvaluateList", this.evaluateParams, successFun, elseFun);
		},
		getGoodsEvaluateCount(val) {
			let successFun = res => {
				this.evaluateCount = res.data;
			};
			let elseFun = () => {};
			AjaxApi("GetGoodsEvaluateCount", { goodsId: this.goodsId }, successFun, elseFun);
		},
		async conformStocks() {
			//确认规格并加入购物车
			if (!this.stocks.id) {
				uni.showToast({
					title: `库存不足!`,
					icon: "none",
					mask: true,
					duration: 1500,
				});
				return;
			}
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let SPEC = "";
			this.stocks.specList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const { coverPic, description, goodsId, goodsName, shopId } = this.goodsDetail;
			const params = {
				coverPic,
				description,
				goodsId,
				goodsName,
				shopId,
				storeId: this.storeId, //店铺Id
				isAdd: true,
				stockId: this.stocks.chosen.stockId, //库存Id
				specification: this.stocks.chosen.specification + SPEC, //库存描述
			};
			const successFuc = res => {
				const that = this;
				if (res.data) {
					uni.showToast({
						title: res.data,
						icon: "none",
						duration: 1000,
						success: () => {
							setTimeout(function () {
								if (!that.goodsDetail.singleOrder) {
									uni.showToast({
										title: "不能单点!",
										icon: "none",
										duration: 1000,
										success: () => {
											setTimeout(function () {
												that.goHome();
											}, 1000);
										},
									});
								} else {
									that.goHome();
								}
							}, 1000);
						},
					});
				} else if (!that.goodsDetail.singleOrder) {
					uni.showToast({
						title: "不能单点!",
						icon: "none",
						duration: 1000,
						success: () => {
							setTimeout(function () {
								that.goHome();
							}, 1000);
						},
					});
				} else {
					that.goHome();
				}
				that.stocks.id = null;
				that.stocks.model = false;
			};
			AjaxApi("SaveMakeUpCart", params, successFuc);
		},
		chooseSpec(i, inx) {
			//选规格
			if (this.stocks.specList[i].simple === 2) {
				const index = this.stocks.specList[i].children.filter(item => item.choose == true);
				this.stocks.specList[i].children[inx].choose = index.length == 1 ? true : !this.stocks.specList[i].children[inx].choose;
			} else {
				this.stocks.specList[i].children.filter((element, index) => {
					element.choose = index == inx ? true : false;
					return element;
				});
			}
			this.$forceUpdate();
		},
		chooseStocks(i) {
			//点击选规格
			this.stocks.list.filter((element, inx) => {
				element.choose = inx == i ? true : false;
			});
			if (this.stocks.list[i].availableStock == 0) {
				this.stocks.chosen = this.stocks.list[i];
				this.stocks.price = 0;
				this.stocks.id = null;
				return;
			}
			this.stocks.chosen = this.stocks.list[i];
			this.stocks.price = this.stocks.list[i].wmDiscountPrice;
			this.stocks.wmCustomerPrice = this.stocks.list[i].wmCustomerPrice;
			this.stocks.originalPrice = this.stocks.list[i].wmOriginalPrice;
			this.stocks.id = this.stocks.list[i].goodsId;
		},
		async changeSPcart(it, type, ifStockId = null) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			uni.vibrateShort();
			let res = await store.dispatch("GetGoodsDetail", { goodsId: it.goodsId });
			this.goodsDetail = res.data;
			const { specification, number, stockId } = it;
			const { coverPic, description, goodsName, shopId, goodsId } = this.goodsDetail;
			if (res.data.stocks.length == 1 && !res.data.goodsSpecifications.length) {
				//规格为一个
				switch (type) {
					case "plus":
						const params = {
							coverPic,
							description,
							goodsId,
							goodsName,
							shopId,
							isAdd: true,
							storeId: this.storeId, //店铺Id
							stockId: res.data.stocks[0].stockId, //库存Id
							specification: res.data.stocks[0].specification, //库存描述
						};
						const successFuc = res => {
							const that = this;
							if (res.data) {
								uni.showToast({
									title: res.data,
									icon: "none",
									duration: 1000,
									success: () => {
										setTimeout(function () {
											if (!that.goodsDetail.singleOrder) {
												uni.showToast({
													title: "不能单点!",
													icon: "none",
													duration: 1000,
													success: () => {
														setTimeout(function () {
															that.goHome();
														}, 1000);
													},
												});
											} else {
												that.goHome();
											}
										}, 1000);
									},
								});
							} else if (!that.goodsDetail.singleOrder) {
								uni.showToast({
									title: "不能单点!",
									icon: "none",
									duration: 1000,
									success: () => {
										setTimeout(function () {
											that.goHome();
										}, 1000);
									},
								});
							} else {
								that.goHome();
							}
						};
						AjaxApi("SaveMakeUpCart", params, successFuc);
						break;
					case "minus":
						if (number !== 0) {
							const inx = this.cartData.shoppingCarts.findIndex(element => element.goodsId === goodsId);
							const paramss = {
								coverPic,
								description,
								goodsId,
								goodsName,
								shopId,
								isAdd: false,
								storeId: this.options.storeId, //店铺Id
								stockId: res.data.stocks[0].stockId, //库存Id
								specification: res.data.stocks[0].specification, //库存描述
							};
							const successFucc = async res => {
								this.goHome();
							};
							AjaxApi("SaveMakeUpCart", paramss, successFucc);
						} else {
							uni.hideLoading();
						}
						break;
					default:
						break;
				}
			} else {
				//规格为多个个
				switch (type) {
					case "plus":
						uni.hideLoading();
						const INDEX = res.data.stocks.findIndex(ele => ele.stockId == ifStockId);
						this.stocks.price = 0;
						this.stocks.goods = res.data;
						this.stocks.list = res.data.stocks.map((item, i) => {
							item.choose = false;
							return item;
						});
						if (INDEX !== -1) {
							this.stocks.chosen = this.stocks.list[INDEX];
							this.stocks.price = this.stocks.list[INDEX].wmDiscountPrice;
							this.stocks.wmCustomerPrice = this.stocks.list[INDEX].wmCustomerPrice;
							this.stocks.originalPrice = this.stocks.list[INDEX].wmOriginalPrice;
							this.stocks.id = this.stocks.list[INDEX].goodsId;
							this.stocks.list[INDEX].choose = true;
						} else {
							this.stocks.chosen = this.stocks.list[0];
							this.stocks.price = this.stocks.list[0].wmDiscountPrice;
							this.stocks.wmCustomerPrice = this.stocks.list[0].wmCustomerPrice;
							this.stocks.originalPrice = this.stocks.list[0].wmOriginalPrice;
							this.stocks.id = this.stocks.list[0].goodsId;
							this.stocks.list[0].choose = true;
						}
						if (this.stocks.list[0].availableStock == 0) this.stocks.id = null;
						this.stocks.specList = res.data.goodsSpecifications.filter((item, i) => {
							const index = item.children.findIndex(ele => ele.checked == true);
							item.children = item.children.filter((it, inx) => {
								inx == index ? (it.choose = true) : (it.choose = false);
								if (it.checked) {
									return it;
								}
							});
							return item;
						});
						this.stocks.model = true;
						break;
					case "minus":
						if (number !== 0) {
							const params = {
								coverPic,
								description,
								goodsId,
								goodsName,
								shopId,
								stockId,
								isAdd: false,
								specification,
								storeId: this.storeId,
							};
							const successFuc = res => {
								this.getCart();
							};
							AjaxApi("SaveMakeUpCart", params, successFuc);
						} else {
							uni.hideLoading();
						}
						break;
					default:
						break;
				}
			}
		},
		preEveImg(i, inx) {
			const that = this;
			uni.previewImage({
				current: inx,
				urls: that.evaluateList[i].pic,
				longPressActions: {
					itemList: ["发送给朋友", "保存图片", "收藏"],
					success: function (data) {
						console.log("preImg -> data", data);
					},
					fail: function (err) {
						console.log("preImg -> err", err);
					},
				},
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background: #f6f6f7;
}
.image-box {
	width: 100%;
	height: 750rpx;
	background: rgba(255, 255, 255, 1);
	opacity: 1;
	border-radius: 8px;
	.swiper {
		height: 100%;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
	}
	.banner-img {
		width: 100%;
		height: 100%;
	}
}
.detail {
	box-sizing: border-box;
	background: #fff;
	position: relative;
}
.goods-detail {
	padding: 24rpx 30rpx 24rpx 26rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	width: 702rpx;
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translate(-50%, 50%);
	margin-left: auto;
	background: #ffffff;
	border-radius: 8px;
	.goods-name {
		height: 44rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #333333;
		margin-bottom: 8rpx;
	}
	.goods-number {
		font-size: 24rpx;
		font-weight: 400;
		line-height: 34rpx;
		color: #ababaf;
		margin-bottom: 12rpx;
	}
	.goods-price {
		margin-top: 18rpx;
		font-size: 48rpx;
		font-weight: bold;
		line-height: 56rpx;
		height: 56rpx;
		color: rgba(255, 0, 0, 1);
		margin-bottom: 4rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		view {
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 48rpx;
		}
	}
}
.origin-num {
	width: 182rpx;
	height: 56rpx;
	background: #fe6b00;
	border-radius: 34rpx;
	font-size: 24rpx;
	font-weight: bold;
	color: #ffffff;
	line-height: 56rpx;
	.has-stocks {
		display: inline-block;
		min-width: 30rpx;
		min-height: 30rpx;
		border-radius: 50%;
		font-size: 20rpx;
		line-height: 30rpx;
		text-align: center;
		position: absolute;
		right: 0;
		top: 44rpx;
		background: #fe6b00;
		color: #fff;
	}
}
.discount-text {
	display: inline-block;
	padding: 0 16rpx;
	height: 48rpx;
	background: linear-gradient(90deg, #646d79 0%, #1f2938 100%);
	border-radius: 10rpx;
	margin-left: 18rpx;
	font-size: 24rpx;
	font-weight: 500;
	color: #ffc49a;
	line-height: 48rpx;
	text-align: center;
}
.count-minus {
	width: 40rpx;
	height: 40rpx;
	font-size: 20rpx;
	color: #666666;
	text-align: center;
	line-height: 38rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
}
.count-plus {
	width: 40rpx;
	height: 40rpx;
	font-size: 20rpx;
	color: #fff;
	text-align: center;
	line-height: 40rpx;
	border-radius: 50%;
	background: #fe6b00;
}
span {
	padding: 0 14rpx;
}
.commentary-name {
	padding: 32rpx 28rpx 24rpx 28rpx;
}
.line {
	// width: 100%;
	margin-left: 22rpx;
	margin-right: 18rpx;
	border-bottom: 2rpx solid rgba(221, 221, 221, 1);
}
.evaluation {
	padding: 0rpx 20rpx 20rpx 20rpx;
	width: 100%;
	box-sizing: border-box;
}
.sticky-box {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 800;
}
.evaluation-top {
	padding: 150rpx 0 24rpx 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f6f6f7;
	.top-left {
		display: flex;
		height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		color: #333333;
		opacity: 1;
	}
	.top-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.shop-score {
			margin-left: 24rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 30rpx;
			color: #999999;
			opacity: 1;
		}
	}
}
.evaluation-tag {
	padding-top: 20rpx;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	color: #666666;
	background: #f6f6f7;
	.tag-span {
		margin: 0rpx 20rpx 20rpx 0rpx;
		line-height: 52rpx;
		padding: 0 28rpx;
		font-size: 24rpx;
		font-weight: 500;
		background: #ffffff;
		border-radius: 10rpx;
	}
	.active-tag {
		background: #fe6b00;
		opacity: 1;
		font-weight: bold;
		color: #fff;
	}
}
.evaluation-box {
	width: 100%;
	.evaluation {
		border-radius: 8rpx;
		width: 100%;
		padding: 30rpx 24rpx 20rpx 24rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, #ffffff 100%);
		box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
		border-radius: 8rpx;
		.evaluate-fa {
			display: flex;
			justify-content: space-between;
			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				vertical-align: middle;
			}
		}
		.evaluate-top {
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			.top-left {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			> text {
				margin-left: 16rpx;
				margin-right: 28rpx;
			}
			.time {
				margin: 0;
				font-size: 24rpx;
				font-weight: 400;
				color: #ababaf;
				white-space: nowrap;
			}
		}
		.evaluate-content {
			padding-top: 12rpx;
			color: #666666;
			white-space: normal;
			word-break: break-all;
		}
		.type-box {
			margin-left: 54rpx;
			margin-top: 6rpx;
			display: inline-block;
			background: rgba(76, 112, 232, 0.1);
			opacity: 0.1;
			border-radius: 4rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 36rpx;
			color: #ff3b3b;
			padding: 0 10rpx;
		}
		.evaluate-pic {
			margin-top: 12rpx;
			padding: 10rpx;
			image {
				width: 108rpx;
				height: 108rpx;
				vertical-align: middle;
				margin-right: 10rpx;
			}
		}
		.recommen-box {
			margin-top: 20rpx;
			display: flex;
			justify-content: flex-start;
			// align-items: center;
			flex-wrap: wrap;
			.recommen-title {
				margin-bottom: 10rpx;
				line-height: 32rpx;
				border-radius: 4rpx;
				padding: 0 8rpx;
				background: rgba(255, 77, 79, 0.1);
				font-size: 20rpx;
				font-weight: 400;
				color: #ff4d4f;
				margin-right: 8rpx;
			}
			.recommen-name {
				margin-bottom: 10rpx;
				line-height: 32rpx;
				border-radius: 4rpx;
				padding: 0 8rpx;
				background: #f9fafb;
				font-size: 20rpx;
				font-weight: 400;
				color: #666;
				margin-right: 8rpx;
			}
		}
		.evaluate-line {
			height: 0;
			width: 100%;
			border-bottom: 1rpx solid #f9f9f9;
			margin-top: 28rpx;
		}
		.evaluate-merchantContent {
			margin-top: 28rpx;
			padding: 20rpx;
			background: #f9fafb;
		}
	}
}
.coupon-popup-stocks {
	/deep/.u-icon__icon {
		top: -10rpx;
		right: -0rpx;
	}
}
.popup-stocks {
	min-height: 560rpx;
	background-color: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.ps-tittle {
		height: 116rpx;
		padding: 48rpx 40rpx;
		display: flex;
		position: sticky;
		top: 0;
		box-sizing: content-box;
		background: #ffffff;
		> view {
			&:nth-child(1) {
				width: 116rpx;
				border-radius: 16rpx;
				overflow: hidden;
				image {
					height: 100%;
					width: 100%;
				}
			}
			&:nth-child(2) {
				flex: 1;
				width: 0;
				margin-left: 20rpx;
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
				line-height: 1;
				> view {
					&:nth-child(2) {
						line-height: 48rpx;
						font-size: 24rpx;
						color: #ababaf;
					}
					&:nth-child(3) {
						display: flex;
						color: #ff3b3b;
						font-size: 36rpx;
						line-height: 1;
						.original {
							align-self: center;
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
							margin-left: 10rpx;
						}
					}
				}
			}
			&:nth-child(3) {
				color: #999999;
				font-size: 24rpx;
				line-height: 1;
			}
		}
	}
	.ps-mini-tittle {
		color: #666666;
		font-size: 24rpx;
		margin: 48rpx 0 20rpx 40rpx;
	}
	.ps-content {
		display: flex;
		flex-wrap: wrap;
		padding: 0rpx 42rpx 0 22rpx;
		.ps-content-view {
			min-width: 30%;
			margin-left: 20rpx;
			margin-top: 20rpx;
			min-height: 72rpx;
			overflow: hidden;
			font-size: 32rpx;
			color: #1c1c1d;
			background: #f6f6f7;
			border-radius: 10rpx;
			font-weight: 500;
			border-radius: 8rpx;
			padding: 0 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text {
				text-align: center;
				line-height: 72rpx;
			}
		}
		.ifchoose {
			background: #ffe3d2;
			color: #fe6b00;
		}
	}
	.ps-footer {
		position: absolute;
		bottom: 0;
		margin-bottom: 20rpx;
		padding: 0 40rpx;
		view {
			width: 690rpx;
			height: 80rpx;
			background: #fe6b00;
			border-radius: 44rpx;
			color: #343434;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #ffffff;
			&.gray {
				background: #999999;
				color: white;
			}
		}
	}
}
</style>
