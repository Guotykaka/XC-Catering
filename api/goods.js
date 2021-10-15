import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function getGoodsList(query) {
	//菜品列表
	return axiosGet(`${URL}/biz/weixin/goods/list`, query);
}
export function getGoodsDetail(query) {
	//菜品详情
	return axiosGet(`${URL}/biz/weixin/goods/detail`, query);
}
export function saveCart(query) {
	//保存购物车
	return axiosPostJson(`${URL}/biz/weixin/shopping/save`, query);
}
export function getCart(query) {
	//获取购物车
	return axiosGet(`${URL}/biz/weixin/shopping/get`, query);
}
export function deleteCart(query) {
	//清空购物车
	return axiosPost(`${URL}/biz/weixin/shopping/delete`, query);
}
export function selectUserHistoryRedPacketRecord(query) {
	//查询用户历史红包
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserHistoryRedPacketRecord`, query);
}
export function newRedP(query) {
	// 领取新人红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeNewPersonRedPacket`, query);
}
export function getRedP(query) {
	// 用户领取红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeRedPacket`, query);
}
export function getRedPCount(query) {
	// 查询用户红包数量
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacketRecordCount`, query);
}
export function getRedPCount_01(query) {
	// 查询用户红包数量
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacketRecordCount_01`, query);
}
export function defaultAddr(query) {
	// 获取常用收货地址
	return axiosGet(`${URL}/biz/weixin/address/get/default`, query);
}
export function queryAreaList(query) {
	//查询省市区
	return axiosPost(`${URL}/biz/weixin/address/queryAreaList`, query);
}
export function saveOrder(query) {
	//下单生成订单
	return axiosPostJson(`${URL}/biz/weixin/order/customer/save`, query);
}
export function queryUserInfo(query) {
	//查询用户
	return axiosGet(`${URL}/biz/weixin/wxuser/userInfo`, query);
}
export function postUserInfo(query) {
	//绑定用户信息
	return axiosPost(`${URL}/biz/weixin/wxuser/getUserInfo`, query);
}
export function postUpdateUser(query) {
	//绑定用户信息1
	return axiosPostJson(`${URL}/biz/weixin/wxuser/updateUser`, query);
}
export function getOrderList(query) {
	//分页获取订单列表
	return axiosGet(`${URL}/biz/weixin/order/get/list`, query);
}
export function getShareList(query) {
	//获取分享活动
	return axiosGet(`${URL}/biz/weixin/share/redPacket/orderId`, query);
}
export function postShareCoupon(query) {
	//领取分享券
	return axiosGet(`${URL}/biz/weixin/share/redPacket/acquire`, query);
}

export function getEvaluateList(query) {
	return axiosGet(`${URL}/biz/weixin/goods/evaluate/page`, query);
}

export function getGoodsType(query) {
	//获取档口的菜品分类
	return axiosGet(`${URL}/biz/weixin/goods-type/get/byShopId`, query);
}

export function getRecommendList(query) {
	//获取菜品推荐列表
	return axiosGet(`${URL}/biz/weixin/goods/recommend`, query);
}

export function getGoodsEvaluateCount(query) {
	//获取菜品评价数量
	return axiosGet(`${URL}/biz/weixin/goods/get/evaluate/count`, query);
}
export function getInxDiscountGoods(query) {
	//特价活动菜品PC列表
	return axiosGet(`${URL}/biz/weixin/cheap/activity/wednesday/goods/list`, query);
}
export function getfeaturedGoods(query) {
	//查询拼餐精选套餐
	return axiosGet(`${URL}/biz/weixin/cheap/activity/selectGroupGoodsInfo2`, query);
}
