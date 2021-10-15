import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

//获取餐典币和7日签到信息
export function getSignWeek(query) {
	return axiosGet(`${URL}/biz/weixin/cdb/signin/get`, query);
}
//获取餐典币记录
export function logList(query) {
	return axiosGet(`${URL}/biz/weixin/cdb/get/log`, query);
}
//签到
export function cdbsign(query, header) {
	return axiosGet(`${URL}/biz/weixin/cdb/signin`, query, header);
}
//获取月签到信息
export function cdbmonth(query) {
	return axiosGet(`${URL}/biz/weixin/cdb/signin/get/month`, query);
}
//获取兑换红包列表
export function cdbredPlist(query) {
	return axiosGet(`${URL}/biz/weixin/cdb/exchange/redPacket/list`, query);
}
//查询会员等级和餐典币
export function getMemberLevel(query) {
	return axiosGet(`${URL}/biz/weixin/customer/get/level`, query);
}
//查询会员门店特价菜
export function getMemberGoods(query) {
	return axiosGet(`${URL}/biz/weixin/customer/get/store/goods`, query);
}
//获取配置列表
export function getMemberSettings(query) {
	return axiosGet(`${URL}/biz/weixin/customer/level/list`, query);
}
//餐典币兑换红包
export function cdbredPconvert(query, header) {
	return axiosGet(`${URL}/biz/weixin/cdb/exchange/redPacket`, query, header);
}
//查询团购卡列表
export function levelCardList(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectGroupCardList`, query);
}
//查询团购卡详情
export function levelCardDetail(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectGroupCard`, query);
}
//查询用户是否开通团购卡
export function levelCardStatus(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectUserGroupCard`, query);
}
//团购卡购买
export function buyCard(query) {
	return axiosPostJson(`${URL}/biz/weixin/groupCard/groupCardBuy`, query);
}
//查询周三优惠团购卡
export function getDiscountCard(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectGroupCardActivity`, query);
}
//查询激活团购卡信息
export function getFreeCard(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectActivateGroupCard`, query);
}
//激活团购卡
export function setFreeCard(query) {
	return axiosPostJson(`${URL}/biz/weixin/groupCard/activateGroupCard`, query);
}
//查询首页月卡信息
export function getIndexCard(query) {
	return axiosGet(`${URL}/biz/weixin/groupCard/selectUserMonthCardInfo`, query);
}


// 获取当前会员是第几单
export function getOrderCount(query) {
	return axiosGet(`${URL}/biz/weixin/customer/get/order/count`, query);
}
