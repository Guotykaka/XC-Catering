<template>
	<view class="wrapper">
		<u-mask class="load-mask" :show="loadingMask" z-index="10090" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<image class="banner-img" src="https://oss.dianddian.cn/common/ddd_log.png" mode="aspectFill"></image>
		</u-mask>
		<view class="del-box" v-if="flag">
			<view class="del-btn" @click="delShoppingCarAll(1)">清空</view>
		</view>
		<view class="shop-car-box">
			<view class="shop-car" v-for="(item, index) in shoppingCar" :key="index">
				<view class="shop-top">
					<view class="top-left" @click="jumpShop(item.shopId)">
						<view class="shop-name">
							<view>{{ item.shopName }}</view>
							<u-icon name="arrow-right" class="u-m-l-16"></u-icon>
						</view>
						<view class="shop-discount">
							<view class="discount-item" v-for="(els, inx) in item.activitys" :key="inx">{{ els }}</view>
						</view>
					</view>
					<view class="top-right" @click="delShoppingCarAll(2, item)">
						<text class="iconfont icon-delete"></text>
					</view>
				</view>
				<view class="car-con">
					<view class="car-goods-box">
						<view class="goods-box" v-for="(it, i) in item.shoppingCarts" :key="i" :style="{ 'margin-top': i == 0 ? '0rpx' : '40rpx' }">
							<image class="goods-img" :src="it.coverPic"></image>
							<view class="goods-des">
								<view class="title u-line-1">{{ it.goodsName }}</view>
								<view class="goods-descript">{{ it.specification ? it.specification : "暂无描述" }}</view>
								<view class="goods-price-box">
									<view class="goods-price"
										><span style="font-size: 20rpx; vertical-align: bottom">￥</span
										>{{ shoppingMode ? it.discountPrice : it.wmDiscountPrice }}
										<span class="orgNum">￥{{ shoppingMode ? it.originalPrice : it.wmOriginalPrice }}</span>
									</view>
									<view class="goods-right">
										<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart(it, 'minus')"> </view>
										<span>{{ it.number }}</span>
										<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(it, 'plus')"> </view>
									</view>
								</view>
							</view>
						</view>
						<view class="goods-discount">
							<view class="discount-item" v-if="!shoppingMode == 1">
								<view class="discount-left">餐盒费</view>
								<view class="discount-right"><span style="font-size: 20rpx">￥</span>{{ item.totalPackageFee }}</view>
							</view>
							<view class="discount-item" v-if="!shoppingMode == 1">
								<view class="discount-left"
									>配送费 ·
									<span
										>&nbsp;{{
											item.deliveryType == 1
												? "自配送"
												: item.deliveryType == 2
												? "达达配送"
												: item.deliveryType == 3
												? "蜂鸟配送"
												: "顺丰配送"
										}}
									</span></view
								>
								<view class="discount-right"><span style="font-size: 20rpx">￥</span>{{ item.shippingFee }}</view>
							</view>
							<view class="discount-item" v-if="item.reduceFee">
								<view class="discount-left">店铺满减</view>
								<view class="discount-right" style="color: red"><span style="font-size: 20rpx">-￥</span>{{ item.reduceFee }}</view>
							</view>
							<view class="discount-item" v-if="item.firstOrderDiscounts">
								<view class="discount-left">店铺首单立减</view>
								<view class="discount-right" style="color: red"
									><span style="font-size: 20rpx">-￥</span>{{ item.firstOrderDiscounts ? item.firstOrderDiscounts : 0 }}</view
								>
							</view>
						</view>
					</view>
					<view class="car-btn-box">
						<view class="car-btn-left">
							已优惠：<span>￥{{ item.totalReduceFee }}</span>
						</view>
						<view class="car-btn-right">
							<view class="btn-style" @click="sureOrder(item)"
								>去结算 {{ getPrice(item.totalPrice, item.reduceFee, item.firstOrderDiscounts, item.shippingFee) }}</view
							>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-con" v-if="notAvailable.length > 0" @click="changTag">
			{{ tag ? "收起不可购买购物车" : "查看不可购买商品" }}
			<span :class="[tag ? 'span1' : 'span2']"></span>
		</view>
		<view class="shop-car-box" v-if="notAvailable.length > 0 && tag">
			<view class="shop-car" v-for="(item, index) in notAvailable" :key="index">
				<view class="shop-top">
					<view class="top-left">
						<view class="shop-name">
							<view>{{ item.storeName }}{{ item.shopName }}</view>
							<u-icon name="arrow-right" class="u-m-l-16"></u-icon>
						</view>
						<view class="shop-discount">
							<view class="discount-item" v-for="(els, inx) in item.activitys" :key="inx">{{ els }}</view>
						</view>
					</view>
					<view class="top-right"></view>
					<view class="tag-style">休息中</view>
				</view>
				<view class="car-con">
					<view class="car-goods-box">
						<view class="goods-box" v-for="(it, i) in item.shoppingCarts" :key="i">
							<image class="goods-img" :src="it.coverPic"></image>
							<view class="goods-des">
								<view class="title u-line-1" style="color: #d5d5d5">{{ it.goodsName }}</view>
								<view class="goods-descript" style="color: #d5d5d5">{{ it.description ? it.description : "暂无描述" }}</view>
								<view class="goods-price-box">
									<view class="goods-price" style="color: #d5d5d5"
										><span style="font-size: 20rpx; vertical-align: bottom; color: #d5d5d5">￥</span
										>{{ shoppingMode ? it.discountPrice : it.wmDiscountPrice }}</view
									>
								</view>
							</view>
						</view>
					</view>
					<view class="car-btn-box1">
						<view class="btn-del" @click="delShoppingCarAll(2, item)">删除</view>
						<view class="btn-add" @click="jumpShop(item.shopId)">重选</view>
					</view>
				</view>
			</view>
		</view>
		<u-mask :show="cancelMask">
			<view class="mask-slot">
				<view>
					<view> 提示</view>
					<view>{{ msgtip }}</view>
				</view>
				<view>
					<view @tap.stop="cancelMask = false">取消</view>
					<view @tap.stop="turnToCancel" style="color: #ceae73">确定</view>
				</view>
			</view>
		</u-mask>
		<u-popup
			class="coupon-popup-stocks"
			v-model="shows_tocks"
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
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh">
					<view class="ps-tittle" @tap="shows_tocks = false">
						<view>
							<image class="banner-img" :src="`${stocksObj.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
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
					<div v-for="(item, i) in goodsSpecificationsList" :key="i">
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
				<view class="ps-mini-tittle" style="margin-top: 20rpx">{{ stocksGoods.specification || "请选择" }}</view>
				<view class="ps-footer">
					<view><text style="font-size: 28rpx">￥\t</text>{{ stocksPrice }}</view>
					<view @tap="conformStocks(i)" :class="{ gray: !stocksGoodsID }"> 加入购物车</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
