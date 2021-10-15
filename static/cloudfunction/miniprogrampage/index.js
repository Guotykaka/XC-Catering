const cloud = require("wx-server-sdk");
cloud.init();
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	let openid = wxContext.OPENID;
	//设置输入状态
	cloud.openapi.customerServiceMessage.setTyping({
		touser: openid,
		command: "Typing",
	});
	//从云储存中拉取图片数据
	if (event.MsgType === "miniprogrampage") {
		//从云储存中拉取图片数据
		const qunimg = await cloud.downloadFile({
			fileID: "cloud://xspd-pro-9g8k2bud20fce1bd.7873-xspd-pro-9g8k2bud20fce1bd-1304744413/qrcode2.jpg",
		});
		//上传图片素材到媒体库，并获取到图片id
		const qunmedia = await cloud.openapi.customerServiceMessage.uploadTempMedia({
			type: "image",
			media: {
				contentType: "image/jpeg",
				value: qunimg.fileContent,
			},
		});
		//向用户发送群二维码
		await cloud.openapi.customerServiceMessage.send({
			touser: openid,
			msgtype: "image",
			image: {
				mediaId: qunmedia.mediaId,
			},
		});
		//向用户发送文案
		await cloud.openapi.customerServiceMessage.send({
			touser: openid,
			msgtype: "text",
			text: {
				content: "进群领福利",
			},
		});
		//取消状态设置
		cloud.openapi.customerServiceMessage.setTyping({
			touser: openid,
			command: "CancelTyping",
		});
	}
};
