<template>
  <view
    class="filter-dimensions"
    :class="{ 'with-banner': bannerVisible }"
  >
    <!-- 维度1：新品筛选 -->
    <view class="filter-row">
      <view class="filter-content">
        <view
          v-for="item in dimension1"
          :key="item.id"
          class="filter-item"
          :class="{ active: activeFilter1 === item.id }"
          @tap="handleFilterChange(1, item)"
        >
          <text class="filter-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 维度2：宠物类型 -->
    <view class="filter-row">
      <view class="filter-content">
        <view
          v-for="item in dimension2"
          :key="item.id"
          class="filter-item"
          :class="{ active: activeFilter2 === item.id }"
          @tap="handleFilterChange(2, item)"
        >
          <text class="filter-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 维度3：商品类型 -->
    <view class="filter-row">
      <view class="filter-content">
        <view
          v-for="item in dimension3"
          :key="item.id"
          class="filter-item"
          :class="{ active: activeFilter3 === item.id }"
          @tap="handleFilterChange(3, item)"
        >
          <text class="filter-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 维度4：零食（暂时注释） -->
    <!-- <view class="filter-row">
      <view class="filter-content">
        <view
          v-for="item in dimension4"
          :key="item.id"
          class="filter-item"
          :class="{ active: activeFilter4 === item.id }"
          @tap="handleFilterChange(4, item)"
        >
          <text class="filter-text">{{ item.name }}</text>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
import filterConfig from '@/data/filter-dimensions.json'

export default {
  name: 'FilterDimensions',
  props: {
    bannerVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dimension1: filterConfig.dimensions[0].options,
      dimension2: filterConfig.dimensions[1].options,
      dimension3: filterConfig.dimensions[2].options,
      dimension4: filterConfig.dimensions[3].options,
      activeFilter1: 'all',
      activeFilter2: 'all',
      activeFilter3: 'all',
      activeFilter4: 'all',
      currentFilters: {
        isNew: '',
        petType: '',
        productType: '',
        isSnacks: ''
      }
    }
  },
  methods: {
    handleFilterChange(dimensionId, item) {
      // 只重置当前维度的选项
      if (dimensionId === 1) {
        this.activeFilter1 = item.id
        this.currentFilters.isNew = item.value
      } else if (dimensionId === 2) {
        this.activeFilter2 = item.id
        this.currentFilters.petType = item.value
      } else if (dimensionId === 3) {
        this.activeFilter3 = item.id
        this.currentFilters.productType = item.value
      } else if (dimensionId === 4) {
        this.activeFilter4 = item.id
        this.currentFilters.isSnacks = item.value
      }

      // 触发筛选事件
      this.$emit('filter-change', this.currentFilters)
    }
  }
}
</script>

<style scoped>
.filter-dimensions {
  position: relative;
  width: 100%;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
}

.filter-row {
  /* 无分割线 */
}

.filter-content {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 24rpx;
  gap: 12rpx;
}

.filter-item {
  padding: 10rpx 20rpx;
  background-color: transparent;
  border-radius: 60rpx;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.filter-item.active {
  background-color: rgba(255, 70, 70, 0.19);
}

.filter-text {
  font-size: 24rpx;
  color: #777777;
}

.filter-item.active .filter-text {
  color: #EA3A4D;
}
</style>
