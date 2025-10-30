# 📁 Next.js 项目结构说明

## 🎯 项目概览

这是一个基于 Next.js 15 的全栈应用,包含前端界面和后端 API。

```
carpay-nextjs/
├── 📁 app/                          # Next.js App Router 目录
│   ├── 📁 api/                      # API 路由
│   │   ├── 📁 audit/
│   │   │   └── route.ts             # 审计 API (POST /api/audit)
│   │   └── 📁 risk-report/
│   │       └── route.ts             # 风险报告 API (POST /api/risk-report)
│   ├── 📁 components/               # React 组件
│   │   ├── Sidebar.tsx              # 侧边栏导航
│   │   ├── StatsCards.tsx           # 统计卡片
│   │   ├── UploadSection.tsx        # 文件上传区域
│   │   ├── ResultsTable.tsx         # 审计结果表格
│   │   ├── RulesSettings.tsx        # 审计规则设置页面
│   │   └── RiskReport.tsx           # 风险报告组件
│   ├── layout.tsx                   # 根布局(HTML 结构)
│   ├── page.tsx                     # 主页面(首页)
│   └── globals.css                  # 全局样式
├── 📄 package-nextjs.json           # 依赖配置(需重命名为 package.json)
├── 📄 next.config.js                # Next.js 配置
├── 📄 tsconfig.json                 # TypeScript 配置
├── 📄 tailwind.config.js            # Tailwind CSS 配置
├── 📄 postcss.config.js             # PostCSS 配置
├── 📄 .env.local.example            # 环境变量示例
├── 📄 .gitignore.nextjs             # Git 忽略文件(需重命名为 .gitignore)
├── 📄 README-NEXTJS.md              # 项目说明文档
├── 📄 DEPLOY-GUIDE.md               # 部署指南
└── 📄 PROJECT-STRUCTURE.md          # 本文件
```

---

## 📂 目录详解

### 1. `app/` 目录

Next.js 15 使用 **App Router**,所有页面和 API 都在 `app/` 目录下。

#### 1.1 `app/api/` - API 路由

| 文件 | 路由 | 方法 | 功能 |
|------|------|------|------|
| `api/audit/route.ts` | `/api/audit` | POST | 接收 Excel 文件,执行审计,返回结果 |
| `api/risk-report/route.ts` | `/api/risk-report` | POST | 接收审计数据,生成风险报告 |

**特点:**
- 使用 Next.js 原生 `FormData` 处理文件上传(无需 multer)
- 支持 TypeScript 类型检查
- 自动部署为 Serverless 函数

#### 1.2 `app/components/` - React 组件

| 组件 | 功能 |
|------|------|
| `Sidebar.tsx` | 左侧导航栏,切换"用车订单审计"和"审计规则设置" |
| `StatsCards.tsx` | 显示统计数据(总订单、合规、不合规、合规率) |
| `UploadSection.tsx` | 文件上传区域,调用 `/api/audit` |
| `ResultsTable.tsx` | 显示审计结果表格,支持排序和筛选 |
| `RulesSettings.tsx` | 显示 8 条审计规则的详细说明 |
| `RiskReport.tsx` | 显示风险报告(总体概况、风险分类、高风险人员、建议措施) |

**特点:**
- 使用 `'use client'` 标记为客户端组件
- 使用 React Hooks (useState, useRef)
- TypeScript 类型安全

#### 1.3 `app/layout.tsx` - 根布局

定义整个应用的 HTML 结构:
- `<html>` 和 `<body>` 标签
- 全局字体(Noto Sans SC)
- 元数据(标题、描述)

#### 1.4 `app/page.tsx` - 主页面

应用的首页,包含:
- 状态管理(审计数据、统计信息)
- 文件上传逻辑
- 结果下载逻辑
- 风险报告生成逻辑
- 组件组合

#### 1.5 `app/globals.css` - 全局样式

包含:
- Tailwind CSS 导入
- 自定义动画(fadeIn)
- 侧边栏样式
- 表格样式

---

### 2. 配置文件

#### 2.1 `package-nextjs.json`

**重要:** 部署前需重命名为 `package.json`

包含:
- Next.js 15 依赖
- React 18 依赖
- TypeScript 依赖
- xlsx, axios 等工具库
- 构建脚本(`dev`, `build`, `start`)

#### 2.2 `next.config.js`

Next.js 配置:
- 文件上传大小限制(50MB)
- API 路由配置
- 实验性功能配置

