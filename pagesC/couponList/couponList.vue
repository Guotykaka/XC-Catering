<template>
	<view class="wrapper">
		<view class="tabs-box">
			<u-tabs :list="list" :is-scroll="false" :current="currentTab" @change="changeTab" active-color="#FE6B00" inactive-color="#1C1C1D"></u-tabs>
		</view>
		<view class="item-con">
			<view class="item-box">
				<view class="item" v-for="(it, i) in couponList" :key="i">
					<view
						class="redEnvelope-left"
						:style="{
							background: Boolean(currentTab !== 0) ? '#ECECEE' : it.source == 0 ? '#FFF4ED' : '#FFF1F1',
							color: Boolean(currentTab !== 0) ? '#ABABAF' : it.source == 0 ? '#FE6B00' : '#FF3B3B',
						}"
					>
						<view class="redEnvelope-num">
							<text>¥</text>
							<text>{{ it.amount }}</text>
						</view>
						<view class="redEnvelope-info">满{{ it.usedAmount ? it.usedAmount : 0 }}元可用</view>
					</view>
					<view class="redEnvelope-right">
						<view>
							<view
								class="redEnvelope-name"
								:style="{
									color: Boolean(currentTab !== 0) ? '#ABABAF' : '#1c1c1d',
								}"
								>{{ it.redPacketName }}</view
							>
							<view class="redEnvelope-time">{{ !it.type ? "长期有效" : getCurrent(it.validRemark) }}</view>
						</view>
						<view
							class="redEnvelope-btn"
							:style="{ background: Boolean(currentTab !== 0) ? '#ABABAF' : it.source == 0 ? '#FE6B00' : '#FF3B3B' }"
							@tap="chooseOne"
						>
							{{ currentTab == 0 ? "去使用" : currentTab == 1 ? "已使用" : "已过期" }}
						</view>
						<view class="redEnvelope-tag" v-if="it.isShare == 0 && Boolean(currentTab == 0)">同享券</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			list: [
				{
					name: "待使用",
				},
				{
					name: "已使用",
				},
				{
					name: "已过期",
				},
			],
			couponList: [],
			pageDown: true, //翻页标识
			params: {
				pageIndex: 1,
				pageSize: 10,
				isExpire: 1,
				isTake: 0,
				isUsed: 0,
			},
			currentTab: 0,
		};
	},
	onReachBottom(e) {
		if (this.pageDown) {
			this.params.pageIndex++;
			this.init();
		} else {
			uni.showToast({
				title: "无更多优惠券",
				icon: "none",
				duration: 1000,
			});
		}
	},
	onLoad() {
		this.init(true);
	},
	methods: {
		changeTab(index) {
			this.currentTab = index;
			this.params = {
				pageIndex: 1,
				pageSize: 10,
				isExpire: 1, //是否过期,0:是,1:否
				isTake: 0, //是否领取,0:是,1:否
				isUsed: 0, //是否使用,0:待使用,1:已使用
				// saleType: 0, //0:堂食券,1:外卖券,2:通用券（堂食+外卖）
				// source: 0, //红包券来源,0:平台,1:商家
			};
			this.init(true);
		},
		getcurentDate(val) {
			let time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
			let format = val.replace(/-/g, "/");
			return (new Date(format).getTime() - new Date(time).getTime()) / 86400000;
		},
		getNowDate(v) {
			let time = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
			let format = v.replace(/-/g, "/");
			return `还剩${parseInt((new Date(format).getTime() - new Date(time).getTime()) / 84600000)}天到期`;
		},
		getCurrent(v) {
			if (v == "长期有效") {
				return "长期有效";
			}
			return this.getcurentDate(v) > 5
				? `有效期至${v.split(" ")[0]}`
				: this.getcurentDate(v) < 1
				? `有效期至${v.slice(0, 11).replace(/-/g, ".")}`
				: this.getNowDate(v);
		},
		chooseOne() {
			if (this.currentTab !== 0) return;
			const pages = getCurrentPages();
			const currPage = pages[pages.length - 2];
			if (currPage?.route == "pages/member/member") {
				uni.switchTab({
					url: "/pages/spellOrder/spellOrder",
				});
			} else {
				uni.switchTab({
					url: "/pages/index/index",
				});
			}
		},
		init(first = false) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.params.isExpire = this.currentTab == 2 ? 0 : 1;
			this.params.isUsed = this.currentTab == 1 ? 1 : 0;
			let successFuc = res => {
				if (first) this.couponList = [];
				if (!res?.data.records.length) {
					uni.showToast({
						title: "暂无优惠券",
						icon: "none",
						duration: 1500,
					});
					return;
				}
				this.couponList = this.couponList.concat(res.data.records);
				let { pages, current } = res.data;
				this.params.pageIndex = current;
				this.pageDown = Boolean(pages > current);
			};
			AjaxApi("SelectUserRedPacketList", this.params, successFuc);
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7 !important;
}
.wrapper {
	.tabs-box {
		background: #f6f6f7;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}
	.item-con {
		width: 100%;
		padding: 100rpx 24rpx 20rpx 24rpx;
		.item-box {
			.item {
				background: #fff;
				border-radius: 16rpx;
				height: 180rpx;
				display: flex;
				margin-bottom: 20rpx;
				.redEnvelope-left {
					padding-top: 34rpx;
					padding-bottom: 46rpx;
					width: 200rpx;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					background: #fff4ed;
					border-radius: 8px 0px 0px 8px;
					color: #fe6b00;
					.redEnvelope-num {
						height: 66rpx;
						vertical-align: bottom;
						font-size: 48rpx;
						font-weight: 500;
						> text {
							&:first-child {
								margin-bottom: 10rpx;
								font-size: 24rpx;
							}
							&:last-child {
								line-height: 66rpx;
							}
						}
					}
					.redEnvelope-info {
						font-size: 24rpx;
						font-weight: 400;
						line-height: 34rpx;
					}
				}
				.redEnvelope-right {
					display: flex;
					width: 0;
					flex: 1;
					padding: 0 30rpx;
					position: relative;
					align-items: center;
					justify-content: space-between;
					.redEnvelope-name {
						font-size: 32rpx;
						font-weight: 500;
						color: #1c1c1d;
						line-height: 44rpx;
						margin-bottom: 10rpx;
					}
					.redEnvelope-time {
						font-size: 24rpx;
						font-weight: 400;
						color: #ababaf;
						line-height: 34rpx;
					}
					.redEnvelope-btn {
						flex-shrink: 0;
						width: 132rpx;
						height: 50rpx;
						background: #fe6b00;
						border-radius: 32rpx;
						color: #fff;
						font-size: 24rpx;
						font-weight: 600;
						color: #ffffff;
						line-height: 50rpx;
						text-align: center;
					}
					.redEnvelope-tag {
						position: absolute;
						top: 0;
						right: 0;
						width: 78rpx;
						height: 30rpx;
						background: #ff3b3b;
						border-radius: 0px 16rpx 0px 16rpx;
						font-size: 18rpx;
						font-weight: 500;
						color: #ffffff;
						line-height: 30rpx;
						text-align: center;
					}
				}
			}
		}
	}
}
</style>
