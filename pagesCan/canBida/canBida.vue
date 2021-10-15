<template>
	<view class="container u-p-b-40">
		<view class="guide closeimg" v-if="configure.status == 0 && closeTips">
			<image class="newyear-img" src="https://oss.dianddian.cn/v2/tc/canbida.png" mode="aspectFill" @tap="tapCoupon(0)"></image>
			<image class="newyear-close" src="../../static/img/newyear-close.png" @tap="closeTips = false"></image>
		</view>
		<image src="https://oss.dianddian.cn/v2/428/bg1.png" mode="widthFix" class="bgimg"></image>
		<view class="rules" @tap="rulseStu = true">活动规则</view>
		<!-- status: 0, //0未开始1进行中2结束 -->
		<view class="countdown" v-if="configure.status == 0">
			下一波倒计时：
			<u-count-down :timestamp="timeStamp" font-size="28" bg-color="#ed2f20" separator-color="#fff" color="#fff" @end="actEnd"></u-count-down>
		</view>
		<view class="countdown" v-else-if="configure.status == 1">
			活动结束倒计时：
			<u-count-down :timestamp="timeStamp" font-size="28" bg-color="#ed2f20" separator-color="#fff" color="#ffff" @end="actEnd"></u-count-down>
		</view>
		<view class="countdown" v-else-if="configure.status == 2">活动已结束</view>
		<view class="countdown" v-else>当前位置暂无优惠活动</view>
		<view v-if="!activityStu">
			<view class="none-box" v-if="coupon.length">
				<view class="tips">
					<view>很遗憾</view>
					<view>根据您当前的位置暂无优惠活动</view>
					<view>送您一张通用红包，快去点餐吧</view>
				</view>
				<view class="couponcss u-m-t-40" v-if="coupon.length">
					<view>
						<view>
							<text class="u-font-24 u-m-r-8 bold">¥</text>
							<text style="font-size: 48rpx; font-weight: bold">{{ coupon[0].amount }}</text>
						</view>
						<view class="u-font-24 u-m-t-8">满{{ coupon[0].usedAmount ? coupon[0].usedAmount : 0 }}元可用</view>
					</view>
					<view class="u-p-l-20">
						<view class="u-font-32">{{ coupon[0].redPacketName }}</view>
						<view class="u-font-24 u-m-t-8">{{ coupon[0].validRemark }}</view>
					</view>
					<view class="u-m-r-24 u-font-24 u-text-center" @tap="tapCoupon(coupon[0].saleType)">去使用</view>
				</view>
			</view>
			<view class="inx-to-tit">
				<view class="u-font-32 bold" style="color: #ffffff">市集拼餐</view>
				<view class="u-font-24" style="color: #ffffff">点多家美食，享一单配送</view>
			</view>
			<view class="inx-to-goods" v-for="(item, inx) in groupGoods" :key="inx">
				<view class="u-m-b-20" @tap="toSpellOrder(item)">
					<view>
						<image class="img-a" :src="groupPic" mode="widthFix"></image>
						<view class="u-m-l-20">
							<view class="u-font-28 bold" style="color: #1c1c1d">{{ item.name }}</view>
							<view class="u-font-24" style="color: #ababaf">距离{{ item.distance }}</view>
						</view>
					</view>
					<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-arrow-r.png" mode="widthFix"></image>
				</view>
				<view>
					<view
						class="inx-to-good"
						v-for="(its, i) in item.listGroupShopGoodsInfo"
						:key="i"
						:style="{
							marginRight: Boolean((i + 1) % 3 == 0) ? '0' : Boolean(i + 1 == item.listGroupShopGoodsInfo.length) ? '122px' : 'auto',
						}"
						@tap="toSpellOrder(its)"
					>
						<view>
							<image
								:src="`${its.coverPic ? its.coverPic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`"
								mode="aspectFill"
							></image>
						</view>
						<view class="u-p-10">
							<view class="u-font-24 u-line-1" style="color: #1c1c1d">{{ its.goodsName }}</view>
							<view style="color: #ff3b3b">
								<text class="bold u-font-20">¥</text>
								<text class="bold u-font-24">{{ its.wmDiscountPrice }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-box" v-else>
			<view class="good-box u-m-t-20" v-for="(food, inx) in actGoods" :key="inx">
				<view>
					<image :src="food.shopLogo || groupPic" mode="aspectFill"></image>
					<view class="u-font-28 u-m-l-10 u-line-2" style="color: #1c1c1d">{{ food.shopName }}</view>
					<view class="u-font-24" style="color: #ababaf">距离{{ configure.distance }}</view>
				</view>
				<view>
					<view class="sell-out" v-if="food.isSaleOut">售罄</view>
					<image :src="food.coverPic" mode="aspectFill"></image>
					<view class="u-m-l-20">
						<view>
							<view class="u-font-32 u-line-2 bold" style="color: #1c1c1d">{{ food.goodsName }}</view>
							<view class="u-font-24 u-m-t-10" style="color: #ababaf">月售{{ food.count || 0 }}</view>
							<view class="u-font-24 u-m-t-10 bold" style="color: #ff1744" v-if="!food.isSaleOut">
								当前还剩：{{ food.avaliableInventory || 0 }}份
								<text class="u-m-l-10" v-if="food.copies < 6">,限点{{ food.copies }}份</text>
							</view>
						</view>
						<view>
							<view>
								<view class="u-font-24 discount u-m-b-10" v-if="food.discount">{{ food.discount }}</view>
								<view>
									<text class="u-font-24 bold">¥</text>
									<text class="u-font-36 bold">{{ food.buyPrice }}</text>
								</view>
							</view>
							<view class="u-text-center">
								<view class="u-font-24 u-m-b-10" style="color: #fe6b00">{{ food.likePerson }}人喜欢</view>
								<view class="addbtn u-text-center" style="" @tap="changeCart(food, 'plus')" v-if="configure.status == 1 && !food.isSaleOut">
									加购
								</view>
								<view class="addbtn u-text-center" style="background: #ababaf; color: #ffffff" v-else-if="configure.status == 0">待抢购</view>
								<view class="addbtn u-text-center" style="background: #ababaf; color: #ffffff" v-else-if="configure.status == 2">已售罄</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="u-text-center u-m-t-40" v-if="actGoods.length && pagesPram.pageDown">
				<u-loading v-if="pagesPram.pageDown" mode="circle"></u-loading>
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
		<!-- 购物车 -->
		<view class="car-box" v-if="activityStu && configure.status == 1">
			<view class="car-left" @tap="cancelPopup">
				<view class="image-box">
					<image src="../../static/img/car1.png" mode="aspectFill"></image>
					<u-badge type="error" size="small" :count="cartData.count || 0" :offset="[0, 0]"></u-badge>
				</view>
				<view class="price-con u-flex">
					<view>
						<view>¥{{ getPrice(cartData) }}</view>
						<view v-if="getPrice(cartData) * 1 !== cartData.totalOriginal * 1"> ¥{{ cartData.totalOriginal || 0 }} </view>
					</view>
					<view class="u-m-l-10 u-line-1" v-if="cartData.totalPackageFee">{{ `(含餐盒费¥${cartData.totalPackageFee})` }} </view>
				</view>
			</view>
			<view class="car-right join">
				<view class="do-class" v-if="!avatarUrl" @tap="updateUser">买单</view>
				<button class="do-class" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-else-if="!phone">买单</button>
				<view :class="[{ cant: !cartData.count }, 'do-class']" @tap="submit" v-else>{{
					!cartData.count && configure.qsj ? `¥${configure.qsj}起送` : "买单"
				}}</view>
			</view>
		</view>
		<!-- 购物车弹框 -->
		<block v-if="cartModel">
			<u-popup
				class="cart-popup"
				v-model="cartModel"
				:custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }"
				mode="bottom"
				:duration="50"
				:mask="true"
				:closeable="false"
				:safe-area-inset-bottom="true"
				border-radius="8"
				close-icon-pos="top-left"
			>
				<view>
					<view class="shop-name">
						<view class="u-line-1" @tap="cartModel = false"> 已选商品</view>
						<view @tap="deleteCart">
							<tetx class="iconfont icon-delete icon-style"></tetx>
							清空
						</view>
					</view>
					<scroll-view
						class="goods-list-box"
						scroll-y="true"
						show-scrollbar="true"
						:style="{
							height: flat * 210 + carts * 70 + 'rpx',
						}"
					>
						<view class="shop-list" v-for="(it, inx) in cartData.shoppingShopCarts" :key="inx">
							<view class="shop-header">
								<view>
									<image :src="it.pic" mode="aspectFill" class="u-m-r-20"></image>
									<view class="u-line-2">{{ it.shopName }}</view>
								</view>
								<view class="u-line-2 u-m-t-10">{{ it.discountMsg }}</view>
							</view>
							<view
								v-for="(i, index) in it.shoppingCarts"
								:class="[{ border: index == it.shoppingCarts.length - 1 }, 'coupon-item']"
								:key="index"
							>
								<view class="goods-pic">
									<image :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
								</view>
								<view class="goods-detail">
									<view class="goods-top">
										<view class="goods-name-popup u-line-1">{{ i.goodsName }}</view>
										<view class="goods-descript u-line-3">{{ i.specification }}</view>
										<view class="price-num">
											¥{{ i.wmDiscountPrice }}
											<text class="orgNum" v-if="Boolean(i.wmDiscountPrice !== i.wmOriginalPrice) && Boolean(!i.discount)">
												￥{{ i.wmOriginalPrice }}
											</text>
											<text class="discount-text2" v-if="i.discount">{{ i.customerName + `价¥${i.wmCustomerPrice}` }}</text>
										</view>
									</view>
									<view class="goods-count">
										<view class="count-minus iconfont icon-minus" @tap.stop="changeCart(i, 'minus', true)"> </view>
										<text>{{ i.number }}</text>
										<view class="count-plus iconfont icon-add" @tap.stop="changeCart(i, 'plus', true)"> </view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
		</block>
		<view v-if="rulseStu" class="guide" catchtouchmove="catchTouchMove">
			<view class="guide-content">
				<text user-select>
					{{
						`业务规则：
					1、${actRules.msg1}
					2、每次提供餐品数量有限，先到先得，抢完为止。
					${actRules.msg2 ? "3、" + actRules.msg2 : ""}
					${actRules.msg2 ? "4" : "3"}、每个订单允许购买一件或多件餐品。
					${actRules.msg2 ? "5" : "4"}、订单支付完成，取消订单视为放弃机会。
					
					免单说明： 
					1、当订单配送超出规定时间，全额返还（上限30），联系售后，以系统充值金额返还。
					2、免单活动仅适合该频道，以配送时间为准，平台有最终解释权。`
					}}
				</text>
				<image class="newyear-close" src="../../static/img/newyear-close.png" @tap="rulseStu = false"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, codeCheck, SHARE_URL } from "@/utils/api";
