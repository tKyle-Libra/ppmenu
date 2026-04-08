# uniapp 商品列表小程序

基于 uniapp (Vue3) 开发的商品列表展示小程序，支持微信小程序和抖音小程序。

## ✨ 项目特性

- ✅ Banner 轮播（上滑隐藏/下滑显示）
- ✅ 筛选栏（固定顶部，横向滚动）
- ✅ 商品列表展示
- ✅ 分页加载（上拉加载更多）
- ✅ 数据缓存
- ✅ 图片懒加载
- ✅ 跨平台支持（H5/微信/抖音）

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

```bash
./run.sh
```

然后选择运行平台（1=H5，2=微信，3=抖音）

### 方式二：手动运行

```bash
# 安装依赖（首次运行）
npm install

# H5 模式（浏览器调试）
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# 抖音小程序
npm run dev:mp-toutiao
```

## 📂 项目结构

```
product-list-vite/
├── src/
│   ├── components/          # 组件目录
│   │   ├── BannerSwiper/   # Banner轮播组件
│   │   ├── FilterBar/      # 筛选栏组件
│   │   ├── ProductList/    # 商品列表组件
│   │   ├── ProductCard/    # 商品卡片组件
│   │   └── LoadingState/   # 加载状态组件
│   ├── pages/             # 页面目录
│   │   └── index/         # 首页
│   ├── utils/             # 工具函数
│   │   ├── config.js      # 配置文件
│   │   ├── request.js     # 网络请求
│   │   ├── cache.js       # 缓存管理
│   │   └── data.js        # 数据加载
│   ├── db/                # 数据文件（分页）
│   └── static/            # 静态资源
├── public/                # 公共静态资源
│   └── db/                # 数据文件副本
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── run.sh                 # 启动脚本
```

## 📊 数据说明

### 分页数据
- 总数据量：283 条商品
- 分页方式：15 页（每页 20 条，最后一页 3 条）
- 数据位置：`src/db/` 和 `public/db/`

### 商品数据字段
```javascript
{
  "product_id": 283,              // 商品ID
  "product_name": "冰激凌",       // 商品名称
  "product_price": "6.7",         // 价格
  "product_img": "image_xxx",     // 图片文件名
  "product_eat_type": 2,          // 宠物类型 (1:猫 2:狗 3:猫狗)
  "product_is_new": 0,            // 是否新品 (0:否 1:是)
  "product_weight": "80g",        // 重量
  "product_type_id": 4,           // 类型ID
  "brand_name": "高爷家",         // 品牌
  "product_type_name": "餐盒",    // 类型名称
  "product_tastes": "莓莓、蜜瓜、香蕉"  // 口味（顿号分隔）
}
```

## ⚙️ 配置说明

### 修改 Banner 图片

编辑 `src/utils/config.js`：

```javascript
export const BANNER_IMAGES = [
  'https://你的图片1.jpg',
  'https://你的图片2.jpg',
  'https://你的图片3.jpg'
]
```

### 修改筛选条件

编辑 `src/components/FilterBar/FilterBar.vue`：

```javascript
filterOptions: [
  { id: 1, name: '全部' },
  { id: 2, name: '你的筛选1' },
  { id: 3, name: '你的筛选2' }
]
```

### 配置小程序 AppID

编辑 `src/manifest.json`：

```json
{
  "mp-weixin": {
    "appid": "你的微信小程序AppID"
  },
  "mp-toutiao": {
    "appid": "你的抖音小程序AppID"
  }
}
```

## 🎨 功能特性

### 1. 分页加载
- 首屏加载第 1 页（20 条）
- 上拉触底自动加载下一页
- 已加载页面数据缓存，避免重复请求

### 2. Banner 显隐控制
- 上滑时自动隐藏 Banner
- 下滑时自动显示 Banner
- 平滑过渡动画

### 3. 数据缓存
- 内存缓存
- 缓存有效期管理
- 减少网络请求，提升性能

### 4. 图片优化
- 懒加载（`lazy-load`）
- CDN 加速
- 自动拼接完整 URL

## 🐛 常见问题

### 1. 图片不显示
- 检查 CDN 地址是否正确
- 确认域名白名单已配置（小程序）
- 检查图片路径是否完整

### 2. 数据加载失败
- 检查数据文件是否在 `public/db/` 目录
- 查看控制台错误信息
- 确认数据文件格式正确

### 3. 分页不工作
- 检查 `TOTAL_PAGES` 配置
- 确认数据文件数量
- 查看控制台日志

## 📝 开发规范

### 命名规范
- 组件名：PascalCase（如：ProductCard）
- 文件名：kebab-case（如：product-card.vue）
- 变量名：camelCase（如：currentPage）
- 常量名：UPPER_CASE（如：API_BASE_URL）

### 注释规范
```javascript
/**
 * 加载指定页的商品数据
 * @param {number} pageNum - 页码（从1开始）
 * @returns {Promise<Array>} 商品数据数组
 */
async function loadPageData(pageNum) {
  // 实现逻辑
}
```

## 📱 运行平台

### H5（推荐用于开发调试）
```bash
npm run dev:h5
```
访问：http://localhost:5173

### 微信小程序
```bash
npm run dev:mp-weixin
```
用微信开发者工具打开 `dist/dev/mp-weixin`

### 抖音小程序
```bash
npm run dev:mp-toutiao
```
用抖音开发者工具打开 `dist/dev/mp-toutiao`

## 🎯 待实现功能

- [ ] 筛选功能实际逻辑（当前只是 UI）
- [ ] 排序功能
- [ ] 搜索功能
- [ ] 骨架屏
- [ ] 下拉刷新
- [ ] 数据更新检测

## 📚 参考资源

- [uniapp 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [抖音小程序文档](https://developer.open-douyin.com/)

## 📄 License

MIT
