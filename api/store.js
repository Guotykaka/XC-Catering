import {axiosGet,axiosPost} from "@/utils/api";
import {URL} from "@/utils/api";



export function getStore(query){//获取当前门店信息
	return axiosGet(`${URL}/biz/weixin/store/selectCurrentStore`, query);
}

export function getStoreList(query){//获取附近门店列表
	return axiosGet(`${URL}/biz/weixin/store/selectLatestStore`,query)
}


export function searchStore(query) {//ID查店详情
	return axiosGet(`${URL}/biz/weixin/store/selectSaleStoreInfo`,query)
}

export function selectStoreForHistory(query) {//去过的店
	return axiosGet(`${URL}/biz/weixin/store/selectStoreForHistory`,query)
}


//Auth
// export function authUrl(query) {
//   return axiosPost(`${URL}/biz/weixin/wxuser/auth`, query);
// }
//账号密码登录
// export function loginByPhone(query={password:'',phone:'',token:''}) {
//   return axiosPost(`${URL}/biz/weixin/wxuser/loginByPhone`, query);
// }
//微信登录
// export function getUserPhone(query={password:'',phone:'',token:''}) {
//   return axiosPost(`${URL}/biz/weixin/wxuser/getPhoneNumber`, query);
// }