import { Decimal } from "decimal.js";
import { getUserLocation, paramConversion, getObjType } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			groupPic: "https://oss.dianddian.cn/v2/activity/newindex/groupPic.png", //市集头像
			activityStu: true,
			rulseStu: false,
			cartModel: false,
			qId: "",
			cbdId: "",
			groupGoods: [],
			cartData: {},
			groupMsg: {},
			actRules: {
				msg1: "",
				msg2: "",
			},
			goodsDetail: {},
			stocks: {
				id: 0,
				price: 0,
				originalPrice: 0,
				wmCustomerPrice: 0,
				goods: {}, //规格商品
				specList: [], //规格描述列表
				model: false, //规格弹窗
			},
			configure: {
				aaQsj: 20,
				activityId: 9877035,
				deliveryDistance: 2,
				distance: null,
				distance1: 0,
				qsj: 10,
				serviceRatio: 0.5,
				shippingFee: 2,
				status: 1, //0未开始1进行中2结束
				storeId: null,
				time: "14:34",
				validEndTime: "2021-05-20 23:59:59",
				validStartTime: "2021-05-13 00:00:01",
			},
			coupon: [],
			closeTips: true,
			timeStamp: 0,
			phone: "",
			avatarUrl: "",
			actGoods: [],
			pagesPram: {
				pageDown: false,
				pageIndex: 1,
				pageSize: 15,
			},
		};
	},
	onShareAppMessage: function () {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	onReachBottom(e) {
		if (this.pagesPram.pageDown) {
			this.pagesPram.pageIndex++;
			this.getActGoods();
		}
	},
	async onShow() {
		this.pagesPram.pageIndex = 1;
		const that = this;
		getUserLocation(that.init, true);
	},
	onLoad(option) {
		if (option?.q) {
			let link = paramConversion(decodeURIComponent(option?.q));
			this.qId = link.activityId;
			console.log("本次活动id", this.qId);
		} else {
			this.qId = option?.activityId ?? 0;
			this.cbdId = option?.cbdId ?? "";
		}
	},
	watch: {
		"cartData.count": {
			handler(newValue, oldValue) {
				if (newValue == 0) this.cartModel = false;
			},
		},
	},
	computed: {
		carts() {
			return this.cartData.shoppingShopCarts?.length;
		},
		flat() {
			return this.cartData.shoppingShopCarts?.map(it => it.shoppingCarts).flat().length;
		},
	},
	methods: {
		async init() {
			this.avatarUrl = getApp().globalData.UserInfo.wxNickName;
			this.phone = getApp().globalData.UserInfo.phone;
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			if (this.cbdId) {
				await store.dispatch("CanTake", { cbdId: this.cbdId });
			}
			let CanGet = await store.dispatch("CanGet", {});
			codeCheck(CanGet);
			if (!codeCheck(CanGet)) return;
			this.groupMsg = CanGet.data;
			this.qId = CanGet.data?.activityId ?? this.qId;
			let { longitude, latitude } = getApp().globalData.location;
			let obj = await store.dispatch("CanSelect", {
				userLatitude: latitude,
				userLongitude: longitude,
				activityId: this.qId,
				isPosition: getObjType(CanGet.data) !== "null" || this.cbdId ? 1 : 0, //是否根据定位展示活动,1:是,0:否
			});
			codeCheck(obj);
			if (!codeCheck(obj)) return;
			this.configure = obj.data || {};
			if (getObjType(obj.data) == "null") {
				this.activityStu = false;
				this.getGroupGoods();
			} else {
				this.activityStu = true;
				let event = new Date();
				let result = this.configure.time.split(":");
				event.setHours(result[0] * 1, result[1] * 1);
				this.timeStamp = (Date.parse(new Date(event)) - Date.parse(new Date())) / 1000;
				this.getActivity();
				let CanRules = await store.dispatch("CanRules", { id: this.configure.activityId });
				codeCheck(CanRules);
				if (!codeCheck(CanRules)) return;
				this.actRules = CanRules.data;
			}
		},
		async getActivity() {
			this.getActGoods(true);
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let chart = await store.dispatch("CanGetCart", { storeId: this.configure.storeId, activityId: this.configure.activityId });
			codeCheck(chart);
			if (!codeCheck(chart)) return;
			this.cartData = chart.data;
		},
		catchTouchMove() {
			// return !1;
		},
		cancelPopup() {
			//购物车弹框
			if (this.cartData.count == 0) return;
			this.cartModel = !this.cartModel;
		},
		getPrice(it) {
			let val = new Decimal(it.totalPrice ?? 0)
				.sub(new Decimal(it.reduceFee ?? 0))
				.sub(new Decimal(it.firstOrderDiscounts ?? 0))
				.add(new Decimal(it.totalPackageFee ?? 0));
			return val > 0 ? val : 0;
		},
		async changeCart(it, type, cart = false) {
			let res = await store.dispatch("GetGoodsDetail", { goodsId: it.goodsId });
			this.goodsDetail = { ...res.data, ...it };
			uni.vibrateShort();
			const {
				specification,
				stockId,
				wmOriginalPrice,
				wmDiscountPrice,
				buyPrice,
				coverPic,
				goodsName,
				shopId,
				goodsId,
				storeId,
				originalPrice,
				discountPrice,
			} = it;
			switch (type) {
				case "plus":
					//类别为一个或购物车加购
					if (Boolean(!res.data.goodsSpecifications.length) || cart) {
						const params = {
							shopId,
							coverPic,
							goodsId,
							storeId,
							stockId,
							goodsName,
							specification,
							wmOriginalPrice,
							wmDiscountPrice,
							originalPrice: cart ? originalPrice : wmOriginalPrice,
							discountPrice: cart ? discountPrice : buyPrice,
							isAdd: true,
							activityId: this.configure.activityId,
						};
						const successFuc = res => {
							const that = this;
							if (res.data) {
								uni.showToast({
									title: res.data,
									icon: "none",
									duration: 1500,
									success: () => {
										setTimeout(function () {
											that.getCart();
										}, 1500);
									},
								});
							} else {
								that.getCart();
							}
						};
						AjaxApi("CanSaveCart", params, successFuc);
					} else {
						//规格为多个
						this.stocks.goods = res.data;
						this.stocks.price = this.goodsDetail.buyPrice;
						this.stocks.wmCustomerPrice = this.goodsDetail.wmCustomerPrice;
						this.stocks.originalPrice = this.goodsDetail.wmOriginalPrice;
						this.stocks.id = this.goodsDetail.goodsId;
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
					}
					break;
				case "minus":
					const paramminus = {
						shopId,
						coverPic,
						goodsId,
						storeId,
						stockId,
						goodsName,
						specification,
						wmOriginalPrice,
						wmDiscountPrice,
						originalPrice: cart ? originalPrice : wmOriginalPrice,
						discountPrice: cart ? discountPrice : buyPrice,
						isAdd: false,
						activityId: this.configure.activityId,
					};
					const successFucminus = async () => {
						this.getCart();
					};
					AjaxApi("CanSaveCart", paramminus, successFucminus);
					break;
				default:
					break;
			}
		},
		async conformStocks() {
			//确认规格并加入购物车
			let SPEC = "";
			this.stocks.specList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const {
				specification,
				stockId,
				wmOriginalPrice,
				wmDiscountPrice,
				buyPrice,
				coverPic,
				goodsName,
				shopId,
				goodsId,
				storeId,
				originalPrice,
				discountPrice,
			} = this.goodsDetail;
			const params = {
				shopId,
				coverPic,
				goodsId,
				storeId,
				stockId,
				goodsName,
				wmOriginalPrice,
				wmDiscountPrice,
				specification: specification + SPEC, //库存描述
				originalPrice: false ? originalPrice : wmOriginalPrice,
				discountPrice: false ? discountPrice : buyPrice,
				isAdd: true,
				activityId: this.configure.activityId,
			};
			const successFuc = res => {
				const that = this;
				this.stocks.id = null;
				this.stocks.model = false;
				if (res.data) {
					uni.showToast({
						title: res.data,
						icon: "none",
						duration: 1500,
						success: () => {
							setTimeout(function () {
								that.getCart();
							}, 1500);
						},
					});
				} else {
					that.getCart();
				}
			};
			AjaxApi("CanSaveCart", params, successFuc);
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
		deleteCart() {
			//清空购物车
			let params = {
				storeId: this.configure.storeId,
				activityId: this.configure.activityId,
			};
			let successFuc = () => {
				this.getCart();
			};
			AjaxApi("CanDelCart", params, successFuc);
		},
		async getCart() {
			uni.showLoading({
				title: "获取购物车",
				mask: true,
			});
			const paramss = {
				storeId: this.configure.storeId,
				activityId: this.configure.activityId,
			};
			const awaitdata = await store.dispatch("CanGetCart", paramss);
			codeCheck(awaitdata);
			if (!codeCheck(awaitdata)) return;
			this.cartData = awaitdata.data;
		},
		bindPhone(e) {
			// 手机号码授权
			if (!e.detail.iv) {
				uni.showModal({
					title: "温馨提示",
					content: "您点击了拒绝授权，将无法进行分享，请授权之后再进入",
					showCancel: false,
					confirmText: "确定",
				});
				return;
			}
			uni.showLoading({
				title: "获取信息",
				mask: true,
			});
			let { encryptedData, iv } = e.detail;
			let params = {
				encryptedData: encryptedData,
				iv: iv,
			};
			let successFuc = async () => {
				let info = await store.dispatch("QueryUserInfo", {});
				getApp().globalData.UserInfo = info?.data ?? { phone: null };
				this.phone = getApp().globalData.UserInfo.phone;
			};
			AjaxApi("GetUserPhone", params, successFuc);
		},
		updateUser() {
			uni.getUserProfile({
				desc: "获取头像",
				success: res => {
					let { nickName, avatarUrl } = res.userInfo;
					let prams = {
						wxNickName: nickName,
						avatarUrl: avatarUrl,
					};
					let successFuc = async () => {
						let user = await store.dispatch("QueryUserInfo", {});
						getApp().globalData.UserInfo = user.data;
						let page = getCurrentPages().pop(); //获取当前页面实例
						if (page == undefined || page == null) return;
						page.onShow();
					};
					AjaxApi("PostUpdateUser", prams, successFuc);
				},
				fail: err => {
					console.log(err);
				},
			});
		},
		getGroupGoods() {
			let successFuc = async res => {
				this.groupGoods = res.data?.data;
			};
			AjaxApi(
				"SelectMakeUpList2",
				{ pageIndex: 1, pageSize: 3, userLatitude: getApp().globalData.location.latitude, userLongitude: getApp().globalData.location.longitude * 1 },
				successFuc
			);
			let successFucc = res => {
				this.coupon = res.data;
			};
			AjaxApi("CanCoupon", {}, successFucc);
		},
		getActGoods(first = false) {
			if (first) {
				this.actGoods = [];
				this.pagesPram = {
					pageDown: false,
					pageIndex: 1,
					pageSize: 15,
				};
			}
			let { pageIndex, pageSize } = this.pagesPram;
			let successFuc = async res => {
				if (!res?.data?.records.length) return;
				this.actGoods = this.actGoods.concat(res.data?.records);
				let pageCount = res.data.pages;
				let pageIndex = res.data.current;
				this.pagesPram.pageIndex = pageIndex;
				this.pagesPram.pageDown = Boolean(pageIndex < pageCount);
			};
			AjaxApi(
				"CanGoods",
				{
					pageIndex,
					pageSize,
					activityId: this.configure.activityId,
					userLatitude: getApp().globalData.location.latitude * 1,
					userLongitude: getApp().globalData.location.longitude * 1,
				},
				successFuc
			);
		},
		toSpellOrder(its) {
			uni.reLaunch({
				url: `/pages/spellOrder/spellOrder?storeId=${its?.storeId ?? 0}&shopId=${its?.shopId ?? 0}`,
			});
		},
		creatCan() {
			let successFuc = res => {
				this.groupMsg = res.data;
				this.settleFuc();
			};
			AjaxApi(
				"CanCreat",
				{
					activityId: this.configure.activityId,
					type: 1,
					storeId: this.configure.storeId,
				},
				successFuc
			);
		},
		submit() {
			if (this.groupMsg?.id) {
				this.settleFuc();
			} else {
				this.creatCan();
			}
		},
		settleFuc() {
			if (!this.cartData.count) return;
			getApp().globalData.previewImage = true;
			uni.navigateTo({
				url: `/pagesCan/settle/settle?id=${this.groupMsg.id}&type=1`,
			});
		},
		actEnd() {
			let page = getCurrentPages().pop(); //获取当前页面实例
			if (page == undefined || page == null) return;
			page.onShow();
		},
		tapCoupon(saleType) {
			uni.showLoading({
				title: "跳转中",
				mask: true,
			});
			this.$emit("inVite");
			/**
			 * 	0: "堂食",
				1: "外卖",
				2: "通用",
				3: "拼餐",
			 *  */
			switch (saleType) {
				case 3:
					uni.reLaunch({
						url: `/pages/spellOrder/spellOrder`,
					});
					break;
				default:
					uni.reLaunch({
						url: `/pages/index/index`,
					});
					break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	background: #fc565b;
	min-height: 100vh;
	.bold {
		font-weight: bold;
	}
	.none-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: auto;
		min-height: 404rpx;
		background: #ffffff;
		border-radius: 16rpx;
		margin: 20rpx 24rpx;
		padding: 20rpx 24rpx;
		.tips {
			font-size: 28rpx;
			color: #fe6b00;
			line-height: 40rpx;
			text-align: center;
		}
		.couponcss {
			width: 100%;
			height: 180rpx;
			background: #ffffff;
			border-radius: 16rpx;
			border: 2rpx solid #fff1f1;
			overflow: hidden;
			display: flex;
			align-items: center;
			> view {
				&:first-of-type {
					width: 200rpx;
					height: 100%;
					background: #fff1f1;
					color: #ff3b3b;
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
				&:nth-of-type(2) {
					> view {
						&:first-of-type {
							color: #1c1c1d;
						}
						&:last-of-type {
							color: #ababaf;
						}
					}
				}
				&:nth-of-type(3) {
					margin-left: auto;
					flex-shrink: 0;
					width: 132rpx;
					height: 56rpx;
					line-height: 56rpx;
					background: #ff3b3b;
					border-radius: 32rpx;
					font-weight: 600;
					color: #ffffff;
				}
			}
		}
	}
	.inx-to-tit {
		margin: 40rpx 24rpx 0 24rpx;
	}
	.inx-to-goods {
		margin: 20rpx 24rpx;
		padding: 20rpx;
		background: white;
		border-radius: 16rpx;
		> view {
			&:first-of-type {
				display: flex;
				justify-content: space-between;
				> view {
					display: flex;
					> view {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
				}
				image {
					vertical-align: middle;
					&.img-a {
						width: 74rpx;
						height: 74rpx;
						border-radius: 6rpx;
					}
					&.img-b {
						width: 16rpx;
						height: 24rpx;
						margin-top: 10rpx;
					}
				}
			}
			&:nth-of-type(2) {
				display: flex;
				flex-wrap: wrap;
				image {
					width: 208rpx;
					height: 160rpx;
				}
				.inx-to-good {
					border-radius: 6rpx;
					overflow: hidden;
					width: 208rpx;
					min-width: 0;
					> view {
						&:first-of-type {
							height: 160rpx;
						}
						&:nth-of-type(2) {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							height: 88rpx;
							background: #f6f6f7;
						}
					}
				}
			}
		}
	}
	.bgimg {
		width: 100vw;
		vertical-align: bottom;
	}
	.rules {
		width: 102rpx;
		text-align: center;
		line-height: 32rpx;
		height: 32rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0 200rpx 200rpx 0;
		font-size: 20rpx;
		color: #ffffff;
		position: absolute;
		left: 0;
		top: 12rpx;
	}
	.countdown {
		width: 400rpx;
		text-align: center;
		height: 52rpx;
		line-height: 52rpx;
		background: #ed2f20;
		box-shadow: 0 0 4rpx 0 rgba(0, 0, 0, 0.5);
		border-radius: 30rpx;
		border: 2rpx solid #ffffd0;
		font-size: 28rpx;
		font-weight: bold;
		color: #ffffff;
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		top: 164rpx;
	}
	.goods-box {
		padding: 0 24rpx;
		padding-bottom: 220rpx;
		&::before {
			content: "";
			display: table;
		}
		.good-box {
			width: auto;
			height: 348rpx;
			background: #ffffff;
			border-radius: 16rpx;
			padding: 0 24rpx;
			position: relative;
			.sell-out {
				position: absolute;
				right: 0;
				top: 0;
				width: 76rpx;
				text-align: center;
				height: 40rpx;
				color: #ceae73;
				background: rgba(229, 205, 161, 0.4);
				border-radius: 8rpx 0 0 30rpx;
				font-size: 20rpx;
				font-weight: bold;
				line-height: 40rpx;
			}
			> view {
				&:first-of-type {
					display: flex;
					height: 104rpx;
					align-items: center;
					image {
						width: 56rpx;
						height: 56rpx;
						border-radius: 28rpx;
						flex-shrink: 0;
					}
					> view {
						&:last-of-type {
							margin-left: auto;
							flex-shrink: 0;
						}
					}
				}
				&:last-of-type {
					display: flex;
					image {
						width: 220rpx;
						height: 220rpx;
						border-radius: 10rpx;
					}
					.discount {
						width: 80rpx;
						text-align: center;
						height: 34rpx;
						line-height: 34rpx;
						background: #fff2e8;
						border-radius: 6rpx;
						color: #fe6b00;
						font-weight: bold;
					}
					.addbtn {
						width: 152rpx;
						height: 60rpx;
						line-height: 60rpx;
						background: #fe6b00;
						font-weight: bold;
						color: #ffffff;
						border-radius: 10rpx;
					}
					> view {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						> view {
							&:last-of-type {
								width: 100%;
								display: flex;
								justify-content: space-between;
								align-items: flex-end;
							}
						}
					}
				}
			}
		}
	}
	.car-box {
		background: #ffffff;
		width: 100vw;
		padding: 0 24rpx;
		min-height: 100rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-bottom: 24rpx;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom, 0));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom, 0));
		display: flex;
		justify-content: space-between;
		align-items: center;
		.car-left {
			flex: 1;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.image-box {
				position: relative;
				image {
					width: 118rpx;
					height: 98rpx;
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
			.price-con {
				flex: 1;
				width: 0;
				> view {
					&:first-of-type {
						> view {
							&:first-of-type {
								font-size: 36rpx;
								font-weight: 500;
								color: #1e1f21;
								line-height: 50rpx;
							}
							&:nth-of-type(2) {
								font-size: 24rpx;
								font-weight: 400;
								color: #ababaf;
								line-height: 34rpx;
								text-decoration: line-through;
							}
						}
					}
					&:nth-of-type(2) {
						font-size: 24rpx;
						font-weight: 400;
						color: #1e1f21;
						line-height: 34rpx;
					}
				}
			}
		}
		.car-right {
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
			display: flex;
			justify-content: flex-end;
			.do-class {
				width: 160rpx;
				background: #fe6b00;
				&.cant {
					background: #999999;
				}
				color: #ffffff;
				border-radius: 36rpx;
			}
			button {
				border: 0;
				color: #fff;
				font-size: 28rpx;
				font-weight: 500;
				padding: 0;
				width: 160rpx;
				text-align: center;
				height: 72rpx;
			}
			view {
				width: 160rpx;
				text-align: center;
				height: 72rpx;
				line-height: 72rpx;
			}
			&.join {
				color: #343434;
			}
		}
	}
	.cart-popup {
		height: 808rpx;
		background-color: #f9fafb;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		/deep/.u-icon__icon {
			top: 18rpx !important;
			left: 10rpx;
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
				color: #e5cda1;
				opacity: 1;
				margin-right: 40rpx;
			}
		}
		.shop-name {
			width: auto;
			margin: 40rpx;
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
					color: #1c1c1d;
					font-weight: bold;
					flex: 1;
					width: 0;
				}
				&:nth-child(2) {
					width: 100rpx;
					display: flex;
					justify-content: flex-end;
					color: #ababaf;
					.icon-style {
						font-size: 28rpx;
						margin-right: 12rpx;
					}
				}
			}
		}
		.goods-list-box {
			min-height: 400rpx;
			max-height: 900rpx;
			padding-bottom: 0;
			box-sizing: border-box;
			.shop-list {
				padding: 0 40rpx;
				.shop-header {
					margin-top: 24rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					> view {
						line-height: 56rpx;
						&:first-of-type {
							display: flex;
							font-size: 28rpx;
							font-weight: bold;
							color: #1c1c1d;
							min-width: 200rpx;
							image {
								width: 56rpx;
								height: 56rpx;
								border-radius: 6rpx;
								border: 2rpx solid #f1f1f4;
								vertical-align: middle;
								flex-shrink: 0;
							}
						}
						&:nth-of-type(2) {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							color: #ff3b3b;
							line-height: 28rpx;
						}
					}
				}
				.coupon-item {
					display: flex;
					justify-content: space-between;
					padding: 40rpx 0rpx 40rpx;
					border-bottom: 1rpx solid rgba(226, 226, 226, 1);
					&.border {
						border-bottom: 0;
					}
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
							.goods-name-popup {
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
						.price-num {
							font-size: 32rpx;
							color: #ff3b3b;
							min-height: 44rpx;
							display: flex;
							flex-wrap: wrap;
							align-items: flex-end;
							.orgNum {
								color: #666666;
								font-size: 20rpx;
								margin-left: 14rpx;
								text-decoration: line-through;
							}
						}
					}
				}
			}
		}
	}
	.guide {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10090;
		color: #fff;
		background: rgba(0, 0, 0, 0.6);
		width: auto;
		height: 100vh;
		.newyear-close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			bottom: -20%;
			left: 50%;
			transform: translate(-50%, 0);
			margin: auto;
		}
		.guide-content {
			position: fixed;
			margin: auto;
			top: 45%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 40rpx 30rpx;
			width: 620rpx;
			min-height: 156rpx;
			background: #ffffff;
			border-radius: 16px;
			font-size: 24rpx;
			color: #1c1c1d;
			line-height: 34rpx;
		}
		&.closeimg {
			/deep/u-icon {
				position: absolute;
				bottom: 10%;
				left: 50%;
				transform: translate(-50%, 0);
				margin: auto;
			}
			.newyear-close {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				bottom: 28%;
				left: 50%;
				transform: translate(-50%, 0);
				margin: auto;
			}
			.newyear-img {
				position: fixed;
				margin: auto;
				left: 10%;
				right: 0;
				top: -20%;
				bottom: 0;
				transform: translate(-10%, 0);
				width: 635rpx;
				min-height: 692rpx;
			}
		}
	}
	.coupon-popup-stocks {
		/deep/.u-icon__icon {
			top: -10rpx;
			right: -0rpx;
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
	}
}
</style>
