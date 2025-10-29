# 🚀 用车订单审计系统 - 从这里开始

欢迎使用用车订单审计系统！本文档将指导您快速开始使用。

## ⚡ 5分钟快速开始

### 第1步：安装依赖（1分钟）
```bash
npm install
```

### 第2步：启动服务器（1分钟）
```bash
npm start
```

你应该看到：
```
服务器运行在 http://localhost:3000
```

### 第3步：打开应用（1分钟）
在浏览器中打开：
```
http://localhost:3000
```

### 第4步：使用审计功能（2分钟）
1. 点击左侧菜单"用车订单审计"
2. 点击"选择文件"上传Excel文件
3. 点击"上传并审计"
4. 查看审计结果
5. 点击"下载审计结果"下载文件

**完成！** 🎉

## 📚 文档导航

### 🆕 新用户
👉 **[QUICKSTART.md](QUICKSTART.md)** - 5分钟快速指南

### 📖 想了解更多
👉 **[README.md](README.md)** - 完整功能文档

### 🏗️ 想了解架构
👉 **[ARCHITECTURE.md](ARCHITECTURE.md)** - 系统架构说明

### 🚀 想部署到生产
👉 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - 部署指南

### 📋 想查看所有文档
👉 **[INDEX.md](INDEX.md)** - 文档索引

## 🎯 核心功能

### ✅ 7条审计规则
1. **上班打车** - 上午9点前到公司
2. **会所地址** - KTV、足浴店等
3. **加班用词** - 补充说明含"加班"
4. **接送客户** - 补充说明含"接/送"+"客户"
5. **招待客户** - 补充说明含"招待/接待"+"客户"
6. **替他人打车** - 补充说明含"替/代/帮"+"打车/用车"
7. **高额费用** - 费用>200元或豪华/商务车型

### ✅ 主要功能
- 📤 Excel文件上传
- 🔍 自动审计检查
- 📊 实时统计展示
- 📥 结果下载
- 🤖 AI增强（可选）

## 📁 项目文件

### 核心文件
- `index.html` - 主页面
- `server.js` - 后端服务器
- `.env` - 环境配置
- `package.json` - 项目配置

### 文档文件
- `README.md` - 完整文档
- `QUICKSTART.md` - 快速指南
- `ARCHITECTURE.md` - 架构说明
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `INDEX.md` - 文档索引
- 以及其他参考文档

## 🔧 系统要求

- Node.js 14+
- npm 6+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 🆘 遇到问题？

### 问题1: npm install 失败
```bash
npm cache clean --force
npm install
```

### 问题2: 端口被占用
编辑 `.env` 文件，修改 PORT 值：
```
PORT=3001
```

### 问题3: Excel文件读取失败
- 确保文件格式为 .xlsx 或 .xls
- 确保文件包含"用车订单"sheet
- 尝试重新保存文件

### 更多问题
查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 的故障排除部分

## 📊 项目统计

- **代码文件**: 4个
- **文档文件**: 11个
- **审计规则**: 7条
- **API端点**: 2个
- **总代码行数**: ~1000行
- **总文档行数**: ~3500行

## ✨ 特色功能

🌟 **智能审计** - 7条规则自动检查
🌟 **实时统计** - 即时显示合规率
🌟 **标准输出** - 生成标准Excel文件
🌟 **AI增强** - 可选的Gemini AI审计
🌟 **用户友好** - 简洁易用的界面

## 🎓 学习路径

### 初级（5分钟）
1. 阅读本文档
2. 安装并启动
3. 上传文件进行审计

### 中级（30分钟）
1. 阅读 README.md
2. 了解7条审计规则
3. 查看API文档

### 高级（1小时）
1. 阅读 ARCHITECTURE.md
2. 查看 server.js 源代码
3. 了解系统架构

### 运维（1小时）
1. 阅读 DEPLOYMENT_GUIDE.md
2. 配置生产环境
3. 设置监控和日志

## 🚀 部署到生产

```bash
# 1. 安装依赖
npm install

# 2. 配置环境
编辑 .env 文件

# 3. 启动服务
npm start

# 或使用PM2
npm install -g pm2
pm2 start server.js --name "car-audit"
```

详见 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📞 获取帮助

### 查看文档
- [INDEX.md](INDEX.md) - 快速查找文档
- [README.md](README.md) - 完整功能文档
- [ARCHITECTURE.md](ARCHITECTURE.md) - 系统架构

### 查看代码
- `server.js` - 后端代码注释
- `index.html` - 前端代码注释

### 查看示例
- 各文档中的代码示例
- ARCHITECTURE.md 中的流程图

## 🎯 常见任务

### 上传并审计文件
1. 点击"用车订单审计"菜单
2. 点击"选择文件"
3. 选择Excel文件
4. 点击"上传并审计"
5. 等待审计完成

### 下载审计结果
1. 审计完成后
2. 点击"下载审计结果"
3. 文件将自动下载

### 修改审计规则
1. 编辑 `server.js`
2. 修改相应的规则函数
3. 重启服务器
4. 测试新规则

### 部署到生产
1. 查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. 按步骤进行部署
3. 配置监控和日志

## 📈 性能指标

- **文件上传**: 支持大文件
- **审计速度**: 1000条记录约1-2秒
- **并发处理**: 支持多用户
- **内存占用**: 合理

## 🔐 安全特性

✅ 文件类型验证
✅ 输入数据验证
✅ API错误处理
✅ 敏感信息保护
✅ CORS配置

## 📋 检查清单

部署前请确认：

- [ ] Node.js 14+ 已安装
- [ ] npm 已安装
- [ ] npm install 已执行
- [ ] .env 文件已配置
- [ ] 端口3000未被占用
- [ ] 网络连接正常

## 🎉 开始使用

现在您已经准备好了！

```bash
# 1. 安装依赖
npm install

# 2. 启动服务器
npm start

# 3. 打开浏览器
http://localhost:3000

# 4. 开始审计！
```

## 📞 需要帮助？

- 📖 查看 [INDEX.md](INDEX.md) 快速查找文档
- 🚀 查看 [QUICKSTART.md](QUICKSTART.md) 快速指南
- 📚 查看 [README.md](README.md) 完整文档
- 🏗️ 查看 [ARCHITECTURE.md](ARCHITECTURE.md) 架构说明
- 🚀 查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 部署指南

## 🌟 下一步

1. **立即开始**: 按照上面的5分钟快速开始
2. **深入学习**: 阅读相关文档
3. **自定义配置**: 根据需要修改规则
4. **部署上线**: 按照部署指南部署

---

**项目名称**: 用车订单审计系统
**版本**: 1.0.0
**状态**: ✅ 完成并可用
**最后更新**: 2025-10-29

**祝您使用愉快！** 🎉

---

## 快速链接

| 链接 | 说明 |
|------|------|
| [QUICKSTART.md](QUICKSTART.md) | 5分钟快速指南 |
| [README.md](README.md) | 完整功能文档 |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 系统架构说明 |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | 部署指南 |
| [INDEX.md](INDEX.md) | 文档索引 |
| [VERIFICATION.md](VERIFICATION.md) | 验证报告 |
| [COMPLETION_REPORT.md](COMPLETION_REPORT.md) | 完成报告 |

**现在就开始吧！** 🚀

