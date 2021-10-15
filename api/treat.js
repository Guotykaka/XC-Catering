import { axiosGet, axiosPost, axiosPostJson } from "@/utils/api";
import { URL } from "@/utils/api";

export function selectGroupStoreList(query) {
	//查询门店
	return axiosGet(`${URL}/biz/weixin/groupShop/selectGroupStoreList_03`, query);
}
export function getMakeUpCart(query) {
	//拼单-获取购物车
	return axiosGet(`${URL}/biz/weixin/shopping/new/pd/get`, query);
	// return axiosGet(`${URL}/biz/weixin/shopping/pd/get`, query);
}
export function saveMakeUpCart(query) {
	//拼单-添加购物车
	return axiosPostJson(`${URL}/biz/weixin/shopping/pd/save`, query);
}
export function deleteMakeUpCart(query) {
	//拼单-清空购物车
	return axiosPost(`${URL}/biz/weixin/shopping/pd/delete`, query);
}
export function takeRedPacketPin(query) {
	//个人领取团购红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeGroupRedPacket`, query);
}
export function selectMakeUpList(query) {
	// 查询门店团购菜
	return axiosGet(`${URL}/biz/weixin/groupShop/selectBuyGroupGoodsInfoList_01`, query);
}
export function selectMakeUpList2(query) {
	// 查询门店团购菜2
	return axiosGet(`${URL}/biz/weixin/groupShop/selectBuyGroupGoodsInfoList_02`, query);
}
export function createGroup(query) {
	//创建拼单
	return axiosPostJson(`${URL}/biz/weixin/pd/create`, query);
}
export function getGroup(query) {
	//获取拼单
	return axiosGet(`${URL}/biz/weixin/pd/get`, query);
}
export function cancelGroup(query) {
	//取消拼单
	return axiosGet(`${URL}/biz/weixin/pd/cancel`, query);
}
export function takeGroup(query) {
	//参与拼单
	return axiosGet(`${URL}/biz/weixin/pd/take`, query);
}
export function settleMent(query) {
	//结算拼单
	return axiosGet(`${URL}/biz/weixin/pd/settlement`, query);
}
export function groupDetail(query) {
	//拼单详情
	return axiosGet(`${URL}/biz/weixin/pd/detail`, query);
}
export function saveGroupOrder(query) {
	//下单生成订单
	return axiosPostJson(`${URL}/biz/weixin/pd/order/save`, query);
}
export function saveAAOrder(query) {
	//提交AA订单
	return axiosGet(`${URL}/biz/weixin/pd/order/submit`, query);
}
export function groupOrderDetail(query) {
	//拼单order详情
	return axiosGet(`${URL}/biz/weixin/pd/order/user/detail`, query);
}
export function savePromoters(query) {
	//添加团购发起人
	return axiosPostJson(`${URL}/biz/weixin/groupRecommend/saveGroupRecommendUser`, query);
}
export function applyGroupRecommend(query) {
	//申请推广达人
	return axiosPostJson(`${URL}/biz/weixin/groupRecommend/saveGroupRecommend`, query);
}
export function groupRecmdUserType(query) {
	//查询用户身份
	return axiosGet(`${URL}/biz/weixin/groupRecommend/selectGroupRecommendUserType`, query);
}
export function selectGroupTicket(query) {
	//查询团购红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/selectGroupRedPacket_01`, query);
}
export function selectRecommendAccount(query) {
	//推广达人 查询账户
	return axiosGet(`${URL}/biz/weixin/groupRecommend/selectRecommendAccount`, query);
}
export function selectRecommendOrderSum(query) {
	//查询推广达人总数
	return axiosGet(`${URL}/biz/weixin/groupRecommend/selectRecommendOrderSum`, query);
}
export function selectRecommendOrderAgentSum(query) {
	//查询推广大使总数
	return axiosGet(`${URL}/biz/weixin/groupRecommend/selectRecommendOrderAgentSum`, query);
}
export function getPdId(query) {
	//获取活动ID
	return axiosGet(`${URL}/biz/weixin/pd/get/pdId`, query);
}
export function updatePdAddress(query) {
	//修改拼单地址
	return axiosGet(`${URL}/biz/weixin/pd/update/address`, query);
}
export function getPdGuide(query) {
	//获取提示引导
	return axiosGet(`${URL}/biz/weixin/pd/guide`, query);
}
export function getIconList(query) {
	//获取图标
	return axiosGet(`${URL}/biz/weixin/iconConfig/list`, query);
}
export function getPdPopup(query) {
	//获取拼单弹窗
	return axiosGet(`${URL}/biz/weixin/pd/popup`, query);
}
export function selPdRecord(query) {
	//查询活动状态
	return axiosGet(`${URL}/biz/weixin/pd/order/pdRecord/${query.pdId}`);
}
export function getPdBill(query) {
	//获取拼单
	return axiosGet(`${URL}/biz/weixin/pd/bill`, query);
}
export function postPdAdd(query) {
	//加购菜
	return axiosPostJson(`${URL}/biz/weixin/pd/add/buy`, query);
}

export function handpickList(query) {
	// 获取精选推荐
	return axiosGet(`${URL}/biz/weixin/handpick/list`,query)
}

export function getShopRecommend(query) {
	// 首页获取推荐店铺列表
	return axiosGet(`${URL}/biz/weixin/shopRecommend/get/list`,query)
}
