# 🚀 EdgeOne Pages 部署指南

## 📋 项目概述

**用车订单审计系统 - Next.js 15 版本**

### 核心功能
- ✅ Excel 文件上传和解析
- ✅ 8 条本地规则审计
- ✅ AI 批量智能审计(Gemini)
- ✅ 风险报告生成
- ✅ 部门汇总统计
- ✅ 带样式的 Excel 导出

### 技术栈
- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Excel**: xlsx + xlsx-js-style
- **AI**: Gemini (通过 EdgeOne AI Gateway)

---

## 📋 部署前准备

### 1. 文件清单

确保你有以下 Next.js 项目文件:

```
✅ app/                    # 应用目录
  ├── api/                 # API 路由
  │   ├── audit/           # 规则审计接口
  │   ├── ai-audit/        # AI 审计接口
  │   └── risk-report/     # 风险报告接口
  ├── components/          # React 组件
  └── page.tsx             # 主页面
✅ package.json            # 依赖配置
✅ next.config.js          # Next.js 配置
✅ tsconfig.json           # TypeScript 配置
✅ tailwind.config.js      # Tailwind 配置
✅ postcss.config.js       # PostCSS 配置
✅ .env.local.example      # 环境变量示例
```

### 2. 检查依赖

确保 `package.json` 包含以下关键依赖:

```json
{
  "dependencies": {
    "next": "^15.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "xlsx": "^0.18.5",
    "xlsx-js-style": "^1.2.0",
    "axios": "^1.6.7"
  }
}
```

### 3. 准备环境变量

你需要准备以下环境变量的值:

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `AI_GATEWAY_URL` | AI 网关地址 | `https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent` |
| `AI_GATEWAY_KEY` | AI 网关密钥 | `your-api-key` |
| `OE_KEY` | EdgeOne 密钥 | `your-oe-key` |
| `OE_GATEWAY_NAME` | 网关名称 | `gemini` |
| `OE_AI_PROVIDER` | AI 提供商 | `gemini` |

**获取方式:**
1. 访问 EdgeOne 控制台
2. 进入 AI Gateway 设置
3. 创建或查看现有网关配置

---

## 🎯 方法 1: GitHub 自动部署(推荐)

### 步骤 1: 推送到 GitHub

```bash
# 初始化 Git(如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "迁移到 Next.js 15"

# 添加远程仓库(替换为你的仓库地址)
git remote add origin https://github.com/你的用户名/carpay.git

# 推送
git push -u origin main
```

### 步骤 2: 在 EdgeOne Pages 创建项目

1. 访问 https://console.cloud.tencent.com/edgeone/pages
2. 点击 **"新建项目"**
3. 选择 **"从 Git 导入"**
4. 授权 GitHub 账号
5. 选择 `carpay` 仓库
6. 配置构建设置:
   - **框架预设**: `Next.js`
   - **构建命令**: `npm run build`
   - **输出目录**: `.next`
   - **Node.js 版本**: `18.x` 或 `20.x`
7. 点击 **"部署"**

### 步骤 3: 配置环境变量

1. 进入项目 → **设置** → **环境变量**
2. 添加以下变量:

| 变量名 | 值 |
|--------|-----|
| `AI_GATEWAY_URL` | `https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent` |
| `AI_GATEWAY_KEY` | `你的密钥` |
| `OE_KEY` | `你的密钥` |
| `OE_GATEWAY_NAME` | `gemini` |
| `OE_AI_PROVIDER` | `gemini` |

3. 保存后点击 **"重新部署"**

### 步骤 4: 访问应用

部署完成后,EdgeOne Pages 会提供一个域名,例如:
```
https://carpay-xxx.edgeone.app
```

---

## 📦 方法 2: ZIP 文件上传

### 步骤 1: 本地测试

```bash
# 安装依赖
npm install

# 本地运行测试
npm run dev
```

访问 http://localhost:3000 确保一切正常。

### 步骤 2: 构建项目

```bash
npm run build
```

### 步骤 3: 打包文件

