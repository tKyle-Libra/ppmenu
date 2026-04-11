#!/usr/bin/env node

/**
 * ppmenu_assets 测试数据生成脚本
 *
 * 功能：
 * 1. 从本地data-pages/db读取生产数据
 * 2. 生成30条测试数据（3页×10条）
 * 3. 更新筛选配置的数量
 * 4. 生成可以提交到ppmenu_assets仓库test分支的文件
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'data-pages/db');
const targetDir = path.join(projectRoot, 'ppmenu-assets-test');

console.log('🔧 生成ppmenu_assets测试数据...\n');

// 测试数据配置
const TEST_CONFIG = {
  pages: 3,              // 测试数据总页数
  pageSize: 10,          // 每页数据量
  samplePages: [1, 3, 5, 10, 15, 20, 25],  // 从这些页中采样
};

/**
 * 主函数
 */
async function generatePPMenuTestData() {
  // 1. 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('✅ 创建目标目录:', targetDir);
  }

  // 2. 读取生产数据
  console.log('📥 读取生产数据...');
  let allProducts = [];

  for (const pageNum of TEST_CONFIG.samplePages) {
    const filePath = path.join(sourceDir, `data-page${pageNum}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在，跳过: data-page${pageNum}.json`);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      if (Array.isArray(data)) {
        allProducts = allProducts.concat(data);
        console.log(`   ✅ 读取第${pageNum}页: ${data.length}条`);
      }
    } catch (error) {
      console.error(`   ❌ 读取第${pageNum}页失败:`, error.message);
    }
  }

  if (allProducts.length === 0) {
    console.error('\n❌ 没有读取到任何数据！');
    process.exit(1);
  }

  console.log(`\n📊 共读取 ${allProducts.length} 条商品数据`);

  // 3. 随机选取测试数据
  const shuffled = allProducts.sort(() => Math.random() - 0.5);
  const selectedProducts = shuffled.slice(0, TEST_CONFIG.pages * TEST_CONFIG.pageSize);

  console.log(`🎯 随机选取 ${selectedProducts.length} 条作为测试数据\n`);

  // 4. 创建db目录并生成分页数据
  const dbDir = path.join(targetDir, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log('📝 生成测试数据文件...');
  for (let page = 1; page <= TEST_CONFIG.pages; page++) {
    const start = (page - 1) * TEST_CONFIG.pageSize;
    const end = start + TEST_CONFIG.pageSize;
    const pageData = selectedProducts.slice(start, end);

    const fileName = `data-page${page}.json`;
    const filePath = path.join(dbDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(pageData, null, 2), 'utf8');
    console.log(`   ✅ db/${fileName}: ${pageData.length}条`);
  }

  // 5. 生成筛选配置文件
  console.log('\n📋 生成筛选配置文件...');
  generateFilterConfigs(selectedProducts, targetDir);

  // 6. 生成README
  const readmeContent = `# ppmenu_assets - 测试数据

## 📊 数据说明

这是ppmenu_assets仓库的测试数据分支，包含30条测试商品数据。

### 数据概况
- **总页数**: ${TEST_CONFIG.pages}
- **每页数量**: ${TEST_CONFIG.pageSize}
- **总商品数**: ${selectedProducts.length}
- **生成时间**: ${new Date().toLocaleString('zh-CN')}

### 数据来源
从生产数据（main分支）的以下页面随机采样：
${TEST_CONFIG.samplePages.map(p => `- 第${p}页`).join('\n')}

---

## 📁 文件说明

### db/ 目录
- \`data-page1.json\` - 第1页数据（10条）
- \`data-page2.json\` - 第2页数据（10条）
- \`data-page3.json\` - 第3页数据（10条）

### 筛选配置
- \`filter-dimensions.json\` - 四维筛选配置（已更新数量）
- \`filter-categories.json\` - 商品类型筛选配置

---

## 🚀 使用方法

### 在小程序项目中使用测试数据

修改 \`src/utils/config.js\`：
\`\`\javascript
export const CURRENT_ENV = ENVIRONMENT.DEVELOPMENT
\`\`\`

### CDN地址
\`\`\`
https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@test/
\`\`\`

---

## ⚠️ 注意事项

1. 这是测试数据，仅用于开发调试
2. 不要将test分支合并到main分支
3. 更新测试数据时，请重新运行生成脚本

---

**最后更新**: ${new Date().toLocaleDateString('zh-CN')}
`;

  fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf8');
  console.log('   ✅ README.md');

  // 7. 生成提交说明
  const commitMsg = `添加ppmenu_assets测试数据

- 总页数: ${TEST_CONFIG.pages}
- 每页数量: ${TEST_CONFIG.pageSize}
- 总商品数: ${selectedProducts.length}
- 生成时间: ${new Date().toISOString()}

数据来源: main分支的第${TEST_CONFIG.samplePages.join(', ')}页
`;

  fs.writeFileSync(path.join(targetDir, 'COMMIT_MESSAGE.txt'), commitMsg, 'utf8');
  console.log('   ✅ COMMIT_MESSAGE.txt');

  console.log('\n✨ ppmenu_assets测试数据生成完成！\n');
  console.log('📁 输出目录:', targetDir);
  console.log('\n💡 下一步操作：');
  console.log('   1. cd ppmenu-assets-test');
  console.log('   2. git init');
  console.log('   3. git checkout -b test');
  console.log('   4. git add .');
  console.log('   5. git commit -F COMMIT_MESSAGE.txt');
  console.log('   6. git push origin test');
  console.log('\n或者：');
  console.log('   将文件复制到现有的ppmenu_assets仓库的test分支');
}

