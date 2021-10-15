<template>
	<view class="wrapper">
		<view class="item-box">
			<view class="item" v-for="(it, i) in logList" :key="i">
				<view class="gold-left">
					<view>{{ it.typeName }}</view>
					<view class="gold-time">{{ it.createTime }}</view>
				</view>
				<view class="gold-right">{{ it.cdb > 0 ? "+" : "" }}{{ it.cdb }}</view>
			</view>
		</view>
	</view>
</template>
<script>
import { AjaxApi } from "@/utils/api";
export default {
	data() {
		return {
			params: {
				pageIndex: 1,
				pageSize: 10,
			},
			pageDown: false,
			logList: [],
		};
	},
	onReachBottom(e) {
		if (!this.pageDown) return;
		this.params.pageIndex++;
		this.init();
	},
	onLoad() {
		this.init();
	},
	methods: {
		init() {
			let successFuc = res => {
				if (!res?.data?.records.length) return;
				this.logList = this.logList.concat(res.data?.records);
				this.pageDown = Boolean(res.data.pages > res.data.current);
			};
			AjaxApi("LogList", this.params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7 !important;
}
.wrapper {
	width: 100%;
	padding-top: 20rpx;
	.item-box {
		background: #fff;
	}
	.item {
		padding: 20rpx 24rpx;
		border-top: 2rpx solid #f1f1f4;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.gold-left {
			font-size: 32rpx;
			font-weight: 500;
			color: #1c1c1d;
			line-height: 44rpx;
			.gold-time {
				font-size: 24rpx;
				font-weight: 400;
				color: #ababaf;
				line-height: 34rpx;
			}
		}
		.gold-right {
			font-size: 40rpx;
			font-weight: 500;
			color: #000001;
			line-height: 56rpx;
		}
	}
}
</style>
