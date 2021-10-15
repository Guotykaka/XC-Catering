<template>
	<view class="container">
		<u-navbar :back-icon-color="backColor" :is-back="true" title=" " :border-bottom="false" :background="backgroundImg"> </u-navbar>
		<view class="slot-wrap"> </view>
		<u-modal v-model="refoundMask" :content="refoundContent" :show-title="false" :show-cancel-button="true" confirm-color="#FE6B00" :content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }" width="540" @confirm="refoundFuc"></u-modal>
		<!-- <movable-area class="share-btn" v-if="(orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5 || orderDetail.status == 8) && getTimeOut() && !orderDetail.state">
			<movable-view :x="300" :y="100" direction="all"> <button open-type="share"></button></movable-view>
		</movable-area> -->
		<view class="top-box">
			<view class="top-text" v-if="orderDetail.refundStatus == 3">
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
						: orderDetail.status == 7
						? "退款完成！"
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
			<view class="center">
				<view class="info-detali-box">
					<view class="time-box" v-if="orderDetail.status == 0">
						<text class="iconfont iconshijian"></text>
						<u-count-down class="count-down-demo" :timestamp="time" font-size="40" color="rgba(0,0,0,1)" :showDays="false" :show-hours="false" @end="timeEnd" ref="uCountDown" bg-color="rgb(251, 251, 251)"></u-count-down>
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
							? "退款完成！"
							: orderDetail.status == 6
							? "订单退款中！"
							: orderDetail.status == 4 && orderDetail.orderType == 0
							? "商家已备好餐，待配送！"
							: "商家已备好餐，请及时到店用餐！"
					}}</view>
					<view class="time-info" v-if="orderDetail.status == 7">退款金额已自动原路返还，银行系统可能会有延迟，请注意查看银行信息！</view>
					<view class="operate-btn-box">
						<view class="operate-btn-item" v-if="Boolean(orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 3) && !recordDetail.singleShop" @tap="contactMerchant">
							<u-icon name="phone" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系商家</view>
						</view>
						<button open-type="contact" class="operate-btn-item" plain="true" v-else>
							<u-icon name="server-man" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">联系客服</view>
						</button>
						<view class="operate-btn-item" v-if="Boolean(orderDetail.status == 0 || orderDetail.status == 3)" @tap="cancelOrder">
							<u-icon name="close-circle" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">{{ orderDetail.status == 0 ? "取消订单" : "申请退款" }}</view>
						</view>
						<button open-type="share" class="operate-btn-item" plain="true" v-if="(orderDetail.status == 3 || orderDetail.status == 8) && getTimeOut() && !orderDetail.state">
							<u-icon name="red-packet" color="#000" size="36" class="u-m-t-10"></u-icon>
							<view class="btn-text">分享领红包</view>
						</button>
						<cell style="width: 25%" :url="rechargeUrl" contactText="加入群聊" iconUrl="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/qiyeweixin.png"></cell>
					</view>
				</view>
				<view :class="[{ pad: showCode }, 'info-code']" v-if="Boolean(recordDetail.status == 0 || recordDetail.status == 1)">
					<view class="code-text">取货码</view>
					<u-image class="cavimg" width="400rpx" height="400rpx" :src="tempFilePath" v-if="showCode"></u-image>
					<view class="code-num" v-if="showCode">验证码 {{ recordDetail.code }}</view>
				</view>
				<view class="info-drop" @tap="showCode = !showCode" v-if="Boolean(recordDetail.status == 0 || recordDetail.status == 1)">
					{{ showCode ? "收起" : "展开" }}取货码
					<u-icon :name="showCode ? 'arrow-up-fill' : 'arrow-down-fill'" class="u-m-l-12" color="#FE6B00 " size="12"></u-icon>
				</view>
				<view class="goods-detail-box">
					<view class="tittle"> 餐品详情 </view>
					<view class="goods-list-box u-p-t-30">
						<view class="goods-box" v-for="(i, index) in orderDetail.details" :key="index">
							<u-image width="116rpx" height="116rpx" :border-radius="10" :src="i.pic"></u-image>
							<view class="goods-right u-m-l-20" style="min-width: 0">
								<view class="u-font-28 u-flex u-row-between">
									<text class="u-line-2">{{ i.goodsName }}</text>
									<text> <text class="u-font-10">￥</text>{{ i.subtotal }}</text>
								</view>
								<view class="u-font-24 u-line-2" style="color: #ababaf">{{ i.specification }}</view>
								<view class="u-font-24 u-line-2" style="color: #ababaf">× {{ i.quantity }}</view>
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
				<view class="goods-detail-box">
					<view class="tittle"> 取货信息 </view>
					<view class="u-m-t-30 shops">
						<u-image width="68rpx" height="68rpx" :src="recordDetail.shopLogo || shopImg" style="flex-shrink: 0"></u-image>
						<view class="u-font-26 u-m-l-24">
							<view class="u-flex u-row-between">
								<view>{{ recordDetail.shopName }}({{ recordDetail.storeName }})</view>
								<view class="u-font-24 shop-num" @tap.stop="turnShop()" v-if="recordDetail.singleShop">
									{{ recordDetail.shopCount }}家店可用
									<text class="iconfont icon-arrow-right u-m-l-12"></text>
								</view>
							</view>
							<view class="u-font-20" style="color: #ff0000" v-if="recordDetail.singleShop">离我最近</view>
						</view>
					</view>
					<view class="u-font-24 addr u-p-b-40" @tap="shopLoc">
						<view style="color: #636367">地址：</view>
						<view class="shop-name" style="color: #636367">
							<view>{{ recordDetail.address }}</view>
						</view>
						<view style="color: #fe6b00" class="iconfont icondingwei u-flex u-row-center"> </view>
					</view>
				</view>
				<view class="goods-detail-box">
					<view class="tittle"> 订单信息 </view>
					<view class="order-info u-p-t-30">
						<view class="delivery-info-left">
							<view class="u-m-b-30">订单编号</view>
							<view class="u-m-b-30">创建时间</view>
							<view class="u-m-b-30">支付时间</view>
							<view v-if="orderDetail.orderType !== 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)" class="u-m-b-30">取餐时间</view>
							<view class="u-m-b-30">支付方式</view>
							<view class="u-m-b-30" v-if="orderDetail.status == 7">退款时间</view>
							<view class="u-m-b-30" v-if="orderDetail.status == 7">退款方式</view>
						</view>
						<view class="delivery-info-right">
							<view class="u-m-b-30">{{ orderDetail.orderId }}{{ orderDetail.todayNum ? `#${orderDetail.todayNum}` : "" }}</view>
							<view class="u-m-b-30">{{ orderDetail.createTime ? orderDetail.createTime : "-" }}</view>
							<view class="u-m-b-30">{{ orderDetail.payTime ? orderDetail.payTime : "-" }}</view>
							<view v-if="orderDetail.orderType !== 0 && (orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 5)" class="u-m-b-30">
								{{ orderDetail.expectTime ? orderDetail.expectTime : "-" }}
							</view>
							<view class="u-m-b-30">
								{{ orderDetail.payType == 1 ? "微信支付" : orderDetail.payType == 2 ? "支付宝支付" : orderDetail.payType == 3 ? "余额" : orderDetail.payType == 5 ? "充值免单" : orderDetail.status == 0 ? "-" : orderDetail.status == 1 ? "-" : "现金" }}
							</view>
							<view class="u-m-b-30" v-if="orderDetail.status == 7">
								{{ orderDetail.refundConfirmTime || "" }}
							</view>
							<view class="u-m-b-30" v-if="orderDetail.status == 7"> 原路返还 </view>
						</view>
					</view>
				</view>
				<view class="remark-box" v-if="orderDetail.remark">{{ orderDetail.remark }}</view>
			</view>
		</view>
		<view class="bto-btn-box" v-if="orderDetail.status == 0">
			<view class="btn1" @tap="goPaycenter">立即支付</view>
		</view>
		<view class="bto-btn-box" v-else>
			<button open-type="share" class="btn2" plain="true" data-type="group" @tap="clickShare">
				<view>{{ orderPacket.msg }}</view>
			</button>
		</view>
		<canvas class="cav" canvas-id="myQrcode"></canvas>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	import { getUserLocation } from "@/utils";
	import store from "@/store";
	import { Decimal } from "decimal.js";
	import drawQrcode from "@/utils/qrcode";
	export default {
		name: "detail",
		data() {
			return {
				shopImg: getApp().globalData.shopImg,
				showCode: false,
				refoundMask: false,
				refoundContent: "您确定要申请退款吗？",
				rechargeUrl: "",
				rechargeUrl: "",
				tempFilePath: "",
				orderPacket: {},
				backColor: "#ffffff",
				backgroundImg: {
					background: "transparent",
				},
				luckNum: 0,
				shareId: 0,
				orderId: null,
				discountedPrice: 0,
				now: new Date().getTime(),
				cancelMask: false,
				time: null,
				recordDetail: {
					code: 0,
					shopCount: 0,
					singleShop: 0,
				},
				orderDetail: {
					details: [],
					storeName: "门店",
					shopName: "店铺",
					orderId: 102584,
					todayNum: 1,
					recipientName: "",
					recipientPhone: "",
					productAmount: 0,
					packageFee: 0.0,
					shippingFee: 0.0,
					redPackageFee: 0,
					shopRedPackageFee: 0,
					reduceFee: 0,
					actualPayment: 3.0,
					payTime: "",
					shopId: 388,
					orderType: 0,
					deliveryWay: 0,
					location: "",
					status: null,
					payType: 3,
					expireTime: "",
					expectTime: "",
					remark: "",
					createTime: "",
					isEvaluate: 0,
					shopPhone: "",
					pic: "",
				},
				options: {
					orderId: 0,
					recordId: 0,
				},
			};
		},
		onPageScroll(e) {
			this.backgroundImg.background = e.scrollTop < 50 ? "transparent" : "#ffffff";
			this.backColor = e.scrollTop < 50 ? "#ffffff" : "#000000";
		},
		onLoad(option) {
			this.options = option;
		},
		onShow() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let fuc = async () => {
				this.cancelMask = false;
				this.getOrderDetail(this.options);
				let PACKET = await store.dispatch("GetOrdersRedPacket", {}); //分享好友下单红包价格
				this.orderPacket = PACKET.data ?? {};
			};
			getUserLocation(fuc);
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
			getTimeOut() {
				if (!this.orderDetail.payTime || !this.shareId) {
					return false;
				}
				return this.now - new Date(this.orderDetail.payTime.replace(/-/g, "/")).getTime() < 6 * 24 * 60 * 60 * 1000;
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
						this.getOrderDetail(this.options);
					}
				};
				AjaxApi("RefundCancel", params, successFuc);
			},
			goPaycenter() {
				uni.showLoading({
					title: "跳转中",
					mask: true,
				});
				uni.navigateTo({
					url: `/pagesJie/paycenter/paycenter?orderId=${this.orderDetail.orderId}`,
				});
			},
			contactMerchant() {
				//联系商家
				uni.makePhoneCall({
					phoneNumber: this.orderDetail.shopPhone, //仅为示例
				});
			},
			async getOrderDetail(it) {
				uni.showLoading({
					title: "加载中",
				});
				let { longitude, latitude } = getApp().globalData.location;
				const params = {
					recordId: it.recordId,
					userLatitude: latitude,
					userLongitude: longitude,
				};
				let setShareOrder = await store.dispatch("SetShareOrder", { orderId: it.orderId });
				this.luckNum = setShareOrder.data?.luckNum;
				this.shareId = setShareOrder.data?.id;
				let successFuc = async res => {
					this.orderDetail = res.data.orderDetail;
					this.recordDetail = res.data;
					this.showCode = true;
					// <!-- (-1待付款,0待核销, 1已核销, 2已退款,3已取消) -->
					if (Boolean(this.recordDetail.status == 0 || this.recordDetail.status == 1)) {
						const that = this;
						setTimeout(() => {
							drawQrcode({
								width: (400 / 750) * uni.getSystemInfoSync().windowWidth,
								height: (400 / 750) * uni.getSystemInfoSync().windowWidth,
								foreground: "#333333",
								canvasId: "myQrcode",
								text: this.recordDetail.code,
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
					}
					this.orderDetail.details = res.data.orderDetail.details;
					let format = this.orderDetail.expireTime.replace(/-/g, "/");
					this.time = parseInt((new Date(format).getTime() - new Date().getTime()) / 1000);
					this.discountedPrice = new Decimal(this.orderDetail?.shopRedPackageFee ?? 0).add(new Decimal(this.orderDetail?.redPackageFee ?? 0)).add(new Decimal(this.orderDetail?.reduceFee ?? 0));
					let url = await store.dispatch("RechargeUrl", {});
					this.rechargeUrl = url.data;
				};
				AjaxApi("ChainsRecord", params, successFuc);
			},
			timeEnd() {
				uni.reLaunch({
					url: `/pagesJie/chains/chains`,
				});
			},
			shopLoc() {
				const address = this.recordDetail.address;
				const name = this.recordDetail.shopName;
				const latitude = this.recordDetail.location.split(",")[1] * 1;
				const longitude = this.recordDetail.location.split(",")[0] * 1;
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
			cancelOrder() {
				this.refoundMask = true;
				this.refoundContent = `${this.orderDetail.status == 0 ? "您确定要取消订单吗？" : "您确定要申请退款吗？"}`;
			},
			turnShop() {
				uni.navigateTo({
					url: `/pagesJie/shopList/shopList?Id=${this.recordDetail.jlId}`,
				});
			},
			refoundFuc() {
				let successFuc = () => {
					getCurrentPages().pop().onShow();
				};
				let api = `${this.orderDetail.status == 0 ? "ChainsCancel" : "ChainsRefound"}`;
				AjaxApi(api, { recordId: this.options.recordId }, successFuc);
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
		color: #1c1c1d;
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
				.info-code {
					border-top-left-radius: 16rpx;
					border-top-right-radius: 16rpx;
					background: white;
					position: relative;
					padding: 0 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					&.pad {
						padding-bottom: 56rpx;
						.code-text {
							border-bottom: 1rpx solid #e2e2e2;
						}
					}
					.code-text {
						width: 100%;
						font-size: 28rpx;
						font-weight: bold;
						line-height: 40rpx;
						padding: 30rpx 0;
					}
					.cavimg {
						background: white;
						margin: 56rpx auto 20rpx auto;
					}
					.code-num {
						margin-top: 12rpx;
						font-size: 32rpx;
						font-weight: bold;
						line-height: 44rpx;
						color: #333333;
					}
				}
				.info-drop {
					border-bottom-left-radius: 16rpx;
					border-bottom-right-radius: 16rpx;
					background: white;
					width: 100%;
					padding: 14rpx;
					margin-bottom: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fe6b00;
					position: relative;
					&:after {
						content: "";
						background: #e2e2e2;
						position: absolute;
						top: 0;
						left: 50%;
						transform: translate(-50%, 0);
						height: 2rpx;
						width: calc(100% - 40rpx);
					}
				}
				.goods-detail-box {
					width: 100%;
					padding: 0rpx 24rpx;
					background: white;
					border-radius: 8rpx;
					margin-bottom: 20rpx;
					.tittle {
						padding: 30rpx 0rpx;
						font-size: 32rpx;
						font-weight: bold;
						border-bottom: 2rpx solid #f1f1f4;
					}
					.addr {
						margin-top: 30rpx;
						display: flex;
						min-height: 50rpx;
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
						.shop-name {
							color: #666666;
						}
					}
					.shops {
						display: flex;
						> view {
							width: 100%;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.iconfont {
								color: #999999;
								vertical-align: middle;
								font-size: 18rpx;
							}
						}
					}
					.goods-list-box {
						border-bottom: 2rpx solid #f1f1f4;
						.goods-box {
							display: flex;
							justify-content: flex-start;
							padding-bottom: 24rpx;
							font-size: 28rpx;
							font-weight: bold;
							color: #333333;
							.goods-right {
								flex: 1;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
							}
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
					.order-info {
						display: flex;
						justify-content: space-between;
						font-size: 28rpx;
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
				}
				.address-detail-box {
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
		.cav {
			position: absolute;
			top: -10000rpx;
			width: 400rpx;
			height: 400rpx;
			background: white;
		}
	}
</style>
