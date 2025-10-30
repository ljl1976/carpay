# 🚗 用车订单审计系统 - Next.js 15

> 基于 Next.js 15 的全栈用车订单审计系统,支持 Excel 文件上传、自动审计、AI 增强分析和风险报告生成。

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

---

## ⚡ 快速开始

### 3 步完成部署

```bash
# 1. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填写 AI 网关配置

# 2. 推送到 GitHub
git add .
git commit -m "部署 Next.js 15 版本"
git push

# 3. 部署到 EdgeOne Pages
# 访问 https://console.cloud.tencent.com/edgeone/pages
# 从 Git 导入 → 选择 Next.js → 配置环境变量 → 部署
```

**详细步骤**: 查看 [QUICK-START.md](QUICK-START.md)

---

## 🎯 核心功能

### ✅ 审计功能

- **Excel 文件上传** - 支持 .xlsx, .xls 格式
- **8 条审计规则** - 全面覆盖用车合规性检查
- **AI 增强审计** - 使用 Gemini AI 进行二次审计
- **实时统计** - 总订单、合规、不合规、合规率
- **结果展示** - 表格显示,支持排序和筛选
- **结果下载** - 导出 Excel 文件

### 📊 审计规则

1. **上午9点前到公司打车** - 检测疑似上班打车
2. **KTV、足浴店等会所** - 禁止娱乐场所用车
3. **"加班"用词** - 规范用车理由描述
4. **"接""送"客户** - 禁止接送客户用词
5. **"招待""接待"客户** - 禁止招待接待用词
6. **替他人打车** - 禁止代他人用车
7. **高额费用或豪华车型** - 检测异常高额费用
8. **用车类型与补充说明匹配度** - 检测高价车型必要性

### 🤖 AI 增强

- 使用 **Gemini AI** 进行智能审计
- 通过 **EdgeOne AI Gateway** 调用
- 提高审计准确性和覆盖率

### 📈 风险报告

- **总体概况** - 合规率、不合规订单数
- **风险分类统计** - 各类违规的数量分布
- **高风险人员** - 识别频繁违规的员工
- **建议措施** - 自动生成改进建议

---

## 🛠️ 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React 18](https://reactjs.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **Excel**: [xlsx](https://www.npmjs.com/package/xlsx)
- **HTTP**: [axios](https://axios-http.com/)
- **AI**: Gemini (via EdgeOne AI Gateway)

---

## 📁 项目结构

```
carpay/
├── app/                          # Next.js 应用目录
│   ├── api/                      # API 路由
│   │   ├── audit/route.ts        # 审计 API
│   │   └── risk-report/route.ts  # 风险报告 API
│   ├── components/               # React 组件
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── UploadSection.tsx
│   │   ├── ResultsTable.tsx
│   │   ├── RulesSettings.tsx
│   │   └── RiskReport.tsx
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面
│   └── globals.css               # 全局样式
├── package.json                  # 依赖配置
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
└── .env.local                    # 环境变量
```

**详细说明**: 查看 [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

---

## 🚀 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 填写配置:

```env
AI_GATEWAY_URL=https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent
AI_GATEWAY_KEY=你的密钥
OE_KEY=你的密钥
OE_GATEWAY_NAME=gemini
OE_AI_PROVIDER=gemini
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建生产版本

```bash
npm run build
npm start
```

---

## 📤 部署

### 推荐: EdgeOne Pages

**优势:**
- ✅ 中国大陆访问速度快
- ✅ 免费 CDN 和 SSL
- ✅ 深度集成 Next.js
- ✅ 边缘计算

**步骤:**

1. 推送代码到 GitHub
2. 访问 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages)
3. 从 Git 导入项目
4. 选择 **Next.js** 框架
5. 配置环境变量
6. 部署

**详细指南**: 查看 [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md)

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [START-HERE-NEXTJS.md](START-HERE-NEXTJS.md) | 🌟 开始指南 - 从这里开始 |
| [QUICK-START.md](QUICK-START.md) | ⚡ 快速开始 - 3 步完成部署 |
| [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md) | 📖 部署指南 - 详细部署步骤 |
| [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) | 📁 项目结构 - 代码组织说明 |
| [MIGRATION-SUMMARY.md](MIGRATION-SUMMARY.md) | 🔄 迁移总结 - Express → Next.js |
| [CLEANUP-SUMMARY.md](CLEANUP-SUMMARY.md) | 🧹 清理总结 - 项目清理记录 |
| [PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md) | ✅ 部署检查清单 |

---

## 🎓 使用说明

### 1. 准备 Excel 文件

确保 Excel 文件包含名为 **"用车订单"** 的 sheet,包含以下列:

- 下单人姓名
- 开始计费时间
- 实际出发地
- 实际目的地
- 企业实付金额
- 补充说明
- 用车类型(明细)

### 2. 上传并审计

1. 点击"选择文件"按钮
2. 选择 Excel 文件
3. 点击"上传并审计"
4. 等待审计完成

### 3. 查看结果

- **统计卡片** - 查看总体合规情况
- **结果表格** - 查看每条订单的审计结果
- **排序筛选** - 点击表头进行排序

### 4. 下载结果

点击"下载审计结果"按钮,导出包含审计结果的 Excel 文件。

### 5. 生成风险报告

点击"查看风险报告"按钮,查看详细的风险分析报告。

---

## ❓ 常见问题

### Q: 部署后 API 报错?

A: 检查环境变量是否正确配置,特别是 AI 网关相关配置。

### Q: 文件上传失败?

A: 确保 Excel 文件包含"用车订单" sheet,且文件大小不超过 50MB。

### Q: AI 审计不工作?

A: 检查 `AI_GATEWAY_URL` 和 `AI_GATEWAY_KEY` 是否正确配置。

### Q: 框架预设找不到 Next.js?

A: 选择 "Other" 或 "自定义",手动填写:
- 构建命令: `npm run build`
- 输出目录: `.next`

**更多问题**: 查看 [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md) 的常见问题部分

---

## 🔧 开发

### 添加新的审计规则

编辑 `app/api/audit/route.ts`,在 `auditRules` 对象中添加新规则:

```typescript
const auditRules = {
  // ... 现有规则
  
  rule9: (row: any) => {
    // 你的规则逻辑
    if (/* 条件 */) {
      return '审计结果描述'
    }
    return null
  }
}
```

### 自定义样式

编辑 `app/globals.css` 或使用 Tailwind CSS 类名。

### 修改 AI 提示词

编辑 `app/api/audit/route.ts` 中的 `callAIAudit` 函数。

---

## 📄 License

MIT

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [腾讯云 EdgeOne Pages](https://edgeone.ai/) - 部署平台
- [Gemini AI](https://ai.google.dev/) - AI 审计

---

## 📞 支持

如有问题或建议,请查看项目文档或提交 Issue。

---

**开始使用**: 查看 [START-HERE-NEXTJS.md](START-HERE-NEXTJS.md) 🚀

