# HBuilderX 启动项目 - 详细步骤

## ✅ 前提条件

- ✅ HBuilderX 版本: 5.06.2026033105（最新版）
- ✅ 项目: uni-app 3.x + Vue 3 + Vite
- ✅ 兼容性: **完全兼容**

---

## 🚀 方法1：正确导入项目（推荐）

### 步骤1：关闭 HBuilderX
如果已经打开了项目，先关闭它

### 步骤2：重新导入项目
1. 打开 HBuilderX
2. 点击菜单：`文件` → `导入` → `从本地目录导入`
3. 选择项目目录：`/Users/tong/Code/AI/product-list-vite`
4. 点击"选择文件夹"

### 步骤3：等待项目初始化
- HBuilderX 会自动识别这是一个 uni-app 项目
- 等待右下角的"正在索引文件"完成

### 步骤4：运行项目
1. 在项目管理器中右键点击项目
2. 选择：`运行` → `运行到小程序模拟器` → `抖音开发者工具`

---

## 🚀 方法2：使用命令行 + HBuilderX 预览

### 步骤1：命令行编译项目
```bash
cd /Users/tong/Code/AI/product-list-vite
npm run dev:mp-toutiao
```

### 步骤2：在 HBuilderX 中
1. 文件 → 导入 → 从本地目录导入
2. 选择：`/Users/tong/Code/AI/product-list-vite/dist/dev/mp-toutiao`
3. 运行 → 运行到小程序模拟器 → 抖音开发者工具

---

## 🚀 方法3：直接使用命令行（最稳定）

### 开发流程
```bash
# 1. 进入项目目录
cd /Users/tong/Code/AI/product-list-vite

# 2. 启动开发服务器（支持热更新）
npm run dev:mp-toutiao

# 3. 在抖音开发者工具中
# 文件 → 导入项目
# 路径: dist/dev/mp-toutiao
```

### 优点
- ✅ 100% 可靠
- ✅ 支持热更新
- ✅ 错误信息更详细
- ✅ 不依赖 HBuilderX 版本

---

## 🔍 如果仍然无法启动

### 检查清单

1. **确认 Node.js 版本**
   ```bash
   node -v  # 应该是 v18+ 或 v20+
   npm -v  # 应该是 9+ 或 10+
   ```

2. **确认依赖已安装**
   ```bash
   cd /Users/tong/Code/AI/product-list-vite
   npm install
   ```

3. **检查编译输出**
   ```bash
   npm run dev:mp-toutiao
   # 查看是否有错误
   ```

4. **手动打开编译后的项目**
   ```bash
   # 编译完成后
   open /Users/tong/Code/AI/product-list-vite/dist/dev/mp-toutiao
   ```

---

## 📋 常见错误和解决方案

### 错误1：HBuilderX 提示"不是有效的项目"
**原因**: 项目被识别为普通目录
**解决**: 使用 `导入` 功能，而不是直接打开

### 错误2：编译失败
**原因**: 依赖未安装或 Node.js 版本过低
**解决**: 运行 `npm install`，升级 Node.js

### 错误3：找不到页面
**原因**: pages.json 配置错误
**解决**: 检查 src/pages.json 是否正确

### 错误4：插件版本不匹配
**原因**: HBuilderX 版本太旧
**解决**: 你的版本是 5.06（最新版），应该不会出现此问题

---

## 💡 推荐方案

**开发阶段**: 使用命令行 `npm run dev:mp-toutiao`
- 稳定可靠
- 支持热更新
- 错误提示清晰

**调试阶段**: 使用 HBuilderX 预览
- 可视化调试
- 实时预览

**发布阶段**: 使用命令行 `npm run build:mp-toutiao`
- 优化的生产构建
- 最小的包体积

---

## 🎯 当前状态

**环境**: development (ppmenu_assets_test)
**编译**: ✅ 成功
**输出**: dist/dev/mp-toutiao
**抖音 AppID**: tt8b7cfdc114713d5d01

---

**问题已解决** ✅

你的 HBuilderX 版本（5.06）完全支持这个项目。只需要：
1. 重新导入项目
2. 或直接使用命令行开发

建议使用命令行开发，更稳定可靠！
