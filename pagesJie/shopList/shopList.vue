<template>
	<view class="content">
		<view v-for="(it, i) in shopList" :key="i" @tap="shopLoc(it)">
			<view>
				<view class="u-font-28 bold u-m-b-4">{{ it.shopName }}({{ it.storeName }})</view>
				<view class="u-font-20">
					<text style="color: #ff0000" class="u-m-r-6" v-if="!i">离我最近</text>
					<text style="color: #666666" class="u-m-r-6">{{ comprice(it.distance) }} km</text>
					<text style="color: #666666">| {{ it.address }} </text>
				</view>
			</view>
			<view class="phone u-flex" @tap.stop="phoneCall(it.phone)">
				<text class="iconfont icondianhua"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import { AjaxApi } from "@/utils/api";
	import { appInit } from "@/utils";
	import { Decimal } from "decimal.js";
	export default {
		data() {
			return {
				activityId: 0,
				shopList: [],
			};
		},
		onShow() {
			if (getApp().globalData.previewImage) {
				getApp().globalData.previewImage = false;
				return;
			}
			appInit(this.init);
		},
		onLoad(query) {
			this.activityId = query?.Id ?? 0;
		},
		methods: {
			init() {
				uni.showLoading({
					title: "加载中...",
					mask: true,
				});
				let { longitude, latitude } = getApp().globalData.location;
				let params = {
					jlId: this.activityId,
					userLongitude: longitude,
					userLatitude: latitude,
				};
				let successFuc = res => {
					this.shopList = res.data;
				};
				let elseFuc = err => {
					uni.navigateBack();
				};
				AjaxApi("GetChainsShops", params, successFuc, elseFuc);
			},
			comprice(price) {
				return new Decimal(price).div(new Decimal(1000)).toDP(2);
			},
			shopLoc(it) {
				const address = it.address;
				const name = it.shopName;
				const latitude = it.location.split(",")[1] * 1;
				const longitude = it.location.split(",")[0] * 1;
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
			phoneCall(phoneNumber) {
				uni.makePhoneCall({
					phoneNumber: phoneNumber,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		font-family: custom;
		color: #1c1c1d;
		.iconfont {
			color: #fe6b00;
			font-size: 32rpx;
		}
		.phone {
			margin-left: 56rpx;
			flex-shrink: 0;
		}
		.bold {
			font-weight: bold;
		}
		> view {
			background: white;
			padding: 30rpx 44rpx;
			display: flex;
			justify-content: space-between;
			position: relative;
			&:not(:last-of-type) {
				&:after {
					content: "";
					background: #e2e2e2;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translate(-50%, 0);
					height: 2rpx;
					width: calc(100% - 88rpx);
				}
			}
		}
	}
</style>
