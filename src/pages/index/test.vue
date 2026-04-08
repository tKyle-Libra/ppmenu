<template>
  <view class="test-page">
    <text class="title">🧪 测试页面</text>
    <text class="status">{{ status }}</text>
    <text class="data-info">{{ dataInfo }}</text>

    <!-- 显示加载的数据 -->
    <view v-if="products.length > 0" class="product-list">
      <text class="list-title">商品列表（前3条）：</text>
      <view v-for="(item, index) in products.slice(0, 3)" :key="index" class="product-item">
        <text>{{ index + 1 }}. {{ item.product_name }} - ¥{{ item.product_price }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { loadPageData } from '@/utils/data.js'

export default {
  data() {
    return {
      status: '正在初始化...',
      dataInfo: '等待加载',
      products: []
    }
  },
  onLoad() {
    console.log('=== 测试页面 onLoad ===')
    this.status = '页面已加载'
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        console.log('开始加载数据...')
        this.status = '正在加载...'

        const data = await loadPageData(1)
        console.log('数据加载成功:', data.length, data[0])

        this.products = data
        this.dataInfo = `✅ 成功加载 ${data.length} 条数据`
        this.status = '加载完成'

      } catch (error) {
        console.error('数据加载失败:', error)
        this.dataInfo = `❌ 加载失败: ${error.message}`
        this.status = '加载失败'
      }
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  color: #333;
}

.status {
  display: block;
  font-size: 32rpx;
  margin-bottom: 20rpx;
  color: #666;
}

.data-info {
  display: block;
  font-size: 28rpx;
  color: #999;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 40rpx;
}

.product-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.list-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.product-item {
  padding: 16rpx;
  border-bottom: 1rpx solid #eee;
}

.product-item text {
  font-size: 28rpx;
  color: #666;
}
</style>
