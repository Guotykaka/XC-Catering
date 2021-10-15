<template>
	<view class="wrap">
		<view class="address-box">
			<view class="address-title">配送地址</view>
			<view class="textarea-box">
				<textarea
					@input="getAddress"
					auto-height
					placeholder-style="font-size:32rpx;color:#DDDDDD"
					placeholder="请输入详细地址"
					:value="orderAddress"
					cursor-spacing="200"
					disabled
				></textarea>
			</view>
		</view>
		<view class="box-bot">
			<view class="item-box">
				<view class="left">电话</view>
				<view class="right">
					<input type="number" placeholder-style="font-size:32rpx;color:#DDDDDD" placeholder="请输入手机号" @input="getPhone" :value="orderPhone" />
				</view>
			</view>
			<view class="item-box">
				<view class="left">联系人</view>
				<view class="right">
					<input type="text" placeholder-style="font-size:32rpx;color:#DDDDDD" placeholder="请输入联系人" @input="getName" :value="userName" />
				</view>
			</view>
			<view class="item-box" style="border: none">
				<view class="left">订单备注</view>
				<view class="textArea-box">
					<textarea
						placeholder-style="font-size:32rpx;color:#DDDDDD"
						auto-height
						placeholder="口味/餐具/配送要求等"
						@input="getRemark"
						maxlength="120"
						:value="orderRemark"
					></textarea>
				</view>
			</view>
		</view>
		<view class="sure-btn" @tap="updataMsg">确认</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
import store from "@/store";
import { URL } from "@/utils/api";
export default {
	data() {
		return {
			orderId: null,
			orderAddress: "",
			orderPhone: null,
			userName: "",
			orderRemark: "",
		};
	},

	onLoad(option) {
		this.orderId = null;
		this.orderAddress = "";
		this.orderPhone = null;
		this.userName = "";
		this.orderRemark = "";
		this.orderId = option.orderId;
		this.getOrderDetail(option.orderId);
	},
	onUnload() {
		let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

		let prevPage = pages[pages.length - 2];
		prevPage.$vm.orderDetail.remark = this.orderRemark;
		// prevPage.$vm.orderDetail.recipientAddress=this.orderAddress;
		prevPage.$vm.orderDetail.recipientName = this.userName;
		prevPage.$vm.orderDetail.orderPhone = this.orderPhone;
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		getPhone(e) {
			this.orderPhone = e.detail.value;
		},
		getName(e) {
			this.userName = e.detail.value;
		},
		getRemark(e) {
			this.orderRemark = e.detail.value;
		},
		updataMsg() {
			//        if(!this.orderAddress){
			//                uni.showToast({
			//                        title:'地址不能为空！',
			//                        icon:'none',
			//                        duration:2000
			//                })
			//                return
			//        }
			if (!this.userName) {
				uni.showToast({
					title: "收货人姓名不能为空！",
					icon: "none",
					duration: 2000,
				});
				return;
			} else {
				console.log(this.userName.replace(/[^\x00-\xff]/g, "01").length);
				if (this.userName.replace(/[^\x00-\xff]/g, "01").length > 30) {
					uni.showToast({
						title: "收货人姓名不能超过15个字符！",
						icon: "none",
						duration: 2000,
					});
					return;
				}
			}
			if (!this.orderPhone) {
				uni.showToast({
					title: "收货人手机号不能为空！",
					icon: "none",
					duration: 2000,
				});
				return;
			}
			let params = {
				orderId: this.orderId,
				recipientAddress: this.orderAddress,
				recipientName: this.userName,
				recipientPhone: this.orderPhone,
				remark: this.orderRemark,
			};
			let successFuc = res => {
				if (res.code == 0) {
					uni.navigateBack();
				}
			};
			AjaxApi("UpdateOrderMsg", params, successFuc);
		},
		getOrderDetail(val) {
			const params = {
				orderId: val,
			};
			let successFuc = res => {
				this.orderAddress = res.data.recipientAddress;
				this.orderPhone = res.data.recipientPhone;
				this.userName = res.data.recipientName;
				this.orderRemark = res.data.remark;
			};
			AjaxApi("OrderDetail", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	background: #f9fafb;
	padding-top: 20rpx;
	.address-box {
		padding: 0rpx 40rpx;
		background: #fff;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		.address-title {
			padding: 18rpx 0rpx;
			font-size: 32rpx;
			font-weight: bold;
			line-height: 44rpx;
			color: #333333;
			opacity: 1;
		}
		.textarea-box {
			height: 108rpx;
			margin: 28rpx 0 24rpx 0;
			background: #fff;
			box-sizing: border-box;
			font-size: 32rpx;
			font-weight: 400;
			color: #333333;
			opacity: 1;
			textarea {
				height: 100%;
				width: 100%;
			}
		}
	}
	.box-bot {
		margin-bottom: 140rpx;
		padding: 0rpx 40rpx;
		background: #fff;
		.item-box {
			border-bottom: 1rpx solid #e2e2e2;
			padding-top: 34rpx;
			padding-bottom: 32rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 32rpx;
			font-weight: 400;
			line-height: 15px;
			color: #333333;
			.left {
				width: 156rpx;
				line-height: 44rpx;
			}
			.right {
				flex: 1;
				line-height: 44rpx;
			}
			.textArea-box {
				flex: 1;
				textarea {
					width: 100%;
					height: 44rpx;
				}
			}
		}
	}
	.sure-btn {
		text-align: center;
		margin: 0rpx auto;
		width: 670rpx;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		height: 100rpx;
		background: #e5cda1;
		opacity: 1;
		border-radius: 8rpx;
		line-height: 100rpx;
		color: #fff;
		font-size: 36rpx;
		font-weight: 500;
	}
}
</style>
