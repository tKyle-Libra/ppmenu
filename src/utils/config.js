/**
 * 配置文件 - 支持ppmenu_assets生产/测试环境切换
 */

// 环境类型
export const ENVIRONMENT = {
  DEVELOPMENT: 'development', // 待部署测试环境（使用 ppmenu_assets_test）
  PRODUCTION: 'production'    // 正式生产环境（使用 ppmenu_assets）
}

// 当前环境（可通过修改此处切换）
export const CURRENT_ENV = ENVIRONMENT.DEVELOPMENT

// ==================== ppmenu_assets_test 待部署测试环境配置 ====================
export const DEVELOPMENT_CONFIG = {
  // 使用 ppmenu_assets_test 仓库的 main 分支（jsDelivr CDN）
  BASE_URL: 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets_test@main/',

  // 数据文件路径
  DATA_BASE_URL: 'db/',

  // 总页数（完整数据：509条商品）
  TOTAL_PAGES: 35,

  // 每页数据量
  PAGE_SIZE: 20,

  // 环境标识
  ENV_NAME: '待部署测试环境',

  // 说明
  DESCRIPTION: '使用 ppmenu_assets_test 仓库的完整数据，测试验证后推送到 ppmenu_assets'
}

// ==================== ppmenu_assets 正式生产环境配置 ====================
export const PRODUCTION_CONFIG = {
  // 使用 ppmenu_assets 仓库（jsDelivr CDN）
  BASE_URL: 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/',

  // 数据文件路径
  DATA_BASE_URL: 'db/',

  // 总页数（完整数据：509条商品）
  TOTAL_PAGES: 35,

  // 每页数据量
  PAGE_SIZE: 20,

  // 环境标识
  ENV_NAME: '正式生产环境',

  // 说明
  DESCRIPTION: '正式上线环境，线上用户从 ppmenu_assets 获取数据'
}

// ==================== 根据环境选择配置 ====================
export const CONFIG = CURRENT_ENV === ENVIRONMENT.PRODUCTION
  ? PRODUCTION_CONFIG
  : DEVELOPMENT_CONFIG

// 导出配置（向后兼容）
export const BASE_URL = CONFIG.BASE_URL
export const DATA_BASE_URL = CONFIG.DATA_BASE_URL
export const PAGE_SIZE = CONFIG.PAGE_SIZE
export const TOTAL_PAGES = CONFIG.TOTAL_PAGES

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
 */
export function getTypePath(typeId) {
  const key = String(typeId)
  return TYPE_PATHS[key] || 'other/'
}

// Banner 图片配置（根据环境动态生成）
export const BANNER_IMAGES = [
  `${BASE_URL}banner/1.jpg`,
  `${BASE_URL}banner/2.jpg`,
  `${BASE_URL}banner/3.jpg`
]

// 筛选条件
export const FILTER_OPTIONS = [
  { id: 1, name: '全部' },
  { id: 2, name: '猫粮' },
  { id: 3, name: '狗粮' },
  { id: 4, name: '零食' },
  { id: 5, name: '用品' }
]

/**
 * 获取当前环境信息
 */
export function getEnvInfo() {
  return {
    current: CURRENT_ENV,
    isProduction: CURRENT_ENV === ENVIRONMENT.PRODUCTION,
    isDevelopment: CURRENT_ENV === ENVIRONMENT.DEVELOPMENT,
    config: CONFIG,
    envName: CONFIG.ENV_NAME,
    cdnUrl: CONFIG.BASE_URL,
    description: CONFIG.DESCRIPTION
  }
}

/**
 * 切换环境
 */
export function setEnvironment(env) {
  if (env === ENVIRONMENT.PRODUCTION || env === ENVIRONMENT.DEVELOPMENT) {
    const envNames = {
      'production': '正式生产环境（ppmenu_assets）',
      'development': '待部署测试环境（ppmenu_assets_test）'
    }

    const repoNames = {
      'production': 'ppmenu_assets@main',
      'development': 'ppmenu_assets_test@main'
    }

    console.log(`\n⚠️  环境切换: ${envNames[env]}`)
    // console.log(`📊 数据源: ${repoNames[env]}@main (509条完整数据)`)
    console.log(`🌐 CDN地址: ${env === 'production' ? PRODUCTION_CONFIG.BASE_URL : DEVELOPMENT_CONFIG.BASE_URL}`)
    console.log(`\n💡 请重新编译项目使配置生效\n`)
    return true
  }
  console.error('❌ 无效的环境类型:', env)
  return false
}

/**
 * 显示当前环境信息
 */
export function showCurrentEnv() {
  const env = getEnvInfo()

  const repoName = env.current === 'production' ? 'ppmenu_assets' : 'ppmenu_assets_test'

  console.log('\n====================')
  console.log('📱 当前环境信息')
  console.log('====================')
  console.log(`环境类型: ${env.current}`)
  console.log(`环境名称: ${env.envName}`)
  console.log(`数据源: ${repoName}@main`)
  console.log(`说明: ${env.description}`)
  // console.log(`商品数量: 509条 (26页)`)
  console.log(`每页数量: ${env.config.PAGE_SIZE}条`)
  console.log(`\n🌐 CDN地址:`)
  console.log(`  ${env.cdnUrl}`)
  console.log('====================\n')
}
