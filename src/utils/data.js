/**
 * 数据加载工具
 * 直接导入所有数据页面，运行时分页返回
 */

// 导入所有数据页面
import page1 from '/public/db/data-page1.json'
import page2 from '/public/db/data-page2.json'
import page3 from '/public/db/data-page3.json'
import page4 from '/public/db/data-page4.json'
import page5 from '/public/db/data-page5.json'
import page6 from '/public/db/data-page6.json'
import page7 from '/public/db/data-page7.json'
import page8 from '/public/db/data-page8.json'
import page9 from '/public/db/data-page9.json'
import page10 from '/public/db/data-page10.json'
import page11 from '/public/db/data-page11.json'
import page12 from '/public/db/data-page12.json'
import page13 from '/public/db/data-page13.json'
import page14 from '/public/db/data-page14.json'
import page15 from '/public/db/data-page15.json'

// 页面数据映射
const pagesData = {
  1: page1,
  2: page2,
  3: page3,
  4: page4,
  5: page5,
  6: page6,
  7: page7,
  8: page8,
  9: page9,
  10: page10,
  11: page11,
  12: page12,
  13: page13,
  14: page14,
  15: page15
}

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

    // 获取数据
    const data = pagesData[pageNum] || []

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
