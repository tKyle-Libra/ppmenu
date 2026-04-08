#!/usr/bin/env node

/**
 * 生成筛选栏配置文件
 * 从所有商品数据中提取商品类型，生成筛选配置
 */

const fs = require('fs')
const path = require('path')

// 数据目录
const DATA_DIR = path.join(__dirname, '../public/db')

// 输出文件
const OUTPUT_FILE = path.join(__dirname, '../src/data/filter-categories.json')

console.log('🔍 开始分析商品数据...')

// 读取所有数据文件
async function loadAllData() {
  const allData = []
  const pageFiles = []

  // 获取所有 data-page*.json 文件
  for (let i = 1; i <= 15; i++) {
    const fileName = `data-page${i}.json`
    const filePath = path.join(DATA_DIR, fileName)

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)
        allData.push(...data)
        pageFiles.push(fileName)
        console.log(`✅ 已读取: ${fileName} (${data.length}条)`)
      } catch (error) {
        console.error(`❌ 读取失败: ${fileName}`, error.message)
      }
    }
  }

  return allData
}

// 提取商品类型
function extractCategories(products) {
  const categoryMap = new Map()

  products.forEach(product => {
    const typeName = product.product_type_name
    if (typeName) {
      if (!categoryMap.has(typeName)) {
        categoryMap.set(typeName, {
          name: typeName,
          count: 0,
          type_id: product.product_type_id
        })
      }
      categoryMap.get(typeName).count++
    }
  })

  // 转换为数组并按数量排序
  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)

  return categories
}

// 生成筛选配置
function generateFilterConfig(categories) {
  // 添加"全部"选项
  const filterConfig = [
    {
      id: 'all',
      name: '全部',
      value: '',
      count: categories.reduce((sum, cat) => sum + cat.count, 0)
    }
  ]

  // 添加各个类型
  categories.forEach((cat, index) => {
    filterConfig.push({
      id: String(index + 1),
      name: cat.name,
      value: cat.name,
      count: cat.count,
      type_id: cat.type_id
    })
  })

  return filterConfig
}

// 主函数
async function main() {
  try {
    // 1. 加载所有数据
    const allProducts = await loadAllData()
    console.log(`\n📊 总数据量: ${allProducts.length}条`)

    // 2. 提取分类
    const categories = extractCategories(allProducts)
    console.log(`\n🏷️  找到 ${categories.length} 个商品类型:`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat.count}条`)
    })

    // 3. 生成配置
    const filterConfig = generateFilterConfig(categories)

    // 4. 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 5. 写入文件
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(filterConfig, null, 2),
      'utf-8'
    )

    console.log(`\n✅ 筛选配置已生成: ${OUTPUT_FILE}`)
    console.log(`\n📋 配置内容:`)
    console.log(JSON.stringify(filterConfig, null, 2))

  } catch (error) {
    console.error('\n❌ 生成失败:', error)
    process.exit(1)
  }
}

// 运行
main()
