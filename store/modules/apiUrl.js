import { authUrl, loginByPhone, getUserPhone, getLoginMsgCode, loginByPhoneAndCode, authCoupon, flagShopTab, rechargeUrl } from "@/api/login";
import { getStore, getStoreList, selectStoreForHistory, searchStore } from "@/api/store";
import {
	selectGroupStoreList,
	selectMakeUpList,
	selectMakeUpList2,
	getMakeUpCart,
	saveMakeUpCart,
	deleteMakeUpCart,
	getGroup,
	cancelGroup,
	createGroup,
	takeGroup,
	settleMent,
	groupDetail,
	saveGroupOrder,
	groupRecmdUserType,
	groupOrderDetail,
	applyGroupRecommend,
	savePromoters,
	selectGroupTicket,
	selectRecommendAccount,
	selectRecommendOrderSum,
	saveAAOrder,
	selectRecommendOrderAgentSum,
	selPdRecord,
	getPdId,
	updatePdAddress,
	takeRedPacketPin,
	getPdGuide,
	getIconList,
	getPdPopup,
	getPdBill,
	postPdAdd,
	handpickList,
	getShopRecommend,
} from "@/api/treat";
import {
	getShareAuth,
	postShareAuth,
	getShareAuthPacket,
	getShareAuthDetail,
	getSelectedRedPacket,
	getShareOrderDetail,
	getShareHelpDetail,
	postInviteShare,
	getInviteHistory,
	getShareOrderRedPacket,
	setShareOrder,
	setInviteShare,
	getEveryCoupons,
	selectOrderActivity,
	ordersRedPacket,
	getOrdersRedPacket,
	selectUserRedPacket_03,
} from "@/api/redPacket"; //红包相关
import {
	getSelectShopPage,
	getSelectShop,
	selectShopActivity,
	selectUserRedPacketList,
	selectUserRedPacketList_01,
	selectRedPacket_shop,
	selectShopRedPacket,
	selectShopTypeList,
	selectShopInfo,
	shopPayment,
	selectUserRedPacket,
	userTakeRedPacket,
	isNewUser,
	getShippings,
	collectOrder,
	selectMealDate,
	selectMealTime,
	selectShopById,
	doCollect,
	selectShopRecommendList,
	getEvaluateCount,
	selectUserShopRecordByPage,
} from "@/api/shop";
import {
	getGoodsList,
	saveCart,
	deleteCart,
	getCart,
	getGoodsDetail,
	newRedP,
	getRedP,
	defaultAddr,
	queryAreaList,
	saveOrder,
	queryUserInfo,
	postUserInfo,
	postUpdateUser,
	getOrderList,
	getRedPCount,
	getRedPCount_01,
	selectUserHistoryRedPacketRecord,
	getShareList,
	postShareCoupon,
	getGoodsType,
	getRecommendList,
	getVolumeList,
	getEvaluateList,
	getGoodsEvaluateCount,
	getInxDiscountGoods,
	getfeaturedGoods,
} from "@/api/goods";
import { getAddressList, saveAddress, selectAddress, getAddressById, updateAddress, deleteAddress, getNotice, updateStatus, getUnReadCount, takeRedPacket, getShoppingCar, delShoppingCar, getSelectCollectList, getPdList, rechargeGet } from "@/api/user.js";
import {
	getRemarkLabel,
	orderDetail,
	orderCancel,
	payOrder,
	orderRefund,
	orderEvaluate,
	createAccount,
	rechargeList,
	recharge,
	storeEvaluate,
	updateOrderMsg,
	getRechargeRecord,
	getUserBalance,
	refundCancel,
	getBanner,
	takeMeal,
	getRange,
	getRiderLocation,
	getLocation,
	getPromotion,
	// getPackageFee,
	selectOrderPayRedPacketCount,
	selectOrderPayRedPacketList,
	justPay,
} from "@/api/order.js";
import { getSignWeek, logList, cdbsign, cdbmonth, cdbredPlist, cdbredPconvert, getMemberLevel, getMemberGoods, getMemberSettings, levelCardList, levelCardDetail, levelCardStatus, buyCard, getDiscountCard, getFreeCard, setFreeCard, getIndexCard, getOrderCount } from "@/api/sign.js";
import { canCreat, canCancel, canDetail, canSettle, canTake, canGetCart, canSaveCart, canSelect, canGoods, canDelCart, canGet, canCoupon, canOrder, canActDetail, canUpdate, canRules } from "@/api/canBida";
import { getChains, getChainsInfo, getChainsShops, getChainsBein, getChainsSeen, getChainsCart, saveChainsCart, creatChains, delChainsCart, chainsPurchaseRecord, chainsRecord, chainsRefound, chainsCancel } from "@/api/chains";
import { getToken, getObjType } from "@/utils";
import { URL } from "@/utils/api";
const account = {
	state: {},
	mutations: {},
	actions: {
		//Auth
		async AuthUrl({ dispatch, commit }, params) {
			let res = await authUrl(params);
			return res;
		},
		//获取验证码
		async GetLoginMsgCode({ dispatch, commit }, params) {
			let res = await getLoginMsgCode(params);
			return res;
		},
		//账号验证码登录
		async loginByPhoneAndCode({ dispatch, commit }, params) {
			let res = await loginByPhoneAndCode(params);
			return res;
		},
		//账号密码登录
		async LoginByPhone({ dispatch, commit }, params) {
			let res = await loginByPhone(params);
			return res;
		},
		//微信登录
		async GetUserPhone({ dispatch, commit }, params) {
			let res = await getUserPhone(params);
			return res;
		},
		//获取当前门店信息
		async GetStore({ dispatch, commit }, params) {
			let res = await getStore(params);
			return res;
		},
		//获取就近门店
		async GetStoreList({ dispatch, commit }, params) {
			let res = await getStoreList(params);
			return res;
		},
		//获取去过的店
		async SelectStoreForHistory({ dispatch, commit }, params) {
			let res = await selectStoreForHistory(params);
			return res;
		},
		//获取当前门店店铺分页查询信息
		async GetSelectShopPage({ dispatch, commit }, params) {
			let res = await getSelectShopPage(params);
			return res;
		},
		//获取当前门店店铺分页查询信息
		async GetSelectShop({ dispatch, commit }, params) {
			let res = await getSelectShop(params);
			return res;
		},
		//获取当前门店店铺分页查询信息
		async SelectShopActivity({ dispatch, commit }, params) {
			let res = await selectShopActivity(params);
			return res;
		},

		//获取当前门店店铺分页查询信息
		async GetGoodsList({ dispatch, commit }, params) {
			let res = await getGoodsList(params);
			return res;
		},
		//菜品详情
		async GetGoodsDetail({ dispatch, commit }, params) {
			let res = await getGoodsDetail(params);
			return res;
		},
		//保存购物车
		async SaveCart({ dispatch, commit }, params) {
			let res = await saveCart(params);
			return res;
		},
		//
		async DeleteCart({ dispatch, commit }, params) {
			let res = await deleteCart(params);
			return res;
		},
		//
		async GetCart({ dispatch, commit }, params) {
			let res = await getCart(params);
			return res;
		},
		//新人用户红包
		async NewRedP({ dispatch, commit }, params) {
			let res = await newRedP(params);
			return res;
		},
		//获取新人用户红包
		async GetRedP({ dispatch, commit }, params) {
			let res = await getRedP(params);
			return res;
		},
		//查询用户可用红包
		async SelectUserRedPacketList({ dispatch, commit }, params) {
			let res = await selectUserRedPacketList(params);
			return res;
		},
		//下单商家券
		async SelectRedPacket_shop({ dispatch, commit }, params) {
			let res = await selectRedPacket_shop(params);
			return res;
		},
		//查询用户可用红包
		async SelectUserRedPacketList_01({ dispatch, commit }, params) {
			let res = await selectUserRedPacketList_01(params);
			return res;
		},
		//查询商户优惠券列表
		async SelectShopRedPacket({ dispatch, commit }, params) {
			let res = await selectShopRedPacket(params);
			return res;
		},
		//查询首页平台红包
		async SelectUserRedPacket({ dispatch, commit }, params) {
			let res = await selectUserRedPacket(params);
			return res;
		},
		//领取首页平台红包
		async UserTakeRedPacket({ dispatch, commit }, params) {
			let res = await userTakeRedPacket(params);
			return res;
		},
		//是否新人
		async IsNewUser({ dispatch, commit }, params) {
			let res = await isNewUser(params);
			return res;
		},
		//获取门店下所有店铺的购物车数量
		async GetShippings({ dispatch, commit }, params) {
			let res = await getShippings(params);
			return res;
		},
		//获取地址列表
		async GetAddressList({ dispatch, commit }, params) {
			let res = await getAddressList(params);
			return res;
		},
		//新增地址
		async SaveAddress({ dispatch, commit }, params) {
			let res = await saveAddress(params);
			return res;
		},
		//选择收货地址
		async SelectAddress({ dispatch, cpmmit }, params) {
			let res = await selectAddress(params);
			return res;
		},
		//修改地址
		async UpdateAddress({ dispatch, commit }, params) {
			let res = await updateAddress(params);
			return res;
		},
		//通过id删除地址
		async DeleteAddress({ dispatch, commit }, params) {
			let res = await deleteAddress(params);
			return res;
		},
		//通过地址id获取地址详细信息
		async GetAddressById({ dispatch, commit }, params) {
			let res = await getAddressById(params);
			return res;
		},
		//获取常用收货地址
		async DefaultAddr({ dispatch, commit }, params) {
			let res = await defaultAddr(params);
			return res;
		},
		//省市区
		async QueryAreaList({ dispatch, commit }, params) {
			let res = await queryAreaList(params);
			return res;
		},
		//下单生成订单
		async SaveOrder({ dispatch, commit }, params) {
			let res = await saveOrder(params);
			return res;
		},
		//查询用户
		async QueryUserInfo({ dispatch, commit }, params) {
			let res = await queryUserInfo(params);
			return res;
		},
		//绑定用户信息
		async PostUserInfo({ dispatch, commit }, params) {
			let res = await postUserInfo(params);
			return res;
		},
		//绑定用户信息1
		async PostUpdateUser({ dispatch, commit }, params) {
			let res = await postUpdateUser(params);
			return res;
		},
		//分页获取订单列表
		async GetOrderList({ dispatch, commit }, params) {
			let res = await getOrderList(params);
			return res;
		},
		//查询历史红包
		async SelectUserHistoryRedPacketRecord({ dispatch, commit }, params) {
			let res = await selectUserHistoryRedPacketRecord(params);
			return res;
		},
		//pay
		async PayOrder({ dispatch, commit }, params) {
			let { orderId, payType } = params;
			let res = await payOrder({ orderId, payType }, params.header);
			return res;
		},
		//订单详情
		async OrderDetail({ dispatch, commit }, params) {
			let res = await orderDetail(params);
			return res;
		},
		//订单取消
		async OrderCancel({ dispatch, commit }, params) {
			let res = await orderCancel(params);
			return res;
		},
		//订单评价
		async OrderEvaluate({ dispatch, commit }, params) {
			let res = await orderEvaluate(params);
			return res;
		},
		//订单退款
		async OrderRefund({ dispatch, commit }, params) {
			let res = await orderRefund(params);
			return res;
		},
		//修改订单信息
		async UpdateOrderMsg({ dispatch, commit }, params) {
			let res = await updateOrderMsg(params);
			return res;
		},
		//充值余额
		async CreateAccount({ dispatch, commit }, params) {
			let res = await createAccount(params);
			return res;
		},
		//获取标签页的备注
		async GetRemarkLabel({ dispatch, commit }, params) {
			let res = await getRemarkLabel(params);
			return res;
		},
		//获取红包数量
		async GetRedPCount({ dispatch, commit }, params) {
			let res = await getRedPCount(params);
			return res;
		},
		//获取红包数量
		async GetRedPCount_01({ dispatch, commit }, params) {
			let res = await getRedPCount_01(params);
			return res;
		},
		//充值列表
		async RechargeList({ dispatch, commit }, params) {
			let res = await rechargeList(params);
			return res;
		},
		//充值
		async Recharge({ dispatch, commit }, params) {
			let res = await recharge(params);
			return res;
		},
		//店铺评价
		async StoreEvaluate({ dispatch, commit }, params) {
			let res = await storeEvaluate(params);
			return res;
		},

		//充值记录
		async GetRechargeRecord({ dispatch, commit }, params) {
			let res = await getRechargeRecord(params);
			return res;
		},
		//查询账户余额
		async GetUserBalance({ dispatch, commit }, params) {
			let res = await getUserBalance(params);
			return res;
		},
		async RefundCancel({ dispatch, commit }, params) {
			let res = await refundCancel(params);
			return res;
		},
		//banner列表
		async GetBanner({ dispatch, commit }, params) {
			let res = await getBanner(params);
			return res;
		},
		//消息通知列表
		async GetNotice({ dispatch, commit }, params) {
			let res = await getNotice(params);
			return res;
		},
		//查询未读消息条数
		async GetUnReadCount({ dispatch, commit }, params) {
			let res = await getUnReadCount(params);
			return res;
		},
		//更新已读未读状态
		async UpdateStatus({ dispatch, commit }, params) {
			let res = await updateStatus(params);
			return res;
		},
		async TakeRedPacket({ dispatch, commit }, params) {
			let res = await takeRedPacket(params);
			return res;
		},
		//获取分享活动
		async GetShareList({ dispatch, commit }, params) {
			let res = await getShareList(params);
			return res;
		},
		//领取分享券
		async PostShareCoupon({ dispatch, commit }, params) {
			let res = await postShareCoupon(params);
			return res;
		},
		//商家/客户 取餐
		async TakeMeal({ dispatch, commit }, params) {
			let res = await takeMeal(params);
			return res;
		},
		//获取地址距离
		async GetRange({ dispatch, commit }, params) {
			let res = await getRange(params);
			return res;
		},
		//获取档口的菜品分类
		async GetGoodsType({ dispatch, commit }, params) {
			let res = await getGoodsType(params);
			return res;
		},
		//获取档口菜品推荐列表
		async GetRecommendList({ dispatch, commit }, params) {
			let res = await getRecommendList(params);
			return res;
		},
		//档口菜品热销列表
		async GetVolumeList({ dispatch, commit }, params) {
			let res = await getVolumeList(params);
			return res;
		},
		//档口菜品类型列表
		async SelectShopTypeList({ dispatch, commit }, params) {
			let res = await selectShopTypeList(params);
			return res;
		},
		//档口信息
		async SelectShopInfo({ dispatch, commit }, params) {
			let res = await selectShopInfo(params);
			return res;
		},
		//
		async ShopPayment({ dispatch, commit }, params) {
			let res = await shopPayment(params);
			return res;
		},
		//骑手位置
		async GetLocation({ dispatch, commit }, params) {
			let res = await getLocation(params);
			return res;
		},
		//骑手位置
		async GetRiderLocation({ dispatch, commit }, params) {
			let res = await getRiderLocation(params);
			return res;
		},
		//地推
		async GetPromotion({ dispatch, commit }, params) {
			let res = await getPromotion(params);
			return res;
		},
		//ID查店详情
		async SearchStore({ dispatch, commit }, params) {
			let res = await searchStore(params);
			return res;
		},
		// //获取餐盒费
		// async GetPackageFee({ dispatch, commit }, params) {
		// 	let res = await getPackageFee(params);
		// 	return res;
		// },
		//查询下单返券数量
		async SelectOrderPayRedPacketCount({ dispatch, commit }, params) {
			let res = await selectOrderPayRedPacketCount(params);
			return res;
		},
		//下单返券列表
		async SelectOrderPayRedPacketList({ dispatch, commit }, params) {
			let res = await selectOrderPayRedPacketList(params);
			return res;
		},
		//直接买单
		async JustPay({ dispatch, commit }, params) {
			let res = await justPay(params);
			return res;
		},
		//检查当前用户运营分享权限
		async GetShareAuth({ dispatch, commit }, params) {
			let res = await getShareAuth(params);
			return res;
		},
		//运营分享
		async PostShareAuth({ dispatch, commit }, params) {
			let res = await postShareAuth(params);
			return res;
		},
		//领取运营分享券
		async GetShareAuthPacket({ dispatch, commit }, params) {
			let { channel, shareOperationId } = params;
			let res = await getShareAuthPacket({ channel, shareOperationId }, params.header);
			return res;
		},
		//运营分享活动详情
		async GetShareAuthDetail({ dispatch, commit }, params) {
			let res = await getShareAuthDetail(params);
			return res;
		},
		//获取分享活动
		async SetShareOrder({ dispatch, commit }, params) {
			let res = await setShareOrder(params);
			return res;
		},
		//领取随机分享
		async GetShareOrderRedPacket({ dispatch, commit }, params) {
			let { channel, randomShareId } = params;
			let res = await getShareOrderRedPacket({ channel, randomShareId }, params.header);
			return res;
		},
		//下单分享活动详情
		async GetShareOrderDetail({ dispatch, commit }, params) {
			let res = await getShareOrderDetail(params);
			return res;
		},
		//助力活动详情
		async GetShareHelpDetail({ dispatch, commit }, params) {
			let res = await getShareHelpDetail(params);
			return res;
		},
		//助力红包分享
		async SetInviteShare({ dispatch, commit }, params) {
			let res = await setInviteShare({}, params.header);
			return res;
		},
		//帮助好友助力领红包
		async PostInviteShare({ dispatch, commit }, params) {
			let { channel, shareHelpId } = params;
			let res = await postInviteShare({ channel, shareHelpId }, params.header);
			return res;
		},
		//助力历史列表
		async GetInviteHistory({ dispatch, commit }, params) {
			let res = await getInviteHistory(params);
			return res;
		},
		//分享券token
		async AuthCoupon({ dispatch, commit }, params) {
			let res = await authCoupon(params);
			return res;
		},
		//查询选择的红包
		async GetSelectedRedPacket({ dispatch, commit }, params) {
			let res = await getSelectedRedPacket(params);
			return res;
		},
		//获取店铺集单分享
		async CollectOrder({ dispatch, commit }, params) {
			let res = await collectOrder(params);
			return res;
		},
		//首页是否展示商家tab
		async FlagShopTab({ dispatch, commit }, params) {
			let res = await flagShopTab(params);
			return res;
		},
		//获取购买时间
		async SelectMealTime({ dispatch, commit }, params) {
			let res = await selectMealTime(params);
			return res;
		},
		//获取购买时间
		async SelectMealDate({ dispatch, commit }, params) {
			let res = await selectMealDate(params);
			return res;
		},
		async GetEvaluateList({ dispatch, commit }, params) {
			let res = await getEvaluateList(params);
			return res;
		},
		async SelectShopById({ dispatch, commit }, params) {
			let res = await selectShopById(params);
			return res;
		},
		async DoCollect({ dispatch, commit }, params) {
			let res = await doCollect(params);
			return res;
		},
		async GetShoppingCar({ dispatch, commit }, params) {
			let res = await getShoppingCar(params);
			return res;
		},
		async DelShoppingCar({ dispatch, commit }, parmas) {
			let res = await delShoppingCar();
			return res;
		},
		async GetSelectCollectList({ dispatch, commit }, parmas) {
			let res = await getSelectCollectList(parmas);
			return res;
		},
		async RechargeGet({ dispatch, commit }, parmas) {
			let res = await rechargeGet(parmas);
			return res;
		},
		async SelectShopRecommendList({ dispatch, commit }, parmas) {
			let res = await selectShopRecommendList(parmas);
			return res;
		},
		//批量上传
		async BatchUpload({ dispatch, commit }, filePath) {
			let [err, res] = await uni.uploadFile({
				url: `${URL}/biz/weixin/file/upload`,
				filePath: filePath,
				name: "file",
				header: {
					"content-type": "application/x-www-form-urlencoded",
					token: getToken(),
				},
			});
			return res;
		},
		async GetEvaluateCount({ dispatch, commit }, params) {
			let res = await getEvaluateCount(params);
			return res;
		},
		async GetGoodsEvaluateCount({ dispatch, commit }, params) {
			let res = await getGoodsEvaluateCount(params);
			return res;
		},
		async SelectUserShopRecordByPage({ dispatch, commit }, params) {
			let res = await selectUserShopRecordByPage(params);
			return res;
		},
		async SelectGroupStoreList({ dispatch, commit }, params) {
			let res = await selectGroupStoreList(params);
			return res;
		},
		async SelectMakeUpList({ dispatch, commit }, params) {
			let res = await selectMakeUpList(params);
			return res;
		},
		async SelectMakeUpList2({ dispatch, commit }, params) {
			let res = await selectMakeUpList2(params);
			return res;
		},
		async GetMakeUpCart({ dispatch, commit }, params) {
			let res = await getMakeUpCart(params);
			return res;
		},
		async SaveMakeUpCart({ dispatch, commit }, params) {
			let res = await saveMakeUpCart(params);
			return res;
		},
		async DeleteMakeUpCart({ dispatch, commit }, params) {
			let res = await deleteMakeUpCart(params);
			return res;
		},
		async CreateGroup({ dispatch, commit }, params) {
			let res = await createGroup(params);
			return res;
		},
		async GetGroup({ dispatch, commit }, params) {
			let res = await getGroup(params);
			return res;
		},
		async CancelGroup({ dispatch, commit }, params) {
			let res = await cancelGroup(params);
			return res;
		},
		async TakeGroup({ dispatch, commit }, params) {
			let res = await takeGroup(params);
			return res;
		},
		async SettleMent({ dispatch, commit }, params) {
			let res = await settleMent(params);
			return res;
		},
		async GroupDetail({ dispatch, commit }, params) {
			let res = await groupDetail(params);
			return res;
		},
		async SaveGroupOrder({ dispatch, commit }, params) {
			let res = await saveGroupOrder(params);
			return res;
		},
		async GroupOrderDetail({ dispatch, commit }, params) {
			let res = await groupOrderDetail(params);
			return res;
		},
		async ApplyGroupRecommend({ dispatch, commit }, params) {
			let res = await applyGroupRecommend(params);
			return res;
		},
		async SavePromoters({ dispatch, commit }, params) {
			let res = await savePromoters(params);
			return res;
		},
		async GroupRecmdUserType({ dispatch, commit }, params) {
			let res = await groupRecmdUserType(params);
			return res;
		},
		async SelectGroupTicket({ dispatch, commit }, params) {
			let res = await selectGroupTicket(params);
			return res;
		},
		async SelectRecommendAccount({ dispatch, commit }, params) {
			let res = await selectRecommendAccount(params);
			return res;
		},
		async SelectRecommendOrderSum({ dispatch, commit }, params) {
			let res = await selectRecommendOrderSum(params);
			return res;
		},
		async SaveAAOrder({ dispatch, commit }, params) {
			let res = await saveAAOrder(params);
			return res;
		},
		async SelectRecommendOrderAgentSum({ dispatch, commit }, params) {
			let res = await selectRecommendOrderAgentSum(params);
			return res;
		},
		async SelPdRecord({ dispatch, commit }, params) {
			let res = await selPdRecord(params);
			return res;
		},
		async GetPdId({ dispatch, commit }, params) {
			let res = await getPdId(params);
			return res;
		},
		async UpdatePdAddress({ dispatch, commit }, params) {
			let res = await updatePdAddress(params);
			return res;
		},
		async TakeRedPacketPin({ dispatch, commit }, params) {
			let res = await takeRedPacketPin(params);
			return res;
		},
		async GetPdGuide({ dispatch, commit }, params) {
			let res = await getPdGuide(params);
			return res;
		},
		async GetIconList({ dispatch, commit }, params) {
			let res = await getIconList(params);
			return res;
		},
		async GetSignWeek({ dispatch, commit }, params) {
			let res = await getSignWeek(params);
			return res;
		},
		async LogList({ dispatch, commit }, params) {
			let res = await logList(params);
			return res;
		},
		async Cdbmonth({ dispatch, commit }, params) {
			let res = await cdbmonth(params);
			return res;
		},
		async Cdbsign({ dispatch, commit }, params) {
			let res = await cdbsign({}, params.header);
			return res;
		},
		async CdbredPlist({ dispatch, commit }, params) {
			let res = await cdbredPlist(params);
			return res;
		},
		async GetMemberLevel({ dispatch, commit }, params) {
			let res = await getMemberLevel(params);
			return res;
		},
		async GetMemberGoods({ dispatch, commit }, params) {
			let res = await getMemberGoods(params);
			return res;
		},
		async GetMemberSettings({ dispatch, commit }, params) {
			let res = await getMemberSettings(params);
			return res;
		},
		async CdbredPconvert({ dispatch, commit }, params) {
			let res = await cdbredPconvert(params.param, params.header);
			return res;
		},
		async LevelCardList({ dispatch, commit }, params) {
			let res = await levelCardList(params);
			return res;
		},
		async LevelCardDetail({ dispatch, commit }, params) {
			let res = await levelCardDetail(params);
			return res;
		},
		async LevelCardStatus({ dispatch, commit }, params) {
			let res = await levelCardStatus(params);
			return res;
		},
		async BuyCard({ dispatch, commit }, params) {
			let res = await buyCard(params);
			return res;
		},
		async GetPdPopup({ dispatch, commit }, params) {
			let res = await getPdPopup(params);
			return res;
		},
		async GetPdBill({ dispatch, commit }, params) {
			let res = await getPdBill(params);
			return res;
		},
		async PostPdAdd({ dispatch, commit }, params) {
			let res = await postPdAdd(params);
			return res;
		},
		async GetPdList({ dispatch, commit }, params) {
			let res = await getPdList(params);
			return res;
		},
		async GetInxDiscountGoods({ dispatch, commit }, params) {
			let res = await getInxDiscountGoods(params);
			return res;
		},
		async GetfeaturedGoods({ dispatch, commit }, params) {
			let res = await getfeaturedGoods(params);
			return res;
		},
		async GetEveryCoupons({ dispatch, commit }, params) {
			let res = await getEveryCoupons(params);
			return res;
		},
		async SelectOrderActivity({ dispatch, commit }, params) {
			let res = await selectOrderActivity(params);
			return res;
		},
		async OrdersRedPacket({ dispatch, commit }, params) {
			let res = await ordersRedPacket(params);
			return res;
		},
		async GetOrdersRedPacket({ dispatch, commit }, params) {
			let res = await getOrdersRedPacket(params);
			return res;
		},
		async GetDiscountCard({ dispatch, commit }, params) {
			let res = await getDiscountCard(params);
			return res;
		},
		async GetFreeCard({ dispatch, commit }, params) {
			let res = await getFreeCard(params);
			return res;
		},
		async SetFreeCard({ dispatch, commit }, params) {
			let res = await setFreeCard(params);
			return res;
		},
		async GetIndexCard({ dispatch, commit }, params) {
			let res = await getIndexCard(params);
			return res;
		},
		async GetOrderCount({ dispatch, commit }, params) {
			let res = await getOrderCount(params);
			return res;
		},
		async CanCreat({ dispatch, commit }, params) {
			let res = await canCreat(params);
			return res;
		},
		async CanCancel({ dispatch, commit }, params) {
			let res = await canCancel(params);
			return res;
		},
		async CanDetail({ dispatch, commit }, params) {
			let res = await canDetail(params);
			return res;
		},
		async CanSettle({ dispatch, commit }, params) {
			let res = await canSettle(params);
			return res;
		},
		async CanTake({ dispatch, commit }, params) {
			let res = await canTake(params);
			return res;
		},
		async CanGetCart({ dispatch, commit }, params) {
			let res = await getOrderCount(params);
			return res;
		},
		async CanSaveCart({ dispatch, commit }, params) {
			let res = await canSaveCart(params);
			return res;
		},
		async CanGetCart({ dispatch, commit }, params) {
			let res = await canGetCart(params);
			return res;
		},
		async CanSelect({ dispatch, commit }, params) {
			let res = await canSelect(params);
			return res;
		},
		async CanGoods({ dispatch, commit }, params) {
			let res = await canGoods(params);
			return res;
		},
		async CanDelCart({ dispatch, commit }, params) {
			let res = await canDelCart(params);
			return res;
		},
		async CanGet({ dispatch, commit }, params) {
			let res = await canGet(params);
			return res;
		},
		async CanCoupon({ dispatch, commit }, params) {
			let res = await canCoupon(params);
			return res;
		},
		async CanOrder({ dispatch, commit }, params) {
			let res = await canOrder(params);
			return res;
		},
		async CanActDetail({ dispatch, commit }, params) {
			let res = await canActDetail(params);
			return res;
		},
		async CanUpdate({ dispatch, commit }, params) {
			let res = await canUpdate(params);
			return res;
		},
		async CanRules({ dispatch, commit }, params) {
			let res = await canRules(params);
			return res;
		},
		async SelectUserRedPacket_03({ dispatch, commit }, parmas) {
			let res = await selectUserRedPacket_03(parmas);
			return res;
		},
		async GetChains({ dispatch, commit }, parmas) {
			let res = await getChains(parmas);
			return res;
		},
		async GetChainsInfo({ dispatch, commit }, parmas) {
			let res = await getChainsInfo(parmas);
			return res;
		},
		async GetChainsShops({ dispatch, commit }, parmas) {
			let res = await getChainsShops(parmas);
			return res;
		},
		async GetChainsBein({ dispatch, commit }, parmas) {
			let res = await getChainsBein(parmas);
			return res;
		},
		async GetChainsSeen({ dispatch, commit }, parmas) {
			let res = await getChainsSeen(parmas);
			return res;
		},
		async GetChainsCart({ dispatch, commit }, parmas) {
			let res = await getChainsCart(parmas);
			return res;
		},
		async SaveChainsCart({ dispatch, commit }, parmas) {
			let res = await saveChainsCart(parmas);
			return res;
		},
		async CreatChains({ dispatch, commit }, parmas) {
			let res = await creatChains(parmas);
			return res;
		},
		async DelChainsCart({ dispatch, commit }, parmas) {
			let res = await delChainsCart(parmas);
			return res;
		},
		async ChainsPurchaseRecord({ dispatch, commit }, parmas) {
			let res = await chainsPurchaseRecord(parmas);
			return res;
		},
		async ChainsRecord({ dispatch, commit }, parmas) {
			let res = await chainsRecord(parmas);
			return res;
		},
		async ChainsRefound({ dispatch, commit }, parmas) {
			let res = await chainsRefound(parmas);
			return res;
		},
		async ChainsCancel({ dispatch, commit }, parmas) {
			let res = await chainsCancel(parmas);
			return res;
		},
		async RechargeUrl({ dispatch, commit }, parmas) {
			let res = await rechargeUrl(parmas);
			return res;
		},
		async HandpickList({}, parmas) {
			let res = await handpickList(parmas);
			return res;
		},
		async GetShopRecommend({}, parmas) {
			let res = await getShopRecommend(parmas);
			return res;
		},
	},
};

export default account;
