import { URL, AjaxApi } from "@/utils/api";
import QQMapWX from "@/utils/qqmap-wx-jssdk.min.js";
export async function onLogin(...args) {
	uni.login({
		success: function (res) {
			let params = {
				code: res.code,
				userType: "customer",
			};
			let successFuc = res => {
				uni.setStorageSync("token", res.data.token);
				let page = getCurrentPages().pop(); //获取当前页面实例
				getApp().globalData.fast = true;
				if (page == undefined || page == null) return;
				page.onLoad();
				page.onShow();
			};
			AjaxApi("AuthUrl", params, successFuc);
		},
		fail: function (res) {
			console.log(res);
		},
	});
}
export async function Promote(query, token) {
	uni.request({
		url: `${URL}/biz/weixin/recommend/add/${query.query}`, //拉新营销活动
		header: {
			token: token,
		},
		success: res => {
			console.log(res);
		},
	});
}
export async function Promote1(query, token) {
	uni.request({
		url: `${URL}/biz/weixin/recommend/add_01/${query.query}`, //扫码统计人数
		header: {
			token: token,
		},
		success: res => {
			console.log(res);
		},
	});
}
const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : "0" + n;
};
export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute, second].map(formatNumber).join(":");
}
export function formatTime2(date = "2018/06/22 08:00:20") {
	let timenow = Date.parse(new Date());
	let timethen = new Date((date || "").replace(/\-/g, "/")).getTime();
	let time = Math.ceil((timenow - timethen) / 86400000);
	return time == 1 ? "今天" : time == 2 ? "昨天" : time == 3 ? "前天" : `${time}天前`;
}
export function getToken() {
	try {
		const value = uni.getStorageSync("token");
		if (value) {
			return value;
		}
	} catch (e) {
		// error
	}
}
export const getObjType = obj => {
	var toString = Object.prototype.toString;
	var map = {
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regExp",
		"[object Undefined]": "undefined",
		"[object Null]": "null",
		"[object Object]": "object",
	};
	return map[toString.call(obj)];
};
export const paramConversion = href => {
	var params = href.split("?")[1];
	var paramArr = params.split("&");
	var res = {};
	for (var i = 0; i < paramArr.length; i++) {
		var str = paramArr[i].split("=");
		res[str[0]] = str[1];
	}
	return res;
};
export const getBarHeight = () => {
	const info = uni.getSystemInfoSync();
	if (info.platform === "android") {
		return info.statusBarHeight + 48;
	} else {
		return info.statusBarHeight + 44;
	}
};
const getGps2Address = () => {
	var qqmapsdk = new QQMapWX({
		key: "AVFBZ-36ERX-NIL44-7HAJB-JWVNQ-YEBMA",
	});
	return new Promise((resolve, reject) => {
		qqmapsdk.reverseGeocoder({
			success: res => resolve(res),
			fail: res => reject(res),
		});
	});
};
const getGps2Route = (start, dest) => {
	var qqmapsdk = new QQMapWX({
		key: "AVFBZ-36ERX-NIL44-7HAJB-JWVNQ-YEBMA",
	});
	return new Promise((resolve, reject) => {
		qqmapsdk.direction({
			mode: "bicycling", //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
			//from参数不填默认当前地址
			from: start,
			to: dest,
			success: res => resolve(res),
			fail: res => reject(res),
		});
	});
};
export const appInit = (init = () => {}) => {
	if (getApp().globalData.fast) {
		init();
	} else {
		getApp().employIdCallback = () => {
			init();
		};
	}
};
export const tencentLoc = (init, showModal = false) => {
	//调用
	getGps2Address()
		.then(res => {
			getApp().globalData.location = {
				latitude: res?.result?.location?.lat,
				longitude: res?.result?.location?.lng,
			};
			getApp().globalData.userAddress = res?.result?.formatted_addresses?.recommend ?? "请打开位置权限";
			uni.setStorageSync("location", {
				latitude: res?.result?.location?.lat,
				longitude: res?.result?.location?.lng,
			});
			appInit(init);
		})
		.catch(err => {
			console.log("无法获取定位", err);
			if (!showModal || getApp().globalData.userAddress !== "请打开位置权限") {
				//小程序频繁调用wx.getLocation接口会导致用户手机电量消耗较快，不返回结果
				appInit(init);
			} else {
				if (getApp().globalData.locationPermission) {
					uni.showModal({
						title: "提示",
						content: "请先打开手机定位!",
						success() {
							appInit(init);
						},
					});
				} else {
					uni.showModal({
						title: "提示",
						content: "请先打开小程序定位权限 !",
						success(res) {
							if (res.confirm) {
								uni.openSetting();
							} else if (res.cancel) {
								appInit(init);
							}
						},
					});
				}
			}
		});
};
export const tencentRoute = (start, dest, fuc) => {
	//调用
	getGps2Route(start, dest)
		.then(res => {
			let ret = res;
			let coors = ret.result.routes[0].polyline;
			let pl = [];
			//坐标解压（返回的点串坐标，通过前向差分进行压缩）
			let kr = 1000000;
			for (var i = 2; i < coors.length; i++) {
				coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
			}
			//将解压后的坐标放入点串数组pl中
			for (var i = 0; i < coors.length; i += 2) {
				pl.push({ latitude: coors[i], longitude: coors[i + 1] });
			}
			fuc(pl);
		})
		.catch(err => {
			console.log("坐标解压", err);
			fuc([]);
		});
};
export const getUserLocation = (init, showModal = false) => {
	uni.authorize({
		scope: "scope.userLocation",
		success() {
			getApp().globalData.locationPermission = true;
			tencentLoc(init, showModal);
		},
		fail() {
			getApp().globalData.userAddress = "请打开位置权限";
			if (!showModal) {
				appInit(init);
			} else {
				uni.showModal({
					title: "提示",
					content: "请先打开小程序定位权限 !",
					success(res) {
						if (res.confirm) {
							uni.openSetting();
						} else if (res.cancel) {
							appInit(init);
						}
					},
				});
			}
		},
	});
};
export const BASE64 = () => {
	var BASE64_MAPPING = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"+",
		"/",
	];
	/**
	 *ascii convert to binary
	 */
	var _toBinary = function (ascii) {
		var binary = new Array();
		while (ascii > 0) {
			var b = ascii % 2;
			ascii = Math.floor(ascii / 2);
			binary.push(b);
		}
		/*
			var len = binary.length;
			if(6-len > 0){
				for(var i = 6-len ; i > 0 ; --i){
					binary.push(0);
				}
			}*/
		binary.reverse();
		return binary;
	};
	/**
	 *binary convert to decimal
	 */
	var _toDecimal = function (binary) {
		var dec = 0;
		var p = 0;
		for (var i = binary.length - 1; i >= 0; --i) {
			var b = binary[i];
			if (b == 1) {
				dec += Math.pow(2, p);
			}
			++p;
		}
		return dec;
	};
	/**
	 *unicode convert to utf-8
	 */
	var _toUTF8Binary = function (c, binaryArray) {
		var mustLen = 8 - (c + 1) + (c - 1) * 6;
		var fatLen = binaryArray.length;
		var diff = mustLen - fatLen;
		while (--diff >= 0) {
			binaryArray.unshift(0);
		}
		var binary = [];
		var _c = c;
		while (--_c >= 0) {
			binary.push(1);
		}
		binary.push(0);
		var i = 0,
			len = 8 - (c + 1);
		for (; i < len; ++i) {
			binary.push(binaryArray[i]);
		}
		for (var j = 0; j < c - 1; ++j) {
			binary.push(1);
			binary.push(0);
			var sum = 6;
			while (--sum >= 0) {
				binary.push(binaryArray[i++]);
			}
		}
		return binary;
	};
	return {
		/**
		 *BASE64 Encode
		 */
		encoder: function (str) {
			var base64_Index = [];
			var binaryArray = [];
			for (var i = 0, len = str.length; i < len; ++i) {
				var unicode = str.charCodeAt(i);
				var _tmpBinary = _toBinary(unicode);
				if (unicode < 0x80) {
					var _tmpdiff = 8 - _tmpBinary.length;
					while (--_tmpdiff >= 0) {
						_tmpBinary.unshift(0);
					}
					binaryArray = binaryArray.concat(_tmpBinary);
				} else if (unicode >= 0x80 && unicode <= 0x7ff) {
					binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
				} else if (unicode >= 0x800 && unicode <= 0xffff) {
					//UTF-8 3byte
					binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
				} else if (unicode >= 0x10000 && unicode <= 0x1fffff) {
					//UTF-8 4byte
					binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
				} else if (unicode >= 0x200000 && unicode <= 0x3ffffff) {
					//UTF-8 5byte
					binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
				} else if (unicode >= 4000000 && unicode <= 0x7fffffff) {
					//UTF-8 6byte
					binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
				}
			}

			var extra_Zero_Count = 0;
			for (var i = 0, len = binaryArray.length; i < len; i += 6) {
				var diff = i + 6 - len;
				if (diff == 2) {
					extra_Zero_Count = 2;
				} else if (diff == 4) {
					extra_Zero_Count = 4;
				}
				//if(extra_Zero_Count > 0){
				//	len += extra_Zero_Count+1;
				//}
				var _tmpExtra_Zero_Count = extra_Zero_Count;
				while (--_tmpExtra_Zero_Count >= 0) {
					binaryArray.push(0);
				}
				base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
			}

			var base64 = "";
			for (var i = 0, len = base64_Index.length; i < len; ++i) {
				base64 += BASE64_MAPPING[base64_Index[i]];
			}

			for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
				base64 += "=";
			}
			return base64;
		},
		/**
		 *BASE64  Decode for UTF-8
		 */
		decoder: function (_base64Str) {
			var _len = _base64Str.length;
			var extra_Zero_Count = 0;
			/**
			 *计算在进行BASE64编码的时候，补了几个0
			 */
			if (_base64Str.charAt(_len - 1) == "=") {
				//alert(_base64Str.charAt(_len-1));
				//alert(_base64Str.charAt(_len-2));
				if (_base64Str.charAt(_len - 2) == "=") {
					//两个等号说明补了4个0
					extra_Zero_Count = 4;
					_base64Str = _base64Str.substring(0, _len - 2);
				} else {
					//一个等号说明补了2个0
					extra_Zero_Count = 2;
					_base64Str = _base64Str.substring(0, _len - 1);
				}
			}

			var binaryArray = [];
			for (var i = 0, len = _base64Str.length; i < len; ++i) {
				var c = _base64Str.charAt(i);
				for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
					if (c == BASE64_MAPPING[j]) {
						var _tmp = _toBinary(j);
						/*不足6位的补0*/
						var _tmpLen = _tmp.length;
						if (6 - _tmpLen > 0) {
							for (var k = 6 - _tmpLen; k > 0; --k) {
								_tmp.unshift(0);
							}
						}
						binaryArray = binaryArray.concat(_tmp);
						break;
					}
				}
			}

			if (extra_Zero_Count > 0) {
				binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
			}

			var unicode = [];
			var unicodeBinary = [];
			for (var i = 0, len = binaryArray.length; i < len; ) {
				if (binaryArray[i] == 0) {
					unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
					i += 8;
				} else {
					var sum = 0;
					while (i < len) {
						if (binaryArray[i] == 1) {
							++sum;
						} else {
							break;
						}
						++i;
					}
					unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
					i += 8 - sum;
					while (sum > 1) {
						unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
						i += 8;
						--sum;
					}
					unicode = unicode.concat(_toDecimal(unicodeBinary));
					unicodeBinary = [];
				}
			}
			return unicode;
		},
	};
};
