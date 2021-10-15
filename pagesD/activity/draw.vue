<template>
	<view class="conbox">
		<view class="container">
			<!-- 背景 -->
			<image src="../../static/img/bg.png" class="cont" mode=""></image>
			<image src="../../static/img/caidai.png" class="caidai" mode=""></image>
			<view class="main" style="padding-top: 50rpx">
				<view class="canvas-container">
					<view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
						<view class="canvas-line">
							<view
								class="canvas-litem"
								v-for="(item, index) in list"
								:key="index"
								:style="{ transform: 'rotate(' + (index * width + width / 2) + 'deg)' }"
							></view>
						</view>

						<view class="canvas-list">
							<view
								class="canvas-item"
								:style="{ transform: 'rotate(' + index * width + 'deg)', zIndex: index }"
								v-for="(iteml, index) in list"
								:key="index"
							>
								<view class="canvas-item-text" :style="'transform:rotate(' + index + ')'">
									<text class="b" style="font-size: 32rpx">{{ iteml.name }}</text>
									<text class="icon-awrad iconfont" :class="iteml.icon"></text>
								</view>
							</view>
						</view>
					</view>

					<view @tap="playReward" class="canvas-btn" v-bind:class="btnDisabled">开始 </view>
				</view>
			</view>
			<!-- 规则 -->
			<view class="guize" style="margin-top: 100rpx">
				<view class="title"> 规则说明 </view>
				<view class="g_item"> 1.用户每天登录即送1次抽奖机会，分享好友则多赠1次机会 </view>
				<view class="g_item"> 2.用户点击大转盘抽奖按钮，有积分和现金两种方式可参与抽奖，没抽一次消耗1次抽奖机会 </view>
				<view class="g_item"> 3.用户获得的奖品，可在我的道具里查看 </view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: "5折",
					value: "5",
					icon: "iconlishijilu text-danger",
				},
				{
					name: "6折",
					value: "6",
					icon: "iconlishijilu text-danger",
				},
				{
					name: "7折",
					value: "7",
					icon: "iconlishijilu text-danger",
				},
				{
					name: "8折",
					value: "8",
					icon: "iconlishijilu text-danger",
				},
				{
					name: "9折",
					value: "9",
					icon: "iconlishijilu text-danger",
				},
				{
					name: "感谢参与",
					value: "10",
					icon: "iconlishijilu text-master",
					isNoPrize: true, // 是否未中奖
				},
			],
			width: 0,
			animationData: {},
			btnDisabled: "",
		};
	},
	onLoad: function () {
		// 获取奖品列表
		this.width = 360 / this.list.length;
	},
	methods: {
		animation(index, duration) {
			//中奖index
			var list = this.list;
			// var awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数
			var runNum = 4; //旋转8周

			// 旋转角度
			this.runDeg = this.runDeg || 0;
			this.runDeg = this.runDeg + (360 - (this.runDeg % 360)) + (360 * runNum - index * (360 / list.length)) + 1;
            console.log("🚀 ~ file: draw.vue ~ line 104 ~ animation ~ this.runDeg", this.runDeg)
			//创建动画
			var animationRun = uni.createAnimation({
				duration: duration,
				timingFunction: "ease",
			});
			animationRun.rotate(this.runDeg).step();
			this.animationData = animationRun.export();
			this.btnDisabled = "disabled";
		},
		//发起抽奖
		playReward() {
			let index = 3,
				duration = 4000;
			this.animation(index, duration);

			setTimeout(() => {
				uni.showModal({ content: this.list[index].isNoPrize ? "抱歉，您未中奖" : "恭喜，中奖" });
				this.btnDisabled = "";
				// document.getElementById('zhuanpano').style=''
			}, duration + 1000);
		},
	},
};
</script>
<style scoped>
.icon-awrad {
	font-size: 50rpx !important;
    margin-top: 60rpx;
}

.conbox {
	width: 750rpx;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: scroll;
}

.container,
image.cont {
	width: 750rpx;
	min-height: 100vh;
	height: auto;
	position: relative;
}

