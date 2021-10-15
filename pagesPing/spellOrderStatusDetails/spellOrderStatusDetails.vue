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
		<u-modal v-model="contactMol" :show-title="false" :show-cancel-button="true" :content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }" width="608" @cancel="cancelContact">
			<view class="slot-content">
				<view>{{ alertConcel }}</view>
				<view>当前活动已结束,如有疑问请联系客服</view>
			</view>
			<template slot="confirm-button" class="u-border-left" style="height: 100%">
				<button class="confirm-button" open-type="contact" plain="true" style="color: #fe6b00">联系客服</button>
			</template>
		</u-modal>
		<view class="head-box"></view>
		<view class="status-box" v-if="!RiderOrders">
			<view class="u-flex u-row-left u-col-center" style="line-height: 66rpx">
				<view class="status-text">
					<text v-if="createId !== orderDetail.creatorId && getPdId.status == 2">待成团 </text>
					<text v-else-if="orderDetail.status !== null"
						>{{
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
						}}
					</text>
				</view>
				<!-- <u-icon name="arrow-right" color="#fff" size="20"></u-icon> -->
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
						<view class="time-box" v-if="orderDetail.status == 0 && createId == orderDetail.creatorId">
							<text class="iconfont iconshijian"></text>
							<u-count-down class="count-down-demo" :timestamp="time" font-size="40" color="rgba(0,0,0,1)" :showDays="false" :show-hours="false" @end="end" ref="uCountDown" bg-color="rgb(251, 251, 251)"></u-count-down>
						</view>
						<view class="time-info" v-if="orderDetail.status == 0 && createId == orderDetail.creatorId">15分钟内未支付，订单将自动取消，请尽快支付！</view>
						<view class="operate-top" v-if="createId !== orderDetail.creatorId && getPdId.status == 2">
							<view>等待发起人支付后才能成团</view>
						</view>
						<view class="operate-top" v-else-if="orderDetail.status !== 0 && orderDetail.status !== null">
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
								<u-icon name="phone" color="#000" size="36" class="u-m-t-10"></u-icon>
								<view class="btn-text">联系商家</view>
							</view>
							<view class="operate-btn-item" v-if="orderDetail.status == 0" @tap="cancelOrder(0)">
								<u-icon name="close-circle" color="#000" size="36" class="u-m-t-10"></u-icon>
								<view class="btn-text">取消订单</view>
							</view>
							<view class="operate-btn-item" v-if="orderDetail.status == 3" @tap="cancelOrder(2)">
								<u-icon name="close-circle" color="#000" size="36" class="u-m-t-10"></u-icon>
								<view class="btn-text">申请退款</view>
							</view>
							<view class="operate-btn-item" v-if="orderDetail.status == 8 && orderDetail.isEvaluate == 0" @tap="jumpEvaluate">
								<u-icon name="photo" color="#000" size="36" class="u-m-t-10"></u-icon>
								<view class="btn-text">评价晒图</view>
							</view>
							<button open-type="share" class="operate-btn-item" plain="true" v-if="(orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5 || orderDetail.status == 8) && getTimeOut()">
								<u-icon name="red-packet" color="#000" size="36" class="u-m-t-10"></u-icon>
								<view class="btn-text">分享领红包</view>
							</button>
							<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
						</view>
					</view>
				</view>
				<view class="goods-my">
					<view class="goods-top-h">
						<view class="top-h-l">
							<view>我的餐品</view>
						</view>
					</view>
					<view class="goods-top-c">
						<view class="goods-order">
							<view class="goods-box" v-for="(item, i) in orderDetail.users[0].orderDetails" :key="i">
								<view class="goods-item" :style="{ 'margin-top': `${i == 0 ? '0rpx' : '30rpx'}` }">
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
							<view class="info-box" v-if="orderDetail.redPackageFee">
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
						<view class="order-bot">
							<view class="right">
								<view class="price-box">
									<text>小计</text>
									<text>¥</text>
									<text>{{ orderDetail.actualPayment || 0 }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="partner-box" v-if="orderDetail.others.length">
					<view class="partner-top">好友餐品</view>
					<view class="partner-goods">
						<view class="partner-item" v-for="(it, i) in orderDetail.others" :key="i">
							<view class="partner-img">
								<image :src="`${it.url || '../../static/img/deliveryPic.png'}`"></image>
							</view>
							<view class="partner-info">
								<view class="info-h">
									<view class="left">
										<view class="partner-name">{{ it.name }}</view>
									</view>
								</view>
								<view class="goods-p">
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
		<view class="bto-btn-box" v-if="orderDetail.status == 0">
			<view class="btn1" @tap="cancelOrder(1)">立即支付</view>
		</view>
		<view class="bto-btn-box" v-if="Boolean(orderDetail.status > 0 && orderDetail.status < 6)">
			<button open-type="share" class="btn2" plain="true" data-type="group" @tap="clickShare">
				<view>{{ orderPacket.msg }}</view>
			</button>
		</view>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	import { BASE64 } from "@/utils";
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
				popMask: false, //领券弹窗
				popType: 0, //0:天天领红包
				popMask: false,
				platCouponList: [], //券列表
				cardDetail: {},
				checkCoupon: 0,
				createId: 0,
				shopImg: getApp().globalData.shopImg,
				alertConcel: "",
				orderDetail: {
					cellStyleMap: {},
					orderActivitys: null,
					cancelRecord: null,
					refuseCancelRecord: null,
					ddDelivery: null,
					details: null,
					pid: 0,
					storeName: "",
					shopName: "",
					orderId: 0,
					todayNum: 2,
					orderTypeName: null,
					recipientName: "",
					recipientPhone: "",
					productAmount: 0,
					packageFee: 0,
					shippingFee: 0,
					merchantShippingFee: 0,
					platformShippingFee: 0,
					serviceFee: 0,
					redPackageFee: null,
					shopRedPackageFee: null,
					reduceFee: null,
					actualPayment: 0,
					netReceiptsAmount: null,
					statusName: "",
					payTypeName: null,
					settlementAmount: 0,
					person: null,
					sendTime: "",
					payTime: "",
					deliveryFetchTime: null,
					completedTime: null,
					distance: null,
					psMin: null,
					customerId: 0,
					storeId: 0,
					shopId: null,
					merchantId: null,
					transId: 0,
					merchantName: null,
					stallName: null,
					orderType: 0,
					deliveryWay: 0,
					recipientAddress: "",
					location: "114.417477,30.480461",
					reservedPhone: null,
					status: 1,
					refundStatus: 0,
					payType: 0,
					orderSource: 0,
					expireTime: "",
					confirmTime: "",
					expectTime: null,
					cancelTime: null,
					refundTime: null,
					refundConfirmTime: null,
					deliveryId: null,
					deliveryName: null,
					realityShippingFee: null,
					remark: null,
					createTime: "",
					updateTime: null,
					creatorId: 0,
					updaterId: null,
					isEvaluate: 0,
					shopPhone: null,
					orderName: null,
					pic: "",
					takeMealTime: null,
					orderGoods: null,
					shopLocation: null,
					avatarUrl: null,
					addressId: 0,
					gatherName: null,
					gatherCount: null,
					gatherTotalCount: null,
					deliveryStatusName: null,
					shopRedPackageBearAmount: 0,
					platformFee: null,
					orderWay: 0,
					saleTime: null,
					platformRedPackageBearAmount: 0,
					merchantPlatformBearAmount: null,
					platformBearAmount: 0,
					mjPlatformBearAmount: 0,
					firstOrderDiscounts: 0,
					pdType: 0,
					pdId: 0,
					pdPackageFee: 0,
					users: [
						{
							userId: 0,
							url: "",
							name: "",
							packageFee: null,
							pdPackageFee: null,
							shoppingFee: null,
							status: null,
							subPrice: null,
							create: null,
							shoppingCarts: null,
							orderDetails: [
								{
									detailId: 0,
									shopId: 0,
									orderId: 0,
									goodsId: 0,
									stockId: 0,
									goodsName: "",
									specification: "",
									pic: "",
									originalPrice: 0,
									discountPrice: 0,
									quantity: 0,
									sharing: 0,
									subtotal: 0,
									createTime: "",
									updateTime: null,
								},
							],
						},
					],
				},
				cancelMask: false,
				contactMol: false,
				luckNum: 0,
				shareId: 0,
				orderId: 0,
				time: 0,
				markers: [],
				getPdId: {},
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
				this.navbarTit = "拼餐详情";
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
			async getOrderDetail(val) {
				uni.showLoading({
					title: "加载中",
				});
				const params = {
					orderId: val,
				};
				// let setShareOrder = await store.dispatch("SetShareOrder", { orderId: val });
				// this.luckNum = setShareOrder.data?.luckNum;
				// this.shareId = setShareOrder.data?.id;
				let successFuc = async res => {
					this.orderDetail = res.data.orderInfo;
					this.orderDetail.users = res.data.users;
					this.orderDetail.others = res.data.users.slice(1, res.data.users.length);
					let getPdId = await store.dispatch("SelPdRecord", { pdId: this.orderDetail.pdId });
					this.getPdId = getPdId?.data || {};
					this.createId = getPdId?.data?.createId;
					let format = this.orderDetail.expireTime.replace(/-/g, "/");
					this.time = parseInt((new Date(format).getTime() - new Date().getTime()) / 1000);
					let str = this.orderDetail.pic.replace("https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/", "").replace("https://oss.dianddian.cn/", "");
					let baseStr = BASE64().encoder(str + "?x-oss-process=image/resize,m_fill,h_67,w_74");
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
			jumpPay() {
				let payType = this.orderDetail.actualPayment == 0 ? 4 : 3;
				uni.redirectTo({
					url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${this.orderDetail.orderId}&payType=${payType}&pdType=${this.orderDetail.pdType}`,
				});
			},
			async fixedPosition() {
				let that = this;
				let rider = await store.dispatch("GetLocation", { orderId: this.orderId || 0 });
				const inx = this.markers.findIndex(item => item.id == 2);
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
			jumpMember() {
				uni.navigateTo({
					url: "/pagesD/membershipCard/membershipCard",
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
			cancelContact() {
				this.getOrderDetail(this.orderId);
			},
			cancelOrder(type) {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				let successFuc = async res => {
					this.getPdId = res?.data || {};
					switch (type) {
						case 0:
							if (res.data.status == 1 || res.data.status == -1) {
								this.alertConcel = "无法取消订单";
								this.contactMol = true;
								break;
							}
							this.cancelMask = true;
							break;
						case 2:
							if (res.data.status !== 0) {
								this.alertConcel = "无法申请退款";
								this.contactMol = true;
								break;
							}
							this.cancelMask = true;
							break;
						case 1:
							if (res.data.status == 1 || res.data.status == -1) {
								this.alertConcel = "无法完成支付";
								this.contactMol = true;
								break;
							}
							this.jumpPay();
							break;
						default:
							break;
					}
					// 拼餐活动状态(-1,失败,0,进行中,1.已完成,2.待支付/已选购)
				};
				AjaxApi("SelPdRecord", { pdId: this.orderDetail.pdId }, successFuc);
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
			orderPackageFee() {
				let val = new Decimal(this.orderDetail.pdPackageFee ?? 0).add(new Decimal(this.orderDetail.packageFee ?? 0));
				return val > 0 ? val : 0;
			},
			RiderOrders: function () {
				return (
					Boolean(this.orderDetail.status == 3 || this.orderDetail.status == 4 || this.orderDetail.status == 5) &&
					Boolean(this.orderDetail.orderType == 0) &&
					Boolean(this.orderDetail.refundStatus !== 3) &&
					Boolean(this.createId == this.orderDetail.creatorId && (this.getPdId?.status == 2 || this.getPdId?.status == 1))
				);
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
		/deep/ .slot-content {
			text-align: center;
			padding: 60rpx 0;
			image {
				width: 346rpx;
				height: 250rpx;
			}
			> view {
				&:first-of-type {
					font-weight: 400;
					font-size: 36rpx;
					line-height: 50rpx;
					color: #333333;
				}
				&:nth-of-type(2) {
					font-weight: 400;
					font-size: 28rpx;
					line-height: 60rpx;
					color: #999999;
				}
			}
		}
		.confirm-button {
			height: 100%;
			line-height: 100rpx;
			font-size: 32rpx;
			border: 0;
			padding: 0;
		}
		.map-box {
			height: 520rpx;
			width: 100%;
			position: absolute;
			top: 0;
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
		.container {
			position: absolute;
			top: -118rpx;
			&.hasmap {
				top: 262rpx;
			}
			width: 100%;
			padding: 0 24rpx;
			padding-bottom: 200rpx;
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
			.goods-my {
				background: #ffffff;
				border-radius: 8px;
				margin-bottom: 20rpx;
				.goods-top-h {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 104rpx;
					padding: 0 24rpx;
					border-bottom: 2rpx solid #f1f1f4;
					.top-h-l {
						display: flex;
						height: 104rpx;
						display: flex;
						align-items: center;
						> view {
							&:nth-child(1) {
								font-size: 32rpx;
								font-weight: 500;
								color: #1c1c1d;
								margin-right: 24rpx;
							}
							&:nth-child(2) {
								font-size: 28rpx;
								font-weight: 500;
								color: #fe6b00;
							}
						}
					}
					.modify-btn {
						width: 156rpx;
						line-height: 56rpx;
						border-radius: 28rpx;
						border: 2rpx solid #f1f1f4;
						font-size: 24rpx;
						font-weight: 500;
						color: #1c1c1d;
						text-align: center;
					}
				}
				.goods-top-c {
					padding: 30rpx 24rpx 0rpx 24rpx;
					.goods-order {
						padding-bottom: 30rpx;
						.goods-box {
							.goods-item {
								margin-top: 30rpx;
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
						}
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
							margin-top: 30rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							height: 40rpx;
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
					.order-bot {
						border-top: 2rpx solid #f1f1f4;
						height: 116rpx;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						.right {
							flex: 1;
							height: 68rpx;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							.price-box {
								line-height: 56rpx;
								margin-right: 20rpx;
								vertical-align: bottom;
								> text {
									font-size: 24rpx;
									&:nth-child(1) {
										font-weight: 400;
										color: #1c1c1d;
										margin-right: 8rpx;
									}
									&:nth-child(2) {
										font-weight: 500;
										color: #1e1f21;
									}
									&:nth-child(3) {
										font-size: 40rpx;
										font-weight: 500;
										color: #1e1f21;
									}
								}
							}
						}
					}
				}
			}
			.partner-box {
				background: #fff;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				.partner-top {
					line-height: 104rpx;
					padding: 0 24rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #1c1c1d;
				}
				.partner-goods {
					.partner-item {
						border-top: 2rpx solid #f1f1f4;
						display: flex;
						padding: 20rpx 24rpx;
						.partner-img {
							width: 56rpx;
							height: 56rpx;
							border-radius: 6rpx;
							margin-right: 20rpx;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.partner-info {
							flex: 1;
							width: 0;
							.info-h {
								height: 56rpx;
								margin-bottom: 20rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.left {
									display: flex;
									height: 56rpx;
									justify-content: space-between;
									align-items: center;
									.partner-name {
										font-size: 32rpx;
										font-weight: 500;
										color: #1c1c1d;
										margin-right: 10rpx;
									}
									text {
										padding: 0 6rpx;
										line-height: 32rpx;
										font-size: 22rpx;
										border-radius: 4rpx;
										font-weight: 400;
									}
								}
							}
							.goods-p {
								border-top: 2rpx solid #f1f1f4;
								.goods-item {
									margin-top: 20rpx;
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