#### 2.3 `tsconfig.json`

TypeScript 配置:
- 编译选项
- 路径别名(`@/*`)
- 包含/排除文件

#### 2.4 `tailwind.config.js`

Tailwind CSS 配置:
- 内容路径(扫描哪些文件)
- 主题扩展
- 插件

#### 2.5 `.env.local.example`

环境变量示例:
- AI 网关配置
- EdgeOne 配置

**使用方法:**
```bash
cp .env.local.example .env.local
# 编辑 .env.local 填写实际值
```

---

## 🔄 数据流

### 1. 文件上传和审计流程

```
用户选择 Excel 文件
    ↓
点击"上传并审计"按钮
    ↓
UploadSection 组件调用 onUpload()
    ↓
page.tsx 中的 handleUpload() 发送 POST 请求到 /api/audit
    ↓
app/api/audit/route.ts 处理请求:
    - 读取 Excel 文件
    - 执行 8 条审计规则
    - 调用 AI 进行增强审计
    - 返回审计结果和统计数据
    ↓
page.tsx 更新状态(auditedData, stats)
    ↓
ResultsTable 组件显示结果
StatsCards 组件显示统计
```

### 2. 风险报告生成流程

```
用户点击"查看风险报告"按钮
    ↓
ResultsTable 组件调用 onGenerateReport()
    ↓
page.tsx 中的 handleGenerateReport() 发送 POST 请求到 /api/risk-report
    ↓
app/api/risk-report/route.ts 处理请求:
    - 统计总体概况
    - 分析风险分类
    - 识别高风险人员
    - 生成建议措施
    ↓
page.tsx 更新状态(reportData, showReport)
    ↓
RiskReport 组件显示报告
```

---

## 🎨 样式系统

### Tailwind CSS 类名示例

```tsx
// 卡片
<div className="bg-white p-6 rounded-xl shadow-md">

// 按钮
<button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg">

// 表格
<table className="w-full text-left text-sm">

// 统计数字
<p className="text-3xl font-bold">
```

### 自定义样式

在 `globals.css` 中定义:
- `.sidebar-link` - 侧边栏链接样式
- `.content-section` - 内容区域样式
- `.filter-header` - 表格筛选头样式
- `@keyframes fadeIn` - 淡入动画

---

## 🔧 开发工作流

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local

# 3. 启动开发服务器
npm run dev

# 4. 访问
# http://localhost:3000
```

### 构建和部署

```bash
# 1. 构建生产版本
npm run build

# 2. 本地预览生产版本
npm start

# 3. 部署到 EdgeOne Pages
# 参考 DEPLOY-GUIDE.md
```

---

## 📊 与 Express 版本对比

| 功能 | Express 版本 | Next.js 版本 |
|------|-------------|-------------|
| **前端** | HTML + Vanilla JS | React + TypeScript |
| **后端** | Express 路由 | Next.js API Routes |
| **文件上传** | multer | FormData (原生) |
| **样式** | Tailwind CDN | Tailwind 构建 |
| **部署** | 需分离部署 | 全栈一体化 |
| **类型安全** | ❌ | ✅ TypeScript |
| **热更新** | nodemon | Next.js 内置 |
| **SEO** | ❌ | ✅ 支持 SSR |

---

## 🚀 部署到 EdgeOne Pages

### 为什么选择 Next.js?

1. ✅ **深度集成** - EdgeOne Pages 对 Next.js 有深度优化
2. ✅ **自动识别** - 框架预设自动识别 Next.js 项目
3. ✅ **全栈部署** - 前后端一起部署,无需分离
4. ✅ **边缘计算** - API Routes 自动部署为边缘函数
5. ✅ **CDN 加速** - 静态资源自动 CDN 加速

### 部署步骤

详见 `DEPLOY-GUIDE.md`

---

## 📝 文件重命名清单

部署前必须重命名:

```bash
# 1. 重命名 package.json
mv package-nextjs.json package.json

# 2. 重命名 .gitignore
mv .gitignore.nextjs .gitignore

# 3. 创建环境变量文件
cp .env.local.example .env.local
```

---

## 🎯 下一步

1. ✅ 阅读 `README-NEXTJS.md` 了解项目功能
2. ✅ 阅读 `DEPLOY-GUIDE.md` 学习部署步骤
3. ✅ 本地测试项目
4. ✅ 部署到 EdgeOne Pages

---

**祝你使用愉快! 🎉**

