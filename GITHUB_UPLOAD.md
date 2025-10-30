# 📤 上传项目到 GitHub 指南

本指南将帮助你把 carpay 项目上传到 GitHub 仓库。

## 📋 准备工作

### 1. 安装 Git

#### 方法 1: 下载安装 (推荐)
1. 访问 Git 官网: https://git-scm.com/download/win
2. 下载 Windows 版本
3. 运行安装程序,一路点击"Next"
4. 安装完成后,重启 PowerShell

#### 方法 2: 使用 winget 安装
```powershell
winget install --id Git.Git -e --source winget
```

#### 验证安装
```powershell
git --version
```

### 2. 配置 Git

首次使用需要配置用户信息:

```powershell
# 配置用户名
git config --global user.name "你的名字"

# 配置邮箱
git config --global user.email "你的邮箱@example.com"
```

### 3. 创建 GitHub 仓库

1. 登录 GitHub: https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称: `carpay`
4. 描述: `用车订单审计系统`
5. 选择 "Public" 或 "Private"
6. **不要**勾选 "Initialize this repository with a README"
7. 点击 "Create repository"

## 🚀 上传项目到 GitHub

### 方法 1: 使用自动化脚本 (推荐)

我已经为你创建了自动化脚本 `upload-to-github.ps1`

```powershell
# 运行脚本
.\upload-to-github.ps1
```

脚本会自动:
- ✅ 检查 Git 是否安装
- ✅ 初始化 Git 仓库
- ✅ 添加所有文件
- ✅ 创建提交
- ✅ 连接到 GitHub 仓库
- ✅ 推送代码

### 方法 2: 手动操作

#### 步骤 1: 初始化 Git 仓库

```powershell
# 进入项目目录
cd "e:\公司文档\物产云商信息中心\A00 李建亮项目管理\carpay"

# 初始化 Git 仓库
git init
```

#### 步骤 2: 添加文件

```powershell
# 添加所有文件
git add .

# 查看状态
git status
```

#### 步骤 3: 创建提交

```powershell
# 创建第一次提交
git commit -m "初始提交: 用车订单审计系统"
```

#### 步骤 4: 连接到 GitHub 仓库

```powershell
# 添加远程仓库 (替换为你的 GitHub 用户名)
git remote add origin https://github.com/你的用户名/carpay.git

# 设置主分支名称
git branch -M main
```

#### 步骤 5: 推送到 GitHub

```powershell
# 推送代码
git push -u origin main
```

如果需要输入用户名和密码:
- **用户名**: 你的 GitHub 用户名
- **密码**: 使用 Personal Access Token (不是 GitHub 密码)

## 🔑 创建 GitHub Personal Access Token

GitHub 已不再支持密码推送,需要使用 Token:

### 步骤:
1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单最下方 → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. 设置:
   - Note: `carpay-upload`
   - Expiration: `90 days` 或自定义
   - 勾选: `repo` (完整权限)
7. 点击 "Generate token"
8. **复制 Token** (只显示一次!)

### 使用 Token:
```powershell
# 推送时输入:
# Username: 你的 GitHub 用户名
# Password: 粘贴刚才复制的 Token
git push -u origin main
```

## 📦 使用 GitHub Desktop (最简单)

如果不想使用命令行,可以使用 GitHub Desktop:

### 步骤:
1. 下载 GitHub Desktop: https://desktop.github.com/
2. 安装并登录 GitHub 账号
3. File → Add Local Repository
4. 选择项目文件夹: `e:\公司文档\物产云商信息中心\A00 李建亮项目管理\carpay`
5. 点击 "Create a repository"
6. 填写信息后点击 "Create repository"
7. 点击 "Publish repository" 上传到 GitHub

## ✅ 验证上传成功

上传完成后:

1. 访问你的 GitHub 仓库: `https://github.com/你的用户名/carpay`
2. 检查文件是否都已上传
3. 查看 README.md 是否正常显示

## 🔄 后续更新代码

上传成功后,以后更新代码只需:

```powershell
# 1. 添加修改的文件
git add .

# 2. 提交修改
git commit -m "描述你的修改"

# 3. 推送到 GitHub
git push
```

或使用脚本:
```powershell
.\update-github.ps1
```

## 📝 .gitignore 说明

我已经创建了 `.gitignore` 文件,以下文件不会上传到 GitHub:

- ❌ `node_modules/` - 依赖包 (太大)
- ❌ `.env` - 环境变量 (包含密钥)
- ❌ `*.log` - 日志文件
- ❌ 临时文件和系统文件

这些文件会上传:
- ✅ 源代码 (`index.html`, `server.js`)
- ✅ 配置文件 (`package.json`, `edgeone.json`)
- ✅ 文档文件 (所有 `.md` 文件)
- ✅ `.env.example` (环境变量示例)

## 🚨 常见问题

### 问题 1: Git 命令不存在

**解决方案:**
- 安装 Git (见上方"安装 Git"部分)
- 安装后重启 PowerShell

### 问题 2: 推送时要求输入密码

**解决方案:**
- 使用 Personal Access Token 代替密码
- 或使用 GitHub Desktop

### 问题 3: 推送被拒绝 (rejected)

**解决方案:**
```powershell
# 先拉取远程更改
git pull origin main --allow-unrelated-histories

# 再推送
git push -u origin main
```

### 问题 4: 文件太大无法上传

**解决方案:**
- 检查 `.gitignore` 是否正确配置
- 确保 `node_modules` 没有被添加
- 删除大文件后重新提交

### 问题 5: 中文路径问题

**解决方案:**
```powershell
# 配置 Git 支持中文路径
git config --global core.quotepath false
```

## 📞 需要帮助?

- 📖 Git 官方文档: https://git-scm.com/doc
- 📖 GitHub 文档: https://docs.github.com/
- 💬 GitHub 社区: https://github.community/

## 🎯 快速命令参考

```powershell
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 推送代码
git push

# 查看分支
git branch

# 切换分支
git checkout 分支名
```

## 🎉 完成!

恭喜!你的项目已成功上传到 GitHub!

**下一步:**
1. 在 GitHub 仓库页面添加描述和标签
2. 编辑 README.md 添加项目介绍
3. 邀请团队成员协作
4. 使用 GitHub Actions 自动部署到 EdgeOne Pages

---

**项目地址:** `https://github.com/你的用户名/carpay`

祝使用愉快! 🚀

