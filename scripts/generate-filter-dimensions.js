#!/usr/bin/env node

/**
 * 生成四维筛选配置文件
 */

const fs = require('fs')
const path = require('path')

// 数据目录
const DATA_DIR = path.join(__dirname, '../public/db')

// 输出文件
const OUTPUT_FILE = path.join(__dirname, '../src/data/filter-dimensions.json')

console.log('🔍 开始分析商品数据...')

// 读取所有数据文件
async function loadAllData() {
  const allData = []

  // 获取所有 data-page*.json 文件
  for (let i = 1; i <= 19; i++) {
    const fileName = `data-page${i}.json`
    const filePath = path.join(DATA_DIR, fileName)

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)
        allData.push(...data)
        console.log(`✅ 已读取: ${fileName} (${data.length}条)`)
      } catch (error) {
        console.error(`❌ 读取失败: ${fileName}`, error.message)
      }
    }
  }

  return allData
}

// 生成四维筛选配置
function generateFilterDimensions(products) {
  // 维度1：新品筛选
  const newProducts = products.filter(p => p.product_is_new === 1)
  const dimension1 = [
    {
      id: 'all',
      name: '全部',
      value: '',
      count: products.length
    },
    {
      id: 'new',
      name: '新品',
      value: '1',
      count: newProducts.length
    }
  ]

  // 维度2：宠物类型 + 幼猫
  const catCount = products.filter(p => p.product_eat_type === 1).length
  const dogCount = products.filter(p => p.product_eat_type === 2).length
  const universalCount = products.filter(p => p.product_eat_type === 3).length
  // 幼猫：is_young=1 的商品
  const youngCount = products.filter(p => p.is_young === 1).length

  const dimension2 = [
    {
      id: 'all',
      name: '全部',
      value: '',
      count: products.length
    },
    {
      id: 'cat',
      name: '猫',
      value: 'cat',
      count: catCount
    },
    {
      id: 'dog',
      name: '狗',
      value: 'dog',
      count: dogCount
    },
    {
      id: 'universal',
      name: '通用',
      value: 'universal',
      count: universalCount
    },
    {
      id: 'young',
      name: '幼猫',
      value: 'young',
      count: youngCount
    }
  ]

  // 维度3：商品类型
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

  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)

  const dimension3 = [
    {
      id: 'all',
      name: '全部',
      value: '',
      count: products.length
    }
  ]

  categories.forEach((cat, index) => {
    dimension3.push({
      id: String(index + 1),
      name: cat.name,
      value: cat.name,
      count: cat.count,
      type_id: cat.type_id
    })
  })

  // 维度4：零食
  const snacksCount = products.filter(p => p.is_snacks === 1).length
  const mainFoodCount = products.filter(p => p.is_snacks === 0).length

  const dimension4 = [
    {
      id: 'all',
      name: '全部',
      value: '',
      count: products.length
    },
    {
      id: 'main-food',
      name: '主食',
      value: '0',
      count: mainFoodCount
    },
    {
      id: 'snacks',
      name: '零食',
      value: '1',
      count: snacksCount
    }
  ]

  return {
    dimensions: [
      {
        id: 1,
        name: '新品',
        options: dimension1
      },
      {
        id: 2,
        name: '宠物',
        options: dimension2
      },
      {
        id: 3,
        name: '类型',
        options: dimension3
      },
      {
        id: 4,
        name: '零食',
        options: dimension4
      }
    ]
  }
}

// 主函数
async function main() {
  try {
    // 1. 加载所有数据
    const allProducts = await loadAllData()
    console.log(`\n📊 总数据量: ${allProducts.length}条`)

    // 2. 生成四维配置
    const filterConfig = generateFilterDimensions(allProducts)

    // 3. 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 4. 写入文件
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(filterConfig, null, 2),
      'utf-8'
    )

    console.log(`\n✅ 四维筛选配置已生成: ${OUTPUT_FILE}`)
    console.log(`\n📋 配置内容:`)
    console.log(JSON.stringify(filterConfig, null, 2))

    // 打印每个维度的统计
    console.log(`\n📊 筛选维度统计:`)
    filterConfig.dimensions.forEach(dim => {
      console.log(`\n维度${dim.id} - ${dim.name}:`)
      dim.options.forEach(opt => {
        console.log(`  ${opt.name}: ${opt.count}条`)
      })
    })

  } catch (error) {
    console.error('\n❌ 生成失败:', error)
    process.exit(1)
  }
}

// 运行
main()