/**
 * 生成筛选配置文件
 */
function generateFilterConfigs(products, targetDir) {
  // 统计数据
  const stats = {
    isNew: { '': products.length, '1': 0 },
    petType: {
      '': products.length,
      'cat': 0,
      'dog': 0,
      'universal': 0,
      'young': 0
    },
    productType: {}
  };

  products.forEach(p => {
    // 统计新品
    if (p.isNew || p.product_is_new === 1) {
      stats.isNew['1']++;
    }

    // 统计宠物类型
    const eatType = p.eatType || p.product_eat_type;
    if (eatType === 1) stats.petType.cat++;
    else if (eatType === 2) stats.petType.dog++;
    else if (eatType === 3) stats.petType.universal++;
    if (p.is_young === 1) stats.petType.young++;

    // 统计商品类型
    const typeId = String(p.typeId || p.product_type_id);
    const typeName = p.type_name || p.product_type_name || '其他';
    if (!stats.productType[typeId]) {
      stats.productType[typeId] = { name: typeName, count: 0 };
    }
    stats.productType[typeId].count++;
  });

  // 生成filter-dimensions.json
  const filterDimensions = {
    dimensions: [
      {
        id: 1,
        name: '新品',
        options: [
          { id: 'all', name: '全部', 'value': '', count: stats.isNew[''] },
          { id: 'new', name: '新品', 'value': '1', count: stats.isNew['1'] }
        ]
      },
      {
        id: 2,
        name: '宠物',
        options: [
          { id: 'all', name: '全部', 'value': '', count: stats.petType[''] },
          { id: 'cat', name: '猫', 'value': 'cat', count: stats.petType.cat },
          { id: 'dog', name: '狗', 'value': 'dog', count: stats.petType.dog },
          { id: 'universal', name: '通用', 'value': 'universal', count: stats.petType.universal },
          { id: 'young', name: '幼猫', 'value': 'young', count: stats.petType.young }
        ]
      },
      {
        id: 3,
        name: '类型',
        options: [
          { id: 'all', name: '全部', 'value': '', count: products.length }
        ]
      }
    ]
  };

  // 添加商品类型选项
  Object.keys(stats.productType).forEach(typeId => {
    const type = stats.productType[typeId];
    filterDimensions.dimensions[2].options.push({
      id: typeId,
      name: type.name,
      value: type.name,
      count: type.count,
      type_id: typeId
    });
  });

  fs.writeFileSync(
    path.join(targetDir, 'filter-dimensions.json'),
    JSON.stringify(filterDimensions, null, 2),
    'utf8'
  );
  console.log('   ✅ filter-dimensions.json');

  // 复制filter-categories.json
  const sourceFilterCategories = path.join(projectRoot, 'src/data/filter-categories.json');
  if (fs.existsSync(sourceFilterCategories)) {
    const filterCategories = JSON.parse(fs.readFileSync(sourceFilterCategories, 'utf8'));

    // 更新数量
    filterCategories.forEach(option => {
      if (option.id === 'all') {
        option.count = products.length;
      } else if (option.count) {
        // 按比例减少
        option.count = Math.round(option.count * (products.length / 509));
      }
    });

    fs.writeFileSync(
      path.join(targetDir, 'filter-categories.json'),
      JSON.stringify(filterCategories, null, 2),
      'utf8'
    );
    console.log('   ✅ filter-categories.json');
  }
}

// 运行
generatePPMenuTestData().catch(error => {
  console.error('\n❌ 生成失败:', error);
  process.exit(1);
});
