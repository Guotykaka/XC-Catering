<template>
	<view class="container">
		<u-navbar :back-icon-color="backColor" :custom-back="backFuc" :is-back="true" title=" " :title-width="0" :border-bottom="false" :background="backgroundImg">
			<view class="slot-navbar u-font-28" v-if="showNavigationBar" @tap="jumpSearch"> <u-icon class="u-m-l-20 u-m-r-20" name="search" color="#999999 " size="28"></u-icon>请输入商品名称 </view>
		</u-navbar>
		<u-mask class="load-mask" :show="loadingMask" :duration="0" z-index="10090" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<image class="banner-img" src="https://oss.dianddian.cn/common/ddd_log.png" mode="aspectFill"></image>
		</u-mask>
		<!-- 扫码支付弹窗 -->
		<u-mask class="scan-mask" :show="scanPayMask" :duration="0" z-index="10090" :custom-style="{ background: 'rgba(0, 0, 0, 0.7)' }">
			<view class="scan-pay">
				<view class="u-flex u-row-right u-col-center">
					<view class="tittle u-font-40">请选择</view>
					<u-icon name="close" color="#666666" size="36" @tap="scanPayMask = false"></u-icon>
				</view>
				<view class="bts u-flex u-col-center">
					<view @tap="scanPayMask = false">
						<image src="https://oss.dianddian.cn/v2/bts2.png" mode="aspectFill" style="width: 130rpx"></image>
					</view>
					<view @tap.stop="tapScanMask">
						<button v-if="!phoneNumber" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="border: 0">
							<image src="https://oss.dianddian.cn/v2/bts1.png" mode="aspectFill" style="width: 180rpx"></image>
						</button>
						<image v-else src="https://oss.dianddian.cn/v2/bts1.png" mode="aspectFill" style="width: 180rpx"></image>
					</view>
				</view>
			</view>
		</u-mask>
		<!-- 扫码领券弹窗 -->
		<ScanCoupon :scanMask="scanMask" :scanType="scanType" :list="scanCouponList" :mark="scanCouponMark" @inVite="hideScan"></ScanCoupon>
		<view v-if="!loadingMask">
			<view class="banner-box">
				<view class="bg-banner">
					<image v-if="currentShop.shopHeadPic" :src="currentShop.shopHeadPic" mode="aspectFill"></image>
					<image v-else :src="shopBgImg" mode="aspectFill"></image>
				</view>
				<view class="shop-info-box">
					<view class="shop-info-top">
						<view class="shop-pic">
							<image v-if="currentShop.shopLogo" :src="currentShop.shopLogo" mode="aspectFill"></image>
							<image v-else :src="`${shopImg}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
						</view>
						<view class="shop-info">
							<view class="shop-name">
								<view class="u-line-2">
									{{ currentShop.shopName }}
								</view>
								<view :class="{ active: currentShop.isCollect == 0 }" @tap="doCollect">
									<text class="iconfont iconxinshixin u-m-r-12 u-font-32"></text>
									{{ currentShop.isCollect == 0 ? "已收藏" : "收藏" }}
								</view>
							</view>
							<view>
								<text class="text1">{{ currentShop.shopScore ? `${currentShop.shopScore}分` : "暂无评价" }}</text>
								<text>已售 {{ currentShop.saleCount ? (currentShop.saleCount > 9999 ? "9999+" : currentShop.saleCount) : "0" }}</text>
								<text>距离 {{ currentShop.distance || "0m" }}</text>
								<text>
									<text class="iconfont iconshijian"></text>
									{{ shoppingMode ? "出餐" : "配送" }}时间{{ shoppingMode ? `${currentShop.expectedTime}分钟` : currentShop.deliveryTime }}
								</text>
							</view>
						</view>
					</view>
					<view class="shop-announcement u-line-1">公告：{{ currentShop.description ? `${currentShop.description}` : "暂无公告" }}</view>
					<view class="shop-info-bot" :style="{ 'margin-top': !activityList.length && !collectOrder && !cartData.firstOrderDiscounts && !couponList.length ? 0 : '20rpx' }">
						<!-- 优惠券列表 -->
						<view class="coupon-wrap">
							<view class="coupon-wrap1" @tap="activityModel = true">
								<div v-for="(it, i) in couponList" :key="i" @tap.stop="chooseOne(it, i)">
									<view :class="[{ active: !it.isTake }, 'coupon-new']" v-if="i < 3">
										<div class="border-left">
											<text style="font-size: 14rpx">¥\t </text>
											<text style="font-size: 24rpx; font-weight: bold; line-height: 1">{{ it.amount + " " }}</text>
											<text> 满{{ it.usedAmount }}可用</text>
										</div>
										<div class="border">
											<div class="semi-circle-top"></div>
											<div class="semi-circle-bot"></div>
										</div>
										<div class="border-right" v-if="it.isTake">领</div>
										<div class="border-right" v-else>已领</div>
									</view>
								</div>
								<u-icon name="arrow-down" color="#999999" size="28" @tap="activityModel = true" v-if="!activityList.length && !collectOrder && !cartData.firstOrderDiscounts && couponList.length"></u-icon>
								<div class="activity-new" v-if="activityList.length" @tap="activityModel = true">
									<u-icon name="arrow-down" color="#999999" size="28" v-if="currentShop.marketCount * 1 > 0"></u-icon>
									<view v-for="(i, ind) in activityList" class="activity-tit" :key="ind"> 满{{ i.maxAmount }}减{{ i.reduceFee }} </view>
								</div>
								<div class="activity-rebate u-line-1" v-if="!activityList.length && currentShop.marketMsg3Dto" @tap="activityModel = true">
									<u-icon name="arrow-down" color="#999999" size="28" v-if="currentShop.marketCount * 1 > 0"></u-icon>
									<text class="activity-tit"> 返券 </text><text class="u-font-20">{{ currentShop.marketMsg3Dto.str3 }}</text>
								</div>
								<div class="activity-rebate u-line-1" v-if="!activityList.length && !currentShop.marketMsg3Dto && currentShop.marketMsg2Dto" @tap="activityModel = true">
									<u-icon name="arrow-down" color="#999999" size="28" v-if="currentShop.marketCount * 1 > 0"></u-icon>
									<text class="activity-tit"> 新客 </text>
									<text class="u-font-20">{{ currentShop.marketMsg2Dto.str2 }}</text>
								</div>
								<div class="activity-rebate u-line-1" v-if="!activityList.length && !currentShop.marketMsg3Dto && !currentShop.marketMsg2Dto && currentShop.marketMsg1Dto" @tap="activityModel = true">
									<u-icon name="arrow-down" color="#999999" size="28" v-if="currentShop.marketCount * 1 > 0"></u-icon>
									<text class="activity-tit"> 集单 </text>
									<text class="u-font-20">{{ currentShop.marketMsg1Dto.str1 }}</text>
								</div>
								<div class="activity-rebate u-line-1" v-if="!activityList.length && !currentShop.marketMsg3Dto && !currentShop.marketMsg2Dto && !currentShop.marketMsg1Dto && currentShop.marketMsg4Dto" @tap="activityModel = true">
									<u-icon name="arrow-down" color="#999999" size="28" v-if="currentShop.marketCount * 1 > 0"></u-icon>
									<text class="activity-tit"> 配送 </text>
									<text class="u-font-20">配送费满{{ currentShop.marketMsg4Dto.amount1 }}元减{{ currentShop.marketMsg4Dto.amount2 }}元</text>
								</div>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商家推荐 -->
			<view class="recommend-box" v-if="recommenList.length">
				<view class="recommend-title">商家推荐</view>
				<view class="recommend">
					<scroll-view :show-scrollbar="false" scroll-x scroll-with-animation scroll-into-view="true" style="width: 100vw">
						<view class="recommend-scroll">
							<view class="dishes-box" v-for="(item, index) in recommenList" :key="index" @tap.stop="jumpGoodDetails(item)">
								<image :src="`${item.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
								<view class="sell-out" v-if="item.sellOut">售罄</view>
								<view :class="[{ sellout: item.sellOut }, 'dishes-name', 'u-line-1']">{{ item.goodsName }}</view>
								<view :class="[{ sellout: item.sellOut }, 'dishes-info', 'u-line-1']">
									<view>已售{{ item.count > 9999 ? "9999+" : item.count }}</view>
									<view>好评率{{ item.favorableRate || 100 }}%</view>
								</view>
								<view class="dishes-bot">
									<view :class="[{ sellout: item.sellOut }, 'dishes-price', 'u-line-1']">
										<text class="text1">￥</text>
										<text>{{ shoppingMode ? item.discountPrice : item.wmDiscountPrice }}</text>
									</view>
									<view class="origin-num" v-if="item.specsFlag && currentShop.status == 1 && !item.sellOut" @tap.stop="changeSPcart(item, 'plus')">
										<text v-if="item.number" class="has-stocks">{{ item.number }}</text>
										选规格
									</view>
									<view class="origin-num" v-else-if="Boolean(item.originNum > 1 && currentShop.status == 1) && item.number == 0 && !item.sellOut" @tap.stop="changeSPcart(item, 'plus')">
										{{ `${item.originNum}份起点` }}
									</view>
									<view class="dishes-count" v-else-if="currentShop.status == 1 && !item.sellOut">
										<view class="count-minus dishes-minus iconfont icon-minus" v-if="item.number !== 0" @tap.stop="changeSPcart(item, 'minus')"> </view>
										<span v-if="item.number !== 0">{{ item.number }}</span>
										<view class="count-plus dishes-minus iconfont icon-add" @tap.stop="changeSPcart(item, 'plus')"> </view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 商铺列表 -->
			<view style="width: 100%; position: -webkit-sticky; position: sticky; z-index: 8000; background: #fff" :style="{ top: `${navigationHeight}px` }">
				<view class="tabs u-border-bottom">
					<view style="width: 360rpx">
						<u-tabs :list="tablist" :is-scroll="false" :current="currentTab" @change="changeTabs" bar-width="70" active-color="#fe6b00"></u-tabs>
					</view>
					<view class="pin" @tap="reLaunch" v-if="!currentShop.isGroupShop">拼餐<image src="/static/img/new.png" mode="aspectFill"></image> </view>
					<text class="comment-count" :style="{ color: currentTab == 2 ? '#fe6b00' : '' }">{{ comments > 999 ? "999+" : comments }}</text>
				</view>
			</view>
			<!-- 左侧-->
			<view class="shop-wrap" v-if="currentTab == 0" style="position: -webkit-sticky; position: sticky" :style="{ top: `${navigationHeight + 40}px` }">
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" :lower-threshold="100" class="left-shop-menu">
					<view v-for="(item, index) in goodsType" class="shop-menu-item" :class="{ active: currentShopIndex == index }" @tap="swichTypeMenu(item.typeId, index)" :key="index">
						{{ item.typeName }}
					</view>
				</scroll-view>
				<!-- 右侧 -->
				<div style="flex: 1">
					<view class="type-name" :style="{ top: `${navigationHeight + 40}px` }"> <text v-if="typeRequired" class="goods-type-name">必</text>{{ typeName }} </view>
					<div style="background: #fff; z-index: 500">
						<!-- 点餐 -->
						<view :class="[{ gray: !currentShop.status }, 'right-scroll-view']">
							<!-- 商品列表 -->
							<scroll-view :show-scrollbar="false" scroll-y :scroll-top="scrollTop" @scroll="rightScrollFuc" scroll-with-animation :scroll-into-view="tabView" :style="{ height: `${scrollRightHeight - 100}px;position:relative` }" id="scroll-r">
								<view v-for="(i, indx) in goodsList" :key="indx">
									<view class="goods-obj" :data-element="i.typeName" :data-required="i.required">
										<view class="goods-list-title" :data-element="i.typeName" v-if="displayTypeName(i.typeName, indx)">
											<text v-if="i.required" class="goods-type-name">必</text>
											{{ i.typeName }}
										</view>
										<view :class="[{ sellout: i.sellOut }, 'goods-item']" :id="`item${i.typeId}`">
											<image class="goods-img" :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill" lazy-load lazy-load-margin="0.5" @tap.stop="jumpGoodDetails(i)"></image>
											<view :class="[{ sellout: i.sellOut }, 'goods-des']">
												<view style="min-width: 0">
													<view class="title u-line-1" @tap.stop="jumpGoodDetails(i)">{{ i.goodsName }}</view>
													<view :class="[{ sellout: i.sellOut }, 'des1', 'u-line-1']" @tap.stop="jumpGoodDetails(i)">{{ goodsRank(i.rank, i.description) }}</view>
												</view>
												<view :class="[{ sellout: i.sellOut }, 'des2']">
													<text class="sold-num">已售{{ i.count > 9999 ? "9999+" : i.count }}</text>
													<text v-if="i.favorableRate">好评度{{ i.favorableRate }}%</text>
												</view>
												<view :class="[{ sellout: i.sellOut }, 'des2']" style="color: #ff4d4f; font-szie: 16rpx" v-if="i.discountNum > 0">每单限{{ i.discountNum }}份优惠</view>
												<view class="btm">
													<view :class="[{ sellout: i.sellOut }, 'price']">
														￥<text class="num">{{ shoppingMode ? i.discountPrice : i.wmDiscountPrice }}</text>
														<text :class="[{ sellout: i.sellOut }, 'orgNum']" v-if="shoppingMode ? i.discountPrice !== i.originalPrice : i.wmDiscountPrice !== i.wmOriginalPrice">￥{{ shoppingMode ? i.originalPrice : i.wmOriginalPrice }}</text>
													</view>
													<view class="origin-num" v-if="i.specsFlag && currentShop.status == 1 && !i.sellOut" @tap.stop="changeSPcart(i, 'plus')">
														<text v-if="i.number" class="has-stocks">{{ i.number }}</text>
														选规格
													</view>
													<view class="origin-num" v-else-if="i.originNum > 1 && currentShop.status == 1 && i.number == 0 && !i.sellOut" @tap.stop="changeSPcart(i, 'plus')">
														{{ `${i.originNum}份起点` }}
													</view>
													<view class="count" v-else-if="!i.sellOut">
														<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart(i, 'minus')" v-if="!i.specsFlag && currentShop.status == 1 && i.number !== 0"> </view>
														<span v-if="!i.specsFlag && currentShop.status == 1 && i.number !== 0">{{ i.number }}</span>
														<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(i, 'plus')" v-if="currentShop.status == 1"> </view>
														<view v-else> </view>
													</view>
												</view>
											</view>
										</view>
										<view :class="[{ sellout: i.sellOut }, 'other-box']">
											<text class="u-m-r-10" v-if="i.mtPrice">美团：￥{{ i.mtPrice }}</text>
											<text v-if="i.elmPrice">饿了么：￥{{ i.elmPrice }}</text>
										</view>
										<view class="sell-out" v-if="i.sellOut">售罄</view>
									</view>
								</view>
								<view style="padding-bottom: 244rpx"></view>
							</scroll-view>
						</view>
					</div>
				</div>
			</view>
			<!-- 评论 -->
			<view class="shop-evaluation" v-if="currentTab == 2">
				<view class="evaluation-tag">
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 0 }]" @tap="chooseEvaluateTag(0)">全部{{ evaluateCount.totalCount }}</view>
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 1 }]" @tap="chooseEvaluateTag(1)">最新</view>
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 2 }]" @tap="chooseEvaluateTag(2)">好评{{ evaluateCount.goodsCount }}</view>
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 3 }]" @tap="chooseEvaluateTag(3)">差评{{ evaluateCount.badCount }}</view>
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 4 }]" @tap="chooseEvaluateTag(4)">有图{{ evaluateCount.picCount }}</view>
					<view :class="['tag-span', { 'active-tag': evaluateParams.status == 5 }]" @tap="chooseEvaluateTag(5)">商家回复{{ evaluateCount.replyCount }}</view>
				</view>
				<view v-for="(it, i) in evaluateList" :key="i" class="evaluate-class">
					<view class="evaluate-top">
						<view>
							<image :src="it.createPic || '../../static/img/default-man.png'" mode="aspectFill" lazy-load lazy-load-margin="0.5"></image>
							<text>{{ it.createName }}</text>
						</view>
						<text style="color: #999999">{{ it.createTime.slice(0, 10) }}</text>
					</view>
					<u-rate v-model="evaluateList[i].score" active-color="#FF4D4F" :disabled="true" inactive-color="#DDDDDD" size="16" gutter="6" v-if="true"></u-rate>
					<view class="evaluate-content" v-if="it.content">{{ it.content }}</view>
					<view class="evaluate-pic">
						<scroll-view scroll-x="true" v-if="it.pic.length">
							<view style="display: inline-flex">
								<image @tap="preEveImg(i, inx)" :src="item" mode="aspectFill" v-for="(item, inx) in it.pic" :key="inx" lazy-load lazy-load-margin="0.5"></image>
							</view>
						</scroll-view>
					</view>
					<view class="recommen-box" v-if="it.evaluateGoods || it.evaluateGoods.length < 1">
						<view class="recommen-title">TA的推荐</view>
						<view class="recommen-name" v-for="(item, index) in it.evaluateGoods" :key="index">{{ item.goodsName }}</view>
					</view>
					<view class="evaluate-line" v-if="it.merchantContent"></view>
					<view class="evaluate-merchantContent" v-if="it.merchantContent">回复:{{ it.merchantContent }}</view>
				</view>
			</view>
			<!-- 商家信息 -->
			<view class="shop-display" v-if="currentTab == 1">
				<view class="sale-time">
					<text class="iconfont icontangshi-daodianziqu"></text>
					营业时间：{{ (currentShop.saleStartTime || "").substr(0, 5) }} - {{ (currentShop.saleEndTime || "").substr(0, 5) }}
				</view>
				<view class="sale-time" style="border-top: 2rpx solid #e2e2e2" v-if="currentShop.type !== 0">
					<text class="iconfont iconwaimaidingdan"></text>
					外卖时间：{{ (currentShop.takeOutStartTime || "").substr(0, 5) }} - {{ (currentShop.takeOutEndTime || "").substr(0, 5) }}
				</view>
				<view class="sale-type">
					<view class="s-t-tit">经营类型</view>
					<text class="s-t-type">{{ currentShop.type == 0 ? "堂食" : currentShop.type == 1 ? "外卖" : "堂食+外卖" }}</text>
				</view>
				<view class="sale-type">
					<view class="s-t-tit">商家地址</view>
					<view class="s-t-con">
						<view style="width: 336rpx">
							<text>{{ currentShop.address }}</text>
						</view>
						<view>
							<text style="color: #e4e4e4; margin: 0 24rpx 0 40rpx"> |</text>
							<text class="iconfont icon-addr" style="margin-right: 12rpx" @tap="shopLoc"></text>
							<text class="iconfont icondianhua" style="margin-left: 12rpx" @tap="shopCall" v-if="currentShop.relationPhone"></text>
						</view>
					</view>
				</view>
				<view class="sale-type">
					<view class="s-t-tit">店铺图片</view>
					<image mode="aspectFit" v-if="currentShop.shopLogo" style="width: 150rpx; height: 150rpx; background-color: #eeeeee; margin-right: 20rpx" :src="`${currentShop.shopLogo}?x-oss-process=image/resize,w_700`" @tap="preImg(0)"></image>
					<image mode="aspectFit" v-if="currentShop.shopHeadPic" style="width: 150rpx; height: 150rpx; background-color: #eeeeee; margin-right: 20rpx" :src="`${currentShop.shopHeadPic}?x-oss-process=image/resize,w_700`" @tap="preImg(1)"></image>
				</view>
			</view>
			<!-- 购物车弹框 -->
			<u-popup class="coupon-popup1" v-model="cartModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" :duration="50" :mask="true" :closeable="false" :safe-area-inset-bottom="true" border-radius="8" close-icon-pos="top-left">
				<view>
					<view class="title-tit" @tap="cartModel = false">
						<text>{{ cartData.msg }}</text>
					</view>
					<scroll-view class="goods-List-box" scroll-y="true" show-scrollbar="true">
						<view class="shop-list" :key="index">
							<view class="shop-name">
								<view class="u-line-1">{{ currentShop.shopName }}</view>
								<view @tap="deleteCartFuc">
									<tetx class="iconfont icon-delete icon-style"></tetx>
									清空
								</view>
							</view>
							<view v-for="(i, index) in cartData.shoppingCarts" class="coupon-item" :key="index">
								<view class="goods-pic">
									<image :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" lazy-load lazy-load-margin="0.5"></image>
								</view>
								<view class="goods-detail">
									<view class="goods-top">
										<view class="goods-name u-line-1">{{ i.goodsName }}</view>
										<view class="goods-descript u-line-3">{{ i.specification }}</view>
										<view class="price">
											￥<text class="num">{{ shoppingMode ? i.discountPrice : i.wmDiscountPrice }}</text>
											<text class="orgNum" v-if="shoppingMode ? i.discountPrice !== i.originalPrice : i.wmDiscountPrice !== i.wmOriginalPrice">￥{{ shoppingMode ? i.originalPrice : i.wmOriginalPrice }}</text>
										</view>
									</view>
									<view class="goods-count">
										<view class="count-minus iconfont icon-minus" @tap.stop="changeSPcart(i, 'minus')"> </view>
										<text>{{ i.number }}</text>
										<view class="count-plus iconfont icon-add" @tap.stop="changeSPcart(i, 'plus')"> </view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
			<!--活动弹框 -->
			<u-popup class="coupon-popup1" v-model="activityModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" :duration="50" z-index="10090" :mask="true" :closeable="true" :safe-area-inset-bottom="true" border-radius="8" close-icon-pos="top-left">
				<view>
					<view class="title">
						<text class="title-center"></text>
						<text class="title-center">优惠活动</text>
						<text></text>
					</view>
					<scroll-view scroll-y="true" show-scrollbar="true" style="height: 780rpx">
						<view class="activity-pop">
							<text class="new-tit" v-if="couponList.length" @tap="activityModel = true">优惠券</text>
							<view class="coupon-class" v-for="(it, i) in couponList" :key="i">
								<view class="coupon-top">
									<view class="coupon-top-left">
										<view class="coupon-name u-line-1" :class="[it.isTake ? '' : 'color-style']">{{ it.redPacketName }}</view>
										<view class="remark">
											<text class="span-style u-m-r-8" :class="[it.type == 1 && it.isTake ? 'span-style-r' : 'span-style-b']">{{ it.type == 1 ? "活动券" : "" }}</text>
											<text class="span-style u-m-r-8" :class="[it.type == 1 && it.isTake ? 'span-style-r' : 'span-style-b']">{{ it.saleType == 0 ? "堂食" : it.saleType == 1 ? "外卖" : it.saleType == 2 ? "通用" : "拼餐" }}</text>
											<text class="expiration-date" :class="[it.isTake ? '' : 'color-style']">{{ it.validType == 0 ? "长期有效" : it.validType == 1 ? it.validEndTime + "到期" : "领取后" + it.days + "天内有效" }}</text>
										</view>
									</view>
									<view class="coupon-top-right">
										<view class="amount" :class="[it.isTake ? '' : 'color-style']">
											<text style="font-size: 28rpx">￥</text>
											<text style="font-size: 48rpx">{{ it.amount }}</text>
										</view>
										<view class="amount-info" :class="[it.isTake ? '' : 'color-style']">满{{ it.usedAmount }}元可用</view>
									</view>
								</view>
								<!-- <view class="iconfont iconyilingqu" v-if="!it.isTake"></view> -->
								<view class="coupon-bot">
									<view class="remark-title" :class="{ click: it.click == true }">
										<view>
											<view>{{ it.isShare == 0 ? "同享券（与折扣优惠同享）" : "不同享券（与折扣优惠不同享）" }}</view>
											<view v-if="it.note.length > 0">
												<text v-if="it.click" class="iconfont u-m-l-30 icon-arrow-up" @tap="itClick(i)"></text>
												<text v-else class="iconfont u-m-l-30 icon-arrow-down" @tap="itClick(i)"></text>
											</view>
										</view>
										<view class="u-flex u-row-center" @tap="chooseOne(it, i)" v-if="it.isTake">领券</view>
										<view class="u-flex u-row-center" style="background: #fe6b00; color: #ffffff" @tap="activityModel = false" v-if="!it.isTake">去下单</view>
									</view>
									<view style="word-break: break-all; line-height: 28rpx" v-if="it.note.length > 0 && it.click == true">
										{{ it.note }}
									</view>
								</view>
							</view>
							<div style="background: #fff">
								<text class="new-tit" v-if="activityList.length">优惠活动</text>
								<div class="activity-text" v-if="activityList.length">
									<view class="activity-tit1"> 减</view>
									<view v-for="(i, ind) in currentShop.activityList" :key="ind"> 满{{ i.maxAmount }}减{{ i.reduceFee }}<text v-if="ind < currentShop.activityList.length - 1">、</text></view>
								</div>
								<div class="activity-text u-margin-top-20" v-if="currentShop.marketMsg1Dto">
									<view class="activity-tit1"> 返</view>
									<view> {{ currentShop.marketMsg1Dto.str1 }}</view>
								</div>
								<div class="activity-text u-margin-top-20" v-if="currentShop.marketMsg2Dto">
									<view class="activity-tit1"> 首</view>
									<view> {{ currentShop.marketMsg2Dto.str2 }}</view>
								</div>
								<div class="activity-text u-margin-top-20" v-if="currentShop.marketMsg3Dto">
									<view class="activity-tit1"> 赠</view>
									<view> {{ currentShop.marketMsg3Dto.str3 }}</view>
								</div>
								<div class="activity-text u-margin-top-20" v-if="currentShop.marketMsg4Dto">
									<view class="activity-tit1"> 配</view>
									<view> {{ currentShop.marketMsg4Dto.str4 }}</view>
								</div>
							</div>
						</view>
					</scroll-view>
				</view>
			</u-popup>
			<!-- 选择规格 -->
			<u-popup class="coupon-popup-stocks" v-model="stocksModel" :custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }" mode="bottom" z-index="10090" duration="50" :mask="true" :closeable="true" :safe-area-inset-bottom="true" border-radius="8">
				<view class="popup-stocks">
					<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh">
						<view class="ps-tittle" @tap="stocksModel = false">
							<view>
								<image class="banner-img" v-if="stocksObj.coverPic" :src="`${stocksObj.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
							</view>
							<view>
								<view>{{ stocksObj.goodsName }}</view>
								<view class="u-line-1">{{ stocksObj.description || "暂无描述" }}</view>
							</view>
						</view>
						<view class="ps-mini-tittle" style="margin-top: 0; margin-bottom: 0">{{ stocksObj.typeName }}</view>
						<view class="ps-content" v-if="stocksList.length > 1">
							<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, i) in stocksList" :key="i" @tap="chooseStocks(i)">
								<text> {{ it.specification }}</text>
							</view>
						</view>
						<div v-for="(item, i) in specList" :key="i">
							<view class="ps-mini-tittle" style="margin-bottom: 0">{{ item.name }}</view>
							<view class="ps-content">
								<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, inx) in item.children" :key="inx" @tap="chooseSpec(i, inx)">
									<text> {{ it.name }}</text>
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
			<!-- 购物车 -->
			<view class="cart-spc goods-car-fixed" v-if="cartData.msg && !cartModel && currentShop.status == 1">
				{{ cartData.msg }}
			</view>
			<view class="goods-car goods-car-fixed" @tap="cancelPopup" v-if="currentShop.status == 1">
				<view class="car-pic">
					<u-badge type="error" size="small" :count="cartData.count || 0" :offset="[-36, 0]"></u-badge>
					<image :src="`${cartData.count ? '../../static/img/daodian_car2.png' : '../../static/img/daodian_car.png'}`" v-if="shoppingMode == 1"></image>
					<image :src="`${cartData.count ? '../../static/img/waimai_car2.png' : '../../static/img/waimai_car.png'}`" v-else></image>
				</view>
				<view class="car-detail">
					<view class="goods-detail">
						<view class="total-price">
							<text>￥{{ getPrice(cartData.totalPrice, cartData.reduceFee, cartData.firstOrderDiscounts) }}</text>
							<text class="orgin-price" v-if="getPrice(cartData.totalPrice, cartData.reduceFee, cartData.firstOrderDiscounts) * 1 !== cartData.totalOriginal * 1">￥{{ cartData.totalOriginal || 0 }}</text>
						</view>
						<view class="total-info">
							<text v-if="!shoppingMode" class="u-m-r-10">配送费{{ cartData.shippingFee || 0 }}元</text>
							共{{ cartData.count }}件商品，优惠{{ cartData.totalReduceFee ? cartData.totalReduceFee : 0 }}元
						</view>
					</view>
					<button v-if="!phoneNumber" class="active car-btn" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="border: 0">
						<text>登录</text>
					</button>
					<view v-else :class="[{ active: checkoutclass() }, 'car-btn']" @tap.stop="sureOrder">
						<text v-if="checkoutclass()">{{ shoppingMode == 1 ? "到店" : "外卖" }}/去结算</text>
						<template v-else-if="cartData.required && !checkout.ifcanpay">
							<text class="u-font-20">{{ checkout.text }}</text>
							<text class="u-font-20">未点必选品</text>
						</template>
						<text v-else-if="cartData.required">未点必选品</text>
						<text v-else-if="!cartData.required">{{ checkout.text }}</text>
					</view>
				</view>
			</view>
		</view>
		<u-mask :show="modeMask" :duration="0" z-index="10090" :custom-style="{ background: 'rgba(0, 0, 0, 0.7)' }">
			<view class="mask-slot">
				<view>
					<image src="../../static/img/choose.png"></image>
					<view>请先选择到店或者外卖</view>
				</view>
				<view>
					<view @tap.stop="choodsMode(1)">到店</view>
					<view @tap.stop="choodsMode(0)">外卖</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>
