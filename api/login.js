import { axiosGet, axiosPost } from "@/utils/api";
import { URL } from "@/utils/api";

//Auth
export function authUrl(query) {
	return axiosPost(`${URL}/biz/weixin/wxuser/auth`, query);
}
//账号密码登录
export function loginByPhone(query = { password: "", phone: "", token: "" }) {
	return axiosPost(`${URL}/biz/weixin/wxuser/loginByPhone`, query);
}
//微信登录
export function getUserPhone(query = { password: "", phone: "", token: "" }) {
	return axiosPost(`${URL}/biz/weixin/wxuser/getPhoneNumber`, query);
}

//获取验证码
export function getLoginMsgCode(query) {
	return axiosGet(`${URL}/biz/weixin/wxuser/getLoginMsgCode`, query);
}

//验证码手机号登录
export function loginByPhoneAndCode(query) {
	return axiosPost(`${URL}/biz/weixin/wxuser/loginByPhoneAndCode`, query);
}
//分享券token
export function authCoupon(query) {
	return axiosGet(`${URL}/biz/base/get/token`, query);
}
//首页是否显示商家
export function flagShopTab(query) {
	return axiosGet(`${URL}/biz/weixin/home/version`, query);
}
//获取企业微信url
export function rechargeUrl(query) {
	return axiosGet(`${URL}/biz/weixin/home/get/qywx/url`, query);
}
