import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function getShareAuth(query) {
	//检查当前用户运营分享权限
	return axiosGet(`${URL}/biz/weixin/share/redPacket/check/share/auth`, query);
}
export function postShareAuth(query) {
	//运营分享
	return axiosGet(`${URL}/biz/weixin/share/redPacket/operation/share`, query);
}
export function getShareAuthPacket(query, header) {
	//领取运营分享券
	return axiosGet(`${URL}/biz/weixin/share/redPacket/operation/acquire`, query, header);
}
export function getShareAuthDetail(query) {
	//运营分享活动详情
	return axiosGet(`${URL}/biz/weixin/share/redPacket/operation/detail`, query);
}
export function getSelectedRedPacket(query) {
	//查询选择的红包
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/getSelectedRedPacket`, query);
}
export function setShareOrder(query) {
	//获取分享活动
	return axiosGet(`${URL}/biz/weixin/share/redPacket/random/share`, query);
}
export function getShareOrderRedPacket(query, header) {
	//领取下单分享随机红包
	return axiosGet(`${URL}/biz/weixin/share/redPacket/random/acquire`, query, header);
}
export function getShareOrderDetail(query) {
	//下单分享活动详情
	return axiosGet(`${URL}/biz/weixin/share/redPacket/random/detail`, query);
}
export function getShareHelpDetail(query) {
	//助力活动详情
	return axiosGet(`${URL}/biz/weixin/help/redPacket/detail`, query);
}
export function setInviteShare(query, header) {
	//助力红包分享
	return axiosGet(`${URL}/biz/weixin/help/redPacket/share`, query, header);
}
export function postInviteShare(query, header) {
	//帮助好友助力领红包
	return axiosGet(`${URL}/biz/weixin/help/redPacket/help`, query, header);
}
export function getInviteHistory(query, header) {
	//助力历史列表
	return axiosGet(`${URL}/biz/weixin/help/redPacket/history/list`, query, header);
}
export function getEveryCoupons(query) {
	//天天领红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeRedPacket_01`, query);
}
export function selectOrderActivity(query) {
	//查询第几单活动
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectOrderActivity`, query);
}
export function ordersRedPacket(query) {
	//领取分享红包3.30版本
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeRecommendRedPacket`, query);
}
export function getOrdersRedPacket(query) {
	//查询分享红包3.30版本
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectRecommendRedPacket`, query);
}
export function selectUserRedPacket_03(query) {
	//查询即将到期红包
	return axiosGet(`${URL}/biz/weixin/redPacketRecord/selectUserRedPacket_03`, query);
}