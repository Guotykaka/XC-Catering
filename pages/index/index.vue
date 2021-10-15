<template>
	<view
		class="container"
		:style="{
			paddingTop: statusBarHeight + 'px',
		}"
	>
		<u-navbar :background="inxBG" :is-back="false" title=" " :border-bottom="false">
			<view class="slot-wrap" :style="{ opacity: userAddress() ? 1 : 0 }">
				<image src="https://oss.dianddian.cn/v2/activity/index-location.png" mode="aspectFit"></image>
				<text class="u-m-l-10 u-m-r-10 u-line-1">{{ userAddress() }}</text>
			</view>
		</u-navbar>
		<!-- 助力 -->
		<InviteCode :inviteMask="inviteMask" :inviteLoading="inviteLoading" :maxAmount="maxAmount" @inVite="hideInvite"></InviteCode>
		<!-- 弹窗 -->
		<PopUp :popMask="popMask" :popType="popType" :list="platCouponList" @inVite="hidePop" :card="cardDetail"></PopUp>
		<!-- 平台券 -->
		<view v-show="isHiddenPlat" class="guide" @tap="closePlat">
			<view class="guide-bg-container">
				<view class="plat-bg">
					<u-icon class="u-font-34" name="close" style="float: right" @tap="closePlat"></u-icon>
					<image src="https://oss.dianddian.cn/activity/%E8%92%99%E7%89%88%E7%BB%84%20431%403x.png" mode="widthFix"></image>
				</view>
				<view class="plat-con" v-if="platCouponList.length">
					<scroll-view
						:scroll-y="true"
						:style="{
							height: platCouponList.length * 150 + 'rpx',
							'max-height': '440rpx',
							'min-height': '300rpx',
						}"
					>
						<view v-for="(it, i) in platCouponList" :key="i">
							<view :class="[{ unactive: false }, 'quan']" v-if="i < 10" :style="{ 'margin-top': platCouponList.length == 1 ? '75rpx' : 0 }">
								<view>
									<view>
										<text class="u-line-1">{{ it.redPacketName }}</text>
									</view>
									<view class="u-line-1">
										<view>{{ couponType[it.type] }}</view>
										<view>{{ saleTypeKeys[it.saleType] }}</view>
										<text v-if="!it.id">
											{{ it.validRemark }}
										</text>
										<text class="u-line-1" v-else>{{ it.validType == 0 ? "长期有效" : it.validType == 1 ? it.validEndTime + "到期" : "领取后" + it.days + "天内有效" }}</text>
									</view>
								</view>
								<view>
									<text><text style="font-size: 24rpx">￥</text>{{ it.amount }}</text>
									<text style="font-size: 20rpx">{{ it.usedAmount == 0 ? "无门槛" : "满" + it.usedAmount + "元可用" }}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="inx-bg">
			<view class="inx-swiper" v-if="statusBarHeight">
				<swiper class="swiper" :indicator-dots="false" :circular="true" :autoplay="true" :interval="3000" :duration="500" indicator-color="rgba(255, 255, 255, 0.34)" indicator-active-color="#FFFFFF" border-radius="16">
					<swiper-item v-if="bannerList.length == 0">
						<view class="swiper-item">
							<image class="banner-img" src="https://oss.dianddian.cn/v2/activity/goods-img.png" mode="aspectFill"></image>
						</view>
					</swiper-item>
					<swiper-item v-else v-for="(item, i) in bannerList" :key="i" @tap="tabBanner(item)">
						<view class="swiper-item" v-if="item.id == 49">
							<button class="u-m-l-10" style="display:contents;margin:0;padding:0,border:0" plain="true" open-type="contact" show-message-card send-message-title="餐典到了" send-message-path="/pages/index/index" send-message-img="https://oss.dianddian.cn/share/share_dd.png">
								<image class="banner-img" :src="`${item.imgUrl}`" mode="aspectFill"></image>
							</button>
						</view>
						<view class="swiper-item" v-else>
							<image class="banner-img" :src="`${item.imgUrl}`" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="inx-tab">
				<view @click="shoppingMode(1)">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-icon1.png" mode="widthFix"></image>
					<text class="u-m-t-10">到店堂食</text>
				</view>
				<view @click="shoppingMode(0)">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-icon2.png" mode="widthFix"></image>
					<text class="u-m-t-10">外卖点餐</text>
				</view>
				<view @tap="jumpOther">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-icon3.png" mode="widthFix"></image>
					<text class="u-m-t-10">惠典生活</text>
				</view>
				<button open-type="share" plain="true" data-type="group" @tap="clickShare" class="inx-tab-share">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-icon4.png" mode="widthFix"></image>
					<view class="u-m-t-10" style="line-height: 32rpx">邀请好友</view>
					<view class="price" v-if="orderPacket.amount1">{{ orderPacket.amount1 }}元红包</view>
				</button>
				<view @tap="turnTo('signIn')">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-icon5.png" mode="widthFix"></image>
					<text class="u-m-t-10">每日签到</text>
				</view>
			</view>
		</view>
		<view class="inx-block top">
			<view class="u-m-r-10" @tap="getEvery">
				<view>
					<view class="child-a">天天领红包</view>
					<view class="child-b">最高5元大额红包</view>
					<image class="img-a" src="https://oss.dianddian.cn/v2/activity/newindex/inx-go.png" mode="aspectFit"></image>
				</view>
				<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-block-l.png" mode="aspectFit"></image>
			</view>
			<button class="u-m-l-10 btn-share" plain="true" open-type="contact" show-message-card send-message-title="餐典到了" send-message-path="/pages/index/index" send-message-img="https://oss.dianddian.cn/share/share_dd.png">
				<view>
					<view class="child-a">入群送日卡</view>
					<view class="child-b">5元红包+免配送费</view>
					<image class="img-a" src="https://oss.dianddian.cn/v2/activity/newindex/inx-go.png" mode="widthFix"></image>
				</view>
				<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-block-r.png" mode="widthFix"></image>
			</button>
		</view>

		<!-- 周三特惠日 -->
		<!-- <view class="inx-block bottom uim-t-20">
			<image class="img-a" src="https://oss.dianddian.cn/v2/activity/newindex/preferential.png" mode="widthFix"></image>
			<view class="u-m-t-22">
				<view class="box-left u-m-r-10" @tap="tabDisCard()">
					<view>
						<view class="bold u-font-28">拼餐·尊享卡</view>
						<view class="u-font-20">{{ discountCard.equityRedPacketName || "" }}+{{ discountCard.equityDeliveryName || "" }}</view>
					</view>
					<view>
						<view>
							<text class="bold u-font-20">¥</text>
							<text class="bold u-font-32">{{ discountCard.buyPrice }}</text>
							<text class="u-font-28 u-m-l-4" style="text-decoration: line-through">原价¥{{ discountCard.originalPrice }}</text>
						</view>
						<view class="inx-b-btn u-font-20" v-if="isWednesday">开通</view>
						<view class="inx-b-btn u-font-20" v-else>待售</view>
					</view>
				</view>
				<view class="box-right u-m-l-10">
					<swiper
						class="scroll-x"
						style="height: 180rpx"
						:current="0"
						:interval="3000"
						:circular="true"
						:duration="1000"
						:autoplay="true"
						:style="{
							height: 180 + 'rpx',
							backgroundColor: '#fff',
						}"
					>
						<swiper-item class="scroll-box" v-for="(item, index) in discountGoods" :key="index" @tap="tabDisGoods(item)">
							<image class="img-b u-m-r-20" :src="item.coverPic" mode="aspectFill"></image>
							<view style="flex: 1">
								<view>
									<view class="bold u-font-28 u-line-2" style="color: #1c1c1d">{{ item.goodsName }}</view>
									<view style="color: #ff3b3b" class="u-line-1">
										<text class="bold u-font-20">¥</text>
										<text class="bold u-font-32">{{ item.newDiscountPrice }}</text>
										<text class="u-font-20 u-m-l-4" style="color: #ababaf">¥{{ item.discountPrice }}</text>
									</view>
								</view>
								<view class="inx-b-btn u-font-20" v-if="isWednesday">加入购物车</view>
								<view class="inx-b-btn wednesday u-font-20" v-else>待售中</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view> -->
		<!-- 接龙活动 -->
		<image style="width: calc(100vw - 22px)" class="u-m-l-20 u-m-t-20" src="https://oss.dianddian.cn/v2/428/chanins_banner.png" mode="widthFix" @tap="turnTo('chains')"></image>
		<!-- 精选推荐 -->
		<view class="recommend-box" v-if="recommendList.length > 0">
			<view class="swiper-wrapper">
				<view class="title-img">
					<image src="https://oss.dianddian.cn/v2/activity/newindex/recommend.png" mode="widthFix"></image>
				</view>
				<scroll-view :scroll-x="true" class="recommend-con">
					<view class="swiper-box" v-for="(item, i) in recommendList" :key="i" @tap="jumpOther">
						<view class="swiper">
							<view>
								<image v-if="item.pic" :src="item.pic" mode="aspectFill"></image>
								<image v-else :src="shopImg" mode="aspectFill"></image>
								<view class="title u-line-2">{{ item.name }}</view>
							</view>
							<view class="price">
								<view class="left-price">
									<text>¥{{ item.discountPrice }}</text>
									<text>起</text>
								</view>
								<view class="right-price">¥{{ item.originalPrice }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="coupon-block" v-if="couponNum">
			<view class="coupon-top">
				<view>
					你有<text>{{ couponNum }} </text>张优惠券
				</view>
				<view @tap="jumpCoupon()">查看></view>
			</view>
			<view class="coupon" v-if="couponList">
				<view class="coupon-son" v-for="(item, i) in couponList" :key="i" :animation="i == 0 ? animationData : ''" :style="{ 'z-index': couponList.length - i }">
					<view class="redEnvelope-left">
						<view class="redEnvelope-num">
							<text>¥</text>
							<text>{{ item.amount }}</text>
						</view>
						<view class="redEnvelope-info">{{ item.usedAmount ? `满${item.usedAmount}元可用` : `无门槛` }}</view>
					</view>
					<view class="redEnvelope-right">
						<view style="width: 100%">
							<view class="redEnvelope-name u-line-1">{{ item.redPacketName }}</view>
							<view class="redEnvelope-time" v-if="!item.type ? true : item.validRemark">
								{{ !item.type ? "长期有效" : getCurrent(item.validRemark) }}
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="redEnvelope-left">
					<view class="redEnvelope-num">
						<text>¥</text>
						<text>{{ currentCoupon.amount }}</text>
					</view>
					<view class="redEnvelope-info">{{ currentCoupon.usedAmount ? `满${currentCoupon.usedAmount}元可用` : `无门槛` }}</view>
				</view>
				<view class="redEnvelope-right">
					<view style="width: 100%">
						<view class="redEnvelope-name u-line-1">{{ currentCoupon.redPacketName }}</view>
						<view class="redEnvelope-time">{{ currentCoupon.validateTime }} </view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="inx-together" v-if="groups" @tap="jumpOrderDetail">
			<view>
				<image src="https://oss.dianddian.cn/v2/activity/newindex/inx-to.png" mode="widthFix"></image>
				<text class="u-font-28 u-m-l-20">您有一个拼餐正在进行中</text>
			</view>
			<view class="u-font-24">查看详情></view>
		</view>

		<!-- 商家推荐 -->
		<view class="inx-to-tit" v-if="recommendStore.length > 0">
			<image src="https://ddd-xs-oss.oss-cn-hangzhou.aliyuncs.com/v2/activity/newindex/store-recommed.png" mode="widthFix"></image>
		</view>
		<view class="inx-to-goods" v-for="(item, inx) in recommendStore" :key="inx">
			<view class="u-m-b-20" @tap="toSpellOrder(item)">
				<view>
					<image v-if="item.shopLogo" class="img-a" :src="item.shopLogo" mode="widthFix"></image>
					<image v-else class="img-a" :src="groupPic" mode="widthFix"></image>
					<view class="u-m-l-20">
						<view class="u-font-28 bold" style="color: #1c1c1d">{{ item.shopName }}</view>
						<view class="u-font-24" style="color: #ababaf">距离{{ item.distance }} km</view>
					</view>
				</view>
				<image class="img-b" src="https://oss.dianddian.cn/v2/activity/newindex/inx-arrow-r.png" mode="widthFix"></image>
			</view>
			<view>
				<scroll-view :scroll-x="true" class="recommend-con">
					<view
						class="inx-to-good"
						v-for="(its, i) in item.details"
						:key="i"
						:style="{
							marginRight: Boolean(i + 1 == item.details.length) ? 0 : '20rpx',
						}"
						@tap="toSpellOrder(item)"
					>
						<view>
							<image :src="`${its.coverPic ? its.coverPic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`" mode="aspectFill"></image>
						</view>
						<view class="u-p-10">
							<view class="u-font-24 u-line-1" style="color: #1c1c1d">{{ its.goodsName }}</view>
							<view style="color: #ff3b3b">
								<text class="bold u-font-20">¥</text>
								<text class="bold u-font-24">{{ its.basicPrice }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<tab-bar pagePath="pages/index/index"></tab-bar>
	</view>
</template>
<script>
	import { AjaxApi, PromiseAll, SHARE_URL, activityUrl } from "@/utils/api";
	import { getObjType, Promote, getBarHeight, appInit, getUserLocation } from "@/utils";
	import store from "@/store";
	import dictionary from "@/utils/dictionary";
	import popUp from "../../components/popup/popup";
	import inviteCode from "../../components/u-act/u-act";
	export default {
		components: {
			popUp,
			inviteCode,
		},
		data() {
			return {
				inxBG: {
					background: "#FE6B00",
				},
				popType: 0, //0:天天领红包
				options: {},
				animationData: {},
				couponList: [],
				inviteMask: false, //助力loading
				inviteLoading: false, //助力
				shopImg: getApp().globalData.shopImg,
				shareId: 0,
				maxAmount: 0,
				popMask: false, //领券弹窗
				loadingMask: true, //APPloading
				hidePage: false,
				isHiddenPlat: false,
				discountGoods: [],
				discountCard: {
					//周三特惠
					buyPrice: 0,
					cardId: 847,
					cardName: "",
					discountPrice: 0,
					equityDelivery: "",
					equityDeliveryName: "",
					equityRedPacket: "",
					equityRedPacketName: "",
					isSaleOut: 0,
					originalPrice: 0,
					validEndTime: "",
				},
				cardDetail: {},
				// groupGoods: [],
				recommendStore: [],
				orderPacket: {},
				platCouponList: [], //平台券列表
				bannerList: [],
				statusBarHeight: 0, //导航栏高度
				currentStore: {
					storeId: 0,
				},
				groups: null, //拼餐活动信息
				pagesPram: {
					//市集拼餐参数
					pageDown: false,
					pageIndex: 1,
					pageSize: 3,
				},
				groupPic: "https://oss.dianddian.cn/v2/activity/newindex/groupPic.png", //市集头像
				couponNum: 0,
				currentCoupon: {},
				setout: null,
				timeOut: null,
				recommendList: [],
			};
		},
		onReachBottom(e) {},
		onHide() {
			clearTimeout(this.setout);
			clearTimeout(this.timeOut);
			this.options = {};
			this.inviteMask = false;
			if (this.groups) {
				getApp().globalData.conectSocket = false;
				getApp().linkWebsocket();
			}
			uni.hideLoading();
		},
		onLoad(query) {
			this.options = query;
		},
		async onShow() {
			if (this.hidePage) {
				this.hidePage = false;
				this.socketFuc();
				return;
			}
			this.statusBarHeight = getBarHeight();
			getUserLocation(this.init, true);
		},
		onPullDownRefresh() {
			// getApp().globalData.NewcomerCoupon = true;
			uni.stopPullDownRefresh();
			let page = getCurrentPages().pop(); //获取当前页面实例
			if (page == undefined || page == null) return;
			if (this.groups) {
				getApp().globalData.conectSocket = false;
				getApp().linkWebsocket();
			}
			this.hidePage = false;
			page.onShow();
		},
		onShareTimeline: function (res) {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
			};
		},
		onShareAppMessage: function (res) {
			if (res.from === "button") {
				const amoun1 = this.orderPacket.amount2;
				return {
					title: `跨店点餐，新人领${amoun1}元红包 ！`,
					imageUrl: "https://oss.dianddian.cn/v2/activity/newindex/invite_new_user1.jpg",
					path: `/pagesD/groupsCoupons/groupsCoupons?recommendId=${getApp().globalData.UserInfo.userId}`,
				};
			} else {
				return {
					title: "进入餐典到了",
					imageUrl: SHARE_URL,
					path: `/pages/index/index`,
				};
			}
		},
		methods: {
			aniFuc() {
				// //事件处理函数
				// let animation = uni.createAnimation({
				// 	duration: 300,
				// 	timingFunction: "cubic-bezier(.8,.2,.1,0.8)",
				// });
				// let self = this;
				// this.animation = animation;
				// this.animation.translateX(520).rotate(0).translateY(0).step();
				// this.animation.translateX(0).translateY(0).rotate(0).step();
				// this.animationData = this.animation.export();
				// this.setout = setTimeout(function () {
				// 	let slidethis = self.couponList.shift();
				// 	self.couponList.push(slidethis);
				// 	self.animationData = {};
				// 	self.$forceUpdate();
				// 	self.timeOut = setTimeout(() => {
				// 		self.aniFuc();
				// 	}, 1500);
				// }, 350);
				//创建动画   5s将位置移动到-150%,-150%
				let animation = uni.createAnimation({
					duration: 500,
					timingFunction: "cubic-bezier(.8,.2,.1,0.8)",
				});
				let self = this;
				animation = animation;
				animation.translateX("150%").translateY("0").rotate(0).step();
				this.animationData = animation.export();
				// 移动完成后
				this.setout = setTimeout(function () {
					self.animationData = {};
					//创建动画   将位置归位
					let animation = wx.createAnimation({
						duration: 100,
					});
					animation.translateX("0").translateY("0").rotate(0).step();
					self.animationData = animation.export();
					setTimeout(() => {
						let slidethis = self.couponList.shift();
						self.couponList.push(slidethis);
					}, 100);
					self.timeOut = setTimeout(() => {
						self.animationData = {};
						self.aniFuc();
					}, 1200);
				}, 500);
			},
			userAddress() {
				return getApp().globalData.userAddress == "请打开位置权限" ? "" : getApp().globalData.userAddress;
			},
			async init() {
				if (this.options?.q) {
					//营销活动
					let link = decodeURIComponent(this.options?.q);
					if (link.indexOf("inviteCode") !== -1) {
						this.promoteFuc(link.split("=")[1]);
					}
				}
				// 市集拼餐
				// this.getGroupGoods(true);
				this.getRecommendStore();
				// let suc2 = res => {//周三特惠商品
				// 	this.discountGoods = res.data ?? [];
				// };
				// let suc3 = res => {//周三特惠会员卡
				// 	this.discountCard = res.data ?? this.discountCard;
				// };

				let suc4 = res => {
					this.orderPacket = res.data ?? {};
				};
				let suc5 = res => {
					this.couponNum = res.data?.COUNT ?? 0;
				};
				// let suc6 = res => {
				// 	this.currentCoupon = res.data ?? {};
				// };
				let suc6 = res => {
					this.couponList = res.data.records ?? [];
					let that = this;
					setTimeout(() => {
						that.aniFuc();
					}, 1000);
				};
				let suc7 = res => {
					this.recommendList = res.data.records ?? [];
				};
				// this.thenAjax("GetInxDiscountGoods", {}, suc2); //周三特惠菜
				// this.thenAjax("GetDiscountCard", {}, suc3); //周三特惠卡
				this.thenAjax("GetOrdersRedPacket", {}, suc4); //分享好友下单红包价格
				this.thenAjax(
					"GetRedPCount",
					{
						isExpire: 1, //是否过期,0:是,1:否
						isUsed: 0, //是否使用,0:待使用,1:已使用
						isTake: 0, //是否领取,0:是,1:否
						userId: getApp().globalData.UserInfo.userId,
					},
					suc5
				);
				// this.thenAjax("SelectUserRedPacket_03", {}, suc6); //查询即将到期红包
				this.thenAjax("SelectUserRedPacketList", { pageIndex: 1, pageSize: 300, isExpire: 1, isTake: 0, isUsed: 0 }, suc6); //查询即将到期红包
				this.thenAjax("HandpickList", { pageIndex: 1, pageSize: 999 }, suc7); //精选推荐
				let proList = [
					store.dispatch("GetGroup", {}), //拼餐活动
					store.dispatch("IsNewUser", {}), //是否新人
					store.dispatch("GetStore", {
						userLatitude: getApp().globalData.location.latitude * 1,
						userLongitude: getApp().globalData.location.longitude * 1,
					}), //最近店铺
					store.dispatch("GetBanner", {
						platType: 0, //平台类型；0：平台；1：门店
					}),
				];
				let thenFuc = async res => {
					let resArr = res.map(a => a?.data);
					this.groups = resArr[0] ?? null;
					this.socketFuc();
					this.isNewUser = resArr[1] ?? false;
					this.currentStore = resArr[2] ?? { storeId: 0 };
					this.bannerList = resArr[3] ?? [];
					if (this.isNewUser) {
						let nCoupon = await store.dispatch("NewRedP", {});
						if (nCoupon.code == 0) {
							this.platCouponList = nCoupon.data;
							this.popType = 9;
							this.popMask = true;
						} else {
							this.checkPlatform();
						}
					} else {
						this.checkPlatform();
					}
				};
				let catchFuc = err => {
					if (err == 1001) this.init();
				};
				PromiseAll(proList, thenFuc, catchFuc);
			},
			thenAjax(name, params, successFuc) {
				AjaxApi(name, params, successFuc);
			},
			getRecommendStore() {
				let successFuc = res => {
					this.recommendStore = res.data ?? [];
				};
				AjaxApi("GetShopRecommend", { lat: getApp().globalData.location.latitude, lng: getApp().globalData.location.longitude }, successFuc);
			},
			clickShare() {
				// 优惠券到账通知 2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU
				// 优惠券过期提醒 VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w
				// 卡券到账通知 e2MnZwf_ftrpGRujcaKQdq843t_lTv667jBwS1xBvy4
				// 会员到期提醒 uPuuEZbj-TyYVoRb8T_ZjjMsrk5lFFDzkSurVVtE_VM
				uni.requestSubscribeMessage({
					tmplIds: ["2JB_bInIax2c4ChJyrjEFwjF2Y4Mpp-QfhtjpmNMJzU", "VB4KC1ddD-jLdljz9qQ5N8yGUyhv5U9Sn82LX4cFT3w"],
				});
			},
			loginFuc(fuc) {
				if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
					uni.reLaunch({
						url: "/pagesB/login/login",
					});
				} else {
					fuc();
				}
			},
			async socketFuc(group) {
				let pdId = await store.dispatch("GetPdId", {});
				if (pdId?.data) {
					//打开
					getApp().globalData.conectSocket = true;
					getApp().linkWebsocket(`${pdId?.data}/${getApp().globalData.UserInfo.userId}`);
					getApp().initSocket();
				} else {
					//关闭
					getApp().globalData.conectSocket = false;
					getApp().linkWebsocket();
				}
				getApp()
					.getWebSocket()
					.onReceivedMsg(async result => {
						let group = await store.dispatch("GetGroup", {});
						this.groups = group.data ? group.data : null;
						if (!this.groups) {
							getApp().globalData.conectSocket = false;
							getApp().linkWebsocket();
						}
					});
			},
			async checkPlatform() {
				//查询平台可用红包
				let res = await store.dispatch("SelectUserRedPacket", {
					isExpire: 1,
					isTake: 1,
					isUsed: 0,
					source: 0,
					sendType: -1,
					storeId: this.currentStore.storeId,
				});
				let popType3 = await store.dispatch("GetIndexCard", {});
				if (popType3.code == 0) {
					if (popType3.data) {
						this.cardDetail = popType3.data;
						this.popType = 3;
					}
				}
				if (res.code == 0) {
					this.platCouponList = res.data;
					this.isHiddenPlat = true;
					const ID = this.platCouponList.filter(ele => ele.id).map(ele => ele.id);
					const R_Id = this.platCouponList.filter(ele => ele.recordId).map(ele => ele.recordId);
					let request = await store.dispatch("UserTakeRedPacket", {
						id: ID,
						recordId: R_Id,
					});
				}
			},
			tabFuc(key) {
				switch (key) {
					case 1:
						let it = {
							jumpType: "2",
							jumpUrl: activityUrl,
						};
						// let it = { jumpType: "2", jumpUrl: "https://testddd.dianddian.cn/html/saleActivity/activity.html" };
						this.tabBanner(it);
						break;

					default:
						break;
				}
			},
			turnTo(key) {
				switch (key) {
					case "store":
						//进店
						uni.navigateTo({
							url: `/pagesC/store/store?storeId=${this.currentStore.storeId}`,
						});
						break;
					case "chains":
						//接龙
						uni.navigateTo({
							url: `/pagesJie/chains/chains`,
						});
						break;
					case "spellOrder":
						uni.reLaunch({
							url: `/pages/spellOrder/spellOrder`,
						});
						break;
					case "joinGroup":
						this.hidePage = true;
						uni.navigateTo({
							url: `/pagesB/propaganda/propaganda?url=https://mp.weixin.qq.com/s/pK3Yi7n6O3aXhABKmhkFtg&type=2`,
						});
						break;
					case "signIn":
						let fuc = () => {
							this.hidePage = true;
							uni.navigateTo({
								url: `/pagesD/canDianCoin/canDianCoin`,
							});
						};
						this.loginFuc(fuc);
						break;

					default:
						break;
				}
			},
			toSpellOrder(its) {
				uni.reLaunch({
					url: `/pages/home/home?storeId=${its?.storeId ?? 0}&shopId=${its?.shopId ?? 0}&type=1`,
				});
			},
			closePlat() {
				this.isHiddenPlat = false;
			},
			tabBanner(it) {
				switch (it.jumpType) {
					//跳转类型；0：小程序；1：图片；2：H5 ;3: 弹窗
					case "0":
						if (it.jumpUrl.split("?")[1]) {
							const URL = it.jumpUrl.split("?")[0];
							if (URL == "/pages/home/home") {
								const STR = JSON.parse(it.jumpUrl.split("?")[1]);
								uni.navigateTo({
									url: `/pages/home/home?shopId=${STR}`,
								});
							} else {
								uni.navigateTo({
									url: `${it.jumpUrl}`,
									fail(res) {
										uni.switchTab({
											url: URL,
											fail(res) {},
										});
									},
								});
							}
							return;
						}
						uni.navigateTo({
							url: `${it.jumpUrl}`,
							fail(res) {
								uni.switchTab({
									url: `${it.jumpUrl}`,
									fail(res) {},
								});
							},
						});
						break;
					case "1":
						uni.navigateTo({
							url: `/pagesB/propaganda/propaganda?url=${it.jumpUrl}&type=${it.jumpType}`,
						});
						break;
					case "2":
						uni.navigateTo({
							url: `/pagesB/propaganda/propaganda?url=${it.jumpUrl}&type=${it.jumpType}`,
						});
						break;
					case "3":
						const activityFuc = it.jumpUrl;
						this[activityFuc]();
						break;
					default:
						break;
				}
			},
			hideInvite() {
				this.inviteMask = false;
				this.inviteLoading = false;
			},
			async getInvite() {
				this.inviteMask = true;
				this.inviteLoading = true;
				let AuthCoupon = await store.dispatch("AuthCoupon", {});
				if (AuthCoupon.code !== 0) {
					uni.hideLoading();
					this.inviteMask = false;
					uni.showToast({
						title: "获取资格验证失败！",
						icon: "none",
						mask: true,
						duration: 2000000,
					});
					return;
				}
				let sucFuc = res => {
					this.inviteLoading = false;
					this.shareId = res.data.id;
					this.maxAmount = res.data.maxAmount;
				};
				AjaxApi(
					"SetInviteShare",
					{
						header: { idem_token: AuthCoupon.data },
					},
					sucFuc
				);
			},
			shoppingMode(i) {
				this.hidePage = true;
				getApp().globalData.shoppingMode = i;
				this.turnTo("store");
			},
			jumpOther() {
				uni.navigateToMiniProgram({
					appId: "wxb14c7a66ba891b37",
					success(res) {
						console.log(res);
					},
				});
			},
			jumpOrderDetail() {
				let page = this.groups.type == 1 ? `/pagesPing/dinnerOrderDeatil/dinnerOrderDeatil?id=${this.groups.id}&type=0` : `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${this.groups.id}&type=0`;
				uni.navigateTo({
					url: page,
				});
			},
			async promoteFuc(par) {
				//营销活动
				const TOKEN = uni.getStorageSync("token");
				Promote({ query: par }, TOKEN);
			},
			hidePop() {
				this.popMask = false;
				if (this.popType == 9) {
					this.checkPlatform();
				}
			},
			tabDisCard() {
				if (!this.isWednesday) {
					uni.showToast({
						title: "只在周三开放售卖哦～",
						icon: "none",
						duration: 1500,
					});
					return;
				}
				this.hidePage = true;
				uni.navigateTo({
					url: `/pagesD/membershipCard/membershipCard?cardId=${this.discountCard.cardId}`,
				});
			},
			tabDisGoods(item) {
				if (!this.isWednesday) {
					uni.showToast({
						title: "只在周三开放售卖哦～",
						icon: "none",
						duration: 1500,
					});
					return;
				}
				this.hidePage = true;
				// uni.reLaunch({
				// 	url: `/pages/spellOrder/spellOrder?storeId=${item.storeId}&shopId=${item.shopId}`,
				// });
				uni.navigateTo({
					url: `/pagesPing/foodDetails/foodDetails?storeId=${item.storeId}&id=${item.goodsId}&storeStatus=1`,
				});
			},
			getEvery() {
				uni.showLoading({
					title: "领取中",
					mask: true,
				});
				let successFuc = res => {
					this.platCouponList = res.data;
					this.popType = 0;
					this.popMask = true;
				};
				AjaxApi("GetEveryCoupons", {}, successFuc);
			},
			jumpCoupon() {
				uni.navigateTo({
					url: "/pagesC/couponList/couponList",
				});
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
				return this.getcurentDate(v) > 5 ? `有效期至${v.split(" ")[0]}` : this.getcurentDate(v) < 1 ? `有效期至${v.slice(0, 11).replace(/-/g, ".")}` : this.getNowDate(v);
			},
		},
		computed: {
			isWednesday() {
				return new Date().getDay() == 3;
			},
			saleTypeKeys() {
				return dictionary.saleTypeKeys;
			},
			couponType() {
				return dictionary.couponType;
			},
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.u-navbar-placeholder {
		height: 0 !important;
	}
	.container {
		width: 100vw;
		overflow: hidden;
		position: relative;
		padding-bottom: 100rpx;
		padding-bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
		background: linear-gradient(to bottom, #fe6b00 0%, #fe6b00 300rpx, #f6f6f7 301rpx, #f6f6f7 100%);
		min-height: 100vh;
		.bold {
			font-weight: bold;
		}
		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			flex: 1;
			/* 如果您想让slot内容与导航栏左右有空隙 */
			width: 0;
			padding: 0 24rpx;
			image {
				&:first-of-type {
					width: 24rpx;
					height: 28rpx;
				}
				&:nth-of-type(2) {
					width: 22rpx;
					height: 16rpx;
				}
			}
			font-size: 28rpx;
			font-weight: bold;
			color: #ffffff;
		}
		.inx-bg {
			background: linear-gradient(180deg, #ffffff 0%, #f6f6f7 100%);
			border-radius: 36rpx 36rpx 0 0;
			overflow: hidden;
			margin-top: 20rpx;
		}
		.inx-swiper {
			height: 234rpx;
			background: transparent;
			overflow: hidden;
			padding: 24rpx 24rpx 0 24rpx;
			.swiper {
				height: 200rpx;
			}
			.swiper-item {
				height: 200rpx;
				border-radius: 16rpx;
				overflow: hidden;
			}
			.banner-img {
				width: 100%;
				height: 200rpx;
			}
		}
		.inx-tab {
			background: transparent;
			padding: 30rpx;
			image {
				width: 100rpx;
				height: 100rpx;
			}
			display: flex;
			justify-content: space-between;
			color: #1c1c1d;
			font-size: 24rpx;
			> view {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.inx-tab-share {
				padding: 0;
				margin: 0;
				border: 0;
				overflow: inherit;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				color: #1c1c1d;
				font-size: 24rpx;
				.price {
					position: absolute;
					top: -1rpx;
					right: -30rpx;
					min-width: 80rpx;
					padding: 0 6rpx 0 4rpx;
					height: 26rpx;
					line-height: 22rpx;
					background: #ff3b3b;
					border-radius: 14rpx 14rpx 14rpx 0;
					border: 2rpx solid #ffffff;
					font-size: 18rpx;
					font-weight: bold;
					color: #ffffff;
					text-align: center;
				}
			}
		}
		.recommend-box {
			margin: 20rpx 26rpx 0;
			border-radius: 16rpx;
			.swiper-wrapper {
				background: #fff;
				height: 420rpx;
				padding: 30rpx 0 10rpx;
				box-sizing: border-box;
			}
			.title-img {
				width: 128rpx;
				height: 38rpx;
				margin-left: 20rpx;
				margin-bottom: 24rpx;
				background: #fff;
				image {
					width: 100%;
					height: 100%;
				}
			}
			::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}
			.recommend-con {
				width: 100%;
				background: #fff;
				height: 318rpx;
				padding-left: 20rpx;
				display: flex;
				white-space: nowrap;
				box-sizing: border-box;
				.swiper-box {
					display: inline-block;
					width: 320rpx;
					height: 318rpx;
					overflow: hidden;
					padding-bottom: 20rpx;
					.swiper {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						height: 100%;
					}
					image {
						width: 300rpx;
						height: 180rpx;
						margin-bottom: 14rpx;
						border-radius: 8rpx;
					}
					.title {
						max-width: 300rpx;
						font-size: 26rpx;
						color: #333333;
						white-space: normal !important;
					}
					.price {
						width: 100%;
						display: flex;
						align-items: flex-end;
						.left-price {
							color: #f52b28;
							vertical-align: bottom;
							margin-right: 20rpx;
							> text {
								&:first-child {
									font-size: 32rpx;
									font-family: DIN;
									font-weight: 500;
								}
								&:last-child {
									font-size: 24rpx;
									font-weight: bold;
								}
							}
						}
						.right-price {
							font-size: 20rpx;
							font-family: DIN;
							font-weight: 500;
							color: #999999;
							text-decoration: line-through;
							vertical-align: bottom;
							line-height: 32rpx;
						}
					}
				}
			}
		}
		.inx-block {
			padding: 0 24rpx;
			background: #f6f6f7;
			border-radius: 16rpx;
			&.top {
				display: flex;
				> view {
					display: flex;
					flex: 1;
					height: 150rpx;
					background: #ffffff;
					border-radius: 16rpx;
					> view {
						padding: 20rpx 0 20rpx 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
				}
				.btn-share {
					margin: 0;
					padding: 0;
					border: 0;
					display: flex;
					flex: 1;
					height: 150rpx;
					background: #ffffff;
					line-height: 42rpx;
					text-align: left;
					border-radius: 16rpx;
					> view {
						padding: 20rpx 0 20rpx 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
					}
				}
				.child-a {
					font-size: 28rpx;
					font-weight: bold;
					color: #1c1c1d;
				}
				.child-b {
					font-size: 24rpx;
					color: #fe6b00;
				}
				image {
					&.img-a {
						width: 58rpx;
						height: 24rpx;
					}
					&.img-b {
						width: 120rpx;
						height: 150rpx;
						margin-left: auto;
					}
				}
			}
			&.bottom {
				background: #ffffff;
				margin: 20rpx 24rpx;
				padding: 26rpx 20rpx;
				> view {
					display: flex;
				}
				.box-left {
					width: 320rpx;
					height: 180rpx;
					background: linear-gradient(135deg, #fff6e7 0%, #ffdd96 100%);
					border-radius: 6rpx;
					padding: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					color: #7c3f00;
					word-break: break-all;
					.inx-b-btn {
						width: 72rpx;
						height: 36rpx;
						line-height: 36rpx;
						background: #7c3f00;
						border-radius: 6rpx;
						text-align: center;
						color: #ffe4ae;
					}
					> view {
						&:nth-of-type(2) {
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
					}
				}
				.box-right {
					width: 320rpx;
					height: 180rpx;
					border-radius: 6rpx;
					overflow: hidden;
					.box-rightr-img {
						animation: myfirst 0.4s infinite;
						width: 120rpx;
						height: 120rpx;
						margin-left: 110rpx;
					}
					.scroll-x {
						.scroll-box {
							display: flex;
							> view {
								width: calc(100% - 180rpx);
								word-break: break-all;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
							}
						}
					}
					.inx-b-btn {
						width: 120rpx;
						height: 44rpx;
						line-height: 44rpx;
						text-align: center;
						background: #fe6b00;
						border-radius: 6rpx;
						color: white;
						&.wednesday {
							background: #f6f6f7;
							color: #ababaf;
						}
					}
				}
				image {
					&.img-a {
						width: 154rpx;
						height: 30rpx;
					}
					&.img-b {
						width: 180rpx;
						height: 180rpx;
						border-radius: 6rpx;
					}
				}
			}
		}
		.coupon-block {
			margin: 20rpx;
			margin-bottom: 20rpx;
			background: #ffffff;
			border-radius: 16rpx;
			padding: 40rpx;
			padding-top: 20rpx;
			.coupon-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;
				> view {
					font-size: 28rpx;
					&:first-child {
						color: #1c1c1d;
						font-weight: 500;
						text {
							color: #ff3b3b;
						}
					}
					&:last-child {
						color: #fe6b00;
					}
				}
			}
			.coupon {
				background: #fff;
				border-radius: 16rpx;
				height: 180rpx;
				display: flex;
				// border: 1rpx solid rgba(204, 204, 204, 0.4);
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				position: relative;
				.coupon-son {
					background: white;
					width: 100%;
					display: flex;
					position: absolute;
					left: 0;
					top: 0;
				}
				.redEnvelope-left {
					padding-top: 34rpx;
					padding-bottom: 46rpx;
					width: 200rpx;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					background: #fff4ed;
					border-radius: 8px;
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
				}
			}
		}
		.inx-together {
			margin: 0 24rpx;
			height: 80rpx;
			background: #ffffff;
			border-radius: 16rpx;
			color: #fe6b00;
			image {
				width: 40rpx;
				height: 40rpx;
				vertical-align: middle;
			}
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			> view {
				display: flex;
				align-items: center;
			}
		}
		.inx-to-tit {
			margin: 40rpx 24rpx 0 24rpx;
			image {
				width: 128rpx;
				height: 38rpx;
			}
		}
		.inx-to-goods {
			margin: 20rpx 24rpx;
			padding: 20rpx;
			background: white;
			border-radius: 16rpx;
			> view {
				&:first-child {
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
							border-radius: 6rpx;
						}
						&.img-b {
							width: 16rpx;
							height: 24rpx;
							margin-top: 10rpx;
						}
					}
				}
				&:last-child {
					::-webkit-scrollbar {
						width: 0;
						height: 0;
						color: transparent;
					}
					.recommend-con {
						width: 100%;
						display: flex;
						white-space: nowrap;
						box-sizing: border-box;
					}
					image {
						width: 208rpx;
						height: 160rpx;
					}
					.inx-to-good {
						display: inline-block;
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
		.guide {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 10090;
			opacity: 1;
			color: #fff;
			background: rgba(0, 0, 0, 0.6);
			width: auto;
			height: 100vh;
			.guide-bg-container {
				::-webkit-scrollbar {
					width: 0;
					height: 0;
					color: transparent;
				}
				position: fixed;
				top: 45%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 608rpx;
				min-height: 590rpx;
				.plat-bg {
					image {
						width: 100%;
						vertical-align: bottom;
					}
				}
				.plat-con {
					::-webkit-scrollbar {
						width: 0;
						height: 0;
						color: transparent;
					}
					background: #db4948;
					padding: 20rpx;
					border-radius: 0 0 16rpx 16rpx;
					scroll-view {
						box-sizing: border-box;
					}
					.quan {
						position: relative;
						width: auto;
						height: 130rpx;
						background: radial-gradient(circle at right top, transparent 20rpx, #ffffff 0) top left / 422rpx 51% no-repeat, radial-gradient(circle at right bottom, transparent 20rpx, #ffffff 0) bottom left / 422rpx 51% no-repeat,
							radial-gradient(circle at left top, transparent 20rpx, #ffffff 0) top right / 150rpx 51% no-repeat, radial-gradient(circle at left bottom, transparent 20rpx, #ffffff 0) bottom right / 150rpx 51% no-repeat;
						&:before {
							content: "";
							height: 80rpx;
							border: 2rpx dashed #ff4d4f;
							position: absolute;
							left: 420rpx;
							top: 0;
							bottom: 0;
							margin: auto;
						}
						display: flex;
						justify-content: space-between;
						border-radius: 12rpx;
						margin-bottom: 20rpx;
						> view {
							display: flex;
							&:first-child {
								width: 422rpx;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								padding: 0 20rpx;
								> view {
									display: flex;
									&:first-child {
										color: #333333;
										font-size: 32rpx;
										font-weight: 400;
										align-items: flex-end;
										padding-bottom: 10rpx;
									}
									&:nth-child(2) {
										> view {
											border: 2rpx solid #ff4d4f;
											color: #ff4d4f;
											padding: 0 6rpx;
											line-height: 28rpx;
											margin-right: 10rpx;
										}
										padding-top: 10rpx;
										color: #666666;
										font-size: 20rpx;
										font-weight: 400;
										align-items: start;
									}
									height: 50%;
									width: 100%;
								}
							}
							&:nth-child(2) {
								flex: 1;
								width: 0;
								justify-content: center;
								align-items: center;
								color: #ff4d4f;
								flex-direction: column;
								font-weight: bold;
								font-size: 48rpx;
								> text {
									&:nth-child(2) {
										color: #666666;
										font-weight: 400;
									}
								}
							}
						}
						&.unactive {
							&:before {
								content: "";
								height: 130rpx;
								border: 2rpx dashed #666666;
								position: absolute;
								left: 510rpx;
								top: 0;
								bottom: 0;
								margin: auto;
							}
							> view {
								&:first-child {
									> view {
										display: flex;
										&:first-child {
											color: #666666;
										}
										&:nth-child(2) {
											> view {
												border: 2rpx solid #666666;
												color: #666666;
											}
											color: #666666;
										}
									}
								}
								&:nth-child(2) {
									color: #666666;
									position: relative;
									image {
										width: 90rpx;
										height: 70rpx;
										position: absolute;
										right: 12rpx;
										top: 12rpx;
									}
								}
							}
						}
					}
				}
			}
		}
		.information {
			width: auto;
			height: 200rpx;
			background: #fff;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 20rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			position: relative;
			border-radius: 16rpx;
			> view {
				flex: 1;
				display: flex;
				align-items: center;
				font-size: 32rpx;
				font-weight: 400;
				line-height: 100rpx;
				color: #1e1f21;
				&:first-child {
					&:after {
						content: "";
						position: absolute;
						top: 50%;
						left: 100rpx;
						background: #f1f1f4;
						height: 2rpx;
						width: 85%;
					}
				}
				.bold {
					font-weight: bold;
				}
				> view {
					&:first-child {
						flex: 1;
						width: 0;
						text-align: left;
					}
					image {
						width: 30rpx;
						height: 36rpx;
						vertical-align: middle;
					}
					&:last-child {
						text-align: right;
						font-size: 28rpx;
						color: #aeaeb2;
					}
				}
				/deep/u-icon {
					color: #d5d5d5;
				}
			}
		}
	}
</style>
