<template>
	<view class="container">
		<image class="success" src="https://oss.dianddian.cn/v2/activity/paid.png" mode="aspectFit"></image>
		<view class="u-m-t-80">支付成功!</view>
		<view :class="[{ width: !recharged }, 'btns u-font-32']">
			<cell v-if="recharged" :url="rechargeUrl" contactText="加入群聊"></cell>
			<view :class="[{ width: !recharged }, 'btn']" @tap="backTo">
				返回
				<!-- (
			<CountDown v-if="time" class="btn-count" :timestamp="time" font-size="32" color="#FFFFFF" :showDays="false" :show-hours="false" :show-minutes="false" @end="backTo" bg-color="#FE6B00"></CountDown>
			s) -->
			</view>
		</view>
	</view>
</template>

<script>
	import { AjaxApi, SHARE_URL } from "@/utils/api";
	import store from "@/store";
	import countDown from "./u-count-down";
	export default {
		components: {
			countDown,
		},
		data() {
			return {
				rechargeUrl: "",
				recharged: false,
				time: 0,
				orderDetail: {},
			};
		},
		onLoad(options) {
			uni.showLoading({
				title: "",
			});
			this.recharged = Boolean(options?.recharged * 1) ?? false;
			const params = {
				orderId: options.orderId,
			};
			let successFuc = async res => {
				this.orderDetail = res.data;
				this.time = 5;
				if (this.recharged) {
					let url = await store.dispatch("RechargeUrl", {});
					this.rechargeUrl = url.data;
				}
			};
			let elseFuc = async res => {
				uni.navigateBack();
			};
			AjaxApi("OrderDetail", params, successFuc, elseFuc);
		},
		onShareAppMessage: function () {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		},
		methods: {
			async backTo() {
				let url = "";
				switch (this.orderDetail.pdType) {
					case 0:
						url = `/pagesA/orderDetail/orderDetail?orderId=${this.orderDetail.orderId}`;
						break;
					case 1:
						url = `/pagesPing/orderStatusDetails/orderStatusDetails?orderId=${this.orderDetail.orderId}`;
						break;
					case 2:
						if (this.orderDetail.status == 1) {
							url = `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${this.orderDetail.orderId}`;
							break;
						}
						let spell = await store.dispatch("SelPdRecord", { pdId: this.orderDetail.pdId });
						url = spell?.data?.status == 0 ? `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${this.orderDetail.pdId}&type=0` : `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${this.orderDetail.orderId}`;
						break;
					default:
						break;
				}
				uni.redirectTo({
					url: `${url}&checkCoupon=1`,
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
		display: none !important;
	}
	/deep/.groupCell--nickname {
		color: #fe6b00;
		margin-left: 0;
		font-size: 32rpx;
		line-height: 96rpx;
		background: rgba(254, 107, 0, 0.15);
		width: 324rpx;
		height: 96rpx;
		border-radius: 48rpx;
		text-align: center;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #1c1c1d;
		height: 70vh;
		.success {
			width: 160rpx;
			height: 160rpx;
		}
		.btns {
			font-weight: bold;
			width: 100vw;
			margin-top: 130rpx;
			display: flex;
			justify-content: space-between;
			&.width {
				justify-content: center;
			}
			padding: 0 42rpx;
			.btn {
				width: 324rpx;
				height: 96rpx;
				line-height: 96rpx;
				background: #fe6b00;
				border-radius: 48rpx;
				color: white;
				text-align: center;
				&.width {
					width: 670rpx;
				}
			}
		}
	}
</style>
