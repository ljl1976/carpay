# ⚡ 快速开始 - Next.js 15 版本

## 🎯 3 步完成部署

### 步骤 1: 准备文件 (1 分钟)

```bash
# 重命名配置文件
mv package-nextjs.json package.json
mv .gitignore.nextjs .gitignore

# 创建环境变量文件
cp .env.local.example .env.local
```

编辑 `.env.local`,填写你的 AI 网关配置:
```env
AI_GATEWAY_URL=https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent
AI_GATEWAY_KEY=你的密钥
OE_KEY=你的密钥
OE_GATEWAY_NAME=gemini
OE_AI_PROVIDER=gemini
```

### 步骤 2: 推送到 GitHub (2 分钟)

```bash
git add .
git commit -m "迁移到 Next.js 15"
git push
```

### 步骤 3: 部署到 EdgeOne Pages (3 分钟)

1. 访问 https://console.cloud.tencent.com/edgeone/pages
2. 点击"新建项目" → "从 Git 导入"
3. 选择 `carpay` 仓库
4. **框架预设**: 选择 `Next.js`
5. 点击"部署"
6. 进入"设置" → "环境变量",添加 `.env.local` 中的变量
7. 点击"重新部署"

✅ **完成!** 你的应用已上线!

---

## 📋 文件清单

确保你有以下文件:

```
✅ app/                    # 应用目录
   ├── api/
   │   ├── audit/route.ts
   │   └── risk-report/route.ts
   ├── components/
   │   ├── Sidebar.tsx
   │   ├── StatsCards.tsx
   │   ├── UploadSection.tsx
   │   ├── ResultsTable.tsx
   │   ├── RulesSettings.tsx
   │   └── RiskReport.tsx
   ├── layout.tsx
   ├── page.tsx
   └── globals.css

✅ package.json            # (从 package-nextjs.json 重命名)
✅ next.config.js
✅ tsconfig.json
✅ tailwind.config.js
✅ postcss.config.js
✅ .env.local              # (从 .env.local.example 复制)
✅ .gitignore              # (从 .gitignore.nextjs 重命名)
```

---

## 🧪 本地测试(可选)

如果想先在本地测试:

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问
# http://localhost:3000
```

---

## 📚 详细文档

- **项目说明**: `README-NEXTJS.md`
- **部署指南**: `DEPLOY-GUIDE.md`
- **项目结构**: `PROJECT-STRUCTURE.md`

---

## ❓ 常见问题

### Q: 框架预设找不到 Next.js?

A: 选择 "Other" 或 "自定义",手动填写:
- 构建命令: `npm run build`
- 输出目录: `.next`

### Q: 部署失败?

A: 检查:
1. ✅ `package-nextjs.json` 已重命名为 `package.json`
2. ✅ 环境变量已配置
3. ✅ 查看 EdgeOne Pages 部署日志

### Q: API 报错?

A: 检查环境变量是否正确配置,特别是 AI 网关相关配置。

---

## 🎉 就这么简单!

3 步完成,你的用车订单审计系统已成功迁移到 Next.js 15 并部署到 EdgeOne Pages!

**享受边缘计算的速度吧! 🚀**

