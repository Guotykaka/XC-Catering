<template>
	<view class="container">
		<view v-if="addressList.length > 0" class="address-list-box">
			<view
				class="address-box u-flex u-row-between"
				v-for="(item, index) in addressList"
				:key="index"
				:class="[addressList.length - 1 == index ? 'border-none' : '']"
				@tap="junpOrder(item)"
			>
				<view class="address-left">
					<view class="address-info u-flex u-row-left">
						<text class="address m-r-style">{{ item.province }}{{ item.city }}{{ item.area }}</text>
						<text class="span-style-b span-style m-r-style" v-if="item.isDefault == 0">常用</text>
						<text class="span-style-g span-style m-r-style" v-if="item.mark == 0">公司</text>
						<text class="span-style-r span-style m-r-style" v-if="item.mark == 1">学校</text>
						<text class="span-style-y span-style m-r-style" v-if="item.mark == 2">家</text>
					</view>
					<view class="address-item">{{ item.address }}</view>
					<view class="user-info">
						<text>{{ item.relationPerson }} {{ item.sex == 0 ? "（先生）" : "（女士）" }}</text>
						<text>{{ item.phone }}</text>
					</view>
				</view>
				<view class="icon-box u-flex u-row-right u-col-center" @tap.stop="editAddress(item)">
					<view class="iconfont icon-edit u-font-16"></view>
				</view>
			</view>
		</view>
		<view v-else class="none-list-box">
			<view class="none-list"></view>
		</view>
		<view class="add-address-btn u-flex u-row-center" @tap="jumpAddAddress">
			<text class="iconfont icon-add u-m-r-8"></text>
			<text>新增地址</text>
		</view>
		<u-modal v-model="showModal" :show-title="false" confirm-text="我知道了" :confirm-style="confirmStyle" :async-close="false" @confirm="confirm">
			<view class="title u-text-center u-p-t-22 u-p-b-22">超出配送范围</view>
			<view class="slot-content">
				<text class="u-text-center u-font-14" style="color: #666666; font-weight: 400">该收货地址距离商家较远，请选择较近地址。</text>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
export default {
	data() {
		return {
			sextype: 0,
			from: false,
			showModal: false,
			addressList: [],
			canbida: {
				activityId: 0,
				storeId: 0,
			},
			addressId: null,
			confirmStyle: {
				//输入模态框确认按钮的颜色
				color: "#CEAE73",
			},
		};
	},
	onLoad(options) {
		this.from = options?.from == "true" ? true : false;
		this.canbida.activityId = options?.activityId ?? this.canbida.activityId;
		this.canbida.storeId = options?.storeId ?? this.canbida.storeId;
	},
	onShow() {
		this.getAdrList();
	},
	onUnload() {
		let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
		let prevPage = pages[pages.length - 2];
		prevPage.$vm.sextype = this.sextype;
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		getAdrList() {
			let params = {};
			let successFuc = res => {
				this.addressList = res.data;
			};
			AjaxApi("GetAddressList", params, successFuc);
		},
		cityChange(e) {},
		jumpAddAddress() {
			uni.navigateTo({
				url: `/pagesB/addAddress/addAddress`,
			});
		},
		editAddress(item) {
			uni.navigateTo({
				url: `/pagesB/editAddress/editAddress?id=${item.id}`,
			});
		},
		async junpOrder(obj) {
			if (this.from) return;
			let pages = getCurrentPages();
			let prevPage = pages[pages.length - 2]; //上一个页面
			let route = prevPage.route;
			const type = Boolean(route == "pagesA/confirmOrder/confirmOrder");
			const typeCan = Boolean(route == "pagesCan/settle/settle");
			if (typeCan) {
				getApp().globalData.previewImage = false;
				let params = {
					addressId: obj.id,
					activityId: this.canbida.activityId,
					storeId: this.canbida.storeId,
				};
				let successFuc = res => {
					uni.navigateBack();
				};
				AjaxApi("CanUpdate", params, successFuc);
				return;
			} else if (!type) {
				getApp().globalData.previewImage = false;
				let params = {
					addressId: obj.id,
				};
				let successFuc = res => {
					uni.navigateBack();
				};
				AjaxApi("UpdatePdAddress", params, successFuc);
				return;
			}
			this.sextype = obj.sex;
			this.addressId = obj.id;
			let params = {
				addressId: this.addressId,
				shopId: prevPage.$vm.orderPara.shopId,
				price: prevPage.$vm.orderPara.productAmount,
			};
			let res = await store.dispatch("SelectAddress", params);
			console.log(res.data);
			if (res.code == 0) {
				if (res.data.exceedCapacity) {
					this.showModal = true;
					return;
				}
				let obj = {
					addressId: this.addressId,
					shippingFee: res.data.shippingFee,
					realityShippingFee: res.data.realityShippingFee,
					deliveryNo: res.data.deliveryNo,
					location: res.data.location,
					recipientAddress: res.data.address,
					recipientName: res.data.relationPerson,
					recipientPhone: res.data.phone,
				};
				prevPage.$vm.orderPara = { ...prevPage.$vm.orderPara, ...obj };
				prevPage.$vm.deliverTime = res.data.expectTime;
				uni.navigateBack({
					delta: 1,
				});
			} else {
				this.showModal = true;
			}
		},
		confirm() {
			this.showModal = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding-top: 20rpx;
	background: #f9fafb;
	.none-list-box {
		display: flex;
		justify-content: center;
		.none-list {
			width: 240rpx;
			height: 144rpx;
			background: url(https://oss.dianddian.cn/v2/none.png) top no-repeat;
			background-size: 100% auto;
			background-position: center;
			min-height: 400rpx;
		}
	}
	.address-list-box {
		// background: #ffffff;

		padding: 0rpx 20rpx;
		.border-none {
			border: 0 !important;
		}
		.address-box {
			width: 100%;
			padding: 38rpx 20rpx 34rpx 20rpx;
			border-bottom: 2rpx solid #dddddd;
			.address-left {
				flex: 1;
				width: 0;
			}
			.address-info {
				margin-bottom: 8rpx;
				height: 44rpx;
				line-height: 44rpx;
				.address {
					font-size: 32rpx;
					font-weight: bold;
					color: #333333;
					opacity: 1;
				}
				.m-r-style {
					margin-right: 12rpx;
				}
				.span-style {
					width: 61rpx;
					font-size: 20rpx;
					text-align: center;
					line-height: 28rpx;
					box-sizing: border-box;
					border-radius: 4rpx;
				}
				.span-style-b {
					border: 2rpx solid#E5CDA1;
					color: #e5cda1;
				}
				.span-style-g {
					border: 2rpx solid rgba(19, 236, 120, 1);
					color: #13ec78;
				}
				.span-style-r {
					border: 2rpx solid rgba(236, 20, 20, 1);
					color: #ec1414;
				}
				.span-style-y {
					border: 2rpx solid rgba(254, 194, 13, 1);
					color: #fec20d;
				}
			}
			.icon-box {
				height: 100rpx;
				width: 100rpx;
			}
			.address-item {
				margin-bottom: 8rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				white-space: normal;
				word-break: break-all;
			}
			.user-info {
				height: 34rpx;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 30rpx;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
		}
	}
	.add-address-btn {
		margin: 20rpx auto 40rpx;
		width: 670rpx;
		height: 100rpx;
		background: #fff;
		font-size: 32rpx;
		color: #e5cda1;
		font-weight: bold;
		border-radius: 8rpx;
		border: 2rpx dashed #dddddd;
		box-sizing: border-box;
	}
	.slot-content {
		padding: 20rpx 44rpx 44rpx;
	}
}
</style>
