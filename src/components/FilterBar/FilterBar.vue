<template>
  <view class="filter-bar">
    <scroll-view
      class="filter-scroll"
      scroll-x="true"
      show-scrollbar="false"
      :scroll-left="scrollLeft"
    >
      <view class="filter-content">
        <view
          v-for="(item, index) in filterOptions"
          :key="item.id"
          class="filter-item"
          :class="{ active: activeFilter === item.id }"
          @tap="handleFilterChange(item)"
        >
          <text class="filter-text">{{ item.name }}</text>
          <text v-if="item.id !== 'all'" class="filter-count">({{ item.count }})</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import filterCategories from '@/data/filter-categories.json'

export default {
  name: 'FilterBar',
  data() {
    return {
      scrollLeft: 0,
      filterOptions: filterCategories,
      activeFilter: 'all'
    }
  },
  methods: {
    handleFilterChange(item) {
      this.activeFilter = item.id
      this.$emit('filter-change', item)

      // 滚动到选中的项
      this.scrollToActive(item.id)
    },

    scrollToActive(id) {
      // 计算滚动位置
      const index = this.filterOptions.findIndex(item => item.id === id)
      if (index > 2) {
        this.scrollLeft = (index - 2) * 140
      } else {
        this.scrollLeft = 0
      }
    }
  }
}
</script>

<style scoped>
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
}

.filter-scroll {
  width: 100%;
  white-space: nowrap;
}

.filter-content {
  display: inline-flex;
  padding: 20rpx 24rpx;
  white-space: nowrap;
}

.filter-item {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.filter-item.active {
  background-color: #ff6b6b;
}

.filter-text {
  font-size: 28rpx;
  color: #666666;
}

.filter-count {
  font-size: 24rpx;
  color: #999999;
}

.filter-item.active .filter-text,
.filter-item.active .filter-count {
  color: #ffffff;
}
</style>
