# EdgeOne Pages 部署脚本 (PowerShell)
# 用于快速部署到腾讯 EdgeOne Pages

Write-Host "🚀 EdgeOne Pages 部署助手" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "📋 检查环境..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装 Node.js,请先安装 Node.js" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js 版本: $(node -v)" -ForegroundColor Green

# 检查 npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装 npm" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm 版本: $(npm -v)" -ForegroundColor Green
Write-Host ""

# 选择部署方式
Write-Host "请选择部署方式:" -ForegroundColor Cyan
Write-Host "1. Git 仓库部署 (推荐)" -ForegroundColor White
Write-Host "2. 创建部署包 (直接上传)" -ForegroundColor White
Write-Host "3. 使用 EdgeOne CLI" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请输入选项 (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 准备 Git 部署..." -ForegroundColor Yellow
        
        # 检查 Git
        if (!(Get-Command git -ErrorAction SilentlyContinue)) {
            Write-Host "❌ 未安装 Git,请先安装 Git" -ForegroundColor Red
            exit 1
        }
        
        # 初始化 Git (如果需要)
        if (!(Test-Path .git)) {
            Write-Host "初始化 Git 仓库..." -ForegroundColor Yellow
            git init
        }
        
        # 添加文件
        Write-Host "添加文件到 Git..." -ForegroundColor Yellow
        git add .
        
        # 提交
        $commitMsg = Read-Host "请输入提交信息 (默认: 部署到 EdgeOne Pages)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "部署到 EdgeOne Pages"
        }
        git commit -m $commitMsg
        
        # 检查远程仓库
        $remotes = git remote
        if ($remotes -notcontains "origin") {
            Write-Host ""
            Write-Host "⚠️  未配置远程仓库" -ForegroundColor Yellow
            $repoUrl = Read-Host "请输入 Git 仓库地址 (例如: https://github.com/username/carpay.git)"
            git remote add origin $repoUrl
        }
        
        # 推送
        Write-Host "推送到远程仓库..." -ForegroundColor Yellow
        git push -u origin main
        
        Write-Host ""
        Write-Host "✅ 代码已推送到 Git 仓库!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 下一步:" -ForegroundColor Cyan
        Write-Host "1. 访问 https://pages.edgeone.ai/" -ForegroundColor White
        Write-Host "2. 点击 '导入 Git 仓库'" -ForegroundColor White
        Write-Host "3. 选择你的仓库并配置环境变量" -ForegroundColor White
        Write-Host "4. 点击 '部署'" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "📦 创建部署包..." -ForegroundColor Yellow
        
        # 安装依赖
        Write-Host "安装依赖..." -ForegroundColor Yellow
        npm install
        
        # 创建部署包
        $deployFiles = @(
            "index.html",
            "server.js",
            "package.json",
            "package-lock.json",
            "edgeone.json",
            ".env.example"
        )
        
        $zipFile = "carpay-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
        
        Write-Host "创建压缩包: $zipFile" -ForegroundColor Yellow
        Compress-Archive -Path $deployFiles -DestinationPath $zipFile -Force
        
        Write-Host ""
        Write-Host "✅ 部署包已创建: $zipFile" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 下一步:" -ForegroundColor Cyan
        Write-Host "1. 访问 https://pages.edgeone.ai/" -ForegroundColor White
        Write-Host "2. 点击 '直接上传'" -ForegroundColor White
        Write-Host "3. 上传 $zipFile" -ForegroundColor White
        Write-Host "4. 配置环境变量并部署" -ForegroundColor White
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 使用 EdgeOne CLI 部署..." -ForegroundColor Yellow
        
        # 检查 EdgeOne CLI
        if (!(Get-Command edgeone -ErrorAction SilentlyContinue)) {
            Write-Host "⚠️  未安装 EdgeOne CLI" -ForegroundColor Yellow
            $install = Read-Host "是否安装 EdgeOne CLI? (y/n)"
            if ($install -eq "y") {
                npm install -g @edgeone/cli
            } else {
                Write-Host "❌ 取消部署" -ForegroundColor Red
                exit 1
            }
        }
        
        # 登录
        Write-Host "登录 EdgeOne..." -ForegroundColor Yellow
        edgeone login
        
        # 部署
        Write-Host "开始部署..." -ForegroundColor Yellow
        edgeone deploy
        
        Write-Host ""
        Write-Host "✅ 部署完成!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ 无效的选项" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 完成!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 查看完整部署指南: EDGEONE_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

