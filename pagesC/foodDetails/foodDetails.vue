<template>
	<view class="container">
		<view class="image-box">
			<swiper class="swiper u-skeleton-rect" :indicator-dots="true">
				<swiper-item v-if="picArr.length == 0">
					<view class="swiper-item uni-bg-red">
						<image class="banner-img" src="https://oss.dianddian.cn/v2/activity/goods-img.png" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item v-else v-for="(item, i) in picArr" :key="i">
					<view class="swiper-item uni-bg-red">
						<image class="banner-img" :src="`${item}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="detail">
			<view class="goods-detail">
				<view class="goods-detail-l">
					<view class="goods-name">{{ goodsDetail.goodsName }}</view>
					<view class="goods-number">月销售 {{ tag ? "9999+" : goodsDetail.count ? goodsDetail.count : 0 }}</view>
					<view class="goods-price">￥{{ shoppingMode ? goodsDetail.discountPrice : goodsDetail.wmDiscountPrice }}</view>
					<view class="goods-descript">{{ goodsDetail.description ? goodsDetail.description : "此商品暂无描述" }}</view>
				</view>
				<view class="goods-detail-r" v-if="pageType == 1">
					<view class="origin-num" v-if="goodsDetail.specsFlag && !goodsDetail.sellOut" @tap.stop="changeSPcart(goodsDetail, 'plus')">
						<text v-if="goodsDetail.number" class="has-stocks">{{ goodsDetail.number }}</text>
						选规格
					</view>
					<view
						class="origin-num"
						v-else-if="Boolean(goodsDetail.originNum > 1 && goodsDetail.number == 0) && !goodsDetail.sellOut"
						@tap.stop="changeSPcart(goodsDetail, 'plus')"
					>
						{{ `${goodsDetail.originNum}份起点` }}
					</view>
					<view class="goods-detail-r" v-else-if="!goodsDetail.sellOut">
						<view
							class="count-minus iconfont icon-minus"
							@tap.stop="changeSPcart(goodsDetail, 'minus')"
							v-if="!goodsDetail.specsFlag && goodsDetail.number !== 0"
						>
						</view>
						<span v-if="!goodsDetail.specsFlag && goodsDetail.number !== 0">{{ goodsDetail.number }}</span>
						<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(goodsDetail, 'plus')"> </view>
					</view>
				</view>
			</view>
			<view class="line"></view>
		</view>
		<view :class="[{ 'evaluation-top1': scrollActive }, 'evaluation-top']">
			<view class="top-left">
				<text :class="{ tabbefore: evaluateParams.type == 1 }" @tap="tapTab(1)">堂食评价</text>
				<text :class="[{ tabbefore: evaluateParams.type == 0 }, 'u-margin-left-42']" @tap="tapTab(0)">外卖评价</text>
			</view>
			<view class="top-right" v-if="!(goodsDetail.favorableRate == 0 || goodsDetail.favorableRate == null)">
				<view>
					<u-rate
						min-count="1"
						:disabled="true"
						v-model="goodsDetail.score"
						active-color="#FF4D4F"
						inactive-color="#DDDDDD"
						size="24"
						gutter="8"
					></u-rate>
				</view>
				<view class="shop-score">好评度 &nbsp; {{ goodsDetail.favorableRate }}%</view>
			</view>
		</view>
		<view class="evaluation">
			<view class="evaluation-tag">
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 0 }]" @tap="chooseEvaluateTag(0)">全部{{ evaluateCount.totalCount }}</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 1 }]" @tap="chooseEvaluateTag(1)">最新</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 2 }]" @tap="chooseEvaluateTag(2)">好评{{ evaluateCount.goodsCount }}</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 3 }]" @tap="chooseEvaluateTag(3)">差评{{ evaluateCount.badCount }}</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 4 }]" @tap="chooseEvaluateTag(4)">有图{{ evaluateCount.picCount }}</view>
				<view :class="['tag-span', { 'active-tag': evaluateParams.status == 5 }]" @tap="chooseEvaluateTag(5)"
					>商家回复{{ evaluateCount.replyCount }}</view
				>
			</view>
			<view class="evaluation-box">
				<view v-for="(it, i) in evaluateList" :key="i" class="evaluation">
					<view class="evaluate-top">
						<view class="top-left">
							<image :src="it.createPic || '../../static/img/default-man.png'" mode="aspectFill"></image>
							<text>{{ it.createName }}</text>
							<u-rate
								v-model="evaluateList[i].score"
								active-color="#FF4D4F"
								:disabled="true"
								inactive-color="#DDDDDD"
								size="20"
								gutter="6"
							></u-rate>
						</view>
						<text style="color: #999999">{{ it.createTime.slice(0, 10) }}</text>
					</view>
					<view class="evaluate-content" v-if="it.content">{{ it.content }}</view>
					<view class="evaluate-pic">
						<scroll-view scroll-x="true" v-if="it.pic.length">
							<view style="display: inline-flex">
								<image
									@tap="preEveImg(i, inx)"
									:src="`${item}?x-oss-process=image/resize,w_700`"
									mode="aspectFill"
									v-for="(item, inx) in it.pic"
									:key="inx"
								></image>
							</view>
						</scroll-view>
					</view>
					<view class="recommen-box" v-if="it.evaluateGoods || it.evaluateGoods.length < 1">
						<view class="recommen-title">TA的推荐</view>
						<view class="recommen-name" v-for="(item, index) in it.evaluateGoods" :key="index">{{ item.goodsName }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 选择规格 -->
		<u-popup
			class="coupon-popup-stocks"
			v-model="shows_tocks"
			mode="bottom"
			:mask="true"
			:closeable="true"
			:safe-area-inset-bottom="true"
			border-radius="8"
		>
			<view class="popup-stocks">
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh">
					<view class="ps-tittle">
						<view>
							<image class="banner-img" :src="`${stocksObj.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
						</view>
						<view>
							<view>{{ stocksObj.goodsName }}</view>
							<view class="u-line-1">{{ stocksObj.description || "暂无描述" }}</view>
						</view>
					</view>
					<view class="ps-mini-tittle" style="margin-top: 0; margin-bottom: 0">{{ stocksObj.typeName }}</view>
					<view class="ps-content" v-if="stocksList.length > 1">
						<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, i) in stocksList" :key="i" @tap="chooseStocks(i)">
							<text class="u-line-1"> {{ it.specification }}</text>
						</view>
					</view>
					<div v-for="(item, i) in goodsSpecificationsList" :key="i">
						<view class="ps-mini-tittle" style="margin-bottom: 0">{{ item.name }}</view>
						<view class="ps-content">
							<view
								class="ps-content-view"
								:class="{ ifchoose: it.choose }"
								v-for="(it, inx) in item.children"
								:key="inx"
								@tap="chooseSpec(i, inx)"
							>
								<text class="u-line-1"> {{ it.name }}</text>
							</view>
						</view>
					</div>
				</scroll-view>
				<view class="ps-mini-tittle" style="margin-top: 20rpx">{{ stocksGoods.specification || "请选择" }}</view>
				<view class="ps-footer">
					<view><text style="font-size: 28rpx">￥\t</text>{{ stocksPrice }}</view>
					<view @tap="conformStocks(i)" :class="{ gray: !stocksGoodsID }"> 加入购物车</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import store from "@/store";
