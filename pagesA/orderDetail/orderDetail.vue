<template>
	<view class="container">
		<u-navbar :back-icon-color="backColor" :is-back="true" title=" " :border-bottom="false" :background="backgroundImg"> </u-navbar>
		<view class="slot-wrap"> </view>
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
		<movable-area class="share-btn" v-if="(orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5 || orderDetail.status == 8) && getTimeOut() && !orderDetail.state">
			<movable-view :x="300" :y="100" direction="all" @change="onChange"> <button open-type="share"></button></movable-view>
		</movable-area>
		<view :class="[{ hasmap: RiderOrders }, 'top-box']">
			<view class="map-box" v-if="RiderOrders && mapCtx">
				<map id="mapCtx2" :longitude="curLocation.longitude" :latitude="curLocation.latitude" scale="16" :markers="markers" :include-points="markers" bindmarkertap="markertap" :polyline="polyline" bindregionchange="regionchange" show-location show-compass style="width: 100%; height: 100%">
					<cover-view class="cover-view-now" @tap="fixedPosition()">
						<cover-image src="../../static/img/focu.png"></cover-image>
					</cover-view>
				</map>
			</view>
			<view class="top-text" v-else-if="orderDetail.refundStatus == 3">
				<text v-if="orderDetail.status !== null">{{ "申请退款被驳回！" }}</text>
				<u-icon name="arrow-right" color="#fff" size="28"></u-icon>
			</view>
			<view class="top-text" v-else>
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
				<!-- <u-icon name="arrow-right" color="#fff" size="28"></u-icon> -->
			</view>
		</view>
		<view class="center-box">
			<view :class="[{ hasmapcenter: RiderOrders }, 'center']">
				<view v-if="orderDetail.refundStatus == 3" class="info-detali-box">
					<view class="operate-top">申请退款被驳回！</view>
					<view class="time-info"
						>驳回原因：{{ orderDetail.refuseCancelRecord.cause }}
						<text v-if="orderDetail.refuseCancelRecord.remark">{{ `，${orderDetail.refuseCancelRecord.remark}` }}</text>
						<text>，如有疑问请联系客服处理。</text>
					</view>
					<view class="operate-btn-box">
						<button open-type="contact" class="operate-btn-item" plain="true">
							<u-icon name="server-man" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系客服</view>
						</button>
						<view class="operate-btn-item" @tap="contactMerchant">
							<u-icon name="phone" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系商家</view>
						</view>
						<button open-type="share" class="operate-btn-item" plain="true" v-if="getTimeOut()">
							<u-icon name="red-packet" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">分享领红包</view>
						</button>
						<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
					</view>
				</view>
				<view class="info-detali-box" v-else-if="orderDetail.status !== 6 && orderDetail.status !== 11 && orderDetail.status !== 12 && orderDetail.status !== 13">
					<view class="time-box" v-if="orderDetail.status == 0">
						<text class="iconfont iconshijian"></text>
						<u-count-down class="count-down-demo" :timestamp="time" font-size="40" color="rgba(0,0,0,1)" :showDays="false" :show-hours="false" @change="change" @end="end" ref="uCountDown" bg-color="rgb(251, 251, 251)"></u-count-down>
					</view>
					<view class="time-info" v-if="orderDetail.status == 0">15分钟内未支付，订单将自动取消，请尽快支付！</view>
					<view class="operate-top" v-if="orderDetail.status !== 0 && orderDetail.status !== null">{{
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
					<view class="time-info" v-if="orderDetail.status == 7">退款金额已自动原路返还，银行系统可能会有延迟，请注意查看银行信息！</view>
					<view class="operate-btn-box">
						<view class="operate-btn-item" v-if="orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5" @tap="contactMerchant">
							<u-icon name="phone" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系商家</view>
						</view>
						<view class="operate-btn-item" v-if="Boolean(orderDetail.status == 0 || orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5) && orderDetail.refundStatus == 0" @tap="cancelOrder">
							<u-icon name="close-circle" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">取消订单</view>
						</view>
						<view class="operate-btn-item" v-if="orderDetail.status == 0 && orderDetail.orderType == 0" @tap="updataOrderInfo">
							<u-icon name="edit-pen" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">修改订单信息</view>
						</view>
						<view class="operate-btn-item" v-if="orderDetail.status == 8 && orderDetail.isEvaluate == 0 && !orderDetail.state" @tap="jumpEvaluate">
							<u-icon name="photo" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">评价晒图</view>
						</view>
						<button open-type="share" class="operate-btn-item" plain="true" v-if="(orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5 || orderDetail.status == 8) && getTimeOut() && !orderDetail.state">
							<u-icon name="red-packet" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">分享领红包</view>
						</button>
						<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
					</view>
				</view>
				<view v-else-if="orderDetail.refundStatus == 1" class="info-detali-box">
					<view class="operate-top">申请退款中！</view>
					<view class="operate-btn-box">
						<button open-type="contact" class="operate-btn-item" plain="true">
							<u-icon name="server-man" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系客服</view>
						</button>
						<view class="operate-btn-item" @tap="contactMerchant">
							<u-icon name="phone" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系商家</view>
						</view>
						<view class="operate-btn-item" @tap="cancelApplication">
							<u-icon name="close-circle" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">取消退款申请</view>
						</view>
						<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
					</view>
				</view>
				<view class="goods-detail-box">
					<view class="shop-name">
						{{ orderDetail.storeName }}
						<text class="iconfont icon-arrow-right"></text>
					</view>
					<view class="goods-list-box">
						<view class="goods-detail">
							<view class="stall-name">
								{{ orderDetail.shopName }}
								<!-- 档口的名字名字 -->
							</view>
							<view class="goods-box" v-for="(i, index) in orderDetail.details" :key="index">
								<image :src="i.pic" mode=""></image>
								<view class="goods-right" style="min-width: 0">
									<view class="goods-top">
										<view class="top-left u-line-2">{{ i.goodsName }}</view>
										<view class="top-right">
											<text class="goods-num">× {{ i.quantity }}</text>
											<text class="goods-price"> <text class="u-font-10">￥</text>{{ i.subtotal }}</text>
										</view>
									</view>
									<view class="goods-bot u-line-2">{{ i.specification }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="orderDetail.orderType !== 1">
						<view class="coupon-title">餐盒费</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">￥</text>
							<text class="info-2">{{ orderDetail.packageFee }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="orderDetail.orderType == 0">
						<view class="coupon-title">配送费&nbsp;•&nbsp;{{ deliveryText[orderDetail.deliveryWay] }}</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-2 u-m-r-48 u-font-24" style="color: #999999"><text class="u-font-10">￥\t&nbsp;</text>{{ orderDetail.realityShippingFee ? orderDetail.realityShippingFee : 0 }}</text>
							<text class="info-1">￥</text>
							<text class="info-2">{{ orderDetail.shippingFee }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="orderDetail.state">
						<view class="coupon-title">订单金额</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">￥</text>
							<text class="info-2">{{ orderDetail.productAmount ? orderDetail.productAmount : 0 }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-else>
						<view class="coupon-title">店铺满减</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">-￥</text>
							<text class="info-2">{{ orderDetail.reduceFee ? orderDetail.reduceFee : 0 }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between">
						<view class="coupon-title">平台券</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">-￥</text>
							<text class="info-2">{{ orderDetail.redPackageFee ? orderDetail.redPackageFee : 0 }}</text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between">
						<view class="coupon-title">商家券</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">-￥</text>
							<text class="info-2">{{ orderDetail.shopRedPackageFee ? orderDetail.shopRedPackageFee : 0 }} </text>
						</view>
					</view>
					<view class="coupon u-flex u-row-between" v-if="orderDetail.firstOrderDiscounts">
						<view class="coupon-title">首单立减</view>
						<view class="coupon-right u-flex u-row-left">
							<text class="info-1">-￥</text>
							<text class="info-2">{{ orderDetail.firstOrderDiscounts }} </text>
						</view>
					</view>
					<view class="subtotal u-flex u-row-right">
						<view class="subtotal-right u-flex u-col-bottom u-m-r-20" v-if="discountedPrice">
							<text class="u-font-10 u-m-r-6 u-m-b-6">已优惠：</text>
							<text class="u-font-10 u-m-b-6">￥</text>
							<text class="u-font-18">{{ discountedPrice }}</text>
						</view>
						<view class="subtotal-right u-flex u-col-bottom" style="font-weight: bold">
							<text class="u-font-10 u-m-r-6 u-m-b-6">实付：</text>
							<text class="u-font-10 u-m-b-6">￥</text>
							<text class="u-font-18">{{ orderDetail.actualPayment }}</text>
						</view>
					</view>
				</view>
				<view class="delivery-detail-box" v-if="orderDetail.orderType == 0 && orderDetail.ddDelivery.dmId">
					<view class="delivery-title">配送信息</view>
					<view class="delivery-info">
						<view class="delivery-info-left">
							<view v-if="orderDetail.status == 8">送达时间</view>
							<view v-else>预计送达时间</view>
							<view>配送方式</view>
							<view>配送骑手</view>
						</view>
						<view class="delivery-info-right">
							<view v-if="orderDetail.status == 8">{{ orderDetail.completedTime }}</view>
							<view v-else>{{ orderDetail.expectTime }} </view>
							<view>{{ orderDetail.deliveryWay == 1 ? "自配送" : orderDetail.deliveryWay == 2 ? "达达配送" : orderDetail.deliveryWay == 3 ? "蜂鸟配送" : deliveryType == 4 ? "顺丰配送" : "不配送" }}</view>
							<view>{{ orderDetail.ddDelivery.dmName || "店家" }}</view>
						</view>
					</view>
					<view class="delivery-contact" @tap="concatDeliver">
						<text class="iconfont icondianhua"></text>
						<text>联系骑手</text>
					</view>
				</view>
				<view class="address-detail-box" v-if="orderDetail.orderType == 0">
					<view class="address-title"> 收货地址 </view>
					<view class="user-box">
						<img v-if="orderDetail.avatarUrl" class="image" :src="orderDetail.avatarUrl" />
						<img v-else class="image" src="../../static/img/default-man.png" />
						<view class="user-name u-margin-right-20">
							{{ orderDetail.recipientName }}
						</view>
						<view class="user-phone">{{ orderDetail.recipientPhone }}</view>
					</view>
					<view class="address">
						{{ orderDetail.recipientAddress }}
					</view>
				</view>
				<view class="delivery-detail-box">
					<view class="delivery-title">订单信息</view>
					<view class="order-info">
						<view class="delivery-info-left">
							<view>订单编号</view>
							<view>创建时间</view>
							<view>支付时间</view>
							<view v-if="orderDetail.orderType == 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)">预计送达时间</view>
							<view v-if="orderDetail.orderType !== 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)">取餐时间</view>
							<view>支付方式</view>
						</view>
						<view class="delivery-info-right">
							<view>{{ orderDetail.orderId }}{{ orderDetail.todayNum ? `#${orderDetail.todayNum}` : "" }}</view>
							<view>{{ orderDetail.createTime ? orderDetail.createTime : "-" }}</view>
							<view>{{ orderDetail.payTime ? orderDetail.payTime : "-" }}</view>
							<view v-if="orderDetail.orderType == 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)">{{ orderDetail.expectTime ? orderDetail.expectTime : "-" }}</view>
							<view v-if="orderDetail.orderType !== 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)">{{ orderDetail.expectTime ? orderDetail.expectTime : "-" }}</view>
							<view>{{ orderDetail.payType == 1 ? "微信支付" : orderDetail.payType == 2 ? "支付宝支付" : orderDetail.payType == 3 ? "余额" : orderDetail.payType == 5 ? "充值免单" : orderDetail.status == 0 ? "-" : orderDetail.status == 1 ? "-" : "现金" }}</view>
						</view>
					</view>
				</view>
				<view class="remark-box" v-if="orderDetail.remark">{{ orderDetail.remark }}</view>
			</view>
		</view>
		<view class="bto-btn-box" v-if="orderDetail.status == 0">
			<view class="btn1" @tap="jumpPay">立即支付</view>
		</view>
		<view class="bto-btn-box" v-else>
			<button open-type="share" class="btn2" plain="true" data-type="group" @tap="clickShare">
				<view>{{ orderPacket.msg }}</view>
			</button>
		</view>
		<!-- <view
			class="bto-btn-box1"
			v-if="
				orderDetail.status == 6 ||
				orderDetail.status == 7 ||
				orderDetail.status == 8 ||
				orderDetail.status == 11 ||
				orderDetail.status == 12 ||
				orderDetail.status == 13
			"
		>
			<view class="left" @tap="contactMerchant">
				<view class="iconfont icondianhua"></view>
				<view class="view">联系商家</view>
			</view>
			<view class="right" :class="[orderDetail.status == 6 ? 'right-style2' : 'right-style1']" @tap="tapBtn(orderDetail.status, orderDetail)">{{
				btnText(orderDetail.status)
			}}</view>
		</view> -->
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	import store from "@/store";
	import popUp from "../../components/popup/popup";
	import { Decimal } from "decimal.js";
	export default {
		name: "orderDetail",
		components: {
			popUp,
		},
		data() {
			return {
				rechargeUrl: "",
				orderPacket: {},
				backColor: "#ffffff",
				backgroundImg: {
					background: "transparent",
				},
				popMask: false, //领券弹窗
				popType: 0, //0:天天领红包
				popMask: false,
				platCouponList: [], //券列表
				cardDetail: {},
				luckNum: 0,
				shareId: 0,
				orderId: null,
				show_cover: false,
				mapCtx: null,
				//缩放视野以包含所有给定的坐标点
				//标记点
				markers: [],
				//路线
				polyline: [],
				//当前位置
				curLocation: {},
				discountedPrice: 0,
				now: new Date().getTime(),
				cancelMask: false,
				time: null,
				deliveryText: {
					0: "不配送",
					1: "自配送",
					2: "达达",
					3: "蜂鸟",
					4: "顺丰",
				},
				orderDetail: {
					cellStyleMap: {},
					orderActivitys: null,
					cancelRecord: null,
					details: [],
					storeName: "门店",
					shopName: "店铺",
					orderId: 102584,
					todayNum: 1,
					orderTypeName: null,
					recipientName: "",
					recipientPhone: "",
					productAmount: 0,
					packageFee: 0.0,
					shippingFee: 0.0,
					merchantShippingFee: 0,
					platformShippingFee: 0,
					serviceFee: 0,
					redPackageFee: 0,
					shopRedPackageFee: 0,
					reduceFee: 0,
					actualPayment: 3.0,
					netReceiptsAmount: 0,
					statusName: "",
					payTypeName: null,
					settlementAmount: 0,
					person: 1,
					sendTime: "",
					payTime: "",
					deliveryFetchTime: null,
					completedTime: null,
					distance: null,
					psMin: null,
					customerId: 71,
					storeId: 194,
					shopId: 388,
					merchantId: 214,
					transId: 201459,
					merchantName: "",
					stallName: "",
					orderType: 0,
					deliveryWay: 0,
					recipientAddress: "",
					location: "114.420808,30.480474",
					reservedPhone: "18538715429",
					status: null,
					payType: 3,
					orderSource: 0,
					expireTime: "",
					confirmTime: "",
					expectTime: "",
					cancelTime: null,
					refundTime: null,
					refundConfirmTime: null,
					deliveryId: null,
					deliveryName: null,
					realityShippingFee: 0.0,
					remark: "",
					createTime: "",
					updateTime: null,
					creatorId: 817,
					updaterId: null,
					isEvaluate: 0,
					shopPhone: "",
					orderName: null,
					pic: "",
					takeMealTime: "",
					orderGoods: null,
					shopLocation: "114.420808,30.480474",
					avatarUrl: null,
					addressId: null,
					gatherName: null,
					gatherCount: null,
					gatherTotalCount: null,
					deliveryStatusName: null,
					shopRedPackageBearAmount: 0,
					platformFee: 0,
					orderWay: 1,
				},
				options: {},
				checkCoupon: 0,
			};
		},
		computed: {
			RiderOrders: function () {
				return Boolean(this.orderDetail.status == 3 || this.orderDetail.status == 4 || this.orderDetail.status == 5) && Boolean(this.orderDetail.orderType == 0) && Boolean(this.orderDetail.refundStatus !== 3);
			},
		},
		async onReady(e) {
			// 使用 wx.createMapContext 获取 map 上下文
			this.mapCtx = uni.createMapContext("mapCtx2");
			this.getOrderDetail(this.orderId);
			if (this.checkCoupon) this.orderActivity();
			let PACKET = await store.dispatch("GetOrdersRedPacket", {}); //分享好友下单红包价格
			this.orderPacket = PACKET.data ?? {};
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.checkCoupon = option?.checkCoupon ?? 0;
		},
		onShow() {
			this.cancelMask = false;
		},
		onShareAppMessage: function (res) {
			if (res.from === "button") {
				const shareId = this.shareId;
				const luckNum = this.luckNum;
				// 来自页面内转发按钮
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
		methods: {
			onChange() {},
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
			async fixedPosition() {
				let that = this;
				let rider = await store.dispatch("GetLocation", { orderId: this.orderId || 0 });
				// this.markers.push({
				const inx = this.markers.findIndex(item => item.id == 2);
				console.log("fixedPosition -> this.markers", this.markers);

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
					// this.mapCtx.moveToLocation({ latitude: rider.data.split(",")[1] * 1, longitude: rider.data.split(",")[0] * 1 });
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
			getTimeOut() {
				if (!this.orderDetail.payTime || !this.shareId) {
					return false;
				}
				return this.now - new Date(this.orderDetail.payTime.replace(/-/g, "/")).getTime() < 6 * 24 * 60 * 60 * 1000;
			},
			tapBtn(stu, it) {
				switch (stu) {
					case 6:
						return;
						break;
					case 7:
						this.getOneOrder(it);
						break;
					case 8:
						this.getOneOrder(it);
						break;
					case 11:
						this.cancelApplication();
						break;
					case 12:
						this.cancelApplication();
						break;
					case 13:
						this.cancelApplication();
						break;
					default:
						return;
						break;
				}
			},
			// orderDetail.status==6||orderDetail.status==7||orderDetail.status==8||orderDetail.status==11||orderDetail.status==12||orderDetail.status==13
			btnText(i) {
				let text = "";
				switch (i) {
					case 6:
						text = "取消退款申请";
						break;
					case 7:
						text = "再来一单";
						break;
					case 8:
						text = "再来一单";
						break;
					case 11:
						text = "取消退款申请";
						break;
					case 12:
						text = "取消退款申请";
						break;
					case 13:
						text = "取消退款申请";
						break;
					default:
						break;
				}
				return text;
			},
			getOneOrder(it) {
				//再来一单
				uni.navigateTo({
					url: `/pages/home/home?shopId=${it.shopId}`,
				});
			},
			cancelApplication() {
				//取消订单
				let params = {
					orderId: this.orderDetail.orderId,
				};
				let successFuc = res => {
					if (res.code == 0) {
						this.getOrderDetail(this.orderDetail.orderId);
					}
				};
				AjaxApi("RefundCancel", params, successFuc);
			},
			jumpEvaluate() {
				uni.redirectTo({
					url: `/pagesA/evaluation/evaluation?orderId=${this.orderDetail.orderId}`,
				});
			},
			updataOrderInfo() {
				uni.redirectTo({
					url: `/pagesA/updateOrder/updateOrder?orderId=${this.orderDetail.orderId}&storeName=${this.orderDetail.storeName}`,
				});
			},
			turnToCancel() {
				uni.redirectTo({
					url: `/pagesA/orderCancel/orderCancel?orderId=${this.orderDetail.orderId}&orderStatus=${this.orderDetail.status}&pdType=0`,
				});
			},
			cancelOrder() {
				this.cancelMask = true;
			},
			jumpPay() {
				let payType = this.orderDetail.actualPayment == 0 ? 4 : 3;
				uni.redirectTo({
					url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${this.orderDetail.orderId}&payType=${payType}&pdType=0`,
				});
			},
			contactMerchant() {
				//联系商家
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.shopPhone, //仅为示例
				});
			},
			concatDeliver() {
				//联系骑手
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.ddDelivery.dmMobile, //仅为示例
				});
			},
			hidePop() {
				this.popMask = false;
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
					this.orderDetail = res.data;
					this.orderDetail.ddDelivery = res.data.ddDelivery;
					this.orderDetail.details = res.data.details;
					let format = this.orderDetail.expireTime.replace(/-/g, "/");
					this.time = parseInt((new Date(format).getTime() - new Date().getTime()) / 1000);
					this.discountedPrice = new Decimal(this.orderDetail?.shopRedPackageFee ?? 0).add(new Decimal(this.orderDetail?.redPackageFee ?? 0)).add(new Decimal(this.orderDetail?.reduceFee ?? 0));
					this.markers.push({
						iconPath: "/static/img/marker.png",
						id: 1,
						latitude: res.data.shopLocation.split(",")[1] * 1,
						longitude: res.data.shopLocation.split(",")[0] * 1,
						width: 22,
						height: 29,
						title: res.data.storeName,
					});
					let url = await store.dispatch("RechargeUrl", {});
					this.rechargeUrl = url.data;
					let rider = await store.dispatch("GetLocation", { orderId: res.data.orderId || 0 });
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
					this.curLocation = {
						longitude: rider.data ? rider.data.split(",")[0] * 1 : res.data.shopLocation.split(",")[0] * 1,
						latitude: rider.data ? rider.data.split(",")[1] * 1 : res.data.shopLocation.split(",")[1] * 1,
					};
					this.mapCtx.moveToLocation(this.curLocation);
				};
				AjaxApi("OrderDetail", params, successFuc);
			},
			change(timestamp) {},
			end() {
				uni.switchTab({
					url: "/pages/order/order",
				});
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
	button[plain] {
		border: 0;
	}
	.slot-wrap {
		position: absolute;
		width: 100vw;
		height: 400rpx;
		background: linear-gradient(180deg, #fe6b00 0%, #ff8a37 76%, #f6f6f7 100%);
	}
	.container {
		background: #f9fafb;
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
		.share-btn {
			z-index: 10069;
			position: fixed;
			width: 100%;
			height: 30%;
			right: 0;
			bottom: 200rpx;
			movable-view {
				width: 80rpx;
				height: 90rpx;
				background: url("../../static/img/share_card.png") no-repeat;
				background-size: cover;
				border-radius: 8rpx;
				box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
				button {
					padding: 0;
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 100%;
					background-color: #ffffff00;
					position: relative;
					margin-left: auto;
					margin-right: auto;
					padding-left: 0;
					padding-right: 0;
					box-sizing: border-box;
					text-align: left;
					text-decoration: none;
					line-height: 1;
					-webkit-tap-highlight-color: transparent;
					overflow: hidden;
					&:after {
						content: none;
					}
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
		.top-box {
			height: 250rpx;
			width: 100%;
			background: transparent;
			padding-top: 44rpx;
			box-sizing: border-box;
			z-index: 100;
			&.hasmap {
				padding-top: 0;
			}
			.top-text {
				padding-left: 24rpx;
				display: flex;
				justify-content: flex-start;
				height: 72rpx;
				font-size: 48rpx;
				font-weight: bold;
				color: white;
			}
			.map-box {
				// height: calc(100vh - 850rpx);
				height: 520rpx;
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
				.cover-view-now {
					width: 46rpx;
					height: 46rpx;
					background: #fff;
					border-radius: 8rpx;
					position: absolute;
					right: 40rpx;
					top: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					cover-image {
						width: 70%;
						height: 70%;
					}
				}
			}
		}
		.center-box {
			width: 100%;
			box-sizing: border-box;
			flex: 1;
			z-index: 100;
			position: relative;
			.center {
				padding: 0rpx 20rpx 140rpx 20rpx;
				padding-bottom: 180rpx;
				padding-bottom: calc(180rpx + constant(safe-area-inset-bottom, 0));
				padding-bottom: calc(180rpx + env(safe-area-inset-bottom, 0));
				position: absolute;
				top: -80rpx;
				&.hasmapcenter {
					top: 176rpx;
					z-index: 99;
				}
				width: 100%;
				.info-detali-box {
					padding: 0rpx 30rpx 0rpx 26rpx;
					background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					margin-bottom: 20rpx;
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
				.goods-detail-box {
					width: 100%;
					padding: 0rpx 40rpx;
					background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					margin-bottom: 20rpx;
					.shop-name {
						padding: 18rpx 0rpx 24rpx;
						font-size: 32rpx;
						font-weight: bold;
						line-height: 44rpx;
						color: #333333;
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
						// border-bottom: 2rpx solid rgba(221, 221, 221, 1);
						.stall-name {
							padding: 16rpx 0rpx 24rpx 0rpx;
							font-size: 24rpx;
							font-weight: 400;
							line-height: 28rpx;
							color: #333333;
							opacity: 1;
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
								min-height: 40rpx;
								line-height: 40rpx;
								opacity: 1;
								display: flex;
								justify-content: space-between;
								margin-bottom: 6rpx;
							}
							.goods-bot {
								min-height: 28rpx;
								max-height: 60rpx;
								font-size: 24rpx;
								color: rgba(153, 153, 153, 1);
								opacity: 1;
							}
							.top-left {
								flex: 1;
								min-height: 40rpx;
								max-height: 80rpx;
								line-height: 40rpx;
								opacity: 1;
								font-size: 28rpx;
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
								opacity: 1;
							}
							.goods-price {
								margin-left: 48rpx;
								height: 40rpx;
								line-height: 40rpx;
								opacity: 1;
							}
						}
					}
					.coupon {
						height: 80rpx;
						font-size: 28rpx;
						// border-bottom: 2rpx solid rgba(221, 221, 221, 1);
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
							font-size: 20rpx;
							font-weight: bold;
							line-height: 20px;
							color: #333333;
							opacity: 1;
						}
						.info-2 {
							height: 40rpx;
							font-size: 28rpx;
							font-weight: bold;
							line-height: 20px;
							color: #333333;
							opacity: 1;
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
					}
				}
				.delivery-detail-box {
					margin-bottom: 20rpx;
					width: 100%;
					box-sizing: border-box;
					padding: 0rpx 28rpx 30rpx 32rpx;
					background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
					border-radius: 8rpx;
					.delivery-title {
						padding: 18rpx 0;
						font-size: 32rpx;
						font-weight: bold;
						line-height: 44rpx;
						color: #333333;
						margin-bottom: 28rpx;
					}
					.order-info {
						height: 220rpx;
						margin-bottom: 10rpx;
						display: flex;
						justify-content: space-between;
						font-size: 28rpx;
						font-weight: 400;
						.delivery-info-left {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: space-between;
							color: #666666;
						}
						.delivery-info-right {
							color: #333333;
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							justify-content: space-between;
						}
					}
					.delivery-info {
						display: flex;
						justify-content: space-between;
						height: 190rpx;
						font-size: 28rpx;
						font-weight: 400;
						margin-bottom: 30rpx;
						.delivery-info-left {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: space-between;
							color: #666666;
						}
						.delivery-info-right {
							color: #333333;
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							justify-content: space-between;
						}
					}
					.delivery-contact {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						color: #ceae73;
						height: 34rpx;
						font-size: 24rpx;
						font-weight: 500;
						.icondianhua {
							font-size: 24rpx;
							margin-right: 12rpx;
						}
					}
				}
				.address-detail-box {
					background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					padding: 0rpx 32rpx 36rpx 32rpx;
					margin-bottom: 20rpx;
					.address-title {
						padding: 18rpx 0;
						font-size: 32rpx;
						font-weight: bold;
						line-height: 44rpx;
						color: #333333;
						margin-bottom: 34rpx;
					}
					.user-box {
						height: 34rpx;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						margin-bottom: 8rpx;
						.image {
							width: 30rpx;
							height: 30rpx;
							margin-right: 12rpx;
						}
						.user-name {
							font-size: 24rpx;
							font-weight: bold;
							color: #333333;
						}
						.user-phone {
							font-size: 24rpx;
							font-weight: 400;
							color: #666666;
						}
					}
					.address {
						font-size: 24rpx;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
						opacity: 1;
					}
				}
				.remark-box {
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					padding: 24rpx 30rpx 38rpx 32rpx;
					background: #fff;
					word-wrap: break-word;
					word-break: normal;
					margin-bottom: 60rpx;
				}
			}
		}
		.bto-btn-box {
			z-index: 101;
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
		.bto-btn-box1 {
			width: 100%;
			opacity: 1;
			position: fixed;
			bottom: 0;
			padding: 20rpx 20rpx;
			background: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				margin-left: 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.icondianhua {
					font-size: 32rpx;
					margin-bottom: 6rpx;
				}
				.view {
					font-size: 20rpx;
					font-weight: 400;
					line-height: 28rpx;
					color: rgba(102, 102, 102, 1);
					opacity: 1;
				}
			}
			.right {
				text-align: center;
				width: 324rpx;
				color: #343434;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				border-radius: 8rpx;
				font-size: 36rpx;
				box-sizing: border-box;
			}
			.right-style1 {
				background: #e5cda1;
			}
			.right-style2 {
				background: #999999;
			}
		}
		// .btn {
		// 	width: calc(100% - 48rpx);
		// 	background: #4c70e8;
		// 	color: #fff;
		// 	height: 100rpx;
		// 	line-height: 100rpx;
		// 	text-align: center;
		// 	border-radius: 8rpx;
		// 	font-size: 36rpx;
		// 	box-sizing: border-box;
		// 	margin: 24rpx;
		// }
	}
</style>
