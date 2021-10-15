<template>
	<view class="wrapper">
		<view class="search-box">
			<u-search v-model="search.name" :clearabled="true" shape="square" placeholder="请输入商品名称" :show-action="false" @change="getGoodsList" @search="getGoodsList" @clear="getGoodsList" height="80" bg-color="#F9F9F9"></u-search>
		</view>
		<scroll-view :scroll-top="0" scroll-y="true" class="scroll-Y">
			<view class="goods-box" v-if="goodsList.length">
				<view v-for="(i, indx) in goodsList" :key="indx">
					<view class="goods-obj">
						<view :class="[{ sellout: i.sellOut }, 'goods-item']">
							<image class="goods-img" :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
							<view :class="[{ sellout: i.sellOut }, 'goods-des']">
								<view style="min-width: 0">
									<view class="title u-line-1" @tap.stop="jumpGoodDetails(i)">{{ i.goodsName }}</view>
									<view :class="[{ sellout: i.sellOut }, 'des1', 'u-line-1']" @tap.stop="jumpGoodDetails(i)">{{ goodsRank(i.rank, i.description) }}</view>
								</view>
								<view :class="[{ sellout: i.sellOut }, 'des2']">
									<text class="sold-num">已售{{ i.count > 9999 ? "9999+" : i.count }}</text>
									<text v-if="i.favorableRate">好评度{{ i.favorableRate }}%</text>
								</view>
								<view :class="[{ sellout: i.sellOut }, 'des2']" style="color: #ff4d4f; font-szie: 16rpx" v-if="i.discountNum > 0">每单限{{ i.discountNum }}份优惠</view>
								<view class="btm">
									<view :class="[{ sellout: i.sellOut }, 'price']">
										￥<text class="num">{{ shoppingMode ? i.discountPrice : i.wmDiscountPrice }}</text>
										<text :class="[{ sellout: i.sellOut }, 'orgNum']" v-if="shoppingMode ? i.discountPrice !== i.originalPrice : i.wmDiscountPrice !== i.wmOriginalPrice">￥{{ shoppingMode ? i.originalPrice : i.wmOriginalPrice }}</text>
									</view>
									<view class="origin-num" v-if="i.specsFlag && currentShop.status == 1 && !i.sellOut" @tap.stop="changeSPcart(i, 'plus')">
										<text v-if="i.number" class="has-stocks">{{ i.number }}</text>
										选规格
									</view>
									<view class="origin-num" v-else-if="i.originNum > 1 && currentShop.status == 1 && i.number == 0 && !i.sellOut" @tap.stop="changeSPcart(i, 'plus')">
										{{ `${i.originNum}份起点` }}
									</view>
									<view class="count" v-else-if="!i.sellOut">
										<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart(i, 'minus')" v-if="!i.specsFlag && currentShop.status == 1 && i.number !== 0"> </view>
										<span v-if="!i.specsFlag && currentShop.status == 1 && i.number !== 0">{{ i.number }}</span>
										<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(i, 'plus')" v-if="currentShop.status == 1"> </view>
										<view v-else> </view>
									</view>
								</view>
							</view>
						</view>
						<view :class="[{ sellout: i.sellOut }, 'other-box']">
							<text class="u-m-r-10" v-if="i.mtPrice">美团：￥{{ i.mtPrice }}</text>
							<text v-if="i.elmPrice">饿了么：￥{{ i.elmPrice }}</text>
						</view>
						<view class="sell-out" v-if="i.sellOut">售罄</view>
					</view>
				</view>
			</view>
			<view v-else class="goods-else u-font-32 u-flex u-col-center u-row-center">该店铺内没有相关商品</view>
			<view style="height: 160rpx" v-if="!cartModel&&goodsList.length"></view>
		</scroll-view>

		<!-- 购物车 -->
		<view class="cart-spc goods-car-fixed" v-if="cartData.msg && !cartModel && currentShop.status == 1">
			{{ cartData.msg }}
		</view>
		<view class="goods-car goods-car-fixed" @tap="cancelPopup" v-if="currentShop.status == 1">
			<view class="car-pic">
				<u-badge type="error" size="small" :count="cartData.count || 0" :offset="[-36, 0]"></u-badge>
				<image :src="`${cartData.count ? '../../static/img/daodian_car2.png' : '../../static/img/daodian_car.png'}`" v-if="shoppingMode == 1"></image>
				<image :src="`${cartData.count ? '../../static/img/waimai_car2.png' : '../../static/img/waimai_car.png'}`" v-else></image>
			</view>
			<view class="car-detail">
				<view class="goods-detail">
					<view class="total-price">
						<text>￥{{ getPrice(cartData.totalPrice, cartData.reduceFee, cartData.firstOrderDiscounts) }}</text>
						<text class="orgin-price" v-if="getPrice(cartData.totalPrice, cartData.reduceFee, cartData.firstOrderDiscounts) * 1 !== cartData.totalOriginal * 1">￥{{ cartData.totalOriginal || 0 }}</text>
					</view>
					<view class="total-info">
						<text v-if="!shoppingMode" class="u-m-r-10">配送费{{ cartData.shippingFee || 0 }}元</text>
						共{{ cartData.count }}件商品，优惠{{ cartData.totalReduceFee ? cartData.totalReduceFee : 0 }}元
					</view>
				</view>
				<button v-if="!phoneNumber" class="active car-btn" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="border: 0">
					<text>登录</text>
				</button>
				<view v-else :class="[{ active: checkoutclass() }, 'car-btn']" @tap.stop="sureOrder">
					<text v-if="checkoutclass()">{{ shoppingMode == 1 ? "到店" : "外卖" }}/去结算</text>
					<template v-else-if="cartData.required && !checkout.ifcanpay">
						<text class="u-font-20">{{ checkout.text }}</text>
						<text class="u-font-20">未点必选品</text>
					</template>
					<text v-else-if="cartData.required">未点必选品</text>
					<text v-else-if="!cartData.required">{{ checkout.text }}</text>
				</view>
			</view>
		</view>
		<!-- 选择规格 -->
		<u-popup class="coupon-popup-stocks" v-model="stocksModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" z-index="10090" duration="50" :mask="true" :closeable="true" :safe-area-inset-bottom="true" border-radius="8">
			<view class="popup-stocks">
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh">
					<view class="ps-tittle" @tap="stocksModel = false">
						<view>
							<image class="banner-img" v-if="stocksObj.coverPic" :src="`${stocksObj.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
						</view>
						<view>
							<view>{{ stocksObj.goodsName }}</view>
							<view class="u-line-1">{{ stocksObj.description || "暂无描述" }}</view>
						</view>
					</view>
					<view class="ps-mini-tittle" style="margin-top: 0; margin-bottom: 0">{{ stocksObj.typeName }}</view>
					<view class="ps-content" v-if="stocksList.length > 1">
						<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, i) in stocksList" :key="i" @tap="chooseStocks(i)">
							<text> {{ it.specification }}</text>
						</view>
					</view>
					<div v-for="(item, i) in specList" :key="i">
						<view class="ps-mini-tittle" style="margin-bottom: 0">{{ item.name }}</view>
						<view class="ps-content">
							<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, inx) in item.children" :key="inx" @tap="chooseSpec(i, inx)">
								<text> {{ it.name }}</text>
							</view>
						</view>
					</div>
				</scroll-view>
				<view class="ps-mini-tittle" style="margin-top: 20rpx">{{ stocksGoods.specification || "请选择" }}</view>
				<view class="ps-footer">
					<view><text style="font-size: 28rpx">￥\t</text>{{ stocksPrice }}</view>
					<view @tap="conformStocks(i)" :class="{ gray: !stocksGoodsID }"> 加入购物车</view>
				</view>
			</view>
		</u-popup>
		<!-- 购物车弹框 -->
		<u-popup class="coupon-popup1" v-model="cartModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" :duration="50" :mask="true" :closeable="false" :safe-area-inset-bottom="true" border-radius="8" close-icon-pos="top-left">
			<view>
				<view class="title-tit" @tap="cartModel = false">
					<text>{{ cartData.msg }}</text>
				</view>
				<scroll-view class="goods-List-box" scroll-y="true" show-scrollbar="true">
					<view class="shop-list" :key="index">
						<view class="shop-name">
							<view class="u-line-1">{{ currentShop.shopName }}</view>
							<view @tap="deleteCartFuc">
								<tetx class="iconfont icon-delete icon-style"></tetx>
								清空
							</view>
						</view>
						<view v-for="(i, index) in cartData.shoppingCarts" class="coupon-item" :key="index">
							<view class="goods-pic">
								<image :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" lazy-load lazy-load-margin="0.5"></image>
							</view>
							<view class="goods-detail">
								<view class="goods-top">
									<view class="goods-name u-line-1">{{ i.goodsName }}</view>
									<view class="goods-descript u-line-3">{{ i.specification }}</view>
									<view class="price">
										￥<text class="num">{{ shoppingMode ? i.discountPrice : i.wmDiscountPrice }}</text>
										<text class="orgNum" v-if="shoppingMode ? i.discountPrice !== i.originalPrice : i.wmDiscountPrice !== i.wmOriginalPrice">￥{{ shoppingMode ? i.originalPrice : i.wmOriginalPrice }}</text>
									</view>
								</view>
								<view class="goods-count">
									<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart(i, 'minus')"> </view>
									<text>{{ i.number }}</text>
									<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(i, 'plus')"> </view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { Decimal } from "decimal.js";
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
import { getObjType } from "@/utils";
export default {
	data() {
		return {
			phoneNumber: getApp().globalData.UserInfo.phone,
			shopImg: getApp().globalData.shopImg, //默认店铺图片
			goodsList: [],
			search: {
				name: "",
				shopId: "",
			},
			orderPara: {}, //订单信息
			shoppingMode: getApp().globalData.shoppingMode,
			currentShop: {},
			cartModel: false,
			cartData: {
				shoppingCarts: [],
				reduceFee: 0,
				totalPrice: 0,
				count: 0,
			},
            specList: [], //规格描述列表
			stocksObj: {}, //规格商品
			stocksList: [], //规格列表
			stocksGoods: {}, //选中的库存对象
			stocksModel: false, //规格弹窗
			stocksPrice: null, //规格价格
			stocksGoodsID: null,
		};
	},
	onLoad(query) {
		let thisPages = getCurrentPages();
		let thisPrevPage = thisPages[thisPages.length - 2];
		this.search.shopId = thisPrevPage.$vm.currentShop.shopId;
		this.currentShop = thisPrevPage.$vm.currentShop;
		this.phoneNumber = getApp().globalData.UserInfo.phone;
		this.shoppingMode = getApp().globalData.shoppingMode;
	},
	onShow(){
		this.init();
	},
	watch: {
		"cartData.shoppingCarts.length": {
			handler(newValue, oldValue) {
				if (newValue == 0) this.cartModel = false;
			},
		},
	},
	methods: {
		init() {
			uni.showLoading({
				title: "搜索中...",
				mask: true,
			});
			let proList = [
				store.dispatch("GetGoodsList", { shopId: this.search.shopId, goodsName: this.search.name }),
				store.dispatch("GetCart", { shopId: this.search.shopId, orderType: this.shoppingMode * 1, location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "" }), //获取店铺优惠券
			];
			let thenFuc = async res => {
				let resArr = res.map(a => a.data);
				this.goodsList = resArr[0];
				this.cartData = resArr[1];
			};
			let catchFuc = err => {
				if (err == 1001) this.init();
			};
			PromiseAll(proList, thenFuc, catchFuc);
		},
		getGoodsList() {
			uni.showLoading({
				title: "搜索中...",
				mask: true,
			});
			let params = {
				shopId: this.search.shopId,
				goodsName: this.search.name,
			};
			let successFuc = res => {
				uni.hideLoading();
				this.goodsList = res.data;
			};
			AjaxApi("GetGoodsList", params, successFuc);
		},
		goodsRank(rank = 11, description) {
			return Boolean(rank < 11 && rank) ? `本店销售第${rank}名` : description || "";
		},
		getPrice(val1, val2, val3) {
			let val = new Decimal(val1 ?? 0).sub(new Decimal(val2 ?? 0)).sub(new Decimal(val3 ?? 0));
			if (val > 0) {
				return val;
			} else {
				return 0;
			}
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
					this.phoneNumber = getApp().globalData.UserInfo.phone;
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
		checkoutclass() {
			if (this.cartData.count == 0 || this.cartData.required || this.currentShop.status !== 1) {
				return false;
			} else if (!this.shoppingMode) {
				if (this.currentShop?.startDeliveryAmount ?? 0 !== 0) {
					let amount = new Decimal(this.currentShop?.startDeliveryAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
					return amount * 1 > 0 ? false : true;
				} else {
					return true;
				}
			} else {
				if (this.currentShop?.buyAmount ?? 0 !== 0) {
					let amount = new Decimal(this.currentShop?.buyAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
					return amount * 1 > 0 ? false : true;
				} else {
					return true;
				}
			}
		},

		async getCart(Fuc = () => {}) {
			//获取购物车 orderType 订单类型(0,外卖,1堂食)
			const paramss = {
				shopId: this.currentShop.shopId,
				orderType: this.shoppingMode * 1,
				location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
			};
			const awaitdata = await store.dispatch("GetCart", paramss);
			this.cartData = awaitdata.data ?? {
				shoppingCarts: [],
				reduceFee: 0,
				totalPrice: 0,
				count: 0,
				errorGoodsName: null,
				firstOrderDiscounts: null,
				msg: "",
				noSingleOrder: false,
				required: false,
				share: 1,
				shippingFee: 0,
				totalOriginal: 0,
				totalPackageFee: 0,
				totalReduceFee: 0,
			};
			Fuc();
		},
		async changeSPcart(it, type, stockId = null) {
			uni.showLoading({
				title: "加载",
				mask: true,
			});
			// this.htmlGoods = {};
			uni.vibrateShort();
			//添加或删除菜品
			let params = { goodsId: it?.goodsId };
			let res = await store.dispatch("GetGoodsDetail", params);
			const { coverPic, description, discountPrice, goodsId, goodsName } = it;
			const goodsinx = this.goodsList.findIndex(item => item.goodsId == it.goodsId);
			if (res.data.stocks.length == 1 && !res.data.goodsSpecifications.length) {
				//规格为一个
				switch (type) {
					case "plus":
						const params = {
							coverPic,
							description,
							discountPrice,
							goodsId,
							goodsName,
							isAdd: true,
							shopId: this.currentShop.shopId, //店铺Id
							stockId: res.data.stocks[0].stockId, //库存Id
							specification: res.data.stocks[0].specification, //库存描述
						};
						const successFuc = res => {
							if (goodsinx !== -1) this.goodsList[goodsinx].number++;
							if (res.data) {
								uni.showToast({
									title: res.data,
									icon: "none",
									duration: 1500,
								});
							}
							this.getCart();
						};
						AjaxApi("SaveCart", params, successFuc);
						break;
					case "minus":
						if (it.number !== 0) {
							const inx = this.cartData.shoppingCarts.findIndex(element => element.goodsId === it.goodsId);
							const params = {
								coverPic,
								description,
								discountPrice,
								goodsId,
								goodsName,
								isAdd: false,
								shopId: this.currentShop.shopId, //店铺Id
								stockId: this.cartData.shoppingCarts[inx].stockId, //库存Id
								specification: res.data.stocks[0].specification, //库存描述
							};
							const successFuc = async res => {
								if (goodsinx !== -1) this.goodsList[goodsinx].number--;
								this.getCart();
							};
							AjaxApi("SaveCart", params, successFuc);
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
						const INDEX = res.data.stocks.findIndex(ele => ele.stockId == stockId);
						this.stocksPrice = 0;
						this.stocksObj = res.data;
						this.stocksList = res.data.stocks.map((item, i) => {
							item.choose = false;
							return item;
						});
						if (INDEX !== -1) {
							this.stocksGoods = this.stocksList[INDEX];
							this.stocksPrice = this.shoppingMode ? this.stocksList[INDEX].discountPrice : this.stocksList[INDEX].wmDiscountPrice;
							this.stocksGoodsID = this.stocksList[INDEX].goodsId;
							this.stocksList[INDEX].choose = true;
						} else {
							this.stocksGoods = this.stocksList[0];
							this.stocksPrice = this.shoppingMode ? this.stocksList[0].discountPrice : this.stocksList[0].wmDiscountPrice;
							this.stocksGoodsID = this.stocksList[0].goodsId;
							this.stocksList[0].choose = true;
							if (this.stocksList[0].availableStock == 0) this.stocksGoodsID = null;
						}
						this.specList = res.data.goodsSpecifications.filter((item, i) => {
							const index = item.children.findIndex(ele => ele.checked == true);
							item.children = item.children.filter((it, inx) => {
								inx == index ? (it.choose = true) : (it.choose = false);
								if (it.checked) {
									return it;
								}
							});
							return item;
						});
						this.stocksModel = true;
						break;
					case "minus":
						if (it.number !== 0) {
							const params = {
								coverPic,
								description,
								discountPrice,
								goodsId,
								goodsName,
								isAdd: false,
								shopId: it.shopId, //店铺Id
								stockId: it.stockId, //库存Id
								specification: it.specification, //库存描述
							};
							const successFuc = res => {
								if (goodsinx !== -1) this.goodsList[goodsinx].number--;
								this.getCart();
							};
							AjaxApi("SaveCart", params, successFuc);
						}
						break;
					default:
						break;
				}
			}
		},
		async conformStocks() {
			//确认规格并加入购物车
			if (!this.stocksGoodsID) {
				uni.showToast({
					title: `库存不足!`,
					icon: "none",
					mask: true,
					duration: 1500,
				});
				return;
			}
			let SPEC = "";
			this.specList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const inx = this.goodsList.findIndex(item => item.goodsId == this.stocksGoodsID);
			const { coverPic, description, goodsId, goodsName } = this.goodsList[inx];
			const params = {
				coverPic,
				description,
				goodsId,
				goodsName,
				discountPrice: this.stocksPrice,
				isAdd: true,
				shopId: this.currentShop.shopId, //店铺Id
				stockId: this.stocksGoods.stockId, //库存Id
				specification: this.stocksGoods.specification + SPEC, //库存描述
			};
			const successFuc = async res => {
				if (inx !== -1) this.goodsList[inx].number++;
				this.getCart();
				this.stocksGoodsID = null;
				this.stocksModel = false;
			};
			AjaxApi("SaveCart", params, successFuc);
		},
		//确认订单
		sureOrder() {
			if (!this.checkoutclass()) {
				if (this.cartData.required) {
					this.scrollTop = this.scrollTopOld;
					this.$nextTick(() => {
						this.scrollTop = 0;
					});
				}
				return;
			}
			if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
				uni.navigateTo({
					url: "/pagesB/login/login",
				});
				return;
			}
			this.beforeSub(Boolean(this.cartData.errorGoodsName), Boolean(this.cartData.noSingleOrder), this.cartData.errorGoodsName);
			if (Boolean(this.cartData.errorGoodsName) || Boolean(this.cartData.noSingleOrder)) return;
			this.orderPara = {
				recipientAddress: "", //收货地址
				orderType: this.shoppingMode, //0,外卖,1堂食
				shopId: this.currentShop.shopId, //店铺Id
				storeId: this.currentShop.storeId, //门店Id
				location: this.currentShop.location, //经纬度
				reduceFee: this.cartData.reduceFee ?? 0, //优惠总金额(红包+优惠满减)
				stallName: this.currentShop.shopName, //档口名称
				shopName: this.currentShop.shopName, //店铺名称
				productAmount: this.cartData.totalPrice, //商品订单金额
				storeName: this.currentShop.storeName, //门店名称
				packageFee: this.cartData.totalPackageFee ?? 0, //餐盒
				shoppingCartReqs: this.cartData.shoppingCarts, //购物车信息
				recipientPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
				reservedPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
				recipientName: getApp().globalData.UserInfo.wxNickName ?? "", //收货人名字
				actualPayment: new Decimal(this.cartData.totalPrice ?? 0).sub(new Decimal(this.cartData.reduceFee ?? 0)), //实际支付金额},
			};
			uni.navigateTo({
				url: `/pagesA/confirmOrder/confirmOrder`,
			});
		},
		beforeSub(a, b, text) {
			if (b) {
				uni.showToast({
					title: `不能单独下单,请搭配其他菜品`,
					icon: "none",
					mask: true,
					duration: 1000,
					success: () => {
						setTimeout(function () {
							if (a) {
								uni.showToast({
									title: text,
									icon: "none",
									mask: true,
									duration: 1000,
								});
							}
						}, 1000);
					},
				});
			} else if (a) {
				uni.showToast({
					title: text,
					icon: "none",
					mask: true,
					duration: 1000,
				});
			}
		},
		cancelPopup() {
			//购物车弹框
			if (this.cartData.count == 0 || this.currentShop.status !== 1) return;
			this.cartModel = !this.cartModel;
		},
		chooseSpec(i, inx) {
			//选规格
			if (this.specList[i].simple === 2) {
				const index = this.specList[i].children.filter(item => item.choose == true);
				this.specList[i].children[inx].choose = index.length == 1 ? true : !this.specList[i].children[inx].choose;
			} else {
				this.specList[i].children.filter((element, index) => {
					element.choose = index == inx ? true : false;
					return element;
				});
			}
			this.$forceUpdate();
		},

		chooseStocks(i) {
			//点击选规格
			this.stocksList.filter((element, inx) => {
				element.choose = inx == i ? true : false;
			});
			if (this.stocksList[i].availableStock == 0) {
				this.stocksGoods = this.stocksList[i];
				this.stocksPrice = 0;
				this.stocksGoodsID = null;
				return;
			}
			this.stocksGoods = this.stocksList[i];
			this.stocksPrice = this.shoppingMode ? this.stocksList[i].discountPrice : this.stocksList[i].wmDiscountPrice;
			this.stocksGoodsID = this.stocksList[i].goodsId;
		},

		deleteCartFuc() {
			//清空购物车
			let params = {
				shopId: this.currentShop.shopId, //店铺Id
			};
			let successFuc = res => {
				this.getCart();
				const constant = this.cartData.shoppingCarts.map(it => it.goodsId);
				constant.forEach(element => {
					let inx = this.goodsList.findIndex(item => item.goodsId == element);
					if (inx !== -1) this.goodsList[inx].number = 0;
				});
				this.cartModel = false;
			};
			AjaxApi("DeleteCart", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	.search-box {
		background: #ffffff;
		padding: 10rpx 40rpx;
	}
	.scroll-Y {
		height: calc(100vh - 160rpx);
	}
	.goods-box {
		min-height: 100vh;
		padding: 0 20rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom, 0);
		padding-bottom: env(safe-area-inset-bottom, 0);
		background: #f9fafb;
	}
	.goods-else{
		height: 100%;
		margin: 0 auto;
	}
	.goods-obj {
		position: relative;
		.sell-out {
			position: absolute;
			right: 0;
			top: 0;
			width: 76rpx;
			text-align: center;
			height: 40rpx;
			color: #fe6b00;
			background: rgba(254, 107, 0, 0.4);
			border-radius: 8rpx 0 0 30rpx;
			font-size: 20rpx;
			font-weight: bold;
			line-height: 40rpx;
		}
	}
	.goods-item {
		background: #ffffff;
		margin: 20rpx 0;
		padding: 32rpx 20rpx;
		border-radius: 8rpx;
		display: flex;
		&.sellout {
			color: #999999 !important;
		}
		view,
		text {
			overflow: hidden;
		}
		.goods-img {
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;
		}
		.goods-des {
			flex: 1;
			width: 0;
			margin-left: 20rpx;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.origin-num {
				min-width: 110rpx;
				height: 40rpx;
				line-height: 40rpx;
				background: #fe6b00;
				text-align: center;
				padding: 0 12rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #ffffff;
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
					bottom: 36rpx;
					background: #fa3534;
					color: #fff;
				}
			}
			.title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 4rpx;
			}
			.des1 {
				font-size: 20rpx;
				font-weight: 400;
				line-height: 24rpx;
				color: #333333;
				&.sellout {
					color: #999999 !important;
				}
				margin-bottom: 4rpx;
			}
			.des2 {
				font-size: 20rpx;
				line-height: 24rpx;
				color: rgba(153, 153, 153, 1);
				&.sellout {
					color: #999999 !important;
				}
				margin-bottom: 2rpx;
				.sold-num {
					margin-right: 30rpx;
				}
			}
			.btm {
				width: 100%;
				display: flex;
				justify-content: space-between;
				.price {
					line-height: 40rpx;
					font-size: 24rpx;
					color: rgba(255, 0, 0, 1);

					&.sellout {
						color: #999999 !important;
					}
					min-height: 46rpx;
					display: flex;
					flex-wrap: wrap;
					.num {
						font-size: 36rpx;
						font-weight: bold;
						margin-left: 2rpx;
					}
					.orgNum {
						color: #666666;

						&.sellout {
							color: #999999 !important;
						}
						font-size: 20rpx;
						margin-left: 14rpx;
						text-decoration: line-through;
						line-height: 46rpx;
					}
				}
				.count {
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
			}
		}
	}
	.goods-car-fixed {
		position: fixed;
		bottom: 0;
		z-index: 10080;
	}
	.cart-spc {
		margin: 0rpx 20rpx 60rpx 20rpx;
		width: 710rpx;
		min-height: 50rpx;
		padding: 8rpx 8rpx 68rpx 164rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		font-weight: 400;
		color: #fe6b00;
		background: #fdf1cd;
		box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.16);
		border-radius: 40rpx 40rpx 0 0;
	}
	.goods-car {
		margin: 0rpx 20rpx;
		width: 710rpx;
		height: 100rpx;
		margin-bottom: 20rpx;
		opacity: 1;
		border-radius: 50rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		.car-pic {
			background: rgba(0, 0, 0, 0.8);
			border-radius: 50rpx 0 0 50rpx;
			width: 140rpx;
			height: 100%;
			position: relative;
			/deep/.u-badge {
				z-index: 200;
			}
			image {
				height: 120rpx;
				width: 120rpx;
				position: absolute;
				left: 20rpx;
				top: -40rpx;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.3);
				border-radius: 50%;
			}
			.car-alive {
				height: 120rpx;
				width: 120rpx;
				position: absolute;
				left: 20rpx;
				top: -40rpx;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.3);
			}
		}
		.car-detail {
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.info {
				color: #fff;
				font-size: 28rpx;
				color: rgba(153, 153, 153, 1);
				opacity: 1;
			}
			.goods-detail {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				padding-left: 20rpx;
				background: rgba(0, 0, 0, 0.8);
				.total-price {
					line-height: 44rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: white;
					.orgin-price {
						margin-left: 14rpx;
						text-decoration: line-through;
						height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						line-height: 28rpx;
						color: #999999;
					}
				}
				.total-info {
					height: 28rpx;
					font-size: 20rpx;
					font-weight: 400;
					line-height: 30rpx;
					color: rgba(153, 153, 153, 1);
					opacity: 1;
				}
			}
			.car-btn {
				width: 200rpx;
				height: 100rpx;
				line-height: 30rpx;
				text-align: center;
				color: #ffffff;
				font-size: 28rpx;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				border-radius: 0rpx 50rpx 50rpx 0rpx;
				background: #999999;
			}
			.active {
				color: #ffffff;
				background: #fe6b00;
			}
		}
	}
	.coupon-popup1 {
		height: 808rpx;
		background-color: #f9fafb;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		/deep/.u-icon__icon {
			top: 18rpx !important;
			left: 10rpx;
		}
		.title-tit {
			min-height: 50rpx;
			padding: 0 20rpx;
			line-height: 30rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: #fe6b00;
			background: #fdf1cd;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 8rpx 8rpx 0 0;
		}
		.title {
			display: flex;
			width: 100%;
			font-size: 40rpx;
			line-height: 56rpx;
			padding: 32rpx 0;
			box-sizing: border-box;
			text {
				width: 150rpx;
				text-align: center;
				height: 56rpx;
				line-height: 56rpx;
			}
			.title-center {
				text-align: left;
				flex: 1;
			}
			.title-right {
				width: 150rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #fe6b00;
				margin-right: 40rpx;
			}
		}
		.goods-List-box {
			height: 900rpx;
			padding-bottom: 144rpx;
			box-sizing: border-box;
			.shop-list {
				padding: 0 40rpx;
				.shop-name {
					margin-top: 40rpx;
					line-height: 40rpx;
					font-size: 28rpx;
					box-sizing: border-box;
					height: 40rpx;
					font-weight: 400;
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
							.icon-style {
								font-size: 28rpx;
								margin-right: 12rpx;
								color: #343434;
							}
						}
					}
				}
				.coupon-item {
					display: flex;
					justify-content: space-between;
					padding: 40rpx 0rpx 40rpx;
					border-bottom: 1rpx solid rgba(226, 226, 226, 1);
					.goods-pic {
						width: 114rpx;
						height: 114rpx;
						margin-right: 36rpx;
						overflow: hidden;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.goods-detail {
						flex: 1;
						display: flex;
						.goods-top {
							margin-bottom: 4rpx;
							flex: 1;
							flex-grow: 1;
							width: 0;
							.goods-name {
								height: 44rpx;
								font-size: 32rpx;
								font-weight: 400;
								line-height: 44rpx;
								color: #333333;
							}
							.goods-prices {
								width: 130rpx;
								height: 44rpx;
								font-size: 32rpx;
								font-weight: bold;
								line-height: 44rpx;
								color: #333333;
								text {
									font-size: 20rpx;
									vertical-align: bottom;
								}
							}
						}
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
						.goods-descript {
							font-size: 20rpx;
							font-weight: 400;
							line-height: 30rpx;
							color: rgba(153, 153, 153, 1);
						}
						.price {
							line-height: 40rpx;
							font-size: 24rpx;
							color: rgba(255, 0, 0, 1);
							min-height: 46rpx;
							display: flex;
							flex-wrap: wrap;
							.num {
								font-size: 36rpx;
								font-weight: bold;
								margin-left: 2rpx;
							}
							.orgNum {
								color: #666666;
								font-size: 20rpx;
								margin-left: 14rpx;
								text-decoration: line-through;
								line-height: 46rpx;
							}
						}
					}
				}
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
			margin: 48rpx 40rpx;
			display: flex;
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
							margin-top: 20rpx;
							color: #999999;
							font-size: 24rpx;
							line-height: 1;
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
				min-height: 80rpx;
				overflow: hidden;
				font-size: 32rpx;
				color: #666;
				border: 2rpx solid #fe6b00;
				font-weight: 500;
				border-radius: 8rpx;
				padding: 0 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text {
					text-align: center;
					line-height: 80rpx;
				}
			}
			.ifchoose {
				background: #fe6b00;
				color: #ffffff;
			}
		}
		.ps-footer {
			margin-bottom: 20rpx;
			min-height: 100rpx;
			padding: 0 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			view {
				&:nth-child(1) {
					color: #333333;
					font-size: 48rpx;
				}
				&:nth-child(2) {
					width: 324rpx;
					height: 100rpx;
					background: #fe6b00;
					border-radius: 8rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #ffffff;
					text-align: center;
					line-height: 100rpx;
					&.gray {
						background: #999999;
						color: white;
					}
				}
			}
		}
	}
}
</style>
