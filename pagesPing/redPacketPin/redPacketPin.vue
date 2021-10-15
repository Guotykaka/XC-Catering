<template>
	<view class="container" :style="{ 'padding-top': contentPadding + 'px' }">
		<u-navbar back-icon-name="home" title="拼餐红包" :custom-back="turnTo"></u-navbar>
		<u-modal
			v-model="showModel"
			:content="data.content"
			:show-cancel-button="false"
			:show-title="false"
			confirm-text="关闭"
			confirm-color="#343434"
		></u-modal>
		<view class="box">
			<view>拼餐红包</view>
			<view><text v-show="data.num">¥</text> {{ data.num || "" }}</view>
			<view>{{ data.textStr }}</view>
			<view class="btn" @tap="reLaunch">开始拼餐</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL } from "@/utils/api";
import { paramConversion } from "@/utils";
import { appInit } from "@/utils";
export default {
	data() {
		return {
			phone: null,
			activity: null,
			showModel: false,
			data: {
				num: 0,
				textStr: "",
				content: "你已领过该红包",
			},
			contentPadding: 48,
		};
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	onLoad(query) {
		if (query?.q) {
			//https://ddd.dianddian.cn/scanredbag?phone=18671657437&activity=1
			let link = paramConversion(decodeURIComponent(query?.q));
			this.phone = link.phone;
			this.activity = link.activity;
		} else {
			this.showModel = true;
			this.data.textStr = "扫码失败";
			this.data.content = "扫码失败";
			return;
		}
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
		this.contentPadding =
			uni.getSystemInfoSync().platform == "ios" ? 44 + uni.getSystemInfoSync().statusBarHeight : 48 + uni.getSystemInfoSync().statusBarHeight;
		appInit(this.init);
	},
	methods: {
		init() {
			const params = {
				phone: this.phone,
				activityId: this.activity,
			};
			const successFuc = res => {
				if (res.code === 81201 || res.code === 81202 || res.code === 81203 || res.code === 81204) {
					this.showModel = true;
					this.data.textStr = res.msg;
					this.data.content = res.msg;
					this.data.num = res.data;
					uni.hideLoading();
					return;
				}
				this.data.textStr = "已存入“我的-我的红包”";
				this.data.content = res.msg;
				this.data.num = res.data;
				uni.hideLoading();
			};
			AjaxApi("TakeRedPacketPin", params, successFuc);
		},
		turnTo() {
			uni.reLaunch({
				url: `/pages/index/index`,
			});
		},
		reLaunch() {
			uni.reLaunch({
				url: `/pages/spellOrder/spellOrder`,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding-top: 48px;
	min-height: 100vh;
	height: 1300rpx;
	background: url("https://oss.dianddian.cn/v2/pindan/scan_red_bg.png") #ffb056 no-repeat;
	background-size: contain;
	background-repeat: no-repeat;
	background-origin: content-box;
	position: relative;
	.box {
		min-height: 694rpx;
		background: url("https://oss.dianddian.cn/v2/pindan/sacn_red_bag.png") no-repeat;
		background-position: center;
		background-size: contain;
		position: relative;
		text-align: center;
		padding-top: 96rpx;
		color: #ff3b3b;
		> view {
			&:first-child {
				font-size: 32rpx;
				font-weight: bold;
			}
			&:nth-child(2) {
				font-weight: bold;
				font-size: 112rpx;
				min-height: 130rpx;
				text {
					font-size: 50rpx;
				}
			}
			&:nth-child(3) {
				font-size: 28rpx;
				color: #8f8484;
			}
		}
	}
	.btn {
		width: 560rpx;
		height: 112rpx;
		position: absolute;
		bottom: 86rpx;
		left: 50%;
		text-align: center;
		line-height: 112rpx;
		font-size: 36rpx;
		color: #ff0e00;
		transform: translate(-50%, 0);
		background: linear-gradient(180deg, #ffe89d 0%, #ff9d00 100%);
		box-shadow: 0px 5px 10px -5px rgba(0, 0, 0, 0.3);
		border-radius: 62rpx;
	}
}
</style>
