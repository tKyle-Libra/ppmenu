# ppmenu_assets 仓库生产/测试数据分离方案

## 📋 方案概述

将 ppmenu_assets GitHub 仓库的数据分为：
- **生产数据** (production) - 完整的509条商品数据
- **测试数据** (test) - 部分商品数据用于开发测试

---

## 🎯 推荐方案：使用分支

### 方案A：使用分支（推荐）⭐

#### 目录结构
```
ppmenu_assets/
├── main/                    # 生产数据分支
│   ├── db/                  # 生产数据
│   │   ├── data-page1.json
│   │   ├── data-page2.json
│   │   └── ... (26个文件)
│   ├── filter-dimensions.json
│   └── filter-categories.json
│
└── test/                    # 测试数据分支
    ├── db/                  # 测试数据
    │   ├── data-page1.json
    │   ├── data-page2.json
    │   └── data-page3.json (只有3页)
    ├── filter-dimensions.json
    └── filter-categories.json
```

#### 优点
- ✅ 清晰分离，互不影响
- ✅ 可以独立管理各自的筛选配置
- ✅ GitHub 可以直接切换分支查看
- ✅ 不需要修改数据文件名

#### CDN地址
```javascript
// 生产数据
PRODUCTION_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/'

// 测试数据  
TEST_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@test/'
```

---

### 方案B：使用目录

#### 目录结构
```
ppmenu_assets/
├── production/             # 生产数据目录
│   ├── db/
│   │   ├── data-page1.json
│   │   └── ...
│   └── filter-dimensions.json
│
└── test/                   # 测试数据目录
    ├── db/
    │   ├── data-page1.json
    │   ├── data-page2.json
    │   └── data-page3.json
    └── filter-dimensions.json
```

#### CDN地址
```javascript
// 生产数据
PRODUCTION_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/production/'

// 测试数据
TEST_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/test/'
```

---

### 方案C：使用Tag

#### 目录结构
```
ppmenu_assets/
├── @latest/               # 默认指向生产数据
│   ├── db/
│   └── filter-dimensions.json
│
├── @v1.0.0/              # 生产版本
│   └── ...
│
└── @test/                # 测试版本
    ├── db/
    └── filter-dimensions.json
```

#### CDN地址
```javascript
// 生产数据
PRODUCTION_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@v1.0.0/'

// 测试数据
TEST_URL = 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@test/'
```

---

## 🚀 推荐实施步骤

### 第一步：准备测试数据

1. **克隆 ppmenu_assets 仓库**
```bash
git clone https://github.com/tKyle-Libra/ppmenu_assets.git
cd ppmenu_assets
```

2. **创建测试分支**
```bash
git checkout -b test
```

3. **创建测试数据**
```bash
# 只保留前3页的数据
mkdir -p test/db
mv db/data-page1.json test/db/
mv db/data-page2.json test/db/
mv db/data-page3.json test/db/

# 复制筛选配置
cp filter-dimensions.json test/
cp filter-categories.json test/

# 提交
git add test/
git commit -m "添加测试数据（30条商品，3页）"
git push origin test
```

### 第二步：更新项目配置

修改小程序项目的 `src/utils/config.js`:

```javascript
// 环境配置
export const CURRENT_ENV = ENVIRONMENT.DEVELOPMENT // 或 PRODUCTION

// CDN配置
const CDN_CONFIG = {
  production: {
    BASE_URL: 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@main/',
    DATA_PATH: 'db/',
    TOTAL_PAGES: 26
  },
  development: {
    BASE_URL: 'https://cdn.jsdelivr.net/gh/tKyle-Libra/ppmenu_assets@test/',
    DATA_PATH: 'db/',
    TOTAL_PAGES: 3
  }
}

export const CONFIG = CDN_CONFIG[CURRENT_ENV]
```

### 第三步：切换环境

```bash
# 切换到测试环境
node scripts/set-env.js development

# 切换到生产环境
node scripts/set-env.js production
```

---

## 📝 数据内容建议

### 测试数据（test分支）
- **商品数量**: 30条（3页×10条）
- **类型覆盖**: 包含各种类型（酱包、餐包、罐头等）
- **宠物类型**: 猫、狗、通用都有
- **新品数据**: 包含部分新品
- **用途**: 开发、调试、演示

### 生产数据（main分支）
- **商品数量**: 509条（26页×20条）
- **完整数据**: 所有商品
- **用途**: 正式上线

---

## 🎨 筛选配置处理

### 测试分支的筛选配置

需要更新商品数量以匹配测试数据：

```json
{
  "dimensions": [
    {
      "id": 1,
      "name": "新品",
      "options": [
        { "id": "all", "name": "全部", "value": "", "count": 30 },
        { "id": "new", "name": "新品", "value": "1", "count": 5 }
      ]
    },
    {
      "id": 2,
      "name": "宠物",
      "options": [
        { "id": "all", "name": "全部", "value": "", "count": 30 },
        { "id": "cat", "name": "猫", "value": "cat", "count": 15 },
        { "id": "dog", "name": "狗", "value": "dog", "count": 8 },
        { "id": "universal", "name": "通用", "value": "universal", "count": 7 }
      ]
    }
  ]
}
```

---

## 🔄 工作流程

### 日常开发
1. 使用 **test分支**的数据进行开发
2. 功能完成后在 **main分支**验证
3. 确认无误后合并到main

### 更新数据
```bash
# 更新生产数据
git checkout main
# 修改数据
git add .
git commit -m "更新商品数据"
git push origin main

# 更新测试数据
git checkout test
# 只保留需要的数据
git add .
git commit -m "更新测试数据"
git push origin test
```

---

## 💡 自动化脚本

创建脚本自动生成测试数据：

```bash
# scripts/sync-test-data.sh
# 从main分支提取数据生成test分支的数据
```

---

## ✅ 推荐方案总结

**推荐使用方案A（分支方式）**：

| 特性 | 分支方案 | 目录方案 |
|------|---------|---------|
| 实施难度 | 简单 | 简单 |
| 数据隔离 | ✅ 完全隔离 | ⚠️ 同一仓库 |
| 独立管理 | ✅ 独立提交 | ❌ 混在一起 |
| CDN切换 | ✅ 切换分支名 | ✅ 切换路径 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

需要我帮你实施哪个方案吗？
