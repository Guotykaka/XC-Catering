<template>
	<view class="container">
		<u-mask :show="cancelMask" :custom-style="{ background: 'rgba(255,255,255, 1)' }">
			<view class="mask-slot">
				<view><img src="/static/img/hadpay.png" alt="" /></view>
				<view>提交申请成功</view>
				<view>您已提交取消订单申请，请等待商家回复！</view>
				<view>2s后返回订单详情页</view>
			</view>
		</u-mask>
		<view class="can-tit">取消订单原因</view>
		<u-radio-group v-model="value" @change="radioGroupChange" :wrap="true" active-color="#E5CDA1">
			<u-radio v-for="(item, index) in list" :key="index" :name="item.name" :disabled="item.disabled" shape="circle">
				{{ item.name }}
			</u-radio>
		</u-radio-group>
		<view class="can-textarea" v-if="!cancelMask">
			<textarea
				class="textarea"
				@input="bindInput"
				auto-height
				placeholder-style="color:#999999;font-size:28rpx;"
				placeholder="请补充信息以便商家更快帮您处理"
			/>
			<view class="upload">
				<view class="up-urls" v-for="(item, i) in imgUrls" :key="i">
					<image src="../../static/img/del.png" class="del" @tap="delImg"></image>
					<image class="img" mode="aspectFit" :src="item" @error="imageError" @tap="preEveImg(item)"></image>
				</view>
				<view class="up-load" @tap="chooseImg"><text class="up-load iconfont icon-add"></text><text>上传图片</text></view>
			</view>
		</view>
		<view class="btn" @tap="refund">提交</view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import { getToken, getObjType } from "@/utils";
import store from "@/store";
import { URL } from "@/utils/api";
export default {
	name: "orderCancel",
	data() {
		return {
			action: `${URL}/biz/weixin/file/upload`,
			imgUrls: [],
			timer: {},
			cancelMask: false,
			redirectTo: false,
			orderStatus: 0,
			pdType: 0,
			pramaters: {
				cause: "临时有事，不想要了",
				orderId: 0,
				pic: "",
				remark: "",
				type: 1,
			},
			list: [
				{
					type: 1,
					name: "临时有事，不想要了",
					disabled: false,
				},
				{
					type: 2,
					name: "忘点主食",
					disabled: false,
				},
				{
					type: 3,
					name: "忘记用红包",
					disabled: false,
				},
				{
					type: 4,
					name: "点多了/点错了/点漏了",
					disabled: false,
				},
				{
					type: 5,
					name: "支付遇到问题",
					disabled: false,
				},
				{
					type: 6,
					name: "地址填写错误",
					disabled: false,
				},
				{
					type: 7,
					name: "其他",
					disabled: false,
				},
			],
			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
			value: "临时有事，不想要了",
		};
	},
	onLoad(option) {
		this.pramaters.orderId = option.orderId;
		this.orderStatus = option.orderStatus;
		this.pdType = option.pdType;
	},
	onShow() {},
	onUnload() {
		clearTimeout(this.timer);
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		bindInput(e) {
			this.pramaters.remark = e.detail.value;
		},
		radioGroupChange(e) {
			this.pramaters.type = this.list.find(it => it.name == e).type;
			this.pramaters.cause = this.list.find(it => it.name == e).name;
		},
		chooseImg() {
			const that = this;
			uni.chooseImage({
				count: 1,
				success(res) {
					const tempFilePaths = res.tempFilePaths;
					uni.getStorage({
						key: "token",
						success(resLocal) {
							uni.uploadFile({
								url: `${URL}/biz/weixin/file/upload`,
								filePath: tempFilePaths[0],
								name: "file",
								header: {
									"content-type": "application/x-www-form-urlencoded",
									token: getToken(),
								},
								success(res) {
									that.pramaters.pic = JSON.parse(res.data).data;
									that.imgUrls = [JSON.parse(res.data).data];
								},
							});
						},
					});
				},
			});
		},
		delImg() {
			this.pramaters.pic = "";
			this.imgUrls = [];
		},
		preEveImg(img) {
			uni.previewImage({
				current: 0,
				urls: [img],
			});
		},
		refund() {
			let that = this;
			uni.showLoading({
				title: "提交中",
				mask: true,
			});
			let successFuc = res => {
				this.cancelMask = true;
				let url = `/pagesA/orderDetail/orderDetail?orderId=${that.pramaters.orderId}`;
				that.timer = setTimeout(function () {
					switch (that.pdType * 1) {
						case 1:
							url = `/pagesPing/orderStatusDetails/orderStatusDetails?orderId=${that.pramaters.orderId}`;
							break;
						case 2:
							url = `/pagesPing/spellOrderStatusDetails/spellOrderStatusDetails?orderId=${that.pramaters.orderId}`;
							break;
						default:
							break;
					}
					uni.redirectTo({
						url: url,
					});
				}, 2000);
			};
			this.orderStatus == 0 ? AjaxApi("OrderCancel", this.pramaters, successFuc) : AjaxApi("OrderRefund", this.pramaters, successFuc); // 取消订单//订单退款
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	/deep/.u-radio__icon-wrap--checked {
		.u-icon__icon {
			color: #343434 !important;
		}
	}
	padding: 60rpx 48rpx 180rpx 48rpx;
	.mask-slot {
		position: fixed;
		top: -30%;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #666666;
		width: 510rpx;
		height: 540rpx;
		background: #fff;
		border-radius: 16rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		view {
			&:nth-child(1) {
				img {
					margin: 0 auto;
					width: 239rpx;
					height: 146rpx;
				}
			}
			&:nth-child(2) {
				margin-top: 30rpx;
				height: 56rpx;
				color: #ff4d4f;
				font-size: 40rpx;
				line-height: 56rpx;
				margin-bottom: 36rpx;
			}
			&:nth-child(3) {
				font-size: 24rpx;
				line-height: 30rpx;
			}
			&:nth-child(4) {
				font-size: 24rpx;
				line-height: 30rpx;
			}
		}
	}
	.can-tit {
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-bottom: 62rpx;
	}
	.can-textarea {
		width: 652rpx;
		height: 320rpx;
		background: rgba(249, 250, 251, 1);
		box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		.textarea {
			flex: 1;
			width: 100%;
		}
		.upload {
			flex: 1;
			display: flex;
			height: 68rpx;
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
			.up-load {
				background: #ffffff;
				color: #c5cad5;
				width: 136rpx;
				height: 136rpx;
				display: flex;
				flex-direction: column;
				text-align: center;
				.iconfont {
					height: 100rpx;
					font-size: 40rpx;
					line-height: 100rpx;
				}
				text {
					font-size: 20rpx;
				}
			}
		}
	}
	.btn {
		position: fixed;
		bottom: 0;
		left: 0;
		width: calc(100% - 48rpx);
		background: #e5cda1;
		color: #343434;
		height: 100rpx;
		font-weight: bold;
		line-height: 100rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 36rpx;
		box-sizing: border-box;
		margin: 24rpx;
	}
	/deep/.u-radio {
		flex-direction: row-reverse;
		justify-content: space-between;
		margin-bottom: 40rpx;
		.u-radio__label {
			font-size: 24rpx !important;
		}
	}
}
</style>
