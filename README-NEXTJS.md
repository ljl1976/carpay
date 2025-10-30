# 用车订单审计系统 - Next.js 15 版本

基于 Next.js 15 的用车订单审计系统，支持 Excel 文件上传、自动审计和结果下载。

## 🚀 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **xlsx** - Excel 文件处理
- **Axios** - HTTP 请求

## 📦 项目结构

```
carpay-nextjs/
├── app/
│   ├── api/
│   │   ├── audit/
│   │   │   └── route.ts          # 审计 API
│   │   └── risk-report/
│   │       └── route.ts          # 风险报告 API
│   ├── components/
│   │   ├── Sidebar.tsx           # 侧边栏
│   │   ├── StatsCards.tsx        # 统计卡片
│   │   ├── UploadSection.tsx     # 上传区域
│   │   ├── ResultsTable.tsx      # 结果表格
│   │   ├── RulesSettings.tsx     # 规则设置
│   │   └── RiskReport.tsx        # 风险报告
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面
│   └── globals.css               # 全局样式
├── next.config.js                # Next.js 配置
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 依赖配置
└── .env.local                    # 环境变量(本地)
```

## 🛠️ 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 填写你的 AI 网关配置:

```env
AI_GATEWAY_URL=https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent
AI_GATEWAY_KEY=your_api_key_here
OE_KEY=your_oe_key_here
OE_GATEWAY_NAME=gemini
OE_AI_PROVIDER=gemini
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📤 部署到 EdgeOne Pages

### 方法 1: 通过 GitHub 自动部署(推荐)

#### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库(如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "Next.js 15 版本"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/carpay.git

# 推送
git push -u origin main
```

#### 步骤 2: 在 EdgeOne Pages 创建项目

1. 访问 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages)
2. 点击"新建项目"
3. 选择"从 Git 导入"
4. 授权 GitHub 并选择 `carpay` 仓库
5. **框架预设**: 选择 **Next.js**
6. **构建命令**: `npm run build`
7. **输出目录**: `.next`
8. 点击"部署"

#### 步骤 3: 配置环境变量

1. 进入项目设置 → 环境变量
2. 添加以下环境变量:
   - `AI_GATEWAY_URL`
   - `AI_GATEWAY_KEY`
   - `OE_KEY`
   - `OE_GATEWAY_NAME`
   - `OE_AI_PROVIDER`
3. 保存并重新部署

### 方法 2: 通过 ZIP 文件上传

#### 步骤 1: 构建项目

```bash
npm run build
```

#### 步骤 2: 打包文件

将以下文件/文件夹打包成 ZIP:
- `app/`
- `.next/`
- `public/` (如果有)
- `package.json`
- `next.config.js`
- `tsconfig.json`

#### 步骤 3: 上传到 EdgeOne Pages

1. 访问 EdgeOne Pages 控制台
2. 点击"新建项目"
3. 选择"上传 ZIP"
4. 上传打包的 ZIP 文件
5. 框架选择 **Next.js**
6. 配置环境变量
7. 部署

## 🎯 审计规则

系统包含 8 条审计规则:

1. **上午9点前到公司打车** - 检测疑似上班打车
2. **KTV、足浴店等会所** - 禁止娱乐场所用车
3. **"加班"用词** - 规范用车理由描述
4. **"接""送"客户** - 禁止接送客户用词
5. **"招待""接待"客户** - 禁止招待接待用词
6. **替他人打车** - 禁止代他人用车
7. **高额费用或豪华车型** - 检测异常高额费用
8. **用车类型与补充说明匹配度** - 检测高价车型必要性

## 🤖 AI 增强审计

系统集成了 Gemini AI,对本地规则检查合规的数据进行二次 AI 判别,提高审计准确性。

## 📊 功能特性

- ✅ Excel 文件上传(支持 .xlsx, .xls)
- ✅ 自动审计(8条规则 + AI增强)
- ✅ 实时统计(总订单、合规、不合规、合规率)
- ✅ 结果排序和筛选
- ✅ 审计结果下载
- ✅ 风险报告生成
- ✅ 审计规则查看

## 🔧 常见问题

### Q: 部署后 API 报错?

A: 检查环境变量是否正确配置,特别是 AI 网关相关配置。

### Q: 文件上传失败?

A: 确保 Excel 文件包含"用车订单" sheet,且文件大小不超过 50MB。

### Q: AI 审计不工作?

A: 检查 AI_GATEWAY_URL 和 AI_GATEWAY_KEY 是否正确配置。

## 📝 从 Express 版本迁移

如果你之前使用的是 Express 版本,主要变化:

1. **前端**: HTML → React 组件
2. **后端**: Express 路由 → Next.js API Routes
3. **文件上传**: multer → Next.js FormData
4. **部署**: 需要单独部署前后端 → 全栈一体化部署

## 📄 License

MIT

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [腾讯云 EdgeOne Pages](https://edgeone.ai/)

