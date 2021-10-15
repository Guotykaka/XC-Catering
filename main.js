import Vue from "vue";
import App from "./App";
import store from "./store";
import "./static/font/iconfont.css";

import uView from "uview-ui";
Vue.use(uView);
import uma from "umtrack-wx";
uma.init({
	appKey: "5feaa59aadb42d582692ed8e",
	useOpenid: true, // 是否使用openid进行统计，此项为false时将使用友盟+随机ID进行用户统计。使用openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用OpenID。
	autoGetOpenid: true, // 是否需要通过友盟后台获取openid，如若需要，请到友盟后台设置appId及secret
	debug: false, //是否打开调试模式
	uploadUserInfo: true, // 上传用户信息，上传后可以查看有头像的用户分享信息，同时在查看用户画像时，公域画像的准确性会提升。
});
uma.install = function (Vue) {
	Vue.prototype.$uma = uma;
};
Vue.use(uma);
import tabBar from "./components/tabbar/tabbar.vue";
Vue.component("tab-bar", tabBar);
Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
	...App,
});
app.$mount();
