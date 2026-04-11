# 测试数据说明

## 📊 数据概况

- **总页数**: 3
- **每页数量**: 10
- **总商品数**: 30
- **生成时间**: 2026/4/11 09:32:28

## 🎯 测试数据特点

1. **数据量少** - 只有生产数据的一小部分，便于调试
2. **类型丰富** - 包含各种类型的商品
3. **随机采样** - 从生产数据中随机选取

## 📁 文件列表

- data-page1..json
- data-page2..json
- data-page3..json

## 🔧 使用方法

### 切换到测试环境

编辑 `src/utils/config.js`：
``javascript
export const CURRENT_ENV = ENVIRONMENT.DEVELOPMENT
```

### 切换到生产环境

编辑 `src/utils/config.js`：
``javascript
export const CURRENT_ENV = ENVIRONMENT.PRODUCTION
```

## 📝 数据来源

从生产数据的以下页中采样：
- 第1页
- 第5页
- 第10页
- 第15页
- 第20页
- 第25页

---

**注意**: 这是测试数据，仅用于开发调试，不可用于生产环境。
