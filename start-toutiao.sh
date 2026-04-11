#!/bin/bash

# 抖音小程序一键启动脚本
# 使用方法：./start-toutiao.sh

echo "🚀 启动抖音小程序开发模式"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    echo "   当前目录：$(pwd)"
    exit 1
fi

echo "📦 步骤1：启动编译..."
npm run dev:mp-toutiao &
COMPILER_PID=$!

echo "⏳ 步骤2：等待编译完成（需要约5-10秒）..."
sleep 8

echo "🔧 步骤3：运行修复脚本..."
node scripts/fix-toutiao-build-v2.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 编译和修复完成！"
    echo ""
    echo "📁 项目路径："
    echo "   $(pwd)/dist/dev/mp-toutiao"
    echo ""
    echo "🎯 下一步操作："
    echo "   1. 打开抖音开发者工具"
    echo "   2. 导入项目：$(pwd)/dist/dev/mp-toutiao"
    echo "   3. 清除缓存 → 全部清除"
    echo "   4. 点击刷新"
    echo ""
    echo "💡 提示：编译进程会在后台持续运行"
    echo "   修改代码后会自动重新编译"
    echo "   但需要重新运行此脚本来修复"
    echo ""
    echo "按 Ctrl+C 可以停止编译进程"
    echo ""

    # 等待用户中断
    wait $COMPILER_PID
else
    echo ""
    echo "❌ 修复失败，请检查错误信息"
    kill $COMPILER_PID 2>/dev/null
    exit 1
fi
