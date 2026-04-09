/**
 * 数据加载工具
 * 从 GitHub CDN 动态加载数据
 */

import { loadPageData as loadPageFromRequest } from './request.js'

const pageCache = new Map()

/**
 * 加载指定页的数据
 * @param {number} pageNum - 页码（从1开始）
 * @returns {Promise<Array>} 商品数据数组
 */
export async function loadPageData(pageNum) {
  try {
    console.log(`加载第${pageNum}页数据`)

    // 检查缓存
    if (pageCache.has(pageNum)) {
      console.log(`使用缓存: 第${pageNum}页`)
      return pageCache.get(pageNum)
    }

    // 从 GitHub CDN 加载数据
    const data = await loadPageFromRequest(pageNum)

    // 存入缓存
    pageCache.set(pageNum, data)

    console.log(`加载成功: 第${pageNum}页, ${data.length}条`)

    return data
  } catch (error) {
    console.error(`加载第${pageNum}页数据失败:`, error)
    return []
  }
}

/**
 * 清除缓存
 */
export function clearPageCache() {
  pageCache.clear()
}
