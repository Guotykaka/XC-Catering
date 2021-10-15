import { axiosGet, axiosPostJson, axiosPost } from "@/utils/api";
import { URL } from "@/utils/api";

export function getRemarkLabel(query) {
	//订单备注标签
	return axiosGet(`${URL}/biz/weixin/order/remark/label`, query);
}
export function orderDetail(query) {
	//订单详情
	return axiosGet(`${URL}/biz/weixin/order/detail`, query);
}
export function orderCancel(query) {
	//取消订单
	return axiosPostJson(`${URL}/biz/weixin/order/cancel`, query);
}
export function orderRefund(query) {
	//订单申请退款
	return axiosPostJson(`${URL}/biz/weixin/order/refund`, query);
}
export function orderEvaluate(query) {
	//订单评价
	return axiosPostJson(`${URL}/biz/weixin/order/dvaluate`, query);
}
export function payOrder(query, header) {
	///pay/order 小程序订单下单
	return axiosPostJson(`${URL}/biz/weixin/pay/order`, query, header);
}
export function createAccount(query) {
	// 创建账户
	return axiosPostJson(`${URL}/biz/weixin/userAccount/createAccount`, query);
}
export function rechargeList(query) {
	//分页查询活动(满减和充值)
	return axiosGet(`${URL}/biz/weixin/activity/selectRechargeList`, query);
}
export function recharge(query) {
	//充值
	return axiosPostJson(`${URL}/biz/weixin/userAccount/recharge`, query);
}
export function updateOrderMsg(query) {
	return axiosPostJson(`${URL}/biz/weixin/order/update`, query);
}
export function storeEvaluate(query) {
	///获取店铺下的评价
	return axiosGet(`${URL}/biz/weixin/shop/get/evaluate`, query);
}
export function getRechargeRecord(query) {
	///查询充值记录
	return axiosGet(`${URL}/biz/weixin/userAccount/queryTransPage`, query);
}
export function getUserBalance(query) {
	///查询账户余额
	return axiosGet(`${URL}/biz/weixin/userAccount/selectUserBalance`, query);
}
// export function getBanner(query) {
// 	//banner列表
// 	return axiosPostJson(`${URL}/biz/weixin/banner/bannerShowList`, query);
// }
export function getBanner(query) {
	//banner列表
	return axiosPost(`${URL}/biz/weixin/banner/bannerShowListNew`, query);
}
export function refundCancel(query) {
	//取消申请退款
	return axiosPostJson(`${URL}/biz/weixin/order/cancel/refund`, query);
}
export function takeMeal(query) {
	//商家/客户 取餐
	return axiosPostJson(`${URL}/biz/weixin/order/take/meal`, query);
}
export function getRange(query) {
	//获取地址距离
	return axiosGet(`${URL}/biz/weixin/address/range`, query);
}
export function getLocation(query) {
	//获取坐标
	return axiosGet(`${URL}/biz/weixin/location/get`, query);
}
// export function getPackageFee(query) {//获取包装费
// 	return axiosGet(`${URL}/biz/weixin/order/get/packageFee`, query);
// }
export function getRiderLocation(query) {
	//达达骑手坐标
	return axiosGet(`${URL}/biz/weixin/location/dada/location`, query);
}
export function getPromotion(query) {
	//地推
	return axiosGet(`${URL}/biz/weixin/recommend/add/${query.query}`);
}

export function selectOrderPayRedPacketCount(query) {
	//查询支付红包数量
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectOrderPayRedPacketCount`, query);
}

export function selectOrderPayRedPacketList(query) {
	//查询支付领取的红包
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectOrderPayRedPacketList`, query);
}
export function justPay(query) {
	//买单
	return axiosPostJson(`${URL}/biz/weixin//order/create/buy`, query);
}
