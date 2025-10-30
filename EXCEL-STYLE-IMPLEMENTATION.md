# 📊 Excel 样式实现总结

## ✅ 已完成的工作

### 1. 安装 xlsx-js-style 库

```bash
npm install xlsx-js-style
```

**为什么需要 xlsx-js-style?**
- 基础的 `xlsx` 库不支持样式(颜色、字体、边框等)
- `xlsx-js-style` 是 `xlsx` 的增强版,支持完整的样式功能

---

### 2. 实现的样式功能

#### ✅ 表头行样式
- **字体**: 微软雅黑 10号 加粗
- **背景色**: 淡蓝 (#DDEBF7)
- **对齐**: 居中
- **边框**: 细边框

#### ✅ 金额列样式
- **对齐**: 右对齐
- **格式**: ¥#,##0.00 (货币格式)
- **示例**: ¥1,250.50

#### ✅ 时间列样式
- **格式**: yyyy-mm-dd hh:mm
- **示例**: 2024-01-15 08:30

#### ✅ 审计结果列样式
- **合规**: 绿色 (#00B050)
- **疑似**: 橙色 (#FFC000)
- **违规**: 红色 (#FF0000)

#### ✅ 边框
- **所有单元格**: 细边框 (thin)

#### ✅ 字体
- **所有单元格**: 微软雅黑 10号

---

## 📁 修改的文件

### 1. package.json

**新增依赖:**
```json
{
  "dependencies": {
    "xlsx-js-style": "^1.2.0"
  }
}
```

---

### 2. app/page.tsx

**导入 xlsx-js-style:**
```typescript
import * as XLSXStyle from 'xlsx-js-style'
```

**修改下载函数:**
```typescript
const handleDownload = () => {
  const workbook = XLSXStyle.utils.book_new()
  
  // Sheet 1: 审计结果明细
  const detailSheet = XLSXStyle.utils.json_to_sheet(auditedData)
  applyDetailSheetStyles(detailSheet, auditedData.length)
  XLSXStyle.utils.book_append_sheet(workbook, detailSheet, '审计结果明细')
  
  // Sheet 2: 部门汇总
  const summaryData = generateDepartmentSummary(auditedData)
  const summarySheet = XLSXStyle.utils.json_to_sheet(summaryData)
  applySummarySheetStyles(summarySheet, summaryData.length)
  XLSXStyle.utils.book_append_sheet(workbook, summarySheet, '部门汇总')
  
  // 下载
  XLSXStyle.writeFile(workbook, fileName)
}
```

**新增样式函数:**
- `applyDetailSheetStyles()` - 审计结果明细样式
- `applySummarySheetStyles()` - 部门汇总样式

---

## 🎨 样式详细说明

### Sheet 1: 审计结果明细

#### 表头行 (第1行)
```typescript
{
  font: { name: '微软雅黑', sz: 10, bold: true },
  fill: { fgColor: { rgb: 'DDEBF7' } },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  }
}
```

#### 金额列 (企业实付金额)
```typescript
{
  font: { name: '微软雅黑', sz: 10 },
  alignment: { horizontal: 'right', vertical: 'center' },
  numFmt: '¥#,##0.00',
  border: { ... }
}
```

#### 时间列 (开始计费时间)
```typescript
{
  font: { name: '微软雅黑', sz: 10 },
  alignment: { vertical: 'center' },
  numFmt: 'yyyy-mm-dd hh:mm',
  border: { ... }
}
```

#### 审计结果列
```typescript
// 合规 (空或"合规")
{
  font: { name: '微软雅黑', sz: 10, color: { rgb: '00B050' } },
  alignment: { vertical: 'center' },
  border: { ... }
}

// 疑似 (包含"疑似")
{
  font: { name: '微软雅黑', sz: 10, color: { rgb: 'FFC000' } },
  alignment: { vertical: 'center' },
  border: { ... }
}

// 违规 (其他)
{
  font: { name: '微软雅黑', sz: 10, color: { rgb: 'FF0000' } },
  alignment: { vertical: 'center' },
  border: { ... }
}
```

---

### Sheet 2: 部门汇总

#### 表头行
- 与审计结果明细相同

#### 金额汇总列 (企业实付金额汇总)
```typescript
{
  font: { name: '微软雅黑', sz: 10 },
  alignment: { horizontal: 'right', vertical: 'center' },
  numFmt: '¥#,##0.00',
  border: { ... }
}
```

#### 其他列
```typescript
{
  font: { name: '微软雅黑', sz: 10 },
  alignment: { vertical: 'center' },
  border: { ... }
}
```

---

## 🔧 样式应用逻辑

### 1. 表头样式应用

```typescript
// 遍历第一行的所有列
for (let C = range.s.c; C <= range.e.c; ++C) {
  const headerCell = XLSXStyle.utils.encode_cell({ r: 0, c: C })
  
  sheet[headerCell].s = {
    font: { name: '微软雅黑', sz: 10, bold: true },
    fill: { fgColor: { rgb: 'DDEBF7' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: { ... }
  }
}
```

### 2. 数据行样式应用

```typescript
// 遍历所有数据行和列
for (let R = 1; R <= rowCount; ++R) {
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSXStyle.utils.encode_cell({ r: R, c: C })
    const headerValue = sheet[headerCell]?.v || ''
    
    // 根据列名应用不同样式
    if (headerValue.includes('金额')) {
      // 金额列样式
    } else if (headerValue.includes('时间')) {
      // 时间列样式
    } else if (headerValue.includes('审计结果')) {
      // 审计结果列样式(根据值设置颜色)
    }
    
    sheet[cellAddress].s = cellStyle
  }
}
```

### 3. 审计结果颜色判断

```typescript
const cellValue = sheet[cellAddress].v || ''

if (!cellValue || cellValue === '合规') {
  cellStyle.font.color = { rgb: '00B050' }  // 绿色
} else if (cellValue.includes('疑似')) {
  cellStyle.font.color = { rgb: 'FFC000' }  // 橙色
} else {
  cellStyle.font.color = { rgb: 'FF0000' }  // 红色
}
```

---

## 📊 样式效果预览

### 审计结果明细 Sheet

```
┌──────────────────────────────────────────────────────────────────┐
│ 表头行 (淡蓝背景 #DDEBF7, 加粗, 居中)                              │
├──────────────────────────────────────────────────────────────────┤
│ 下单人姓名 │ 开始计费时间        │ 企业实付金额 │ 审计结果          │
│            │ (yyyy-mm-dd hh:mm) │ (¥#,##0.00) │ (颜色标识)        │
├──────────────────────────────────────────────────────────────────┤
│ 张三       │ 2024-01-15 08:30   │    ¥25.50   │ 疑似上班打车 (橙) │
│ 李四       │ 2024-01-15 18:00   │    ¥45.00   │ 禁止娱乐场所 (红) │
│ 王五       │ 2024-01-16 14:00   │    ¥35.00   │ 合规 (绿)         │
└──────────────────────────────────────────────────────────────────┘
```

### 部门汇总 Sheet

```
┌────────────────────────────────────────────────┐
│ 表头行 (淡蓝背景 #DDEBF7, 加粗, 居中)           │
├────────────────────────────────────────────────┤
│ 账期    │ 部门名称 │ 企业实付金额汇总          │
│         │          │ (¥#,##0.00, 右对齐)       │
├────────────────────────────────────────────────┤
│ 2024-01 │ 销售部   │              ¥1,250.50   │
│ 2024-01 │ 技术部   │                ¥850.00   │
│ 2024-02 │ 销售部   │              ¥1,450.00   │
└────────────────────────────────────────────────┘
```

---

## 🚀 测试步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 执行审计并下载

1. 上传 Excel 文件
2. 点击"规则审计"
3. 点击"下载审计结果"
4. 打开下载的 Excel 文件

### 3. 验证样式

#### 审计结果明细 Sheet:
- ✅ 表头行: 淡蓝背景、加粗、居中
- ✅ 金额列: 右对齐、货币格式 (¥1,250.50)
- ✅ 时间列: 日期时间格式 (2024-01-15 08:30)
- ✅ 审计结果列: 颜色标识
  - 合规: 绿色
  - 疑似: 橙色
  - 违规: 红色
- ✅ 所有单元格: 细边框
- ✅ 字体: 微软雅黑 10号

#### 部门汇总 Sheet:
- ✅ 表头行: 淡蓝背景、加粗、居中
- ✅ 金额汇总列: 右对齐、货币格式
- ✅ 所有单元格: 细边框
- ✅ 字体: 微软雅黑 10号

---

## 💡 技术要点

### 1. 单元格地址编码

```typescript
// 行列索引 → 单元格地址
const cellAddress = XLSXStyle.utils.encode_cell({ r: 1, c: 0 })
// 结果: "A2" (第2行第1列)
```

### 2. 范围解析

```typescript
// 解析 sheet 的范围
const range = XLSXStyle.utils.decode_range(sheet['!ref'])
// range.s.c: 起始列
// range.e.c: 结束列
// range.s.r: 起始行
// range.e.r: 结束行
```

### 3. 样式对象结构

```typescript
{
  font: {
    name: '微软雅黑',  // 字体名称
    sz: 10,            // 字号
    bold: true,        // 加粗
    color: { rgb: 'FF0000' }  // 颜色
  },
  fill: {
    fgColor: { rgb: 'DDEBF7' }  // 背景色
  },
  alignment: {
    horizontal: 'center',  // 水平对齐
    vertical: 'center'     // 垂直对齐
  },
  border: {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  },
  numFmt: '¥#,##0.00'  // 数字格式
}
```

---

## 🎯 样式规范总结

| 元素 | 样式 |
|------|------|
| **表头行** | 微软雅黑 10号 加粗, 淡蓝背景 (#DDEBF7), 居中, 细边框 |
| **金额列** | 右对齐, 货币格式 (¥#,##0.00) |
| **时间列** | 日期时间格式 (yyyy-mm-dd hh:mm) |
| **审计结果列** | 绿色(合规) / 橙色(疑似) / 红色(违规) |
| **边框** | 所有单元格细边框 |
| **字体** | 微软雅黑 10号 |

---

## 📝 注意事项

### 1. xlsx vs xlsx-js-style

- **xlsx**: 不支持样式,只能导出纯数据
- **xlsx-js-style**: 支持完整样式,但文件稍大

### 2. 性能考虑

- 样式应用会增加处理时间
- 对于大量数据(>1000行),可能需要几秒钟

### 3. 兼容性

- 生成的 Excel 文件兼容 Excel 2007+ (.xlsx)
- 支持 WPS、LibreOffice 等办公软件

---

**Excel 样式功能已完整实现! 🎉**

现在导出的 Excel 文件包含完整的样式:
- ✅ 表头淡蓝背景
- ✅ 金额货币格式
- ✅ 时间日期格式
- ✅ 审计结果颜色标识
- ✅ 全部细边框
- ✅ 微软雅黑字体

开始测试吧! 🚀

