<template>
  <view class="product-list">
    <!-- 正常商品列表 -->
    <view
      v-for="(product, index) in products"
      :key="product.id"
      class="list-item"
    >
      <ProductCard :product="product" :lazy-load="index < 15" />
    </view>

    <!-- 骨架屏：筛选重置期间显示 -->
    <ProductListSkeleton v-if="showSkeleton" :count="3" />

    <!-- 空状态：立即显示（不延迟） -->
    <view v-if="products.length === 0 && !loading && !isFiltering" class="empty-state">
      <view class="empty-icon">📦</view>
      <text class="empty-text">暂无商品</text>
      <text class="empty-hint">试试切换其他筛选条件</text>
    </view>
  </view>
</template>

<script>
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import ProductListSkeleton from '@/components/ProductListSkeleton/ProductListSkeleton.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard,
    ProductListSkeleton
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    isFiltering: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showSkeleton() {
      return this.isFiltering || this.loading
    }
  }
}
</script>

<style scoped>
.product-list {
  padding: 24rpx;
}

.list-item {
  margin-bottom: 20rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 160rpx 0;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-top: 20rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #999999;
}
</style>
