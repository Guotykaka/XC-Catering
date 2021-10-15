import {axiosGet,axiosPostJson} from "@/utils/api";
import {URL} from "@/utils/api";


export function getPdList(query) {
	//获取拼单收货地址列表
	return axiosGet(`${URL}/biz/weixin/address/get/pd/list`, query);
}
export function getAddressList(query){//用户地址列表
	return axiosGet(`${URL}/biz/weixin/address/get/list`,query)
}

export function saveAddress(query){//新增地址
	return axiosPostJson(`${URL}/biz/weixin/address/save`,query)
}

export function selectAddress(query) {//选择地址
	return axiosGet(`${URL}/biz/weixin/order/select/address`,query)
}

export function getAddressById(query) {//根据地址id获取地址详细信息
	return axiosGet(`${URL}/biz/weixin/address/get`,query)
}


export function updateAddress(query){//修改地址
	return axiosPostJson(`${URL}/biz/weixin/address/update`,query)
}

export function  deleteAddress(query){//根据id删除地址
	return axiosPostJson(`${URL}/biz/weixin/address/delete`,query)
}

export function getNotice(query) {//消息列表
	return axiosGet(`${URL}/biz/weixin/notice/page`,query)
}

export function getUnReadCount(query) {//查询未读消息的条数
	return axiosGet(`${URL}/biz/weixin/notice/getUnReadCount`,query)
}

export function updateStatus(query) {//查询未读消息的条数
	return axiosGet(`${URL}/biz/weixin/notice/updateStatus`,query)
}


export function takeRedPacket(query) {//用户领取红包
	return axiosPostJson(`${URL}/biz/weixin/redPacketRecord/takeRedPacket`,query)
}

export function getShoppingCar(query) { //获取购物车
	return axiosGet(`${URL}/biz/weixin/shopping/get/all`,query)
}

export function delShoppingCar() { 
	return axiosPostJson(`${URL}/biz/weixin/shopping/delete/all`)
}

export function getSelectCollectList(query) { 
	return axiosGet(`${URL}/biz/weixin/shopCollect/selectCollectList`,query)
}
export function rechargeGet(query) {
	//获取充值免单配置
	return axiosGet(`${URL}/biz/weixin/order/recharge/free`,query)
}