image.cont {
	height: 100%;
	position: absolute;
	z-index: 0;
}

image.caidai {
	position: absolute;
	top: 0;
	left: 0;
	width: 750rpx;
	height: 1024rpx;
}

.header-title > view {
	padding: 8rpx 16rpx;
	border: 1px solid #d89720;
	color: #d89720;
	font-size: 28rpx;
	border-radius: 26rpx;
}

/* 转盘 */
.canvas-container {
	margin: 0 auto;
	position: relative;
	width: 600rpx;
	height: 600rpx;
	background: url(./img/circle.png) no-repeat;
	background-size: cover;
	border-radius: 50%;
}

.canvas-content {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
	display: block;
	width: 600rpx;
	height: 600rpx;
	border-radius: inherit;
	/* background-clip: padding-box; */
	/* background-color: #ffcb3f; */
}

.canvas-list {
	position: absolute;
	left: 0;
	top: 0;
	width: inherit;
	height: inherit;
	z-index: 9999;
}

.canvas-item {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	color: #e4370e;
	/* text-shadow: 0 1rpx 1rpx rgba(255, 255, 255, 0.6); */
}

.canvas-item-text {
	position: relative;
	display: block;
	padding-top: 46rpx;
	margin: 0 auto;
	text-align: center;
	-webkit-transform-origin: 50% 300rpx;
	transform-origin: 50% 300rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fb778b;
}

.canvas-item-text text {
	font-size: 30rpx;
}

/* 分隔线 */
.canvas-line {
	position: absolute;
	left: 0;
	top: 0;
	width: inherit;
	height: inherit;
	z-index: 99;
}

.canvas-litem {
	position: absolute;
	left: 300rpx;
	top: 0;
	width: 3rpx;
	height: 300rpx;
	background-color: rgba(228, 55, 14, 0.4);
	overflow: hidden;
	-webkit-transform-origin: 50% 300rpx;
	transform-origin: 50% 300rpx;
}

/**
* 抽奖按钮
*/
.canvas-btn {
	position: absolute;
	left: 260rpx;
	top: 260rpx;
	z-index: 400;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	color: #f4e9cc;
	background-color: #e44025;
	line-height: 80rpx;
	text-align: center;
	font-size: 26rpx;
	text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
	text-decoration: none;
}

.canvas-btn::after {
	position: absolute;
	display: block;
	content: " ";
	left: 12rpx;
	top: -44rpx;
	width: 0;
	height: 0;
	overflow: hidden;
	border-width: 30rpx;
	border-style: solid;
	border-color: transparent;
	border-bottom-color: #e44025;
}
.canvas-btn.disabled {
	pointer-events: none;
	background: #b07a7b;
	color: #ccc;
}

.canvas-btn.disabled::after {
	border-bottom-color: #b07a7b;
}

.typecheckbox view {
	border: 1px solid #ff3637;
	background: transparent;
	color: #ff3637;
	display: flex;
	height: 60rpx;
	width: 140rpx;
	border-radius: 50rpx;
	align-items: center;
	justify-content: center;
	display: flex;
	margin-left: 20rpx;
}

.guize {
	width: 502rpx;
	min-height: 300rpx;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 3;
	background-image: linear-gradient(-180deg, #f48549 0%, #f2642e 100%);
	border: 18rpx solid #e4431a;
	border-radius: 16px;
	margin: 0 auto;
	margin-top: -104rpx;
	padding: 48rpx;
	/* box-sizing: border-box; */
	color: #fff;
}

.guize .title {
	text-align: center;
	margin-bottom: 28rpx;
}

.guize .g_item {
	font-family: PingFang-SC-Medium;
	font-size: 24rpx;
	color: #ffffff;
	letter-spacing: 0.5px;
	text-align: justify;
	line-height: 20px;
}

.myrewards .title {
	font-family: PingFang-SC-Bold;
	font-size: 16px;
	color: #e4431a;
	letter-spacing: 0.57px;
	display: flex;
	padding-top: 36rpx;
	justify-content: center;
}
</style>
