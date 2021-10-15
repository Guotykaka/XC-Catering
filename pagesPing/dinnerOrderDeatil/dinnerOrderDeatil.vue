<template>
	<view class="wrapper">
		<view class="spell-info">
			发起人统一收货，请客结束倒计时
			<u-count-down :timestamp="timeStamp" font-size="24" bg-color="#FFF3C8" separator-color="#ff3b3b" color="#ff3b3b" :show-hours="false"></u-count-down>
		</view>
		<u-modal
			v-model="confirmMol"
			:content="molContent"
			:show-title="false"
			:show-cancel-button="true"
			confirm-color="#1C1C1D"
			cancel-color="#FE6B00"
			confirm-text="去结算"
			cancel-text="再等等"
			:content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }"
			width="540"
			@confirm="confirmOrder"
		></u-modal>
		<u-modal v-model="disJoinMol" :content="disJoinContent" @confirm="doDisJion" :show-cancel-button="true" confirm-color="#FE6B00"></u-modal>
		<view class="spell-box">
			<view class="address-box" @tap="jumpAddressList">
				<view class="address-left">
					<view>{{ groupMsg.address }}</view>
					<view>
						<text class="u-m-r-20">{{ groupMsg.name }}</text>
						<text>{{ groupMsg.phone }}</text>
					</view>
				</view>
				<view v-if="groupMsg.create">
					<u-icon name="arrow-right" color="#D2D3D3" size="20"></u-icon>
				</view>
			</view>
			<view class="time-box">
				<view class="time-text">预计送达</view>
				<view class="time-right">
					<text>{{ groupMsg.expectTime || "尽快送达" }}</text>
					<view>
						<u-icon name="arrow-right" color="#D2D3D3" size="20"></u-icon>
					</view>
				</view>
			</view>
			<view class="spell-status">
				<view class="status-top">
					<view class="top-left">
						<view>{{ groupMsg.name }}发起请客</view>
						<!-- <view>
							<text>订单提交倒计时</text>
							<u-count-down :timestamp="timeStamp" font-size="24" bg-color="#ffffff" separator-color="#ff3b3b" color="#ff3b3b"></u-count-down>
						</view> -->
					</view>
					<button class="dinner-btn" open-type="share" plain="true">邀请好友</button>
				</view>
				<view class="status-bot">
					<view class="user-image">
						<image :src="`${it || '../../static/img/deliveryPic.png'}`" v-for="(it, i) in groupMsg.urls" :key="i" mode="aspectFill"></image>
					</view>
					<view class="u-m-l-20">{{ groupMsg.count }}人正在选购中</view>
				</view>
			</view>
		</view>
		<view class="partner-box">
			<view class="partner-top">
				<view>餐品详情</view>
				<view @tap="refreshFuc">
					<u-icon name="reload" color="#FE6B00" size="28" :class="[{ rotate: refresh }, 'animated']"></u-icon>
					刷新
				</view>
			</view>
			<view class="partner-goods">
				<view class="partner-item" v-for="(it, i) in groupMsg.users" :key="i">
					<view class="partner-img">
						<image :src="`${it.url || '../../static/img/deliveryPic.png'}`" mode="aspectFill"></image>
					</view>
					<view class="partner-info">
						<view class="info-h">
							<view class="left u-line-1">
								<view class="partner-name">{{ it.name }}</view>
								<text class="orange-style" v-if="!i">我</text>
								<text class="orange" v-else-if="it.create">发起人</text>
								<text class="red-style" v-if="!it.create && i && it.status == 0">正在选购</text>
								<text class="red-style" v-else-if="!it.create && i && it.status == 2">已选购</text>
							</view>
							<view class="btn-box" v-if="!i">
								<view class="abort-btn" @tap="disjoin(0)">退出请客</view>
								<view class="btn-modify" @tap="backFuc">修改餐品</view>
							</view>
							<view class="del-btn" @tap="disjoin(it.userId)" v-if="i && groupMsg.create">删除</view>
						</view>
						<view class="goods-p">
							<view class="goods-item" v-for="(it, i) in it.shoppingCarts" :key="i">
								<view class="goods-img">
									<image :src="`${it.coverPic || shopImg}`" mode="aspectFill"></image>
								</view>
								<view class="goods-con">
									<view class="goods-top">
										<view>{{ it.goodsName }}</view>
										<view>
											<text style="font-size: 20rpx">￥</text>
											<text>{{ it.wmDiscountPrice }}</text>
										</view>
									</view>
									<view class="goods-descript">
										<text>{{ it.specification }}</text>
										<view class="leval" v-if="it.discount">{{ it.customerName + `价¥${it.wmCustomerPrice}` }}</view>
									</view>
									<view class="goods-descript" style="margin-bottom: 0">x {{ it.number }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="purchase u-m-l-24 u-m-r-24" v-if="groupMsg.addBuyList.length">
				<image class="img-a" src="https://oss.dianddian.cn/v2/purchase/addpurchase.png" mode="widthFix"></image>
				<view class="good u-m-b-20" v-for="(it, i) in groupMsg.addBuyList" :key="i">
					<image class="img-b u-m-r-10" :src="`${it.coverPic || shopImg}`" mode="aspectFill"></image>
					<view class="goods-con">
						<view class="u-font-24">{{ it.goodsName }}</view>
						<view>
							<text style="font-size: 16rpx">￥</text>
							<text class="u-font-20">{{ it.wmDiscountPrice }}</text>
						</view>
					</view>
					<view style="margin-left: auto" class="u-flex u-flex-nowrap">
						<image
							v-if="!it.number"
							class="img-c"
							src="https://oss.dianddian.cn/v2/purchase/minus_none.png"
							mode="aspectFill"
						></image>
						<image
							v-else
							class="img-c"
							src="https://oss.dianddian.cn/v2/purchase/minus.png"
							mode="aspectFill"
							@tap.stop="addPurchase(it, false)"
						></image>
						<text class="u-font-20 u-m-l-20 u-m-r-20">{{ it.number }}</text>
						<image
							class="img-c"
							src="https://oss.dianddian.cn/v2/purchase/add.png"
							mode="aspectFill"
							@tap.stop="addPurchase(it, true)"
						></image>
					</view>
				</view>
			</view>
		</view>
		<view class="instal-box">
			<view class="info-box">
				<view>餐盒费</view>
				<view class="price-right">
					<text>￥</text>
					<text>{{ groupMsg.totalPackageFee }}</text>
				</view>
			</view>
			<view class="info-box">
				<view>包装费</view>
				<view class="price-right">
					<text>￥</text>
					<text>{{ groupMsg.totalPdPackageFee }}</text>
				</view>
			</view>
			<view class="info-box">
				<view>配送费</view>
				<view class="price-right">
					<view class="discount-free" v-if="groupMsg.shippingFeeRecordId">尊享免配送</view>
					<text v-if="!groupMsg.shippingFeeRecordId">￥</text>
					<text v-if="!groupMsg.shippingFeeRecordId">{{ groupMsg.shippingFee || 0 }}</text>
				</view>
			</view>
			<view class="member u-flex" v-if="!groupMsg.shippingFeeRecordId && groupMsg.shippingFee" @tap="jumpMember">
				<view>购买尊享卡免配送></view>
				<view>¥6</view>
			</view>
			<view class="info-box" v-if="groupMsg.create">
				<view><view class="block-reduce">￥</view>红包</view>
				<view class="u-flex u-row-right u-col-center" v-if="redPacket == 0" @tap="chooseGroupCoupon">
					<text style="color: #1c1c1d" class="u-font-14;">选择优惠券</text>
					<u-icon name="arrow-right" color="#1c1c1d" size="28"></u-icon>
				</view>
				<view class="price-right" @tap="chooseGroupCoupon" style="color: #ff4d4f" v-else>
					-
					<text>￥</text>
					<text>{{ redPacket }}</text>
					<u-icon name="arrow-right" color="#1c1c1d" size="28"></u-icon>
				</view>
			</view>
			<view class="info-box" v-if="groupMsg.reduceFee">
				<view><view class="block-reduce">减</view>商户满减</view>
				<view class="price-right" @tap="chooseGroupCoupon" style="color: #ff4d4f">
					-
					<text>￥</text>
					<text>{{ groupMsg.reduceFee }}</text>
				</view>
			</view>
		</view>
		<view class="total-price">
			<text class="u-m-l-24">
				已优惠
				<text style="color: #ff3b3b">¥{{ discountedPrice }}</text>
			</text>
			<text class="u-m-r-24">
				<text class="u-font-24" style="font-weight: 400">合计</text>
				<text class="u-font-24 u-m-l-6">¥</text>
				<text class="u-font-40">{{ orderPrice }}</text>
			</text>
		</view>
		<view class="order-remark" v-if="groupMsg.create">
			<textarea
				placeholder="请输入备注"
				placeholder-style="font-size:28rpx;color:#ABABAF"
				maxlength="50"
				@input="inputFuc"
				:value="remark"
				cursor-spacing="200"
				height="240"
			></textarea>
		</view>
		<view class="line-block"></view>
		<view class="bubble-box" v-if="!confirmMol && groupMsg.create && guideStu">好友选好餐品后提交订单</view>
		<cover-view class="bot-box" v-if="!confirmMol && !disJoinMol">
			<cover-view class="bot-info">
				<cover-view class="u-font-24 cover">
					<cover-view class="u-font-24 cover1">合计 ¥ </cover-view>
					<cover-view class="u-font-24 cover1"> 已优惠¥{{ discountedPrice }} </cover-view>
				</cover-view>
				<cover-view style="min-width: 200rpx" class="cover u-m-l-80">{{ orderPrice }}</cover-view>
			</cover-view>
			<cover-view class="cover-btn" v-if="groupMsg.create">
				<button class="cover-btn-share" open-type="share" plain="true">邀请好友\n新人得8元</button>
				<cover-view :class="[{ cant: !groupMsg.settlement }, 'sure-btn']" @tap="confirmFuc">
					{{ !groupMsg.settlement && groupMsg.qsj ? `还差¥${CALC}起送　` : "去结算" }}
				</cover-view>
			</cover-view>
			<cover-view class="sure-text" v-if="!groupMsg.create">等待发起人支付</cover-view>
		</cover-view>
	</view>
</template>

<script>
import store from "@/store";
import { Decimal } from "decimal.js";
import { getObjType } from "@/utils";
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			guideStu: false,
			shopImg: getApp().globalData.shopImg,
			ifChooseCoupon: false,
			refresh: false,
			remark: "",
			confirmMol: false,
			redPacketIds: 0,
			redPacket: 0,
			molContent: "还有小伙伴正在选购，是否立即结算支付？",
			groupMsg: {
				shippingFee: 0,
				shippingFeeRecordId: 0,
				totalPrice: 0,
				totalPackageFee: 0,
				totalPdPackageFee: 0,
				users: [
					{
						userId: 0,
						url: "",
						name: "",
						packageFee: 0,
						pdPackageFee: 0,
						shoppingFee: 0,
						status: 0,
						subPrice: 0,
						create: true,
						shoppingCarts: [],
						orderDetails: {},
					},
				],
				aaUser: [],
				msg: "",
				relationPerson: "",
				phone: "",
				urls: [],
				name: "",
				count: 0,
				id: 0,
				createId: 0,
				storeId: 0,
				type: 1,
				createTime: "",
				status: 0,
				create: true,
				address: "",
				addressId: 0,
				settlement: false,
			},
			disJoinMol: false,
			disJoinContent: "",
			timeStamp: 0,
			pageType: 0,
			disUserId: 0,
		};
	},

	onShareAppMessage: function (res) {
		const that = this;
		// 	【请客】XXX请你吃饭了
		// 【拼单】XXX邀请你来拼单了
		// 文案调整了下，昵称有就显示，没有就不显示
		if (res.from === "button") {
			const pdId = that.groupMsg.id;
			const pdName = getApp().globalData.UserInfo?.wxNickName ?? "";
			// 来自页面内转发按钮
			return {
				title: `${that.groupMsg.type == 1 ? `${pdName}请你吃饭了！` : `${pdName}邀请你来拼单了！`}`,
				imageUrl: "https://oss.dianddian.cn/share/pin_dan_share.png",
				path: `/pages/spellOrder/spellOrder?pdId=${pdId}`,
			};
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},
	onLoad(query) {
		this.pdId = !query?.id ? this.pdId : query.id;
		this.pageType = !query?.type ? this.pageType : query.type * 1;
	},
	onHide() {},
	onShow() {
		if (this.ifChooseCoupon) {
			this.ifChooseCoupon = false;
			return;
		}
		// uni.showLoading({
		// 	title: "加载中",
		// 	mask: true,
		// });
		let params = {
			pdId: this.pdId,
		};
		let successFuc = async res => {
			let pdGuide = await store.dispatch("GetPdGuide", {});
			this.guideStu = Boolean(pdGuide?.data);
			this.groupMsg = res.data;
			this.redPacketIds = res.data.redPacketRecordId;
			this.redPacket = res.data.redPacketAmount * 1;
			this.socketFuc();
			this.timeStamp = (1200000 - (Date.parse(new Date()) - Date.parse(new Date(this.groupMsg.createTime.replace(/-/g, "/"))))) / 1000;
		};
		let elseFuc = () => {
			getApp().globalData.previewImage = false;
			this.backFuc();
		};
		let api = this.pageType ? "SettleMent" : "GroupDetail";
		AjaxApi(api, params, successFuc, elseFuc);
	},
	methods: {
		jumpMember() {
			uni.navigateTo({
				url: "/pagesD/membershipCard/membershipCard",
			});
		},
		jumpAddressList() {
			if (!this.groupMsg.create) return;
			//选择收货地址
			uni.navigateTo({
				url: `/pagesB/addressList/addressList`,
			});
		},
		socketFuc() {
			if (this.groupMsg.id) {
				//打开
				getApp().globalData.conectSocket = true;
				getApp().linkWebsocket(`${this.groupMsg.id}/${getApp().globalData.UserInfo.userId}`);
				getApp().initSocket();
			} else {
				//关闭
				getApp().globalData.conectSocket = false;
				getApp().linkWebsocket();
			}
			getApp()
				.getWebSocket()
				.onReceivedMsg(result => {
					getApp().globalData.previewImage = false;
					console.log("收到服务器内容2：" + result.data);
					this.socketFresh();
					// 要进行的操作
				});
		},
		async socketFresh() {
			let groups = await store.dispatch("GroupDetail", { pdId: this.pdId });
			if (groups.code == 0) {
				this.groupMsg = groups.data;
				this.redPacketIds = groups.data.redPacketRecordId;
				this.redPacket = groups.data.redPacketAmount * 1;
				this.timeStamp = (1200000 - (Date.parse(new Date()) - Date.parse(new Date(this.groupMsg.createTime.replace(/-/g, "/"))))) / 1000;
			} else {
				this.backFuc();
			}
		},
		inputFuc(e) {
			this.remark = e.detail.value;
		},
		chooseGroupCoupon() {
			this.ifChooseCoupon = true;
			uni.navigateTo({
				url: '/pagesPing/chooseGroupCoupon/chooseGroupCoupon',
			});
		},
		confirmFuc() {
			if (!this.groupMsg.settlement) return;
			const inx = this.groupMsg.users.findIndex(element => element.status === 0);
			if (inx !== -1) {
				this.confirmMol = true;
				return;
			}
			this.confirmOrder();
		},
		confirmOrder() {
			getApp().globalData.previewImage = false;
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let successFuc = res => {
				const payType = this.orderPrice == 0 ? 4 : 3;
				uni.redirectTo({
					url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${res.data.orderId}&payType=${payType}&pdType=${res.data.pdType}`,
				});
			};
			let elseFuc = () => {
				uni.hideNavigationBarLoading();
			};
			AjaxApi(
				"SaveGroupOrder",
				{
					pdId: this.groupMsg.id,
					shippingFeeRecordId: this.groupMsg.shippingFeeRecordId,
					redPacketIds: this.redPacketIds ? [this.redPacketIds] : [],
					remark: this.remark,
					reservedPhone: getApp().globalData.UserInfo.phone ?? "",
				},
				successFuc,
				elseFuc
			);
		},
		refreshFuc() {
			if (this.refresh) return;
			this.refresh = true;
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			getCurrentPages().pop().onShow();
			setTimeout(() => {
				this.refresh = false;
			}, 1000);
		},
		backFuc() {
			uni.navigateBack();
		},
		addPurchase(good, isAdd) {
			let params = {
				...good,
				isAdd: isAdd,
			};
			let successFuc = () => {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				getCurrentPages().pop().onShow();
			};
			let elseFuc = () => {
				getCurrentPages().pop().onShow();
			};
			AjaxApi("PostPdAdd", params, successFuc, elseFuc);
		},
		disjoin(userId) {
			this.disUserId = !userId ? getApp().globalData.UserInfo.userId : userId;
			this.disJoinContent = !userId ? "是否确定退出请客?" : "是否确定删除?";
			this.disJoinMol = true;
		},
		doDisJion() {
			let params = {
				pdId: this.groupMsg.id,
				userId: this.disUserId,
			};
			let successFuc = res => {
				if (this.disJoinContent == "是否确定退出请客?") {
					getApp().globalData.previewImage = false;
					this.backFuc();
				} else {
					let params = {
						pdId: this.pdId,
					};
					let successFuc = res => {
						getApp().globalData.previewImage = false;
						this.groupMsg = res.data;
						this.redPacketIds = res.data.redPacketRecordId;
						this.redPacket = res.data.redPacketAmount * 1;
						this.timeStamp = (1200000 - (Date.parse(new Date()) - Date.parse(new Date(this.groupMsg.createTime.replace(/-/g, "/"))))) / 1000;
					};
					let elseFuc = res => {
						getApp().globalData.previewImage = false;
						this.backFuc();
					};
					let api = this.pageType ? "SettleMent" : "GroupDetail";
					AjaxApi(api, params, successFuc, elseFuc);
				}
			};
			AjaxApi("CancelGroup", params, successFuc);
		},
	},
	computed: {
		CALC() {
			let val = new Decimal(this.groupMsg.qsj ?? 0)
				.sub(new Decimal(this.groupMsg.totalPdPackageFee ?? 0))
				.sub(new Decimal(this.groupMsg.totalPackageFee ?? 0))
				.sub(new Decimal(this.groupMsg.totalPrice ?? 0));
			return val > 0 ? val : 0;
		},
		orderPrice() {
			let val = new Decimal(this.groupMsg.totalPrice ?? 0)
				.add(new Decimal(this.groupMsg.totalPdPackageFee ?? 0))
				.add(new Decimal(this.groupMsg.totalPackageFee ?? 0))
				.sub(new Decimal(this.redPacket ?? 0))
				.sub(new Decimal(this.groupMsg.reduceFee ?? 0));
			return val > 0
				? val.add(new Decimal(this.groupMsg.shippingFeeRecordId ? 0 : this.groupMsg.shippingFee ?? 0))
				: this.groupMsg.shippingFeeRecordId
				? 0
				: this.groupMsg.shippingFee ?? 0;
		},
		orderPackageFee() {
			let val = new Decimal(this.groupMsg.totalPackageFee ?? 0).add(new Decimal(this.groupMsg.totalPdPackageFee ?? 0));
			return val > 0 ? val : 0;
		},
		discountedPrice() {
			let val = new Decimal(this.groupMsg.totalPrice ?? 0)
				.add(new Decimal(this.groupMsg.totalPdPackageFee ?? 0))
				.add(new Decimal(this.groupMsg.totalPackageFee ?? 0));
			let dis = new Decimal(this.redPacket ?? 0).add(new Decimal(this.groupMsg.reduceFee ?? 0));
			return val * 1 > dis * 1 ? dis : val;
		},
	},
};
</script>

<style lang="scss" scoped>
@import url("/static/animate.css");
@-webkit-keyframes rotate {
	0% {
		-webkit-transform-origin: center;
		transform-origin: center;
		opacity: 1;
	}
	to {
		-webkit-transform-origin: center;
		transform-origin: center;
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
		opacity: 1;
	}
}
@keyframes rotate {
	0% {
		-webkit-transform-origin: center;
		transform-origin: center;
		opacity: 1;
	}
	to {
		-webkit-transform-origin: center;
		transform-origin: center;
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
		opacity: 1;
	}
}
.rotate {
	-webkit-animation-name: rotate;
	animation-name: rotate;
}
.wrapper {
	background: #f6f6f7;
	padding: 86rpx 24rpx 100rpx 24rpx;
	min-height: 100vh;
	.bubble-box {
		width: 400rpx;
		height: 82rpx;
		border: 4rpx solid #fe6b00;
		border-radius: 100rpx;
		background: #fff;
		font-size: 28rpx;
		color: #fe6b00;
		line-height: 80rpx;
		text-align: center;
		position: relative;
		position: fixed;
		bottom: 138rpx;
		bottom: calc(138rpx + constant(safe-area-inset-bottom, 0));
		bottom: calc(138rpx + env(safe-area-inset-bottom, 0));
		right: 22rpx;
		&::before {
			content: "";
			width: 0;
			height: 0;
			border: 20rpx solid;
			position: absolute;
			bottom: -40rpx;
			right: 90rpx;
			border-color: #fe6b00 transparent transparent;
		}
		&::after {
			content: "";
			width: 0;
			height: 0;
			border: 20rpx solid;
			position: absolute;
			bottom: -36rpx;
			right: 90rpx;
			border-color: #fff transparent transparent;
		}
	}
	.spell-info {
		z-index: 99;
		width: 100vw;
		text-align: center;
		height: 66rpx;
		line-height: 66rpx;
		background: #fff3c8;
		color: #1c1c1d;
		font-size: 24rpx;
		position: fixed;
		left: 0;
		top: 0;
	}
	.spell-box {
		background: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		.address-box {
			width: 100%;
			padding: 30rpx 24rpx;
			display: flex;
			justify-content: space-between;
			background: #fff;
			border-radius: 16rpx;
			.address-left {
				flex: 1;
				> view {
					&:nth-child(1) {
						font-size: 32rpx;
						font-weight: 500;
						color: #000000;
						line-height: 44rpx;
					}
					&:nth-child(2) {
						font-size: 24rpx;
						font-weight: 400;
						color: #ababaf;
						line-height: 34rpx;
					}
				}
			}
		}
		.time-box {
			padding-left: 24rpx;
			margin-bottom: 30rpx;
			height: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			> view {
				font-size: 28rpx;
				font-weight: 500;
				color: #1c1c1d;
			}
			.time-right {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-right: 20rpx;
				text {
					color: #fe6b00;
					margin-right: 20rpx;
				}
			}
		}
		.spell-status {
			border-top: 2rpx solid #f1f1f4;
			padding: 30rpx 24rpx;
			.status-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 74rpx;
				.top-left {
					> view {
						&:nth-child(1) {
							font-size: 28rpx;
							font-weight: 500;
							color: #1c1c1d;
						}
						&:nth-child(2) {
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
						}
					}
				}
				.dinner-btn {
					width: 156rpx;
					line-height: 60rpx;
					color: #fff;
					font-size: 28rpx;
					font-weight: 500;
					background: #fe6b00;
					border-radius: 36rpx;
					text-align: center;
					border: 0;
					padding: 0;
					margin: 0;
					// height: 72rpx;
				}
			}
			.status-bot {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-top: 30rpx;
				.user-image {
					height: 48rpx;
					flex: 1;
					image {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						border: 2rpx solid #ffffff;
						&:first-child {
							margin-right: -8rpx;
						}
						&:not(:first-child) {
							margin: 0px -8rpx;
						}
					}
				}
				text {
					font-size: 14px;
					font-weight: 400;
					color: #1c1c1d;
					line-height: 20px;
				}
			}
		}
	}
	.partner-box {
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		.partner-top {
			line-height: 104rpx;
			padding: 0 24rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #1c1c1d;
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
						border-radius: 6rpx;
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
								margin-right: 12rpx;
							}
							.red-style {
								border: 2rpx solid #ff3b3b;
								color: #ff3b3b;
							}
							.green-style {
								color: #0ccb54;
								border: 2rpx solid #0ccb54;
							}
							.orange-style {
								color: #fe6b00;
								border: 2rpx solid #fe6b00;
							}
							.orange {
								color: #ffffff;
								background: #fe6b00;
								padding: 4rpx 6rpx;
							}
						}
						.del-btn {
							width: 100rpx;
							text-align: right;
							font-size: 28rpx;
							font-weight: 500;
							color: #ababaf;
						}
						.btn-box {
							display: flex;
							justify-content: flex-end;
							view {
								width: 156rpx;
								line-height: 56rpx;
								border-radius: 28rpx;
								border: 2rpx solid #f1f1f4;
								font-size: 24rpx;
								font-weight: 400;
								text-align: center;
							}
							.abort-btn {
								color: #ff3b3b;
								margin-right: 24rpx;
							}
							.btn-modify {
								color: #1c1c1d;
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
					}
				}
			}
		}
		.purchase {
			border-radius: 10rpx;
			border: 2rpx solid #fe6b00;
			.good {
				display: flex;
				margin: 0 20rpx;
				color: #1c1c1d;
				.goods-con {
					font-weight: bold;
				}
			}
			.img-a {
				left: -2rpx;
				top: -2rpx;
				position: relative;
				border-radius: 10rpx;
				width: 160rpx;
				height: auto;
			}
			.img-b {
				width: 68rpx;
				height: 68rpx;
				border-radius: 6rpx;
			}
			.img-c {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
	.instal-box {
		background: #fff;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		padding: 0rpx 24rpx 30rpx 24rpx;
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
			padding-top: 30rpx;
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
	.total-price {
		box-sizing: border-box;
		background: #fff;
		border-bottom-left-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		margin-bottom: 20rpx;
		color: #1c1c1d;
		font-size: 28rpx;
		font-weight: bold;
		border-top: 2rpx solid #f1f1f4;
		height: 116rpx;
		// line-height: 116rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.line-block {
		width: 100%;
		height: 100rpx;
	}
	.order-remark {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
	}
	.bot-box {
		width: 100%;
		box-sizing: border-box;
		position: fixed;
		padding: 12rpx 24rpx;
		bottom: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom, 0);
		padding-bottom: env(safe-area-inset-bottom, 0);
		left: 0;
		background: #fff;
		.bot-info {
			height: 106rpx;
			font-size: 40rpx;
			.cover {
				display: inline-block;
				line-height: 106rpx;
				&:first-of-type {
					color: #1c1c1d;
					// display: contents;
					display: inline-block;
					height: 100%;
					width: 100%;
					position: relative;
					.cover1 {
						display: inline-block;
						height: 38rpx;
						position: absolute;
						&:first-of-type {
							width: 100%;
							top: 14rpx;
						}
						&:nth-of-type(2) {
							color: #ababaf;
							width: 100%;
							bottom: 22rpx;
						}
					}
				}
				&:nth-of-type(2) {
					position: absolute;
					top: 6rpx;
					left: 24rpx;
					line-height: 56rpx;
					font-size: 40rpx;
					font-weight: 500;
					color: #1e1f21;
				}
			}
		}
		.cover-btn {
			position: absolute;
			top: 20rpx;
			right: 24rpx;
			display: inline-block;
			line-height: 76rpx;
			height: 76rpx;
			.cover-btn-share {
				// padding: 4rpx 16rpx 0 16rpx !important;
				vertical-align: top;
				display: inline-block;
				box-sizing: border-box;
				padding-top: 10rpx;
				border: 0;
				margin: 0;
				white-space: pre-wrap;
				width: 172rpx;
				height: 76rpx;
				background: #fff4ed;
				border-radius: 44rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #fe6b00;
				margin-right: 12rpx;
				text-align: center;
				&.cant {
					background: #999999;
				}
				/deep/ .wx-button-cover-view-wrapper {
					// padding: 4rpx 16rpx 0 16rpx !important;
					display: inline-block;
					width: 172rpx;
					height: 76rpx;
					text-align: center;
					line-height: 30rpx;
				}
			}
			.sure-btn {
				vertical-align: top;
				// padding: 0 16rpx;
				display: inline-block;
				text-align: center;
				min-width: 172rpx;
				height: 100%;
				line-height: 76rpx;
				background: #fe6b00;
				border-radius: 44rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #fff;
				&.cant {
					background: #999999;
				}
			}
		}
		.sure-text {
			position: absolute;
			top: 0;
			left: 50%;
			transform: translate(-50%, 0);
			display: inline-block;
			width: 224rpx;
			height: 106rpx;
			font-size: 32rpx;
			color: #ababaf;
			line-height: 106rpx;
		}
	}
	.discount-free {
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
}
</style>
