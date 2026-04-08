<template>
  <view class="loading-state">
    <view v-if="loading" class="loading-content">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="hasMore" class="loading-content">
      <text class="loading-text">上拉加载更多</text>
    </view>

    <view v-else class="loading-content">
      <text class="loading-text finished">已加载全部商品</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.loading-state {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.loading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #e5e5e5;
  border-top-color: #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 26rpx;
  color: #999999;
}

.loading-text.finished {
  color: #cccccc;
}
</style>
