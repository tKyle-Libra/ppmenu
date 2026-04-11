#!/usr/bin/env node

/**
 * 同步ppmenu_assets测试数据脚本
 *
 * 功能：从ppmenu_assets的main分支生成test分支的数据
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

console.log('🔄 同步ppmenu_assets测试数据...\n');

// 配置
const CONFIG = {
  ppmenuRepo: 'https://github.com/tKyle-Libra/ppmenu_assets.git',
  mainBranch: 'main',
  testBranch: 'test',
  tempDir: path.join(projectRoot, '.temp-ppmenu'),
  testDataDir: path.join(projectRoot, 'ppmenu-assets-test')
};

/**
 * 执行同步
 */
async function syncTestData() {
  const { execSync } = require('child_process');

  try {
    // 1. 清理临时目录
    if (fs.existsSync(CONFIG.tempDir)) {
      execSync(`rm -rf ${CONFIG.tempDir}`);
    }

    // 2. 克隆main分支
    console.log('📥 克隆ppmenu_assets main分支...');
    execSync(`git clone ${CONFIG.ppmenuRepo} ${CONFIG.tempDir}`, {
      stdio: 'inherit'
    });

    // 3. 切换到main分支
    console.log('✅ 切换到main分支');
    execSync(`cd ${CONFIG.tempDir} && git checkout ${CONFIG.mainBranch}`, {
      stdio: 'inherit'
    });

    // 4. 生成测试数据
    console.log('\n🎯 生成测试数据...');
    const sourceDir = path.join(CONFIG.tempDir, 'db');
    const targetDir = CONFIG.testDataDir;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const dbDir = path.join(targetDir, 'db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // 只复制前3页
    const pages = [1, 2, 3];
    let totalProducts = 0;

    for (const pageNum of pages) {
      const srcFile = path.join(sourceDir, `data-page${pageNum}.json`);
      const destFile = path.join(dbDir, `data-page${pageNum}.json`);

      if (fs.existsSync(srcFile)) {
        const content = fs.readFileSync(srcFile, 'utf8');
        const data = JSON.parse(content);
        totalProducts += data.length;

        fs.writeFileSync(destFile, content, 'utf8');
        console.log(`   ✅ 复制 data-page${pageNum}.json: ${data.length}条`);
      }
    }

    console.log(`\n📊 总计: ${totalProducts}条商品\n`);

    // 5. 复制筛选配置
    console.log('📋 复制筛选配置...');
    const filterFiles = [
      'filter-dimensions.json',
      'filter-categories.json'
    ];

    filterFiles.forEach(file => {
      const srcFile = path.join(CONFIG.tempDir, file);
      const destFile = path.join(targetDir, file);

      if (fs.existsSync(srcFile)) {
        const content = fs.readFileSync(srcFile, 'utf8');
        const config = JSON.parse(content);

        // 更新数量
        if (file === 'filter-dimensions.json') {
          config.dimensions.forEach(dimension => {
            dimension.options.forEach(option => {
              if (option.id === 'all') {
                option.count = totalProducts;
              } else if (option.count) {
                option.count = Math.max(1, Math.round(option.count * (totalProducts / 509)));
              }
            });
          });
        }

        fs.writeFileSync(destFile, JSON.stringify(config, null, 2), 'utf8');
        console.log(`   ✅ ${file}`);
      }
    });

    // 6. 清理临时目录
    console.log('\n🧹 清理临时文件...');
    execSync(`rm -rf ${CONFIG.tempDir}`);

    console.log('\n✨ 同步完成！\n');
    console.log('📁 测试数据目录:', CONFIG.testDataDir);
    console.log('\n💡 下一步：');
    console.log('   cd ppmenu-assets-test');
    console.log('   # 查看/修改文件');
    console.log('   # 然后提交到ppmenu_assets的test分支');

  } catch (error) {
    console.error('\n❌ 同步失败:', error.message);

    // 清理临时目录
    if (fs.existsSync(CONFIG.tempDir)) {
      execSync(`rm -rf ${CONFIG.tempDir}`);
    }

    process.exit(1);
  }
}

// 运行
syncTestData();
