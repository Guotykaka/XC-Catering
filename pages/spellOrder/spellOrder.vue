<template>
	<view class="wrapper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
		<PopUp :popMask="popMask" :popType="popType" :list="popupList" @inVite="hidePop"></PopUp>
		<u-modal
			v-model="addressMol"
			:content="molContent"
			:show-title="false"
			:show-cancel-button="true"
			confirm-color="#FE6B00"
			:content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }"
			width="540"
			@confirm="turnTo('addAddress')"
		></u-modal>
		<u-modal
			v-model="showGetUser"
			:show-title="false"
			:show-cancel-button="true"
			:content-style="{ 'font-weight': 'bold', 'font-size': '36rpx', color: '#1C1C1D', 'line-height': '50rpx' }"
			width="608"
			@cancel="cancelSetUser"
		>
			<view class="slot-content">
				<image src="https://oss.dianddian.cn/common/auth_user_info.png" mode="aspectFill"></image>
				<view>为了完整体验，申请获得以下授权</view>
				<view>获得你的公开信息(昵称、头像等)</view>
			</view>
			<template slot="confirm-button" class="u-border-left" style="height: 100%">
				<view class="confirm-button" style="color: #fe6b00" @tap="updateUser">授权</view>
			</template>
		</u-modal>
		<view v-if="newyear" class="guide closeimg">
			<image class="newyear-img" :src="newyearImg" mode="aspectFill" @tap="newyear = false"></image>
			<image class="newyear-close" src="../../static/img/newyear-close.png" @tap="newyear = false"></image>
		</view>
		<view class="alert" v-if="storeList.length && !storeList[storeList.length < current ? 0 : current].status1"> 本店休息中~ </view>
		<view class="alert u-line-1" v-else-if="storeList.length && !storeList[storeList.length < current ? 0 : current].status">
			营业时间{{ storeList[storeList.length < current ? 0 : current].saleTime }}
		</view>
		<view class="alert" v-else-if="storeList.length && storeList[storeList.length < current ? 0 : current].isBuy">本店超出配送范围</view>
		<view class="nav-top">
			<view class="nav-head">
				<view class="status-box" :style="{ height: `${statusBarHeight}` + 'rpx;width:100%' }"></view>
				<view class="navi-box u-line-1 u-p-l-20" :style="{ 'line-height': `${navigationBarHeight * 1}` + 'rpx;width:520rpx' }" @tap="chooseAddress">
					<text class="iconfont icondingwei"></text>
					{{ addressStr() }}
					<text class="iconfont iconxialacopy u-m-l-20" v-if="!joinStatus" style="vertical-align: text-top; line-height: 2.5"></text>
				</view>
			</view>
			<u-tabs
				v-if="!joinStatus"
				:list="storeList"
				:is-scroll="true"
				name="name"
				duration="0.2"
				:current="current"
				font-size="28"
				gutter="30"
				:blod="true"
				@change="change"
				inactive-color="#000001"
				active-color="#FE6B00"
				:bar-style="barStyle"
			></u-tabs>
			<view class="order-status" v-if="joinStatus">
				<view class="store-name u-line-1">拼餐{{ storeList[storeList.length < current ? 0 : current].name || "" }}</view>
				<view class="spell-box">
					<view class="spell-left">
						<view class="user-image">
							<view v-for="(it, i) in groupMsg.urls" :key="i">
								<image :src="`${it || '../../static/img/deliveryPic.png'}`" mode="aspectFit" v-if="i < 5"></image>
							</view>
						</view>
						<text>{{ groupMsg.name }}发起{{ groupMsg.type == 1 ? "我买单" : "AA拼" }}，{{ groupMsg.count }}人正在选购</text>
					</view>
					<view class="spell-right" @tap="turnTo('detail')" v-if="storeList.length && storeList[storeList.length < current ? 0 : current].status"
						>查看详情</view
					>
				</view>
			</view>
		</view>
		<view class="block" :style="{ height: `${topHeight * 2}rpx` }"></view>
		<view class="featured" v-if="featuredList.length">
			<image class="img-a" src="https://oss.dianddian.cn/v2/purchase/featured.png" mode="widthFix"></image>
			<swiper
				class="scroll-x"
				style="height: 350rpx"
				:current="0"
				:interval="3000"
				:circular="true"
				:duration="1000"
				:autoplay="false"
				@change="changeSwi"
				:style="{
					backgroundColor: '#fff',
				}"
			>
				<swiper-item class="scroll-box" v-for="(item, index) in featuredList" :key="index">
					<view class="u-flex u-flex-nowrap">
						<view v-for="(it, i) in item.list" :key="i" :class="[{ 'u-m-l-6': i !== 0 }, 'scroll-boxes']">
							<view class="u-flex u-col-top boxes">
								<view>
									<image class="img" :src="it.coverPic" mode="aspectFill"></image>
									<view class="u-font-24 u-m-t-10 u-line-1">{{ it.goodsName }}</view>
								</view>
								<view class="u-m-l-4" style="color: #fe6b00" v-if="i !== item.list.length - 1">+</view>
							</view>
						</view>
					</view>
					<view class="btn u-m-t-28">
						<view class="u-flex">
							<text class="u-font-28">套餐价：</text>
							<text class="u-font-20">¥</text>
							<text class="u-font-28">{{ item.amount }}</text>
							<view
								:class="[
									{
										cant:
											!storeList[storeList.length < current ? 0 : current].isBuy &&
											storeList[storeList.length < current ? 0 : current].status,
									},
									'button u-m-l-20',
								]"
								@tap.stop="addPurch(item)"
							>
								加购</view
							>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper-indicator">
				<block>
					<view
						class="u-indicator-item-dot u-m-l-8 u-m-r-8"
						:class="{ 'u-indicator-item-dot-active': index == uCurrent }"
						v-for="(item, index) in featuredList"
						:key="index"
					></view>
				</block>
			</view>
		</view>
		<view class="shop-con" v-if="detailList.length">
			<view class="shop" v-for="(i, inx) in detailList" :key="inx">
				<view class="shop-head">
					<image
						:src="`${i.shopLogo ? i.shopLogo + '?x-oss-process=image/resize,limit_0,m_fill,w_60,h_60/quality,q_100' : shopImg}`"
						mode="aspectFill"
						lazy-load
						lazy-load-margin="0.5"
					></image>
					<view class="head-left">
						<view>
							<view class="u-line-1 head-tit" style="max-width: 382rpx">{{ i.shopName }}</view>
							<text class="iconfont iconxingxing text1" v-if="i.shopScore"></text>
							<text class="text2" v-if="i.shopScore">{{ i.shopScore }}</text>
							<view class="head-right" style="white-space: nowrap">
								已售 {{ i.saleCount ? (i.saleCount > 9999 ? "9999+" : i.saleCount) : "0" }}
							</view>
						</view>
						<view>
							<view v-for="(act, inxa) in i.listActivity" :key="inxa">
								{{ `${act.maxAmount}减${act.reduceFee}` }}
							</view>
						</view>
					</view>
				</view>
				<view :class="[{ 'u-p-b-66': Boolean(i.listGroupShopGoodsInfo.length > 6) }, 'goods-con']">
					<view class="goods-item" v-for="(it, index) in i.listGroupShopGoodsInfo" :key="index">
						<view v-if="i.click ? true : index <= 5">
							<view style="position: relative; height: 204rpx; margin-bottom: 8rpx">
								<text class="discount" v-if="it.sale">{{ it.sale || "" }}</text>
								<image
									:src="`${it.coverPic ? it.coverPic + '?x-oss-process=image/resize,limit_0,m_fill,w_214,h_204/quality,q_100' : shopImg}`"
									mode="aspectFill"
									@tap.stop="jumpGoodDetails(it, inx)"
								></image>
							</view>
							<view class="goods-name u-line-3" @tap.stop="jumpGoodDetails(it, inx)">{{ it.goodsName }}</view>
							<view class="goods-bot u-line-1">
								<view class="left u-line-1" @tap.stop="jumpGoodDetails(it, inx)">
									<text>￥</text>
									<text>{{ it.wmDiscountPrice }}</text>
									<text v-if="it.wmDiscountPrice !== it.wmOriginalPrice">￥{{ it.wmOriginalPrice }}</text>
								</view>
								<view class="dishes-count">
									<view
										:class="[
											{
												cant:
													detailList[inx].status == 1 &&
													!storeList[storeList.length < current ? 0 : current].isBuy &&
													storeList[storeList.length < current ? 0 : current].status,
											},
											'count-plus iconfont icon-add',
										]"
										@tap.stop="changeSPcart(it, 'plus', detailList[inx].status == 1)"
									>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="is-more u-flex" v-if="!i.click && i.listGroupShopGoodsInfo.length > 6" @tap="detailList[inx].click = true">
						查看更多
						<view class="iconfont icon-arrow-down u-m-l-10"></view>
					</view>
				</view>
			</view>
			<view class="have-none" v-if="detailList.length">
				<u-loading v-if="pageDownEva" mode="circle"></u-loading>
				<text v-else>已经到底了</text>
			</view>
		</view>
		<view class="bubble-box step-1" v-if="publicStu && !joinStatus">发起我买单或AA拼</view>
		<view class="bubble-box step-2" v-if="publicStu && joinStatus && !invitationStu">点击邀请好友</view>
		<view class="bubble-box step-3" v-if="publicStuTwo && joinStatus && (invitationStu || (!groupMsg.create && groupMsg.settlement)) && !cartData.count"
			>选购餐品</view
		>
		<view class="bubble-box" v-if="publicStuTwo && joinStatus && (invitationStu || (!groupMsg.create && groupMsg.settlement)) && cartData.count"
			>点击选好了</view
		>
		<view
			class="car-box"
			v-if="storeList.length && !storeList[storeList.length < current ? 0 : current].isBuy && storeList[storeList.length < current ? 0 : current].status"
		>
			<view class="car-left" @tap="cancelPopup">
				<view class="image-box">
					<image src="../../static/img/car1.png" mode="aspectFit"></image>
					<u-badge type="error" size="small" :count="cartData.count || 0" :offset="[0, 0]"></u-badge>
				</view>
				<view class="price-con u-flex">
					<view>
						<view>¥{{ getPrice(cartData) }}</view>
						<view v-if="getPrice(cartData) * 1 !== cartData.totalOriginal * 1"> ¥{{ cartData.totalOriginal || 0 }} </view>
					</view>
					<view class="u-m-l-10 u-line-1" v-if="cartData.totalPackageFee">{{ `(含餐盒费¥${cartData.totalPackageFee})` }} </view>
				</view>
			</view>
			<view class="car-right" v-if="!joinStatus">
				<button class="button1" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone">AA拼</button>
				<view class="button1" @tap="addressMol = true" v-else-if="!addressList.length">AA拼</view>
				<view class="button1" @tap="showGetUser = true" v-else-if="!avatarUrl">AA拼</view>
				<view class="button1" @tap="creatGroup(2)" v-else>AA拼</view>
				<button class="button2" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone">我买单</button>
				<view class="button2" @tap="addressMol = true" v-else-if="!addressList.length">我买单</view>
				<view class="button2" @tap="showGetUser = true" v-else-if="!avatarUrl">我买单</view>
				<view class="button2" @tap="creatGroup(1)" v-else>我买单</view>
			</view>
			<view class="car-right join" v-else-if="groupMsg.type == 1">
				<button class="cancel-class" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone && groupMsg.create">
					{{ groupMsg.create ? "取消" : "退出" }}我买单
				</button>
				<button class="button1 u-m-r-10" open-type="share" plain="true" v-if="groupMsg.create" @tap="invitationClick">邀请好友</button>
				<button class="do-class" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone">选好了</button>
				<view :class="[{ cant: !groupMsg.settlement || !cartData.count }, 'do-class']" @tap="turnTo('settle')" v-else>{{
					!cartData.count && storeList[storeList.length < current ? 0 : current].qsj
						? `¥${storeList[storeList.length < current ? 0 : current].qsj}起送`
						: "选好了"
				}}</view>
			</view>
			<view class="car-right join" v-else-if="groupMsg.type == 2">
				<button class="cancel-class" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone && groupMsg.create">
					取消AA拼
				</button>
				<button class="button1 u-m-r-10" open-type="share" plain="true" v-if="groupMsg.create" @tap="invitationClick">邀请好友</button>
				<button class="do-class" plain="true" open-type="getPhoneNumber" @getphonenumber="bindPhone" v-if="!phone">选好了</button>
				<view :class="[{ cant: !groupMsg.settlement || !cartData.count }, 'do-class']" @tap="turnTo('settle')" v-else>{{
					!cartData.count && storeList[storeList.length < current ? 0 : current].aaQsj
						? `¥${storeList[storeList.length < current ? 0 : current].aaQsj}起送`
						: "选好了"
				}}</view>
			</view>
		</view>
		<u-popup v-model="isShowAddressBox" mode="top" :mask="true">
			<view class="address-con">
				<view class="address-box">
					<view class="nav-head">
						<view class="status-box" :style="{ height: `${statusBarHeight}` + 'rpx;width:100%' }"></view>
						<view class="navi-box" :style="{ 'line-height': `${navigationBarHeight * 2}` + 'rpx;width:284px' }">
							<text class="iconfont icondingwei"></text>
							<view class="u-line-1 bold"> {{ addressStr() }}</view>
							<text class="iconfont iconxialacopy u-m-l-20"></text>
						</view>
					</view>
					<view class="address-list">
						<view class="u-p-l-48 u-p-b-20" style="border-bottom: 20rpx solid #f6f6f7">
							<view class="locstr u-m-b-20">当前定位</view>
							<view class="u-p-r-48" @tap="onShowFuc">
								<image src="/static/img/speloc.png" mode="aspectFill" style="width: 24rpx; height: 24rpx" class="u-m-r-20"></image>
								<text class="locadd bold u-m-t-20">{{ recommend() }}</text>
								<text style="float: right; height: 40rpx; font-size: 28rpx; color: #fe6b00; line-height: 40rpx">重新定位</text>
							</view>
						</view>
						<view class="locstr u-m-l-48 u-m-t-20">收货地址</view>
						<scroll-view :scroll-y="true" style="max-height: 550rpx">
							<view class="address-item" v-for="(it, i) in addressList" :key="i" @tap="changeAddress(i)">
								<view class="address-left">
									<view>
										{{ it.address }}
										<text class="span-style-b span-style u-m-l-10" v-if="it.isDefault == 0">常用</text>
										<text class="span-style-g span-style u-m-l-10" v-if="it.mark == 0">公司</text>
										<text class="span-style-r span-style u-m-l-10" v-if="it.mark == 1">学校</text>
										<text class="span-style-y span-style u-m-l-10" v-if="it.mark == 2">家</text>
									</view>
									<!-- <view>{{ it.area }}</view> -->
									<view>
										<text>{{ it.relationPerson }}({{ it.sex == 0 ? "先生" : "女士" }})</text>
										<text>{{ it.phone }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<view class="but-add bold" @tap="turnTo('addAddress')">
					+添加新地址
					<text class="iconfont icon-arrow-right u-m-t-8 u-p-r-48" style="color: #ababaf; font-size: 18rpx; float: right"></text>
				</view>
			</view>
		</u-popup>
		<!-- 购物车弹框 -->
		<block v-if="cartModel">
			<u-popup
				class="cart-popup"
				v-model="cartModel"
				:custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }"
				mode="bottom"
				:duration="50"
				:mask="true"
				:closeable="false"
				:safe-area-inset-bottom="true"
				border-radius="8"
				close-icon-pos="top-left"
			>
				<view>
					<view class="shop-name">
						<view class="u-line-1" @tap="cartModel = false"> 已选商品</view>
						<view @tap="deleteCartFuc">
							<tetx class="iconfont icon-delete icon-style"></tetx>
							清空
						</view>
					</view>
					<scroll-view
						class="goods-List-box"
						scroll-y="true"
						show-scrollbar="true"
						:style="{
							height: flat * 300 + 'rpx',
						}"
					>
						<view class="shop-list" v-for="(it, inx) in cartData.shoppingShopCarts" :key="inx">
							<view class="shop-header">
								<view>
									<image :src="it.pic" mode="aspectFit" class="u-m-r-20"></image>
									<view class="u-line-2">{{ it.shopName }}</view>
								</view>
								<view class="u-line-2 u-m-t-10">{{ it.discountMsg }}</view>
							</view>
							<view
								v-for="(i, index) in it.shoppingCarts"
								:class="[{ border: index == it.shoppingCarts.length - 1 }, 'coupon-item']"
								:key="index"
							>
								<view class="goods-pic">
									<image :src="`${i.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFit"></image>
								</view>
								<view class="goods-detail">
									<view class="goods-top">
										<view class="goods-name-popup u-line-1">{{ i.goodsName }}</view>
										<view class="goods-descript u-line-3">{{ i.specification }}</view>
										<view class="price-num">
											¥{{ i.wmDiscountPrice }}
											<text class="orgNum" v-if="Boolean(i.wmDiscountPrice !== i.wmOriginalPrice) && Boolean(!i.discount)">
												￥{{ i.wmOriginalPrice }}
											</text>
											<text class="discount-text2" v-if="i.discount">{{ i.customerName + `价¥${i.wmCustomerPrice}` }}</text>
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
		</block>
		<!-- 选择规格 -->
		<u-popup
			class="coupon-popup-stocks"
			v-model="stocks.model"
			:custom-style="{ background: 'rgba(0, 0, 0, 0.5)' }"
			mode="bottom"
			z-index="10090"
			duration="50"
			:mask="true"
			:closeable="true"
			:safe-area-inset-bottom="true"
			border-radius="8"
		>
			<view class="popup-stocks">
				<scroll-view :show-scrollbar="false" scroll-y scroll-with-animation scroll-into-view="true" style="max-height: 60vh; padding-bottom: 120rpx">
					<view class="ps-tittle" @tap="stocks.model = false">
						<view>
							<image class="banner-img" :src="`${stocks.goods.coverPic}?x-oss-process=image/resize,w_700`" mode="aspectFill"></image>
						</view>
						<view>
							<view>{{ stocks.goods.goodsName }}</view>
							<view>已售{{ stocks.goods.count || 0 }}</view>
							<view style="height: 56rpx">
								<view style="font-size: 28rpx; align-self: center">￥</view>
								<view style="align-self: center">{{ stocks.price }}</view>
								<view class="original" v-if="stocks.originalPrice !== stocks.price">原价:{{ stocks.originalPrice }}</view>
								<view class="discount-text" v-if="Boolean(goodsDetail.discount) && Boolean(stocks.wmCustomerPrice)">{{
									goodsDetail.customerName + `价¥${stocks.wmCustomerPrice}`
								}}</view>
								<view> </view>
							</view>
						</view>
					</view>
					<view class="ps-mini-tittle" style="margin-top: 0; margin-bottom: 0">{{ stocks.goods.typeName }}</view>
					<view class="ps-content" v-if="stocks.list.length > 1">
						<view class="ps-content-view" :class="{ ifchoose: it.choose }" v-for="(it, i) in stocks.list" :key="i" @tap="chooseStocks(i)">
							<text> {{ it.specification }}</text>
						</view>
					</view>
					<div v-for="(item, i) in stocks.specList" :key="i">
						<view class="ps-mini-tittle" style="margin-bottom: 0">{{ item.name }}</view>
						<view class="ps-content">
							<view
								class="ps-content-view"
								:class="{ ifchoose: it.choose }"
								v-for="(it, inx) in item.children"
								:key="inx"
								@tap="chooseSpec(i, inx)"
							>
								<text> {{ it.name }}</text>
							</view>
						</view>
					</div>
				</scroll-view>
				<view class="ps-footer">
					<view @tap="conformStocks(i)" :class="{ gray: !stocks.id }"> 加入购物车</view>
				</view>
			</view>
		</u-popup>
		<tab-bar pagePath="pages/spellOrder/spellOrder"></tab-bar>
	</view>
