# ppmenu_assets 生产/测试数据分离 - 完整指南

## 🎯 已完成的工作

### ✅ 1. 创建了自动化脚本

1. **generate-ppmenu-test-data.js** - 生成ppmenu_assets测试数据
   - 从本地data-pages/db读取生产数据
   - 随机选取30条商品作为测试数据
   - 生成3个分页文件和筛选配置
   - 输出到 `ppmenu-assets-test/` 目录

2. **sync-ppmenu-test-data.js** - 同步ppmenu_assets测试数据
   - 克隆ppmenu_assets的main分支
   - 从中提取前3页作为测试数据
   - 自动更新筛选配置数量

3. **set-env.js** - 环境切换脚本
   - 快速切换生产/测试环境
   - 显示当前环境配置

### ✅ 2. 更新了项目配置

- `src/utils/config.js` - 支持ppmenu_assets的main和test分支切换
- 生产环境：使用 `ppmenu_assets@main` (509条)
- 测试环境：使用 `ppmenu_assets@test` (30条)

### ✅ 3. 生成了测试数据

测试数据已生成在：`ppmenu-assets-test/` 目录

---

## 📋 实施步骤

### 第一步：提交测试数据到ppmenu_assets

#### 方法1：创建新的test分支

```bash
cd ppmenu-assets-test
git init
git checkout -b test
git add .
git commit -F COMMIT_MESSAGE.txt
```

然后连接到ppmenu_assets仓库：
```bash
git remote add origin https://github.com/tKyle-Libra/ppmenu_assets.git
git push -u origin test
```

#### 方法2：克隆现有仓库

```bash
# 克隆ppmenu_assets仓库
git clone https://github.com/tKyle-Libra/ppmenu_assets.git
cd ppmenu_assets

# 创建test分支
git checkout -b test

# 复制测试数据
cp -r ../ppmenu-assets-test/* .

# 提交
git add .
git commit -F ../ppmenu-assets-test/COMMIT_MESSAGE.txt
git push origin test
```

### 第二步：切换环境测试

```bash
# 切换到测试环境
node scripts/set-env.js development

# 运行H5测试
npm run dev:h5

# 浏览器访问
http://localhost:5173
```

应该能看到30条测试数据。

```bash
# 切换到生产环境
node scripts/set-env.js production

# 重新编译
npm run dev:h5
```

应该能看到509条完整数据。

---

## 🔄 日常工作流程

### 开发阶段（使用测试数据）

```bash
# 1. 确保在测试环境
node scripts/set-env.js development

# 2. 运行项目
npm run dev:h5

# 3. 开发调试...
# 只有30条数据，加载快，易调试
```

### 测试阶段（使用生产数据）

```bash
# 1. 切换到生产环境
node scripts/set-env.js production

# 2. 重新编译
npm run dev:h5

# 3. 验证功能
# 完整509条数据，验证性能
```

### 更新测试数据

```bash
# 从ppmenu_assets的main分支同步测试数据
node scripts/sync-ppmenu-test-data.js

# 或重新生成测试数据
node scripts/generate-ppmenu-test-data.js
```

---

## 📁 ppmenu_assets 仓库结构

### main分支（生产数据）
```
ppmenu_assets/
├── db/
│   ├── data-page1.json    (20条)
│   ├── data-page2.json    (20条)
│   ├── ...
│   └── data-page26.json   (20条)
├── filter-dimensions.json
└── filter-categories.json
```

### test分支（测试数据）
```
ppmenu_assets/
├── db/
│   ├── data-page1.json    (10条)
│   ├── data-page2.json    (10条)
│   └── data-page3.json    (10条)
├── filter-dimensions.json
└── filter-categories.json
```

---

## 🌐 CDN地址对比

### 生产环境（main分支）
```
https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/db/data-page1.json
```

### 测试环境（test分支）
```
https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@test/db/data-page1.json
```

---

## 💡 快速命令

```bash
# 切换到测试环境
node scripts/set-env.js development

# 切换到生产环境
node scripts/set-env.js production

# 生成测试数据
node scripts/generate-ppmenu-test-data.js

# 同步测试数据
node scripts/sync-ppmenu-test-data.js

# 查看当前环境
node -e "require('./src/utils/config.js').showCurrentEnv()"
```

---

## ✨ 优势

### 对开发者
- ✅ 测试数据量少，加载快
- ✅ 便于调试各种功能
- ✅ 不需要修改代码，只需切换环境
- ✅ 测试数据在GitHub上，可以团队共享

### 对项目
- ✅ 生产数据和测试数据分离
- ✅ 不会因为测试影响生产数据
- ✅ 可以独立管理各自的筛选配置
- ✅ CDN自动缓存，性能优秀

---

## ⚠️ 注意事项

1. **不要将test分支合并到main分支**
2. **切换环境后必须重新编译项目**
3. **测试数据只用于开发，不可用于生产**
4. **更新生产数据时，记得同步更新测试数据**

---

**完成时间**: 2026-04-11
**数据版本**: v1.0
