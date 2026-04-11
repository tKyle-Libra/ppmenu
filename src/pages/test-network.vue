<template>
  <view class="test-page">
    <view class="header">网络请求测试</view>

    <view class="section">
      <text class="label">测试 URL：</text>
      <text class="url">{{ testUrl }}</text>
    </view>

    <view class="section">
      <button @click="testRequest" class="btn">测试网络请求</button>
    </view>

    <view class="section">
      <text class="label">结果：</text>
      <text class="result">{{ result }}</text>
    </view>

    <view class="section">
      <text class="label">错误信息：</text>
      <text class="error">{{ error }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      testUrl: 'https://raw.githubusercontent.com/tKyle-Libra/ppmenu_assets_test/main/db/data-page1.json',
      result: '',
      error: ''
    }
  },
  methods: {
    testRequest() {
      this.result = '请求中...'
      this.error = ''

      console.log('测试 URL:', this.testUrl)

      // 方法1: 使用 uni.request
      uni.request({
        url: this.testUrl,
        method: 'GET',
        success: (res) => {
          console.log('成功:', res)
          this.result = '成功！statusCode=' + res.statusCode
        },
        fail: (err) => {
          console.error('失败:', err)
          this.error = JSON.stringify(err)
        }
      })

      // 方法2: 使用 fetch (如果支持)
      // fetch(this.testUrl)
      //   .then(response => response.json())
      //   .then(data => {
      //     this.result = '成功！数据长度=' + data.length
      //   })
      //   .catch(error => {
      //     this.error = JSON.stringify(error)
      //   })
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
}

.header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.url {
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.btn {
  background-color: #007AFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
}

.result {
  color: #4CD964;
}

.error {
  color: #FF3B30;
  word-break: break-all;
}
</style>
