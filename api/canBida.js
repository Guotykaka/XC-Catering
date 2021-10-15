import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function canGet(query) {
	// 获取拼单
	return axiosGet(`${URL}/biz/weixin/cbd/get`, query);
}
export function canCreat(query) {
	// 创建拼单
	return axiosPostJson(`${URL}/biz/weixin/cbd/create`, query);
}
export function canCancel(query) {
	// 取消拼单
	// 餐必达ID
	// cbdId *
	// userId *
	return axiosGet(`${URL}/biz/weixin/cbd/cancel`, query);
}
export function canDetail(query) {
	// 拼单详情
	// cbdId *
	// userId *
	return axiosGet(`${URL}/biz/weixin/cbd/detail`, query);
}
export function canSettle(query) {
	// 结算拼单
	// cbdId *
	// userId *
	return axiosGet(`${URL}/biz/weixin/cbd/settlement`, query);
}
export function canTake(query) {
	// 参与拼单
	// cbdId *
	// userId *
	return axiosGet(`${URL}/biz/weixin/cbd/take`, query);
}
export function canOrder(query) {
	// 下单生成订单
	return axiosPostJson(`${URL}/biz/weixin/cbd/order/save`, query);
}
export function canGetCart(query) {
	// 餐必达-获取购物车
	//activityId storeId
	return axiosGet(`${URL}/biz/weixin/shopping/cbd/get`, query);
}
export function canSaveCart(query) {
	// 餐必达-保存购物车
	return axiosPostJson(`${URL}/biz/weixin/shopping/cbd/save`, query);
}
export function canDelCart(query) {
	// 餐必达-清空购物车
	return axiosGet(`${URL}/biz/weixin/shopping/cbd/delete`, query);
}
export function canSelect(query) {
	// 查询团购活动
	return axiosGet(`${URL}/biz/weixin/cheap/activity/selectGroupActivity`, query);
}
export function canGoods(query) {
	// 查询团购活动菜
	return axiosGet(`${URL}/biz/weixin/cheap/activity/selectGroupGoodsInfoList`, query);
}
export function canCoupon(query) {
	//餐必达红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeRedPacket_04`, query);
}
export function canActDetail(query) {
	//餐必达查询活动详情
	return axiosGet(`${URL}/biz/weixin/activity/selectActivityDetailById/${query.id}`, {});
}
export function canRules(query) {
	//餐必达规则详情
	return axiosGet(`${URL}/biz/weixin/activity/selectActivityById_02/${query.id}`, {});
}
export function canUpdate(query) {
	//修改拼单地址
	return axiosGet(`${URL}/biz/weixin/cbd/update/address`, query);
}
