import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function getChains(query) {
	// 获取接龙
	return axiosGet(`${URL}/biz/weixin/jl/activity/xcx/list`, query);
}
export function getChainsBein(query) {
	// 获取参与接龙
	return axiosGet(`${URL}/biz/weixin/jl/activity/xcx/buy/list`, query);
}
export function getChainsInfo(query) {
	// 获取接龙详情
	return axiosGet(`${URL}/biz/weixin/jl/activity/xcx/detail`, query);
}
export function getChainsShops(query) {
	// 获取接龙活动多店铺地址
	return axiosGet(`${URL}/biz/weixin/jl/activity/get/address`, query);
}
export function getChainsSeen(query) {
	// 获取接龙查看记录
	return axiosGet(`${URL}/biz/weixin/jl/activity/xcx/person/record`, query);
}
export function getChainsCart(query) {
	// 接龙-获取购物车
	return axiosGet(`${URL}/biz/weixin/shopping/jl/get`, query);
}
export function delChainsCart(query) {
	// 接龙-清空购物车
	return axiosGet(`${URL}/biz/weixin/shopping/jl/delete`, query);
}
export function creatChains(query) {
	// 接龙下单
	return axiosPostJson(`${URL}/biz/weixin/order/create/jl`, query);
}
export function saveChainsCart(query) {
	// 接龙-保存购物车
	return axiosPostJson(`${URL}/biz/weixin/shopping/jl/save`, query);
}
export function chainsPurchaseRecord(query) {
	// 接龙-小程序获取接龙详情参与记录
	return axiosGet(`${URL}/biz/weixin/jl/activity/xcx/detail/record`, query);
}
export function chainsRecord(query) {
	// 获取接龙记录详情
	return axiosGet(`${URL}/biz/weixin/jl/activity/get/record`, query);
}
export function chainsRefound(query) {
	// 退款
	return axiosGet(`${URL}/biz/weixin/jl/activity/refund`, query);
}
export function chainsCancel(query) {
	//取消
	return axiosGet(`${URL}/biz/weixin/jl/activity/cancel`, query);
}
