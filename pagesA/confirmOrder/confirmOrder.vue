<template>
	<view class="container">
		<u-mask :show="payMask"></u-mask>
		<view class="top"> </view>
		<view class="bot">
			<view class="info-box">
				<view class="user-info">
					<!-- 堂食 -->
					<view v-if="tabtype">
						<view class="address-box">
							<view class="address">{{ currentShop.address }}</view>
							<view class="address-icon" v-if="currentShop.distance">
								<!-- <text class="iconfont icon-addr"></text> -->
								<img src="../../static/img/dizhi.png" />
								<view>距你{{ currentShop.distance }}</view>
							</view>
						</view>
						<view class="box-group u-p-t-30">
							<radio-group @change="radioChange">
								<label class="">
									<img v-if="orderPara.orderType == 1" src="https://oss.dianddian.cn/v2/tangshi2.png" alt="" />
									<img v-else src="https://oss.dianddian.cn/v2/tangshi1.png" alt="" />
									<view style="height: 50rpx">
										<radio :value="1" :checked="orderPara.orderType == 1" style="transform: scale(0.7); height: 30rpx" color="#fe6b00" />
									</view>
								</label>
								<label class="">
									<img style="width: 120rpx" v-if="orderPara.orderType == 2" src="https://oss.dianddian.cn/v2/daodian1.png" alt="" />
									<img style="width: 120rpx" v-else src="https://oss.dianddian.cn/v2/daodian2.png" alt="" />
									<view style="height: 50rpx">
										<radio :value="2" :checked="orderPara.orderType == 2" style="transform: scale(0.7); height: 30rpx" color="#fe6b00" />
									</view>
								</label>
							</radio-group>
						</view>
						<view class="box-type u-flex u-row-left">
							<view class="left" @tap="getMealTime">
								<view class="text">取餐时间</view>
								<view class="time" v-if="currentShop.isOpen == 0">
									<view
										style="margin-right: 10rpx"
										v-if="orderPara.takeMealTime !== '现在取餐' && currentShop.isOpen == 0 && selectTimeInx !== 0"
										>{{ chosenDate }}</view
									>
									<view>{{ mealTime }} </view>
									<view class="icon">
										<text class="iconfont icon-arrow-right"></text>
									</view>
								</view>
								<view class="time" v-else>
									<view>{{ mealTime }} </view>
								</view>
							</view>
							<view class="right" @tap="chooseInput('phone')">
								<view class="text">预留手机号</view>
								<view class="time">
									{{ orderPara.reservedPhone }}
									<view class="icon">
										<text class="iconfont icon-edit" style="font-size: 24rpx"></text>
									</view>
								</view>
							</view>
						</view>
						<view class="user-num" @tap="chooseInput('person')" v-if="orderPara.orderType == 2">
							<view class="num-left">就餐人数</view>
							<view class="num-right">
								<text>{{ orderPara.person }}</text>
								<text class="iconfont icon-arrow-right icon"></text>
							</view>
						</view>
					</view>
					<!-- 有收货地址 -->
					<view v-if="!tabtype">
						<view class="have-address" v-if="ifHaveAddr">
							<!-- 收货地址 -->
							<view class="address-box1 u-flex u-row-between" @tap="jumpAddressList">
								<view class="">
									<view class="address-info">
										<text>{{ orderPara.recipientAddress }}</text>
									</view>
									<view class="u-flex u-row-left u-font-24" style="color: #666666">
										<text class="u-m-r-10">{{ orderPara.recipientName }}({{ SEX }})</text>
										<text>{{ orderPara.recipientPhone }}</text>
									</view>
								</view>
								<text class="iconfont icon-arrow-right icon u-font-12"></text>
							</view>
							<!-- 派送时间 -->
							<view class="delivery-time u-flex u-row-between">
								<view class="u-font-14 delivery-title">预计送达</view>
								<view class="u-flex u-row-right" @tap="getMealTime">
									<text class="time" space="emsp">{{ chosenDate }} {{ deliverTime }}</text>
									<text class="iconfont icon-arrow-right icon u-font-12 u-m-l-14" v-if="currentShop.isOpen == 0"></text>
								</view>
							</view>
							<view class="delivery-time u-flex u-row-between">
								<view class="u-font-14 delivery-title">就餐人数</view>
								<view class="u-flex u-row-right" @tap="chooseInput('person')">
									<text class="time">{{ orderPara.person }}</text>
									<text class="iconfont icon-arrow-right icon u-font-12 u-m-l-14"></text>
								</view>
							</view>
						</view>
						<!-- 没有收货地址 -->
						<view class="no-address u-text-center" v-else @tap="addAddress">
							<view class="iconfont icon-add u-font-25 u-m-b-8"></view>
							<view class="add-address u-text-center">新增地址</view>
						</view>
					</view>
				</view>
				<view class="goods-info">
					<view class="shop-name">
						{{ orderPara.storeName }}
						<text class="iconfont icon-arrow-right"></text>
					</view>
					<view class="goods-list-box">
						<view class="goods-detail">
							<view class="stall-name">
								{{ orderPara.shopName }}
							</view>
							<view class="goods-box" v-for="(i, index) in orderPara.shoppingCartReqs" :key="index">
								<image :src="i.coverPic" mode="aspectFill"></image>
								<view class="goods-right" style="min-width: 0">
									<view class="goods-top">
										<view class="top-left u-line-1 u-skeleton-rect">{{ i.goodsName }}</view>
										<view class="top-right">
											<text class="goods-num">×{{ i.number }}</text>
											<text class="goods-price">
												<text class="u-font-10">￥</text>{{ tabtype ? i.discountPrice : i.wmDiscountPrice }}</text
											>
										</view>
									</view>
									<view class="goods-bot u-line-1 u-skeleton-rect">{{ i.specification }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="orderPara.orderType * 1 !== 1">
						<view class="coupon-title">餐盒费</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-2"><text class="u-font-10">￥</text>{{ orderPara.packageFee ? orderPara.packageFee : 0 }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="!tabtype">
						<view class="coupon-title"
							>配送费&nbsp;•&nbsp;{{
								currentShop.deliveryType == 1
									? "自配送"
									: currentShop.deliveryType == 2
									? "达达配送"
									: currentShop.deliveryType == 3
									? "蜂鸟配送"
									: "顺丰配送"
							}}</view
						>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-2 u-m-r-48 u-font-24" style="color: #999999" v-if="orderPara.realityShippingFee !== orderPara.shippingFee"
								><text class="u-font-10">￥\t&nbsp;</text>{{ orderPara.realityShippingFee ? orderPara.realityShippingFee : 0 }}</text
							>
							<text class="info-2"><text class="u-font-10">￥</text>{{ orderPara.shippingFee ? orderPara.shippingFee : 0 }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between">
						<view class="coupon-title">店铺满减</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1"><text class="u-font-10">-￥</text></text>
							<text class="info-2">{{ orderPara.reduceFee }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between">
						<view class="coupon-title">平台券</view>
						<view class="coupon-right u-flex u-row-left" @tap="chooseCoupon(0)">
							<text class="info-1" v-if="orderPara.redPackageFee[0]" style="color: #ff4d4f"><text class="u-font-10">-￥</text></text>
							<text class="info-2" v-if="orderPara.redPackageFee[0]" style="color: #ff4d4f">{{ orderPara.redPackageFee[0] }}</text>
							<text class="info" v-if="!orderPara.redPackageFee[0]">{{ REDP }}</text>
							<text class="iconfont icon-arrow-right icon-right u-m-l-14"></text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between">
						<view class="coupon-title">商家券</view>
						<view class="coupon-right u-flex u-row-left" @tap="chooseCoupon(1)">
							<text class="info-1" v-if="orderPara.redPackageFee[1]" style="color: #ff4d4f"><text class="u-font-10">-￥</text></text>
							<text class="info-2" v-if="orderPara.redPackageFee[1]" style="color: #ff4d4f">{{ orderPara.redPackageFee[1] }}</text>
							<text class="info" v-if="!orderPara.redPackageFee[1]">{{ MCREDP }}</text>
							<text class="iconfont icon-arrow-right icon-right u-m-l-14"></text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="firstOrderDiscounts">
						<view class="coupon-title">店铺首单立减</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1"><text class="u-font-10">-￥</text></text>
							<text class="info-2">{{ firstOrderDiscounts }}</text>
						</view>
					</view>
					<view class="subtotal u-flex u-row-right">
						<view class="subtotal-right u-flex u-col-bottom u-m-r-40" v-if="discountedPrice">
							<text class="u-font-10 u-m-r-6 u-m-b-6">已优惠：</text>
							<text class="u-font-10 u-m-b-6">￥</text>
							<text class="u-font-18">{{ discountedPrice }}</text>
						</view>
						<view class="subtotal-right u-flex u-col-bottom">
							<text class="u-font-12 u-m-r-6 u-m-b-6">实付：</text>
							<text class="u-font-10 u-m-b-6">￥</text>
							<text class="u-font-18">{{ orderPara.actualPayment }}</text>
						</view>
					</view>
				</view>
				<view class="remarks-box">
					<view class="textarea-box">
						<textarea
							placeholder="请输入备注"
							placeholder-style="font-size:28rpx;color:#DDDDDD"
							maxlength="50"
							:value="orderPara.remark"
							@input="getValue"
							cursor-spacing="200"
							height="240"
						></textarea>
					</view>
				</view>
				<view class="notes-box">
					<view class="notes-item" @tap="getText(item)" v-for="(item, index) in orderTagList" :key="index">{{ item }}</view>
				</view>
				<view style="height: 140rpx"></view>
			</view>
		</view>
		<cover-view class="bot-button-box u-p-t-7 u-p-r-10 u-p-b-7 u-flex u-row-between" v-if="!payMask && !showModalInput && !showModal && !showSelSheet">
			<cover-view class="subtotal" style="font-size: 48rpx; flex: 1">
				<cover-view class="u-line-1">￥{{ orderPara.actualPayment }}</cover-view>
			</cover-view>
			<cover-view class="button u-font-18 u-text-center" @tap="gotoPay">去支付</cover-view>
		</cover-view>
		<!-- 弹框输入框 -->
		<u-modal
			v-model="showModalInput"
			:show-title="false"
			:async-close="asyncClose"
			@confirm="confirm"
			:confirm-style="confirmStyle"
			:show-cancel-button="true"
		>
			<view class="title u-text-center u-p-t-22 u-p-b-22">{{ placeholderText }}</view>
			<view class="slot-content">
				<u-input
					ref="uInput"
					:maxlength="intMaxLength"
					:border="true"
					placeholder-style="color:#D5D5D5; font-size: 32rpx;"
					type="number"
					:placeholder="`请输入${placeholderText}`"
				></u-input>
			</view>
		</u-modal>
		<!-- 超出配送范围 -->
		<u-modal v-model="showModal" :show-title="false" confirm-text="我知道了" :confirm-style="confirmStyle" :async-close="asyncClose" @confirm="confirm">
			<view class="title u-text-center u-p-t-22 u-p-b-22">超出配送范围</view>
			<view class="slot-content">
				<text class="u-text-center u-font-14" style="color: #666666; font-weight: 400">该商家与您距离过远，您可以重新选择商家或更换地址再下单</text>
			</view>
		</u-modal>
		<!-- 取餐时间 -->
		<u-popup v-model="showSelSheet" mode="bottom" :mask-close-able="false">
			<view class="header">
				<view class="close" @tap="closePop()">
					<u-icon name="close" color="#333333" size="36"></u-icon>
				</view>
				<text>选择时间</text>
			</view>
			<view class="select-time">
				<view>
					<scroll-view :scroll-y="true" style="height: 100%">
						<u-cell-group :border="false">
							<u-cell-item
								v-for="(item, index) in dateList"
								:key="index"
								:title="item.day"
								:border-top="false"
								:border-bottom="false"
								:arrow="false"
								:index="index"
								:bg-color="index == selectTimeInx ? '#ffffff' : '#F9FAFB'"
								@click="changeDay"
							>
							</u-cell-item>
						</u-cell-group>
					</scroll-view>
				</view>
				<view>
					<scroll-view :scroll-y="true" style="height: 100%">
						<u-cell-group>
							<u-cell-item v-for="(item, index) in timeList" :key="index" :title="item.time1" :arrow="false" :index="index" @click="changeTime">
							</u-cell-item>
						</u-cell-group>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { Decimal } from "decimal.js";
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
import { getObjType, formatTime } from "@/utils";
import { get } from "https";
export default {
	data() {
		return {
			share: 0, // 订单类别1 同享, 2不同享 , 0 都可以用
			sextype: 0, //性别
			tabtype: 1, //0堂食1外卖
			loadOnce: 1,
			chosenTime: 0, //预下单选择时间index
			intMaxLength: 3, //输入框长度
			selectTimeInx: 0, //预下单选择日期index
			discountedPrice: 0, //优惠金额
			firstOrderDiscounts: 0, //首单立减
			dateList: [], //预下单日期列表
			timeList: [], //预下单时间列表
			orderTagList: [],
			sex: {
				0: "先生",
				1: "女士",
			},
			orderPara: {
				addressId: null,
				actualPayment: 0, //实际支付金额
				deliveryNo: "", //配送ID(外卖订单必传)
				expectTime: "", //外卖传预计送达时间 / 到店自取和堂食传取餐时间
				location: "", //经纬度
				orderSource: 0, //订单来源,0:微信,1:支付宝,2:商家
				orderType: 1, //订单类型,0:外卖,1:堂食,2:到店自取
				packageFee: 0, //餐盒费
				person: 1, //就餐人数
				productAmount: 0, //商品订单金额
				recipientAddress: "", //收货地址
				recipientName: "", //收货人名字
				recipientPhone: "", //收货人手机号
				redPacketIds: [], //红包Id
				redPackageFee: [0, 0], //红包金额(平台,商家)
				reduceFee: 0, //优惠总金额(红包+优惠满减)
				remark: "", //备注
				reservedPhone: "", //预留手机号
				realityShippingFee: 0, //打折前配送费
				shippingFee: 0, //配送费
				shopId: 0, //店铺Id
				shopName: "", //店铺名称
				shoppingCartReqs: [], //购物车信息
				stallName: "", //档口名称
				statusName: "", //订单状态名称
				storeId: 0, //门店Id
				storeName: "", //门店名称
				takeMealTime: "", //
			},
			currentShop: {},
			confirmStyle: {
				//输入模态框确认按钮的颜色
				color: "#CEAE73",
			},
			getTime: "现在取餐",
			redPcount: null, //平台券的数量
			deliverTime: "尽快送达", //预下单选择时间/配送时间
			chosenDate: "", //预下单选择日期
			usedAmount: null, //订单价格
			mcRedPcount: null, //商家券的数量
			placeholderText: "", //输入模态框站位提示
			payMask: false, //支付防抖
			showModal: false, //超出配送范围模态框的显示隐藏控制
			ifHaveAddr: false, //默认收货地址
			showSelSheet: false, //堂食取餐时间选择器的显示隐藏控制
			showModalInput: false, //输入模态框的显示隐藏控制
		};
	},
	computed: {
		SEX() {
			return this.sex[this.sextype];
		},
		REDP() {
			let dis = this.redPcount;
			if (getObjType(this.redPcount) === "number") {
				return `${dis}张可用`;
			} else if (getObjType(this.redPcount) === "null") {
				return "暂无优惠劵";
			}
		},
		MCREDP() {
			let dis = this.mcRedPcount;
			if (getObjType(this.mcRedPcount) === "number") {
				return `${dis}张可用`;
			} else if (getObjType(this.mcRedPcount) === "null") {
				return "暂无优惠劵";
			}
		},
		mealTime() {
			return this.orderPara.takeMealTime.substr(11, 5);
		},
	},
	onLoad(query) {
		let thisPages = getCurrentPages();
		let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
		this.currentShop = thisPrevPage.$vm.currentShop;
		//type:0堂食,1外卖,2堂食外卖
		this.tabtype = this.currentShop.type == 0 ? 1 : this.currentShop.type == 1 ? 0 : thisPrevPage.$vm.shoppingMode;
		this.share = thisPrevPage.$vm.cartData.share; // 1 同享, 2不同享 , 0 都可以用
		this.firstOrderDiscounts = thisPrevPage.$vm.cartData?.firstOrderDiscounts ?? 0; //首单立减
		this.orderPara = { ...this.orderPara, ...thisPrevPage.$vm.orderPara };
		if (thisPrevPage.$vm?.tableId) this.orderPara.tableId = thisPrevPage.$vm?.tableId;
	},
	onShow() {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		this.payMask = false;
		uni.hideNavigationBarLoading();
		this.getRemarkLabel();
		this.init();
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		async init() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.changeTab(this.tabtype);
			let amount = new Decimal(this.orderPara?.productAmount ?? 0);
			let countPra = {
				isExpire: 1, //是否过期,0:是,1:否
				isUsed: 0, //是否使用,0:待使用,1:已使用
				isTake: 0, //是否领取,0:是,1:否
				saleType: this.tabtype ? 0 : 1, //0:堂食券,1:外卖券
				userId: getApp().globalData.UserInfo.userId,
				source: 1, //0平台1商家
				usedAmount: amount > 0 ? amount * 1 : 0,
				isShare: 0, //是否同享,传0:是,不传:不同享或都可以
				shopId: this.orderPara?.shopId,
				storeId: this.orderPara?.storeId,
			};
			if (this.share !== 1) {
				//不同享或通用
				delete countPra.isShare;
			}
			let parameter = {
				isExpire: 1, //是否过期,0:是,1:否
				isUsed: 0, //是否使用,0:待使用,1:已使用
				isTake: 0, //是否领取,0:是,1:否
				saleType: this.tabtype ? 0 : 1, //0:堂食券,1:外卖券
				userId: getApp().globalData.UserInfo.userId,
				usedAmount: amount * 1,
				isShare: 0, //是否同享,传0:是,不传:不同享或都可以
				shopId: this.orderPara?.shopId,
				storeId: this.orderPara?.storeId,
			};
			if (this.share !== 1) {
				//不同享或通用
				delete parameter.isShare;
			}
			let proList = [
				store.dispatch("GetRedPCount", countPra), //商家券数量
				store.dispatch("GetRedPCount_01", { ...countPra, source: 0 }), //平台券数量
				store.dispatch("GetSelectedRedPacket", parameter), //默认红包
			];
			let thenFuc = res => {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				let resArr = res.map(a => a.data);
				this.mcRedPcount = resArr[0].COUNT ?? 0;
				this.redPcount = resArr[1].COUNT ?? 0;
				if (this.loadOnce) {
					if (resArr[2]?.length) {
						resArr[2].sort((a, b) => {
							return a.source - b.source;
						});
					}
					this.orderPara.redPacketIds = [];
					this.orderPara.redPackageFee = [0, 0];
					if (resArr[2]?.length == 1) {
						this.orderPara.redPacketIds = resArr[2].map(it => it.recordId);
						this.orderPara.redPackageFee[resArr[2][0]?.source == 0 ? 0 : 1] = resArr[2][0]?.amount;
					} else if (resArr[2]?.length > 1) {
						this.orderPara.redPacketIds = resArr[2].map(it => it.recordId);
						this.orderPara.redPackageFee = resArr[2].map(it => it.amount);
					}
					if (this.orderPara.orderType == 0 && !this.orderPara.recipientAddress) {
						this.getDefaultAddr(this.orderPara.shopId);
					} else {
						this.countCost();
					}
					if (this.currentShop.isOpen == 0) {
						this.getMealTime();
					} else {
						this.orderPara.takeMealTime = formatTime(new Date(new Date().getTime() + this.currentShop.expectedTime * 60 * 1000));
						this.loadOnce = 0;
					}
					return;
				} else {
					this.getNowTime(this.orderPara);
				}
				if (this.orderPara.orderType == 0 && !this.orderPara.recipientAddress) {
					this.getDefaultAddr(this.orderPara.shopId);
				} else {
					this.countCost();
				}
			};
			PromiseAll(proList, thenFuc);
		},
		//去支付
		async gotoPay() {
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.payMask = Boolean(this.orderPara.actualPayment);
			let params = Object.assign({}, this.orderPara);
			this.getNowTime(params);
			params.takeMealTime = params.expectTime.substr(11, 5);
			params.redPackageFee = params.redPackageFee.reduce((accumulator, currentValue) => accumulator + currentValue);
			params.redPacketIds = params.redPacketIds.filter(n => n);
			// uni.hideLoading();
			// uni.hideNavigationBarLoading();
			// this.payMask = false;
			// return;
			let successFuc = res => {
				const payType = this.orderPara.actualPayment == 0 ? 4 : 3;
				uni.redirectTo({
					url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${res.data}&payType=${payType}&pdType=0`,
				});
			};
			let elseFuc = () => {
				this.payMask = false;
				uni.hideNavigationBarLoading();
			};
			AjaxApi("SaveOrder", params, successFuc, elseFuc);
		},
		async changeDay(inx, load = false) {
			this.selectTimeInx = inx;
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let res = await store.dispatch("SelectMealTime", {
				shopId: this.orderPara.shopId,
				date: this.dateList[inx].date,
				dayNum: this.dateList[inx].dayNum,
				type: this.orderPara.orderType == 0 ? 1 : 0,
			});
			if ((res?.code ?? 1) !== 0) {
				uni.hideLoading();
				uni.showToast({
					title: res?.msg ?? "网络错误请重试",
					icon: "none",
					mask: true,
					duration: 2000,
				});
				return;
			}
			uni.hideLoading();
			this.timeList = res.data;
			if (this.loadOnce) {
				this.orderPara.expectTime = this.timeList[0].time3;
				if (this.orderPara.orderType * 1 !== 0) {
					//堂食
					if (this.timeList[0].time1 == "现在取餐") {
						this.orderPara.takeMealTime = formatTime(new Date(new Date().getTime() + this.currentShop.expectedTime * 60 * 1000));
					} else {
						this.orderPara.takeMealTime = this.timeList[0].time1;
					}
				} else {
					this.deliverTime = this.timeList[0].time1;
				}
				this.chosenDate = this.dateList[0].day;
				this.loadOnce = 0;
			} else {
				this.showSelSheet = true;
			}
		},
		async getMealTime() {
			//堂食、到店自取时间事件
			if (this.currentShop.isOpen != 0) return;
			uni.showLoading({
				title: "加载中",
			});
			let res = await store.dispatch("SelectMealDate", {
				shopId: this.orderPara.shopId,
				type: this.orderPara.orderType == 0 ? 1 : 0,
			});
			if ((res?.code ?? 1) !== 0) {
				uni.hideLoading();
				uni.showToast({
					title: res?.msg ?? "网络错误请重试",
					icon: "none",
					mask: true,
					duration: 2000,
				});
				return;
			}
			this.dateList = res.data;
			this.changeDay(0);
			this.selectTimeInx = 0;
		},
		async getDefaultAddr(shopId) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let params = {
				price: this.orderPara?.productAmount * 1 ?? 0,
				shopId: shopId,
			};
			let res = await store.dispatch("DefaultAddr", params);
			if (getObjType(res.data) == "null") {
				this.showModal = false; //配送范围
				this.ifHaveAddr = false; //默认地址为空
			} else if (getObjType(res.data) == "object") {
				res.data.exceedCapacity ? (this.showModal = true) : false;
				this.ifHaveAddr = true; //默认地址
				this.sextype = res.data.sex;
				let obj = {
					addressId: res.data.id,
					realityShippingFee: res.data.realityShippingFee,
					shippingFee: res.data.shippingFee,
					deliveryNo: res.data.deliveryNo,
					location: res.data.location,
					recipientAddress: res.data.address,
					recipientName: res.data.relationPerson,
					recipientPhone: res.data.phone,
					expectTime: res.data.expectTime,
				};
				this.orderPara = {
					...this.orderPara,
					...obj,
				};
				// this.deliverTime = this.orderPara.expectTime;
			}
			this.countCost();
		},
		confirm() {
			//输入手机号、输入就餐人数确认
			if (this.placeholderText == "就餐人数") {
				this.orderPara.person = this.$refs.uInput.defaultValue;
				return;
			}
			if (this.placeholderText == "预留手机号") {
				this.orderPara.reservedPhone = this.$refs.uInput.defaultValue;
			}
		},
		closePop() {
			this.loadOnce = true;
			this.getMealTime();
			this.showSelSheet = false;
		},
		getText(val) {
			if (!this.orderPara.remark) {
				this.orderPara.remark = val;
			} else {
				this.orderPara.remark = this.orderPara.remark.concat("，", val);
			}
		},
		getValue(e) {
			this.orderPara.remark = e.detail.value;
		},
		countCost() {
			if (this.tabtype) {
				this.orderPara.shippingFee = 0;
			}
			// 订单总价格 = (总折扣金额  - 红包总金额 - 优惠金额) > 0 ? 总折扣金额  - 红包总金额 - 优惠金额) + (运费) : (运费)
			let order = this.orderPara ?? {};
			let total = new Decimal(order?.productAmount ?? 0)
				.add(new Decimal(order.orderType == 2 ? order?.packageFee ?? 0 : 0))
				.sub(
					new Decimal(
						order?.redPackageFee.reduce((acc, cur) => {
							return new Decimal(acc).add(new Decimal(cur));
						}) ?? 0
					)
				)
				.sub(new Decimal(order?.reduceFee ?? 0))
				.sub(new Decimal(this.firstOrderDiscounts));
			this.orderPara.actualPayment = Math.sign(total) == -1 ? order?.shippingFee ?? 0 : total.add(new Decimal(order?.shippingFee));
			this.discountedPrice = new Decimal(order?.reduceFee * 1 ?? 0)
				.add(
					new Decimal(
						order?.redPackageFee.reduce((acc, cur) => {
							return new Decimal(acc).add(new Decimal(cur));
						}) ?? 0
					)
				)
				.add(new Decimal(this.firstOrderDiscounts));
			uni.hideLoading();
		},
		changeTab(e) {
			//tab切换
			// if (!e) {
			// 	this.orderPara.shippingFee = 0;
			// 	this.orderPara.deliveryNo = "";
			// 	this.orderPara.takeMealTime = "";
			// }
			this.tabtype = e;
		},
		changeTime(inx) {
			this.chosenTime = inx;
			console.log("changeTime -> inx", inx);
			this.orderPara.expectTime = this.timeList[inx].time3;
			this.orderPara.takeMealTime = this.timeList[inx].time1;
			if (this.orderPara.orderType !== 0) {
				//堂食
				this.orderPara.expectTime =
					this.timeList[inx].time1 == "现在取餐"
						? formatTime(new Date(new Date().getTime() + this.currentShop.expectedTime * 60 * 1000))
						: this.timeList[inx].time3;
				this.orderPara.takeMealTime = this.orderPara.expectTime;
			} else {
				this.deliverTime = this.timeList[inx].time1;
			}
			this.chosenDate = this.dateList[this.selectTimeInx].day;
			this.showSelSheet = false;
		},
		radioChange(e) {
			this.orderPara.person = 1;
			this.orderPara.orderType = e.detail.value;
			this.countCost();
		},
		chooseInput(val) {
			this.showModalInput = true;
			if (val == "person") {
				this.placeholderText = "就餐人数";
				this.$refs.uInput.defaultValue = this.orderPara.person;
				this.intMaxLength = 2;
				return;
			}
			if (val == "phone") {
				this.placeholderText = "预留手机号";
				this.$refs.uInput.defaultValue = this.orderPara.reservedPhone;
				this.intMaxLength = 11;
			}
		},
		addAddress() {
			uni.navigateTo({
				url: `/pagesB/addAddress/addAddress`,
			});
		},
		chooseCoupon(val) {
			let globalDataOrd = this.orderPara;
			let SOUCE = 0;
			if (val == 0) {
				//平台
				// if (this.redPcount == 0) return;
			} else {
				//商家
				// if (this.mcRedPcount == 0) return;
				SOUCE = 1;
			}
			uni.showLoading({
				title: "载入中",
				mask: true,
			});
			let amount = new Decimal(globalDataOrd.productAmount);
			uni.navigateTo({
				url: `/pagesB/chooseCoupon/chooseCoupon?source=${SOUCE}&usedAmount=${amount}`,
			});
		},
		jumpAddressList() {
			//选择收货地址
			uni.navigateTo({
				url: `/pagesB/addressList/addressList`,
			});
		},
		jumpOrderNotes() {
			//订单备注
			uni.navigateTo({
				url: `/pagesB/orderNotes/orderNotes?remark=${this.orderPara.remark}`,
			});
		},
		getNowTime(params) {
			switch (params.orderType) {
				//订单类型,0:外卖,1:堂食,2:到店自取
				case 0: //外卖
					if (Boolean((this.timeList[0]?.time1 ?? "尽快送达") == "尽快送达" && !this.chosenTime) || this.currentShop.isOpen !== 0) {
						params.expectTime = formatTime(new Date());
					}
					break;
				default:
					//堂食到店
					let currentTime = formatTime(new Date(new Date().getTime() + this.currentShop.expectedTime * 60 * 1000));
					if (
						this.currentShop.isOpen !== 0 ||
						Boolean(this.currentShop.isOpen == 0 && this.chosenTime == 0 && this.timeList[0].time1 == "现在取餐")
					) {
						//非预下单 堂食到店
						//或预下单实时单 堂食到店
						params.expectTime = currentTime;
						params.takeMealTime = params.expectTime;
					}
					break;
			}
		},
		getRemarkLabel() {
			let params = {};
			let successFuc = res => {
				if (res.code == 0) {
					this.orderTagList = res.data;
				}
			};
			AjaxApi("GetRemarkLabel", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
/deep/radio {
  .wx-radio-input.wx-radio-input-checked {
    &::before {
      color: #ffffff;
    }
  }
}
.container {
	position: relative;
	.top {
		height: 228rpx;
		background: #fe6b00;
		opacity: 1;
		.btn-g {
			padding-top: 20rpx;
			padding-left: 20rpx;
			font-size: 28rpx;
			color: #ffffff;
			text {
				display: inline-block;
				width: 214rpx;
				line-height: 56rpx;
				text-align: center;
				border: 2rpx solid #ffffff;
			}
			.btn-alive {
				background: #ffffff;
				color: #fe6b00;
			}
			.btn-alive1 {
				background: #fe6b00;
				color: #ffffff;
			}
		}
	}
	.bot {
		margin-bottom: 120rpx;
		position: relative;
		.info-box {
			position: absolute;
			top: -200rpx;
			padding: 0rpx 20rpx;
			width: 100%;
			.user-info {
				width: 100%;
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				opacity: 1;
				border-radius: 8rpx;
				padding: 22rpx 40rpx 0rpx 40rpx;
				box-sizing: border-box;
				margin-bottom: 28rpx;
				.address-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.address {
						width: 480rpx;
						font-size: 32rpx;
						font-weight: bold;
						line-height: 44rpx;
						color: #333333;
					}
					.address-icon {
						color: #666666;
						text-align: center;
						font-size: 20rpx;
						img {
							width: 32rpx;
							height: 38rpx;
						}
					}
				}
				.box-group {
					width: 100%;
					line-height: 120rpx;
					margin-bottom: 25rpx;
					radio-group {
						box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
						padding: 40rpx 0;
						display: flex;
						border-radius: 8rpx;
						label {
							&:first-child {
								border-right: 2rpx solid #e2e2e2;
							}
							image {
								width: 72rpx;
								height: 130rpx;
							}
							height: 200rpx;
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}
					}
				}
				.box-type {
					width: 100%;
					height: 120rpx;
					line-height: 120rpx;
					border-bottom: 2rpx solid rgba(221, 221, 221, 1);
					padding: 18rpx 0rpx 16rpx 0rpx;
					radio-group {
						display: flex;
						label {
							&:first-child {
								border-right: 2rpx solid #e2e2e2;
							}
							image {
								width: 80rpx;
								height: 80rpx;
							}
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}
					}
					.left {
						width: 50%;
						height: 100%;
					}
					.right {
						width: 50%;
						height: 100%;
					}
					.text {
						height: 34rpx;
						font-size: 24rpx;
						font-weight: bold;
						line-height: 34rpx;
						color: #333333;
					}
					.time {
						display: flex;
						justify-content: flex-start;
						height: 40rpx;
						font-size: 28rx;
						font-weight: bold;
						line-height: 40rpx;
						color: #fe6b00;
					}
					.icon {
						height: 40rpx;
						font-weight: normal;
						display: flex;
						justify-content: center;
						align-items: flex-start;
					}
					text {
						font-size: 16rpx;
						color: #d5d5d5;
						margin-left: 14rpx;
					}
				}
				.user-num {
					font-size: 28rpx;
					font-weight: bold;
					line-height: 40rpx;
					color: #333333;
					padding-top: 30rpx;
					padding-bottom: 30rpx;
					display: flex;
					justify-content: space-between;
					.num-left {
						height: 40rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: #333333;
					}
					.num-right {
						display: flex;
						justify-content: flex-end;
						height: 40rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						color: rgba(0, 0, 0, 1);
						opacity: 1;
						.icon {
							font-size: 24rpx;
							margin-left: 28rpx;
							color: #d5d5d5;
							font-weight: normal;
						}
					}
				}
				.have-address {
					.address-box1 {
						border-bottom: 2rpx solid rgba(221, 221, 221, 1);
						padding-bottom: 24rpx;
					}
					.address-info {
						color: #333333;
						margin-bottom: 4rpx;
						font-weight: bold;
						font-size: 36rpx;
					}
					.delivery-time {
						padding: 40rpx 0;
					}
					.delivery-title {
						font-weight: bold;
					}
					.time {
						color: #fe6b00;
						font-weight: bold;
					}
					.icon {
						color: #d5d5d5;
					}
				}
				.no-address {
					height: 240rpx;
					padding: 75rpx 0;
					.add-icon {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						border: 2rpx solid #666666;
					}
					.add-address {
						font-size: 24rpx;
						font-weight: 400;
						line-height: 30rpx;
						color: rgba(102, 102, 102, 1);
						opacity: 1;
					}
				}
			}

			.goods-info {
				width: 100%;
				padding: 0rpx 40rpx;
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				border-radius: 8rpx;
				margin-bottom: 20rpx;
				.shop-name {
					padding: 18rpx 0rpx 24rpx;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 44rpx;
					color: #333333;
					opacity: 1;
					display: flex;
					justify-content: flex-start;
					.icon-arrow-right {
						color: #d5d5d5;
						font-size: 16rpx;
						margin-left: 14rpx;
						font-weight: normal;
					}
				}
				.goods-list-box {
					.stall-name {
						padding: 16rpx 0rpx 24rpx 0rpx;
						font-size: 24rpx;
						font-weight: 400;
						line-height: 28rpx;
						color: #333333;
					}
					.goods-box {
						display: flex;
						justify-content: flex-start;
						padding-bottom: 24rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #333333;
						image {
							width: 84rpx;
							height: 84rpx;
							margin-right: 20rpx;
						}
						.goods-right {
							flex: 1;
						}
						.goods-top {
							height: 40rpx;
							line-height: 40rpx;
							opacity: 1;
							display: flex;
							justify-content: space-between;
							margin-bottom: 6rpx;
						}
						.goods-bot {
							height: 28rpx;
							font-size: 24rpx;
							color: rgba(153, 153, 153, 1);
							opacity: 1;
						}
						.top-left {
							flex: 1;
							height: 40rpx;
							line-height: 40rpx;
							opacity: 1;
							font-size: 28rpx;
							position: relative;
							.text1 {
								margin-right: 10rpx;
							}
							.text2 {
								margin-left: 10rpx;
							}
						}
						.dotted {
							&:after {
								content: ".";
								position: absolute;
								top: -14rpx;
								left: 89rpx;
								font-size: 50rpx;
							}
						}
						.top-right {
							min-width: 200rpx;
							display: flex;
							justify-content: flex-end;
						}
						.goods-num {
							height: 40rpx;
							font-size: 20rpx;
							line-height: 40rpx;
						}
						.goods-price {
							margin-left: 48rpx;
							height: 40rpx;
							line-height: 40rpx;
						}
					}
					.delivery-box {
						height: 80rpx;
						font-size: 28rpx;
					}
				}
				.coupon {
					height: 80rpx;
					font-size: 28rpx;
					.coupon-title {
						height: 40rpx;
						line-height: 40rpx;
						font-weight: bold;
						color: #333333;
					}
					.coupon-right {
						height: 40rpx;
						line-height: 40rpx;
						color: rgba(153, 153, 153, 1);
					}
					.info-1 {
						height: 40rpx;
						font-size: 28rpx;
						font-weight: bold;
						line-height: 20px;
						color: #333333;
					}
					.info-2 {
						height: 40rpx;
						font-size: 28rpx;
						font-weight: bold;
						line-height: 20px;
						color: #333333;
						position: relative;
						&.u-font-24 {
							&::before {
								border-bottom: 2rpx solid #999999;
								position: absolute;
								content: "";
								width: 110%;
								height: 50%;
							}
						}
					}
					.info {
						font-weight: 400;
						display: flex;
						align-items: center;
					}
					.icon-right {
						font-size: 24rpx;
						margin-top: 4rpx;
					}
				}
				.subtotal {
					height: 80rpx;
				}
				.subtotal-right {
					height: 50rpx;
					font-weight: bold;
				}
			}
			.remarks-wrap {
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				border-radius: 8rpx;
			}
			.remarks-box {
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				border-radius: 8rpx;
				padding: 40rpx;
				margin-bottom: 20rpx;
				box-sizing: border-box;
				.textarea-box {
					border-radius: 8rpx;
					background: #fff;
					height: 240rpx;
				}
				textarea {
					width: 100%;
					height: 240rpx;
				}
			}
			.notes-box {
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				margin-left: 40rpx;
				margin-bottom: 152rpx;
				.notes-item {
					margin-bottom: 20rpx;
					margin-right: 20rpx;
					line-height: 48rpx;
					background: rgba(255, 255, 255, 1);
					border: 2rpx solid rgba(213, 213, 213, 1);
					border-radius: 4rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					padding: 0rpx 20rpx;
				}
			}
		}
	}
	.bot-button-box {
		width: 100%;
		padding: 16rpx 0;
		background: rgba(255, 255, 255, 1);
		font-weight: 400;
		position: fixed;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom, 0);
		padding-bottom: env(safe-area-inset-bottom, 0);
		.subtotal {
			margin-left: 62rpx;
		}
		.button {
			width: 248rpx;
			height: 92rpx;
			line-height: 92rpx;
			color: #ffffff;
			background: #fe6b00;
			font-weight: bold;
			border-radius: 8rpx;
			margin-right: 20rpx;
		}
	}
	.slot-content {
		padding: 20rpx 44rpx 44rpx;
	}
	.header {
		height: 120rpx;
		background: #f9fafb;
		border-radius: 8rpx 8rpx 0px 0px;
		font-size: 40rpx;
		font-weight: 400;
		line-height: 120rpx;
		color: #333333;
		text-align: center;
		padding: 0 32rpx;
		.close {
			float: left;
			width: 50rpx;
			height: 100%;
		}
	}
	.select-time {
		display: flex;
		> view {
			&:first-child {
				width: 220rpx;
				height: 600rpx;
				background: #f9fafb;
			}
			&:last-child {
				height: 600rpx;
				flex: 1;
			}
		}
	}
}
</style>
