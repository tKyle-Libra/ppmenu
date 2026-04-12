/**
 * 网络请求工具
 */
import { BASE_URL } from './config.js'

/**
 * 加载指定页的数据
 * @param {number} pageNum - 页码（从1开始）
 * @returns {Promise<Array>} 商品数据数组
 */
export async function loadPageData(pageNum) {
  try {
    const fileName = `data-page${pageNum}.json`
    const fullUrl = `${getDataBaseUrl()}${fileName}`
    console.log('正在请求:', fullUrl)
    console.log('完整URL:', fullUrl)

    // 使用 Promise 包装 uni.request
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: fullUrl,
        method: 'GET',
        dataType: 'json',
        timeout: 10000,
        success: (res) => {
          console.log('请求成功:', res)
          resolve(res)
        },
        fail: (err) => {
          console.error('请求失败:', err)
          reject(err)
        }
      })
    })

    console.log('uni.request 原始返回:', response)

    // uni.request 在不同环境下的返回格式不同
    // H5: [response, error] 或 [error, response]
    // 小程序: { statusCode, data }
    let data = null

    if (Array.isArray(response)) {
      // H5 环境，response 是数组
      const item0 = response[0]
      const item1 = response[1]

      if (item0 && item0.statusCode === 200) {
        data = item0.data
      } else if (item1 && item1.statusCode === 200) {
        data = item1.data
      } else {
        console.error('HTTP 错误:', item0?.statusCode || item1?.statusCode)
        console.error('响应内容:', item0 || item1)
        return []
      }
    } else if (response && response.statusCode === 200) {
      // 小程序环境，response 是对象
      data = response.data
    } else {
      console.error('未知响应格式:', response)
      return []
    }

    console.log('解析后的数据:', data)
    console.log('数据类型:', typeof data)
    console.log('是否为数组:', Array.isArray(data))
    console.log('是否包含 data 属性:', data && typeof data === 'object' && 'data' in data)

    // 检查数据格式
    if (Array.isArray(data)) {
      // 如果直接返回数组
      console.log('直接返回数组，长度:', data.length)
      return data
    } else if (data && typeof data === 'object' && data.data) {
      // 如果返回 {code: 200, data: [...]}
      console.log('返回对象，data 数组长度:', data.data.length)
      return data.data
    } else {
      console.error('数据格式错误:', data)
      return []
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    console.error('错误详情:', {
      errMsg: error.errMsg,
      errNo: error.errNo,
      errorCode: error.errorCode,
      errorType: error.errorType
    })

    // 如果是协议错误，提供更详细的信息
    if (error.errMsg && error.errMsg.includes('protocol')) {
      console.error('⚠️ 协议错误！请检查:')
      console.error('1. URL 是否以 https:// 开头')
      console.error('2. 抖音小程序是否开启了"不校验合法域名"')
      console.error('3. 网络连接是否正常')
    }

    return []
  }
}

/**
 * 获取数据基础URL
 * 统一使用 GitHub CDN
 * @returns {string}
 */
function getDataBaseUrl() {
  // 统一使用 GitHub CDN（所有环境）
  // 使用 BASE_URL 常量（来自 config.js）
  return BASE_URL + 'db/'
}

function buildImageUrl(imgUrl, typeId, baseUrl) {
  if (!imgUrl) return `${baseUrl}default.jpg`

  if (imgUrl.includes('default.png') || imgUrl === 'default.png') {
    return `${baseUrl}default.jpg`
  }

  if (imgUrl.startsWith('http')) {
    return imgUrl
  }

  const typePaths = ['jb/', 'cb/', 'gt/', 'ch/', 'nzp/', 'tang/', 'dg/', 'mt/', 'other/']
  const hasPrefix = typePaths.some(path => imgUrl.startsWith(path))

  let dirPrefix = ''
  let fileName = imgUrl

  if (hasPrefix) {
    const idx = imgUrl.indexOf('/')
    dirPrefix = imgUrl.substring(0, idx + 1)
    fileName = imgUrl.substring(idx + 1)
  } else {
    dirPrefix = getTypePath(typeId)
  }

  let fullUrl = `${baseUrl}${dirPrefix}${fileName}`
  if (!fullUrl.match(/\.(png|jpe?g|webp|gif)$/i)) {
    fullUrl += '.jpeg'
  } else {
    fullUrl = fullUrl.replace(/\.(png|jpg)$/i, '.jpeg')
  }
  return fullUrl
}

export function processImageUrl(imgUrl, typeId, baseUrl) {
  return buildImageUrl(imgUrl, typeId, baseUrl)
}

export function processThumbnailUrl(imgUrl, typeId, baseUrl) {
  return buildImageUrl(imgUrl, typeId, baseUrl)
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
