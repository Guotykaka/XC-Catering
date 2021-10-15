<template>
	<view class="wrapper">
		<u-navbar :back-icon-color="backColor" :is-back="true" :title="navbarTit" :background="backgroundImg" :border-bottom="false"></u-navbar>
		<PopUp :popMask="popMask" :popType="popType" :list="platCouponList" @inVite="hidePop" :card="cardDetail"></PopUp>
		<u-mask :show="cancelMask">
			<view class="mask-slot">
				<view>
					<img src="https://oss.dianddian.cn/v2/cancle_order.png" alt="" />
					<view>您确定要取消订单吗？</view>
				</view>
				<view>
					<view @tap.stop="cancelMask = false">取消</view>
					<view @tap.stop="turnToCancel" style="color: #ceae73">确定</view>
				</view>
			</view>
		</u-mask>
		<view class="head-box"></view>
		<!-- 类型(1,超时,0未超时) -->
		<view v-if="ifOrderRiderDetailDto && orderDetail.pid == 0 && completedTime" :class="[{ hourglassview: !RiderOrders }]">
			<view :class="[{ hasmap: RiderOrders }, 'hourglass']" v-if="orderRiderDetailDto.expectTime && !orderRiderDetailDto.type && !orderDetail.completedTime">
				<image class="u-m-r-20" src="https://oss.dianddian.cn/v2/428/hourglass.png"></image>
				送达倒计时
				<u-count-down :timestamp="timeStamp" class="u-m-l-10 u-m-r-10" font-size="28" bg-color="#FFF3C800" separator-color="#FE6B00" color="#FE6B00" @end="canEnd" :show-hours="false"></u-count-down>
				（活动期间，超时免单）
			</view>
			<view :class="[{ hasmap: RiderOrders }, 'hourglass']" v-else-if="!orderRiderDetailDto.type">
				<image class="u-m-r-20" src="https://oss.dianddian.cn/v2/428/hourglass.png"></image>
				恭喜本单已按时送达（活动期间，超时免单）
			</view>
			<view :class="[{ hasmap: RiderOrders }, 'hourglass']" v-else-if="orderRiderDetailDto.type">
				<image class="u-m-r-20" src="https://oss.dianddian.cn/v2/428/hourglass.png"></image>
				本单未按时送达，
				<button open-type="contact" class="connect" plain="true">联系客服</button>获取免赔。
			</view>
		</view>
		<view class="status-box" v-if="!RiderOrders">
			<view class="u-flex u-row-left u-col-center" style="line-height: 66rpx">
				<view class="status-text">
					<text v-if="orderDetail.status !== null">{{
						orderDetail.status == 0
							? "等待支付！"
							: orderDetail.status == 1
							? "订单取消！"
							: orderDetail.status == 3
							? "商家已接单！"
							: orderDetail.status == 4
							? "商家已备餐！"
							: orderDetail.status == 5
							? "订单配送！"
							: orderDetail.status == 7
							? "申请退款完成！"
							: orderDetail.status == 8 && orderDetail.orderType == 0
							? "订单已送达！"
							: orderDetail.status == 8 && orderDetail.orderType !== 0
							? "订单已完成！"
							: orderDetail.status == 6
							? "退款中！"
							: "申请退款中！"
					}}</text>
				</view>
				<!-- <u-icon name="arrow-right" color="#fff" size="28"></u-icon> -->
			</view>
		</view>
		<view class="container-box">
			<view
				class="map-box"
				v-if="mapCtx && RiderOrders"
				:style="{
					height: 1000 + 'rpx',
					position: mapHeight > 260 ? 'absolute' : 'fixed',
				}"
			>
				<map id="mapCtx2" :longitude="curLocation.longitude" :latitude="curLocation.latitude" scale="16" :markers="markers" :include-points="markers" bindmarkertap="markertap" :polyline="polyline" bindregionchange="regionchange" style="width: 100%; height: 100%">
					<!-- show-location -->
					<cover-view class="cover-view-now" @tap="fixedPosition()" v-if="mapHeight < 260">
						<cover-image src="../../static/img/focu.png"></cover-image>
					</cover-view>
				</map>
			</view>
			<view :class="[{ hasmap: RiderOrders }, 'container']" :style="{ top: (RiderOrders ? 800 : -118) + 'rpx' }">
				<view class="operate-box">
					<view class="operate">
						<view class="time-box" v-if="orderDetail.status == 0">
							<text class="iconfont iconshijian"></text>
							<u-count-down class="count-down-demo" :timestamp="time" font-size="40" color="rgba(0,0,0,1)" :showDays="false" :show-hours="false" @end="end" ref="uCountDown" bg-color="rgb(251, 251, 251)"></u-count-down>
						</view>
						<view class="time-info" v-if="orderDetail.status == 0">15分钟内未支付，订单将自动取消，请尽快支付！</view>
						<view class="operate-top" v-if="orderDetail.status !== 0 && orderDetail.status !== null">
							<view>{{
								orderDetail.status == 1
									? "您取消了订单！"
									: orderDetail.status == 3
									? "商家已接单，正在紧张制作中，请稍等！"
									: orderDetail.status == 8
									? "感谢您的信任，期待您的再次光临！"
									: orderDetail.status == 5
									? "骑手正在给您送餐，请稍等！"
									: orderDetail.status == 7
									? "申请退款已完成！"
									: orderDetail.status == 4 && orderDetail.orderType == 0
									? "商家已备好餐，待配送！"
									: "商家已备好餐，请及时到店用餐！"
							}}</view>
						</view>
						<view class="operate-btn-box">
							<view class="operate-btn-item" @tap="contactMerchant">
								<u-icon name="phone" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">联系商家</view>
							</view>
							<view class="operate-btn-item" v-if="Boolean(orderDetail.status == 0) && Boolean(orderDetail.pid == 0)" @tap="cancelOrder">
								<u-icon name="close-circle" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">取消订单</view>
							</view>
							<button open-type="contact" class="operate-btn-item" plain="true" v-if="Boolean(orderDetail.status == 3)">
								<u-icon name="close-circle" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">取消订单</view>
							</button>
							<view class="operate-btn-item" v-if="Boolean(orderDetail.pid == 0 && orderDetail.status == 8 && orderDetail.users.length > 1)" @tap="jumpAAbill">
								<u-icon name="red-packet" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">AA账单</view>
							</view>
							<view class="operate-btn-item" v-if="orderDetail.status == 8 && orderDetail.isEvaluate == 0" @tap="jumpEvaluate">
								<u-icon name="photo" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">评价晒图</view>
							</view>
							<button open-type="share" class="operate-btn-item" plain="true" v-if="(orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5 || orderDetail.status == 8) && getTimeOut()">
								<u-icon name="red-packet" color="#000" size="36" class="u-m-b-10"></u-icon>
								<view class="btn-text">分享领红包</view>
							</button>
							<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
						</view>
					</view>
				</view>
				<view class="order-con">
					<view class="order-head">餐品详情</view>
					<view>
						<view class="user-goods-item">
							<view v-for="(it, i) in orderDetail.users" :key="i" class="item">
								<view class="user-info-box">
									<view class="user-image">
										<image :src="`${it.url || '../../static/img/deliveryPic.png'}`"></image>
									</view>
									<view class="user-name">{{ it.name }}</view>
								</view>
								<view>
									<view class="goods-item" v-for="(item, inx) in it.orderDetails" :key="inx">
										<view class="goods-img">
											<image :src="`${item.pic ? item.pic + '?x-oss-process=image/resize,w_700' : shopImg}`" mode="aspectFill"></image>
										</view>
										<view class="goods-con">
											<view class="goods-top">
												<view>{{ item.goodsName }}</view>
												<view>
													<text style="font-size: 20rpx">￥</text>
													<text>{{ item.discountPrice }}</text>
												</view>
											</view>
											<view class="goods-descript">
												<text>{{ item.specification }}</text>
												<view class="leval" v-if="item.wmCustomerGoodsAmount">{{ item.customerName + `价¥${item.wmCustomerGoodsAmount}` }}</view>
											</view>
											<view class="goods-descript" style="margin-bottom: 0">x {{ item.quantity }}</view>
										</view>
									</view>
								</view>
							</view>
							<view class="order-bot">
								<view class="instal-box">
									<view class="info-box">
										<view>餐盒费</view>
										<view class="price-right">
											<text>￥</text>
											<text>{{ orderDetail.packageFee }}</text>
										</view>
									</view>
									<view class="info-box">
										<view>包装费</view>
										<view class="price-right">
											<text>￥</text>
											<text>{{ orderDetail.pdPackageFee }}</text>
										</view>
									</view>
									<view class="info-box">
										<view>配送费</view>
										<view class="price-right">
											<text>￥</text>
											<text>{{ orderDetail.shippingFee || 0 }}</text>
										</view>
									</view>
									<view class="member u-flex" v-if="!orderDetail.shippingFeeRecordId && orderDetail.shippingFee" @tap="jumpMember">
										<view>购买尊享卡免配送></view>
										<view>¥6</view>
									</view>
									<view class="info-box">
										<view><view class="block-reduce">￥</view>红包</view>
										<view class="price-right">
											<text>￥</text>
											<text>{{ orderDetail.redPackageFee || 0 }}</text>
										</view>
									</view>
									<view class="info-box" v-if="orderDetail.reduceFee">
										<view><view class="block-reduce">减</view>商户满减</view>
										<view class="price-right" @tap="chooseGroupCoupon" style="color: #ff4d4f">
											-
											<text>￥</text>
											<text>{{ orderDetail.reduceFee }}</text>
										</view>
									</view>
								</view>
								<view class="order-price">
									<view>合计</view>
									<view>
										<text style="font-size: 24rpx">¥</text>
										<text>{{ orderDetail.actualPayment }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="address-box">
					<view>收货地址</view>
					<view>
						<view style="margin-bottom: 10rpx">{{ orderDetail.recipientAddress }}</view>
						<view>
							<text style="margin-right: 20rpx">{{ orderDetail.recipientName }}</text>
							<text>{{ orderDetail.recipientPhone }}</text>
						</view>
					</view>
				</view>
				<view class="order-info" v-if="orderDetail.ddDelivery.dmId">
					<view class="info-head"> 配送信息 </view>
					<view>
						<!-- <view class="info-item" v-if="orderDetail.status == 8">
							<view>送达时间</view>
							<view>{{ orderDetail.completedTime }}</view>
						</view> -->
						<view class="info-item">
							<view>配送方式</view>
							<view>{{ orderDetail.deliveryWay == 1 ? "自配送" : orderDetail.deliveryWay == 2 ? "达达配送" : orderDetail.deliveryWay == 3 ? "蜂鸟配送" : deliveryType == 4 ? "顺丰配送" : "不配送" }}</view>
						</view>
						<view class="info-item">
							<view>配送骑手</view>
							<view>{{ orderDetail.ddDelivery.dmName || "店家" }}</view>
						</view>
						<view class="info-item">
							<view class="btn-left" @tap="concatDeliver">
								<text class="iconfont icondianhua"></text>
								<text>联系骑手</text>
							</view>
						</view>
					</view>
				</view>
				<view class="order-info">
					<view class="info-head"> 订单信息 </view>
					<view>
						<view class="info-item">
							<view>订单编号</view>
							<view>{{ orderDetail.orderId }}</view>
						</view>
						<view class="info-item">
							<view>创建时间</view>
							<view>{{ orderDetail.createTime ? orderDetail.createTime : "-" }}</view>
						</view>
						<view class="info-item">
							<view>支付时间</view>
							<view>{{ orderDetail.payTime ? orderDetail.payTime : "-" }}</view>
						</view>
						<view class="info-item">
							<view>支付方式</view>
							<view>
								{{ orderDetail.payType == 1 ? "微信支付" : orderDetail.payType == 2 ? "支付宝支付" : orderDetail.payType == 3 ? "余额" : orderDetail.payType == 5 ? "充值免单" : orderDetail.status == 0 ? "-" : orderDetail.status == 1 ? "-" : "现金" }}
							</view>
						</view>
					</view>
				</view>
				<view class="remark-box" v-if="orderDetail.remark"> {{ orderDetail.remark || "" }} </view>
			</view>
		</view>
		<view class="bto-btn-box" v-if="Boolean(orderDetail.status == 0 && orderDetail.pid == 0)">
			<view class="btn1" @tap="jumpPay">立即支付</view>
		</view>
		<view class="bto-btn-box" v-else>
			<button open-type="share" class="btn2" plain="true" data-type="group" @tap="clickShare">
				<view>{{ orderPacket.msg }}</view>
			</button>
		</view>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	import { BASE64, getObjType, tencentRoute } from "@/utils";
	import store from "@/store";
	import { Decimal } from "decimal.js";
	import popUp from "../../components/popup/popup";
	export default {
		components: {
			popUp,
		},
		data() {
			return {
				rechargeUrl: "",
				mapHeight: 0,
				orderPacket: {},
				polyline: [
					{
						points: [],
						color: "#FE6B00",
						width: 4,
					},
				],
				orderRiderDetailDto: null,
				popMask: false, //领券弹窗
				popType: 0, //0:天天领红包
				popMask: false,
				platCouponList: [], //券列表
				cardDetail: {},
				checkCoupon: 0,
				shopImg: getApp().globalData.shopImg,
				orderDetail: {},
				cancelMask: false,
				luckNum: 0,
				shareId: 0,
				orderId: 0,
				time: 0,
				discountedPrice: 0,
				markers: [],
				curLocation: {},
				mapCtx: null,
				backgroundImg: {
					background: "#fffff00",
					opacity: 1,
				},
				backColor: "#1C1C1D",
				navbarTit: "",
			};
		},
		onShareAppMessage: function (res) {
			if (res.from === "button") {
				const shareId = this.shareId;
				const luckNum = this.luckNum;
				if (res?.target?.dataset?.type == "group") {
					const amoun1 = this.orderPacket.amount2;
					return {
						title: `跨店点餐，新人领${amoun1}元红包 ！`,
						imageUrl: "https://oss.dianddian.cn/v2/activity/newindex/invite_new_user1.jpg",
						path: `/pagesD/groupsCoupons/groupsCoupons?recommendId=${getApp().globalData.UserInfo.userId}`,
					};
				} else {
					return {
						title: `第${luckNum}个领取的红包最大！`,
						imageUrl: "https://oss.dianddian.cn/activity/order_share/share_random.jpg",
						path: `/pagesC/sharingOrder/sharingOrder?shareId=${shareId}`,
					};
				}
			} else {
				return {
					title: "进入餐典到了",
					imageUrl: SHARE_URL,
					path: `/pages/index/index`,
				};
			}
		},
		onPageScroll(e) {
			this.mapHeight = e.scrollTop;
			if (this.RiderOrders && e.scrollTop < 260) {
				this.backgroundImg = {
					background: "#fffff00",
					opacity: 1,
				};
				this.navbarTit = "";
			} else if (this.RiderOrders) {
				this.backgroundImg = {
					background: "#ffffff",
					opacity: 1,
				};
				this.navbarTit = "请客详情";
			}
		},
		onLoad(query) {
			this.orderId = query.orderId;
			this.checkCoupon = query?.checkCoupon ?? 0;
		},
		async onReady(e) {
			this.mapCtx = uni.createMapContext("mapCtx2");
			this.getOrderDetail(this.orderId);
			if (this.checkCoupon) this.orderActivity();
			let PACKET = await store.dispatch("GetOrdersRedPacket", {}); //分享好友下单红包价格
			this.orderPacket = PACKET.data ?? {};
		},
		onShow() {
			this.cancelMask = false;
		},
		methods: {
			canEnd() {
				this.getOrderDetail(this.orderId);
			},
			clickShare() {
				// 优惠券到账通知 2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU
				// 优惠券过期提醒 VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w
				// 卡券到账通知 e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4
				// 会员到期提醒 uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM
				uni.requestSubscribeMessage({
					tmplIds: ["2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU", "VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w"],
				});
			},
			orderActivity() {
				let successFuc = res => {
					this.popType = res.data.type;
					switch (res.data.type) {
						case 1:
						case 4:
							this.platCouponList = res.data.data;
							break;
						case 2:
						case 3:
							this.cardDetail = res.data.data;
							break;
						default:
							break;
					}
				};
				let params = {
					orderId: this.orderId,
				};
				let elseFuc = () => {};
				AjaxApi("SelectOrderActivity", params, successFuc, elseFuc);
			},
			hidePop() {
				this.popMask = false;
			},
			concatDeliver() {
				//联系骑手
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.ddDelivery.dmMobile, //仅为示例
				});
			},
			contactMerchant() {
				//联系商家
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.shopPhone, //仅为示例
				});
			},
			jumpPay() {
				let payType = this.orderDetail.actualPayment == 0 ? 4 : 3;
				uni.redirectTo({
					url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${this.orderDetail.orderId}&payType=${payType}&pdType=${this.orderDetail.pdType}`,
				});
			},
			async getOrderDetail(val) {
				uni.showLoading({
					title: "加载中",
				});
				const params = {
					orderId: val,
				};
				let setShareOrder = await store.dispatch("SetShareOrder", { orderId: val });
				this.luckNum = setShareOrder.data?.luckNum;
				this.shareId = setShareOrder.data?.id;
				let successFuc = async res => {
					this.orderDetail = res.data.orderInfo;
					this.orderRiderDetailDto = res.data.orderRiderDetailDto;
					this.orderDetail.ddDelivery = res.data.orderInfo.ddDelivery;
					this.orderDetail.details = res.data.orderInfo.details;
					this.orderDetail.users = res.data.users;
					let format = this.orderDetail.expireTime.replace(/-/g, "/");
					this.time = parseInt((new Date(format).getTime() - new Date().getTime()) / 1000);
					this.discountedPrice = new Decimal(this.orderDetail?.shopRedPackageFee ?? 0).add(new Decimal(this.orderDetail?.redPackageFee ?? 0)).add(new Decimal(this.orderDetail?.reduceFee ?? 0));
					let str = this.orderDetail.pic.replace("https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/", "").replace("https://oss.dianddian.cn/", "");
					let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,m_fill,h_67,w_74");
					// let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,P_80");
					let iconPath = `https://oss.dianddian.cn/v2/shop_bg.png?x-oss-process=image/watermark,image_${baseStr},g_south,y_17`;
					this.markers.push({
						// iconPath: "/static/img/marker.png",
						iconPath: iconPath,
						id: 1,
						latitude: (res.data.orderInfo.shopLocation ?? "").split(",")[1] * 1,
						longitude: (res.data.orderInfo.shopLocation ?? "").split(",")[0] * 1,
						width: 30,
						height: 40,
						title: res.data.orderInfo.storeName,
					});
					let url = await store.dispatch("RechargeUrl", {});
					this.rechargeUrl = url.data;
					let rider = await store.dispatch("GetLocation", { orderId: res.data.orderInfo.orderId || 0 });
					if (rider.data) {
						this.markers.push({
							iconPath: "/static/img/rider.png",
							id: 2,
							latitude: rider.data.split(",")[1] * 1,
							longitude: rider.data.split(",")[0] * 1,
							width: 40,
							height: 46,
							title: "",
						});
					}
					this.polyline[0].points = [];
					if (getObjType(this.orderRiderDetailDto) !== "null" && (this.orderDetail.status == 5 || this.orderDetail.status == 4)) {
						let from = {
							latitude: rider.data.split(",")[1] * 1,
							longitude: rider.data.split(",")[0] * 1,
						};
						let dest_shop = {
							latitude: (res.data.orderInfo.shopLocation ?? "").split(",")[1] * 1,
							longitude: (res.data.orderInfo.shopLocation ?? "").split(",")[0] * 1,
						};
						let dest_rider = {
							latitude: this.orderRiderDetailDto.customerLocation.split(",")[1] * 1,
							longitude: this.orderRiderDetailDto.customerLocation.split(",")[0] * 1,
						};
						let succFuc = points => {
							this.polyline[0].points = points;
						};
						tencentRoute(from, this.orderDetail.status == 4 ? dest_shop : dest_rider, succFuc);
						this.markers.push({
							iconPath: "/static/img/dest.png",
							id: 3,
							latitude: this.orderRiderDetailDto.customerLocation.split(",")[1] * 1,
							longitude: this.orderRiderDetailDto.customerLocation.split(",")[0] * 1,
							width: 42,
							height: 42,
							title: "",
						});
					}
					this.curLocation = {
						longitude: rider.data ? rider.data.split(",")[0] * 1 : (res.data.orderInfo.shopLocation ?? "").split(",")[0] * 1,
						latitude: rider.data ? rider.data.split(",")[1] * 1 : (res.data.orderInfo.shopLocation ?? "").split(",")[1] * 1,
					};
					this.mapCtx.moveToLocation(this.curLocation);
					if (!this.RiderOrders) {
						this.backgroundImg = {
							background: "#fe6b00",
							opacity: 1,
						};
						this.navbarTit = "";
						this.backColor = "#ffffff";
					} else {
						wx.setNavigationBarColor({
							frontColor: "#000000",
							backgroundColor: "#ffffff",
							animation: {
								duration: 400,
								timingFunc: "easeIn",
							},
						});
					}
				};
				AjaxApi("GroupOrderDetail", params, successFuc);
			},
			async fixedPosition() {
				let that = this;
				let rider = await store.dispatch("GetLocation", { orderId: this.orderId || 0 });
				if (rider.data) {
					this.markers.splice(1, 1, {
						iconPath: "/static/img/rider.png",
						id: 2,
						latitude: rider.data.split(",")[1] * 1,
						longitude: rider.data.split(",")[0] * 1,
						width: 40,
						height: 46,
						title: "",
					});
				}
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
			cancelOrder() {
				this.cancelMask = true;
			},
			jumpMember() {
				uni.navigateTo({
					url: "/pagesD/membershipCard/membershipCard",
				});
			},
			jumpAAbill() {
				uni.navigateTo({
					url: `/pagesPing/AAbill/AAbill?orderId=${this.orderDetail.orderId}`,
				});
			},
			jumpEvaluate() {
				uni.redirectTo({
					url: `/pagesA/evaluation/evaluation?orderId=${this.orderDetail.orderId}`,
				});
			},
			turnToCancel() {
				uni.redirectTo({
					url: `/pagesA/orderCancel/orderCancel?orderId=${this.orderDetail.orderId}&orderStatus=${this.orderDetail.status}&pdType=${this.orderDetail.pdType}`,
				});
			},
			getTimeOut() {
				if (!this.orderDetail.payTime || !this.shareId) {
					return false;
				}
				return this.now - new Date(this.orderDetail.payTime.replace(/-/g, "/")).getTime() < 6 * 24 * 60 * 60 * 1000;
			},
			end() {
				uni.switchTab({
					url: "/pages/order/order",
				});
			},
		},
		computed: {
			ifOrderRiderDetailDto() {
				if (getObjType(this.orderRiderDetailDto) == "null") return false;
				return this.orderRiderDetailDto.expectTime;
			},
			completedTime() {
				//24h
				if (!this.orderDetail.completedTime) return true;
				return 86400000 > Date.parse(new Date()) - Date.parse(new Date(this.orderDetail.completedTime.replace(/-/g, "/")));
			},
			timeStamp() {
				if (getObjType(this.orderRiderDetailDto) == "null") return 0;
				if (getObjType(this.orderRiderDetailDto.expectTime) == "null") return 0;
				return (Date.parse(new Date(this.orderRiderDetailDto.expectTime.replace(/-/g, "/"))) - Date.parse(new Date())) / 1000;
			},
			orderPackageFee() {
				let val = new Decimal(this.orderDetail.pdPackageFee ?? 0).add(new Decimal(this.orderDetail.packageFee ?? 0));
				return val > 0 ? val : 0;
			},
			RiderOrders: function () {
				return Boolean(this.orderDetail.status == 3 || this.orderDetail.status == 4 || this.orderDetail.status == 5) && Boolean(this.orderDetail.orderType == 0) && Boolean(this.orderDetail.refundStatus !== 3);
			},
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.groupCell--arrow {
		display: none !important;
	}
	/deep/.groupCell--group_chat_icon {
		width: 36rpx;
		height: 30rpx;
		margin-top: 16rpx;
		margin-bottom: 4rpx;
	}
	/deep/.groupCell--row {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 0;
		padding: 0;
		margin: 0;
		margin-top: 10rpx;
	}
	/deep/.groupCell--nickname {
		font-size: 24rpx;
		font-weight: 400 !important;
		color: #1c1c1d;
		line-height: 34rpx;
		margin-left: 0;
		color: #fe6b00;
	}
	page {
		background: #f6f6f7 !important;
	}
	.wrapper {
		.time-box {
			padding-top: 16rpx;
			margin-bottom: 4rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 56rpx;
			font-size: 40rpx;
			color: rgba(0, 0, 0, 1);
			opacity: 1;
			.iconshijian {
				font-size: 36rpx;
				color: #000;
				margin-right: 20rpx;
			}
		}
		.time-info {
			font-size: 24rpx;
			font-weight: 400;
			// line-height:17px;
			color: rgba(102, 102, 102, 1);
			opacity: 1;
			word-wrap: break-word;
			word-break: normal;
			margin-bottom: 20rpx;
		}
		.bto-btn-box {
			width: 100%;
			opacity: 1;
			position: fixed;
			bottom: 0;
			padding: 40rpx 20rpx;
			padding-bottom: 40rpx;
			padding-bottom: calc(40rpx + constant(safe-area-inset-bottom, 0));
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom, 0));
			background: #fff;
			.btn1 {
				background: #fe6b00;
				color: #fff;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				border-radius: 8rpx;
				font-size: 36rpx;
				box-sizing: border-box;
			}
			.btn2 {
				display: contents;
				> view {
					height: 80rpx;
					background: #fe6b00;
					text-align: center;
					border-radius: 40rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #ffffff;
					line-height: 80rpx;
				}
			}
		}
		.map-box {
			height: 520rpx;
			width: 100%;
			position: absolute;
			top: 0;
			// transition-property: position;
			// /* transition-delay: 1s; */
			// transition-duration: 0.6s, 2s;
			// transition-timing-function: ease;
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
			.cover-view-now {
				width: 46rpx;
				height: 46rpx;
				background: #fff;
				border-radius: 8rpx;
				position: fixed;
				right: 40rpx;
				top: 260rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				cover-image {
					width: 70%;
					height: 70%;
				}
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
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 294rpx;
					border-bottom: 2rpx solid #e2e2e2;
					view {
						margin-top: 26rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 56rpx;
						color: #333333;
					}
					img {
						margin: 0 auto;
						width: 94rpx;
						height: 100rpx;
					}
				}
				&:nth-child(2) {
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
		.status-box {
			width: 100%;
			height: 224rpx;
			background: linear-gradient(180deg, #fe6b00 0%, #ff8a37 76%, #f6f6f7 100%);
			padding: 20rpx 24rpx;
			.status-text {
				font-size: 48rpx;
				font-weight: 500;
				color: #ffffff;
				line-height: 66rpx;
			}
		}
		.container-box {
			position: relative;
		}
		.hourglassview {
			padding: 0 24rpx;
			background: #fe6b00;
		}
		.hourglass {
			display: flex;
			align-items: center;
			width: calc(100vw - 48rpx);
			height: 79rpx;
			padding: 22rpx;
			background: linear-gradient(270deg, #ffffff 0%, #ffeada 100%);
			border-radius: 16rpx;
			color: #fe6b00;
			font-size: 28rpx;
			font-weight: bold;
			&.hasmap {
				position: absolute;
				top: 857rpx;
				left: 24rpx;
				z-index: 10;
			}
			image {
				width: 36rpx;
				height: 36rpx;
			}
			.connect {
				display: inline;
				padding: 0;
				margin: 0;
				border: 0;
				font-size: 28rpx;
				color: #fe6b00;
				font-weight: bold;
				text-decoration: underline;
			}
		}
		.container {
			position: absolute;
			top: -118rpx;
			&.hasmap {
				top: 262rpx;
			}
			width: 100%;
			padding: 0 24rpx;
			padding-bottom: 240rpx;
			box-sizing: border-box;
			.operate-box {
				width: 100%;
				min-height: 128rpx;
				.operate {
					width: 100%;
					top: -104rpx;
					left: 0;
					background: #ffffff;
					border-radius: 16rpx;
					padding: 0 24rpx;
					margin-bottom: 20rpx;
					.operate-top {
						padding: 30rpx 0;
						> view {
							&:nth-child(1) {
								font-size: 32rpx;
								font-weight: 500;
								color: #1c1c1d;
								line-height: 44rpx;
							}
						}
					}
					.operate-btn-box {
						padding: 0 20rpx;
						height: 140rpx;
						display: flex;
						align-items: center;
						border-top: 2rpx solid #f1f1f4;
						.operate-btn-item {
							width: 25%;
							display: flex;
							flex-direction: column;
							align-items: center;
							border: 0;
							padding: 0;
							margin: 0;
							font-size: 24rpx;
							font-weight: 400;
							color: #1c1c1d;
							line-height: 34rpx;
							margin-top: 10rpx;
						}
					}
				}
			}
			.order-con {
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				.order-head {
					padding: 30rpx 24rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #1c1c1d;
					line-height: 40rpx;
				}
				.user-goods-item {
					.item {
						border-top: 2rpx solid #f1f1f4;
						padding: 0 24rpx;
					}
					.user-info-box {
						padding: 20rpx 0rpx 30rpx 0rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.user-image {
							width: 56rpx;
							height: 56rpx;
							border-radius: 6rpx;
							margin-right: 20rpx;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.user-name {
							width: 0;
							flex: 1;
							font-size: 32rpx;
							font-weight: 500;
							color: #1c1c1d;
							line-height: 44rpx;
						}
					}
					.goods-item {
						margin-bottom: 30rpx;
						display: flex;
						justify-content: flex-start;
						.goods-img {
							width: 116rpx;
							height: 116rpx;
							border-radius: 10rpx;
							margin-right: 20rpx;
							image {
								width: 116rpx;
								height: 116rpx;
								border-radius: 10rpx;
							}
						}
						.goods-con {
							flex: 1;
							width: 0;
							.goods-top {
								display: flex;
								justify-content: space-between;
								align-items: center;
								font-weight: 500;
								color: #1c1c1d;
								font-size: 28rpx;
								margin-bottom: 4rpx;
								> view {
									&:nth-child(2) {
										height: 20rpx;
										vertical-align: bottom;
									}
								}
							}
							.goods-descript {
								display: flex;
								justify-content: space-between;
								font-size: 24rpx;
								font-weight: 400;
								color: #ababaf;
								line-height: 34rpx;
								margin-bottom: 4rpx;
								.leval {
									height: 38rpx;
									white-space: nowrap;
									background: #ffefef;
									border-radius: 6px;
									font-size: 24rpx;
									color: #ff3b3b;
									padding: 0 8rpx;
									line-height: 38rpx;
								}
							}
						}
					}
					.order-bot {
						padding: 30rpx 24rpx 0rpx;
						border-top: 2rpx solid #f1f1f4;
						.instal-box {
							.member {
								justify-content: space-between;
								> view {
									font-size: 24rpx;
									&:first-of-type {
										color: #e58744;
									}
									&:nth-of-type(2) {
										font-weight: bold;
										color: #ababaf;
										text-decoration: line-through;
									}
								}
							}
							.info-box {
								padding-bottom: 30rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								color: #1c1c1d;
								font-size: 28rpx;
								.block-reduce {
									width: 32rpx;
									height: 32rpx;
									font-size: 24rpx;
									font-weight: bold;
									border-radius: 8rpx;
									background: #ff3b3b;
									color: #ffffff;
									display: inline-block;
									text-align: center;
									line-height: 32rpx;
									margin-right: 8rpx;
								}
								.price-right {
									height: 40rpx;
									vertical-align: bottom;
									> text {
										&:nth-child(1) {
											font-size: 20rpx;
										}
									}
								}
							}
						}
						.order-price {
							height: 116rpx;
							border-top: 2rpx solid #f1f1f4;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							margin-top: 20rpx;
							> view {
								&:nth-child(1) {
									font-size: 24rpx;
									font-weight: 400;
									color: #1c1c1d;
									line-height: 56rpx;
									margin-right: 8rpx;
								}
								&:nth-child(2) {
									font-size: 40rpx;
									font-weight: 500;
									color: #1e1f21;
									height: 56rpx;
									vertical-align: bottom;
								}
							}
						}
					}
				}
			}
			.address-box {
				padding: 30rpx 24rpx;
				background: #ffffff;
				border-radius: 16rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				> view {
					font-size: 28rpx;
					&:nth-child(1) {
						font-weight: 500;
						color: #1c1c1d;
						line-height: 40rpx;
					}
					&:nth-child(2) {
						font-weight: 400;
						color: #636367;
						line-height: 40rpx;
						text-align: right;
					}
				}
			}
			.order-info {
				padding: 0 24rpx 30rpx;
				background: #ffffff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				.info-head {
					font-size: 28rpx;
					font-weight: 500;
					color: #1c1c1d;
					line-height: 100rpx;
					border-bottom: 2rpx solid #f1f1f4;
				}
				.info-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 30rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #636367;
					line-height: 40rpx;
				}
				.btn-left {
					width: 156rpx;
					line-height: 56rpx;
					border-radius: 28rpx;
					border: 2rpx solid #f1f1f4;
					color: #1c1c1d;
					font-size: 24rpx;
					font-weight: 500;
					text-align: center;
					margin-left: auto;
				}
			}
			.remark-box {
				background: #ffffff;
				border-radius: 16rpx;
				padding: 30rpx 24rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #636367;
				line-height: 40rpx;
				word-wrap: break-word;
				margin-bottom: 100rpx;
			}
		}
	}
</style>
