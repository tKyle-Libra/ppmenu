#!/bin/bash

# 上传分页文件到 GitHub 的便捷脚本

set -e

echo "================================"
echo "  上传分页文件到 GitHub"
echo "================================"
echo ""

# 配置
REPO_URL="https://github.com/tKyle-Libra/ppmenu_assets.git"
TEMP_DIR="/tmp/ppmenu_assets_upload"
DB_DIR="/Users/tong/Code/AI/product-list-vite/data-pages/db"

# 检查文件是否存在
if [ ! -d "$DB_DIR" ]; then
  echo "❌ 错误：找不到分页文件目录 $DB_DIR"
  exit 1
fi

# 计算文件数量
FILE_COUNT=$(ls -1 "$DB_DIR"/data-page*.json 2>/dev/null | wc -l | tr -d ' ')
if [ "$FILE_COUNT" -eq 0 ]; then
  echo "❌ 错误：没有找到 data-page*.json 文件"
  exit 1
fi

echo "📦 找到 $FILE_COUNT 个分页文件"
echo ""

# 询问用户
echo "请选择上传方式："
echo "  1) 自动上传（使用 Git 命令）"
echo "  2) 手动上传（打开 GitHub 网页）"
echo ""
read -p "请输入选择 (1 或 2): " choice

if [ "$choice" = "1" ]; then
  echo ""
  echo "🚀 开始自动上传..."
  echo ""

  # 清理临时目录
  if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
  fi

  # 克隆仓库
  echo "📥 克隆仓库..."
  git clone "$REPO_URL" "$TEMP_DIR"

  # 复制文件
  echo "📋 复制分页文件..."
  cp "$DB_DIR"/data-page*.json "$TEMP_DIR/db/"

  # 进入仓库目录
  cd "$TEMP_DIR"

  # 检查是否有变化
  if git diff --quiet db/; then
    echo "⚠️  警告：没有检测到文件变化"
    echo "可能文件已经是最新版本"
    exit 0
  fi

  # 提交
  echo "💾 提交更改..."
  git add db/data-page*.json
  git commit -m "Add paginated data files (15 pages, 283 products)"

  # 推送
  echo "⬆️  推送到 GitHub..."
  git push origin main

  echo ""
  echo "✅ 上传成功！"
  echo ""
  echo "📝 文件地址："
  echo "   https://github.com/tKyle-Libra/ppmenu_assets/tree/main/db"
  echo ""
  echo "⏳ CDN 缓存需要 1-5 分钟生效"
  echo ""

  # 清理
  cd /
  rm -rf "$TEMP_DIR"

elif [ "$choice" = "2" ]; then
  echo ""
  echo "📖 打开上传指南..."
  echo ""
  cat << 'EOF'
手动上传步骤：

1. 打开 GitHub 仓库页面：
   https://github.com/tKyle-Libra/ppmenu_assets

2. 点击 "db" 文件夹

3. 点击 "Upload files" 按钮

4. 拖拽以下文件到上传区域：
EOF

  ls -1 "$DB_DIR"/data-page*.json | while read file; do
    echo "   - $(basename "$file")"
  done

  cat << 'EOF'

5. 填写提交信息：
   Add paginated data files (15 pages, 283 products)

6. 点击 "Commit changes" 提交

7. 等待 1-5 分钟让 CDN 缓存更新

详细指南请查看：
  /Users/tong/Code/AI/product-list-vite/data-pages/上传指南.md
EOF

  # 尝试打开浏览器
  if command -v open &> /dev/null; then
    echo ""
    read -p "是否打开 GitHub 页面？(y/n): " open_browser
    if [ "$open_browser" = "y" ]; then
      open "https://github.com/tKyle-Libra/ppmenu_assets/tree/main/db"
    fi
  fi

else
  echo "❌ 无效选择"
  exit 1
fi

echo ""
echo "================================"
echo "  完成！"
echo "================================"
