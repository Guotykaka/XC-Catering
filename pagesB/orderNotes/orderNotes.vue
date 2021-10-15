<template>
	<view class="container">
		<view class="textarea-box">
			<textarea
				placeholder="请输入"
				placeholder-style="font-size:28rpx;color:#DDDDDD"
				maxlength="50"
				:value="orderNotes"
				@input="getValue"
				auto-height
				cursor-spacing="200"
			></textarea>
		</view>
		<view class="notes-box">
			<view class="notes-item" @tap="getText(item)" v-for="(item, index) in orderTagList" :key="index">{{ item }}</view>
		</view>
		<view class="sure-btn u-text-center" @tap="jumpOrder">确定</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			value: "",
			orderNotes: "",
			orderTagList: [],
		};
	},
	onLoad(options) {
		if (options.remark) {
			this.orderNotes = options.remark;
		}
	},
	onShow() {
		this.getRemarkLabel();
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		getValue(e) {
			this.orderNotes = e.detail.value;
		},
		getText(val) {
			if (!this.orderNotes) {
				this.orderNotes = val;
			} else {
				this.orderNotes = this.orderNotes.concat("，", val);
			}
		},
		jumpOrder() {
			const pages = getCurrentPages();
			const prevPage = pages[pages.length - 2]; //上一个页面
			prevPage.$vm.orderPara.remark = this.orderNotes;
			uni.navigateBack();
		},
		getRemarkLabel() {
			let params = {};
			let successFuc = res => {
				if (res.code == 0) {
					this.orderTagList = res.data;
				}
			};
			AjaxApi("GetRemarkLabel", params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	.textarea-box {
		border-radius: 8rpx;
		background: #fff;
		height: 240rpx;
		padding: 24rpx 40rpx;
		margin-bottom: 44rpx;
	}
	textarea {
		width: 100%;
		height: 100%;
	}
	.notes-box {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin-bottom: 152rpx;
		.notes-item {
			margin-bottom: 20rpx;
			margin-right: 20rpx;
			line-height: 48rpx;
			background: rgba(255, 255, 255, 1);
			border: 2rpx solid rgba(213, 213, 213, 1);
			opacity: 1;
			border-radius: 4rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(102, 102, 102, 1);
			opacity: 1;
			padding: 0rpx 20rpx;
		}
	}
	.sure-btn {
		margin: 0rpx auto;
		width: 670rpx;
		box-sizing: border-box;
		height: 100rpx;
		background:#E5CDA1;
		opacity: 1;
		border-radius: 8rpx;
		line-height: 100rpx;
		color: #fff;
		font-size: 36rpx;
		font-weight: 500;
	}
}
</style>
