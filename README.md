# 🚗 用车订单审计系统

一个基于Web的用车订单审计系统，支持Excel文件上传、自动审计和结果下载。

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![EdgeOne Pages](https://img.shields.io/badge/Deploy-EdgeOne%20Pages-00ADD8.svg)](https://pages.edgeone.ai/)

## 🌟 在线演示

- **GitHub 仓库**: [https://github.com/你的用户名/carpay](https://github.com/你的用户名/carpay)
- **在线部署**: 部署到 EdgeOne Pages 后更新此链接

## 功能特性

- 📤 **Excel文件上传**: 支持上传网约车账单Excel文件
- 🔍 **自动审计**: 按照7条规则自动检查用车订单
- 📊 **实时统计**: 显示合规率、不合规数量等统计信息
- 📥 **结果下载**: 生成包含审计结果的Excel文件下载
- 🤖 **AI增强**: 可选的AI审计功能（使用Gemini API）

## 审计规则

### 规则1: 上班打车检查
- 如果开始计费时间为上午9点以前打车，且目的地为公司(包含'物产天地中心')
- 审计结果: `用车理由不合规，疑似上班打车`

### 规则2: 会所地址检查
- 如果实际出发地或实际目的地出现KTV、足浴店等会所
- 审计结果: `用车地址不得出现KTV、足浴店等会所`

### 规则3: 加班用词检查
- 补充说明出现"加班"
- 审计结果: `用车理由不得出现"加班"，可写21点以后离开公司`

### 规则4: 接送客户检查
- 补充说明出现"接"或"送"且包含"客户"
- 审计结果: `用车理由不得出现"接""送"客户`

### 规则5: 招待客户检查
- 补充说明出现"招待"或"接待"且包含"客户"
- 审计结果: `用车理由不得出现"招待""接待"xx客户`

### 规则6: 替他人打车检查
- 补充说明出现"替"、"代"、"帮"且包含"打车"或"用车"
- 审计结果: `用车只能本人用车，不允许替他人打车`

### 规则7: 高额费用检查
- 单次用车费用超过200元，或车型为"豪华"、"商务"等
- 审计结果: `单次用车费用远超同城平均水平`

## 安装和运行

### 前置要求
- Node.js 14+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 配置环境变量
编辑 `.env` 文件，配置AI网关信息：
```
AI_GATEWAY_URL=https://ai-gateway-intl.eo-edgefunctions7.com/v1/models/gemini-pro:generateContent
AI_GATEWAY_KEY=your_api_key
OE_KEY=your_oe_key
OE_GATEWAY_NAME=gemini
OE_AI_PROVIDER=gemini
PORT=3000
```

### 启动服务器
```bash
npm start
```

或开发模式（需要安装nodemon）：
```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 使用方法

1. 打开浏览器访问 `http://localhost:3000`
2. 在左侧菜单中点击"用车订单审计"
3. 点击"选择文件"上传网约车账单Excel文件
4. 点击"上传并审计"按钮
5. 系统将自动审计并显示结果
6. 点击"下载审计结果"下载包含审计结果的Excel文件

## API接口

### POST /api/audit
上传Excel文件并执行审计

**请求**:
- Content-Type: multipart/form-data
- 参数: file (Excel文件)

**响应**:
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "total": 982,
    "compliant": 799,
    "nonCompliant": 183
  }
}
```

### POST /api/download-audit
下载审计结果Excel文件

**请求**:
- Content-Type: application/json
- Body: { "data": [...] }

**响应**: Excel文件二进制数据

## 文件结构

```
.
├── index.html          # 主页面
├── server.js           # Express服务器
├── package.json        # 项目配置
├── .env               # 环境变量配置
└── README.md          # 本文件
```

## 技术栈

- **前端**: HTML5, Tailwind CSS, JavaScript
- **后端**: Node.js, Express
- **数据处理**: XLSX库
- **AI集成**: Axios + Gemini API

## 注意事项

1. Excel文件必须包含"用车订单"sheet
2. 合规的订单在审计结果列中为空
3. 不合规的订单会显示具体的违规原因
4. 支持多个违规原因，用分号分隔

## 许可证

ISC

