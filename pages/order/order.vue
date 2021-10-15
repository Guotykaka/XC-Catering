<template>
	<view class="wrap">
		<!-- <u-mask :duration="0" class="load-mask" :show="loadingMask" z-index="10090" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<image class="banner-img" src="https://oss.dianddian.cn/common/ddd_log.png" mode="aspectFill"></image>
		</u-mask> -->
		<u-top-tips ref="uTips"></u-top-tips>
		<u-modal
			v-model="contactMol"
			:show-title="false"
			:show-cancel-button="true"
			:content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }"
			width="608"
			@cancel="cancelContact"
		>
			<view class="slot-content">
				<view>{{ alertConcel }}</view>
				<view>当前活动已结束,如有疑问请联系客服</view>
			</view>
			<template slot="confirm-button" class="u-border-left" style="height: 100%">
				<button class="confirm-button" open-type="contact" plain="true" style="color: #fe6b00">联系客服</button>
			</template>
		</u-modal>
		<view class="container">
			<u-mask :show="cancelMask" :duration="0">
				<view class="mask-slot">
					<view>
						<img src="https://oss.dianddian.cn/v2/cancle_order.png" alt="" />
						<view>您确定要取消订单吗？</view>
					</view>
					<view class="mask-btn">
						<view @tap.stop="cancelMask = false">取消</view>
						<view @tap.stop="turnToCancel" style="color: #fe6b00">确定</view>
					</view>
				</view>
			</u-mask>
			<u-mask :show="shareMask">
				<view class="mask-slot-share">
					<view>
						<u-icon name="close" color="#FFFFFF" size="28" @tap="shareMask = false"></u-icon>
						<img src="https://oss.dianddian.cn/activity/order_share/share_random.jpg" alt="" />
						<button open-type="share">去分享</button>
					</view>
				</view>
			</u-mask>
			<view class="tab-list">
				<u-tabs
					:list="list"
					:is-scroll="false"
					height="76"
					bar-height="4"
					bar-width="80"
					active-color="#fe6b00"
					:current="statusType"
					@change="change"
				></u-tabs>
			</view>
			<view v-if="orderList.length">
				<view class="order-item" v-for="(item, index) in orderList" :key="index">
					<view class="head">
						<u-image
							class="img u-m-r-16"
							:fade="false"
							:src="item.pic || 'https://oss.dianddian.cn/shop/defult-store.png'"
							error-icon="photo"
							width="80"
							height="80"
							border-radius="8"
						></u-image>
						<view class="head-left">
							<view class="u-flex u-row-between">
								<view class="shop-name u-line-1" @click="jumpShop(item.shopId, item.storeId, item.pdType)">
									<text>{{ item.shopName }}</text>
									<u-icon class="tip-right" name="arrow-right" v-if="item.pdType == 0"></u-icon>
								</view>
								<view style="white-space: nowrap">
									<text class="today-num">
										{{ item.todayNum ? `#${item.todayNum} · ` : "" }}
									</text>
									<text class="status" v-if="item.status == 8 && item.isEvaluate == 0"> 待评价 </text>
									<text class="status" v-if="item.status == 8 && item.isEvaluate == 1"> 已评价 </text>
									<text class="status" v-if="item.status == 11 || item.status == 12 || item.status == 13"> 申请退款中 </text>
									<text class="status" v-if="item.status !== 8 && item.status !== 11 && item.status !== 12 && item.status !== 13">
										{{ item.statusName }}
									</text>
								</view>
							</view>
							<view class="order-rebate u-line-2" v-if="item.gatherTotalCount">
								<text>{{ item.gatherName }}</text>
								<text
									:class="[i + 1 > item.gatherCount ? 'un_active' : '', 'iconfont iconxingxing']"
									v-for="(it, i) in item.gatherTotalCount"
									:key="i"
								></text>
							</view>
							<view class="order-tiem">
								<text>{{ item.sendTime }}</text>
								<text style="color: #ff4d4f" v-if="item.refundStatus == 3">退款驳回</text>
							</view>
						</view>
					</view>
					<view class="con" @tap.stop="tapView('detail', item)">
						<view v-for="(itSon, inx) in item.orderGoods" :key="inx" class="con-img">
							<template v-if="inx < 3">
								<u-image class="img u-m-r-24" :fade="false" :src="itSon.goodsPic || ' '" width="136" height="136" border-radius="8"></u-image>
								<div class="u-line-1">{{ itSon.goodsName }}</div>
							</template>
						</view>
						<view class="con-right">
							<div class="u-line-1">￥{{ item.actualPayment }}</div>
							<div class="u-line-1">{{ `共${item.orderGoods.length || 0}件商品` }}</div>
						</view>
					</view>
					<view class="btm">
						<view
							class="tip share"
							v-if="(item.status == 3 || item.status == 4 || item.status == 5 || item.status == 8) && getTimeOut(item) && !item.state"
							@tap.stop="tapView('share', item)"
						>
							<!-- state 判断 1 代表买单订单 0 点餐订单 -->
							<image class="imgs u-m-r-8" src="../../static/img/coupon.png"></image>
							分享有礼
						</view>
						<!-- <text class="tip" @tap.stop="tapView('share', item)">分享</text> -->
						<text class="tip" v-if="Boolean(item.status == 0) && item.pdType == 0" @tap.stop="tapView('cancel', item)"> 取消 </text>
						<text class="tip" v-if="Boolean(item.status == 0) && item.pdType == 1 && item.pid == 0" @tap.stop="tapView('cancel', item)">
							取消
						</text>
						<text class="tip" v-if="Boolean(item.status == 0) && item.pdType == 2" @tap.stop="tapView('cancelAA', item)"> 取消 </text>
						<!-- && item.pdType == 1 && item.pid == 0 -->
						<!-- || Boolean(item.status == 0 && item.pdType !== 1) -->
						<text
							class="tip"
							v-if="(item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5) && item.refundStatus !== 3 && item.pdType == 0"
							@tap.stop="tapView('cancel', item)"
							>申请退款</text
						>
						<!-- <text
							class="tip"
							v-if="(item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5) && item.refundStatus !== 3 && item.pdType == 1"
							@tap.stop="tapView('cancel', item)"
							>申请退款</text
						> -->
						<button
							class="tip"
							open-type="contact"
							plain="true"
							v-if="
								(item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5) &&
								item.refundStatus !== 3 &&
								item.pdType == 1 &&
								item.pid == 0
							"
						>
							申请退款
						</button>
						<text
							class="tip"
							v-if="(item.status == 2 || item.status == 3 || item.status == 4 || item.status == 5) && item.refundStatus !== 3 && item.pdType == 2"
							@tap.stop="tapView('rePayAA', item)"
							>申请退款</text
						>
						<text class="tipPay" v-if="Boolean(item.status == 0) && item.pdType == 0" @tap.stop="tapView('pay', item)">付款</text>
						<text class="tipPay" v-if="Boolean(item.status == 0) && item.pdType == 1 && item.pid == 0" @tap.stop="tapView('pay', item)">
							付款
						</text>
						<text class="tipPay" v-if="Boolean(item.status == 0) && item.pdType == 2" @tap.stop="tapView('payAA', item)"> 付款 </text>
						<text class="tip" v-if="item.status == 8 && item.isEvaluate == 0 && !item.state" @tap.stop="tapView('evaluate', item)">评价</text>
						<text class="tip" v-if="item.status == 8 && item.pdType == 0" @tap.stop="jumpShop(item.shopId, item.storeId)">再来一单</text>
						<text class="tip" v-if="item.status == 4 && item.orderType !== 0 && item.pdType == 0" @tap.stop="tapView('takefood', item)">取餐</text>
						<!-- <text class="tip" v-if="item.status == 9">退款进度</text> -->
						<!-- 0:外卖,1:堂食,2:到店自取 -->
						<!-- //0:待支付,1:已取消,2:待接单,3:已接单,4:待配送(待取餐)5:配送中,6:退款中,7:退款完成,8:已完成(取餐),
				//9:退款审核,10:退款驳回,11:已接单退款,12:待配送退款,:13:配送中退款 -->
					</view>
				</view>
			</view>
		</view>
		<view class="nomore" v-if="orderList.length">{{ pageDown ? "下划获取更多" : "到底了" }}</view>
		<view class="nomore u-margin-top-40" v-else>暂无订单数据</view>
		<!--引用组件-->
		<tab-bar pagePath="pages/order/order"></tab-bar>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			now: new Date().getTime(),
			loadingMask: true,
			shareId: 0,
			orderId: 0,
			luckNum: 0,
			statusType: 0, //statusType (0,全部,1待评价,2退款)
			orderStatus: 0,
			pdType: 0, // (0常规,1请客,2AA)
			alertConcel: "",
			pageDown: true,
			shareMask: false,
			contactMol: false,
			cancelMask: false,
			list: [
				{
					name: "全部订单",
				},
				{
					name: "待评价",
				},
				{
					name: "退款",
				},
			],
			options: [
				{
					text: "删除",
					style: {
						backgroundColor: "#dd524d",
					},
				},
			],
			orderList: [],
			orderParameter: {
				pageIndex: 1,
				pageSize: 10,
			},
		};
	},
	onShareAppMessage: function (res) {
		if (res.from === "button") {
			const shareId = this.shareId;
			const luckNum = this.luckNum;
			// 来自页面内转发按钮
			return {
				title: `第${luckNum}个领取的红包最大！`,
				imageUrl: "https://oss.dianddian.cn/activity/order_share/share_random.jpg",
				path: `/pagesC/sharingOrder/sharingOrder?shareId=${shareId}`,
			};
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},
	// onLoad() {},
	onHide() {
		uni.hideLoading();
		this.cancelMask = false;
		this.shareMask = false;
		this.statusType = 0;
	},
	onShow() {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		// this.loadingMask = true;
		if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
			uni.reLaunch({
				url: "/pagesB/login/login",
			});
			return;
		}
		this.orderId = 0;
		this.orderStatus = 0;
		this.pdType = 0;
		// this.orderList = [];
		this.orderParameter = {
			pageIndex: 1,
			pageSize: 10,
		};
		this.init(true);
	},
	onReachBottom(e) {
		if (this.pageDown) {
			this.orderParameter.pageIndex++;
			this.init();
		}
	},
	onPullDownRefresh() {
		this.orderList = [];
		this.orderParameter = {
			pageIndex: 1,
			pageSize: 10,
		};
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		// this.loadingMask = true;
		this.init();
	},
	methods: {
		async tapView(key, it) {
			//订单状态:0:待支付,1:已取消,2:待接单,3:已接单,4:待配送(待取餐),5:配送中,6:退款中,7:退款完成,8:已完成,11,12,13:已退款
			switch (key) {
				case "detail":
					let url = "";
					switch (it.pdType) {
						case 0:
							url = `/pagesA/orderDetail/orderDetail?orderId=${it.orderId}`;
							break;
						case 1:
							url = `/pagesPing/orderStatusDetails/orderStatusDetails?orderId=${it.orderId}`;
							break;
						case 2:
							if (it.status == 1) {
								url = `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${it.orderId}`;
								break;
							}
							let spell = await store.dispatch("SelPdRecord", { pdId: it.pdId });
							url =
								spell?.data?.status == 0
									? `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${it.pdId}&type=0`
									: `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${it.orderId}`;
							break;
						default:
							break;
					}
					uni.navigateTo({
						url: url,
					});
					break;
				case "pay":
					let type = it.actualPayment == 0 ? 4 : 3;
					uni.navigateTo({
						url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${it.orderId}&payType=${type}&pdType=${it.pdType}`,
					});
					break;
				case "payAA":
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					let successFucP = async res => {
						if (res.data.status == 1 || res.data.status == -1) {
							this.alertConcel = "无法完成支付";
							this.contactMol = true;
						} else {
							let type = it.actualPayment == 0 ? 4 : 3;
							uni.navigateTo({
								url: `/pagesB/checkoutCounter/checkoutCounter?orderId=${it.orderId}&payType=${type}&pdType=${it.pdType}`,
							});
						}
						// 拼餐活动状态(-1,失败,0,进行中,1.已完成)
					};
					AjaxApi("SelPdRecord", { pdId: it.pdId }, successFucP);
					break;
				case "evaluate":
					uni.navigateTo({
						url: `/pagesA/evaluation/evaluation?orderId=${it.orderId}`,
					});
					break;
				case "cancel":
					this.orderId = it.orderId;
					this.orderStatus = it.status;
					this.pdType = it.pdType;
					this.cancelMask = true;
					break;
				case "cancelAA":
					this.orderId = it.orderId;
					this.orderStatus = it.status;
					this.pdType = it.pdType;
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					let successFuc1 = async res => {
						if (res.data.status == 1 || res.data.status == -1) {
							this.alertConcel = "无法取消订单";
							this.contactMol = true;
						} else {
							this.cancelMask = true;
						}
						// 状态(-1,失败,0,进行中,1.已完成,2.待支付/已选购)
					};
					AjaxApi("SelPdRecord", { pdId: it.pdId }, successFuc1);
					break;
				case "rePayAA":
					this.orderId = it.orderId;
					this.orderStatus = it.status;
					this.pdType = it.pdType;
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					let successFucA = async res => {
						if (res.data.status !== 0) {
							this.alertConcel = "无法申请退款";
							this.contactMol = true;
						} else {
							this.cancelMask = true;
						}
						// 状态(-1,失败,0,进行中,1.已完成)
					};
					AjaxApi("SelPdRecord", { pdId: it.pdId }, successFucA);
					break;
				case "share":
					this.orderId = it.orderId;
					let setShareOrder = await store.dispatch("SetShareOrder", { orderId: this.orderId });
					if (setShareOrder.code !== 0) return;
					this.luckNum = setShareOrder.data?.luckNum;
					this.shareId = setShareOrder.data?.id;
					this.shareMask = true;
					break;
				case "takefood":
					let params = { orderId: it.orderId };
					let successFuc3 = res => {
						this.init(true);
					};
					AjaxApi("TakeMeal", params, successFuc3);
					break;

				default:
					break;
			}
		},
		init(ifInit) {
			//订单列表
			let params = {
				pageIndex: this.orderParameter.pageIndex,
				pageSize: this.orderParameter.pageSize,
				statusType: this.statusType,
			};

			let successFuc = res => {
				let { pages, current, total } = res.data;
				if (!total) {
					this.$refs.uTips.show({
						title: "暂无订单数据",
						duration: "1500",
					});
				}
				this.orderList = ifInit ? res.data.records : this.orderList.concat(res.data.records);
				this.orderParameter.pageIndex = current;
				this.pageDown = Boolean(pages > current);
				// this.loadingMask = false;
				uni.stopPullDownRefresh();
			};
			AjaxApi("GetOrderList", params, successFuc);
		},
		change(e) {
			uni.pageScrollTo({
				scrollTop: 0,
			});
			this.statusType = e;
			this.orderList = [];
			this.orderParameter.pageIndex = 1;
			this.orderParameter.pageSize = 10;
			this.init();
		},
		jumpShop(shopId, storeId, pdType = 0) {
			if (pdType !== 0) return;
			uni.navigateTo({
				url: `/pages/home/home?shopId=${shopId}`,
			});
		},
		getTimeOut(it) {
			if (!it.payTime) {
				return false;
			}
			return this.now - new Date(it.payTime.replace(/-/g, "/")).getTime() < 6 * 24 * 60 * 60 * 1000;
		},
		turnToCancel() {
			uni.navigateTo({
				url: `/pagesA/orderCancel/orderCancel?orderId=${this.orderId}&orderStatus=${this.orderStatus}&pdType=${this.pdType}`,
			});
		},
		cancelContact() {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.orderId = 0;
			this.orderStatus = 0;
			this.pdType = 0;
			this.orderList = [];
			this.orderParameter = {
				pageIndex: 1,
				pageSize: 10,
			};
			this.init(true);
		},
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	padding-bottom: 100rpx;
	padding-bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
	padding-bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
	position: relative;
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
	.load-mask {
		image {
			animation: myfirst 0.8s infinite;
			width: 120rpx;
			height: 120rpx;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}
	}
}
.container {
	.banner-img {
		width: 710rpx;
		height: 240rpx;
		background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
		box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
		opacity: 1;
		border-radius: 8rpx;
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
	.mask-slot-share {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #333333;
		width: 608rpx;
		height: 640rpx;
		// background: #ffffff00;
		background: linear-gradient(90deg, #f5156c 0%, #fa8a34 100%);
		> view {
			width: 100%;
			height: 100%;
			position: relative;
			/deep/u-icon {
				z-index: 100;
				position: absolute;
				top: 32rpx;
				right: 32rpx;
			}
			img {
				margin: 0 auto;
				width: 100%;
				// height: 100%;
			}
			button {
				position: absolute;
				left: 50%;
				transform: translate(-50%, 0);
				bottom: 28rpx;
				padding: 0;
				display: inline-block;
				background-color: #ffffff00;
				vertical-align: -32%;
				height: 80rpx;
				width: 488rpx;
				background: #ffe336;
				border-radius: 46rpx;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 80rpx;
				color: #ff4d4f;
				box-sizing: border-box;
				text-align: center;
				text-decoration: none;
				-webkit-tap-highlight-color: transparent;
				overflow: hidden;
				&:after {
					content: none;
				}
			}
		}
	}
	.tab-list {
		background: #fff;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 100;
	}
	.order-item {
		margin: 20rpx;
		padding: 20rpx 40rpx;
		background-color: #ffffff;
		border-radius: 8rpx;
		.head {
			line-height: 40rpx;
			display: flex;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #dddddd;
			.head-left {
				flex: 1;
				width: 0;
				.order-tiem {
					height: 34rpx;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 34rpx;
					color: rgba(153, 153, 153, 1);
					display: flex;
					justify-content: space-between;
				}
				.order-rebate {
					min-height: 34rpx;
					font-size: 20rpx;
					line-height: 34rpx;
					text {
						color: #ff4d4f;
						&:not(:first-child) {
							margin-left: 10rpx;
							font-size: 20rpx;
							&.un_active {
								color: #dddddd;
							}
						}
					}
				}
			}
			.shop-name {
				max-width: 80%;
				font-weight: bold;
				white-space: nowrap;
			}
			.tip-right {
				// line-height: 20rpx;
				font-size: 20rpx;
				color: #d5d5d5;
				display: inline-block;
				margin-left: 12rpx;
			}
			.today-num {
				font-size: 28rpx;
				font-weight: bold;
				line-height: 40rpx;
				color: #666666;
			}
			.status {
				color: #999999;
			}
		}

		.con {
			margin-top: 26rpx;
			box-sizing: border-box;
			padding-bottom: 40rpx;
			display: flex;
			justify-content: flex-end;
			line-height: 34rpx;
			font-size: 24rpx;
			color: #333333;
			.con-img {
				display: flex;
				flex-direction: column;
				div {
					width: 136rpx;
					text-align: center;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 34rpx;
					color: #333333;
				}
			}
			.con-right {
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 34rpx;
				margin-left: 6rpx;
				color: #333333;
				> div {
					&:nth-child(1) {
						font-size: 28rpx;
						font-weight: bold;
						line-height: 40rpx;
						color: #333333;
					}
				}
			}
		}

		.btm {
			display: flex;
			justify-content: flex-end;
			flex-wrap: wrap;
			text-align: right;
			button {
				padding: 0;
				margin: 0;
				border: 0;
				display: inline-block;
				line-height: 34rpx;
				font-size: 24rpx;
				color: #333333;
			}
			.tip {
				padding: 4rpx 20rpx;
				border: 1rpx solid #d5d5d5;
				opacity: 1;
				border-radius: 4rpx;
				margin-left: 20rpx;
				color: #666666;
				&.share {
					display: flex;
					justify-content: space-around;
					align-items: center;
					background: #ff4d4f;
					border: 1rpx solid #ff4d4f;
					color: #fff;
					.imgs {
						width: 28rpx;
						height: 32rpx;
						border-radius: 2rpx 2rpx 4rpx 4rpx;
						box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					}
				}
			}
			.tipPay {
				padding: 4rpx 20rpx;
				background: #fe6b00;
				opacity: 1;
				border-radius: 4rpx;
				margin-left: 20rpx;
				color: #ffffff;
			}
		}
	}
}
.nomore {
	width: 100vw !important;
	color: #999999;
	text-align: center;
	font-size: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
	&::after,
	&::before {
		content: "";
		position: absolute;
		top: 50%;
		background: #dddddd;
		height: 2rpx;
		width: 35%;
	}
	&::after {
		left: 40rpx;
	}
	&::before {
		right: 40rpx;
	}
}
</style>
