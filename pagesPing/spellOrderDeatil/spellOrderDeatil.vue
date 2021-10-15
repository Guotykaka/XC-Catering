<template>
	<view class="wrapper">
		<view class="spell-info">
			发起人统一收货(至少2人成团)，AA拼结束倒计时
			<u-count-down :timestamp="timeStamp" font-size="24" bg-color="#FFF3C8" separator-color="#ff3b3b" color="#ff3b3b" :show-hours="false"></u-count-down>
		</view>
		<u-modal
			title="温馨提示"
			:title-style="{
				color: '#1C1C1D',
				'font-weight': 'bold',
				'font-size': '36rpx',
			}"
			v-model="confirmMol"
			:content="molContent"
			:show-cancel-button="true"
			cancel-color="#1C1C1D"
			confirm-color="#FE6B00"
			confirm-text="继续支付"
			cancel-text="取消"
			:content-style="{ 'font-size': '28rpx', color: '#333333', 'line-height': '50rpx', 'text-align': 'center' }"
			width="540"
			@confirm="payFuc"
		></u-modal>
		<u-modal
			v-model="disJoinMol"
			:content="disJoinContent"
			:title="disTitle"
			@confirm="doDisJion"
			:show-cancel-button="true"
			confirm-color="#FE6B00"
		></u-modal>
		<view class="top-info-box">
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
		</view>
		<view class="spell-box">
			<view class="spell-status">
				<view class="status-top">
					<view>{{ groupMsg.name }}发起AA拼</view>
					<button open-type="share" plain="true">邀请好友</button>
				</view>
				<view class="status-bot">
					<view class="user-image">
						<image :src="`${it || '../../static/img/deliveryPic.png'}`" v-for="(it, i) in groupMsg.urls" :key="i" mode="aspectFill"></image>
					</view>
					<view class="u-m-l-20">{{ groupMsg.count }}人正在选购中</view>
				</view>
			</view>
		</view>
		<view class="goods-my">
			<view class="goods-top-h">
				<view class="top-h-l">
					<view>我的餐品</view>
					<view @tap="refreshFuc">
						<u-icon name="reload" color="#FE6B00" size="28" :class="[{ rotate: refresh }, 'animated']"></u-icon>
						刷新
					</view>
				</view>
				<view class="modify-btn" @tap="backFuc" v-if="Boolean(this.groupMsg.aaUser.status !== 1)">修改餐品</view>
			</view>
			<view class="goods-top-c">
				<view class="goods-order">
					<view class="goods-box" v-for="(item, index) in groupMsg.aaUser.shoppingCarts" :key="index">
						<view class="goods-item" :style="{ 'margin-top': `${index == 0 ? '0rpx' : '30rpx'}` }">
							<view class="goods-img">
								<image :src="`${item.coverPic || shopImg}`" mode="aspectFill"></image>
							</view>
							<view class="goods-con">
								<view class="goods-top">
									<view>{{ item.goodsName }}</view>
									<view>
										<text style="font-size: 20rpx">￥</text>
										<text>{{ item.wmDiscountPrice }}</text>
									</view>
								</view>
								<view class="goods-descript">
									<text>{{ item.specification }}</text>
									<view class="leval" v-if="item.discount">{{ item.customerName + `价¥${item.wmCustomerPrice}` }}</view>
								</view>
								<view class="goods-descript" style="margin-bottom: 0">x {{ item.number }}</view>
							</view>
						</view>
					</view>
					<view class="purchase u-m-t-24" v-if="groupMsg.addBuyList.length && (groupMsg.aaUser.status == 0 || groupMsg.aaUser.status == 2)">
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
					<view class="info-box">
						<view>餐盒费</view>
						<view class="price-right">
							<text>￥</text>
							<text>{{ groupMsg.aaUser.packageFee }}</text>
						</view>
					</view>
					<view class="info-box">
						<view>包装费</view>
						<view class="price-right">
							<text>￥</text>
							<text>{{ groupMsg.aaUser.pdPackageFee }}</text>
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
					<view class="info-box">
						<view><view class="block-reduce">￥</view>红包</view>
						<view class="u-flex u-row-right u-col-center" v-if="redPacket == 0 && Boolean(!this.groupMsg.aaUser.orderId)" @tap="chooseGroupCoupon">
							<text style="color: #1c1c1d" class="u-font-14;">选择优惠券</text>
							<u-icon name="arrow-right" color="#1c1c1d" size="28"></u-icon>
						</view>
						<view class="price-right" @tap="chooseGroupCoupon" style="color: #ff4d4f" v-else>
							-
							<text>￥</text>
							<text>{{ redPacket }}</text>
							<u-icon name="arrow-right" color="#1c1c1d" size="28" v-if="Boolean(!this.groupMsg.aaUser.orderId)"></u-icon>
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
					<view class="info-box" v-if="Boolean(this.groupMsg.aaUser.status !== 1)">
						<textarea
							placeholder="请输入备注"
							placeholder-style="font-size:28rpx;color:#ABABAF"
							maxlength="100"
							@input="inputFuc"
							:value="remark"
							cursor-spacing="200"
						></textarea>
					</view>
				</view>
				<view class="order-bot">
					<view class="btn-left" @tap="disjoin(0)">退出拼餐</view>
					<view class="right">
						<view class="price-box">
							<text>小计</text>
							<text>¥</text>
							<text>{{ subtotal }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="point-box" v-if="showUsers" @tap="showUsers = false">
			<view>点击查看好友餐品选购状态</view>
			<u-icon name="arrow-down" color="#D3D4D4" size="26"></u-icon>
		</view>
		<view class="partner-box" v-else>
			<view class="partner-top">{{ groupMsg.users.length ? "好友餐品" : "暂无人选购" }}</view>
			<view class="partner-goods" v-for="(item, i) in groupMsg.users" :key="i">
				<view class="partner-item">
					<view class="partner-img">
						<image :src="`${item.url || '../../static/img/deliveryPic.png'}`" mode="aspectFill"></image>
					</view>
					<view class="partner-info">
						<view class="info-h">
							<view class="left">
								<view class="partner-name">{{ item.name }}</view>
								<text class="red-style" v-if="!item.status">正在选购</text>
								<text class="red-style" v-else-if="item.status == 2">已选购</text>
								<text class="green-style" v-else-if="item.status == 1">支付完成</text>
							</view>
							<view class="del-btn" @tap="disjoin(item.userId)" v-if="groupMsg.aaUser.create">删除</view>
						</view>
						<view class="goods-p">
							<view class="goods-item" v-for="(it, i) in item.shoppingCarts" :key="i">
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
		</view>
		<view class="line-block"></view>
		<view class="bubble-box create" v-if="groupMsg.status == 0 && groupMsg.create && !disJoinMol && !confirmMol && !groupMsg.settlement && guideStu"
			>差1人下单即可成团，邀请好友</view
		>
		<view class="bubble-box" v-if="groupMsg.aaUser.status !== 1 && !groupMsg.create && !disJoinMol && !confirmMol && guideStu">支付后待成团</view>
		<cover-view class="bot-box" v-if="groupMsg.status == 0 && groupMsg.create && !disJoinMol && !confirmMol">
			<cover-view class="bot-info">
				<cover-view class="top">
					<cover-view>我需支付¥</cover-view>
					<cover-view style="min-width: 200rpx">{{ subtotal }}</cover-view>
					<cover-view class="blank"></cover-view>
				</cover-view>
				<cover-view class="bot">{{ groupMsg.msg }}</cover-view>
			</cover-view>
			<cover-view :class="[{ cant: !groupMsg.settlement }, 'sure-btn']" @tap="confirmFuc">{{
				!groupMsg.settlement && groupMsg.qsj && CALC ? `还差¥${CALC}起送　` : "去支付"
			}}</cover-view>
			<!-- <cover-view :class="[{ cant: !groupMsg.settlement }, 'sure-btn']" @tap="confirmFuc">提交订单</cover-view> -->
		</cover-view>
		<cover-view class="bot-box" v-if="groupMsg.aaUser.status !== 1 && !groupMsg.create && !disJoinMol && !confirmMol">
			<cover-view class="bot-info">
				<cover-view class="top">
					<cover-view>我需支付¥</cover-view>
					<cover-view style="min-width: 200rpx">{{ subtotal }}</cover-view>
					<cover-view class="blank"></cover-view>
				</cover-view>
				<cover-view class="bot">{{ groupMsg.msg }}</cover-view>
			</cover-view>
			<cover-view :class="['sure-btn']" @tap="payFuc">去支付</cover-view>
			<!-- <cover-view :class="[{ cant: !groupMsg.settlement }, 'sure-btn']" @tap="confirmFuc">提交订单</cover-view> -->
		</cover-view>
		<cover-view class="sure-text" style="min-width: 100vw" v-if="groupMsg.aaUser.status == 1 && !groupMsg.create && !disJoinMol && !confirmMol"
			>已支付，等待订单提交</cover-view
		>
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
			disJoinMol: false,
			confirmMol: false,
			showUsers: true,
			disTitle: "",
			remark: "",
			redPacketIds: 0,
			redPacket: 0,
			molContent: "还有小伙伴正在选购，是否立即提交订单？",
			disJoinContent: "",
			pageType: 0,
			groupMsg: {
				address: "",
				addressId: 0,
				count: 0,
				create: true,
				createId: 0,
				createTime: "",
				status: 0, //活动状态(-1,失败,0,进行中,1.已完成,2已提交)',
				settlement: false, //可以下单/不能下单',
				id: 0,
				name: "",
				phone: "",
				relationPerson: "",
				status: 0,
				storeId: 0,
				totalPackageFee: 0,
				totalPrice: 0,
				totalPdPackageFee: 0,
				type: 0,
				urls: [],
				users: [],
				aaUser: {
					status: 0, //个人支付状态:0 选购中, 1已支付, 2已选购, 3下单未付款
				},
			},
			timeStamp: 0,
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
	onShow() {
		if (this.ifChooseCoupon) {
			this.ifChooseCoupon = false;
			return;
		}
		uni.hideNavigationBarLoading();
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
			if (res.data.aaUser.orderId) {
				this.redPacket = res.data.aaUser.redPackageFee * 1;
			} else {
				this.redPacketIds = res.data.redPacketRecordId;
				this.redPacket = res.data.redPacketAmount * 1;
			}
			this.socketFuc();
			this.timeStamp = (1200000 - (Date.parse(new Date()) - Date.parse(new Date(this.groupMsg.createTime.replace(/-/g, "/"))))) / 1000;
		};
		let elseFuc = res => {
			getApp().globalData.previewImage = false;
			this.backFuc();
		};
		let api = this.pageType ? "SettleMent" : "GroupDetail";
		AjaxApi(api, params, successFuc, elseFuc);
	},
	onUnload() {
		this.groupMsg.id = 0;
		this.socketFuc();
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
					console.log("收到服务器内容3：" + result.data);
					this.socketFresh();
					// 要进行的操作
				});
		},
		async socketFresh() {
			let groups = await store.dispatch("GroupDetail", { pdId: this.pdId });
			if (groups.code == 0) {
				this.groupMsg = groups.data;
				if (groups.data.aaUser.orderId) {
					this.redPacket = groups.data.aaUser.redPackageFee * 1;
				} else {
					this.redPacketIds = groups.data.redPacketRecordId;
					this.redPacket = groups.data.redPacketAmount * 1;
				}
				this.timeStamp = (1200000 - (Date.parse(new Date()) - Date.parse(new Date(this.groupMsg.createTime.replace(/-/g, "/"))))) / 1000;
			} else {
				this.backFuc();
			}
		},
		inputFuc(e) {
			this.remark = e.detail.value;
		},
		confirmFuc() {
			if (!this.groupMsg.aaUser.create) return;
			if (!this.groupMsg.settlement) return;
			const inx = this.groupMsg.users.filter(element => element.status === 2);
			if (inx.length) {
				this.confirmMol = true;
				this.molContent = `当前还有${inx.length}个好友未支付,是否提交订单
				未支付的好友将被移除`;
				return;
			}
			this.payFuc();
		},
		confirmOrder() {
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let successFuc = res => {
				uni.switchTab({
					url: "/pages/order/order",
				});
			};
			let elseFuc = () => {
				uni.hideNavigationBarLoading();
			};
			AjaxApi("SaveAAOrder", { pdId: this.groupMsg.id }, successFuc, elseFuc);
		},
		refreshFuc() {
			if (this.refresh) return;
			this.refresh = true;
			uni.showLoading({
				title: "正在刷新",
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
		chooseGroupCoupon() {
			if (this.groupMsg.aaUser.orderId) return;
			let usedAmount = new Decimal(this.groupMsg.aaUser.subPrice ?? 0);
			this.ifChooseCoupon = true;
			uni.navigateTo({
				url: "/pagesPing/chooseGroupCoupon/chooseGroupCoupon",
			});
		},
		disjoin(userId) {
			this.disUserId = !userId ? getApp().globalData.UserInfo.userId : userId;
			let cont = this.groupMsg.create ? "发起人退出拼餐将自动取消所有选餐" : "";
			this.disTitle = !userId ? "确定退出拼餐?" : "提示";
			this.disJoinContent = userId = !userId ? cont : "是否确定删除?";
			this.disJoinMol = true;
		},
		doDisJion() {
			// uni.showLoading({
			// 	title: "操作中",
			// 	mask: true,
			// });
			let params = {
				pdId: this.groupMsg.id,
				userId: this.disUserId,
			};
			let successFuc = res => {
				if (this.disTitle == "确定退出拼餐?") {
					getApp().globalData.previewImage = false;
					this.backFuc();
				} else {
					let params = {
						pdId: this.pdId,
					};
					let successFuc = res => {
						getApp().globalData.previewImage = false;
						this.groupMsg = res.data;
						if (res.data.aaUser.orderId) {
							this.redPacket = res.data.aaUser.redPackageFee * 1;
						} else {
							this.redPacketIds = res.data.redPacketRecordId;
							this.redPacket = res.data.redPacketAmount * 1;
						}
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
		payFuc() {
			if (this.groupMsg.aaUser.status == 1) return;
			if (this.groupMsg.create && !this.groupMsg.settlement) return;
			getApp().globalData.previewImage = false;
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			let successFuc = res => {
				const payType = this.subtotal == 0 ? 4 : 3;
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
	},
	computed: {
		CALC() {
			let val = new Decimal(this.groupMsg.qsj ?? 0)
				.sub(new Decimal(this.groupMsg.totalPdPackageFee ?? 0))
				.sub(new Decimal(this.groupMsg.totalPackageFee ?? 0))
				.sub(new Decimal(this.groupMsg.totalPrice ?? 0));
			return val > 0 ? val : 0;
		},
		orderPackageFee() {
			let val = new Decimal(this.groupMsg.aaUser.packageFee ?? 0).add(new Decimal(this.groupMsg.aaUser.pdPackageFee ?? 0));
			return val > 0 ? val : 0;
		},
		subtotal() {
			let val = new Decimal(this.groupMsg.aaUser.subPrice ?? 0).sub(new Decimal(this.redPacket ?? 0)).sub(new Decimal(this.groupMsg.reduceFee ?? 0));
			return val > 0
				? val.add(new Decimal(this.groupMsg.shippingFeeRecordId ? 0 : this.groupMsg.shippingFee ?? 0))
				: this.groupMsg.shippingFeeRecordId
				? 0
				: this.groupMsg.shippingFee;
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
	padding: 86rpx 24rpx 60rpx 24rpx;
	min-height: 100vh;
	.bubble-box {
		width: 242rpx;
		height: 82rpx;
		border: 4rpx solid #fe6b00;
		border-radius: 100rpx;
		background: #fff;
		font-size: 28rpx;
		color: #fe6b00;
		line-height: 76rpx;
		text-align: center;
		position: relative;
		position: fixed;
		// bottom: 126rpx;
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
		&.create {
			width: 440rpx;
		}
	}
	.spell-info {
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
	.top-info-box {
		width: 100%;
		padding: 30rpx 24rpx;
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}
	.address-box {
		display: flex;
		justify-content: space-between;
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
		margin-top: 30rpx;
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
			text {
				color: #fe6b00;
				margin-right: 20rpx;
			}
		}
	}
	.spell-box {
		background: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		.spell-status {
			border-bottom: 2rpx solid #f1f1f4;
			padding: 24rpx 24rpx 30rpx 24rpx;
			.status-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				> view {
					&:nth-child(1) {
						font-size: 32rpx;
						font-weight: 500;
						color: #1c1c1d;
						line-height: 44rpx;
					}
				}
				button {
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
				}
			}
			.status-bot {
				display: flex;
				justify-content: flex-start;
				align-items: center;
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
		.spell-info {
			padding: 30rpx 24rpx;
			> view {
				&:nth-child(1) {
					font-size: 32rpx;
					font-weight: 500;
					color: #1c1c1d;
					line-height: 44rpx;
					margin-bottom: 4rpx;
					> text {
						&:nth-child(1) {
							color: #1c1c1d;
						}
						&:nth-child(2) {
							color: #ff3b3b;
						}
					}
				}
				&:nth-child(2) {
					font-size: 24rpx;
					font-weight: 400;
					color: #ababaf;
					line-height: 34rpx;
					word-wrap: break-word;
					word-break: normal;
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
				min-height: 104rpx;
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
					min-height: 40rpx;
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
					textarea {
						height: 150rpx;
						width: 100%;
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
				justify-content: space-between;
				align-items: center;
				.btn-left {
					width: 156rpx;
					line-height: 56rpx;
					border-radius: 28rpx;
					border: 2rpx solid #f1f1f4;
					color: #ababaf;
					font-size: 24rpx;
					font-weight: 500;
					text-align: center;
				}
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
					.right-btn {
						width: 156rpx;
						line-height: 68rpx;
						background: #fe6b00;
						&.cant {
							background: #999999;
						}
						border-radius: 34rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #ffffff;
						text-align: center;
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
	.order-remark {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
	}
	.point-box {
		height: 114rpx;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20rpx;
		view {
			font-size: 28rpx;
			font-weight: 500;
			line-height: 40rpx;
			color: #1c1c1d;
			margin-bottom: 10rpx;
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
							.red-style {
								border: 2rpx solid #ff3b3b;
								color: #ff3b3b;
							}
							.green-style {
								color: #0ccb54;
								border: 1px solid #0ccb54;
							}
						}
						.del-btn {
							width: 100rpx;
							text-align: right;
							font-size: 28rpx;
							font-weight: 500;
							color: #ababaf;
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
									font-size: 24rpx;
									font-weight: 400;
									color: #ababaf;
									line-height: 34rpx;
									margin-bottom: 4rpx;
								}
							}
						}
					}
				}
			}
		}
	}
	.line-block {
		width: 100%;
		height: 100rpx;
	}
	.bot-box {
		width: 100%;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
		padding: 12rpx 24rpx;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom, 0);
		padding-bottom: env(safe-area-inset-bottom, 0);
		.bot-info {
			display: inline-block;
			.top {
				width: 476rpx;
				height: 40rpx;
				cover-view {
					font-size: 24rpx;
					display: inline-block;
					&:nth-child(1) {
						line-height: 40rpx;
						font-weight: 400;
						color: #1c1c1d;
						margin-right: 8rpx;
					}
					&:nth-child(2) {
						line-height: 42rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: #1e1f21;
					}
				}
				.blank {
					display: inline-block;
					width: 30rrpx;
				}
			}
			.bot {
				width: 100%;
				font-size: 20rpx;
				font-weight: 400;
				color: #ff3b3b;
				line-height: 28rpx;
			}
		}
		.sure-btn {
			display: inline-block;
			width: 220rpx;
			line-height: 76rpx;
			height: 76rpx;
			background: #fe6b00;
			border-radius: 44rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #fff;
			&.cant {
				background: #999999;
			}
			text-align: center;
		}
	}
	.sure-text {
		width: 100%;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
		padding: 12rpx 24rpx;
		display: inline-block;
		text-align: center;
		width: 224rpx;
		height: 90rpx;
		font-size: 32rpx;
		color: #ababaf;
		line-height: 76rpx;
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
