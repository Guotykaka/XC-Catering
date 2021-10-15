<template>
	<!-- <view class="container" style="height: 100vh"> -->
	<!-- <web-view bindmessage="handleGetMessage"  src="{{openUrl}}"></web-view> -->
	<web-view @message="handleGetMessage" :src="openUrl"></web-view>
	<!-- </view> -->
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			// openUrl: "http://192.168.8.149:8080/html/saleActivity/41.html",
			openUrl: "https://testddd.dianddian.cn/html/saleActivity/activity.html",
			HtmlObj: {},
		};
	},
	onReady(e) {},
	onLoad() {},
	onShow() {},
	onHide() {},
	mounted() {},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		handleGetMessage: function (e) {
			this.HtmlObj = e.detail.data[0];
            console.log("mounted -> e.detail.data[0]", e.detail.data[0])
			const that = this;
			const pages = getCurrentPages();
			const lastpage = pages[pages.length - 2];
			lastpage.setData({
				HtmlGoods: that.HtmlObj.goods,
				HtmlShopId: that.HtmlObj.shopId,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
}
</style>