**方式 A: 打包源代码(推荐)**

将以下文件/文件夹压缩成 ZIP:
```
app/
public/ (如果有)
package.json
next.config.js
tsconfig.json
tailwind.config.js
postcss.config.js
```

**方式 B: 打包构建产物**

将以下文件/文件夹压缩成 ZIP:
```
.next/
app/
public/ (如果有)
package.json
next.config.js
```

### 步骤 4: 上传到 EdgeOne Pages

1. 访问 https://console.cloud.tencent.com/edgeone/pages
2. 点击 **"新建项目"**
3. 选择 **"上传 ZIP"**
4. 上传你的 ZIP 文件
5. 配置:
   - **框架预设**: `Next.js`
   - **项目名称**: `carpay`
6. 配置环境变量(同方法1步骤3)
7. 点击 **"部署"**

---

## 🔧 部署后检查

### 1. 检查部署日志

在 EdgeOne Pages 控制台查看部署日志,确保:
- ✅ 依赖安装成功 (包括 xlsx-js-style)
- ✅ 构建成功 (npm run build)
- ✅ 部署成功

**常见构建日志:**
```
> npm install
> npm run build
> Building Next.js application...
> ✓ Compiled successfully
> Deployment successful!
```

### 2. 测试完整功能流程

访问部署的域名,按以下顺序测试:

#### 步骤 1: 上传文件
- ✅ 点击上传区域选择 Excel 文件
- ✅ 文件名显示正确
- ✅ 显示"成功上传 N 条数据"

#### 步骤 2: 规则审计
- ✅ 点击"规则审计"按钮
- ✅ 显示审计结果表格
- ✅ 统计卡片显示正确数据
- ✅ 审计结果列显示违规信息
- ✅ **不应该调用 AI**(速度快)

#### 步骤 3: AI 一键分析
- ✅ 点击"AI一键分析"按钮
- ✅ 等待 AI 审计完成(可能需要几秒到几十秒)
- ✅ 审计结果更新,包含 "AI:" 前缀的结果
- ✅ 自动跳转到风险报告页面
- ✅ 风险报告显示完整数据

#### 步骤 4: 下载结果
- ✅ 点击"下载审计结果"按钮
- ✅ 下载 Excel 文件成功
- ✅ 打开 Excel 文件,检查两个 sheet:
  - **审计结果明细**: 包含所有数据和样式
  - **部门汇总**: 按账期和部门汇总
- ✅ 验证样式:
  - 表头: 淡蓝背景、加粗、居中
  - 金额列: 右对齐、货币格式 (¥1,250.50)
  - 时间列: 日期时间格式 (2024-01-15 08:30)
  - 审计结果列: 颜色标识(绿/橙/红)
  - 所有单元格: 细边框
  - 字体: 微软雅黑 10号

### 3. 检查 API 接口

打开浏览器开发者工具(F12) → Network 标签,检查:

| API 接口 | 方法 | 状态码 | 说明 |
|---------|------|--------|------|
| `/api/audit` | POST | 200 | 规则审计接口 |
| `/api/ai-audit` | POST | 200 | AI 批量审计接口 |
| `/api/risk-report` | POST | 200 | 风险报告接口 |

**检查要点:**
- ✅ 没有 CORS 错误
- ✅ 没有 500 错误
- ✅ 响应时间合理
- ✅ 返回数据格式正确

### 4. 检查环境变量

在 EdgeOne Pages 控制台 → 设置 → 环境变量,确认:
- ✅ 所有 5 个环境变量都已配置
- ✅ 值没有多余的空格或引号
- ✅ AI_GATEWAY_URL 格式正确

---

## ❌ 常见问题

### Q1: 部署失败,提示 "找不到 package.json"

**原因:** package.json 文件不存在或路径错误

**解决方案:**
```bash
# 确保项目根目录有 package.json
ls -la package.json

# 如果是 package-nextjs.json,重命名
mv package-nextjs.json package.json
```

---

### Q2: 部署成功但页面空白

