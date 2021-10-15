<template>
	<u-mask :show="inviteMask" z-index="10090" :duration="0" :custom-style="{ background: 'rgba(0, 0, 0, 0.71)' }" @click="hideInvite()">
		<view class="mask-slot">
			<u-loading :show="inviteLoading" class="mask-slot" color="#E5CDA1"></u-loading>
			<view class="invite-con" v-show="!inviteLoading">
				<view class="content">
					<text>{{ maxAmount }}</text><text>元</text>
				</view>
				<button class="btn-invite" open-type="share" plain="true" data-type="invite">喊好友马上领红包</button>
			</view>
			<u-icon name="close" color="#fff" size="32" v-show="!inviteLoading"></u-icon>
		</view>
	</u-mask>
</template>

<script>
import store from "@/store";
import { getObjType } from "@/utils";
export default {
	name: "uAct",
	props: {
		// 通过双向绑定控制组件的弹出与收起
		inviteMask: {
			type: Boolean,
			default: false,
		},
		inviteLoading: {
			type: Boolean,
			default: false,
		},
		maxAmount: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {},
	methods: {
		hideInvite() {
			this.$emit("inVite");
		},
	},
};
</script>
<style lang="scss">
.mask-slot {
	/deep/.u-loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	/deep/u-icon {
		position: absolute;
		bottom: 10%;
		left: 50%;
		transform: translate(-50%, 0);
		margin: auto;
	}
	.invite-con {
		position: fixed;
		top: -200rpx;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 582rpx;
		height: 722rpx;
		background: url("https://oss.dianddian.cn/activity/zhuli/zhuli_share_1.png");
		background-size: contain;
		background-repeat: no-repeat;
		text-align: center;
		.content {
			margin-top: 300rpx;
			text {
				&:first-child {
					font-size: 108rpx;
					font-weight: bold;
					line-height: 52rpx;
					color: #6a5735;
				}
				&:last-child {
					font-size: 32rpx;
					font-weight: bold;
					line-height: 52rpx;
					color: #6a5735;
				}
			}
		}
		.btn-invite {
			border: 0;
			position: absolute;
			bottom: 8%;
			left: 50%;
			transform: translate(-50%, 0);
			background: radial-gradient(circle, #e5cda1 0%, #ceae73 100%);
			box-shadow: 0 10rpx 20rpx rgba(106, 85, 22, 0.2);
			border-radius: 16rpx;
			width: 440rpx;
			height: 90rpx;
			font-size: 32rpx;
			font-weight: bold;
			line-height: 90rpx;
			color: #6a5735;
		}
	}
}
</style>
