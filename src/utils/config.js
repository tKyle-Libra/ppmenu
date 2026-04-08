/**
 * 配置文件
 */

// CDN 基础地址
export const BASE_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@0.0.6/'

// 数据文件路径
export const DATA_BASE_URL = '/db/'

// 每页数据量
export const PAGE_SIZE = 20

// 总页数（根据实际数据计算）
export const TOTAL_PAGES = 15

// 类型路径映射
export const TYPE_PATHS = {
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

/**
 * 根据类型ID获取路径
 * @param {number|string} typeId - 类型ID
 * @returns {string} 路径
 */
export function getTypePath(typeId) {
  const key = String(typeId)
  return TYPE_PATHS[key] || 'other/'
}

// Banner 图片配置（临时使用网图）
export const BANNER_IMAGES = [
  'https://picsum.photos/750/300?random=1',
  'https://picsum.photos/750/300?random=2',
  'https://picsum.photos/750/300?random=3'
]

// 筛选条件（临时配置，待根据实际需求调整）
export const FILTER_OPTIONS = [
  { id: 1, name: '全部' },
  { id: 2, name: '猫粮' },
  { id: 3, name: '狗粮' },
  { id: 4, name: '零食' },
  { id: 5, name: '用品' }
]
