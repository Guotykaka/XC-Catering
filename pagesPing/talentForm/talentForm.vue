<template>
  <!-- 申请推广达人 -->
  <view class="container">
    <view class="form">
      <view class="form-item u-m-t-20">
        <text class="label">手机号</text>
        <input
          class="r"
          :maxlength="11"
          v-model="form.phone"
          placeholder="请输入手机号"
        />
      </view>

      <view class="form-item u-m-t-20">
        <text class="label">姓名</text>
        <input
          class="r"
          :maxlength="30"
          v-model="form.name"
          placeholder="请输入姓名"
        />
      </view>

      <view class="form-item u-m-t-20" @click="ageOptions.show = true">
        <text class="label">年龄</text>
        <view class="r">
          <text>{{ ageLabel }}</text>
          <text class="iconfont icon-arrow-down"></text>
        </view>
      </view>

      <view class="form-item u-m-t-20" @click="jobOptions.show = true">
        <text class="label">职业</text>
        <view class="r">
          <text>{{ jobLabel }}</text>
          <text class="iconfont icon-arrow-down"></text>
        </view>
      </view>

      <view class="btm">
        <view class="submit-btn" @click="submitForm">申请成为推广达人</view>
      </view>
    </view>

    <!-- 选择年龄 -->
    <u-select
      v-model="ageOptions.show"
      :list="ageOptions.list"
      @confirm="selectAge"
    ></u-select>

    <!-- 选择职业 -->
    <u-select
      v-model="jobOptions.show"
      :list="jobOptions.list"
      @confirm="selectJob"
    ></u-select>
  </view>
</template>

<script>
import { AjaxApi } from "@/utils/api";

export default {
  components: {},
  data() {
    return {
      form: {
        phone: getApp().globalData.UserInfo.phone,
        name: "",
        age: "0", // 年龄,0:20岁以下,1:20-30,2:30-40,3:40-50,4:50以上
        job: "0", // 职业,0:宝妈,1:学生,2:公司职员,3:个体户,4:酒店工作人员,5:其他
      },
      agentId: "",
      ageOptions: {
        list: [
          { value: "0", label: "20岁以下" },
          { value: "1", label: "20-30岁" },
          { value: "2", label: "30-40岁" },
          { value: "3", label: "40-50岁" },
          { value: "4", label: "50岁以上" },
        ],
        show: false,
      },
      jobOptions: {
        list: [
          { value: "0", label: "宝妈" },
          { value: "1", label: "学生" },
          { value: "2", label: "公司职员" },
          { value: "3", label: "个体户" },
          { value: "4", label: "酒店工作人员" },
          { value: "5", label: "其他" },
        ],
        show: false,
      },
      submitLoading: false,
    };
  },
  onHide() {},
  computed: {
    ageLabel() {
      return (
        (this.form.age || this.form.age === 0) &&
        this.ageOptions.list.find((i) => i.value === this.form.age + "").label
      );
    },
    jobLabel() {
      return (
        (this.form.job || this.form.job === 0) &&
        this.jobOptions.list.find((i) => i.value === this.form.job + "").label
      );
    },
  },
  onLoad(option) {
    this.agentId = option.agentId;
    console.log(this.agentId);
  },
  async onShow() {},
  methods: {
    /**
     * 选择年龄
     */
    selectAge(e) {
      this.form.age = e[0].value;
    },
    /**
     * 选择职业
     */
    selectJob(e) {
      this.form.job = e[0].value;
    },
    /**
     * 表单验证
     */
    validate() {
      if (!this.form.phone) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return false;
      }

      if (this.form.phone && !this.$u.test.mobile(this.form.phone)) {
        uni.showToast({
          title: "手机号格式错误！",
          icon: "none",
        });
        return false;
      }

      if (!this.form.name) {
        uni.showToast({
          title: "请输入姓名",
          icon: "none",
        });
        return false;
      }

      // 年龄,0:20岁以下,1:20-30,2:30-40,3:40-50,4:50以上
      if (!this.form.age) {
        uni.showToast({
          title: "请选择年龄",
          icon: "none",
        });
        return false;
      }

      // 职业,0:宝妈,1:学生,2:公司职员,3:个体户,4:酒店工作人员,5:其他
      if (!this.form.job) {
        uni.showToast({
          title: "请选择职业",
          icon: "none",
        });
        return false;
      }

      return true;
    },
    /**
     * 提交表单
     */
    submitForm() {
      if (this.submitLoading) return false;
      if (!this.validate()) return false;

      const params = Object.assign(
        {
          agentId: this.agentId, //推广大使Id
          // recommendId: "", //推荐人Id
          recommendUserId: getApp().globalData.UserInfo.userId, //达人用户Id
          // recommendUserId: 643, //达人用户Id
        },
        this.form
      );
      console.log(params);

      this.submitLoading = true;
      uni.showLoading({
        title: "操作中",
        mask: true,
      });
      let successFuc = (res) => {
        uni.hideLoading();
        this.submitLoading = false;

        uni.showToast({
          title: "申请成功!",
          icon: "none",
          duration: 2000,
          success: () => {
            uni.switchTab({
              url: "/pages/index/index",
            });
          },
        });
      };
      AjaxApi("ApplyGroupRecommend", params, successFuc);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #fff;
  .btm {
    padding: 80rpx 40rpx;
    .submit-btn {
      line-height: 100rpx;
      // background-image: linear-gradient(180deg, #ffe100 0%, #ffa300 100%);
      background-color: #fe6b00;
      border-radius: 50rpx;
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
    }
  }

  .form {
    border-top: 1rpx solid #f6f6f7;
    .form-item {
      display: flex;
      align-items: center;
      height: 110rpx;
      background-color: #fff;
      padding: 0 30rpx;
      .label {
        width: 130rpx;
        text-align: justify;
        text-align-last: justify;
        text-justify: distribute-all-lines;
        font-weight: bold;
        padding: 0 20rpx;
      }
      .r {
        flex: 1;
        background-color: #f6f6f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 40rpx;
        border-radius: 100rpx;
        .icon-arrow-down {
          margin-left: 20rpx;
          font-size: 16rpx;
        }
      }
    }
  }
}
</style>
