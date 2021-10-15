<template>
	<view class="wrapper">
		<view class="info-box">
			<u-icon name="checkmark-circle" color="#0CCB54" size="160"></u-icon>
			<view class="text-style">支付成功!</view>
		</view>
		<view class="btn-style">返回(5s)</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7 !important;
}
.wrapper {
	padding: 150rpx 20rpx 0rpx;
	.info-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.text-style {
			font-size: 32rpx;
			font-weight: 400;
			color: #1c1c1d;
			line-height: 44rpx;
			margin-top: 70rpx;
		}
	}
	.btn-style {
		line-height: 96rpx;
		width: 100%;
		background: #fe6b00;
		border-radius: 48rpx;
		margin-top: 130rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: #ffffff;
		text-align: center;
	}
}
</style>
