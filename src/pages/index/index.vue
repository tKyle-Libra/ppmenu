<template>
  <view class="page">
    <!-- Banner 轮播 -->
    <!-- <BannerSwiper :show="bannerVisible" /> -->

    <!-- 三维筛选栏 -->
    <FilterDimensions :current-filters="currentFilters" @filter-change="handleFilterChange" />

    <!-- 商品列表 -->
    <ProductList :products="displayProducts" :loading="loading" />

    <!-- 加载状态 -->
    <LoadingState :loading="loading" :has-more="hasMore" />
  </view>
</template>

<script>
import { loadPageData } from '@/utils/data.js'
import { processTastes } from '@/utils/request.js'
import { TOTAL_PAGES } from '@/utils/config.js'
import filterConfig from '@/data/filter-dimensions.json'

export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
      allProducts: [], // 所有加载的商品数据
      displayProducts: [], // 显示的商品数据（筛选后）
      filteredProducts: [], // 筛选后的完整数据
      currentPage: 1, // 当前页码
      hasMore: true, // 是否有更多数据
      loading: false, // 加载状态
      bannerVisible: true, // Banner 是否可见
      lastScrollTop: 0, // 上次滚动位置
      currentFilters: {
        isNew: '', // 新品筛选
        petType: '', // 宠物类型
        productType: '', // 商品类型
        isSnacks: '' // 零食筛选
      },
      displayCount: 20, // 每页显示数量
      bannerHeight: 300, // Banner 高度
      typeNameMap: {} // 类型ID到名称的映射
    }
  },
  created() {
    console.log('🚀 ========== INDEX PAGE CREATED ==========')
    console.log('📅 代码版本: 2026-04-08 23:54')
    console.log('✨ 这条日志应该总是显示')

    // 在 created 中初始化 filterConfig
    this.filterConfig = filterConfig
    console.log('filterConfig 已初始化:', !!this.filterConfig)
    console.log('filterConfig dimensions:', this.filterConfig?.dimensions?.length)

    // 创建类型ID到名称的映射
    this.typeNameMap = {}
    const typeOptions = this.filterConfig.dimensions[2].options
    typeOptions.forEach(opt => {
      if (opt.type_id) {
        this.typeNameMap[opt.type_id] = opt.value
      }
    })
  },
  onLoad() {
    console.log('页面加载')
    this.loadFirstPage()
  },
  onReachBottom() {
    console.log('触底加载')
    this.loadMore()
  },
  onPageScroll(e) {
    this.handleScroll(e.scrollTop)
  },
  methods: {
    /**
     * 加载第一页数据
     */
    async loadFirstPage() {
      this.currentPage = 1
      this.allProducts = []
      this.displayProducts = []
      this.filteredProducts = []
      this.hasMore = true
      this.displayCount = 20

      // 首次加载时，并行加载所有数据
      console.log('📦 首次加载，正在并行加载所有数据...')
      console.log('TOTAL_PAGES:', TOTAL_PAGES)
      this.loading = true

      try {
        // 创建所有页面的加载任务
        const loadTasks = []
        for (let page = 1; page <= TOTAL_PAGES; page++) {
          loadTasks.push(
            loadPageData(page).then(data => ({ page, data }))
          )
        }

        // 并行加载所有页面
        const results = await Promise.all(loadTasks)

        // 按页码排序并处理数据
        results.sort((a, b) => a.page - b.page)

        for (const { page, data: pageData } of results) {
          const processedData = this.processData(pageData)
          console.log(`第${page}页: 原始${pageData.length}条 → 处理后${processedData.length}条`)
          this.allProducts = [...this.allProducts, ...processedData]
          this.currentPage = page
        }

        console.log(`✅ 所有数据加载完成，共${this.allProducts.length}条`)
        this.hasMore = false

        // 应用筛选，显示所有数据
        this.applyFilter()
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    /**
     * 加载指定页数据
     * @param {number} pageNum - 页码
     * @param {boolean} silent - 是否静默加载（不应用筛选）
     */
    async loadPage(pageNum, silent = false) {
      if (this.loading) return

      // 静默加载时，只检查是否还有更多页；正常加载时，检查 hasMore
      if (!silent && !this.hasMore) return
      if (silent && pageNum > TOTAL_PAGES) return

      this.loading = true

      try {
        // 从服务器加载数据
        const pageData = await loadPageData(pageNum)

        // 处理数据
        const processedData = this.processData(pageData)

        // 添加到所有商品列表
        this.allProducts = [...this.allProducts, ...processedData]

        // 如果不是静默加载，应用筛选
        if (!silent) {
          this.applyFilter()
          // applyFilter 会设置 hasMore
        } else {
          // 静默加载时，更新页码但不应用筛选
          this.currentPage = pageNum
          // 静默加载时，更新 hasMore 以便继续加载
          // 有两种情况可以继续加载：还有更多页，或者已加载的数据还未显示完
          this.hasMore = this.currentPage < TOTAL_PAGES || this.allProducts.length > this.displayProducts.length
        }

        console.log(`第${pageNum}页加载完成，本页${processedData.length}条`)
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    /**
     * 处理商品数据
     * @param {Array} rawData - 原始数据
     * @returns {Array} 处理后的数据
     */
    processData(rawData) {
      return rawData.map(item => ({
        ...item,
        // 映射所有字段，兼容 ProductCard 组件
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_img: item.image,
        product_weight: item.weight,
        product_is_new: item.isNew ? 1 : 0,
        product_eat_type: item.eatType,
        product_type_id: item.typeId,
        product_type_name: this.typeNameMap[item.typeId] || '',
        brand_name: item.brand,
        product_tastes: processTastes(item.tastes),
        is_snacks: item.is_snacks || false,
        // 保留原字段用于筛选
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        weight: item.weight,
        isNew: item.isNew,
        eatType: item.eatType,
        typeId: item.typeId,
        brand: item.brand,
        tastes: item.tastes
      }))
    },

    /**
     * 应用四维筛选条件
     */
    applyFilter() {
      console.log('===== applyFilter 开始 =====')
      console.log('当前筛选条件:', this.currentFilters)
      console.log('allProducts 总数:', this.allProducts.length)

      let filtered = this.allProducts

      // 维度1：新品筛选（'all' 或空字符串表示不筛选）
      if (this.currentFilters.isNew && this.currentFilters.isNew !== '' && this.currentFilters.isNew !== 'all') {
        const beforeLen = filtered.length
        filtered = filtered.filter(p => p.product_is_new === 1)
        console.log('✨ 新品筛选:', beforeLen, '→', filtered.length)
      }

      // 维度2：宠物类型筛选（'all' 或空字符串表示不筛选）
      if (this.currentFilters.petType && this.currentFilters.petType !== '' && this.currentFilters.petType !== 'all') {
        const beforeLen = filtered.length
        if (this.currentFilters.petType === 'cat') {
          filtered = filtered.filter(p => p.product_eat_type === 1)
        } else if (this.currentFilters.petType === 'dog') {
          filtered = filtered.filter(p => p.product_eat_type === 2)
        } else if (this.currentFilters.petType === 'universal') {
          filtered = filtered.filter(p => p.product_eat_type === 3)
        } else if (this.currentFilters.petType === 'young') {
          filtered = filtered.filter(p => p.is_young === 1)
        }
        console.log('🐱 宠物类型筛选:', this.currentFilters.petType, beforeLen, '→', filtered.length)
      }

      // 维度3：商品类型筛选（'all' 或空字符串表示不筛选）
      if (this.currentFilters.productType && this.currentFilters.productType !== '' && this.currentFilters.productType !== 'all') {
        const beforeLen = filtered.length

        // 直接使用导入的 filterConfig（不通过 this）
        const typeConfig = filterConfig.dimensions[2].options.find(
          opt => opt.value === this.currentFilters.productType
        )
        const targetTypeId = typeConfig?.type_id

        console.log('📦 商品类型筛选:', this.currentFilters.productType, '→ type_id:', targetTypeId)

        if (targetTypeId) {
          filtered = filtered.filter(p => p.product_type_id === targetTypeId)
          console.log('✅ 筛选结果:', beforeLen, '→', filtered.length, '条')
        } else {
          console.warn('⚠️ 未找到类型配置:', this.currentFilters.productType)
        }
      }

      // 维度4：零食筛选（暂时注释）
      // if (this.currentFilters.isSnacks && this.currentFilters.isSnacks !== '' && this.currentFilters.isSnacks !== 'all') {
      //   filtered = filtered.filter(p => p.is_snacks === parseInt(this.currentFilters.isSnacks))
      // }

      // 保存筛选后的完整数据
      this.filteredProducts = filtered

      // 只显示前20条（或 displayCount 条）
      this.displayProducts = filtered.slice(0, this.displayCount)

      // 判断是否有更多数据（比较筛选结果总数和当前显示数量）
      this.hasMore = filtered.length > this.displayProducts.length

      console.log('最终结果:', filtered.length, '条，显示', this.displayProducts.length, '条')
      console.log('===== applyFilter 结束 =====')
    },

    /**
     * 检查是否有激活的筛选条件
     * 'all' 或空字符串表示不筛选
     */
    hasActiveFilters() {
      return !!(
        (this.currentFilters.isNew && this.currentFilters.isNew !== '' && this.currentFilters.isNew !== 'all') ||
        (this.currentFilters.petType && this.currentFilters.petType !== '' && this.currentFilters.petType !== 'all') ||
        (this.currentFilters.productType && this.currentFilters.productType !== '' && this.currentFilters.productType !== 'all')
        // isSnacks 暂时注释
      )
    },

    /**
     * 加载更多
     */
    loadMore() {
      if (this.loading || !this.hasMore) return

      // 检查是否有筛选条件（通过比较 allProducts 和 filteredProducts）
      const hasFilters = this.hasActiveFilters()

      // 如果有筛选条件，显示更多筛选结果
      if (hasFilters && this.filteredProducts.length > this.displayProducts.length) {
        const currentLength = this.displayProducts.length
        const nextLength = Math.min(currentLength + this.displayCount, this.filteredProducts.length)
        this.displayProducts = this.filteredProducts.slice(0, nextLength)
        this.hasMore = nextLength < this.filteredProducts.length
        console.log(`加载更多筛选结果: ${currentLength} -> ${nextLength}`)
        return
      }

      // 如果没有筛选条件或筛选结果已全部显示，加载下一页
      if (this.currentPage < TOTAL_PAGES) {
        const nextPage = this.currentPage + 1
        this.loadPage(nextPage)
      } else if (!hasFilters && this.allProducts.length > this.displayProducts.length) {
        // 所有页已加载完，但还有未显示的数据
        const currentLength = this.displayProducts.length
        const nextLength = Math.min(currentLength + this.displayCount, this.allProducts.length)
        this.displayProducts = this.allProducts.slice(0, nextLength)
        this.hasMore = nextLength < this.allProducts.length
        console.log(`加载更多已加载数据: ${currentLength} -> ${nextLength}`)
      }
    },

    /**
     * 处理页面滚动
     * @param {number} scrollTop - 滚动距离
     */
    handleScroll(scrollTop) {
      const delta = scrollTop - this.lastScrollTop

      // 上滑：隐藏 Banner
      if (delta > 10 && scrollTop > 100) {
        this.bannerVisible = false
      }
      // 下滑：显示 Banner
      else if (delta < -10) {
        this.bannerVisible = true
      }

      this.lastScrollTop = scrollTop
    },

    /**
     * 处理筛选条件变化
     * @param {Object} filters - 筛选条件对象
     */
    async handleFilterChange(filters) {
      console.log('筛选条件变化:', filters)
      this.currentFilters = { ...filters }

      // 检查是否需要加载所有数据
      if (this.currentPage < TOTAL_PAGES) {
        console.log('正在加载所有数据以进行筛选...')
        uni.showLoading({
          title: '加载中...',
          mask: true
        })

        // 加载所有剩余页面（使用静默模式）
        for (let page = this.currentPage + 1; page <= TOTAL_PAGES; page++) {
          try {
            await this.loadPage(page, true)
          } catch (error) {
            console.error(`加载第${page}页失败:`, error)
          }
        }

        uni.hideLoading()
        console.log(`所有数据加载完成，共${this.allProducts.length}条`)
      }

      // 应用筛选
      this.applyFilter()

      uni.pageScrollTo({ scrollTop: 0, duration: 300 })

      // 提示用户
      const filterText = []
      if (filters.isNew) filterText.push('新品')
      if (filters.petType === 'cat') filterText.push('猫')
      if (filters.petType === 'dog') filterText.push('狗')
      if (filters.petType === 'universal') filterText.push('通用')
      if (filters.petType === 'young') filterText.push('幼猫')
      if (filters.productType) filterText.push(filters.productType)
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.banner-placeholder {
  width: 100%;
  transition: height 0.3s ease-in-out;
}
</style>
