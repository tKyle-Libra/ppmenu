<template>
  <view class="product-list">
    <view
      v-for="product in products"
      :key="product.product_id"
      class="list-item"
    >
      <ProductCard :product="product" />
    </view>

    <!-- 空状态 -->
    <view v-if="products.length === 0 && !loading" class="empty-state">
      <text class="empty-text">暂无商品数据</text>
    </view>
  </view>
</template>

<script>
import ProductCard from '@/components/ProductCard/ProductCard.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
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
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}
</style>
