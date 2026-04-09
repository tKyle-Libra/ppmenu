<template>
  <view class="skeleton-list">
    <view
      v-for="n in count"
      :key="n"
      class="skeleton-item"
    >
      <!-- 图片骨架 -->
      <view class="skeleton-image"></view>

      <!-- 标签骨架 -->
      <view class="skeleton-tags">
        <view class="skeleton-tag"></view>
        <view class="skeleton-tag"></view>
      </view>

      <!-- 标题骨架 -->
      <view class="skeleton-title"></view>

      <!-- 价格骨架 -->
      <view class="skeleton-price"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductListSkeleton',
  props: {
    count: {
      type: Number,
      default: 3
    }
  }
}
</script>

<style scoped>
.skeleton-list {
  padding: 24rpx;
}

.skeleton-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

/* 图片骨架 */
.skeleton-image {
  width: 100%;
  height: 400rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

/* 标签骨架 */
.skeleton-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.skeleton-tag {
  width: 80rpx;
  height: 40rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20rpx;
}

/* 标题骨架 */
.skeleton-title {
  width: 80%;
  height: 40rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}

/* 价格骨架 */
.skeleton-price {
  width: 120rpx;
  height: 48rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8rpx;
}

/* 闪烁动画 */
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
