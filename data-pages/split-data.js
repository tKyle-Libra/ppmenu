#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取完整数据
const data = JSON.parse(fs.readFileSync('ppmenu.json', 'utf8'));
console.log(`总数据量: ${data.length} 条`);

// 每页20条
const pageSize = 20;
const totalPages = Math.ceil(data.length / pageSize);
console.log(`总页数: ${totalPages} 页`);

// 创建db目录
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 分割数据
for (let page = 1; page <= totalPages; page++) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  const fileName = `data-page${page}.json`;
  const filePath = path.join(dbDir, fileName);

  // 包装成与原格式相同的结构
  const wrappedData = {
    code: 200,
    data: pageData,
    page: page,
    pageSize: pageSize,
    total: data.length
  };

  fs.writeFileSync(filePath, JSON.stringify(wrappedData, null, 2), 'utf8');
  console.log(`✓ 生成 ${fileName}: ${pageData.length} 条`);
}

console.log('\n完成！请将 db 目录上传到 GitHub 仓库的 db 目录');
