#!/usr/bin/env node

/**
 * 修复抖音小程序编译错误
 *
 * 问题：编译后报错 "can't find page: pages/index/index corresponding pages/index/index.js"
 * 原因：uni-app 编译器把 pages/index/index.vue 编译成了 base64 文件名的 js 文件，
 *       但抖音小程序的 app.json 里引用的是 pages/index/index.js，文件名对不上
 *
 * 修复方式：找到 base64 文件，将其内容直接写入 pages/index/index.js
 *
 * 使用方法：
 *   npm run dev:mp-toutiao && node scripts/fix-toutiao-build.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist/dev/mp-toutiao');

console.log('🔧 开始修复抖音小程序编译错误...\n');

// 1. 找到编译后的 base64 文件
const base64FileName = 'cGFnZXMvaW5kZXgvaW5kZXgudnVl.js';
const compiledVueFile = path.join(distDir, base64FileName);

if (!fs.existsSync(compiledVueFile)) {
  console.error('❌ 错误：找不到编译后的 Vue 文件:', base64FileName);
  console.error('   请先运行: npm run dev:mp-toutiao');
  process.exit(1);
}

// 读取 base64 文件内容
let fileContent = fs.readFileSync(compiledVueFile, 'utf8');
console.log('✅ 找到编译后的文件，大小:', fileContent.length, '字节');

// 2. 修正相对路径
// base64 文件原路径在 dist/dev/mp-toutiao/cGFnZXMvaW5kZXg/ 下
// 现在要复制到 pages/index/ 下，层级不同，需要修正 require 的相对路径
// 原始: require("./common/vendor.js")  → 从 cGFnZXMvaW5kZXg/ 出发找不到
// 修正: require("../../common/vendor.js")  → 从 pages/index/ 回退到根目录
fileContent = fileContent.replace(/require\("\.\/common\//g, 'require("../../common/');
fileContent = fileContent.replace(/require\("\.\/utils\//g, 'require("../../utils/');
fileContent = fileContent.replace(/require\("\.\//g, 'require("./');
console.log('✅ 已修正相对路径');

// 3. 创建 pages/index 目录
const pageDir = path.join(distDir, 'pages/index');
if (!fs.existsSync(pageDir)) {
  fs.mkdirSync(pageDir, { recursive: true });
  console.log('✅ 创建目录: pages/index');
}

// 4. 将修正后的内容写入 pages/index/index.js
const indexJsPath = path.join(pageDir, 'index.js');
fs.writeFileSync(indexJsPath, fileContent, 'utf8');
console.log('✅ 写入文件: pages/index/index.js');

// 4. 创建 index.ttss（空样式文件，抖音需要）
const indexTtssPath = path.join(pageDir, 'index.ttss');
if (!fs.existsSync(indexTtssPath)) {
  fs.writeFileSync(indexTtssPath, '', 'utf8');
  console.log('✅ 创建文件: pages/index/index.ttss');
} else {
  console.log('✅ 文件已存在: pages/index/index.ttss');
}

// 5. 检查并修复其他可能缺失的页面（如 test-network）
const testNetworkJs = path.join(distDir, 'pages', 'test-network.js');
if (!fs.existsSync(testNetworkJs)) {
  console.warn('⚠️  缺少 pages/test-network.js，尝试查找...');
  // 在 dist 目录下递归查找包含 test-network 的 js 文件
  const allFiles = fs.readdirSync(distDir, { recursive: true });
  const testNetFile = allFiles.find(f =>
    typeof f === 'string' && f.includes('test-network') && f.endsWith('.js')
  );
  if (testNetFile) {
    const src = path.join(distDir, testNetFile);
    fs.copyFileSync(src, testNetworkJs);
    console.log('✅ 复制 test-network.js');
  }
}

console.log('\n✅ 修复完成！');
console.log('\n🎯 下一步：');
console.log('   1. 打开抖音开发者工具');
console.log('   2. 导入项目：' + distDir);
console.log('   3. 清除缓存 → 全部清除 → 刷新');
