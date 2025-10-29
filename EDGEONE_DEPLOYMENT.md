# 🚀 腾讯 EdgeOne Pages 部署指南

本指南将帮助你将用车订单审计系统部署到腾讯 EdgeOne Pages。

## 📋 部署前准备

### 1. 注册 EdgeOne Pages 账号
访问 [EdgeOne Pages](https://pages.edgeone.ai/) 注册账号

### 2. 准备 Git 仓库
EdgeOne Pages 支持从 Git 仓库部署,建议将代码推送到:
- GitHub
- GitLab
- Gitee (码云)

## 🎯 部署方式选择

EdgeOne Pages 提供多种部署方式:

### 方式 1: Git 仓库自动部署 (推荐)
- ✅ 自动化部署
- ✅ 支持持续集成
- ✅ 版本管理

### 方式 2: 直接上传
- ✅ 快速部署
- ✅ 无需 Git

### 方式 3: EdgeOne CLI
- ✅ 命令行部署
- ✅ 适合自动化脚本

## 📦 方式 1: Git 仓库部署 (推荐)

### 步骤 1: 推送代码到 Git 仓库

```bash
# 初始化 Git 仓库 (如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到 EdgeOne Pages"

# 添加远程仓库 (替换为你的仓库地址)
git remote add origin https://github.com/你的用户名/carpay.git

# 推送到远程仓库
git push -u origin main
```

### 步骤 2: 在 EdgeOne Pages 创建项目

1. 登录 [EdgeOne Pages 控制台](https://pages.edgeone.ai/)
2. 点击 **"导入 Git 仓库"**
3. 授权访问你的 Git 账号
4. 选择 `carpay` 仓库
5. 配置构建设置:

**构建配置:**
```
框架预设: Node.js
构建命令: (留空,不需要构建)
输出目录: (留空)
安装命令: npm install
根目录: /
Node.js 版本: 18.x
```

**环境变量:**
添加以下环境变量:
```
AI_GATEWAY_URL=你的AI网关URL
AI_GATEWAY_KEY=你的API密钥
OE_KEY=你的OE密钥
OE_GATEWAY_NAME=gemini
OE_AI_PROVIDER=gemini
PORT=3000
```

6. 点击 **"部署"**

### 步骤 3: 等待部署完成

部署完成后,你会获得一个 EdgeOne Pages 域名,例如:
```
https://carpay-xxx.pages.edgeone.app
```

## 📦 方式 2: 直接上传部署

### 步骤 1: 准备部署包

```bash
# 安装依赖
npm install

# 创建部署包 (排除 node_modules)
# Windows PowerShell:
Compress-Archive -Path index.html,server.js,package.json,package-lock.json,.env -DestinationPath deploy.zip
```

### 步骤 2: 上传到 EdgeOne Pages

1. 登录 [EdgeOne Pages 控制台](https://pages.edgeone.ai/)
2. 点击 **"直接上传"**
3. 上传 `deploy.zip`
4. 配置环境变量 (同上)
5. 点击 **"部署"**

## 📦 方式 3: 使用 EdgeOne CLI

### 步骤 1: 安装 EdgeOne CLI

```bash
npm install -g @edgeone/cli
```

### 步骤 2: 登录

```bash
edgeone login
```

### 步骤 3: 初始化项目

```bash
edgeone init
```

按提示选择:
- 项目类型: Node.js
- 入口文件: server.js

### 步骤 4: 部署

```bash
edgeone deploy
```

## ⚙️ 项目配置文件

EdgeOne Pages 使用 `edgeone.json` 配置文件。我已经为你创建了这个文件。

## 🔧 环境变量配置

在 EdgeOne Pages 控制台配置以下环境变量:

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `AI_GATEWAY_URL` | AI 网关地址 | `https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent` |
| `AI_GATEWAY_KEY` | API 密钥 | `your_api_key` |
| `OE_KEY` | OE 密钥 | `your_oe_key` |
| `OE_GATEWAY_NAME` | 网关名称 | `gemini` |
| `OE_AI_PROVIDER` | AI 提供商 | `gemini` |
| `PORT` | 端口号 | `3000` |

## 🌐 自定义域名 (可选)

### 步骤 1: 添加自定义域名

1. 在 EdgeOne Pages 控制台,进入项目设置
2. 点击 **"域名管理"** → **"添加自定义域名"**
3. 输入你的域名,例如: `carpay.yourdomain.com`

### 步骤 2: 配置 DNS

在你的域名服务商处添加 CNAME 记录:
```
类型: CNAME
主机记录: carpay
记录值: [EdgeOne 提供的 CNAME 值]
```

### 步骤 3: 配置 HTTPS 证书

EdgeOne Pages 会自动为你的域名申请免费 SSL 证书。

## 📊 部署后验证

部署完成后,访问你的网站:
```
https://your-project.pages.edgeone.app
```

测试功能:
1. ✅ 页面能正常打开
2. ✅ 上传 Excel 文件
3. ✅ 审计功能正常
4. ✅ 下载结果文件

## 🔍 查看日志

在 EdgeOne Pages 控制台:
1. 进入项目详情
2. 点击 **"日志分析"**
3. 查看实时日志和错误信息

## 🚨 常见问题

### 问题 1: 部署失败

**解决方案:**
- 检查 `package.json` 是否正确
- 确保所有依赖都在 `dependencies` 中
- 查看部署日志获取详细错误信息

### 问题 2: 环境变量未生效

**解决方案:**
- 在 EdgeOne Pages 控制台重新配置环境变量
- 重新部署项目

### 问题 3: 文件上传失败

**解决方案:**
- 检查文件大小限制 (EdgeOne Pages 默认支持大文件)
- 确保 `multer` 配置正确

### 问题 4: API 请求失败

**解决方案:**
- 检查 CORS 配置
- 确保 API 路径正确
- 查看浏览器控制台错误

## 📈 性能优化建议

### 1. 启用缓存
在 `edgeone.json` 中配置静态资源缓存

### 2. 使用 CDN
EdgeOne Pages 自动使用全球 CDN 加速

### 3. 压缩响应
启用 Gzip/Brotli 压缩

## 🔄 持续部署

### 自动部署
使用 Git 仓库部署时,每次推送代码都会自动触发部署:

```bash
git add .
git commit -m "更新功能"
git push
```

### 手动部署
在 EdgeOne Pages 控制台点击 **"重新部署"**

## 📞 获取帮助

- 📖 [EdgeOne Pages 文档](https://pages.edgeone.ai/zh/document/product-introduction)
- 💬 [Discord 社区](https://discord.gg/edgeone)
- 📧 邮件支持: edgeone_developer@tencent.com

## ✅ 部署检查清单

部署前请确认:

- [ ] 代码已推送到 Git 仓库 (如使用 Git 部署)
- [ ] `package.json` 配置正确
- [ ] 环境变量已配置
- [ ] `.env` 文件不要提交到 Git (已在 `.gitignore` 中)
- [ ] 测试本地运行正常
- [ ] 准备好 AI 网关密钥

## 🎉 部署成功!

恭喜!你的用车订单审计系统已成功部署到 EdgeOne Pages!

现在你可以:
- ✅ 通过 EdgeOne 域名访问应用
- ✅ 配置自定义域名
- ✅ 查看访问日志和分析
- ✅ 享受全球 CDN 加速

---

**下一步:**
1. 测试所有功能
2. 配置自定义域名
3. 设置监控和告警
4. 分享给团队使用

祝使用愉快! 🚀