<script>
	import { AjaxApi, PromiseAll, SHARE_URL, activityUrl, axiosGet } from "@/utils/api";
	import { getObjType, Promote1, appInit, paramConversion } from "@/utils";
	import store from "@/store";
	import scanCoupon from "../../components/scancoupon/scancoupon";
	import { Decimal } from "decimal.js";
	export default {
		components: {
			scanCoupon,
		},
		data() {
			return {
				scanCouponList: [], //扫码进店红包列表
				scanMask: false, //扫码弹窗
				scanPayMask: false, //扫码支付弹窗
				scanCouponMark: "",
				scanType: 0, //扫码红包类别
				evaluateCount: {
					totalCount: 0,
					goodsCount: 0,
					badCount: 0,
					picCount: 0,
					replyCount: 0,
				},
				tabView: "item97", //scroll-into-view
				typeName: "", //sticky类别名字
				collectOrder: "", //集单返券字段
				backColor: "#000000",
				ossColor: "#000000",
				tablist: [
					{
						name: "点餐",
					},
					{
						name: "商家",
					},
					{
						name: "评价",
					},
				],
				specList: [], //规格描述列表
				goodsList: [], //菜品列表
				stocksList: [], //规格列表
				couponList: [], //优惠券列表
				goodsType: [], //菜品分类列表
				activityList: [], //满减列表
				evaluateList: [], //评论列表
				couponListTit: [], //优惠券列表
				menuTypeList: [], //菜品列表转出的类别列表
				recommenList: [], //商家推荐列表
				options: {}, //带入参数
				cartData: {
					shoppingCarts: [],
					reduceFee: 0,
					totalPrice: 0,
					count: 0,
				},
				orderPara: {}, //订单信息
				htmlGoods: {}, //优惠活动banner选菜
				stocksObj: {}, //规格商品
				shopStatus: {
					0: "休息中",
					1: "营业中",
					2: "暂停营业",
					3: "已退租",
				},
				currentShop: {
					saleEndTime: "",
					saleStartTime: "",
					shopId: 0,
					shopName: "",
					status: 0, //当前店铺状态0:休息中,1:营业中,2:暂停营业,3:退租
					takeOutEndTime: "",
					takeOutStartTime: "",
					expectedTime: "",
				}, //当前店铺
				stocksGoods: {}, //选中的库存对象
				evaluateParams: {
					pageIndex: 1,
					pageSize: 10,
					shopId: 0,
					status: 0,
				},
				backgroundImg: {},
				scrollTop: 0, //菜品返回顶部
				comments: 0, //评论数
				bgOpacity: 0, //店铺门头照透明度
				currentTab: 0, //当前tab
				scrollTopOld: 0, //菜品返回顶部
				typeRequired: 0, //sticky类别"必"字
				currentShopIndex: 0, // 预设当前项的值
				scanCode: false, //是否扫码进店
				isPayment: false, // 0:不能付,1:能付
				modeMask: false, //扫码进店选择类型
				tableId: null,
				cartModel: false, //购物车弹窗
				propaganda: false, //规格弹窗
				stocksModel: false, //规格弹窗
				loadingMask: true, //loading页面
				pageDownEva: true, //评论翻页标识
				activityModel: false, //优惠活动弹窗
				showNavigationBar: false, //是否显示导航栏搜索框
				shopImg: getApp().globalData.shopImg,
				shopBgImg: getApp().globalData.shopBgImg,
				shoppingMode: getApp().globalData.shoppingMode, //用户下单类型:0外卖1堂食
				phoneNumber: getApp().globalData.UserInfo.phone,
				//菜品相关
				stocksPrice: null, //规格价格
				stocksGoodsID: null,
				scrollRightHeight: 667,
				// 导航栏高度
				navigationBarHeight: 44,
				// 状态栏高度
				statusBarHeight: getApp().globalData.statusBarHeight,
				//导航栏和状态栏的高度
				navigationHeight: getApp().globalData.statusBarHeight + 44,
			};
		},
		watch: {
			"cartData.shoppingCarts.length": {
				handler(newValue, oldValue) {
					if (newValue == 0) this.cartModel = false;
				},
			},
		},
		onLoad(query) {
			this.options = query;
			this.propaganda = Boolean(query?.propaganda ?? false);
			this.loadingMask = true;
			let thisPages = getCurrentPages();
			const eventChannel = this.getOpenerEventChannel();
			const that = this;
			if (eventChannel.on) {
				eventChannel.on("acceptDataFromOpenerPage", function (data) {
					console.log("data", data);
					that.htmlGoods = data.goods;
				});
			}
			if (thisPages.length !== 1) {
				let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
				this.tableId = thisPrevPage.$vm?.tableId ?? null;
			}
			if (query.shopId) {
				this.currentShop.shopId = query.shopId;
				if (thisPages.length == 1) this.scanCode = true;
				if (query.type == "1") this.modeMask = true;
			} else if (query?.q) {
				//扫码进店
				let link = paramConversion(decodeURIComponent(query?.q));
				this.currentShop.shopId = link.shopId;
				this.options = { ...this.options, shopId: this.currentShop.shopId };
				if (thisPages.length == 1) this.scanCode = true;
			} else {
				let thisPrevPage = thisPages[thisPages.length - 2]; //上一个页面
				this.currentShop = thisPrevPage.$vm.currentShop;
				this.currentShop.shopId = query?.shopId ?? this.currentShop.shopId;
			}
		},
		onHide() {
			this.scanPayMask = false;
			this.options = {};
			this.htmlGoods = {};
			// this.propaganda = false;
		},
		async onShow() {
			if (getApp().globalData.previewImage) {
				getApp().globalData.previewImage = false;
				this.getCart();
				return;
			}
			if (!this.loadingMask) {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
			}
			this.scrollTop = this.scrollTopOld;
			this.$nextTick(() => {
				this.scrollTop = 0;
			});
			let fuc = async () => {
				this.navigationHeight = getApp().globalData.statusBarHeight + 44;
				this.phoneNumber = getApp().globalData.UserInfo.phone;
				this.scrollRightHeight = uni.getSystemInfoSync().screenHeight - this.navigationHeight - 40;
				this.init();
				if (this.options?.q) {
					//扫码红包
					let INFO = await store.dispatch("SelectShopInfo", {
						shopId: this.currentShop?.shopId ?? 0,
						type: this.shoppingMode * 1 == 1 ? 0 : 1,
						userLatitude: getApp().globalData.location.latitude,
						userLongitude: getApp().globalData.location.longitude,
					});
					this.currentShop = INFO.data;
					// 获取扫码红包
					this.getScanCoupon();
					//统计扫码进店人数
					this.promoteFuc(this.currentShop.shopId);
				}
			};
			appInit(fuc);
		},
		onPageScroll(e) {
			this.showNavigationBar = e.scrollTop > this.navigationHeight ? true : false;
			this.bgOpacity = (e.scrollTop || 1) / 200;
			if (this.bgOpacity > 0.8) {
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
					animation: {
						duration: 400,
						timingFunc: "easeIn",
					},
				});
				this.backColor = "#000000";
			} else {
				uni.setNavigationBarColor({
					frontColor: "#ffffff",
					backgroundColor: "#000000",
					animation: {
						duration: 400,
						timingFunc: "easeIn",
					},
				});
				this.backColor = this.ossColor;
			}
			this.backgroundImg.background = `rgba(255, 255, 255, ${e.scrollTop / 250})`;
		},
		onReachBottom(e) {
			if (this.currentTab !== 2 || !this.pageDownEva) return;
			this.evaluateParams.pageIndex++;
			this.getStoreEvaluate();
		},
		onShareAppMessage: function (res) {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/home/home?shopId=${this.currentShop.shopId}`,
			};
		},
		computed: {
			checkout: function () {
				if (!this.shoppingMode) {
					//外卖1
					if (this.cartData.count == 0) {
						return this.currentShop?.startDeliveryAmount ?? 0 !== 0
							? {
									text: `满${this.currentShop?.startDeliveryAmount ?? 0}元起送`,
									ifcanpay: false,
							  }
							: { text: "去结算", ifcanpay: true };
					} else {
						if (this.currentShop?.startDeliveryAmount ?? 0 !== 0) {
							let amount = new Decimal(this.currentShop?.startDeliveryAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
							return amount * 1 > 0
								? {
										text: `还差${new Decimal(this.currentShop?.startDeliveryAmount ?? 0).sub(new Decimal(this.cartData.totalPrice ?? 0))}元起送`,
										ifcanpay: false,
								  }
								: { text: "去结算", ifcanpay: true };
						} else {
							return { text: "去结算", ifcanpay: true };
						}
					}
				} else {
					//堂食1
					if (this.cartData.count == 0) {
						return this.currentShop?.buyAmount ?? 0 !== 0
							? {
									text: `满${this.currentShop?.buyAmount ?? 0}元起点`,
									ifcanpay: false,
							  }
							: { text: "去结算", ifcanpay: true };
					} else {
						if (this.currentShop?.buyAmount ?? 0 !== 0) {
							let amount = new Decimal(this.currentShop?.buyAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
							return amount * 1 > 0
								? {
										text: `还差${new Decimal(this.currentShop?.buyAmount ?? 0).sub(new Decimal(this.cartData.totalPrice ?? 0))}元起点`,
										ifcanpay: false,
								  }
								: { text: "去结算", ifcanpay: true };
						} else {
							return { text: "去结算", ifcanpay: true };
						}
					}
				}
			},
		},
		methods: {
			async init() {
				const ID = this.currentShop?.shopId ?? 0;
				let proList = [
					store.dispatch("GetGoodsType", { shopId: ID }), //左侧商品分类
					store.dispatch("GetRecommendList", { shopId: ID }), //评论
					store.dispatch("SelectShopInfo", {
						shopId: ID,
						type: this.shoppingMode * 1 == 1 ? 0 : 1,
						userLatitude: getApp().globalData.location.latitude,
						userLongitude: getApp().globalData.location.longitude,
					}), //铺子详情
					store.dispatch("GetGoodsList", { shopId: ID }), //商品列表
					store.dispatch("StoreEvaluate", {
						pageIndex: 1,
						pageSize: 10,
						shopId: ID,
						status: 0,
					}), //获取店铺评论
					store.dispatch("SelectShopRedPacket", {
						source: 1,
						shopId: ID,
					}), //获取店铺优惠券
					store.dispatch("CollectOrder", { shopId: ID }), //获取店铺优惠券
					store.dispatch("GetEvaluateCount", { shopId: ID }), //获取店铺下评论数量
				];
				let thenFuc = async res => {
					let resArr = res.map(a => a.data);
					this.goodsType = resArr[0];
					this.recommenList = resArr[1] ?? [];
					this.currentShop = resArr[2] ?? {};
					if (this.currentShop?.shopHeadPic) this.getBackColor(this.currentShop.shopHeadPic);
					this.activityList = resArr[2]?.activityList.length > 4 ? resArr[2]?.activityList.slice(0, 4) : resArr[2]?.activityList;
					this.couponListTit = resArr[2]?.activityList.length > 4 ? resArr[2]?.activityList.slice(0, 4) : [];
					if (resArr[3]?.length) {
						this.typeName = resArr[3][0]?.typeName ? resArr[3][0]?.typeName : "";
						this.typeRequired = resArr[3][0]?.required ? resArr[3][0]?.required : 0;
						this.goodsList = resArr[3].map(item => {
							item.typeTag = `item${item.typeId}`;
							return item;
						});
						this.tabView = this.goodsList[0].typeTag;
						if (this.htmlGoods.goodsId && this.currentShop.status == 1) this.changeSPcart(this.htmlGoods, "plus", this.htmlGoods.stockId);
						this.menuTypeList = resArr[3].map(item => item.typeName);
					}
					//获取店铺评论
					resArr[4]?.records.forEach(element => {
						element.pic = element.pic ? element.pic.split(",") : [];
					});
					this.evaluateList = resArr[4]?.records;
					this.pageDownEva = Boolean(resArr[4]?.pages > resArr[4]?.current);
					this.comments = resArr[4]?.total;
					//获取店铺优惠券
					if (resArr[5]?.length) {
						this.couponList = [].concat(
							resArr[5].map(it => {
								if (it.validEndTime) {
									it.validEndTime = it.validEndTime.split(" ")[0];
								}
								it.click = false;
								return it;
							})
						);
					}
					this.collectOrder = resArr[6] ?? "";
					this.evaluateCount = resArr[7];
					if (this.currentShop.status !== 1) {
						this.loadingMask = false;
						uni.hideLoading();
						this.showError();
						return;
					}
					//用户下单类型:0外卖1堂食;currentShop.type:0"堂食" 1"外卖" 2"堂食+外卖"
					if (this.options.shopId) {
						if (this.currentShop.type == 2) {
							getApp().globalData.shoppingMode = 1;
							this.shoppingMode = getApp().globalData.shoppingMode;
						} else {
							getApp().globalData.shoppingMode = !this.currentShop.type ? 1 : 0;
							this.shoppingMode = getApp().globalData.shoppingMode;
						}
						let cartData = await store.dispatch("GetCart", {
							shopId: ID,
							orderType: this.shoppingMode * 1,
							location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
						}); //购物车
						this.cartData = cartData?.data ?? {
							shoppingCarts: [],
							reduceFee: 0,
							totalPrice: 0,
							count: 0,
						};
					} else {
						this.shoppingMode = getApp().globalData.shoppingMode;
						if (this.currentShop.type !== 2) this.shoppingMode = !this.currentShop.type ? 1 : 0;
						let cartData = await store.dispatch("GetCart", {
							shopId: ID,
							orderType: this.shoppingMode * 1,
							location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
						}); //购物车
						this.cartData = cartData?.data ?? {
							shoppingCarts: [],
							reduceFee: 0,
							totalPrice: 0,
							count: 0,
						};
					}
					if (this.scanCode) {
						//扫码进店重置定位
						const latitude = this.currentShop.location.split(",")[1] * 1;
						const longitude = this.currentShop.location.split(",")[0] * 1;
						getApp().globalData.location = { latitude, longitude };
						uni.setStorageSync("location", { latitude, longitude });
					}
					this.loadingMask = false;
					uni.hideLoading();
					this.showError();
				};
				let catchFuc = err => {
					this.loadingMask = false;
					if (err == 1001) this.init();
				};
				PromiseAll(proList, thenFuc, catchFuc);
			},
			getBackColor(url) {
				//根据shopHeadPic主色调调整返回图标的颜色
				axiosGet(url + "?x-oss-process=image/average-hue", {}).then(er => {
					this.ossColor = 0.213 * parseInt(er.RGB.substr(2, 2), 16) + 0.715 * parseInt(er.RGB.substr(4, 2), 16) + 0.072 * parseInt(er.RGB.substr(6, 2), 16) > 255 / 2 ? "#000000" : "#FFFFFF";
					this.backColor = this.ossColor;
				});
			},
			hideScan() {
				this.scanMask = false;
				if (this.isPayment) this.scanPayMask = true;
			},
			async getScanCoupon() {
				// "type",value="类型,0:门店,1:店铺")
				const params = {
					relationId: this.currentShop.shopId,
					type: 1,
				};
				const successFuc = res => {
					if (res.code === 81201 || res.code === 81202 || res.code === 81203 || res.code === 81204) {
						if (this.isPayment) this.scanPayMask = true;
						return;
					}
					this.scanType = res.data?.length ? 1 : 0;
					this.scanCouponList = res.data;
					this.scanCouponMark = res.msg;
					this.scanMask = true;
					// this.scanPayMask = true;
				};
				const elseFuc = () => {
					if (this.isPayment) this.scanPayMask = true;
				};
				uni.showLoading();
				let INFO = await store.dispatch("ShopPayment", {
					shopId: this.currentShop?.shopId ?? 0,
				});
				// 0:不能付,1:能付
				this.isPayment = Boolean(INFO.data === 1);
				AjaxApi("TakeRedPacketPin", params, successFuc, elseFuc);
			},
			getPhoneNumber(e) {
				// 手机号码授权
				if (e.detail.encryptedData && e.detail.iv) {
					uni.showLoading({
						title: "正在登录",
						mask: true,
					});
					let params = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
					};
					let successFuc = async res => {
						let ress = await store.dispatch("QueryUserInfo", {});
						getApp().globalData.UserInfo = ress?.data ?? {
							phone: null,
						};
						this.phoneNumber = getApp().globalData.UserInfo.phone;
					};
					AjaxApi("GetUserPhone", params, successFuc);
				} else {
					uni.showModal({
						title: "温馨提示",
						content: "您点击了拒绝授权，将无法下单",
						showCancel: false,
						confirmText: "确定",
					});
				}
			},
			async getCart(Fuc = () => {}) {
				//获取购物车 orderType 订单类型(0,外卖,1堂食)
				const paramss = {
					shopId: this.currentShop.shopId,
					orderType: this.shoppingMode * 1,
					location: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
				};
				const awaitdata = await store.dispatch("GetCart", paramss);
				this.cartData = awaitdata.data ?? {
					shoppingCarts: [],
					reduceFee: 0,
					totalPrice: 0,
					count: 0,
					errorGoodsName: null,
					firstOrderDiscounts: null,
					msg: "",
					noSingleOrder: false,
					required: false,
					share: 1,
					shippingFee: 0,
					totalOriginal: 0,
					totalPackageFee: 0,
					totalReduceFee: 0,
				};
				Fuc();
			},
			async changeSPcart(it, type, stockId = null) {
				uni.showLoading({
					title: "加载",
					mask: true,
				});
				// this.htmlGoods = {};
				uni.vibrateShort();
				//添加或删除菜品
				let params = { goodsId: it?.goodsId };
				let res = await store.dispatch("GetGoodsDetail", params);
				const { coverPic, description, discountPrice, goodsId, goodsName } = it;
				const goodsinx = this.goodsList.findIndex(item => item.goodsId == it.goodsId);
				const goodsinxs = this.recommenList.findIndex(item => item.goodsId == it.goodsId);
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
								shopId: this.currentShop.shopId, //店铺Id
								stockId: res.data.stocks[0].stockId, //库存Id
								specification: res.data.stocks[0].specification, //库存描述
							};
							const successFuc = res => {
								if (goodsinx !== -1) this.goodsList[goodsinx].number++;
								if (goodsinxs !== -1) this.recommenList[goodsinxs].number++;
								if (res.data) {
									uni.showToast({
										title: res.data,
										icon: "none",
										duration: 1500,
									});
								}
								this.getCart();
							};
							AjaxApi("SaveCart", params, successFuc);
							break;
						case "minus":
							if (it.number !== 0) {
								const inx = this.cartData.shoppingCarts.findIndex(element => element.goodsId === it.goodsId);
								const params = {
									coverPic,
									description,
									discountPrice,
									goodsId,
									goodsName,
									isAdd: false,
									shopId: this.currentShop.shopId, //店铺Id
									stockId: this.cartData.shoppingCarts[inx].stockId, //库存Id
									specification: res.data.stocks[0].specification, //库存描述
								};
								const successFuc = async res => {
									if (goodsinx !== -1) this.goodsList[goodsinx].number--;
									if (goodsinxs !== -1) this.recommenList[goodsinxs].number--;
									this.getCart();
								};
								AjaxApi("SaveCart", params, successFuc);
							}
							break;
						default:
							break;
					}
				} else {
					//规格为多个个
					switch (type) {
						case "plus":
							uni.hideLoading();
							const INDEX = res.data.stocks.findIndex(ele => ele.stockId == stockId);
							this.stocksPrice = 0;
							this.stocksObj = res.data;
							this.stocksList = res.data.stocks.map((item, i) => {
								item.choose = false;
								return item;
							});
							if (INDEX !== -1) {
								this.stocksGoods = this.stocksList[INDEX];
								this.stocksPrice = this.shoppingMode ? this.stocksList[INDEX].discountPrice : this.stocksList[INDEX].wmDiscountPrice;
								this.stocksGoodsID = this.stocksList[INDEX].goodsId;
								this.stocksList[INDEX].choose = true;
							} else {
								this.stocksGoods = this.stocksList[0];
								this.stocksPrice = this.shoppingMode ? this.stocksList[0].discountPrice : this.stocksList[0].wmDiscountPrice;
								this.stocksGoodsID = this.stocksList[0].goodsId;
								this.stocksList[0].choose = true;
								if (this.stocksList[0].availableStock == 0) this.stocksGoodsID = null;
							}
							this.specList = res.data.goodsSpecifications.filter((item, i) => {
								const index = item.children.findIndex(ele => ele.checked == true);
								item.children = item.children.filter((it, inx) => {
									inx == index ? (it.choose = true) : (it.choose = false);
									if (it.checked) {
										return it;
									}
								});
								return item;
							});
							this.stocksModel = true;
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
									shopId: it.shopId, //店铺Id
									stockId: it.stockId, //库存Id
									specification: it.specification, //库存描述
								};
								const successFuc = res => {
									if (goodsinx !== -1) this.goodsList[goodsinx].number--;
									if (goodsinxs !== -1) this.recommenList[goodsinxs].number--;
									this.getCart();
								};
								AjaxApi("SaveCart", params, successFuc);
							}
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
				this.specList.forEach(element => {
					element.children.forEach(ele => {
						if (ele.choose == true) {
							SPEC = SPEC + "/" + ele.name;
						}
					});
				});
				const inx = this.goodsList.findIndex(item => item.goodsId == this.stocksGoodsID);
				const goodsinxs = this.recommenList.findIndex(item => item.goodsId == this.stocksGoodsID);
				const { coverPic, description, goodsId, goodsName } = this.goodsList[inx];
				const params = {
					coverPic,
					description,
					goodsId,
					goodsName,
					discountPrice: this.stocksPrice,
					isAdd: true,
					shopId: this.currentShop.shopId, //店铺Id
					stockId: this.stocksGoods.stockId, //库存Id
					specification: this.stocksGoods.specification + SPEC, //库存描述
				};
				const successFuc = async res => {
					if (inx !== -1) this.goodsList[inx].number++;
					if (goodsinxs !== -1) this.recommenList[goodsinxs].number++;
					this.getCart();
					this.stocksGoodsID = null;
					this.stocksModel = false;
				};
				AjaxApi("SaveCart", params, successFuc);
			},
			scorllRightList() {
				uni.pageScrollTo({
					scrollTop: 480,
				});
			},
			// 菜品列表滚动赋值typeName
			async rightScrollFuc(e) {
				if (e.detail.scrollTop > 0 && e.detail.scrollTop < 100) {
					uni.pageScrollTo({
						scrollTop: 480,
					});
				}
				this.$nextTick(() => {
					this.scrollTopOld = e.detail.scrollTop;
				});
				setTimeout(() => {
					let TOP = 0;
					let selectorQuery = uni.createSelectorQuery().in(this);
					selectorQuery
						.select("#scroll-r")
						.boundingClientRect(ele => {
							TOP = ele.top;
						})
						.exec();
					selectorQuery
						.selectAll(".goods-obj")
						.boundingClientRect(rects => {
							if (rects.length) {
								let inx = rects.findIndex(element => element.top < TOP + 50 && element.top > TOP - 50);
								if (inx !== -1) {
									this.typeName = rects[inx].dataset.element;
									this.currentShopIndex = this.goodsType.findIndex(item => item.typeName == this.typeName);
									this.typeRequired = rects[inx].dataset.required;
								}
								return;
							}
						})
						.exec();
				}, 0);
			},
			backFuc() {
				const pages = getCurrentPages();
				const currPage = pages[pages.length - 2];
				if (!currPage?.route ?? null) {
					uni.switchTab({
						url: "/pages/index/index",
					});
				} else if (this.propaganda) {
					let it = { jumpType: "2", jumpUrl: activityUrl };
					// let it = { jumpType: "2", jumpUrl: "https://testddd.dianddian.cn/html/saleActivity/activity.html" };
					uni.redirectTo({
						url: `/pagesB/propaganda/propaganda?url=${it.jumpUrl}&type=${it.jumpType}`,
					});
				} else {
					uni.navigateBack();
				}
				// uni.navigateBack();
			},
			itClick(i) {
				this.couponList[i].click = !this.couponList[i].click;
			},
			preImg(current) {
				const that = this;
				getApp().globalData.previewImage = true;
				uni.previewImage({
					current: current,
					urls: [that.currentShop.shopLogo, that.currentShop.shopHeadPic],
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
			shopCall() {
				getApp().globalData.previewImage = true;
				const phoneNumber = this.currentShop.relationPhone || "";
				uni.makePhoneCall({
					phoneNumber: phoneNumber,
				});
			},
			shopLoc() {
				const address = this.currentShop.address;
				const name = this.currentShop.shopName;
				const latitude = this.currentShop.location.split(",")[1] * 1;
				const longitude = this.currentShop.location.split(",")[0] * 1;
				getApp().globalData.previewImage = true;
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name,
					address: address,
					scale: 15,
					fail: () => {
						getApp().globalData.previewImage = false;
					},
				});
			},
			getPrice(val1, val2, val3) {
				let val = new Decimal(val1 ?? 0).sub(new Decimal(val2 ?? 0)).sub(new Decimal(val3 ?? 0));
				if (val > 0) {
					return val;
				} else {
					return 0;
				}
			},
			reLaunch() {
				uni.reLaunch({
					url: `/pages/spellOrder/spellOrder?storeId=${this.currentShop.storeId}&shopId=${this.currentShop.shopId}`,
				});
			},
			doCollect() {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				const params = { relationId: this.currentShop.shopId, type: 1 }; //0:门店,1:店铺
				let successFuc = res => {
					this.currentShop.isCollect = !this.currentShop.isCollect;
				};
				AjaxApi("DoCollect", params, successFuc);
			},
			preEveImg(i, inx) {
				const that = this;
				getApp().globalData.previewImage = true;
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
			goodsRank(rank = 11, description) {
				return Boolean(rank < 11 && rank) ? `本店销售第${rank}名` : description || "";
			},
			//确认订单
			sureOrder() {
				if (!this.checkoutclass()) {
					if (this.cartData.required) {
						this.scrollTop = this.scrollTopOld;
						this.$nextTick(() => {
							this.scrollTop = 0;
						});
					}
					return;
				}
				if (getObjType(getApp().globalData.UserInfo.phone) == "null") {
					uni.navigateTo({
						url: "/pagesB/login/login",
					});
					return;
				}
				this.beforeSub(Boolean(this.cartData.errorGoodsName), Boolean(this.cartData.noSingleOrder), this.cartData.errorGoodsName);
				if (Boolean(this.cartData.errorGoodsName) || Boolean(this.cartData.noSingleOrder)) return;
				this.orderPara = {
					recipientAddress: "", //收货地址
					orderType: this.shoppingMode, //0,外卖,1堂食
					shopId: this.currentShop.shopId, //店铺Id
					storeId: this.currentShop.storeId, //门店Id
					location: this.currentShop.location, //经纬度
					reduceFee: this.cartData.reduceFee ?? 0, //优惠总金额(红包+优惠满减)
					stallName: this.currentShop.shopName, //档口名称
					shopName: this.currentShop.shopName, //店铺名称
					productAmount: this.cartData.totalPrice, //商品订单金额
					storeName: this.currentShop.storeName, //门店名称
					packageFee: this.cartData.totalPackageFee ?? 0, //餐盒
					shoppingCartReqs: this.cartData.shoppingCarts, //购物车信息
					recipientPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
					reservedPhone: getApp().globalData.UserInfo.phone ?? "", //收货人手机号
					recipientName: getApp().globalData.UserInfo.wxNickName ?? "", //收货人名字
					actualPayment: new Decimal(this.cartData.totalPrice ?? 0).sub(new Decimal(this.cartData.reduceFee ?? 0)), //实际支付金额},
				};
				uni.navigateTo({
					url: `/pagesA/confirmOrder/confirmOrder`,
				});
			},
			showError() {
				if (this.currentShop.status !== 1) {
					uni.showToast({
						title: `当前店铺${this.shopStatus[this.currentShop.status]}`,
						icon: "none",
						mask: true,
						duration: 4000,
					});
				}
			},
			chooseOne(item, i) {
				if (!item.isTake) return;
				let params = {
					redPacketId: item.id,
					shopId: item.shopId,
					channel: "WX_PROGRAM",
				};
				let successFuc = res => {
					if (res.code == 0) {
						this.couponList[i].isTake = 0;
					}
				};
				AjaxApi("TakeRedPacket", params, successFuc);
			},
			beforeSub(a, b, text) {
				if (b) {
					uni.showToast({
						title: `不能单独下单,请搭配其他菜品`,
						icon: "none",
						mask: true,
						duration: 1000,
						success: () => {
							setTimeout(function () {
								if (a) {
									uni.showToast({
										title: text,
										icon: "none",
										mask: true,
										duration: 1000,
									});
								}
							}, 1000);
						},
					});
				} else if (a) {
					uni.showToast({
						title: text,
						icon: "none",
						mask: true,
						duration: 1000,
					});
				}
			},
			cancelPopup() {
				//购物车弹框
				if (this.cartData.count == 0 || this.currentShop.status !== 1) return;
				this.cartModel = !this.cartModel;
			},
			changeTabs(index) {
				//tabs切换
				uni.pageScrollTo({
					scrollTop: 480,
				});
				this.currentTab = index;
				if (index == 2) {
					this.evaluateParams.pageIndex = 1;
					this.getStoreEvaluate();
				} else {
					this.evaluateList = [];
				}
			},
			chooseSpec(i, inx) {
				//选规格
				if (this.specList[i].simple === 2) {
					const index = this.specList[i].children.filter(item => item.choose == true);
					this.specList[i].children[inx].choose = index.length == 1 ? true : !this.specList[i].children[inx].choose;
				} else {
					this.specList[i].children.filter((element, index) => {
						element.choose = index == inx ? true : false;
						return element;
					});
				}
				this.$forceUpdate();
			},
			async choodsMode(num) {
				this.shoppingMode = num;
				getApp().globalData.shoppingMode = num;
				this.modeMask = false;
				uni.showLoading({
					title: "获取购物车",
					mask: true,
				});
				// setTimeout(() => {
				// 	uni.hideLoading();
				// }, 500);
				let res = await store.dispatch("SelectShopInfo", {
					shopId: this.currentShop.shopId,
					type: this.shoppingMode * 1 == 1 ? 0 : 1,
					userLatitude: getApp().globalData.location.latitude,
					userLongitude: getApp().globalData.location.longitude,
				}); //铺子详情
				this.currentShop = res.data ?? {};
				this.activityList = res.data?.activityList.length > 4 ? res.data?.activityList.slice(0, 4) : res.data?.activityList;
				this.couponListTit = res.data?.activityList.length > 4 ? res.data?.activityList.slice(0, 4) : [];
				if (this.htmlGoods.goodsId && this.currentShop.status == 1) this.changeSPcart(this.htmlGoods, "plus", this.htmlGoods.stockId);
				let Fuc = () => {
					uni.hideLoading();
				};
				this.getCart(Fuc);
			},
			jumpShopList() {
				uni.navigateTo({
					url: "/pagesA/shopList/shopList",
				});
			},
			jumpSearch() {
				uni.navigateTo({
					url: "/pagesD/searchGoods/searchGoods",
				});
			},
			chooseStocks(i) {
				//点击选规格
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
			checkoutclass() {
				if (this.cartData.count == 0 || this.cartData.required || this.currentShop.status !== 1) {
					return false;
				} else if (!this.shoppingMode) {
					if (this.currentShop?.startDeliveryAmount ?? 0 !== 0) {
						let amount = new Decimal(this.currentShop?.startDeliveryAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
						return amount * 1 > 0 ? false : true;
					} else {
						return true;
					}
				} else {
					if (this.currentShop?.buyAmount ?? 0 !== 0) {
						let amount = new Decimal(this.currentShop?.buyAmount ?? 0).sub(new Decimal(this.cartData?.totalPrice ?? 0));
						return amount * 1 > 0 ? false : true;
					} else {
						return true;
					}
				}
			},
			deleteCartFuc() {
				//清空购物车
				let params = {
					shopId: this.currentShop.shopId, //店铺Id
				};
				let successFuc = res => {
					this.getCart();
					const constant = this.cartData.shoppingCarts.map(it => it.goodsId);
					constant.forEach(element => {
						let inx = this.goodsList.findIndex(item => item.goodsId == element);
						let index = this.recommenList.findIndex(item => item.goodsId == element);
						if (inx !== -1) this.goodsList[inx].number = 0;
						if (index !== -1) this.recommenList[index].number = 0;
					});
					this.cartModel = false;
				};
				AjaxApi("DeleteCart", params, successFuc);
			},
			getStoreEvaluate() {
				uni.showLoading({
					title: "加载中",
					mask: true,
				});
				//获取店铺评论
				this.evaluateParams.shopId = this.currentShop.shopId;
				let successFuc = res => {
					res.data?.records.forEach(element => {
						element.pic = element.pic ? element.pic.split(",") : [];
					});
					this.evaluateList = this.evaluateParams.pageIndex == 1 ? res.data?.records : this.evaluateList.concat(res.data?.records);
					this.pageDownEva = Boolean(res.data.pages > res.data.current);
				};
				AjaxApi("StoreEvaluate", this.evaluateParams, successFuc);
			},
			displayTypeName(it, i) {
				//是否显示菜品列表的菜品类别
				const inx = this.menuTypeList.findIndex(item => item == it);
				return Boolean(inx == i && i !== 0);
			},
			jumpGoodDetails(i) {
				if (this.currentShop.status !== 1 || i.sellOut) return;
				getApp().globalData.previewImage = true;
				uni.navigateTo({
					url: `/pagesC/foodDetails/foodDetails?id=${i.goodsId}&shopId=${this.currentShop.shopId}&number=${i.number}&count=${i.count}&type=home`,
				});
			},
			swichTypeMenu(val, i) {
				uni.pageScrollTo({
					scrollTop: 480,
				});
				this.tabView = `item${val}`;
				this.currentShopIndex = i;
			},
			chooseEvaluateTag(val) {
				this.evaluateParams.status = val;
				this.evaluateParams.pageIndex = 1;
				this.getStoreEvaluate();
			},
			async promoteFuc(par) {
				//扫码统计人数
				const TOKEN = uni.getStorageSync("token");
				Promote1({ query: par }, TOKEN);
			},
			tapScanMask() {
				if (!this.phoneNumber) return;
				uni.navigateTo({
					url: `/pagesD/justPay/justPay?shopId=${this.currentShop.shopId}&storeId=${this.currentShop.storeId}&shopName=${this.currentShop.shopName}`,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	page {
		background: #f9fafb;
	}
	.container {
		position: relative;
		.slot-navbar {
			width: 400rpx;
			height: 60rpx;
			line-height: 60rpx;
			background: #f9fafb;
			border-radius: 50rpx;
			color: #999999;
			padding: 0 30rpx;
		}
		.scan-mask {
			/deep/ .u-mask-zoom {
				transform: scale(1, 1) !important;
			}
			.scan-pay {
				position: fixed;
				bottom: 20rpx;
				bottom: calc(20rpx + constant(safe-area-inset-bottom, 0));
				bottom: calc(20rpx + env(safe-area-inset-bottom, 0));
				left: 50%;
				transform: translate(-50%, 0);
				width: calc(100% - 40rpx);
				height: 480rpx;
				background: #ffffff;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				// opacity: 0.95;
				border-radius: 8rpx;
				> view {
					height: 100rpx;
					padding-right: 42rpx;
				}
				.tittle {
					font-weight: bold;
					color: #333333;
					margin-right: 50%;
					transform: translate(100%, 0);
				}
				.bts {
					height: 300rpx;
					> view {
						flex: 1;
						text-align: center;
						&:first-of-type {
							border-right: 2rpx solid #e2e2e2;
						}
						image {
							height: 200rpx;
						}
					}
				}
			}
		}
		.navitionBar {
			width: 100%;
			// color: transparent;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 100000;
		}
		.navigationBarBg {
			background: url("https://oss.dianddian.cn/shop/%E9%BB%98%E8%AE%A4%E5%BA%97%E9%93%BA%E9%97%A8%E5%A4%B4%403x.png");
			background-size: cover;
		}
		.banner-box {
			margin-bottom: 4rpx;

			.bg-banner {
				width: 100%;
				height: 280rpx;
				overflow: hidden;
				image {
					width: 100%;
					height: 280rpx;
					position: absolute;
					top: 0;
					left: 0;
					z-index: -1;
				}
			}

			.shop-info-box {
				margin-left: 20rpx;
				margin-right: 20rpx;
				padding: 18rpx 24rpx 24rpx 24rpx;
				background: #fff;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				opacity: 1;
				border-radius: 16rpx;
				height: auto;
				z-index: 10000;
				margin-top: -230rpx;
				.shop-info-top {
					margin-bottom: 18rpx;
					display: flex;
					justify-content: space-between;
					.shop-pic {
						width: 80rpx;
						height: 80rpx;
						margin: 6rpx 0rpx 4rpx 0rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					.shop-info {
						margin-left: 16rpx;
						flex: 1;
						min-width: 0;
						.shop-name {
							display: flex;
							min-height: 56rpx;
							font-size: 40rpx;
							line-height: 56rpx;
							color: #333333;
							> view {
								&:first-child {
									font-weight: bold;
									flex: 1;
									width: 0;
								}
								&:last-child {
									.iconfont {
										font-size: 24rpx;
									}
									font-size: 24rpx;
									line-height: 40rpx;
									color: #666666;
									&.active {
										color: #ff4d4f;
									}
								}
							}
						}
						> view {
							&:last-child {
								text {
									height: 24rpx;
									font-size: 24rpx;
									font-weight: 400;
									line-height: 30rpx;
									color: rgba(153, 153, 153, 1);
									margin-right: 28rpx;
								}
								.iconshijian {
									margin-right: 8rpx;
								}
							}
						}
						.text1 {
							color: #ff4d4f;
						}
					}
				}
				.shop-announcement {
					height: 34rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					opacity: 1;
				}
				.shop-info-bot {
					.coupon-wrap {
						display: flex;
						justify-content: space-between;
						align-items: center;
						opacity: 1;
						border-radius: 8rpx;
						.icon {
							font-size: 10rpx;
						}
						/deep/.u-collapse-head {
							padding-bottom: 0;
							padding-top: 0;
						}
						/deep/.u-collapse-content {
							display: flex;
							flex-wrap: wrap;
						}
						/deep/u-icon {
							margin-right: 0 !important;
							.u-iconfont {
								font-size: 20rpx !important;
								color: #999999 !important;
							}
						}
					}
					.coupon-wrap1 {
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						width: 100%;
						position: relative;
						/deep/u-icon {
							position: absolute;
							right: 0;
							top: 0;
						}
						.coupon-new {
							border-radius: 6rpx;
							margin-right: 16rpx;
							margin-bottom: 10rpx;
							display: flex;
							align-items: center;
							height: 40rpx;
							font-size: 20rpx;
							background-color: #fe6b00;
							&.active {
								background-color: #fdf1cd;
								color: #999999;
							}
							color: #ffffff;
							.border-left {
								padding: 0 10rpx;
							}
							.border-right {
								padding: 0 10rpx;
							}
							.border {
								height: 100%;
								width: 10rpx;
								position: relative;
								&::before {
									border-right: 2rpx dotted #fff;
									position: absolute;
									top: 20%;
									content: "";
									width: 45%;
									height: 60%;
								}
								.semi-circle-top {
									border-radius: 0 0 10rpx 10rpx;
									height: 5rpx;
									width: 10rpx;
									position: absolute;
									top: 0;
									left: 0;
									background-color: #fff;
								}
								.semi-circle-bot {
									border-radius: 10rpx 10rpx 0 0;
									height: 5rpx;
									width: 10rpx;
									position: absolute;
									bottom: 0;
									left: 0;
									background-color: #fff;
								}
							}
						}
						.activity-new {
							display: flex;
							align-items: center;
							flex-wrap: wrap;
							height: 40rpx;
							width: 100%;
							overflow: hidden;
							position: relative;
							/deep/u-icon {
								position: absolute;
								right: 0;
								top: 0;
							}
						}
						.activity-rebate {
							height: 40rpx;
							width: 100%;
							position: relative;
							/deep/u-icon {
								position: absolute;
								right: 0;
								top: 0;
							}
						}
					}
				}
			}
		}
		.recommend-box {
			::-webkit-scrollbar {
				display: none;
				width: 0;
				height: 0;
				color: transparent;
			}
			margin-bottom: 20rpx;
			.recommend-title {
				padding: 0rpx 20rpx 0rpx 20rpx;
				margin: 20rpx 0;
				height: 42rpx;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 42rpx;
				color: #333333;
			}
			.recommend-scroll {
				background: #fff;
				margin-left: 20rpx;
				display: inline-flex;
				white-space: nowrap;
			}
			.recommend {
				background: #fff;
				width: auto;
				padding-bottom: 38rpx;
				.dishes-box {
					position: relative;
					width: calc((100vw - 80rpx) / 3);
					height: 100%;
					margin-right: 20rpx;
					image {
						width: 100%;
						height: 200rpx;
						margin-bottom: 14rpx;
						border-radius: 8rpx;
					}
					.dishes-name {
						width: 100%;
						height: 42rpx;
						font-size: 30rpx;
						font-weight: 400;
						line-height: 42rpx;
						color: #333333;
						&.sellout {
							color: #999999 !important;
						}
					}
					.dishes-info {
						display: flex;
						justify-content: space-between;
						align-items: center;
						view {
							height: 32rpx;
							font-size: 20rpx;
							font-weight: 400;
							line-height: 32rpx;
							color: rgba(153, 153, 153, 1);
							&.sellout {
								color: #999999 !important;
							}
							margin-right: 8rpx;
						}
					}
					.dishes-bot {
						display: flex;
						justify-content: space-between;
						align-items: center;
						position: relative;
						.origin-num {
							min-width: 80rpx;
							height: 30rpx;
							line-height: 30rpx;
							background: #fe6b00;
							text-align: center;
							padding: 0 12rpx;
							border-radius: 20rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #ffffff;
							.has-stocks {
								display: inline-block;
								min-width: 24rpx;
								min-height: 24rpx;
								border-radius: 50%;
								font-size: 16rpx;
								line-height: 24rpx;
								text-align: center;
								position: absolute;
								right: 0;
								bottom: 30rpx;
								background: #fa3534;
								color: #fff;
							}
						}
						.dishes-price {
							height: 48rpx;
							font-size: 34rpx;
							font-weight: 400;
							line-height: 48rpx;
							color: rgba(255, 77, 79, 1);
							&.sellout {
								color: #999999 !important;
							}
							opacity: 1;
							.text1 {
								font-size: 28rpx;
							}
						}
						.dishes-count {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							min-width: 100rpx;
							font-size: 24rpx;
							line-height: 24rpx;
							.dishes-minus {
								width: 30rpx;
								height: 30rpx;
								line-height: 30rpx;
								font-size: 15rpx;
								display: flex;
								justify-content: center;
								align-items: center;
							}
							span {
								padding: 0 10rpx;
							}
						}
					}
				}
			}
		}
		.shop-bgimg {
			width: 100%;
			position: -webkit-fixed;
			position: fixed;
			top: 0;
			z-index: 8000;
			background: #fff;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.coupon-popup-stocks {
			/deep/.u-icon__icon {
				top: -10rpx;
				right: -0rpx;
			}
		}
		.banner {
			padding: 20rpx;
			.swiper {
				height: 240rpx;
			}
			.banner-img {
				width: 710rpx;
				height: 240rpx;
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.15);
				opacity: 1;
				border-radius: 8rpx;
			}
		}
		.sticky {
			position: sticky;
			top: 0;
		}
		.shop-type {
			display: flex;
			> view {
				width: 100rpx;
				height: 56rpx;
				text-align: center;
				// line-height: 54rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 28rpx;
				&.cant-send {
					background: rgba(76, 112, 232, 0.15);
					color: #fe6b00;
					border: 1px solid rgba(76, 112, 232, 0.14901960784313725);
					&.can-send {
						background: #fe6b00;
						color: #fff;
					}
				}
				&.cant-send-gray {
					background: #f9fafb;
					color: #999;
					border: 1px solid #f9fafb;
					&.can-send {
						background: #fe6b00;
						color: #fff;
					}
				}
				&:nth-child(1) {
					z-index: 200;
					padding-right: 28rpx;
					width: 130rpx;
					&.can-send {
						z-index: 201;
						padding-right: 0 !important;
						padding-left: 0 !important;
						width: 100rpx !important;
					}
				}
				&:nth-child(2) {
					position: relative;
					left: -43rpx;
					z-index: 200;
					padding-left: 28rpx;
					width: 130rpx;
					&.can-send {
						position: relative;
						left: -43rpx !important;
						z-index: 201;
						padding-left: 0 !important;
						width: 100rpx !important;
					}
				}
			}
		}
		.tabs {
			display: flex;
			position: relative;
			.pin {
				line-height: 80rpx;
				font-size: 32rpx;
				color: #303133;
				padding-left: 40rpx;
				image {
					position: relative;
					top: -16rpx;
					width: 52rpx;
					height: 22rpx;
				}
			}
			.coupon-count {
				display: inline-block;
				height: 28rpx;
				width: 28rpx;
				line-height: 28rpx;
				text-align: center;
				position: absolute;
				left: 305rpx;
				top: 20rpx;
				font-size: 20rpx;
				font-weight: 500;
				&.less {
					overflow: hidden;
					border-radius: 50%;
					background: #f62027;
					color: #fff;
				}
			}
			.comment-count {
				position: absolute;
				left: 335rpx;
				top: 20rpx;
				font-size: 20rpx;
			}
		}
		.shop-wrap {
			display: flex;
			width: auto;
			background-color: #eeeeee;
			::-webkit-scrollbar {
				//scoll-view隐藏滚动条
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
			}
			.left-shop-menu {
				height: calc(100vh - 280rpx);
				padding-bottom: 80rpx;
				z-index: 500;
				box-sizing: border-box;
				width: 172rpx;
				background-color: #eeeeee;
				.shop-menu-item {
					padding: 0 0 0 20rpx;
					min-height: 90rpx;
					width: 100%;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					&.active {
						background-color: #ffffff;
					}
				}
			}
			.gray {
				opacity: 0.6;
			}
			.type-name {
				box-sizing: border-box;
				padding: 0 0 0 24rpx;
				background: #fff;
				position: -webkit-sticky;
				position: sticky;
				z-index: 501;
				height: 90rpx;
				line-height: 90rpx;
				.goods-type-name {
					border-radius: 50%;
					background: #ff4d4f;
					color: #ffffff;
					display: inline-block;
					text-align: center;
					font-weight: bold;
					margin-right: 20rpx;
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
				}
			}
			.right-scroll-view {
				background-color: #fff;
				padding: 0rpx 0 80rpx 24rpx;
				width: calc(100vw - 172rpx);
				height: 100%;
			}
			.goods-list-title {
				padding: 20rpx 0;
				font-size: 28rpx;
				font-weight: 400;
				line-height: 40rpx;
				color: #333333;
				background: #ffffff;
				.goods-type-name {
					border-radius: 50%;
					background: #ff4d4f;
					color: #ffffff;
					display: inline-block;
					text-align: center;
					font-weight: bold;
					margin-right: 20rpx;
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
				}
			}
			.goods-item {
				display: flex;
				&.sellout {
					color: #999999 !important;
				}
				view,
				text {
					overflow: hidden;
				}
				.goods-img {
					width: 168rpx;
					height: 168rpx;
					border-radius: 16rpx;
				}
				.goods-des {
					flex: 1;
					width: 0;
					margin-left: 16rpx;
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.origin-num {
						min-width: 110rpx;
						height: 40rpx;
						line-height: 40rpx;
						background: #fe6b00;
						text-align: center;
						padding: 0 12rpx;
						border-radius: 20rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #ffffff;
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
							bottom: 36rpx;
							background: #fa3534;
							color: #fff;
						}
					}
					.title {
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 4rpx;
					}
					.des1 {
						font-size: 20rpx;
						font-weight: 400;
						line-height: 24rpx;
						color: #333333;
						&.sellout {
							color: #999999 !important;
						}
						margin-bottom: 4rpx;
					}
					.des2 {
						font-size: 20rpx;
						line-height: 24rpx;
						color: rgba(153, 153, 153, 1);
						&.sellout {
							color: #999999 !important;
						}
						margin-bottom: 2rpx;
						.sold-num {
							margin-right: 30rpx;
						}
					}
					.btm {
						width: 100%;
						display: flex;
						justify-content: space-between;
						.price {
							line-height: 40rpx;
							font-size: 24rpx;
							color: rgba(255, 0, 0, 1);

							&.sellout {
								color: #999999 !important;
							}
							min-height: 46rpx;
							display: flex;
							flex-wrap: wrap;
							.num {
								font-size: 36rpx;
								font-weight: bold;
								margin-left: 2rpx;
							}
							.orgNum {
								color: #666666;

								&.sellout {
									color: #999999 !important;
								}
								font-size: 20rpx;
								margin-left: 14rpx;
								text-decoration: line-through;
								line-height: 46rpx;
							}
						}
						.count {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							min-width: 140rpx;
							font-size: 30rpx;
							line-height: 30rpx;
							.count-minus {
								width: 46rpx;
								height: 46rpx;
								font-size: 20rpx;
								color: #666666;
								text-align: center;
								line-height: 46rpx;
								border-radius: 50%;
								border: 2rpx solid #ddd;
							}
							.count-plus {
								width: 46rpx;
								height: 46rpx;
								font-size: 20rpx;
								color: #ffffff;
								text-align: center;
								line-height: 46rpx;
								border-radius: 50%;
								background: #fe6b00;
							}
							span {
								padding: 0 14rpx;
							}
						}
					}
				}
			}
			.other-box {
				height: 28rpx;
				font-size: 20rpx;
				font-weight: 400;
				line-height: 30rpx;
				color: rgba(153, 153, 153, 1);

				&.sellout {
					color: #999999 !important;
				}
				opacity: 1;
				padding-left: 184rpx;
				margin-bottom: 20rpx;
			}
		}
		.coupon-popup1 {
			height: 808rpx;
			background-color: #f9fafb;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			/deep/.u-icon__icon {
				top: 18rpx !important;
				left: 10rpx;
			}
			.title-tit {
				min-height: 50rpx;
				padding: 0 20rpx;
				line-height: 30rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #fe6b00;
				background: #fdf1cd;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 8rpx 8rpx 0 0;
			}
			.title {
				display: flex;
				width: 100%;
				font-size: 40rpx;
				line-height: 56rpx;
				padding: 32rpx 0;
				box-sizing: border-box;
				text {
					width: 150rpx;
					text-align: center;
					height: 56rpx;
					line-height: 56rpx;
				}
				.title-center {
					text-align: left;
					flex: 1;
				}
				.title-right {
					width: 150rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #fe6b00;
					margin-right: 40rpx;
				}
			}
			.goods-List-box {
				height: 900rpx;
				padding-bottom: 144rpx;
				box-sizing: border-box;
				.shop-list {
					padding: 0 40rpx;
					.shop-name {
						margin-top: 40rpx;
						line-height: 40rpx;
						font-size: 28rpx;
						box-sizing: border-box;
						height: 40rpx;
						font-weight: 400;
						color: #333333;
						opacity: 1;
						display: flex;
						justify-content: space-between;
						> view {
							&:first-child {
								flex: 1;
								width: 0;
							}
							&:nth-child(2) {
								width: 100rpx;
								display: flex;
								justify-content: flex-end;
								.icon-style {
									font-size: 28rpx;
									margin-right: 12rpx;
									color: #343434;
								}
							}
						}
					}
					.coupon-item {
						display: flex;
						justify-content: space-between;
						padding: 40rpx 0rpx 40rpx;
						border-bottom: 1rpx solid rgba(226, 226, 226, 1);
						.goods-pic {
							width: 114rpx;
							height: 114rpx;
							margin-right: 36rpx;
							overflow: hidden;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.goods-detail {
							flex: 1;
							display: flex;
							.goods-top {
								margin-bottom: 4rpx;
								flex: 1;
								flex-grow: 1;
								width: 0;
								.goods-name {
									height: 44rpx;
									font-size: 32rpx;
									font-weight: 400;
									line-height: 44rpx;
									color: #333333;
								}
								.goods-prices {
									width: 130rpx;
									height: 44rpx;
									font-size: 32rpx;
									font-weight: bold;
									line-height: 44rpx;
									color: #333333;
									text {
										font-size: 20rpx;
										vertical-align: bottom;
									}
								}
							}
							.goods-count {
								display: flex;
								align-items: center;
								min-width: 100rpx;
								font-size: 30rpx;
								line-height: 30rpx;
								.count-minus {
									width: 46rpx;
									height: 46rpx;
									font-size: 20rpx;
									color: #666666;
									text-align: center;
									line-height: 46rpx;
									border-radius: 50%;
									border: 2rpx solid #ddd;
								}
								.count-plus {
									width: 46rpx;
									height: 46rpx;
									font-size: 20rpx;
									color: #fff;
									text-align: center;
									line-height: 46rpx;
									border-radius: 50%;
									background: #fe6b00;
								}
								text {
									padding: 0 14rpx;
								}
							}
							.goods-descript {
								font-size: 20rpx;
								font-weight: 400;
								line-height: 30rpx;
								color: rgba(153, 153, 153, 1);
							}
							.price {
								line-height: 40rpx;
								font-size: 24rpx;
								color: rgba(255, 0, 0, 1);
								min-height: 46rpx;
								display: flex;
								flex-wrap: wrap;
								.num {
									font-size: 36rpx;
									font-weight: bold;
									margin-left: 2rpx;
								}
								.orgNum {
									color: #666666;
									font-size: 20rpx;
									margin-left: 14rpx;
									text-decoration: line-through;
									line-height: 46rpx;
								}
							}
						}
					}
				}
			}
		}
		.goods-car-fixed {
			position: fixed;
			bottom: 0;
			z-index: 10080;
		}
		.cart-spc {
			margin: 0rpx 20rpx 60rpx 20rpx;
			width: 710rpx;
			min-height: 50rpx;
			padding: 8rpx 8rpx 68rpx 164rpx;
			line-height: 30rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: #fe6b00;
			background: #fdf1cd;
			box-shadow: 0rpx 10rpx 60rpx rgba(197, 202, 213, 0.16);
			border-radius: 40rpx 40rpx 0 0;
		}
		.goods-car {
			margin: 0rpx 20rpx;
			width: 710rpx;
			height: 100rpx;
			margin-bottom: 20rpx;
			opacity: 1;
			border-radius: 50rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			.car-pic {
				background: rgba(0, 0, 0, 0.8);
				border-radius: 50rpx 0 0 50rpx;
				width: 140rpx;
				height: 100%;
				position: relative;
				/deep/.u-badge {
					z-index: 200;
				}
				image {
					height: 120rpx;
					width: 120rpx;
					position: absolute;
					left: 20rpx;
					top: -40rpx;
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.3);
					border-radius: 50%;
				}
				.car-alive {
					height: 120rpx;
					width: 120rpx;
					position: absolute;
					left: 20rpx;
					top: -40rpx;
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.3);
				}
			}
			.car-detail {
				flex: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.info {
					color: #fff;
					font-size: 28rpx;
					color: rgba(153, 153, 153, 1);
					opacity: 1;
				}
				.goods-detail {
					flex: 1;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					padding-left: 20rpx;
					background: rgba(0, 0, 0, 0.8);
					.total-price {
						line-height: 44rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: white;
						.orgin-price {
							margin-left: 14rpx;
							text-decoration: line-through;
							height: 28rpx;
							font-size: 20rpx;
							font-weight: 400;
							line-height: 28rpx;
							color: #999999;
						}
					}
					.total-info {
						height: 28rpx;
						font-size: 20rpx;
						font-weight: 400;
						line-height: 30rpx;
						color: rgba(153, 153, 153, 1);
						opacity: 1;
					}
				}
				.car-btn {
					width: 200rpx;
					height: 100rpx;
					line-height: 30rpx;
					text-align: center;
					color: #ffffff;
					font-size: 28rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					border-radius: 0rpx 50rpx 50rpx 0rpx;
					background: #999999;
				}
				.active {
					color: #ffffff;
					background: #fe6b00;
				}
			}
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
					border: 2rpx solid #fe6b00;
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
					background: #fe6b00;
					color: #ffffff;
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
						background: #fe6b00;
						border-radius: 8rpx;
						font-size: 36rpx;
						font-weight: 500;
						color: #ffffff;
						text-align: center;
						line-height: 100rpx;
						&.gray {
							background: #999999;
							color: white;
						}
					}
				}
			}
		}
		.activity-pop {
			box-sizing: border-box;
			background-color: #fff;
			padding: 0rpx 40rpx 80rpx 24rpx;
			height: 100%;
			.new-tit {
				display: block;
				font-size: 24rpx;
				line-height: 34rpx;
				margin: 34rpx 0 20rpx 0;
				color: #333333;
			}
			.arrow-up {
				height: 40rpx;
				background: #fff;
				margin-bottom: 20rpx;
				/deep/u-icon {
					position: relative;
					left: 50%;
					top: 10%;
				}
			}
			.activity-text {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				position: relative;
				font-size: 24rpx;
				line-height: 36rpx;
				color: #333333;
				.coupon-item {
					position: absolute;
					left: 0;
					top: 0rpx;
				}
				view {
					&:last-child {
						flex: 1;
					}
				}
			}
			.coupon-class {
				position: relative;
				margin-bottom: 20rpx;
				.iconyilingqu {
					position: absolute;
					width: 90rpx;
					height: 70rpx;
					top: 135rpx;
					right: 40rpx;
					font-size: 70rpx;
				}
				.coupon-top {
					display: flex;
					justify-content: space-between;
					padding: 38rpx 0 38rpx 28rpx;
					height: 160rpx;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					.coupon-top-left {
						// max-width: 360rpx;
						flex: 1;
						width: 0;
						.coupon-name {
							height: 44rpx;
							font-size: 32rpx;
							font-weight: 400;
							line-height: 44rpx;
							color: #333333;
							opacity: 1;
							margin-bottom: 12rpx;
						}
						.remark {
							font-size: 10px;
							font-weight: 400;
						}
						.span-style {
							height: 28rpx;
							font-size: 20rpx;
							text-align: center;
							line-height: 28rpx;
							box-sizing: border-box;
							border-radius: 4rpx;
							padding: 4rpx 12rpx;
						}
						.span-style-b {
							border: 2rpx solid rgba(153, 153, 153, 1);
							color: #999999;
						}
						.span-style-r {
							border: 1px solid rgba(255, 77, 79, 1);
							color: #ff4d4f;
						}
						.expiration-date {
							color: rgba(102, 102, 102, 1);
						}
					}
					.coupon-top-right {
						margin-right: 14rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						.amount {
							color: #ff4d4f;
							vertical-align: bottom;
						}
						.amount-info {
							height: 28rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: rgba(153, 153, 153, 1);
							opacity: 1;
						}
					}
				}
				.coupon-bot {
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
					opacity: 1;
					border-radius: 8rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: rgba(153, 153, 153, 1);
					padding: 10rpx 20rpx 10rpx 32rpx;
					text {
						font-size: 10rpx;
					}
					.click {
						height: auto !important;
					}
					.remark-title {
						height: 44rpx;
						line-height: 44rpx;
						display: flex;
						overflow: hidden;
						justify-content: space-between;
						text {
							vertical-align: middle;
							display: inline-block;
							height: 100%;
							width: 50rpx;
						}
						> view {
							width: 100%;
							display: flex;
							&:nth-child(2) {
								margin-left: 30rpx;
								width: 104rpx;
								height: 40rpx;
								background: #fe6b00;
								color: #ffffff;
								border-radius: 20rpx;
							}
						}
					}
				}
			}
		}
		.shop-display {
			background: #f9fafb;
			padding-bottom: 100rpx;
			.sale-time {
				background: #ffffff;
				font-size: 28rpx;
				padding: 20rpx 32rpx;
				.iconfont {
					margin-right: 16rpx;
					font-size: 24rpx;
				}
			}
			.sale-type {
				margin-top: 20rpx;
				padding: 20rpx 32rpx;
				background: #ffffff;
				.s-t-tit {
					color: #333333;
					font-size: 24rpx;
					font-weight: bold;
					line-height: 80rpx;
				}
				.s-t-type {
					display: inline-block;
					border-radius: 4rpx;
					height: 34rpx;
					background: #fe6b00;
					padding: 0 12rpx;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 34rpx;
					color: #ffffff;
					margin-bottom: 40rpx;
				}
				.s-t-con {
					display: flex;
					> view {
						&:first-child {
							font-size: 24rpx;
							font-weight: 400;
							line-height: 34rpx;
							color: #666666;
						}
					}
				}
			}
		}
		.shop-evaluation {
			background: #fff;
			padding: 0rpx 20rpx 80rpx 20rpx;
			width: auto;
			height: 100%;
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
					background: #fe6b00;
					font-weight: bold;
					color: #ffffff;
				}
			}
			.evaluate-class {
				width: 100%;
				padding: 24rpx 40rpx 24rpx 40rpx;
				margin-bottom: 20rpx;
				border-radius: 8rpx;
				box-shadow: 0px 5px 30px rgba(197, 202, 213, 0.15);
				background: linear-gradient(221deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 1) 100%);
				.evaluate-top {
					display: flex;
					justify-content: space-between;
					image {
						width: 38rpx;
						height: 38rpx;
						border-radius: 50%;
						vertical-align: middle;
					}
					text {
						margin-left: 16rpx;
					}
				}
				.evaluate-content {
					white-space: normal;
					word-break: break-all;
					padding-top: 20rpx;
					color: #666666;
				}
				.evaluate-pic {
					margin-top: 20rpx;
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
					word-break: break-all;
				}
			}
		}
	}
	.activity-tit {
		line-height: 28rpx;
		border-radius: 4rpx;
		padding: 0 12rpx;
		border: 2rpx solid #fe6b0050;
		color: #fe6b00;
		font-size: 20rpx;
		margin-right: 16rpx;
		margin-bottom: 10rpx;
	}
	.activity-tit1 {
		width: 28rpx;
		height: 28rpx;
		text-align: center;
		line-height: 28rpx;
		border-radius: 4rpx;
		font-size: 20rpx;
		background: #ff4d4f;
		color: #ffffff;
		margin-right: 16rpx;
	}
	.count-minus {
		width: 46rpx;
		height: 46rpx;
		font-size: 20rpx;
		color: #666666;
		text-align: center;
		line-height: 46rpx;
		border-radius: 50%;
		border: 2rpx solid #ddd;
	}
	.count-plus {
		width: 46rpx;
		height: 46rpx;
		font-size: 20rpx;
		color: #ffffff;
		text-align: center;
		line-height: 46rpx;
		border-radius: 50%;
		background: #fe6b00;
	}
	span {
		padding: 0 14rpx;
	}
	.color-style {
		color: #999 !important;
	}
	.goods-obj {
		position: relative;
		padding-right: 40rpx;
	}
	.sell-out {
		position: absolute;
		right: 0;
		top: 0;
		width: 76rpx;
		text-align: center;
		height: 40rpx;
		color: #fe6b00;
		background: rgba(254, 107, 0, 0.4);
		border-radius: 8rpx 0 0 30rpx;
		font-size: 20rpx;
		font-weight: bold;
		line-height: 40rpx;
	}
	.mask-slot {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: #333333;
		width: 608rpx;
		height: 540rpx;
		background: #fff;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		> view {
			&:nth-child(1) {
				margin: 0 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				height: 400rpx;
				> view {
					&:nth-child(1) {
						padding: 52rpx 0 20rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 40rpx;
						color: #333333;
					}
					&:nth-child(2) {
						height: 56rpx;
						font-size: 40rpx;
						font-weight: 400;
						line-height: 56rpx;
						color: #333333;
					}
				}
				image {
					margin: 52rpx 0 20rpx;
					width: 277rpx;
					height: 200rpx;
				}
			}
			&:nth-child(2) {
				height: 140rpx;
				display: flex;
				justify-content: space-around;
				align-content: center;
				font-weight: 500;
				font-size: 36rpx;
				color: #666666;
				> view {
					font-size: 36rpx;
					height: 100rpx;
					width: 274rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-weight: blod;
					border-radius: 8rpx;
					&:nth-child(1) {
						background: #343434;
						color: #fff;
					}
					&:nth-child(2) {
						background: #fe6b00;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>
