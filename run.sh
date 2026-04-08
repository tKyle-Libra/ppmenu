#!/bin/bash

# uniapp 商品列表项目 - 启动脚本

echo "🚀 uniapp 商品列表项目"
echo "===================="
echo ""

# 检查 node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 首次运行，正在安装依赖..."
  npm install
fi

echo "🎯 选择运行平台："
echo "  1) H5 (浏览器调试 - 推荐)"
echo "  2) 微信小程序"
echo "  3) 抖音小程序"
echo ""
read -p "请输入选项 (1-3，默认1): " choice

case ${choice:-1} in
  1)
    echo ""
    echo "🌐 启动 H5 开发服务器..."
    npm run dev:h5
    echo ""
    echo "✅ 运行完成！"
    echo "🌐 请在浏览器打开: http://localhost:5173"
    ;;
  2)
    echo ""
    echo "📱 编译微信小程序..."
    npm run dev:mp-weixin
    echo ""
    echo "✅ 编译完成！"
    echo "📱 请用微信开发者工具打开: dist/dev/mp-weixin"
    ;;
  3)
    echo ""
    echo "📱 编译抖音小程序..."
    npm run dev:mp-toutiao
    echo ""
    echo "✅ 编译完成！"
    echo "📱 请用抖音开发者工具打开: dist/dev/mp-toutiao"
    ;;
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac
