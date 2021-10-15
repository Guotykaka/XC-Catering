<template>
	<view class="wrap">
		<u-form :model="model" ref="uForm" :rules="rules">
			<view class="form-top">
				<u-form-item label-position="left" :label-style="labelWidth" label="联系人" prop="relationPerson" label-width="156">
					<u-input
						type="text"
						placeholder-style="color:#ABABAF; font-size: 28rpx;"
						v-model="model.relationPerson"
						placeholder="请输入您的姓名"
					></u-input>
				</u-form-item>
				<u-form-item label-position="left" :label-style="labelWidth" label=" " prop="sex" label-width="156">
					<view v-for="(item, index) in radioList" :key="index" :class="[{ checked: item.checked }, 'radio u-m-r-40']" @tap="radioChange(index)">
						{{ item.name }}
					</view>
				</u-form-item>
				<u-form-item label-position="left" :label-style="labelWidth" label="电话" prop="phone" label-width="156">
					<u-input type="number" placeholder-style="color:#ABABAF; font-size: 28rpx;" v-model="model.phone" placeholder="请输入手机号"></u-input>
				</u-form-item>
				<u-form-item label-position="left" :label-style="labelWidth" label="地址" label-width="156" @tap.stop="turnToMap()">
					<view class="u-flex u-row-between" @tap.stop="turnToMap()">
						<view :class="[{ 'placeHolder-style': model.address == '选择收货地址' }, 'u-line-1']" style="width: calc(100vw - 250rpx)">{{
							model.address
						}}</view>
						<view class="iconfont icon-arrow-right" style="color: #ababaf; font-size: 28rpx"></view>
					</view>
				</u-form-item>
				<u-form-item label-position="left" :border-bottom="false" :label-style="labelWidth" label="门牌号" label-width="156">
					<u-input
						type="text"
						placeholder-style="color:#ABABAF; font-size: 28rpx;"
						placeholder="例：3号楼1802"
						v-model="adrnotes"
						:maxlength="maxlength"
					/>
				</u-form-item>
				<u-form-item class="tag" :border-bottom="false" label-position="left" :label-style="labelWidth" label="标签" prop="mark" label-width="156">
					<view class="u-flex u-row-left">
						<text
							class="span-style u-m-r-40"
							:class="[model.mark == index ? `span-choose` : '']"
							v-for="(item, index) in tagList"
							:key="index"
							@tap="chooseTag(index)"
							>{{ item.type }}</text
						>
					</view>
				</u-form-item>
			</view>
			<view class="agreement">
				<u-checkbox active-color="#666666" shape="circle" v-model="check" @change="checkboxChange">
					<text>设为常用地址</text>
				</u-checkbox>
			</view>
			<view @click="submit" class="sure-btn u-text-center">确定</view>
		</u-form>
	</view>
</template>

