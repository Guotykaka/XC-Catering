<template>
	<view class="container u-p-b-40">
		<view class="inx-head">
			<image
				class="img"
				:src="`https://oss.dianddian.cn/v2/activity/newindex/${!freeCard.isExpire ? 'freecard' : 'freecarded'}.png`"
				mode="widthFix"
			></image>
			<view class="btn u-font-32 bold u-m-t-20" @tap="tapBtn">{{ !freeCard.isActivate * 1 ? "去拼餐" : "去激活" }}</view>
		</view>
		<view class="inx-to-tit">
			<view class="u-font-32 bold" style="color: #1c1c1d">市集拼餐</view>
		</view>
		<view class="inx-to-goods" v-for="(item, inx) in groupGoods" :key="inx">
			<view class="u-m-b-20" @tap="toSpellOrder(item)">
				<view>
					<image class="img-a" :src="groupPic" mode="widthFix"></image>
					<view class="u-m-l-20">
						<view class="u-font-28 bold" style="color: #1c1c1d">{{ item.name }}</view>
						<view class="u-font-24" style="color: #ababaf">距离{{ item.distance }}</view>
					</view>
				</view>
				<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-arrow-r.png" mode="widthFix"></image>
			</view>
			<view>
				<view
					class="inx-to-good"
					v-for="(its, i) in item.listGroupShopGoodsInfo"
					:key="i"
					:style="{
						marginRight: Boolean((i + 1) % 3 == 0) ? '0' : Boolean(i + 1 == item.listGroupShopGoodsInfo.length) ? '122px' : 'auto',
					}"
					@tap="toSpellOrder(its)"
				>
					<view>
						<image
							:src="`${its.coverPic ? its.coverPic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`"
							mode="aspectFill"
						></image>
					</view>
					<view class="u-p-10">
						<view class="u-font-24 u-line-1" style="color: #1c1c1d">{{ its.goodsName }}</view>
						<view style="color: #ff3b3b">
							<text class="bold u-font-20">¥</text>
							<text class="bold u-font-24">{{ its.wmDiscountPrice }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { AjaxApi, SHARE_URL, PromiseAll } from "@/utils/api";
import { getUserLocation } from "@/utils";
import store from "@/store";
export default {
	data() {
		return {
			time: 0,
			shopImg: "https://oss.dianddian.cn/shop/%E9%BB%98%E8%AE%A4%E5%BA%97%E9%93%BAlogo%403x.png",
			groupPic: "https://oss.dianddian.cn/v2/activity/newindex/groupPic.png", //市集头像
			freeCard: {
				isExpire: 1,
				isActivate: 0,
			}, //isExpire 是否过期,0:否,1:是  isActivate 是否能去激活,0:否,1:是
			list: [],
			groupGoods: [],
			pagesPram: {
				pageDown: false,
				pageIndex: 1,
				pageSize: 3,
			},
		};
	},
	onReachBottom(e) {
		if (this.pagesPram.pageDown) {
			this.pagesPram.pageIndex++;
			this.getGroupGoods();
		}
	},
	onLoad(options) {
		this.recommendId = options?.recommendId ?? this.recommendId;
	},
	onShow() {
		uni.showLoading({
			title: "",
		});
		this.pagesPram.pageIndex = 1;
		getUserLocation(this.init, true);
	},
	onShareAppMessage: function () {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		init() {
			this.getGroupGoods(true);
			let proList = [
				store.dispatch("GetFreeCard", {}), //拼餐卡详情
			];

			let thenFuc = async res => {
				let resArr = res.map(a => a.data);
				this.freeCard = resArr[0] ?? this.freeCard;
			};
			let catchFuc = err => {
				uni.hideLoading();
			};
			PromiseAll(proList, thenFuc, catchFuc);
		},
		getGroupGoods(first = false) {
			let { pageIndex, pageSize } = this.pagesPram;
			let successFuc = async res => {
				if (first) {
					this.groupGoods = [];
					this.pagesPram = {
						pageDown: false,
						pageIndex: 1,
						pageSize: 3,
					};
				}
				if (!res?.data?.data.length) return;
				this.groupGoods = this.groupGoods.concat(res.data?.data);
				let { pageCount, pageIndex } = res.data;
				this.pagesPram.pageIndex = pageIndex;
				this.pagesPram.pageDown = Boolean(pageIndex < pageCount);
			};
			AjaxApi(
				"SelectMakeUpList2",
				{ pageIndex, pageSize, userLatitude: getApp().globalData.location.latitude, userLongitude: getApp().globalData.location.longitude * 1 },
				successFuc
			);
		},
		setCard() {
			uni.showLoading({
				title: "",
			});
			let successFuc = async res => {
				let page = getCurrentPages().pop(); //获取当前页面实例
				if (page == undefined || page == null) return;
				page.onLoad();
			};
			AjaxApi("SetFreeCard", {}, successFuc);
		},
		tapBtn() {
			if (this.freeCard.isActivate) {
				this.setCard();
			} else {
				this.toSpellOrder();
			}
		},
		toSpellOrder(its = {}) {
			uni.reLaunch({
				url: `/pages/spellOrder/spellOrder?storeId=${its?.storeId ?? 0}&shopId=${its?.shopId ?? 0}`,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	background: #f6f6f7;
	min-height: 100vh;
	.bold {
		font-weight: bold;
	}
	.inx-head {
		padding: 0 24rpx;
		.btn {
			height: 96rpx;
			line-height: 96rpx;
			background: linear-gradient(135deg, #ffe1c4 0%, #e9ad7e 100%);
			border-radius: 48rpx;
			color: #8c5730;
			text-align: center;
		}
	}
	.img {
		width: 100%;
		vertical-align: bottom;
	}
	.inx-to-tit {
		margin: 40rpx 24rpx 0 24rpx;
	}
	.inx-to-goods {
		margin: 20rpx 24rpx;
		padding: 20rpx;
		background: white;
		> view {
			&:first-of-type {
				display: flex;
				justify-content: space-between;
				> view {
					display: flex;
					> view {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
				}
				image {
					vertical-align: middle;
					&.img-a {
						width: 74rpx;
						height: 74rpx;
					}
					&.img-b {
						width: 16rpx;
						height: 24rpx;
					}
				}
			}
			&:nth-of-type(2) {
				display: flex;
				flex-wrap: wrap;
				image {
					width: 208rpx;
					height: 160rpx;
				}
				.inx-to-good {
					border-radius: 6rpx;
					overflow: hidden;
					width: 208rpx;
					min-width: 0;
					> view {
						&:first-of-type {
							height: 160rpx;
						}
						&:nth-of-type(2) {
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							height: 88rpx;
							background: #f6f6f7;
						}
					}
				}
			}
		}
	}
}
</style>
