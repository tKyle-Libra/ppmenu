<template>
  <view class="product-card">
    <!-- 商品图片 -->
    <view class="product-image-wrapper">
      <image
        class="product-image"
        :src="currentImageUrl"
        mode="aspectFill"
        :lazy-load="lazyLoad"
        :show-menu-by-longpress="false"
        :enable-auto-play="false"
        @load="onImageLoad"
        @error="onImageError"
      />

      <!-- 加载中占位符 -->
      <view v-if="imageLoading" class="image-loading">
        <text class="loading-icon">⏳</text>
      </view>

      <!-- 加载失败占位符 -->
      <view v-if="imageError && !imageLoading" class="image-error">
        <text class="error-icon">📷</text>
      </view>

      <!-- 左上角：类型标签 -->
      <view class="label label-type">
        {{ product.product_type_name }}
      </view>

      <!-- 左下角：重量标签 -->
      <view v-if="product.product_weight && product.product_weight !== '0' && product.product_weight !== ''" class="label label-weight">
        {{ product.product_weight }}
      </view>

      <!-- 右下角：新品标签 -->
      <view v-if="product.product_is_new === 1" class="label label-new">
        新品
      </view>

      <!-- 右上角：宠物类型 -->
      <view class="label label-pet">
        <text v-if="product.product_eat_type === 1">🐱</text>
        <text v-if="product.product_eat_type === 2">🐶</text>
        <text v-if="product.product_eat_type === 3">🐱🐶</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="product-info">
      <view class="product-title">
        <text>{{ displayName }}</text>
      </view>

      <!-- 口味标签 -->
      <view v-if="product.product_tastes.length > 0" class="product-tags">
        <view
          v-for="(taste, index) in product.product_tastes"
          :key="index"
          class="tag"
        >
          {{ taste }}
        </view>
      </view>

      <!-- 价格 -->
      <view class="product-price">
        <template v-if="product.product_price && product.product_price !== '0' && product.product_price !== ''">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ product.product_price }}</text>
        </template>
        <text v-else class="price-value">待出价</text>
      </view>
    </view>
  </view>
</template>

<script>
import { processThumbnailUrl, processImageUrl } from '@/utils/request.js'
import { BASE_URL } from '@/utils/config.js'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    displayName() {
      const p = this.product
      const sameName = p.brand_name.toLowerCase() === p.product_name.toLowerCase()
      const base = sameName
        ? p.brand_name
        : p.brand_name + p.product_name
      const suffixMap = {
        1: '主食酱包',
        3: '主食罐',
        4: '主食餐盒',
        7: p.is_snacks ? '零食冻干' : '主食冻干',
      }
      const suffix = suffixMap[p.product_type_id] || ''
      if (!suffix || base.includes(suffix)) return base
      return base + suffix
    }
  },
  data() {
    return {
      imageLoading: true,
      imageError: false,
      currentImageUrl: '',
      useDefaultImage: false,
      triedOriginal: false,
      triedDefault: false
    }
  },
  mounted() {
    this.currentImageUrl = this.getThumbnailUrl(this.product)
  },
  methods: {
    getThumbnailUrl(product) {
      if (!product.product_img) return ''
      return processThumbnailUrl(product.product_img, product.product_type_id, BASE_URL)
    },

    getOriginalUrl(product) {
      if (!product.product_img) return ''
      return processImageUrl(product.product_img, product.product_type_id, BASE_URL)
    },

    onImageLoad() {
      this.imageLoading = false
      this.imageError = false
    },

    onImageError() {
      if (!this.triedOriginal) {
        this.triedOriginal = true
        this.currentImageUrl = this.getOriginalUrl(this.product)
        return
      }

      if (!this.triedDefault) {
        this.triedDefault = true
        this.currentImageUrl = `${BASE_URL}default.jpg`
        this.imageLoading = false
        this.imageError = true
      }
    }
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 商品图片区域 */
.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
}

/* 标签通用样式 */
.label {
  position: absolute;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: bold;
  color: #ffffff;
}

.label-type {
  top: 16rpx;
  left: 16rpx;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
}

.label-weight {
  bottom: 16rpx;
  left: 16rpx;
  background-color: #ff9500;
}

.label-new {
  bottom: 16rpx;
  right: 16rpx;
  background-color: #ff3b30;
}

.label-pet {
  top: 16rpx;
  right: 16rpx;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  font-size: 22rpx;
}

/* 图片加载占位符 */
.image-loading,
.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.loading-icon,
.error-icon {
  font-size: 80rpx;
  opacity: 0.3;
}

.image-error {
  background-color: #fafafa;
}

/* 商品信息 */
.product-info {
  padding: 24rpx;
}

.product-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  line-height: 1.4;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 口味标签 */
.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background-color: rgba(247, 180, 76, 0.1);
  border-radius: 20rpx;
  font-size: 20rpx;
  color: #F7B44C;
}

/* 价格 */
.product-price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 24rpx;
  color: #ff3b30;
  margin-right: 4rpx;
}

.price-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff3b30;
}
</style>
