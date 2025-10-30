# 📊 Excel 导出功能说明

## ✅ 已实现功能

### 1. 双 Sheet 导出

导出的 Excel 文件包含两个 sheet:

#### Sheet 1: 审计结果明细
- 包含所有审计数据
- 列:下单人姓名、开始计费时间、实际出发地、实际目的地、企业实付金额、补充说明、用车类型、审计结果
- 自动调整列宽

#### Sheet 2: 部门汇总
- 按账期和部门汇总金额
- 列:账期、部门名称、企业实付金额汇总
- 自动排序(先按账期,再按部门)

---

## 📁 数据结构

### 审计结果明细

| 下单人姓名 | 开始计费时间 | 实际出发地 | 实际目的地 | 企业实付金额 | 补充说明 | 用车类型 | 审计结果 |
|-----------|-------------|-----------|-----------|-------------|---------|---------|---------|
| 张三 | 2024-01-15 08:30 | 家 | 公司 | 25.5 | 上班打车 | 快车 | 疑似上班打车 |
| 李四 | 2024-01-15 18:00 | 公司 | KTV | 45.0 | 加班后放松 | 专车 | 禁止娱乐场所用车 |

### 部门汇总

| 账期 | 部门名称 | 企业实付金额汇总 |
|------|---------|----------------|
| 2024-01 | 销售部 | 1,250.50 |
| 2024-01 | 技术部 | 850.00 |
| 2024-02 | 销售部 | 1,450.00 |

---

## 🔧 部门提取逻辑

当前使用简化的部门提取逻辑(从补充说明中提取关键词):

```typescript
const extractDepartment = (row: any): string => {
  const note = row['补充说明'] || ''

  if (note.includes('销售')) return '销售部'
  if (note.includes('技术') || note.includes('研发')) return '技术部'
  if (note.includes('市场')) return '市场部'
  if (note.includes('行政') || note.includes('人事')) return '行政部'
  if (note.includes('财务')) return '财务部'

  return '业务部'  // 默认部门
}
```

### 自定义部门提取

如果你的 Excel 数据中有专门的"部门"列,可以修改 `extractDepartment` 函数:

```typescript
const extractDepartment = (row: any): string => {
  // 方案 1: 直接从部门列获取
  return row['部门名称'] || '未分配部门'
  
  // 方案 2: 从员工编号映射
  const employeeId = row['员工编号']
  return departmentMap[employeeId] || '未分配部门'
  
  // 方案 3: 从其他字段提取
  // ...
}
```

---

## 🎨 Excel 样式支持

### 当前状态

基础的 `xlsx` 库**不支持样式**(颜色、字体、边框等)。

当前实现:
- ✅ 列宽自动调整
- ✅ 数据正确导出
- ❌ 无样式(颜色、字体、边框)

### 添加样式支持

如果需要添加样式,有以下几种方案:

---

#### 方案 1: 使用 xlsx-js-style (推荐)

**步骤:**

1. **安装依赖**
```bash
npm install xlsx-js-style
```

2. **修改 package.json**
```json
{
  "dependencies": {
    "xlsx-js-style": "^1.2.0"
  }
}
```

3. **更新代码**

在 `app/page.tsx` 中:

```typescript
// 替换导入
import * as XLSX from 'xlsx-js-style'

// 在 handleDownload 函数中添加样式
const handleDownload = () => {
  // ... 现有代码 ...
  
  // 应用样式到审计结果 sheet
  applyDetailSheetStyles(detailSheet, auditedData.length)
  
  // 应用样式到汇总 sheet
  applySummarySheetStyles(summarySheet, summaryData.length)
}

// 样式函数
const applyDetailSheetStyles = (sheet: any, rowCount: number) => {
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')
  
  // 表头样式
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: C })
    
    if (!sheet[headerCell]) continue

    sheet[headerCell].s = {
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
  }

  // 数据行样式
  for (let R = 1; R <= rowCount; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
      
      if (!sheet[cellAddress]) continue

      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C })
      const headerValue = sheet[headerCell]?.v || ''

      let cellStyle: any = {
        font: { name: '微软雅黑', sz: 10 },
        alignment: { vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }

      // 金额列:右对齐,货币格式
      if (headerValue.includes('金额')) {
        cellStyle.alignment.horizontal = 'right'
        cellStyle.numFmt = '¥#,##0.00'
      }
      // 时间列:日期时间格式
      else if (headerValue.includes('时间')) {
        cellStyle.numFmt = 'yyyy-mm-dd hh:mm'
      }
      // 审计结果列:颜色标识
      else if (headerValue.includes('审计结果')) {
        const cellValue = sheet[cellAddress].v || ''
        
        if (!cellValue || cellValue === '合规') {
          cellStyle.font.color = { rgb: '00B050' }  // 绿色
        } else if (cellValue.includes('疑似')) {
          cellStyle.font.color = { rgb: 'FFC000' }  // 橙色
        } else {
          cellStyle.font.color = { rgb: 'FF0000' }  // 红色
        }
      }

      sheet[cellAddress].s = cellStyle
    }
  }
}
```

