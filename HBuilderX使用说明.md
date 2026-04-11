# HBuilderX 启动问题诊断和解决方案

## ❌ 问题描述

在 HBuilderX 中无法启动 product-list-vite 项目

## 🔍 问题原因

这是一个 **uni-app 3.x (Vue 3) + Vite** 项目，而 HBuilderX 对 Vue 3 项目的支持有特定要求：

### HBuilderX 版本要求
- **最低版本**: HBuilderX 3.6.0
- **推荐版本**: HBuilderX 3.8.0 或更高
- **正式版 Alpha**: HBuilderX 3.99+

### 当前项目配置
- uni-app 版本: 3.0.0-5000620260331001
- Vue 版本: 3.4.21
- Vite 版本: 5.2.8
- 构建工具: Vite (不是 webpack)

---

## ✅ 解决方案

### 方案1：升级 HBuilderX 版本（推荐）

1. **检查当前 HBuilderX 版本**
   - 打开 HBuilderX
   - 菜单: `帮助` → `关于 HBuilderX`
   - 查看版本号

2. **下载最新版本**
   - 官网下载: https://www.dcloud.io/hbuilderx.html
   - 选择 `正式版 Alpha` 或 `3.8+` 版本
   - **必须选择** `App开发版`，不要选择 `标准版`

3. **安装并启动项目**
   - 解压新版本 HBuilderX
   - 打开项目
   - 运行 → 运行到小程序模拟器 → 抖音开发者工具

### 方案2：使用命令行开发（当前方案）

如果 HBuilderX 版本无法升级，可以继续使用命令行：

```bash
# 1. 安装依赖
cd /Users/tong/Code/AI/product-list-vite
npm install

# 2. 运行抖音小程序
npm run dev:mp-toutiao

# 3. 在抖音开发者工具中导入项目
# 项目路径: /Users/tong/Code/AI/product-list-vite/dist/dev/mp-toutiao
```

### 方案3：降级到 Vue 2（不推荐）

如果必须使用 HBuilderX 标准版，需要将项目降级到 Vue 2：

```bash
# ⚠️ 这会丢失大量代码修改，不推荐
# 需要重写大部分组件和代码
```

---

## 🎯 推荐工作流程

### 当前最佳方案（命令行）

1. **开发阶段**
   ```bash
   cd /Users/tong/Code/AI/product-list-vite

   # 启动开发服务器
   npm run dev:mp-toutiao
   ```

2. **在抖音开发者工具中**
   - 文件 → 导入项目
   - 选择: `dist/dev/mp-toutiao`
   - AppID: tt8b7cfdc114713d5d01

3. **热更新**
   - 修改代码后自动重新编译
   - 在抖音开发者工具中点击"编译"

### HBuilderX 方案（需要升级）

1. **升级 HBuilderX 到 3.8+**
2. **打开项目**
3. **运行** → **运行到小程序模拟器** → **抖音开发者工具**

---

## 📋 项目信息

**技术栈**:
- uni-app 3.x (Vue 3)
- Vite 5.2.8
- TypeScript 支持
- 组合式 API (Composition API)

**目录结构**:
```
product-list-vite/
├── src/
│   ├── pages/          # 页面
│   ├── components/     # 组件
│   ├── utils/          # 工具函数
│   ├── manifest.json   # 应用配置
│   └── pages.json      # 页面配置
├── vite.config.js      # Vite 配置
└── package.json        # 项目配置
```

---

## 🔧 常见问题

### Q1: HBuilderX 提示"插件版本不匹配"
**A**: 需要升级 HBuilderX 到 3.6+ 版本

### Q2: 编译后找不到文件
**A**: 确保运行了 `npm install` 安装依赖

### Q3: 图片无法显示
**A**: 检查环境配置，确保指向正确的 CDN
- 开发环境: ppmenu_assets_test@main
- 生产环境: ppmenu_assets@main

### Q4: 热更新不工作
**A**: 命令行模式支持热更新，修改代码后会自动重新编译

---

## 📱 当前环境配置

**开发环境**: ppmenu_assets_test
- CDN: https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets_test@main/
- 数据: 509 条商品
- 用途: 待部署测试

**生产环境**: ppmenu_assets
- CDN: https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/
- 数据: 509 条商品
- 用途: 正式上线

---

## 💡 建议

**短期方案**: 继续使用命令行开发，稳定可靠

**长期方案**: 升级 HBuilderX 到 3.8+ 版本，获得更好的开发体验

**注意**: 不要降级项目到 Vue 2，这会丢失大量功能和代码优化

---

**文档版本**: v1.0
**最后更新**: 2026-04-11
**适用项目**: product-list-vite (uni-app 3.x + Vue 3)