**原因:** 前端构建失败或路由配置错误

**解决方案:**
1. 检查浏览器控制台(F12)是否有错误
2. 检查 EdgeOne Pages 部署日志
3. 确保 `next.config.js` 配置正确
4. 本地测试: `npm run build && npm start`

---

### Q3: API 返回 500 错误

**原因:** 环境变量未配置或 AI 网关调用失败

**解决方案:**
1. 检查环境变量是否正确配置(EdgeOne Pages → 设置 → 环境变量)
2. 查看 EdgeOne Pages 函数日志
3. 确保 AI 网关配置正确
4. 测试 AI 网关是否可访问:
   ```bash
   curl -X POST "你的AI_GATEWAY_URL?key=你的AI_GATEWAY_KEY" \
     -H "OE-Key: 你的OE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"test"}]}]}'
   ```

---

### Q4: 文件上传失败

**原因:** 文件大小超限或格式错误

**解决方案:**
1. 检查文件大小是否超过 50MB
2. 确保 Excel 文件包含"用车订单" sheet
3. 检查 `next.config.js` 中的 `bodySizeLimit` 配置:
   ```javascript
   experimental: {
     serverActions: {
       bodySizeLimit: '50mb'
     }
   }
   ```
4. 确保 Excel 文件格式正确(.xlsx 或 .xls)

---

### Q5: AI 审计超时或失败

**原因:** AI 网关响应慢或数据量过大

**解决方案:**
1. 检查数据量(建议 <500 条订单)
2. 增加超时时间(app/api/ai-audit/route.ts):
   ```typescript
   timeout: 120000 // 改为 120 秒
   ```
3. 检查 AI 网关状态
4. 查看 EdgeOne Pages 函数日志

---

### Q6: Excel 导出没有样式

**原因:** xlsx-js-style 依赖未安装

**解决方案:**
1. 确保 package.json 包含 `xlsx-js-style`:
   ```json
   {
     "dependencies": {
       "xlsx-js-style": "^1.2.0"
     }
   }
   ```
2. 重新部署项目
3. 检查部署日志,确认依赖安装成功

---

### Q7: 部门汇总数据不正确

**原因:** Excel 数据中缺少"部门名称"列

**解决方案:**
1. 确保 Excel 数据包含"部门名称"列
2. 或修改 `app/page.tsx` 中的 `extractDepartment` 函数
3. 检查部门名称是否为空

---

### Q8: 框架预设找不到 Next.js

**原因:** EdgeOne Pages 版本较旧

**解决方案:**
- 如果下拉列表中没有 Next.js,选择 **"Other"** 或 **"自定义"**
- 手动填写:
  - **构建命令**: `npm run build`
  - **输出目录**: `.next`
  - **安装命令**: `npm install`

---

### Q9: 规则2 检测不到休闲娱乐场所

**原因:** 场所名称不在关键词列表中

**解决方案:**
1. 查看 `app/api/audit/route.ts` 中的规则2
2. 添加更多关键词或模式
3. 使用 AI 审计进行补充检测

---

### Q10: "AI:" 前缀没有显示

**原因:** AI 审计接口返回格式错误

**解决方案:**
1. 检查 `app/api/ai-audit/route.ts` 中的前缀添加逻辑
2. 查看浏览器控制台的 API 响应
3. 确保 AI 返回的是 JSON 数组格式

---

## 🎉 部署成功!

恭喜!你的用车订单审计系统已成功部署到 EdgeOne Pages。

### 下一步:

1. ✅ 绑定自定义域名(可选)
2. ✅ 配置 SSL 证书(EdgeOne 自动提供)
3. ✅ 设置访问控制(可选)
4. ✅ 监控应用性能

---

## 📞 需要帮助?

如果遇到问题:
1. 查看 EdgeOne Pages 文档: https://cloud.tencent.com/document/product/1552
2. 查看 Next.js 文档: https://nextjs.org/docs
3. 检查项目的 README-NEXTJS.md 文件

---

**祝部署顺利! 🚀**

