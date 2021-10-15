<template>
	<view class="contain">
		<u-mask :show="evaluationMask" :custom-style="{ background: 'rgba(255,255,255, 1)' }" :mask-click-able="false"> </u-mask>
		<view class="store-evaluation-box">
			<view class="store-evaluation-top">
				<img :src="icon || '/static/img/default-man.png'" />
				<view>{{ storeName }}</view>
			</view>
			<view class="store-evaluation-bot">
				<view class="icon-item" v-for="(item, i) in goodsTypeList" :key="i" @tap="tapGoodsIcon(i)">
					<view class="iconfont icon-img" :class="[item.active ? 'color' : '', item.class]"></view>
					<view class="icon-text" :class="[item.active ? 'color' : '']">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="goods-evaluation-box">
			<view class="evaluation-text">评价</view>
			<view class="roat-box">
				<u-rate min-count="1" v-model="pramaters.score" active-color="#FF4D4F" inactive-color="#DDDDDD" size="48" gutter="24"></u-rate>
			</view>
			<view class="textArea-box">
				<u-input
					v-model="pramaters.content"
					type="textarea"
					:placeholder="placeholderText"
					placeholder-style="color:#999999; font-size: 28rpx;"
					height="116"
					maxlength="255"
					:clearable="true"
					:auto-height="true"
				/>
			</view>
			<view class="upload-image-box">
				<view class="upload-text">
					<view class="upload">
						<scroll-view scroll-x="true" v-if="pramaters.pic.length">
							<view style="display: flex; flex: 1; width: 0">
								<view class="up-urls" v-for="(item, i) in pramaters.pic" :key="i">
									<image src="../../static/img/del.png" class="del" @tap="delImg(i)"></image>
									<image
										class="img"
										mode="aspectFit"
										:src="`${item}?x-oss-process=image/resize,w_700`"
										@error="imageError"
										@tap="preEveImg(i)"
									>
									</image>
								</view>
							</view>
						</scroll-view>
						<view style="flex: 1">
							<view class="up-load border-style" style="width: 138rpx" @tap="chooseImg">
								<text class="up-load iconfont icon-add"></text><text>上传图片</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="goods-evaluation-box">
			<view class="evaluation-text">菜品评价</view>
			<view class="goods-roat-box" v-for="(item, index) in pramaters.goodsEvaluates" :key="index">
				<view class="goods-name">{{ item.goodsName }}</view>
				<u-rate min-count="1" v-model="item.score" active-color="#FF4D4F" inactive-color="#DDDDDD" size="34" gutter="24"></u-rate>
			</view>
		</view>
		<view class="store-evaluation-box" v-if="orderType == 0">
			<view class="store-evaluation-top">
				<img src="/static/img/deliveryPic.png" />
				<view>{{ evaluateDelivery.deliveryName ? evaluateDelivery.deliveryName : "匿名骑手" }}</view>
			</view>
			<view class="store-evaluation-bot">
				<view class="icon-item" v-for="(item, i) in typeList" :key="i" @tap="tapIcon(i)">
					<view class="iconfont icon-img" :class="[item.active ? 'color' : '', item.class]"></view>
					<view class="icon-text" :class="[item.active ? 'color' : '']">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="btn" @tap="submit">提交评论</view>
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
			orderType: 1,
			orderDetail: {},
			placeholderText: "",
			evaluationMask: false,
			// deliveryType:1,
			pramaters: {
				content: "",
				orderId: 0,
				pic: [],
				score: 5,
				type: 1, //(0非常差, 1非常好, 2一般)
				goodsEvaluates: [],
			},
			evaluateDelivery: {},
			goodsTypeList: [
				{ name: "非常差", class: "iconfeichangcha", active: false },
				{ name: "非常好", class: "iconfeichanghao", active: true },
				{ name: "一般", class: "iconyiban", active: false },
			],
			typeList: [
				{ name: "非常差", class: "iconfeichangcha", active: false },
				{ name: "非常好", class: "iconfeichanghao", active: true },
				{ name: "一般", class: "iconyiban", active: false },
			],
			storeName: "",
			icon: "",
		};
	},
	onLoad(option) {
		this.placeholderText = "请输入评价内容。";
		this.pramaters.orderId = option.orderId;
		this.storeName = option.storeName;
		this.icon = option.pic;
		this.getOrderDetail(option.orderId);
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		async getOrderDetail(val) {
			let res = await store.dispatch("OrderDetail", { orderId: val });
			this.orderDetail = res.data;
			this.orderType = res.data.orderType;
			if (res.data.orderType == 0 && res.data.ddDelivery) {
				this.evaluateDelivery = {
					deliveryName: res.data.ddDelivery.dmName,
					type: 1,
				};
			}
			res.data.details.forEach(item => {
				this.pramaters.goodsEvaluates.push({
					goodsName: item.goodsName,
					goodsId: item.goodsId,
					score: 5,
				});
			});
		},
		imageError() {},
		chooseImg() {
			const that = this;
			uni.chooseImage({
				count: 8,
				// sizeType:['compressed'],
				// sourceType:['album'],
				success(res) {
					uni.showLoading({
						title: "图片上传中",
						mask: true,
					});
					const tempFilePaths = res.tempFilePaths;
					uni.getStorage({
						key: "token",
						success(resLocal) {
							let proList = res.tempFilePaths.map(a => store.dispatch("BatchUpload", a));
							let thenFuc = res => {
								let resArr = res.map(a => JSON.parse(a.data));
								that.pramaters.pic = resArr.map(a => a.data);
								uni.hideLoading();
							};
							PromiseAll(proList, thenFuc);
						},
					});
				},
			});
		},
		delImg(inx) {
			this.pramaters.pic.splice(inx, 1);
		},
		preEveImg(inx) {
			uni.previewImage({
				current: inx,
				urls: this.pramaters.pic,
			});
		},
		tapGoodsIcon(i) {
			this.pramaters.type = i;
			this.goodsTypeList.forEach((element, inx) => {
				i == inx ? (element.active = true) : (element.active = false);
			});
		},
		tapIcon(i) {
			this.evaluateDelivery.type = i;
			this.typeList.forEach((element, inx) => {
				i == inx ? (element.active = true) : (element.active = false);
			});
		},
		submit() {
			if (this.orderType == 0) {
				this.pramaters.evaluateDelivery = this.evaluateDelivery;
			}
			let params = Object.assign(this.pramaters);
			params.pic = params.pic + "";
			uni.showNavigationBarLoading();
			uni.showLoading({
				title: "正在提交评论",
				mask: true,
			});
			this.evaluationMask = true;
			let successFuc = res => {
				uni.showToast({
					title: "评价成功！",
					icon: "none",
					mask: true,
					duration: 2000,
					success: () => {
						setTimeout(function () {
							uni.reLaunch({
								url: "/pages/order/order",
							});
						}, 2000);
					},
				});
			};
			let elseFuc = () => {
				this.pramaters = {
					content: "",
					orderId: 0,
					pic: [],
					score: 5,
					type: 1, //(0非常差, 1非常好, 2一般)
					goodsEvaluates: [],
				};
				uni.hideNavigationBarLoading();
				this.evaluationMask = false;
			};
			AjaxApi("OrderEvaluate", params, successFuc, elseFuc);
			this.placeholderText = "";
			this.pramaters.content = "";
		},
	},
};
</script>

