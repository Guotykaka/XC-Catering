import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function getSelectShopPage(query) {
	//获取门店所有店铺列表
	return axiosGet(`${URL}/biz/weixin/shop/selectShopList`, query);
}
export function getSelectShop(query) {
	//获取门店所有店铺列表(外卖)
	return axiosGet(`${URL}/biz/weixin/shop/selectShopListByPage`, query);
	// return axiosGet(`${URL}/biz/weixin/shop/selectShopList_01`,query)
}

export function selectShopActivity(query) {
	//获取当前门店店铺参与活动
	return axiosGet(`${URL}/biz/weixin/activity/selectShopActivity`, query);
}

export function selectUserRedPacketList(query) {
	//查询用户可用红包(优惠券列表)
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacketList`, query);
}
export function selectUserRedPacketList_01(query) {
	//下单平台券
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacketList_01_2`, query);
}
export function selectRedPacket_shop(query) {
	//下单商家券
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacketRecordList_02_01`, query);
}

export function selectUserRedPacket(query) {
	//获取首页平台红包
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacket_02`, query);
}
export function userTakeRedPacket(query) {
	//领取首页平台红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/userTakeRedPacket_01`, query);
}
export function isNewUser(query) {
	//是否新客
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/isNewUser`, query);
}
export function getShippings(query) {
	//获取门店下所有店铺的购物车数量
	return axiosGet(`${URL}/biz/weixin/shop/get/shipping/count`, query);
}
export function selectShopRedPacket(query) {
	//获取店铺优惠券列表
	return axiosGet(`${URL}/biz/weixin/redPacket/selectShopRedPacket_01`, query);
}

export function getNotice(query) {
	//消息列表
	return axiosGet(`${URL}/biz/weixin/notice/page`, query);
}
export function collectOrder(query) {
	//获取店铺集单分享
	return axiosGet(`${URL}/biz/weixin/redPacketGather/shopId`, query);
}
export function selectMealDate(query) {
	//获取购买时间
	return axiosGet(`${URL}/biz/weixin/shop/selectShopDay`, query);
}
export function selectMealTime(query) {
	//获取购买时间
	return axiosGet(`${URL}/biz/weixin/shop/selectShopTime`, query);
}
export function selectShopById(query) {
	//获取购买时间
	return axiosGet(`${URL}/biz/weixin/shop/selectShopById/${query.id}`);
}

export function selectShopTypeList(query) {
	//查询店铺分类
	return axiosGet(`${URL}/biz/weixin/shop/selectShopTypeList`, query);
}

export function selectShopInfo(query) {
	//获取档口信息
	return axiosGet(`${URL}/biz/weixin/shop/selectShop_02`, query);
}
export function shopPayment(query) {
	//获取档口是否可以直接付款
	return axiosGet(`${URL}/biz/weixin/shop/selectPaymentStatus`, query);
}
export function doCollect(query) {
	//收藏
	return axiosPostJson(`${URL}/biz/weixin/shopCollect/addCollect`, query);
}
export function selectShopRecommendList(query) {
	//获取店铺推荐列表
	return axiosGet(`${URL}/biz/weixin/shopRecommend/selectShopRecommendList`, query);
}

export function getEvaluateCount(query) {
	return axiosGet(`${URL}/biz/weixin/shop/get/evaluate/count`, query);
}

export function selectUserShopRecordByPage(query) {
	return axiosGet(`${URL}/biz/weixin/shop/selectUserShopRecordByPage`, query);
}
