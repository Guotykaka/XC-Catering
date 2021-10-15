<template>
	<view>
		<view class="uni-tabbar">
			<!-- //遍历tabbar -->
			<view class="uni-tabbar__item" v-for="(item, index) in tabbar" :key="index" @tap="changeTab(item)">
				<view class="uni-tabbar__bd">
					<view :class="[{ pin: item.pagePath == 'pages/spellOrder/spellOrder' && item.pagePath !== pagePath }, 'uni-tabbar__icon']">
						<!-- //判断tabbar点击过后的图片路径 -->
						<image
							v-if="item.pagePath == 'pages/spellOrder/spellOrder' && item.pagePath !== pagePath"
							class="icon-img-big"
							:src="item.iconPath"
							mode="aspectFit"
						></image>
						<image v-else-if="item.pagePath == pagePath" class="icon-img" :src="item.selectedIconPath" mode="aspectFit"></image>
						<image v-else class="icon-img" mode="aspectFit" :src="item.iconPath"></image>
					</view>
				</view>
				<!-- //判断tabbar点击前后的样式 -->
				<!-- <view
					class="uni-tabbar__label"
					:class="{ active: item.pagePath == pagePath }"
					v-if="!(item.pagePath == 'pages/spellOrder/spellOrder' && item.pagePath !== pagePath)"
				>
					{{ item.text }}
				</view> -->
			</view>
		</view>
	</view>
</template>
<script>
import store from "@/store";
export default {
	props: {
		//从父级继承过来的属性 需要在父级中使用:pagePath='pagePath',
		pagePath: String,
	},
	data() {
		return {
			// page: '',
			showPage: false,
			containerHeight: 400,
			//公共的tabbar
			tabbar: getApp().globalData.tabbar,
		};
	},
	watch: {
		pagePath: {
			handler(pagePath) {
				let inx = this.tabbar.findIndex(item => item.pagePath == pagePath);
				this.tabbar.forEach((element, i) => {
					element.click = i == inx ? true : false;
				});
			},
			immediate: true,
		},
	},
	mounted() {
		this.getIcons();
		// 根据自己的业务需求判断条件为true，替换即可,根据权限设置的tabbar
		//第三个参数为插入项,第一个参数为第一项位置，第二个参数为要删除几个。
		// if (true) {
		// 	this.tabbar.splice(3, 0, {
		// 		pagePath: "pages/wareHouse/wareHouse",
		// 		iconPath: "/static/cart.png",
		// 		selectedIconPath: "/static/cartSelected.png",
		// 		text: "出入库",
		// 	});
		// }
	},
	methods: {
		async getIcons() {
			const that = this;
			let res = await store.dispatch("GetIconList", {});
			if (res.code == 0) {
				let ajaxList = getApp().globalData.tabbar.map((it, i) => {
					it.iconPath = res.data[i].iconPath;
					it.selectedIconPath = res.data[i].selectedIconPath;
					return it;
				});
				this.tabbar = ajaxList;
				getApp().globalData.tabbar = ajaxList;
			}
		},
		changeTab(item) {
			if (item.pagePath == this.pagePath) return;
			this.page = item.pagePath;
			getApp().globalData.previewImage = false;
			// 使用reLaunch关闭所有的页面，打开新的栏目页面
			// console.log(item.pagePath)
			// console.log(this.page)
			uni.reLaunch({
				url: "/" + this.page,
			});
		},
	},
};
</script>
<style lang="scss">
.uni-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	display: flex;
	justify-content: space-around;
	padding: 16rpx 0;
	min-height: 100rpx;
	min-height: calc(100rpx + constant(safe-area-inset-bottom, 0));
	min-height: calc(100rpx + env(safe-area-inset-bottom, 0));
	padding-bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom, 0);
	padding-bottom: env(safe-area-inset-bottom, 0);
	// box-sizing: border-box;
	// border-top: solid 1rpx #ccc;
	// background-color: #fff;
	// box-shadow: 0px 0px 17rpx 1rpx rgba(206, 206, 206, 0.32);
	background: #ffffff;
	box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.1);

	.uni-tabbar__item {
		display: block;
		line-height: 24rpx;
		font-size: 20rpx;
		text-align: center;
		width: 25%;
	}

	.uni-tabbar__icon {
		height: 24px;
		line-height: 24px;
		text-align: center;
		&.pin {
			margin-top: -10rpx;
			height: 40px;
		}
	}

	.icon {
		display: inline-block;
	}

	.uni-tabbar__label {
		line-height: 24rpx;
		font-size: 20rpx;
		color: #ababaf;

		&.active {
			color: #1c1c1d;
		}
	}

	.icon-img {
		height: 37px;
		width: 22px;
	}
	@keyframes myScale {
		0% {
			transform: scale(0.8);
		}
		50% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.8);
		}
	}
	.icon-img-big {
		animation: myScale 0.6s infinite;
		height: 40px;
		width: 40px;
	}
}
</style>