</template>

<script>
import store from "@/store";
import { Decimal } from "decimal.js";
import { getObjType, getBarHeight, getUserLocation, appInit } from "@/utils";
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
import popUp from "../../components/popup/popup";
export default {
	components: {
		popUp,
	},
	data() {
		return {
			newyearImg: "",
			newyear: false,
			guideStu: false,
			invitationStu: 0,
			pageIndex: 1,
			pageDownEva: true, //翻页标识
			current: 0,
			queryQ: 0, //推广大使
			queryId: 0, //传入的拼单id
			queryShop: 0, //传入的店铺id
			queryStore: 0, //传入的市集id
			joinStatus: 0, //参与状态0未参加1参加
			statusBarHeight: 20,
			navigationBarHeight: 40,
			cartModel: false, //购物车弹窗
			addressMol: false,
			showGetUser: false,
			checkedLogin: false,
			isShowAddressBox: false,
			phone: "",
			avatarUrl: "",
			shopImg: getApp().globalData.shopImg,
			molContent: "当前没有收货地址，请先添加地址后再发起",
			featuredList: [],
			storeList: [],
			popupList: [],
			popMask: false,
			popType: 0,
			detailList: {
				data: { data: [] },
			},
			addressList: [],
			stocks: {
				id: 0,
				price: 0,
				originalPrice: 0,
				wmCustomerPrice: 0,
				goods: {}, //规格商品
				specList: [], //规格描述列表
				chosen: {}, //选中的库存对象
				model: false, //规格弹窗
				list: [], //规格列表
			},
			cartData: {},
			defAddr: {
				address: "",
				location: "0,0",
				id: 0,
			},
			barStyle: {
				width: "32rpx",
				height: "6rpx",
				"border-radius": "4rpx",
			},
			groupMsg: {
				address: "",
				addressId: 0,
				count: 0,
				create: true,
				createId: 930,
				createTime: "",
				id: 0,
				msg: "",
				name: "",
				phone: 0,
				relationPerson: 0,
				settlement: true,
				shippingFee: 0,
				status: 0,
				storeId: 0,
				totalPackageFee: 0,
				totalPdPackageFee: 0,
				totalPrice: 0,
				type: 1,
				urls: [],
				users: [],
			},
			goodsDetail: {},
			topHeight: 100,
			isSticky: false,
			uCurrent: 0,
			startX: 0,
			towards: "",
		};
	},
	onShareAppMessage: function (res) {
		const that = this;
		// 	【请客】XXX请你吃饭了
		// 【拼单】XXX邀请你来拼单了
		// 文案调整了下，昵称有就显示，没有就不显示
		if (res.from === "button") {
			const pdId = this.groupMsg.id;
			const pdName = getApp().globalData.UserInfo?.wxNickName ?? "";
			// 来自页面内转发按钮
			return {
				title: `${that.groupMsg.type == 1 ? pdName + "请你吃饭了！" : pdName + "邀请你来拼单了！"}`,
				imageUrl: "https://oss.dianddian.cn/share/pin_dan_share.png",
				path: `/pages/spellOrder/spellOrder?pdId=${pdId}`,
			};
		} else {
			return {
				title: "进入餐典到了",
				imageUrl: SHARE_URL,
				path: `/pages/index/index`,
			};
		}
	},
	onPullDownRefresh() {
		uni.stopPullDownRefresh();
		let page = getCurrentPages().pop(); //获取当前页面实例
		if (page == undefined || page == null) return;
		uni.showLoading({
			title: "正在刷新",
			mask: true,
		});
		this.onShowFuc();
		// page.onShow();
	},
	async onLoad(query) {
		let { top, height } = uni.getMenuButtonBoundingClientRect();
		let { statusBarHeight } = uni.getSystemInfoSync();
		this.statusBarHeight = getBarHeight();
		this.navigationBarHeight = (top - statusBarHeight) * 2 + height;
		this.queryId = query?.pdId ?? 0;
		this.queryQ = query?.q ?? 0;
		this.queryShop = query?.shopId ?? 0;
		this.queryStore = query?.storeId ?? 0;
		appInit(this.getPdPopup);
	},
	onShow() {
		if (getApp().globalData.previewImage) {
			getApp().globalData.previewImage = false;
			this.getCart();
			return;
		}
		this.current = 0;
		this.groupMsg = {
			address: "",
			addressId: 0,
			count: 0,
			create: true,
			createId: 930,
			createTime: "",
			id: 0,
			msg: "",
			name: "",
			phone: 0,
			relationPerson: 0,
			settlement: true,
			shippingFee: 0,
			status: 0,
			storeId: 0,
			totalPackageFee: 0,
			totalPdPackageFee: 0,
			totalPrice: 0,
			type: 1,
			urls: [],
			users: [],
		};
		this.joinStatus = 0;
		this.storeList = [];
		this.detailList = {
			data: { data: [] },
		};
		this.addressList = [];
		this.stocks = {
			id: 0,
			price: 0,
			originalPrice: 0,
			wmCustomerPrice: 0,
			goods: {}, //规格商品
			specList: [], //规格描述列表
			chosen: {}, //选中的库存对象
			model: false, //规格弹窗
			list: [], //规格列表
		};
		this.cartData = {};
		this.cartModel = false; //购物车弹窗
		this.addressMol = false;
		this.showGetUser = false;
		this.checkedLogin = false;
		this.isShowAddressBox = false;
		appInit(this.onShowFuc);
	},
	async onReachBottom(e) {
		if (!this.pageDownEva) return;
		this.pageIndex++;
		let list = await store.dispatch("SelectMakeUpList", {
			// 查询门店团购菜
			storeId: this.storeList[this.current].storeId,
			shopId: this.queryShop,
			pageIndex: this.pageIndex,
		});
		this.pageIndex = list?.data?.data?.pageIndex || 1;
		this.detailList = this.detailList.concat(
			list?.data?.data?.data?.map(it => {
				it.click = false;
				return it;
			}) || []
		);
		this.pageDownEva = Boolean(list?.data?.data?.pageCount > this.pageIndex);
	},
	onHide() {
		this.queryId = 0;
	},
	watch: {
		"cartData.count": {
			handler(newValue, oldValue) {
				if (newValue == 0) this.cartModel = false;
			},
		},
	},
	computed: {
		publicStu() {
			return Boolean(
				this.guideStu && this.groupMsg.create && this.storeList.length && !this.storeList[this.current]?.isBuy && this.storeList[this.current]?.status
			);
		},
		publicStuTwo() {
			return Boolean(this.guideStu && this.storeList.length && !this.storeList[this.current]?.isBuy && this.storeList[this.current]?.status);
		},
		flat() {
			return this.cartData.shoppingShopCarts?.map(it => it.shoppingCarts).flat().length;
		},
	},
	methods: {
		recommend() {
			return getApp().globalData.userAddress;
		},
		addressStr() {
			return this.defAddr.address ? this.defAddr.address : getApp().globalData.userAddress;
		},
		changeSwi(e) {
			let current = e.detail.current;
			this.uCurrent = current;
		},
		touchStart: function (e) {
			if (e.touches.length == 1) {
				this.startX = e.touches[0].clientX;
			}
		},
		touchMove: function (e) {
			if (e.touches.length == 1) {
				var moveX = e.touches[0].clientX;
				var towards = this.startX - moveX;
				this.towards = towards;
			}
		},
		touchEnd: function (e) {
			if (this.towards != "") {
				if (this.towards < -50) {
					//向右
					// if (this.current > 0) this.change(this.current - 1);
				} else if (this.towards > 50) {
					//向左
					// if (this.current < this.storeList.length - 1) this.change(this.current + 1);
				}
			}
			this.towards = "";
		},
		invitationClick() {
			this.invitationStu = 1;
		},
		async getPdPopup() {
			// getPdPopup
			let res = await store.dispatch("GetPdPopup", {});
			if (res.code == 0) {
				this.newyearImg = res.data;
				this.newyear = Boolean(res.data);
				return;
			}
		},
		async onShowFuc() {
			//推广大使
			if (this.queryQ) {
				let link = decodeURIComponent(this.queryQ);
				let promoters = link.split("=")[1];
				if (promoters) {
					let res = await store.dispatch("SavePromoters", { recommendUserId: promoters, userId: getApp().globalData.UserInfo.userId });
				}
			}
			this.checkedLogin = getApp().globalData.checkedLogin;
			this.avatarUrl = getApp().globalData.UserInfo.wxNickName;
			this.phone = getApp().globalData.UserInfo.phone;
			if (!this.avatarUrl && this.queryId) {
				//无头像获取权限
				this.showGetUser = true;
				return;
			}
			this.cancelGetUser();
		},
		init() {
			let [userLongitude, userLatitude] = this.defAddr.location.split(",");
			let proList = [
				store.dispatch("SelectGroupStoreList", {
					userLatitude: userLatitude,
					userLongitude: userLongitude,
					storeId: this.groupMsg.storeId,
					shopId: this.queryShop,
				}), //店铺列表
			];
			let thenFuc = async res => {
				let resArr = res.map(a => a.data);
				this.storeList = resArr[0];
				if (resArr[0].length) {
					this.current = resArr[0].length < this.current ? 0 : this.current;
					if (this.queryShop * 1) {
						const inx = resArr[0].findIndex(element => !element.isSelect);
						this.current = inx == -1 ? this.current : inx;
					} else if (this.queryStore * 1) {
						const inxS = resArr[0].findIndex(element => element.storeId == this.queryStore * 1);
						this.current = inxS == -1 ? this.current : inxS;
						this.queryStore = 0;
					}
					this.pageIndex = 1;
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					this.uCurrent = 0;
					let featuredList = await store.dispatch("GetfeaturedGoods", {
						//查询拼餐精选套餐
						storeId: resArr[0][this.current].storeId,
					});
					this.featuredList = featuredList.data;
					let list = await store.dispatch("SelectMakeUpList", {
						storeId: resArr[0][this.current].storeId,
						shopId: this.queryShop,
						pageIndex: 1,
					});
					this.detailList =
						list?.data?.data?.data.map(it => {
							it.click = false;
							return it;
						}) || [];
					this.pageIndex = list?.data?.data?.pageIndex || 1;
					this.pageDownEva = Boolean(list?.data?.data?.pageCount > this.pageIndex);
					let chart = await store.dispatch("GetMakeUpCart", { storeId: resArr[0][this.current].storeId });
					this.cartData = chart.data;
					uni.hideLoading();
				}
				uni.hideLoading();
			};
			PromiseAll(proList, thenFuc);
		},
		turnTo(key) {
			switch (key) {
				case "addAddress":
					uni.navigateTo({
						url: `/pagesB/addAddress/addAddress`,
					});
					break;
				case "settle":
					if (!this.groupMsg.settlement || !this.cartData.count) return;
					getApp().globalData.previewImage = true;
					let url =
						this.groupMsg.type == 1
							? `/pagesPing/dinnerOrderDeatil/dinnerOrderDeatil?id=${this.groupMsg.id}&type=1`
							: `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${this.groupMsg.id}&type=1`;
					uni.navigateTo({
						url: url,
					});
					break;
				case "detail":
					getApp().globalData.previewImage = true;
					let page =
						this.groupMsg.type == 1
							? `/pagesPing/dinnerOrderDeatil/dinnerOrderDeatil?id=${this.groupMsg.id}&type=0`
							: `/pagesPing/spellOrderDeatil/spellOrderDeatil?id=${this.groupMsg.id}&type=0`;
					uni.navigateTo({
						url: page,
					});
					break;
				default:
					break;
			}
		},
		change(index) {
			this.current = index;
			uni.pageScrollTo({
				scrollTop: 0,
			});
			this.queryShop = 0;
			this.queryStore = 0;
			this.init();
		},
		disjoin(userId) {
			userId = !userId ? getApp().globalData.UserInfo.userId : userId;
			let params = {
				pdId: this.groupMsg.id,
				userId: getApp().globalData.UserInfo.userId,
			};
			let successFuc = () => {
				this.queryId = 0;
				getCurrentPages().pop().onShow();
			};
			AjaxApi("CancelGroup", params, successFuc);
		},
		async checkNewUser() {
			uni.showLoading({
				title: "",
			});
			let nCoupon = await store.dispatch("NewRedP", {});
			if (nCoupon.code == 0) {
				this.popupList = nCoupon.data;
				this.popType = 9;
				this.popMask = true;
			}
			uni.hideLoading();
		},
		async getEvery() {
			uni.showLoading({
				title: "",
			});
			let eCoupon = await store.dispatch("GetEveryCoupons", {});
			if (eCoupon.code == 0) {
				this.popupList = eCoupon.data;
				this.popType = 0;
				this.popMask = true;
			}
			uni.hideLoading();
		},
		popupFuc() {
			uni.showLoading({
				title: "",
			});
			let proList = [
				store.dispatch("IsNewUser", {}), //是否新人
			];
			let thenFuc = async res => {
				let resArr = res.map(a => a.data);
				let isNewUser = resArr[0] ?? false;
				if (isNewUser) {
					this.checkNewUser();
				} else {
					this.getEvery();
				}
			};
			let catchFuc = err => {
				uni.hideLoading();
			};
			PromiseAll(proList, thenFuc, catchFuc);
		},
		insideFuc() {
			let params = {
				pdId: this.queryId,
			};
			let successFuc = async () => {
				let group = await store.dispatch("GetGroup", {}); //拼单信息
				let obj = {
					address: "",
					addressId: 0,
					count: 0,
					create: true,
					createId: 930,
					createTime: "",
					id: 0,
					msg: "",
					name: "",
					phone: 0,
					relationPerson: 0,
					settlement: true,
					shippingFee: 0,
					status: 0,
					storeId: 0,
					totalPackageFee: 0,
					totalPdPackageFee: 0,
					totalPrice: 0,
					type: 1,
					urls: [],
					users: [],
				};
				this.groupMsg = getObjType(group.data) == "null" ? obj : group.data;
				this.topHeight = !Boolean(this.groupMsg.urls?.length ?? 0) ? this.statusBarHeight + 29 : this.statusBarHeight + 64;
				this.socketFuc();
				this.joinStatus = getObjType(group.data) == "null" ? 0 : 1;
				if (this.joinStatus) {
					this.defAddr = {
						address: group.data.address,
						location: "0,0",
						id: 0,
					};
				}
				getUserLocation(this.init);
			};
			let elseFuc = () => {
				this.queryId = 0;
				getCurrentPages().pop().onShow();
			};
			AjaxApi("TakeGroup", params, successFuc, elseFuc);
		},
		socketFuc() {
			if (this.groupMsg.id) {
				//打开
				getApp().globalData.conectSocket = true;
				getApp().linkWebsocket(`${this.groupMsg.id}/${getApp().globalData.UserInfo.userId}`);
				getApp().initSocket();
			} else {
				//关闭
				getApp().globalData.conectSocket = false;
				getApp().linkWebsocket();
			}
			getApp()
				.getWebSocket()
				.onReceivedMsg(result => {
					// console.log("长连接" + result.data);
					this.socketFresh();
					// 要进行的操作
				});
		},
		async socketFresh() {
			this.queryId = 0;
			let pdId = await store.dispatch("GetPdId", {});
			if (pdId.code == 0) {
				this.queryId = !this.queryId ? pdId.data || 0 : this.queryId;
			}
			if (this.queryId) {
				let group = await store.dispatch("GetGroup", {}); //拼单信息
				this.groupMsg = getObjType(group.data) == "null" ? this.groupMsg : group.data;
			} else {
				getCurrentPages().pop().onShow();
			}
		},
		getPrice(it) {
			let val = new Decimal(it.totalPrice ?? 0)
				.sub(new Decimal(it.reduceFee ?? 0))
				.sub(new Decimal(it.firstOrderDiscounts ?? 0))
				.add(new Decimal(it.totalPackageFee ?? 0));
			return val > 0 ? val : 0;
		},
		bindPhone(e) {
			// 手机号码授权
			if (!e.detail.iv) {
				uni.showModal({
					title: "温馨提示",
					content: "您点击了拒绝授权，将无法进行分享，请授权之后再进入",
					showCancel: false,
					confirmText: "确定",
				});
				return;
			}
			uni.showLoading({
				title: "获取信息",
				mask: true,
			});
			let { encryptedData, iv } = e.detail;
			let params = {
				encryptedData: encryptedData,
				iv: iv,
			};
			let successFuc = async () => {
				if (!this.avatarUrl) {
					//无头像获取权限
					this.showGetUser = true;
				}
				let ress = await store.dispatch("QueryUserInfo", {});
				getApp().globalData.UserInfo = ress?.data ?? { phone: null };
				this.phone = getApp().globalData.UserInfo.phone;
			};
			AjaxApi("GetUserPhone", params, successFuc);
		},
		outsideFuc() {
			let successFuc = async res => {
				this.topHeight = !Boolean(this.groupMsg.urls?.length ?? 0) ? this.statusBarHeight + 29 : this.statusBarHeight + 64;
				this.socketFuc(); //关闭
				if (res.data.length) {
					const index = res.data.findIndex(item => item.id == getApp().globalData.promotionDefAddr?.id);
					this.addressList = res.data;
					this.defAddr = getApp().globalData.promotionDefAddr?.id ? getApp().globalData.promotionDefAddr : res.data[0];
					getUserLocation(this.init);
				} else {
					uni.hideLoading();
					this.defAddr.location = [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "";
					getUserLocation(this.init, true);
				}
			};
			AjaxApi(
				"GetPdList",
				{
					location: !getApp().globalData.location.longitude
						? ""
						: [getApp().globalData.location.longitude * 1, getApp().globalData.location.latitude * 1] + "",
				},
				successFuc
			);
		},
		cancelPopup() {
			//购物车弹框
			if (this.cartData.count == 0 || this.storeList[this.current].status !== 1) return;
			this.cartModel = !this.cartModel;
		},
		deleteCartFuc() {
			//清空购物车
			let params = {
				storeId: this.storeList[this.current].storeId,
			};
			let successFuc = res => {
				this.getCart();
			};
			AjaxApi("DeleteMakeUpCart", params, successFuc);
		},
		hidePop() {
			this.popMask = false;
		},
		cancelSetUser() {
			this.queryId = 0;
			this.cancelGetUser();
		},
		async cancelGetUser() {
			let pdGuide = await store.dispatch("GetPdGuide", {});
			this.guideStu = Boolean(pdGuide?.data);
			this.invitationStu = !this.guideStu ? 1 : this.invitationStu;
			if (this.queryId) {
				this.popupFuc();
			}
			let pdId = await store.dispatch("GetPdId", {});
			if (pdId.code == 0) {
				this.queryId = !this.queryId ? pdId.data || 0 : this.queryId;
			}
			this.queryId ? this.insideFuc() : this.outsideFuc();
		},
		updateUser() {
			uni.getUserProfile({
				desc: "获取头像",
				success: res => {
					console.log(res);
					let { nickName, avatarUrl } = res.userInfo;
					let prams = {
						wxNickName: nickName,
						avatarUrl: avatarUrl,
					};
					let successFuc = async res => {
						console.log("🚀 ~ file: spellOrder.vue ~ line 1010 ~ updateUser ~ res", res);
						let user = await store.dispatch("QueryUserInfo", {});
						getApp().globalData.UserInfo = user.data;
						let page = getCurrentPages().pop(); //获取当前页面实例
						if (page == undefined || page == null) return;
						page.onShow();
					};
					AjaxApi("PostUpdateUser", prams, successFuc);
				},
				fail: err => {
					console.log(err);
				},
			});
		},
		async getCart() {
			const paramss = {
				storeId: this.storeList[this.current].storeId,
			};
			const awaitdata = await store.dispatch("GetMakeUpCart", paramss);
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
		},
		chooseAddress() {
			if (this.joinStatus) return;
			this.isShowAddressBox = true;
		},
		changeAddress(inx) {
			this.current = 0;
			getApp().globalData.promotionDefAddr = this.addressList[inx];
			this.defAddr = this.addressList[inx];
			this.isShowAddressBox = false;
			this.init();
		},
		async conformStocks() {
			//确认规格并加入购物车
			if (!this.stocks.id) {
				uni.showToast({
					title: `库存不足!`,
					icon: "none",
					mask: true,
					duration: 1500,
				});
				return;
			}
			let SPEC = "";
			this.stocks.specList.forEach(element => {
				element.children.forEach(ele => {
					if (ele.choose == true) {
						SPEC = SPEC + "/" + ele.name;
					}
				});
			});
			const { coverPic, description, goodsId, goodsName, shopId } = this.goodsDetail;
			const params = {
				coverPic,
				description,
				goodsId,
				goodsName,
				shopId,
				storeId: this.storeList[this.current].storeId, //店铺Id
				isAdd: true,
				stockId: this.stocks.chosen.stockId, //库存Id
				specification: this.stocks.chosen.specification + SPEC, //库存描述
			};
			const successFuc = res => {
				const that = this;
				this.getCart();
				this.stocks.id = null;
				this.stocks.model = false;
				if (res.data) {
					uni.showToast({
						title: res.data,
						icon: "none",
						duration: 1500,
						success: () => {
							setTimeout(function () {
								if (!that.goodsDetail.singleOrder) {
									uni.showToast({
										title: "不能单点!",
										icon: "none",
										duration: 1000,
									});
								}
							}, 1500);
						},
					});
				} else if (!that.goodsDetail.singleOrder) {
					uni.showToast({
						title: "不能单点!",
						icon: "none",
						duration: 1000,
					});
				}
			};
			AjaxApi("SaveMakeUpCart", params, successFuc);
		},
		chooseSpec(i, inx) {
			//选规格
			if (this.stocks.specList[i].simple === 2) {
				const index = this.stocks.specList[i].children.filter(item => item.choose == true);
				this.stocks.specList[i].children[inx].choose = index.length == 1 ? true : !this.stocks.specList[i].children[inx].choose;
			} else {
				this.stocks.specList[i].children.filter((element, index) => {
					element.choose = index == inx ? true : false;
					return element;
				});
			}
			this.$forceUpdate();
		},
		chooseStocks(i) {
			//点击选规格
			this.stocks.list.filter((element, inx) => {
				element.choose = inx == i ? true : false;
			});
			if (this.stocks.list[i].availableStock == 0) {
				this.stocks.chosen = this.stocks.list[i];
				this.stocks.price = 0;
				this.stocks.id = null;
				return;
			}
			this.stocks.chosen = this.stocks.list[i];
			this.stocks.price = this.stocks.list[i].wmDiscountPrice;
			this.stocks.wmCustomerPrice = this.stocks.list[i].wmCustomerPrice;
			this.stocks.originalPrice = this.stocks.list[i].wmOriginalPrice;
			this.stocks.id = this.stocks.list[i].goodsId;
		},
		async addPurch(item) {
			if (this.storeList[this.current].isBuy || !this.storeList[this.current].status) return;
			uni.vibrateShort();
			let saveList = [];
			let detailList = [];
			item.list.forEach(async element => {
				detailList.push(store.dispatch("GetGoodsDetail", { goodsId: element.goodsId }));
			});
			let thenFuc = res => {
				let resArr = res.map(a => a.data);
				resArr.forEach((element, i) => {
					let { coverPic, description, goodsName, shopId, goodsId, storeId, stockId } = item.list[i];
					let specification = element.stocks.find(it => it.stockId == stockId).specification;
					let param = {
						coverPic,
						description,
						goodsId,
						goodsName,
						shopId,
						isAdd: true,
						storeId,
						stockId,
						specification,
					};
					saveList.push(store.dispatch("SaveMakeUpCart", param));
				});
				Promise.all(
					saveList.map(p =>
						p.catch(e => {
							console.log(e);
						})
					)
				).then(values => {
					this.getCart();
					let msg = "";
					values.forEach(ele => {
						if (ele.code || getObjType(ele.data) == "string") {
							msg = msg + (msg ? "\n" : "") + (getObjType(ele.data) == "object" ? ele.message : ele.data);
						}
					});
					if (msg) {
						uni.showToast({
							title: msg,
							icon: "none",
							duration: 2000,
						});
					}
				});
			};
			PromiseAll(detailList, thenFuc);
		},
		async changeSPcart(it, type, returnStatus = 1) {
			if (this.storeList[this.current].isBuy || !this.storeList[this.current].status) return;
			if (!Boolean(returnStatus)) {
				uni.showToast({
					title: "该商户已休息",
					icon: "none",
					mask: true,
					duration: 2000,
				});
				return;
			}
			uni.vibrateShort();
			let res = await store.dispatch("GetGoodsDetail", { goodsId: it.goodsId });
			this.goodsDetail = res.data;
			const { specification, stockId } = it;
			const { coverPic, description, goodsName, shopId, goodsId } = this.goodsDetail;
			switch (type) {
				case "plus":
					if (Boolean(res.data.stocks.length == 1 && !res.data.goodsSpecifications.length) || it.addBuy) {
						//规格为一个或加购
						const params = {
							coverPic,
							description,
							goodsId,
							goodsName,
							shopId,
							isAdd: true,
							storeId: this.storeList[this.current].storeId, //店铺Id
							stockId: stockId || res.data.stocks[0].stockId, //规格Id(前加购后列表)
							specification: specification || res.data.stocks[0].specification, //库存描述
						};
						const successFuc = res => {
							const that = this;
							this.getCart();
							if (res.data) {
								uni.showToast({
									title: res.data,
									icon: "none",
									duration: 1500,
									success: () => {
										setTimeout(function () {
											if (!that.goodsDetail.singleOrder) {
												uni.showToast({
													title: "不能单点!",
													icon: "none",
													duration: 1000,
												});
											}
										}, 1500);
									},
								});
							} else if (!that.goodsDetail.singleOrder) {
								uni.showToast({
									title: "不能单点!",
									icon: "none",
									duration: 1000,
								});
							}
						};
						AjaxApi("SaveMakeUpCart", params, successFuc);
					} else {
						//规格为多个
						uni.hideLoading();
						this.stocks.price = 0;
						this.stocks.goods = res.data;
						this.stocks.list = res.data.stocks.map((item, i) => {
							item.choose = false;
							return item;
						});
						this.stocks.chosen = this.stocks.list[0];
						this.stocks.price = this.stocks.list[0].wmDiscountPrice;
						this.stocks.wmCustomerPrice = this.stocks.list[0].wmCustomerPrice;
						this.stocks.originalPrice = this.stocks.list[0].wmOriginalPrice;
						this.stocks.id = this.stocks.list[0].goodsId;
						this.stocks.list[0].choose = true;
						if (this.stocks.list[0].availableStock == 0) this.stocks.id = null;
						this.stocks.specList = res.data.goodsSpecifications.filter((item, i) => {
							const index = item.children.findIndex(ele => ele.checked == true);
							item.children = item.children.filter((it, inx) => {
								inx == index ? (it.choose = true) : (it.choose = false);
								if (it.checked) {
									return it;
								}
							});
							return item;
						});
						this.stocks.model = true;
					}
					break;
				case "minus":
					const params = {
						coverPic,
						description,
						goodsId,
						goodsName,
						shopId,
						stockId,
						isAdd: false,
						storeId: this.storeList[this.current].storeId, //店铺Id
						specification: specification || res.data.stocks[0].specification, //规格描述(前加购后列表)
					};
					const successFuc = async () => {
						this.getCart();
					};
					AjaxApi("SaveMakeUpCart", params, successFuc);
					break;
				default:
					break;
			}
		},
		creatGroup(type) {
			// address/addressId/storeId/type*	(1,请客,2 AA)
			if (this.storeList[this.current].isBuy || !this.storeList[this.current].status) {
				uni.showToast({
					title: "当前门店超出配送范围!",
					icon: "none",
					mask: true,
					duration: 1500,
				});
				return;
			}
			let params = {
				storeId: this.storeList[this.current].storeId,
				address: this.defAddr.address,
				addressId: this.defAddr.id,
				type: type,
			};
			let successFuc = res => {
				getCurrentPages().pop().onShow();
			};
			AjaxApi("CreateGroup", params, successFuc);
		},
		jumpGoodDetails(i, inx) {
			getApp().globalData.previewImage = true;
			uni.navigateTo({
				url: `/pagesPing/foodDetails/foodDetails?storeId=${this.storeList[this.current].storeId}&id=${i.goodsId}&storeStatus=${
					this.detailList[inx].status == 1 && !this.storeList[this.current].isBuy && this.storeList[this.current].status
				}`,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
page {
	background: #f6f6f7 !important;
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
}
/deep/ .u-badge {
	border: 2rpx solid #fff;
}
/deep/ .slot-content {
	text-align: center;
	padding: 60rpx 0;
	image {
		width: 346rpx;
		height: 250rpx;
	}
	> view {
		&:first-of-type {
			font-weight: 400;
			font-size: 36rpx;
			line-height: 50rpx;
			color: #333333;
		}
		&:nth-of-type(2) {
			font-weight: 400;
			font-size: 28rpx;
			line-height: 60rpx;
			color: #999999;
		}
	}
}
.confirm-button {
	height: 100%;
	line-height: 100rpx;
	font-size: 32rpx;
	border: 0;
	padding: 0;
}
.alert {
	background: rgba(0, 0, 0, 0.75);
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	position: fixed;
	bottom: 100rpx;
	bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
	bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
	z-index: 1;
	width: 100%;
	color: white;
	font-size: 28rpx;
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
	&.closeimg {
		/deep/u-icon {
			position: absolute;
			bottom: 10%;
			left: 50%;
			transform: translate(-50%, 0);
			margin: auto;
		}
		.newyear-close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			bottom: 18%;
			left: 50%;
			transform: translate(-50%, 0);
			margin: auto;
		}
		.newyear-img {
			position: fixed;
			margin: auto;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 570rpx;
			min-height: 578rpx;
		}
	}
}
.cart-popup {
	height: 808rpx;
	background-color: #f9fafb;
	padding: 0rpx 20rpx;
	box-sizing: border-box;
	/deep/.u-icon__icon {
		top: 18rpx !important;
		left: 10rpx;
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
			color: #e5cda1;
			opacity: 1;
			margin-right: 40rpx;
		}
	}
	.shop-name {
		width: auto;
		margin: 40rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		height: 40rpx;
		font-weight: 400;
		color: #333333;
		display: flex;
		justify-content: space-between;
		> view {
			&:first-child {
				color: #1c1c1d;
				font-weight: bold;
				flex: 1;
				width: 0;
			}
			&:nth-child(2) {
				width: 100rpx;
				display: flex;
				justify-content: flex-end;
				color: #ababaf;
				.icon-style {
					font-size: 28rpx;
					margin-right: 12rpx;
				}
			}
		}
	}
	.goods-List-box {
		min-height: 400rpx;
		max-height: 900rpx;
		padding-bottom: 0;
		// padding-bottom: constant(safe-area-inset-bottom, 0);
		// padding-bottom: env(safe-area-inset-bottom, 0);
		box-sizing: border-box;
		.shop-list {
			padding: 0 40rpx;
			.shop-header {
				margin-top: 24rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				> view {
					line-height: 56rpx;
					&:first-of-type {
						display: flex;
						font-size: 28rpx;
						font-weight: bold;
						color: #1c1c1d;
						min-width: 200rpx;
						image {
							width: 56rpx;
							height: 56rpx;
							border-radius: 6rpx;
							border: 2rpx solid #f1f1f4;
							vertical-align: middle;
							flex-shrink: 0;
						}
					}
					&:nth-of-type(2) {
						// white-space: nowrap;
						// overflow: hidden;
						// text-overflow: ellipsis;
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #ff3b3b;
						line-height: 28rpx;
					}
				}
			}
			.coupon-item {
				display: flex;
				justify-content: space-between;
				padding: 40rpx 0rpx 40rpx;
				border-bottom: 1rpx solid rgba(226, 226, 226, 1);
				&.border {
					border-bottom: 0;
				}
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
						.goods-name-popup {
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
					.price-num {
						// line-height: 44rpx;
						font-size: 32rpx;
						color: #ff3b3b;
						min-height: 44rpx;
						display: flex;
						flex-wrap: wrap;
						align-items: flex-end;
						.orgNum {
							color: #666666;
							font-size: 20rpx;
							margin-left: 14rpx;
							text-decoration: line-through;
							// line-height: 46rpx;
						}
					}
				}
			}
		}
	}
}
.coupon-popup-stocks {
	/deep/.u-icon__icon {
		top: -10rpx;
		right: -0rpx;
	}
}
.discount-text {
	display: inline-block;
	padding: 0 16rpx;
	height: 48rpx;
	background: linear-gradient(90deg, #646d79 0%, #1f2938 100%);
	border-radius: 10rpx;
	margin-left: 18rpx;
	font-size: 24rpx;
	font-weight: 500;
	color: #ffc49a;
	line-height: 48rpx;
	text-align: center;
}
.discount-text2 {
	display: inline-block;
	height: 40rpx;
	background: #ff3b3b;
	border-radius: 6rpx;
	margin-left: 18rpx;
	font-size: 26rpx;
	color: #ffffff;
	line-height: 40rpx;
	padding: 0 8rpx;
	text-align: center;
}
.popup-stocks {
	min-height: 560rpx;
	background-color: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.ps-tittle {
		height: 116rpx;
		padding: 48rpx 40rpx;
		display: flex;
		position: sticky;
		top: 0;
		box-sizing: content-box;
		background: #ffffff;
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
						line-height: 48rpx;
						font-size: 24rpx;
						color: #ababaf;
					}
					&:nth-child(3) {
						display: flex;
						color: #ff3b3b;
						font-size: 36rpx;
						line-height: 1;
						.original {
							align-self: center;
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
							margin-left: 10rpx;
						}
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
			min-height: 72rpx;
			overflow: hidden;
			font-size: 32rpx;
			color: #1c1c1d;
			background: #f6f6f7;
			border-radius: 10rpx;
			font-weight: 500;
			border-radius: 8rpx;
			padding: 0 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text {
				text-align: center;
				line-height: 72rpx;
			}
		}
		.ifchoose {
			background: #ffe3d2;
			color: #fe6b00;
		}
	}
	.ps-footer {
		position: absolute;
		bottom: 0;
		margin-bottom: 20rpx;
		padding: 0 40rpx;
		view {
			width: 690rpx;
			height: 80rpx;
			background: #fe6b00;
			border-radius: 44rpx;
			color: #343434;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #ffffff;
			&.gray {
				background: #999999;
				color: white;
			}
		}
	}
}
.wrapper {
	background: #f6f6f7;
	width: 100%;
	min-height: 100vh;
	padding-bottom: 200rpx;
	padding-bottom: calc(200rpx + constant(safe-area-inset-bottom, 0));
	padding-bottom: calc(200rpx + env(safe-area-inset-bottom, 0));
	.nav-top {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5000;
	}
	.nav-head {
		width: 100%;
		height: auto;
		background: #fff;
		box-sizing: border-box;
		.icondingwei {
			color: #fe6b00;
			margin-right: 10rpx;
		}
		.iconxialacopy {
			font-size: 16rpx !important;
			color: #1c1c1d;
		}
	}
	.order-status {
		width: 100%;
		min-height: 146rpx;
		padding: 20rpx 24rpx 24rpx 24rpx;
		background: #fff;
		.store-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #fe6b00;
			line-height: 40rpx;
			margin-bottom: 14rpx;
		}
		.spell-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.spell-left {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 60rpx;
				overflow: hidden;
				.user-image {
					display: flex;
					view {
						display: flex;
						align-items: center;
					}
					image {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						border: 2rpx solid #ffffff;
						&:first-child {
							margin-right: -8rpx;
						}
						&:not(:first-child) {
							margin: 0px -8rpx;
						}
					}
				}
				text {
					flex: 1;
					font-size: 24rpx;
					margin-left: 20rpx;
					font-weight: 400;
					color: #fe6b00;
					line-height: 1;
				}
			}
			.spell-right {
				width: 148rpx;
				line-height: 56rpx;
				border-radius: 36rpx;
				border: 2rpx solid #fe6b00;
				font-size: 24rpx;
				word-break: keep-all;
				font-weight: 500;
				color: #fe6b00;
				text-align: center;
			}
		}
	}
	.featured {
		position: relative;
		margin: 0 24rpx;
		width: auto;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 20rpx;
		.swiper-indicator {
			right: 20rpx;
			top: 36rpx;
			position: absolute;
			z-index: 100;
			display: flex;
			.u-indicator-item-dot {
				width: 14rpx;
				height: 14rpx;
				border-radius: 50%;
				background: #ffdecb;
				&.u-indicator-item-dot-active {
					background: #fe6b00;
				}
			}
		}
		.img-a {
			left: 20rpx;
			top: 20rpx;
			position: absolute;
			width: 128rpx;
			height: auto;
			z-index: 100;
		}
		.scroll-x {
			box-sizing: border-box;
		}
		.scroll-box {
			padding-top: 50rpx;
			.scroll-boxes {
				.boxes {
					> view {
						&:first-of-type {
							display: flex;
							flex-direction: column;
							color: #1c1c1d;
							view {
								width: 188rpx;
								line-height: 30rpx;
							}
							.img {
								width: 188rpx;
								height: 188rpx;
								border-radius: 10rpx;
								border: 2rpx solid #f1f1f4;
							}
						}
						&:last-of-type {
							line-height: 188rpx;
							font-size: 48rpx;
						}
					}
				}
			}
			.btn {
				width: auto;
				height: 46rpx;
				background: #ffffff;
				display: flex;
				> view {
					margin-left: auto;
				}
				.button {
					width: 120rpx;
					height: 46rpx;
					background: #eee;
					border-radius: 34rpx;
					font-size: 24rpx;
					font-weight: bold;
					color: #1d1d1d;
					&.cant {
						background: #fe6b00;
						color: #fff;
					}
					line-height: 46rpx;
					text-align: center;
				}
			}
		}
	}
	.shop-con {
		width: auto;
		.have-none {
			line-height: 50rpx;
			font-size: 24rpx;
			color: #c7c7ca;
			text-align: center;
			padding: 28rpx 0;
			text {
				position: relative;
				&::before {
					content: "";
					position: absolute;
					top: 52%;
					background: #c7c7ca;
					width: 100rpx;
					height: 2rpx;
					left: 110%;
				}
				&::after {
					content: "";
					position: absolute;
					top: 52%;
					background: #c7c7ca;
					width: 100rpx;
					height: 2rpx;
					right: 110%;
				}
			}
		}
		.shop {
			margin: 20rpx 24rpx 0 24rpx;
			width: auto;
			height: auto;
			background: #fff;
			box-sizing: border-box;
			border-radius: 16rpx;
			.shop-head {
				padding: 20rpx 24rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				image {
					width: 60rpx;
					height: 60rpx;
					margin-right: 8rpx;
					border-radius: 10rpx;
				}
				.head-tit {
					font-size: 28rpx;
					font-weight: 500;
					color: #1c1c1d;
					margin-right: 20rpx;
				}
				.text1 {
					font-size: 22rpx;
					color: #fe6b00;
					margin-right: 6rpx;
				}
				.text2 {
					font-size: 24rpx;
					font-weight: 600;
					color: #fe6b00;
				}
				.head-left {
					flex: 1;
					.head-right {
						font-size: 24rpx;
						color: #ababaf;
						margin-left: auto;
					}
					> view {
						display: flex;
						align-items: center;
						&:nth-of-type(2) {
							> view {
								padding: 0 10rpx;
								height: 28rpx;
								font-size: 20rpx;
								line-height: 28rpx;
								color: #ff3b3b;
								margin-right: 8rpx;
								border-radius: 4rpx;
								border: 2rpx solid #ff3b3b;
							}
						}
					}
				}
			}
		}
		.goods-con {
			display: inline-flex;
			white-space: nowrap;
			display: flex;
			flex-wrap: wrap;
			padding-left: 20rpx;
			width: auto;
			// padding-right: 4rpx;
			position: relative;
			.is-more {
				width: 150rpx;
				height: 50rpx;
				background: #ffffff;
				border-radius: 26rpx;
				border: 2rpx solid #f1f1f4;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				font-weight: bold;
				color: #fe6b00;
				line-height: 50rpx;
				position: absolute;
				bottom: 20rpx;
				left: 50%;
				transform: translate(-50%, 0);
				margin: auto;
				.iconfont {
					display: inline-block;
					text-align: center;
					font-size: 8rpx;
					border: 2rpx solid #fe6b00;
					width: 22rpx;
					height: 22rpx;
					line-height: 22rpx;
					border-radius: 50%;
				}
			}
		}
		.goods-item {
			margin-right: 20rpx;
			width: 208rpx;
			> view {
				padding-bottom: 20rpx;
			}
			height: auto;
			.discount {
				position: absolute;
				left: 0;
				bottom: 0;
				display: block;
				line-height: 26rpx;
				font-size: 18rpx;
				text-align: center;
				color: #ffc49a;
				min-width: 80rpx;
				height: 26rpx;
				background: linear-gradient(90deg, #646d79 0%, #1f2938 100%);
				border-radius: 0 10rpx 0 10rpx;
			}
			image {
				width: 208rpx;
				height: 208rpx;
				border-radius: 10rpx;
			}
			.goods-name {
				width: 208rpx;
				word-break: break-all;
				white-space: pre-wrap;
				line-height: 40rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #1c1c1d;
			}
			.goods-bot {
				display: flex;
				justify-content: space-between;
				overflow: hidden;
				.left {
					max-width: 180rpx;
					height: 44rpx;
					vertical-align: bottom;
					> text {
						&:nth-child(1) {
							font-size: 24rpx;
							color: #1e1f21;
							font-weight: 500;
						}
						&:nth-child(2) {
							line-height: 44rpx;
							font-size: 32rpx;
							font-weight: 500;
							color: #1e1f21;
							margin-right: 6rpx;
						}
						&:nth-child(3) {
							font-size: 24rpx;
							color: #ababaf;
							font-weight: 400;
							text-decoration: line-through;
						}
					}
				}
				.origin-num {
					min-width: 80rpx;
					height: 30rpx;
					line-height: 30rpx;
					background: #e5cda1;
					text-align: center;
					padding: 0 12rpx;
					border-radius: 20rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #343434;
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
				.dishes-count {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					font-size: 24rpx;
					line-height: 24rpx;
					span {
						padding: 0 10rpx;
					}
				}
				.count-plus {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 20rpx;
					color: #fff;
					text-align: center;
					border-radius: 50%;
					background: #999999;
					&.cant {
						background: #fe6b00;
					}
				}
			}
		}
	}
}
.bubble-box {
	width: 242rpx;
	height: 82rpx;
	border: 4rpx solid #fe6b00;
	border-radius: 100rpx;
	background: #fff;
	font-size: 28rpx;
	color: #fe6b00;
	line-height: 76rpx;
	text-align: center;
	position: relative;
	position: fixed;
	bottom: 200rpx;
	bottom: calc(220rpx + constant(safe-area-inset-bottom, 0));
	bottom: calc(220rpx + env(safe-area-inset-bottom, 0));
	right: 0;
	&::before {
		content: "";
		width: 0;
		height: 0;
		border: 20rpx solid;
		position: absolute;
		bottom: -40rpx;
		left: 140rpx;
		border-color: #fe6b00 transparent transparent;
	}
	&::after {
		content: "";
		width: 0;
		height: 0;
		border: 20rpx solid;
		position: absolute;
		bottom: -36rpx;
		left: 140rpx;
		border-color: #fff transparent transparent;
	}
	&.step-1 {
		width: 290rpx;
	}
	&.step-2 {
		width: 260rpx;
		right: 130rpx;
		&::before {
			left: 110rpx;
		}
		&::after {
			left: 110rpx;
		}
	}
	&.step-3 {
		width: 210rpx;
		left: 24rpx;
		&::before {
			left: 40rpx;
		}
		&::after {
			left: 40rpx;
		}
	}
}
.car-box {
	background: #fff;
	width: 100%;
	box-sizing: border-box;
	padding: 0 24rpx;
	height: 108rpx;
	position: fixed;
	bottom: 100rpx;
	bottom: calc(100rpx + constant(safe-area-inset-bottom, 0));
	bottom: calc(100rpx + env(safe-area-inset-bottom, 0));
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.car-left {
		flex: 1;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.image-box {
			position: relative;
			image {
				width: 118rpx;
				height: 98rpx;
			}
			text {
				position: absolute;
				top: 0;
				right: 5rpx;
				line-height: 28rpx;
				padding: 0rpx 10rpx;
				background: #ff3c3b;
				color: #fff;
				font-size: 20rpx;
				border: 4rpx solid #fff;
				border-radius: 50%;
			}
		}
		.price-con {
			flex: 1;
			width: 0;
			> view {
				&:first-of-type {
					> view {
						&:first-of-type {
							font-size: 36rpx;
							font-weight: 500;
							color: #1e1f21;
							line-height: 50rpx;
						}
						&:nth-of-type(2) {
							font-size: 24rpx;
							font-weight: 400;
							color: #ababaf;
							line-height: 34rpx;
							text-decoration: line-through;
						}
					}
				}
				&:nth-of-type(2) {
					font-size: 24rpx;
					font-weight: 400;
					color: #1e1f21;
					line-height: 34rpx;
				}
			}
		}
	}
	.car-right {
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		display: flex;
		justify-content: flex-end;
		.cancel-class {
			font-size: 28rpx;
			color: #ababaf;
		}
		.do-class {
			width: 160rpx;
			background: #fe6b00;
			&.cant {
				background: #999999;
			}
			color: #ffffff;
			border-radius: 36rpx;
		}
		button {
			border: 0;
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
			padding: 0;
			width: 160rpx;
			text-align: center;
			height: 72rpx;
		}
		view {
			width: 160rpx;
			text-align: center;
			height: 72rpx;
			line-height: 72rpx;
		}
		&.join {
			// flex: 2;
			color: #343434;
		}
		.button1 {
			// background: #fec000;
			// border-radius: 38rpx 4rpx 4rpx 38rpx;
			color: #fe6b00;
			margin-right: 6rpx;
			line-height: 72rpx;
		}
		.button2 {
			background: #fe6b00;
			border-radius: 38rpx;
			line-height: 72rpx;
		}
	}
}
.address-con {
	background: #fff;
	width: 100%;
	// padding: 0rpx 24rpx;
	box-sizing: border-box;
	.bold {
		font-weight: bold;
	}
	.address-box {
		.nav-head {
			padding-left: 24rpx;
			width: 284px;
			height: auto;
			border-bottom: 0rpx;
			border-bottom: 2rpx solid #f6f6f7;
			background: #fff;
			position: relative;
			.navi-box {
				padding-left: 0rpx;
				font-size: 32rpx;
				color: #fe6b00;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.icondingwei {
					margin-right: 10rpx;
					font-size: 36rpx;
				}
				.iconxialacopy {
					margin-top: 10rpx;
					font-size: 16rpx !important;
					color: #fe6b00;
				}
			}
		}
		.address-list {
			padding-top: 24rpx;
			.locstr {
				height: 40rpx;
				font-size: 28rpx;
				color: #ababaf;
				line-height: 40rpx;
			}
			.locadd {
				height: 44rpx;
				font-size: 32rpx;
				color: #1e1f21;
				line-height: 44rpx;
			}
			.address-item {
				width: 100%;
				padding: 20rpx 0 20rpx 0;
				margin-left: 68rpx;
				// margin-bottom: 24rpx;
				box-sizing: border-box;
				background: #ffffff;
				border-radius: 10rpx;
				border-bottom: 2rpx solid #f1f1f4;
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 184rpx;
				.address-left {
					.span-style {
						display: inline-block;
						width: 52rpx;
						height: 30rpx;
						line-height: 30rpx;
						text-align: center;
						background: #ecf6ff;
						border-radius: 4rpx;
						font-size: 20rpx;
					}
					.span-style-y {
						background: rgba(229, 205, 161, 0.3);
						color: #e5cda1;
					}
					.span-style-g {
						background: rgba(0, 142, 255, 0.3);
						color: #008eff;
					}
					.span-style-r {
						background: rgba(236, 20, 20, 0.3);
						color: #ec1414;
					}
					.span-style-b {
						background: rgba(254, 194, 13, 0.3);
						color: #fec20d;
					}
					> view {
						&:nth-child(1) {
							font-size: 32rpx;
							color: #1e1f21;
							line-height: 48rpx;
							margin-bottom: 4rpx;
							font-weight: bold;
						}
						&:nth-child(2) {
							font-size: 28rpx;
							font-weight: 400;
							color: #ababaf;
							line-height: 40rpx;
							> text {
								&:nth-child(1) {
									margin-right: 20rpx;
								}
							}
						}
					}
				}
			}
		}
	}
	.but-add {
		padding-left: 68rpx;
		width: 100%;
		line-height: 100rpx;
		background: #ffffff;
		color: #fe6b00;
		font-size: 32rpx;
	}
}
</style>
