#!/usr/bin/env node

/**
 * ppmenu_assets 环境切换脚本
 *
 * 使用方法：
 *   node scripts/set-env.js development  # 待部署测试环境（ppmenu_assets_test）
 *   node scripts/set-env.js production   # 正式生产环境（ppmenu_assets）
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const configPath = path.join(projectRoot, 'src/utils/config.js');

// 获取命令行参数
const env = process.argv[2];

if (!env || (env !== 'development' && env !== 'production')) {
  console.log('❌ 错误：请指定环境类型');
  console.log('\n使用方法：');
  console.log('  node scripts/set-env.js development  # 待部署测试环境（ppmenu_assets_test）');
  console.log('  node scripts/set-env.js production   # 正式生产环境（ppmenu_assets）');
  process.exit(1);
}

console.log(`🔄 切换环境: ${env}\n`);

// 读取配置文件
let configContent = fs.readFileSync(configPath, 'utf8');

// 查找并替换 CURRENT_ENV
const oldEnvPattern = /export const CURRENT_ENV = ENVIRONMENT\.(DEVELOPMENT|PRODUCTION)/;
const newEnv = `export const CURRENT_ENV = ENVIRONMENT.${env.charAt(0).toUpperCase() + env.slice(1)}`;

if (oldEnvPattern.test(configContent)) {
  configContent = configContent.replace(oldEnvPattern, newEnv);
  fs.writeFileSync(configPath, configContent, 'utf8');

  console.log('✅ 环境已切换！');

  if (env === 'development') {
    console.log('\n📊 待部署测试环境配置:');
    console.log('   仓库: ppmenu_assets_test@main');
    console.log('   CDN: https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets_test@main/');
    console.log('   商品数量: 509条 (26页，每页20条)');
    console.log('   用途: 待部署数据测试验证');
    console.log('   流程: 测试 → 验证 → 确认无误后提交到ppmenu_assets');
  }
  else if (env === 'production') {
    console.log('\n📊 正式生产环境配置:');
    console.log('   仓库: ppmenu_assets@main');
    console.log('   CDN: https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/');
    console.log('   商品数量: 509条 (26页，每页20条)');
    console.log('   用途: 正式上线');
    console.log('   ⚠️  注意: 确保已充分测试！数据将面向真实用户');
  }

  console.log('\n💡 下一步：');
  console.log('   1. 重新编译项目');
  console.log('      npm run dev:h5');
  console.log('      或');
  console.log('      npm run dev:mp-toutiao');
  console.log('   2. 在浏览器/小程序中查看效果');

} else {
  console.log('❌ 错误：无法在配置文件中找到 CURRENT_ENV');
  console.log('   请检查 src/utils/config.js 文件格式');
  process.exit(1);
}
