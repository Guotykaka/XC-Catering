const AUTH_MODE = "fingerPrint";
export default function (successFuc,elseFuc) {
	const startSoterAuthentication = () => {
		uni.startSoterAuthentication({
			requestAuthModes: [AUTH_MODE],
			challenge: "test",
			authContent: "支付订单",
			success: res => {
				successFuc();
				// uni.showToast({
				// 	title: "认证成功",
				// });
			},
            fail: err => {
				uni.showModal({
					title: "失败",
					content: "认证失败",
					showCancel: false,
                });
                elseFuc()
			},
		});
	};

	const checkIsEnrolled = () => {
		uni.checkIsSoterEnrolledInDevice({
			checkAuthMode: AUTH_MODE,
			success: res => {
				console.log(res);
				if (parseInt(res.isEnrolled) <= 0) {
					// uni.showModal({
					// 	title: "错误",
					// 	content: "您暂未录入指纹信息，请录入后重试",
					// 	showCancel: false,
                    // });
                    successFuc();
					return;
				}
				startSoterAuthentication();
			},
			fail: err => {
				console.error(err);
				successFuc();
			},
		});
	};

	uni.checkIsSupportSoterAuthentication({
        success: res => {
			console.log(res);
			const ifhas = res.supportMode.findIndex(ele => ele === "fingerPrint");
			if (ifhas == -1) {
				successFuc();
			} else {
				checkIsEnrolled();
			}
		},
		fail: err => {
			console.error(err);
			successFuc();
			// uni.showModal({
			// 	title: "错误",
			// 	content: "您的设备不支持指纹识别",
			// 	showCancel: false,
			// });
		},
	});
}
