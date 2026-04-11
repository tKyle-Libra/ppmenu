/**
 * 本地数据加载模块
 * 用于解决抖音小程序网络请求问题
 */

// 导入第一页数据作为示例
import page1Data from '@/static/data-page1.json'

/**
 * 从本地加载数据
 * @param {number} pageNum - 页码
 * @returns {Promise<Array>} 商品数据数组
 */
export async function loadPageDataLocal(pageNum) {
  try {
    console.log('从本地加载第' + pageNum + '页数据')

    // 这里可以导入更多页面的数据
    // 为了演示，我们只导入第一页
    if (pageNum === 1) {
      return page1Data
    } else {
      console.warn('本地只有第1页数据，第' + pageNum + '页返回空数组')
      return []
    }
  } catch (error) {
    console.error('本地数据加载失败:', error)
    return []
  }
}

/**
 * 获取总页数
 * @returns {number} 总页数
 */
export function getTotalPages() {
  return 1 // 本地数据只有1页
}