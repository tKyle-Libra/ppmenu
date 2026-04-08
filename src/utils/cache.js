/**
 * 数据缓存管理
 */

/**
 * 内存缓存
 */
const memoryCache = new Map()

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 */
export function setCache(key, value) {
  memoryCache.set(key, {
    data: value,
    timestamp: Date.now()
  })

  // 同时持久化到本地存储
  try {
    uni.setStorageSync(key, {
      data: value,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('本地存储失败:', error)
  }
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @param {number} maxAge - 最大缓存时间（毫秒），默认1小时
 * @returns {any|null} 缓存值或null
 */
export function getCache(key, maxAge = 60 * 60 * 1000) {
  // 先从内存获取
  const memData = memoryCache.get(key)
  if (memData) {
    const age = Date.now() - memData.timestamp
    if (age < maxAge) {
      return memData.data
    }
    // 过期，删除
    memoryCache.delete(key)
  }

  // 从本地存储获取
  try {
    const localData = uni.getStorageSync(key)
    if (localData) {
      const age = Date.now() - localData.timestamp
      if (age < maxAge) {
        // 恢复到内存缓存
        memoryCache.set(key, localData)
        return localData.data
      }
      // 过期，删除
      uni.removeStorageSync(key)
    }
  } catch (error) {
    console.error('读取本地存储失败:', error)
  }

  return null
}

/**
 * 清除缓存
 * @param {string} key - 缓存键，不传则清除所有
 */
export function clearCache(key) {
  if (key) {
    memoryCache.delete(key)
    try {
      uni.removeStorageSync(key)
    } catch (error) {
      console.error('删除本地存储失败:', error)
    }
  } else {
    memoryCache.clear()
    try {
      uni.clearStorageSync()
    } catch (error) {
      console.error('清除本地存储失败:', error)
    }
  }
}

/**
 * 获取页面缓存键
 * @param {number} pageNum - 页码
 * @returns {string} 缓存键
 */
export function getPageCacheKey(pageNum) {
  return `product_page_${pageNum}`
}