<style lang="scss" scoped>
.contain {
	width: 100%;
	height: 100%;
	background: rgba(249, 250, 251, 1);
	box-sizing: border-box;
	padding: 20rpx;
	padding-bottom: 180rpx;
	.btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - 48rpx);
		background: #e5cda1;
		color: #343434;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 36rpx;
		box-sizing: border-box;
		margin: 24rpx;
		z-index: 10000;
	}
}
.store-evaluation-box {
	padding: 20rpx 24rpx;
	background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
	box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
	opacity: 1;
	border-radius: 4px;
	margin-bottom: 20rpx;
}
.store-evaluation-top {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 52rpx;
}
.store-evaluation-top image {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
}
.store-evaluation-top view {
	height: 34rpx;
	font-size: 24rpx;
	font-weight: 400;
	line-height: 34rpx;
	color: rgba(0, 0, 0, 1);
	opacity: 1;
}
.store-evaluation-bot {
	padding: 0rpx 150rpx;
	display: flex;
	justify-content: space-between;
}
.icon-item {
	text-align: center;
	.icon-img {
		font-size: 56rpx;
		color: #999999;
	}
	.icon-text {
		height: 28rpx;
		font-size: 10px;
		font-weight: 400;
		line-height: 28rpx;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
		margin: 12rpx 0rpx;
	}
	.color {
		color: #e5cda1;
	}
}
.goods-evaluation-box {
	padding: 20rpx;
	background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
	box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
	opacity: 1;
	border-radius: 8rpx;
	margin-bottom: 20rpx;
	.evaluation-text {
		padding-left: 18rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #333333;
		opacity: 1;
		margin-bottom: 18rpx;
	}
	.roat-box {
		padding: 26rpx 0;
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
	}
	.goods-roat-box {
		padding: 20rpx 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.goods-name {
			height: 34rpx;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 30rpx;
			color: #333333;
			opacity: 1;
		}
	}
	.textArea-box {
		padding: 24rpx;
	}
	.upload-text {
		padding-left: 18rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #333333;
		opacity: 1;
		margin-bottom: 18rpx;
	}
	.upload {
		display: flex;
		width: 100%;
		overflow: hidden;
		.up-urls {
			position: relative;
			width: 136rpx;
			height: 136rpx;
			padding-right: 24rpx;
			margin-right: 10rpx;
			.iconfont {
				color: #ff0000;
				font-size: 30rpx;
				position: absolute;
				bottom: 5rpx;
				right: 0;
			}
			.img {
				width: 136rpx;
				height: 136rpx;
			}
			.del {
				position: absolute;
				top: 0;
				right: 0;
				width: 40rpx;
				height: 40rpx;
			}
		}
		.border-style {
			border: 1rpx dashed #ebebeb;
			background: #f9fafb;
			box-sizing: border-box;
		}
		.up-load {
			overflow: hidden;
			color: #999999;
			width: 136rpx;
			height: 136rpx;
			display: flex;
			flex-direction: column;
			text-align: center;
			.iconfont {
				height: 84rpx;
				font-size: 40rpx;
				line-height: 100rpx;
			}
			text {
				font-size: 20rpx;
			}
		}
	}
}
.upload-image-box {
	padding: 20rpx;
	// background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
	// box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
	// border-radius: 8rpx;
	// margin-bottom: 24rpx;
}
</style>
