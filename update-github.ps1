# GitHub 更新脚本
# 用于快速更新代码到 GitHub

Write-Host "🔄 GitHub 更新助手" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未安装 Git" -ForegroundColor Red
    Write-Host "请先运行: .\upload-to-github.ps1" -ForegroundColor Yellow
    exit 1
}

# 检查是否是 Git 仓库
if (!(Test-Path .git)) {
    Write-Host "❌ 当前目录不是 Git 仓库" -ForegroundColor Red
    Write-Host "请先运行: .\upload-to-github.ps1" -ForegroundColor Yellow
    exit 1
}

# 显示当前状态
Write-Host "📊 当前状态:" -ForegroundColor Yellow
git status --short

Write-Host ""

# 检查是否有修改
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ 没有需要提交的修改" -ForegroundColor Green
    exit 0
}

# 添加文件
Write-Host "📦 添加修改的文件..." -ForegroundColor Yellow
git add .

# 输入提交信息
Write-Host ""
$commitMsg = Read-Host "请输入提交信息 (描述你的修改)"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "❌ 提交信息不能为空" -ForegroundColor Red
    exit 1
}

# 提交
Write-Host "📝 创建提交..." -ForegroundColor Yellow
git commit -m $commitMsg

# 推送
Write-Host "🚀 推送到 GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 成功更新到 GitHub!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ 推送失败" -ForegroundColor Red
    Write-Host "请检查网络连接和权限" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "完成!" -ForegroundColor Green

