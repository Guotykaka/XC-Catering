<script>
import { AjaxApi, PromiseAll, socketUrl, socketUrlCan } from "@/utils/api";
import { getObjType } from "@/utils";
import websocket from "@/utils/socket.js";
export default {
	data() {
		return {
			getToken: "",
		};
	},
	globalData: {
		scene: 0,
		locationPermission: false, //用户位置许可
		location: {
			//用户位置经纬度
			latitude: 0, //纬度
			longitude: 0, //经度
		},
		userAddress: "请打开位置权限", //用户地址
		promotionDefAddr: {
			address: "",
			area: "",
			areaId: "",
			city: "",
			cityId: "",
			createTime: null,
			customerId: 0,
			delFlag: "0",
			id: 0,
			isDefault: 1,
			location: "0,0",
			mark: 0,
			phone: "",
			province: "",
			provinceId: "",
			relationPerson: "",
			remark: null,
			sex: 0,
			updateTime: null,
		}, //选中的店铺
		tabbar: [
			{
				pagePath: "pages/index/index",
				iconPath: "https://oss.dianddian.cn/v2/tabbar/common/index_1.png",
				selectedIconPath: "https://oss.dianddian.cn/v2/tabbar/common/index_2.png",
				text: "首页",
				click: true,
			},
			{
				pagePath: "pages/member/member",
				iconPath: "https://oss.dianddian.cn/v2/tabbar/common/vip_1.png",
				selectedIconPath: "https://oss.dianddian.cn/v2/tabbar/common/vip_2.png",
				text: "会员",
				click: false,
			},
			{
				pagePath: "pages/spellOrder/spellOrder",
				iconPath: "https://oss.dianddian.cn/v2/tabbar/common/pincan_1.png",
				selectedIconPath: "https://oss.dianddian.cn/v2/tabbar/common/pincan_2.png",
				text: "拼餐",
				click: false,
			},
			{
				pagePath: "pages/order/order",
				iconPath: "https://oss.dianddian.cn/v2/tabbar/common/order_1.png",
				selectedIconPath: "https://oss.dianddian.cn/v2/tabbar/common/order_2.png",
				text: "订单",
				click: false,
			},
			{
				pagePath: "pages/mine/mine",
				iconPath: "https://oss.dianddian.cn/v2/tabbar/common/mine_1.png",
				selectedIconPath: "https://oss.dianddian.cn/v2/tabbar/common/mine_2.png",
				text: "我的",
				click: false,
			},
		],
		statusBarHeight: 0,
		navigationBarHeight: 0,
		fast: false,
		previewImage: false, //是否因预览照片触发hide
		checkedLogin: false,
		UserInfo: { phone: null, avatarUrl: null },
		// NewcomerCoupon: true, //新人券
		wxPublicNumberAppid: null,
		orderPara: null,
		shoppingMode: 1, //0,外卖,1堂食
		role: 1,
		conectSocket: true,
		websocket: null,
		websocketUrl: socketUrl,
		charAvatar: "https://rms-oss.oss-cn-shanghai.aliyuncs.com/weixin/dianzhu.png",
		clerkAvatar: "https://rms-oss.oss-cn-shanghai.aliyuncs.com/weixin/dianyuan.png",
		shopImg: "https://oss.dianddian.cn/shop/%E9%BB%98%E8%AE%A4%E5%BA%97%E9%93%BAlogo%403x.png",
		shopBgImg: "https://oss.dianddian.cn/shop/%E9%BB%98%E8%AE%A4%E5%BA%97%E9%93%BA%E9%97%A8%E5%A4%B4%403x.png",
	},
	onLaunch: function (options) {
		wx.cloud.init({
			//env: '你的环境ID',
			env: "xspd-pro-9g8k2bud20fce1bd",
			traceUser: true,
		});
		this.scene = options?.scene ?? 0;
		// 保持屏幕常亮
		uni.setKeepScreenOn({
			keepScreenOn: true,
		});
		this.globalData.websocket = new websocket({
			// true代表启用心跳检测和断线重连
			heartCheck: true,
			isReconnection: true,
		});
		this.globalData.websocket.onReceivedMsg(result => {
			console.log("收到服务器内容：" + result.data);
		});
		const that = this;
		uni.getStorage({
			key: "token",
			success: function (res) {
				if (!res.data) {
					that.onLogin();
					return;
				}
			},
			complete: function () {
				that.onLogin();
			},
		});
	},
	onShow: function () {
		if (this.scene == 1154) return;
		this.autoUpdate();
		let loc = uni.getStorageSync("location");
		this.globalData.location = loc || this.globalData.location;
	},
	onHide: function () {
		if (this.globalData.websocket.closeWebSocket) {
			this.globalData.websocket.closeWebSocket();
		}
	},
	methods: {
		linkWebsocket(url) {
			if (!this.globalData.conectSocket) {
				this.globalData.websocket.closeWebSocket();
				return;
			}
			let Fuc = () => {
				this.globalData.websocketUrl = `${socketUrl}/${url}`;
				this.globalData.websocket.initWebSocket({
					url: `${socketUrl}/${url}`,
					success(res) {
						console.log(res, "建立连接", `${socketUrl}/${url}`);
					},
					fail(err) {
						console.log(err, 5555);
					},
				});
			};
			if (this.globalData.websocket.closeWebSocket) {
				this.globalData.websocket.closeWebSocket(Fuc);
			} else {
				Fuc();
			}
			// 建立连接
		},
		linkWebsocketCan(url) {
			if (!this.globalData.conectSocket) {
				this.globalData.websocket.closeWebSocket(() => {
					this.globalData.websocketUrl = ``;
				});
				return;
			}
			let Fuc = () => {
				this.globalData.websocketUrl = `${socketUrlCan}/${url}`;
				this.globalData.websocket.initWebSocket({
					url: `${socketUrlCan}/${url}`,
					success(res) {
						console.log(res, "建立连接", `${socketUrlCan}/${url}`);
					},
					fail(err) {
						console.log(err, 5555);
					},
				});
			};
			if (this.globalData.websocket.closeWebSocket) {
				this.globalData.websocket.closeWebSocket(Fuc);
			} else {
				Fuc();
			}
			// 建立连接
		},
		getWebSocket() {
			// 向其他页面暴露当前websocket连接
			return this.globalData.websocket;
		},
		initSocket() {
			// 监听websocket状态
			this.globalData.websocket.onSocketClosed({
				url: this.globalData.websocketUrl,
				success(res) {
					console.log(res);
				},
				fail(err) {
					console.log(err);
				},
			});
			// 监听网络变化
			this.globalData.websocket.onNetworkChange({
				url: this.globalData.websocketUrl,
				success(res) {
					console.log(res);
				},
				fail(err) {
					console.log(err);
				},
			});
		},
		autoUpdate: function () {
			var self = this;
			// 获取小程序更新机制兼容
			if (uni.canIUse("getUpdateManager")) {
				const updateManager = uni.getUpdateManager();
				//1. 检查小程序是否有新版本发布
				updateManager.onCheckForUpdate(function (res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						//检测到新版本，需要更新，给出提示
						uni.showModal({
							title: "更新提示",
							content: "检测到新版本，是否下载新版本并重启小程序？",
							success: function (res) {
								if (res.confirm) {
									//2. 用户确定下载更新小程序，小程序下载及更新静默进行
									self.downLoadAndUpdate(updateManager);
								} else if (res.cancel) {
									//用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
									uni.showModal({
										title: "温馨提示",
										content: "本次版本更新涉及到新的功能添加，旧版本无法正常访问",
										showCancel: false, //隐藏取消按钮
										confirmText: "确定更新", //只保留确定更新按钮
										success: function (res) {
											if (res.confirm) {
												//下载新版本，并重新应用
												self.downLoadAndUpdate(updateManager);
											}
										},
									});
								}
							},
						});
					}
				});
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: "提示",
					content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
				});
			}
		},
		/**
		 * 下载小程序新版本并重启应用
		 */
		downLoadAndUpdate: function (updateManager) {
			var self = this;
			uni.showLoading();
			//静默下载更新小程序新版本
			updateManager.onUpdateReady(function () {
				uni.hideLoading();
				//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				updateManager.applyUpdate();
			});
			updateManager.onUpdateFailed(function () {
				// 新的版本下载失败
				uni.showModal({
					title: "已经有新版本",
					content: "新版本已经上线啦，请您删除当前小程序，重新搜索打开",
				});
			});
		},
		onLogin(...args) {
			// 登录
			const that = this;
			uni.login({
				provider: "weixin",
				success: function (res) {
					let successFuc = res => {
						that.getToken = res.data.token;
						uni.setStorageSync("token", that.getToken);
						that.setUserInfo();
					};
					let params = {
						code: res.code,
						userType: "customer",
					};
					let elseFuc = () => {
						that.globalData.fast = true;
					};
					AjaxApi("AuthUrl", params, successFuc, elseFuc);
				},
				fail() {
					console.log('wx.login登录失败')
					that.globalData.fast = true;
					if (getApp().employIdCallback) {
						getApp().employIdCallback();
					}
				},
			});
		},
		setUserInfo() {
			const that = this;
			let successFuc = res => {
				this.globalData.wxPublicNumberAppid = res.data.wxPublicNumberAppid;
				this.globalData.UserInfo = res.data;
				uni.getSystemInfo({
					success: function (res) {
						that.globalData.statusBarHeight = res.statusBarHeight;
						that.globalData.fast = true;
						if (getApp().employIdCallback) {
							getApp().employIdCallback();
						}
					},
				});
			};
			AjaxApi("QueryUserInfo", {}, successFuc);
		},
	},
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url("/static/uni.ttf");
}

/* #endif */

@import "/common/common.scss";

// @import  "/common/iconfont.css";
// @import  "/common/iconfont.scss";
// @import  "/common/iconfont.wxss";
</style>