export default {
	data() {
		return {
			pageType: 0, //1:home页进,0:请客拼餐进
			scrollActive: false,
			shoppingMode: 0, //用户下单类型:0外卖1堂食
			orderType: ["外卖", "堂食", "到店自取"],
			shopScore: 4,
			goodsScore: 3,
			options: {
				shopId: 0,
				number: 0,
				id: 0,
			},
			stocksList: [], //规格列表
			goodsSpecificationsList: [], //2规格列表
			stocksObj: {}, //规格商品
			stocksPrice: null, //规格价格
			shows_tocks: false, //规格弹窗
			stocksGoodsID: null,
			stocksGoods: {}, //选中的库存对象
			keyword: "",
			goodsId: null,
			goodsDetail: {
				basicPrice: 0,
				count: 0,
				coverPic: "",
				createTime: "",
				delFlag: "",
				description: "",
				discountNum: 0,
				discountPrice: 0,
				elmPrice: 0,
				favorableRate: 0,
				goodsId: 0,
				goodsName: "",
				goodsSpecifications: [],
				isLatest: 0,
				isPublish: 0,
				isRecommend: 0,
				isSignboard: 0,
				isWaiterClick: 0,
				merchantId: 0,
				mtPrice: 0,
				number: 0,
				originNum: 0,
				originalPrice: 0,
				pic: "",
				rank: 1,
				remark: "",
				required: false,
				score: 0,
				shopId: 0,
				singleOrder: 1,
				sort: 0,
				status: 0,
				typeName: "",
				updateTime: "",
				wmDiscountPrice: 0,
				wmOriginalPrice: 0,
			},
			tag: false,
			picArr: [],
			dishesList: [],
			evaluateList: [], //评论列表
			evaluateParams: {
				pageIndex: 1,
				pageSize: 10,
				type: 1, //0外卖1堂食
				goodsId: 0,
				status: 0,
			},
			pageDownEva: true, //评论翻页标识
			evaluateCount: {
				totalCount: 0,
				goodsCount: 0,
				badCount: 0,
				picCount: 0,
				replyCount: 0,
			},
		};
	},
	onLoad(option) {
		if (option.type == "home") {
			this.pageType = 1;
			this.options = option;
			const pages = getCurrentPages();
			const prevPage = pages[pages.length - 2]; //上一个页面
			this.shoppingMode = prevPage.$vm.shoppingMode;
		}
		this.evaluateParams.goodsId = option.id;
		this.goodsId = option.id;
		this.init();
		this.getGoodsEvaluateCount();
		this.getEvaluateList(true);
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	onReachBottom() {
		if (this.pageDownEva) {
			this.evaluateParams.pageIndex++;
			this.getEvaluateList();
		}
	},
	onPageScroll(e) {
		this.scrollActive = e.scrollTop > 495 ? true : false;
		// this.rightScrollFuc();
	},
	methods: {
		goHome() {
			uni.navigateBack();
			// uni.navigateTo({
			// 	url: `/pages/home/home?shopId=${this.options.shopId}`,
			// 	success() {
			// 		// uni.hideLoading();
			// 	},
			// });
		},
		init() {
			let params = {
				goodsId: this.goodsId,
			};
			let successFun = res => {
				console.log(res.data);
				this.goodsDetail = res.data;
				this.goodsDetail.count = this.options.count;
				this.picArr = this.goodsDetail.pic.split(",");
				if (this.goodsDetail.number > 9999) {
					this.tag = true;
				}
			};
			let elseFun = () => {};
			AjaxApi("GetGoodsDetail", params, successFun, elseFun);
		},
		tapTab(i) {
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			uni.pageScrollTo({
				scrollTop: 480,
			});
			this.evaluateParams.type = i;
			this.evaluateParams.pageIndex = 1;
			this.getEvaluateList(true);
		},
		chooseEvaluateTag(val) {
			this.evaluateParams.status = val;
			this.evaluateParams.pageIndex = 1;
			this.getEvaluateList(true);
		},
		getEvaluateList(flag) {
			let successFun = res => {
				res.data?.records.forEach(element => {
					element.pic = element.pic ? element.pic.split(",") : [];
				});
				this.evaluateList = flag ? res.data?.records ?? [] : this.evaluateList.concat(res.data.records);
				this.pageDownEva = Boolean(res.data.pages > res.data.current);
			};
			let elseFun = () => {};
			AjaxApi("GetEvaluateList", this.evaluateParams, successFun, elseFun);
		},
		getGoodsEvaluateCount(val) {
			let successFun = res => {
				this.evaluateCount = res.data;
				console.log(this.evaluateCount);
			};
			let elseFun = () => {};
			AjaxApi("GetGoodsEvaluateCount", { goodsId: this.goodsId }, successFun, elseFun);
		},
		async changeSPcart(it, type) {
			uni.vibrateShort(); //短振动
			//添加或删除菜品
			let params = { goodsId: it?.goodsId };
			let res = await store.dispatch("GetGoodsDetail", params);
			const { coverPic, description, discountPrice, goodsId, goodsName } = it;
			let thisPages = getCurrentPages();
			let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
			const goodsinx = thisPrevPage.$vm.goodsList.findIndex(item => item.goodsId == it.goodsId);
			const goodsinxs = thisPrevPage.$vm.recommenList.findIndex(item => item.goodsId == it.goodsId);
			if (res.data.stocks.length == 1 && !res.data.goodsSpecifications.length) {
				//规格为一个
				switch (type) {
					case "plus":
						const params = {
							coverPic,
							description,
							discountPrice,
							goodsId,
							goodsName,
							isAdd: true,
							shopId: this.options.shopId, //店铺Id
							stockId: res.data.stocks[0].stockId, //库存Id
							specification: res.data.stocks[0].specification, //库存描述
						};
						const successFuc = res => {
							const inx = this.dishesList.findIndex(item => item.goodsId == it.goodsId);
							if (goodsinx !== -1) thisPrevPage.$vm.goodsList[goodsinx].number++;
							if (goodsinxs !== -1) thisPrevPage.$vm.recommenList[goodsinxs].number++;
							if (inx !== -1) {
								this.dishesList[inx].number++;
							}
							if (this.goodsDetail.goodsId == it.goodsId) {
								this.goodsDetail.number++;
							}
							this.goHome();
						};
						this.postCart("SaveCart", params, successFuc);
						break;
					case "minus":
						if (it.number !== 0) {
							const params = {
								coverPic,
								description,
								discountPrice,
								goodsId,
								goodsName,
								isAdd: false,
								shopId: this.options.shopId, //店铺Id
								stockId: res.data.stocks[0].stockId, //库存Id
								specification: res.data.stocks[0].specification, //库存描述
							};
							const successFuc = async res => {
								const inx = this.dishesList.findIndex(item => item.goodsId == it.goodsId);
								if (goodsinx !== -1) thisPrevPage.$vm.goodsList[goodsinx].number--;
								if (goodsinxs !== -1) thisPrevPage.$vm.recommenList[goodsinxs].number--;
								if (inx !== -1) {
									this.dishesList[inx].number--;
								}
								if (this.goodsDetail.goodsId == it.goodsId) {
									this.goodsDetail.number--;
								}
								this.goHome();
							};
							this.postCart("SaveCart", params, successFuc);
						}
						break;
					default:
						break;
				}
			} else {
				//规格为多个个
				switch (type) {
					case "plus":
						this.stocksPrice = 0;
						this.stocksObj = res.data;
						this.stocksList = res.data.stocks.map(item => {
							item.choose = false;
							return item;
						});
						this.stocksGoods = this.stocksList[0];
						this.stocksPrice = this.shoppingMode ? this.stocksList[0].discountPrice : this.stocksList[0].wmDiscountPrice;
						this.stocksGoodsID = this.stocksList[0].goodsId;
						this.stocksList[0].choose = true;
						if (this.stocksList[0].availableStock == 0) this.stocksGoodsID = null;
						this.goodsSpecificationsList = res.data.goodsSpecifications.filter((item, i) => {
							const index = item.children.findIndex(ele => ele.checked == true);
							item.children = item.children.filter((it, inx) => {
								inx == index ? (it.choose = true) : (it.choose = false);
								if (it.checked) {
									return it;
								}
							});
							return item;
						});
						this.shows_tocks = true;
						break;
					default:
						break;
				}
			}
		},
		async conformStocks() {
			//确认规格并加入购物车
			if (!this.stocksGoodsID) {
				uni.showToast({
					title: `库存不足!`,
					icon: "none",
					mask: true,
					duration: 1500,
				});
				return;
			}
			let SPEC = "";
			this.goodsSpecificationsList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const inx = this.dishesList.findIndex(item => item.goodsId == this.stocksGoodsID);
			let OBJ;
			if (inx !== -1) {
				OBJ = this.dishesList[inx];
			} else {
				OBJ = this.goodsDetail;
			}
			const { coverPic, description, goodsId, goodsName } = OBJ;
			let thisPages = getCurrentPages();
			let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
			const inxs = thisPrevPage.$vm.goodsList.findIndex(item => item.goodsId == this.stocksGoodsID);
			const goodsinxs = thisPrevPage.$vm.recommenList.findIndex(item => item.goodsId == this.stocksGoodsID);
			const params = {
				coverPic,
				description,
				goodsId,
				goodsName,
				discountPrice: this.stocksPrice,
				isAdd: true,
				shopId: this.options.shopId, //店铺Id
				stockId: this.stocksGoods.stockId, //库存Id
				specification: this.stocksGoods.specification + SPEC, //库存描述
			};
			const successFuc = async res => {
				if (inxs !== -1) thisPrevPage.$vm.goodsList[inxs].number++;
				if (goodsinxs !== -1) thisPrevPage.$vm.recommenList[goodsinxs].number++;
				if (inx !== -1) {
					this.dishesList[inx].number++;
				}
				if (this.goodsDetail.goodsId == this.stocksGoods.goodsId) {
					this.goodsDetail.number++;
				}
				this.stocksGoodsID = null;
				this.shows_tocks = false;
				this.goHome();
			};
			this.postCart("SaveCart", params, successFuc);
		},
		chooseSpec(i, inx) {
			//选规格
			this.goodsSpecificationsList[i].children.filter((element, index) => {
				element.choose = index == inx ? true : false;
				return element;
			});
			this.$forceUpdate();
		},
		postCart(api, params, successFuc) {
			//购物车接口
			AjaxApi(api, params, successFuc);
		},
		chooseStocks(i) {
			//选规格
			this.stocksList.filter((element, inx) => {
				element.choose = inx == i ? true : false;
			});
			if (this.stocksList[i].availableStock == 0) {
				this.stocksGoods = this.stocksList[i];
				this.stocksPrice = 0;
				this.stocksGoodsID = null;
				return;
			}
			this.stocksGoods = this.stocksList[i];
			this.stocksPrice = this.shoppingMode ? this.stocksList[i].discountPrice : this.stocksList[i].wmDiscountPrice;
			this.stocksGoodsID = this.stocksList[i].goodsId;
		},
		preEveImg(i, inx) {
			const that = this;
			uni.previewImage({
				current: inx,
				urls: that.evaluateList[i].pic,
				longPressActions: {
					itemList: ["发送给朋友", "保存图片", "收藏"],
					success: function (data) {
						console.log("preImg -> data", data);
					},
					fail: function (err) {
						console.log("preImg -> err", err);
					},
				},
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	background-color: #fff;
}
.image-box {
	width: 100%;
	height: 750rpx;
	background: rgba(255, 255, 255, 1);
	opacity: 1;
	border-radius: 8px;
	.swiper {
		height: 100%;
	}
	.swiper-item {
		width: 100%;
		height: 100%;
	}
	.banner-img {
		width: 100%;
		height: 100%;
	}
}
.detail {
	box-sizing: border-box;
	background: #fff;
}
.goods-detail {
	padding: 24rpx 30rpx 40rpx 26rpx;
	// border-bottom: 2rpx solid rgba(221,221,221,1);
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	background-color: #fff;

	.goods-name {
		height: 44rpx;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 44rpx;
		color: #333333;
		margin-bottom: 8rpx;
	}
	.goods-number {
		height: 28rpx;
		font-size: 20rpx;
		font-weight: 400;
		line-height: 30rpx;
		color: rgba(153, 153, 153, 1);
		margin-bottom: 8rpx;
	}
	.goods-price {
		height: 50rpx;
		font-size: 36rpx;
		font-weight: bold;
		line-height: 50rpx;
		color: rgba(255, 0, 0, 1);
		margin-bottom: 4rpx;
	}
	.goods-descript {
		height: 28rpx;
		font-size: 20rpx;
		font-weight: 400;
		line-height: 30rpx;
		color: #333333;
	}
}
.goods-detail-r {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	min-width: 100rpx;
	font-size: 30rpx;
	line-height: 30rpx;
	position: relative;
	.origin-num {
		min-width: 110rpx;
		height: 40rpx;
		line-height: 40rpx;
		background: #e5cda1;
		text-align: center;
		padding: 0 12rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #343434;
		.has-stocks {
			display: inline-block;
			min-width: 30rpx;
			min-height: 30rpx;
			border-radius: 50%;
			font-size: 20rpx;
			line-height: 30rpx;
			text-align: center;
			position: absolute;
			right: 0;
			top: 44rpx;
			background: #fa3534;
			color: #fff;
		}
	}
}

.count-minus {
	width: 40rpx;
	height: 40rpx;
	font-size: 20rpx;
	color: #666666;
	text-align: center;
	line-height: 38rpx;
	border-radius: 50%;
	border: 2rpx solid #ddd;
}
.count-plus {
	width: 40rpx;
	height: 40rpx;
	font-size: 20rpx;
	color: #343434;
	text-align: center;
	line-height: 40rpx;
	border-radius: 50%;
	background: #e5cda1;
}
span {
	padding: 0 14rpx;
}
.commentary-name {
	padding: 32rpx 28rpx 24rpx 28rpx;
}
.line {
	// width: 100%;
	margin-left: 22rpx;
	margin-right: 18rpx;
	border-bottom: 2rpx solid rgba(221, 221, 221, 1);
}
.evaluation {
	padding: 0rpx 20rpx 20rpx 20rpx;
	width: 100%;
	box-sizing: border-box;
}
.evaluation-top1 {
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 800;
}
.evaluation-top {
	padding: 40rpx 48rpx 24rpx 48rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	.top-left {
		display: flex;
		height: 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 40rpx;
		color: #333333;
		opacity: 1;
		.tabbefore {
			position: relative;
			&::before {
				position: absolute;
				width: 48rpx;
				height: 10rpx;
				border-bottom: 6rpx solid #e5cda1;
				content: "";
				bottom: 0;
				transform: translate(50%, 150%);
			}
		}
	}
	.top-right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.shop-score {
			margin-left: 24rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 30rpx;
			color: #999999;
			opacity: 1;
		}
	}
}
.evaluation-tag {
	padding-top: 20rpx;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	color: #666666;
	.tag-span {
		margin: 0rpx 20rpx 20rpx 0rpx;
		line-height: 52rpx;
		padding: 0 28rpx;
		font-size: 24rpx;
		font-weight: 500;
		background-color: rgba(120, 120, 120, 0.1);
		border-radius: 4rpx;
	}
	.active-tag {
		background: #ceae73;
		opacity: 1;
		font-weight: bold;
		color: #343434;
	}
}
.evaluation-box {
	width: 100%;
	padding: 0 20rpx;
	.evaluation {
		border-radius: 8rpx;
		width: 100%;
		padding: 30rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, #ffffff 100%);
		box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
		border-radius: 8rpx;
		.evaluate-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.top-left {
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
			image {
				width: 38rpx;
				height: 38rpx;
				border-radius: 50%;
				vertical-align: middle;
			}
			text {
				margin-left: 16rpx;
				margin-right: 28rpx;
			}
		}
		.evaluate-content {
			padding-top: 12rpx;
			color: #666666;
			white-space: normal;
			word-break: break-all;
		}
		.type-box {
			margin-left: 54rpx;
			margin-top: 6rpx;
			display: inline-block;
			background: rgba(76, 112, 232, 0.1);
			opacity: 0.1;
			border-radius: 4rpx;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 36rpx;
			color: #e5cda1;
			padding: 0 10rpx;
		}
		.evaluate-pic {
			margin-top: 12rpx;
			padding: 10rpx;
			image {
				width: 108rpx;
				height: 108rpx;
				vertical-align: middle;
				margin-right: 10rpx;
			}
		}
		.recommen-box {
			margin-top: 20rpx;
			display: flex;
			justify-content: flex-start;
			// align-items: center;
			flex-wrap: wrap;
			.recommen-title {
				margin-bottom: 10rpx;
				line-height: 32rpx;
				border-radius: 4rpx;
				padding: 0 8rpx;
				background: rgba(255, 77, 79, 0.1);
				font-size: 20rpx;
				font-weight: 400;
				color: #ff4d4f;
				margin-right: 8rpx;
			}
			.recommen-name {
				margin-bottom: 10rpx;
				line-height: 32rpx;
				border-radius: 4rpx;
				padding: 0 8rpx;
				background: #f9fafb;
				font-size: 20rpx;
				font-weight: 400;
				color: #666;
				margin-right: 8rpx;
			}
		}
		.evaluate-line {
			height: 0;
			width: 100%;
			border-bottom: 1rpx solid #f9f9f9;
			margin-top: 28rpx;
		}
		.evaluate-merchantContent {
			margin-top: 28rpx;
			padding: 20rpx;
			background: #f9fafb;
		}
	}
}
.coupon-popup-stocks {
	/deep/.u-icon__icon {
		top: -20rpx;
		right: -20rpx;
	}
	.popup-stocks {
		min-height: 560rpx;
		background-color: #fff;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.ps-tittle {
			height: 116rpx;
			margin: 48rpx 40rpx;
			display: flex;
			> view {
				&:nth-child(1) {
					width: 116rpx;
					border-radius: 16rpx;
					overflow: hidden;
					image {
						height: 100%;
						width: 100%;
					}
				}
				&:nth-child(2) {
					flex: 1;
					width: 0;
					margin-left: 20rpx;
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 1;
					> view {
						&:nth-child(2) {
							margin-top: 20rpx;
							color: #999999;
							font-size: 24rpx;
							line-height: 1;
						}
					}
				}
				&:nth-child(3) {
					color: #999999;
					font-size: 24rpx;
					line-height: 1;
				}
			}
		}
		.ps-mini-tittle {
			color: #666666;
			font-size: 24rpx;
			margin: 48rpx 0 20rpx 40rpx;
		}
		.ps-content {
			display: flex;
			flex-wrap: wrap;
			padding: 0rpx 42rpx 0 22rpx;
			.ps-content-view {
				min-width: 30%;
				margin-left: 20rpx;
				margin-top: 20rpx;
				min-height: 80rpx;
				overflow: hidden;
				font-size: 32rpx;
				color: #666;
				border: 2rpx solid #e5cda1;
				font-weight: 500;
				border-radius: 8rpx;
				padding: 0 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				text {
					text-align: center;
					line-height: 80rpx;
				}
			}
			.ifchoose {
				background: #e5cda1;
				color: #343434;
			}
		}
		.ps-footer {
			margin-bottom: 20rpx;
			min-height: 100rpx;
			padding: 0 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			view {
				&:nth-child(1) {
					color: #333333;
					font-size: 48rpx;
				}
				&:nth-child(2) {
					width: 324rpx;
					height: 100rpx;
					background: #e5cda1;
					border-radius: 8rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #343434;
					text-align: center;
					line-height: 100rpx;
					&.gray {
						background: #999999;
					}
				}
			}
		}
	}
}
</style>
