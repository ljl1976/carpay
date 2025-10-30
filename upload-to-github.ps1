# GitHub 上传脚本
# 用于将 carpay 项目上传到 GitHub

Write-Host "🚀 GitHub 上传助手" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
Write-Host "📋 检查 Git 安装..." -ForegroundColor Yellow
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装 Git" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Git:" -ForegroundColor Yellow
    Write-Host "1. 访问: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. 下载并安装 Git for Windows" -ForegroundColor White
    Write-Host "3. 安装完成后重启 PowerShell" -ForegroundColor White
    Write-Host ""
    Write-Host "或使用 winget 安装:" -ForegroundColor Yellow
    Write-Host "winget install --id Git.Git -e --source winget" -ForegroundColor White
    Write-Host ""
    
    $install = Read-Host "是否现在使用 winget 安装 Git? (y/n)"
    if ($install -eq "y") {
        Write-Host "正在安装 Git..." -ForegroundColor Yellow
        winget install --id Git.Git -e --source winget
        Write-Host ""
        Write-Host "✅ Git 安装完成!" -ForegroundColor Green
        Write-Host "⚠️  请重启 PowerShell 后再次运行此脚本" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host "✅ Git 已安装: $(git --version)" -ForegroundColor Green
Write-Host ""

# 检查 Git 配置
Write-Host "📋 检查 Git 配置..." -ForegroundColor Yellow
$userName = git config --global user.name
$userEmail = git config --global user.email

if ([string]::IsNullOrWhiteSpace($userName)) {
    Write-Host "⚠️  未配置 Git 用户名" -ForegroundColor Yellow
    $userName = Read-Host "请输入你的名字"
    git config --global user.name $userName
    Write-Host "✅ 已设置用户名: $userName" -ForegroundColor Green
} else {
    Write-Host "✅ Git 用户名: $userName" -ForegroundColor Green
}

if ([string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "⚠️  未配置 Git 邮箱" -ForegroundColor Yellow
    $userEmail = Read-Host "请输入你的邮箱"
    git config --global user.email $userEmail
    Write-Host "✅ 已设置邮箱: $userEmail" -ForegroundColor Green
} else {
    Write-Host "✅ Git 邮箱: $userEmail" -ForegroundColor Green
}

Write-Host ""

# 配置中文路径支持
git config --global core.quotepath false

# 检查是否已经是 Git 仓库
if (Test-Path .git) {
    Write-Host "✅ 已经是 Git 仓库" -ForegroundColor Green
} else {
    Write-Host "📦 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git 仓库初始化完成" -ForegroundColor Green
}

Write-Host ""

# 检查远程仓库
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "✅ 已配置远程仓库" -ForegroundColor Green
    $remoteUrl = git remote get-url origin
    Write-Host "   远程仓库: $remoteUrl" -ForegroundColor White
    Write-Host ""
    
    $changeRemote = Read-Host "是否更改远程仓库地址? (y/n)"
    if ($changeRemote -eq "y") {
        $repoUrl = Read-Host "请输入新的 GitHub 仓库地址 (例如: https://github.com/username/carpay.git)"
        git remote set-url origin $repoUrl
        Write-Host "✅ 远程仓库地址已更新" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  未配置远程仓库" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请先在 GitHub 创建仓库:" -ForegroundColor Cyan
    Write-Host "1. 访问: https://github.com/new" -ForegroundColor White
    Write-Host "2. 仓库名称: carpay" -ForegroundColor White
    Write-Host "3. 点击 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "请输入 GitHub 仓库地址 (例如: https://github.com/username/carpay.git)"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ 未输入仓库地址,退出" -ForegroundColor Red
        exit 1
    }
    
    git remote add origin $repoUrl
    Write-Host "✅ 远程仓库已配置" -ForegroundColor Green
}

Write-Host ""

# 检查 .gitignore
if (!(Test-Path .gitignore)) {
    Write-Host "⚠️  未找到 .gitignore 文件" -ForegroundColor Yellow
    Write-Host "建议先创建 .gitignore 文件以排除不必要的文件" -ForegroundColor Yellow
    Write-Host ""
}

# 添加文件
Write-Host "📦 添加文件到 Git..." -ForegroundColor Yellow
git add .

# 显示状态
Write-Host ""
Write-Host "📊 文件状态:" -ForegroundColor Cyan
git status --short

Write-Host ""
$continue = Read-Host "是否继续提交? (y/n)"
if ($continue -ne "y") {
    Write-Host "❌ 已取消" -ForegroundColor Red
    exit 0
}

# 创建提交
Write-Host ""
$commitMsg = Read-Host "请输入提交信息 (默认: 初始提交: 用车订单审计系统)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "初始提交: 用车订单审计系统"
}

Write-Host "📝 创建提交..." -ForegroundColor Yellow
git commit -m $commitMsg

# 设置主分支
Write-Host "🌿 设置主分支为 main..." -ForegroundColor Yellow
git branch -M main

# 推送到 GitHub
Write-Host ""
Write-Host "🚀 推送到 GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  注意:" -ForegroundColor Yellow
Write-Host "- 如果要求输入用户名,请输入你的 GitHub 用户名" -ForegroundColor White
Write-Host "- 如果要求输入密码,请使用 Personal Access Token (不是 GitHub 密码)" -ForegroundColor White
Write-Host ""
Write-Host "如何获取 Token:" -ForegroundColor Cyan
Write-Host "1. 访问: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Generate new token → Generate new token (classic)" -ForegroundColor White
Write-Host "3. 勾选 'repo' 权限" -ForegroundColor White
Write-Host "4. 生成并复制 Token" -ForegroundColor White
Write-Host ""

$push = Read-Host "准备好了吗? 按 Enter 继续推送..."

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 成功上传到 GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 下一步:" -ForegroundColor Cyan
    Write-Host "1. 访问你的 GitHub 仓库查看代码" -ForegroundColor White
    Write-Host "2. 在 EdgeOne Pages 导入此仓库进行部署" -ForegroundColor White
    Write-Host "3. 配置环境变量并部署" -ForegroundColor White
    Write-Host ""
    
    $remoteUrl = git remote get-url origin
    $webUrl = $remoteUrl -replace '\.git$', '' -replace 'git@github\.com:', 'https://github.com/'
    Write-Host "🌐 仓库地址: $webUrl" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ 推送失败" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "1. 用户名或 Token 错误" -ForegroundColor White
    Write-Host "2. 仓库地址错误" -ForegroundColor White
    Write-Host "3. 网络连接问题" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方案:" -ForegroundColor Cyan
    Write-Host "1. 检查 GitHub 用户名和 Token" -ForegroundColor White
    Write-Host "2. 确认仓库地址正确" -ForegroundColor White
    Write-Host "3. 查看详细错误信息" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 查看帮助文档: GITHUB_UPLOAD.md" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "完成!" -ForegroundColor Green

