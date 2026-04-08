/**
 * 网络请求工具
 */

/**
 * 加载指定页的数据
 * @param {number} pageNum - 页码（从1开始）
 * @returns {Promise<Array>} 商品数据数组
 */
export async function loadPageData(pageNum) {
  try {
    const fileName = `data-page${pageNum}.json`
    const response = await uni.request({
      url: `${getDataBaseUrl()}${fileName}`,
      method: 'GET'
    })

    if (response[0] && response[0].statusCode === 200) {
      return response[0].data || response[1].data || []
    }

    return []
  } catch (error) {
    console.error('加载数据失败:', error)
    return []
  }
}

/**
 * 获取数据基础URL
 * 在开发环境使用本地路径，生产环境使用CDN
 * @returns {string}
 */
function getDataBaseUrl() {
  // #ifdef MP-WEIXIN || MP-TOUTIAO
  // 小程序环境，需要配置服务器域名
  return 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@0.0.6/db/'
  // #endif

  // #ifdef H5
  // H5环境，可以使用相对路径或CDN
  return '/db/'
  // #endif

  // 默认返回本地路径
  return '/db/'
}

/**
 * 处理图片URL
 * @param {string} imgUrl - 原始图片URL
 * @param {number} typeId - 商品类型ID
 * @param {string} baseUrl - CDN基础URL
 * @returns {string} 处理后的图片URL
 */
export function processImageUrl(imgUrl, typeId, baseUrl) {
  if (!imgUrl) return ''

  // 如果已经是完整URL，直接返回
  if (imgUrl.startsWith('http')) {
    return imgUrl
  }

  // 拼接完整URL
  const typePath = getTypePath(typeId)
  let fullUrl = `${baseUrl}${typePath}${imgUrl}`

  // 如果没有扩展名，添加.png
  if (!fullUrl.endsWith('.png') && !fullUrl.endsWith('.jpg')) {
    fullUrl += '.png'
  }

  return fullUrl
}

/**
 * 根据类型ID获取路径
 * @param {number|string} typeId - 类型ID
 * @returns {string} 路径
 */
function getTypePath(typeId) {
  const TYPE_PATHS = {
    1: 'jb/',
    2: 'cb/',
    3: 'gt/',
    4: 'ch/',
    5: 'nzp/',
    6: 'tang/',
    7: 'dg/',
    8: 'mt/',
    9: 'other/'
  }
  const key = String(typeId)
  return TYPE_PATHS[key] || 'other/'
}

/**
 * 处理口味标签
 * @param {string|Array<string>} tastes - 口味字符串（用顿号分隔）或口味数组
 * @returns {Array<string>} 口味数组
 */
export function processTastes(tastes) {
  if (!tastes) return []

  // 如果已经是数组，直接返回
  if (Array.isArray(tastes)) {
    return tastes
  }

  // 如果是字符串，按顿号分割
  if (typeof tastes === 'string') {
    return tastes
      .split('、')
      .map(t => t.trim())
      .filter(Boolean)
  }

  return []
}