<script>
import { AjaxApi, PromiseAll, SHARE_URL } from "@/utils/api";
export default {
	data() {
		return {
			check: false, //常用位置标志
			adr: "",
			adrnotes: "",
			maxlength: 120,
			model: {
				relationPerson: "",
				sex: "0",
				phone: "",
				address: "选择收货地址",
				mark: 0,
				isDefault: 1,
				province: "",
				provinceId: "", //368100160330145792
				city: "",
				cityId: "", //368100160359505920
				area: "",
				areaId: "", //368100160531472384
			},
			labelWidth: {
				//label样式
				"font-size": "16px",
				"font-weight": "bold",
				color: "#1C1C1D",
			},
			radioList: [
				//性别选择配置列表
				{
					name: "先生",
					checked: true,
					value: "0",
				},
				{
					name: "女士",
					checked: false,
					value: "1",
				},
			],
			tagList: [
				//标签列表
				{
					type: "公司",
					value: "0",
				},
				{
					type: "学校",
					value: "1",
				},
				{
					type: "家",
					value: "2",
				},
			],
			rules: {
				relationPerson: [
					{
						required: true,
						message: "请输入姓名",
						trigger: "blur",
					},
					{ min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" },
				],
				phone: [
					{
						required: true,
						message: "请输入手机号",
						trigger: ["change", "blur"],
					},
					{
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.mobile(value);
						},
						message: "手机号码不正确",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"],
					},
				],
				address: [
					{
						required: true,
						message: "请输入详细地址",
						trigger: ["change", "blur"],
					},
				],
			},
		};
	},
	watch: {
		"model.address"(val) {
			return (this.maxlength = 120 - val.length);
		},
		adrnotes(val) {
			if (this.adrnotes.length == this.maxlength) {
				uni.showToast({
					title: `地址超长,请尽量简洁!`,
					icon: "none",
					mask: true,
					duration: 2000,
				});
			}
		},
	},
	onShow() {
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1];
		if (currPage.data.adrN == undefined || currPage.data.adrN == "") {
		} else {
			this.adr = currPage.data.adrN;
			this.model.address = currPage.data.addressN;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad(query) {
		const unary = fn => val => fn(val);
	},
	onShareAppMessage: function (res) {
		return {
			title: "进入餐典到了",
			imageUrl: SHARE_URL,
			path: `/pages/index/index`,
		};
	},
	methods: {
		turnToMap() {
			uni.showLoading({
				title: "正在获取定位",
				mask: true,
			});
			const that = this;
			uni.getSetting({
				success(res) {
					if (res.authSetting["scope.userLocation"]) {
						uni.getLocation({
							type: "gcj02",
							success(res) {
								uni.hideLoading();
								let LOC = "";
								if (that.model.city !== "") {
									LOC = that.model.province + that.model.city + that.model.area + that.model.address;
								}
								uni.navigateTo({
									url: `/pagesB/chooseAddress/chooseAddress?location=${res.longitude},${res.latitude}&LOC=${LOC}`,
								});
								return;
							},
							fail(res) {
								uni.hideLoading();
								uni.showModal({
									title: "提示",
									content: "请先打开系统定位！",
									success: function (res) {
										if (res.confirm) {
										} else if (res.cancel) {
										}
									},
								});
							},
						});
					} else if (res.authSetting["scope.userLocation"] == false) {
						uni.hideLoading();
						uni.openSetting();
					} else {
						uni.authorize({
							scope: "scope.userLocation",
							success() {
								uni.hideLoading();
								let LOC = "";
								if (that.model.city !== "") {
									LOC = that.model.province + that.model.city + that.model.area + that.model.address;
								}
								uni.navigateTo({
									url: `/pagesB/chooseAddress/chooseAddress?location=${res.longitude},${res.latitude}&LOC=${LOC}`,
								});
								return;
							},
							fail(res) {
								uni.hideLoading();
							},
						});
					}
				},
			});
		},
		radioChange(i) {
			//性别选择按钮
			this.radioList = this.radioList.map((it, inx) => {
				it.checked = i == inx ? true : false;
				return it;
			});
			this.model.sex = this.radioList[i].value;
		},
		cityChange(e) {
			//地区选择确认
			this.adr = {
				province: e.province.label,
				city: e.city.label,
				area: e.area.label,
			};
			this.model.province = e.province.label;
			this.model.provinceId = e.province.value;
			this.model.city = e.city.label;
			this.model.cityId = e.city.value;
			this.model.area = e.area.label;
			this.model.areaId = e.area.value;
		},
		chooseTag(e) {
			//标签选择事件
			this.model.mark = e;
		},
		checkboxChange(e) {
			//是否通用选择事件
			if (e.value) {
				this.model.isDefault = 0;
			} else {
				this.model.isDefault = 1;
			}
		},
		submit(e) {
			//提交按钮
			if (!this.adr) {
				uni.showToast({
					title: `请选择地址`,
					icon: "none",
					mask: true,
					duration: 2000,
				});
				return;
			}
			this.$refs.uForm.validate(valid => {
				if (valid) {
					uni.showLoading({
						title: "加载中",
						mask: true,
					});
					this.model.address = this.model.address + this.adrnotes;
					this.model = { ...this.model, ...this.adr };
					let params = this.model;
					let successFuc = res => {
						uni.navigateBack();
					};
					AjaxApi("SaveAddress", params, successFuc);
				} else {
					console.log("验证失败");
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	/deep/.u-radio__icon-wrap--checked {
		.u-icon__icon {
			color: #343434 !important;
		}
	}
	padding-top: 20rpx;
	.form-top {
		background: #fff;
		width: 100%;
		padding: 0rpx 40rpx;

		.placeHolder-style {
			color: #ababaf;
			font-size: 28rpx;
		}
		.radio {
			display: inline-block;
			width: 120rpx;
			text-align: center;
			line-height: 60rpx;
			height: 60rpx;
			background: #ffffff;
			border-radius: 10rpx;
			border: 2rpx solid #f1f1f4;
			font-size: 28rpx;
			color: #1c1c1d;
			&.checked {
				border: 2rpx solid #fe6b00;
				color: #fe6b00;
			}
		}
	}
	.agreement {
		height: 100rpx;
		padding: 0rpx 40rpx;
		display: flex;
		align-items: center;
		text {
			font-size: 20rpx;
			line-height: 100rpx;
			color: #666666;
		}
	}
	.tag {
		.text {
			width: 156rpx;
		}
		.span-style {
			width: 120rpx;
			line-height: 60rpx;
			text-align: center;
			height: 60rpx;
			background: #ffffff;
			border-radius: 10rpx;
			border: 2rpx solid #f1f1f4;
			font-size: 28rpx;
			color: #1c1c1d;
		}
		.span-choose {
			border: 2rpx solid #fe6b00;
			color: #fe6b00;
		}
	}
	.sure-btn {
		width: 670rpx;
		box-sizing: border-box;
		height: 96rpx;
		background: #fe6b00;
		border-radius: 48rpx;
		line-height: 96rpx;
		color: #fff;
		font-size: 32rpx;
		margin: 0 auto;
		font-weight: bold;
	}
}
</style>
