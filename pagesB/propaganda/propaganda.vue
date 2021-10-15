<template>
	<view class="contain">
		<image v-if="image" :src="url" mode="widthFix"></image>
		<web-view v-else @message="handleGetMessage" :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
export default {
	name: "propaganda",
	data() {
		return {
			image: true,
			propaganda: false,
			type: "0",
			url: "",
			webviewStyles: {
				progress: {
					color: "#FF3333",
				},
			},
			HtmlObj: {},
		};
	},
	onLoad(options) {
		this.url = options.url;
		this.type = options.type;
		this.image = options.type == "1" ? true : false;
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		handleGetMessage: function (e) {
			let data = e.detail.data[0];
			this.propaganda = true;
			uni.navigateTo({
				url: `/pages/home/home?shopId=${data.shopId}&propaganda=1`,
				success: function (res) {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptDataFromOpenerPage", data);
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.contain {
	width: auto;
	min-height: 100vh;
	image {
		width: 100%;
		vertical-align: bottom;
	}
}
</style>
