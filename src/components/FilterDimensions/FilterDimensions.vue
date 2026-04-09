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
    },
    currentFilters: {
      type: Object,
      default: () => ({
        isNew: 'all',
        petType: 'all',
        productType: 'all',
        isSnacks: 'all'
      })
    }
  },
  watch: {
    currentFilters: {
      handler(newFilters) {
        // 当父组件更新筛选条件时，同步更新UI状态
        console.log('FilterDimensions: 接收到筛选条件更新', newFilters)

        // 根据筛选值找到对应的选项ID
        this.activeFilter1 = this.findOptionId(1, newFilters.isNew)
        this.activeFilter2 = this.findOptionId(2, newFilters.petType)
        this.activeFilter3 = this.findOptionId(3, newFilters.productType)
        this.activeFilter4 = this.findOptionId(4, newFilters.isSnacks)
      },
      deep: true,
      immediate: false
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
      activeFilter4: 'all'
    }
  },
  methods: {
    handleFilterChange(dimensionId, item) {
      // 更新UI状态
      if (dimensionId === 1) {
        this.activeFilter1 = item.id
      } else if (dimensionId === 2) {
        this.activeFilter2 = item.id
      } else if (dimensionId === 3) {
        this.activeFilter3 = item.id
      } else if (dimensionId === 4) {
        this.activeFilter4 = item.id
      }

      // 构建筛选条件对象
      const filters = {
        isNew: dimensionId === 1 ? item.value : this.currentFilters.isNew,
        petType: dimensionId === 2 ? item.value : this.currentFilters.petType,
        productType: dimensionId === 3 ? item.value : this.currentFilters.productType,
        isSnacks: dimensionId === 4 ? item.value : this.currentFilters.isSnacks
      }

      // 触发筛选事件
      this.$emit('filter-change', filters)
    },

    /**
     * 根据筛选值找到对应的选项ID
     * @param {number} dimensionId - 维度ID（1-4）
     * @param {string} value - 筛选值
     * @returns {string} 选项ID
     */
    findOptionId(dimensionId, value) {
      let options = []

      if (dimensionId === 1) {
        options = this.dimension1
      } else if (dimensionId === 2) {
        options = this.dimension2
      } else if (dimensionId === 3) {
        options = this.dimension3
      } else if (dimensionId === 4) {
        options = this.dimension4
      }

      // 查找匹配的选项
      const option = options.find(opt => opt.value === value)
      return option ? option.id : 'all'
    }
  }
}
</script>

<style scoped>
.filter-dimensions {
  position: sticky;
  top: 0;
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
