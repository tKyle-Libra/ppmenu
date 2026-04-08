/**
 * 筛选工具函数
 */

/**
 * 从所有商品数据中提取筛选条件
 * @param {Array} allProducts - 所有商品数据
 * @returns {Array} 筛选条件数组
 */
export function extractFilterOptions(allProducts) {
  // 提取所有商品类型
  const typeSet = new Set()
  allProducts.forEach(product => {
    if (product.product_type_name) {
      typeSet.add(product.product_type_name)
    }
  })

  // 转换为数组并排序
  const types = Array.from(typeSet).sort()

  // 构建筛选选项
  const filterOptions = [
    { id: 'all', name: '全部', value: '' }
  ]

  types.forEach((type, index) => {
    filterOptions.push({
      id: String(index + 1),
      name: type,
      value: type
    })
  })

  return filterOptions
}

/**
 * 根据筛选条件过滤商品
 * @param {Array} products - 商品数据
 * @param {string} filterValue - 筛选值
 * @returns {Array} 过滤后的商品
 */
export function filterProducts(products, filterValue) {
  if (!filterValue || filterValue === 'all' || filterValue === '') {
    return products
  }

  return products.filter(product => {
    return product.product_type_name === filterValue
  })
}