---

#### 方案 2: 使用 ExcelJS (功能最强大)

**步骤:**

1. **安装依赖**
```bash
npm install exceljs
```

2. **完全重写导出逻辑**

```typescript
import ExcelJS from 'exceljs'

const handleDownload = async () => {
  const workbook = new ExcelJS.Workbook()
  
  // Sheet 1: 审计结果明细
  const detailSheet = workbook.addWorksheet('审计结果明细')
  
  // 添加表头
  detailSheet.columns = [
    { header: '下单人姓名', key: 'name', width: 12 },
    { header: '开始计费时间', key: 'time', width: 18 },
    { header: '实际出发地', key: 'from', width: 25 },
    { header: '实际目的地', key: 'to', width: 25 },
    { header: '企业实付金额', key: 'amount', width: 15 },
    { header: '补充说明', key: 'note', width: 30 },
    { header: '用车类型', key: 'type', width: 15 },
    { header: '审计结果', key: 'result', width: 35 }
  ]
  
  // 表头样式
  detailSheet.getRow(1).font = { name: '微软雅黑', size: 10, bold: true }
  detailSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDDEBF7' }
  }
  detailSheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' }
  
  // 添加数据
  auditedData.forEach(row => {
    const newRow = detailSheet.addRow({
      name: row['下单人姓名'],
      time: row['开始计费时间'],
      from: row['实际出发地'],
      to: row['实际目的地'],
      amount: row['企业实付金额'],
      note: row['补充说明'],
      type: row['用车类型(明细)'],
      result: row['审计结果']
    })
    
    // 金额格式
    newRow.getCell('amount').numFmt = '¥#,##0.00'
    newRow.getCell('amount').alignment = { horizontal: 'right' }
    
    // 审计结果颜色
    const resultCell = newRow.getCell('result')
    if (!resultCell.value || resultCell.value === '合规') {
      resultCell.font = { color: { argb: 'FF00B050' } }
    } else if (String(resultCell.value).includes('疑似')) {
      resultCell.font = { color: { argb: 'FFFFC000' } }
    } else {
      resultCell.font = { color: { argb: 'FFFF0000' } }
    }
  })
  
  // 添加边框
  detailSheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
  })
  
  // Sheet 2: 部门汇总
  // ... 类似的代码 ...
  
  // 下载
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `用车订单审计结果_${new Date().toLocaleDateString()}.xlsx`
  a.click()
}
```

---

#### 方案 3: 后端生成 Excel

如果样式要求复杂,建议在后端生成:

1. 前端发送数据到后端 API
2. 后端使用 Python (openpyxl) 或 Node.js (exceljs) 生成带样式的 Excel
3. 返回文件给前端下载

---

## 📊 样式规范

### 表头行
- 字体:微软雅黑 10号 加粗
- 背景色:淡蓝 (#DDEBF7)
- 对齐:居中
- 边框:细边框

### 金额列
- 对齐:右对齐
- 格式:¥#,##0.00
- 示例:¥1,250.50

### 时间列
- 格式:yyyy-mm-dd hh:mm
- 示例:2024-01-15 08:30

### 审计结果列
- ✅ 合规:绿色 (#00B050)
- ⚠️ 异常:橙色 (#FFC000)
- ❌ 违规:红色 (#FF0000)

### 边框
- 所有单元格:细边框 (thin)

---

## 🚀 快速测试

### 当前功能测试:

1. 执行规则审计
2. 点击"下载审计结果"
3. 打开下载的 Excel 文件
4. 检查两个 sheet:
   - "审计结果明细" - 包含所有数据
   - "部门汇总" - 按账期和部门汇总

### 预期结果:

- ✅ 两个 sheet 都存在
- ✅ 列宽自动调整
- ✅ 部门汇总数据正确
- ✅ 金额汇总计算正确
- ❌ 暂无样式(需要安装 xlsx-js-style 或 exceljs)

---

## 💡 建议

### 如果只需要基础导出:
- 当前实现已足够
- 数据完整,列宽合适
- 用户可以在 Excel 中手动调整样式

### 如果需要专业样式:
- 推荐使用 **ExcelJS** (功能最强大,文档完善)
- 或使用 **xlsx-js-style** (简单,兼容 xlsx)

### 如果样式要求非常复杂:
- 建议在后端生成 Excel
- 使用 Python openpyxl 或 Node.js exceljs

---

## 📝 下一步

1. **测试当前功能**
   ```bash
   npm run dev
   # 上传文件 → 规则审计 → 下载结果
   ```

2. **如需添加样式**
   - 选择方案(xlsx-js-style 或 ExcelJS)
   - 安装依赖
   - 更新代码

3. **自定义部门提取**
   - 修改 `extractDepartment` 函数
   - 根据实际数据结构调整

---

**Excel 导出功能已实现! 📊**

如需添加样式支持,请参考上述方案。