import store from "@/store";
import { Decimal } from "decimal.js";
export default {
	data() {
		return {
			tag: false,
			flag: true,
			cancelMask: false,
			loadingMask: true,
			shows_tocks: false, //规格弹窗
			delType: 0,
			shoppingMode: getApp().globalData.shoppingMode, //购物车是到店还是外卖
			msgtip: "",
			delShopId: null,
			stocksPrice: null, //规格价格
			stocksGoodsID: null,
			cartData: {}, //当前结算购物车1信息
			orderPara: {},
			currentShop: {}, //当前结算购物车档口信息
			stocksGoods: {}, //选中的库存对象
			currentGoods: {}, //当前价购物车的菜品对象
			stocksObj: [], //规格商品
			stocksList: [], //规格列表
			shoppingCar: [], //可购买购物车列表
			notAvailable: [], //不可购买商品列表
			goodsSpecificationsList: [], //2规格列表
		};
	},
	onShow() {
		this.loadingMask = true;
		this.init();
	},
	methods: {
		async jumpShop(val) {
			let res = await store.dispatch("SelectShopInfo", {
				shopId: val,
			});
			this.currentShop = res.data;
			console.log("jumpShop -> this.currentShop", this.currentShop);
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
		async sureOrder(val) {
			this.cartData = val;
			let res = await store.dispatch("SelectShopInfo", {
				shopId: val.shopId,
			});
			this.currentShop = res.data;
			this.orderPara = {
				actualPayment: new Decimal(val.totalPrice ?? 0).sub(new Decimal(val.reduceFee ?? 0)), //实际支付金额},
				location: this.currentShop.location, //经纬度
				productAmount: val.totalPrice, //商品订单金额
				reduceFee: val.reduceFee ?? 0, //优惠总金额(红包+优惠满减)
				shopId: this.currentShop.shopId, //店铺Id
				shopName: this.currentShop.shopName, //店铺名称
				shoppingCartReqs: val.shoppingCarts, //购物车信息
				stallName: this.currentShop.shopName, //档口名称
				packageFee: val.totalPackageFee ?? 0, //餐盒
				storeId: this.currentShop.storeId, //门店Id
				storeName: this.currentShop.storeName, //门店名称
				recipientName: getApp().globalData.UserInfo.wxNickName ?? "", //收货人名字
				recipientPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
				reservedPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
				recipientAddress: "", //收货地址
				orderType: this.shoppingMode, //0,外卖,1堂食
			};
			if (!this.checkoutclass(val)) {
				return;
			}
			if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
				uni.navigateTo({
					url: "/pagesB/login/login",
				});
				return;
			}
			this.beforeSub(Boolean(val.errorGoodsName), Boolean(val.noSingleOrder), val.errorGoodsName);
			if (Boolean(val.errorGoodsName) || Boolean(val.noSingleOrder)) return;
			uni.navigateTo({
				url: `/pagesA/confirmOrder/confirmOrder`,
			});
		},
		async changeSPcart(it, type, stockId = null) {
			this.currentGoods = it;
			uni.showLoading({
				title: "加载",
				mask: true,
			});
			uni.vibrateShort();
			//添加或删除菜品
			let params = { goodsId: it?.goodsId };
			let res = await store.dispatch("GetGoodsDetail", params);
			const { coverPic, description, discountPrice, goodsId, goodsName } = it;
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
							shopId: it.shopId, //店铺Id
							stockId: it.stockId, //库存Id
							specification: it.specification, //库存描述
						};
						const successFuc = res => {
							this.init();
						};
						AjaxApi("SaveCart", params, successFuc);
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
							const successFuc = async res => {
								this.init();
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
						this.goodsSpecificationsList = res.data.goodsSpecifications.filter((item, i) => {
							const index = item.children.findIndex(ele => ele.checked == true);
							item.children = item.children.filter((it, inx) => {
								inx == index ? (it.choose = true) : (it.choose = false);
								if (it.checked) {
									return it;
								}
							});
							return item;
						});
						this.shows_tocks = true;
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
								this.init();
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
			this.goodsSpecificationsList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const { coverPic, description, goodsId, goodsName } = this.currentGoods;
			const params = {
				coverPic,
				description,
				goodsId,
				goodsName,
				discountPrice: this.stocksPrice,
				isAdd: true,
				shopId: this.currentGoods.shopId, //店铺Id
				stockId: this.stocksGoods.stockId, //库存Id
				specification: this.stocksGoods.specification + SPEC, //库存描述
			};
			const successFuc = async res => {
				this.currentGoods = {};
				this.stocksGoodsID = null;
				this.shows_tocks = false;
				this.init();
			};
			AjaxApi("SaveCart", params, successFuc);
		},
		init() {
			let params = {
				orderType: this.shoppingMode,
			};
			let successFuc = res => {
				this.notAvailable = res.data.notAvailable;
				this.shoppingCar = res.data.available;
				this.flag = this.notAvailable || this.shoppingCar;
				this.loadingMask = false;
			};
			AjaxApi("GetShoppingCar", params, successFuc);
		},
		getPrice(val1, val2, val3, val4) {
			let val = new Decimal(val1 ?? 0).sub(new Decimal(val2 ?? 0)).sub(new Decimal(val3 ?? 0));
			if (!this.shoppingMode) {
				if (val > 0) {
					return `￥${new Decimal(val).add(new Decimal(val4 ?? 0))}`;
				} else {
					return `￥${val4}`;
				}
			} else {
				if (val > 0) {
					return `￥${val}`;
				} else {
					return `￥0`;
				}
			}
		},
		changTag() {
			this.tag = !this.tag;
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
		chooseSpec(i, inx) {
			//选规格
			if (this.goodsSpecificationsList[i].simple === 2) {
				const index = this.goodsSpecificationsList[i].children.filter(item => item.choose == true);
				this.goodsSpecificationsList[i].children[inx].choose = index.length == 1 ? true : !this.goodsSpecificationsList[i].children[inx].choose;
			} else {
				this.goodsSpecificationsList[i].children.filter((element, index) => {
					element.choose = index == inx ? true : false;
					return element;
				});
			}
			this.$forceUpdate();
		},
		turnToCancel() {
			if (this.delType == 1) {
				let params = {};
				let successFuc = res => {
					this.flag = false;
					this.cancelMask = false;
					this.init();
				};
				AjaxApi("DelShoppingCar", params, successFuc);
			}
			if (this.delType == 2) {
				let params = {
					shopId: this.delShopId, //店铺Id
				};
				let successFuc = res => {
					this.cancelMask = false;
					this.init();
				};
				AjaxApi("DeleteCart", params, successFuc);
			}
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
		checkoutclass(obj) {
			let that = this;
			if (obj.required || this.currentShop.status !== 1) {
				uni.showModal({
					title: "提示",
					content: "未点必选菜品,请前往该店铺选购!",
					cancelText: "知道了",
					cancelColor: "#666666",
					confirmText: "去添加",
					confirmColor: "#CEAE73",
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/home/home?shopId=${obj.shopId}`,
							});
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
				return false;
			} else if (!this.shoppingMode) {
				if (this.currentShop?.startDeliveryAmount ?? 0 !== 0) {
					let amount = new Decimal(this.currentShop?.startDeliveryAmount ?? 0).sub(new Decimal(obj.totalPrice ?? 0));
					if (amount * 1 > 0 ? true : false) {
						uni.showModal({
							title: "提示",
							content: "菜品金额不满足起送金额,请前往该店铺选购!",
							cancelText: "知道了",
							cancelColor: "#666666",
							confirmText: "去添加",
							confirmColor: "#CEAE73",
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url: `/pages/home/home?shopId=${obj.shopId}`,
									});
								} else if (res.cancel) {
									console.log("用户点击取消");
								}
							},
						});
					}
					return amount * 1 > 0 ? false : true;
				} else {
					return true;
				}
			} else {
				if (this.currentShop?.buyAmount ?? 0 !== 0) {
					let amount = new Decimal(this.currentShop?.buyAmount ?? 0).sub(new Decimal(obj.totalPrice ?? 0));
					if (amount * 1 > 0 ? true : false) {
						uni.showModal({
							title: "提示",
							content: "菜品金额不满足起点金额,请前往该店铺选购!",
							cancelText: "知道了",
							cancelColor: "#666666",
							confirmText: "去添加",
							confirmColor: "#CEAE73",
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url: `/pages/home/home?shopId=${obj.shopId}`,
									});
								} else if (res.cancel) {
									console.log("用户点击取消");
								}
							},
						});
					}
					return amount * 1 > 0 ? false : true;
				} else {
					return true;
				}
			}
		},
		delShoppingCarAll(val, val2) {
			this.delType = val;
			if (val == 1) {
				this.msgtip = "您确定要删除全部购物车?";
			}
			if (val == 2) {
				this.delShopId = val2.shopId;
				this.msgtip = `您确定要删除${val2.shopName}的购物车?`;
			}
			this.cancelMask = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 0 20rpx;
	.del-box {
		padding: 20rpx;
		display: flex;
		justify-content: flex-end;
		.del-btn {
			padding: 6rpx 18rpx;
			background: #e5cda1;
			border-radius: 8rpx;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 34rpx;
			color: #343434;
			opacity: 1;
		}
	}
	.shop-car-box {
		width: 100%;

		.shop-car {
			background: #fff;
			margin-bottom: 20rpx;
			.shop-top {
				width: 100%;
				padding: 18rpx 42rpx 22rpx 42rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.top-left {
					flex: 1;
					.shop-name {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						&:first-child {
							font-size: 32rpx;
							font-weight: bold;
							line-height: 44rpx;
							color: #333333;
						}
						&:last-child {
							font-size: 12rpx;
							color: #d5d5d5;
						}
					}
					.shop-discount {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						.discount-item {
							line-height: 28rpx;
							border-radius: 4rpx;
							padding: 0 14rpx;
							border: 1rpx solid rgba(255, 77, 79, 1);
							color: rgba(255, 77, 79, 1);
							font-size: 20rpx;
							display: inline-block;
							margin-top: 10rpx;
							margin-right: 8rpx;
						}
					}
				}
				.top-right {
					width: 80rpx;
					height: 100%;
					display: flex;
					justify-content: flex-end;
					align-items: flex-start;
					text {
						font-size: 32rpx;
						color: #999999;
					}
				}
				.tag-style {
					position: absolute;
					top: 0;
					right: 0;
					padding: 8rpx 8rpx 8rpx 16rpx;
					font-size: 24rpx;
					font-weight: bold;
					line-height: 34rpx;
					color: #343434;
					border-radius: 8rpx 8rpx 8rpx 30rpx;
					background: #e5cda1;
				}
			}
			.car-con {
				padding: 0 20rpx;
				box-sizing: border-box;
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, #ffffff 100%);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				opacity: 1;
				border-radius: 8rpx;
				.car-goods-box {
					padding: 40rpx 18rpx 40rpx 22rpx;
					border-bottom: 1rpx solid #e2e2e2;
					.goods-box {
						margin-top: 60rpx;
						display: flex;
						view,
						text {
							overflow: hidden;
						}
						.goods-img {
							width: 120rpx;
							height: 120rpx;
							border-radius: 4rpx;
						}
						.goods-des {
							flex: 1;
							width: 0;
							margin-left: 16rpx;
							position: relative;
							display: flex;
							flex-direction: column;
							justify-content: flex-start;
							.title {
								font-size: 32rpx;
								font-weight: 400;
								line-height: 44rpx;
								color: #333333;
							}
							.goods-descript {
								font-size: 20rpx;
								font-weight: 400;
								line-height: 30rpx;
								color: #999999;
							}
							.goods-price-box {
								flex: 1;
								display: flex;
								justify-content: space-between;
								align-items: flex-end;
								.goods-price {
									font-size: 32rpx;
									font-weight: bold;
									line-height: 44rpx;
									color: #333333;
									.orgNum {
										color: #666666;
										font-size: 20rpx;
										margin-left: 14rpx;
										text-decoration: line-through;
									}
								}
								.goods-right {
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
										color: #343434;
										text-align: center;
										line-height: 46rpx;
										border-radius: 50%;
										background: #e5cda1;
									}
									span {
										padding: 0 14rpx;
									}
								}
							}
						}
					}
					.goods-discount {
						padding-top: 20rpx;
						.discount-item {
							margin-top: 20rpx;
							height: 40rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #333333;
							font-size: 28rpx;
							.discount-left {
								font-weight: 400;
								line-height: 40rpx;
							}
							.discount-right {
								font-weight: bold;
								line-height: 40rpx;
							}
						}
					}
				}
				.car-btn-box {
					height: 104rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0rpx 10rpx 0rpx 22rpx;
					.car-btn-left {
						font-size: 28rpx;
						font-weight: 400;
						line-height: 40rpx;
						color: #333333;
						opacity: 1;
						span {
							font-weight: bold;
							line-height: 40rpx;
						}
					}
					.car-btn-right {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						height: 104rpx;
						.btn-style {
							height: 64rpx;
							margin-left: 32rpx;
							padding: 12rpx 32rpx;
							background: #e5cda1;
							border-radius: 8rpx;
							font-size: 28rpx;
							font-weight: bold;
							color: #343434;
						}
					}
				}
				.car-btn-box1 {
					height: 104rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding: 0rpx 10rpx 0rpx 22rpx;
					.btn-del {
						height: 64rpx;
						background: #ffffff;
						border: 2rpx solid #d5d5d5;
						opacity: 1;
						border-radius: 8rpx;
						padding: 12rpx 32rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #343434;
					}
					.btn-add {
						height: 64rpx;
						margin-left: 32rpx;
						padding: 12rpx 32rpx;
						background: #e5cda1;
						border-radius: 8rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #343434;
					}
				}
			}
		}
	}
	.btn-con {
		background: #fff;
		margin: 20rpx auto;
		width: 670rpx;
		height: 100rpx;
		justify-content: center;
		align-items: center;
		display: flex;
		font-size: 28rpx;
		font-weight: 400;
		line-height: 82rpx;
		color: #ceae73;
		span {
			margin-left: 8rpx;
			width: 0;
			height: 0;
			border-style: solid;
		}
		.span1 {
			border-width: 0 8rpx 10rpx;
			border-color: transparent transparent #ceae73;
		}
		.span2 {
			border-width: 10rpx 8rpx 0;
			border-color: #ceae73 transparent transparent;
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
		height: 392rpx;
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
				height: 294rpx;
				> view {
					&:nth-child(1) {
						padding: 52rpx 0 20rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 40rpx;
						color: #333333;
					}
					&:nth-child(2) {
						height: 40rpx;
						font-size: 28rpx;
						font-weight: 400;
						line-height: 44rpx;
						color: #666666;
					}
				}
				img {
					margin: 0 auto;
					width: 94rpx;
					height: 100rpx;
				}
			}
			&:nth-child(2) {
				border-top: 2rpx solid #e2e2e2;
				height: 96rpx;
				display: flex;
				justify-content: flex-start;
				font-weight: 500;
				font-size: 36rpx;
				color: #666666;
				> view {
					height: 100%;
					width: 50%;
					display: flex;
					justify-content: center;
					align-items: center;
					&:nth-child(1) {
						border-right: 2rpx solid #e2e2e2;
					}
				}
			}
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
				// flex: 1;
				// width: 0;
				min-width: 30%;
				// max-width: 30%;
				margin-left: 20rpx;
				// &:not(:first-child):not(:nth-child(2)):not(:nth-child(3)) {
				// 	margin-top: 20rpx;
				// }
				margin-top: 20rpx;
				min-height: 80rpx;
				overflow: hidden;
				font-size: 32rpx;
				color: #666;
				// background: #fafafa;
				border: 2rpx solid #e5cda1;
				font-weight: 500;
				border-radius: 8rpx;
				padding: 0 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text {
					// width: 100%;
					//  white-space: nowrap;
					text-align: center;
					line-height: 80rpx;
				}
			}
			.ifchoose {
				background: #e5cda1;
				color: #343434;
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
					background: #e5cda1;
					border-radius: 8rpx;
					font-size: 36rpx;
					font-weight: 500;
					color: #343434;
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
	.coupon-popup-stocks {
		/deep/.u-icon__icon {
			top: -10rpx;
			right: -0rpx;
		}
	}
}
</style>
