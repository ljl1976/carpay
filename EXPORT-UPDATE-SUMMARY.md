# 📊 Excel 导出功能更新总结

## ✅ 已完成的工作

### 1. 新增部门汇总 Sheet

导出的 Excel 文件现在包含 **2 个 sheet**:

#### Sheet 1: 审计结果明细
- 包含所有审计数据
- 自动调整列宽
- 所有原始字段完整保留

#### Sheet 2: 部门汇总 ⭐ 新增
- **账期**: 从"开始计费时间"提取年月(格式:2024-01)
- **部门名称**: 从"补充说明"提取关键词
- **企业实付金额汇总**: 按账期和部门汇总
- 自动排序(先按账期,再按部门)

---

## 📁 导出文件结构

### 文件名格式:
```
用车订单审计结果_2024-01-15.xlsx
```

### Sheet 1: 审计结果明细

| 下单人姓名 | 开始计费时间 | 实际出发地 | 实际目的地 | 企业实付金额 | 补充说明 | 用车类型 | 审计结果 |
|-----------|-------------|-----------|-----------|-------------|---------|---------|---------|
| 张三 | 2024-01-15 08:30 | 家 | 公司 | 25.5 | 销售部上班打车 | 快车 | 疑似上班打车 |
| 李四 | 2024-01-15 18:00 | 公司 | KTV | 45.0 | 技术部加班后放松 | 专车 | 禁止娱乐场所用车 |
| 王五 | 2024-02-10 14:00 | 公司 | 客户公司 | 35.0 | 销售部接客户 | 快车 | 合规 |

### Sheet 2: 部门汇总 ⭐

| 账期 | 部门名称 | 企业实付金额汇总 |
|------|---------|----------------|
| 2024-01 | 技术部 | 850.00 |
| 2024-01 | 销售部 | 1,250.50 |
| 2024-02 | 销售部 | 1,450.00 |
| 2024-02 | 市场部 | 680.00 |

---

## 🔧 部门提取逻辑

### 当前实现:

从"补充说明"字段提取关键词:

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

### 自定义方法:

如果你的 Excel 数据中有专门的"部门"列,可以修改 `app/page.tsx` 中的 `extractDepartment` 函数:

```typescript
// 方案 1: 直接从部门列获取
const extractDepartment = (row: any): string => {
  return row['部门名称'] || '未分配部门'
}

// 方案 2: 从员工编号映射
const departmentMap: Record<string, string> = {
  'E001': '销售部',
  'E002': '技术部',
  // ...
}

const extractDepartment = (row: any): string => {
  const employeeId = row['员工编号']
  return departmentMap[employeeId] || '未分配部门'
}
```

---

## 📊 账期提取逻辑

从"开始计费时间"字段提取年月:

```typescript
// 输入: "2024年1月15日 08:30" 或 "2024-01-15 08:30"
// 输出: "2024-01"

const billingTime = row['开始计费时间'] || ''
const dateMatch = billingTime.match(/(\d{4})[年/-](\d{1,2})/)
if (dateMatch) {
  accountPeriod = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}`
}
```

支持的时间格式:
- `2024年1月15日 08:30` → `2024-01`
- `2024-01-15 08:30` → `2024-01`
- `2024/1/15 08:30` → `2024-01`

---

## 🎨 样式支持

### 当前状态:

基础的 `xlsx` 库**不支持样式**。

当前导出:
- ✅ 数据完整
- ✅ 列宽自动调整
- ❌ 无颜色、字体、边框样式

### 添加样式的方法:

详见 `EXCEL-EXPORT-GUIDE.md` 文档,提供了 3 种方案:

1. **xlsx-js-style** - 简单,兼容 xlsx
2. **ExcelJS** - 功能强大,推荐
3. **后端生成** - 适合复杂样式

---

## 🔄 数据汇总逻辑

### 汇总算法:

```typescript
const generateDepartmentSummary = (data: any[]) => {
  // 1. 创建 Map 存储汇总数据
  const summaryMap = new Map<string, {
    账期: string
    部门名称: string
    企业实付金额汇总: number
  }>()

  // 2. 遍历所有订单
  data.forEach(row => {
    // 提取账期
    const accountPeriod = extractAccountPeriod(row)
    
    // 提取部门
    const department = extractDepartment(row)
    
    // 提取金额
    const amount = parseFloat(row['企业实付金额']) || 0
    
    // 生成唯一键
    const key = `${accountPeriod}_${department}`
    
    // 累加金额
    if (summaryMap.has(key)) {
      summaryMap.get(key)!.企业实付金额汇总 += amount
    } else {
      summaryMap.set(key, {
        账期: accountPeriod,
        部门名称: department,
        企业实付金额汇总: amount
      })
    }
  })

  // 3. 转换为数组并排序
  const summaryArray = Array.from(summaryMap.values())
  summaryArray.sort((a, b) => {
    if (a.账期 !== b.账期) {
      return a.账期.localeCompare(b.账期)
    }
    return a.部门名称.localeCompare(b.部门名称)
  })

  return summaryArray
}
```

### 示例:

**输入数据:**
```
订单1: 2024-01, 销售部, 100元
订单2: 2024-01, 销售部, 150元
订单3: 2024-01, 技术部, 200元
订单4: 2024-02, 销售部, 300元
```

**输出汇总:**
```
2024-01, 技术部, 200元
2024-01, 销售部, 250元
2024-02, 销售部, 300元
```

---

## 📝 修改的文件

### 1. app/page.tsx

**新增函数:**
- `generateDepartmentSummary()` - 生成部门汇总数据
- `extractDepartment()` - 提取部门名称

**修改函数:**
- `handleDownload()` - 导出两个 sheet

**代码行数:** 约 +100 行

### 2. package.json

**未修改** - 使用现有的 `xlsx` 库

---

## 🚀 测试步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 执行审计

1. 上传 Excel 文件
2. 点击"规则审计"
3. 等待审计完成

### 3. 下载结果

1. 点击"下载审计结果"按钮
2. 打开下载的 Excel 文件

### 4. 验证结果

#### 检查 Sheet 1: 审计结果明细
- ✅ 包含所有审计数据
- ✅ 列宽合适
- ✅ 数据完整

#### 检查 Sheet 2: 部门汇总
- ✅ 账期格式正确(YYYY-MM)
- ✅ 部门名称正确
- ✅ 金额汇总正确
- ✅ 排序正确(先账期,后部门)

---

## 💡 使用建议

### 场景 1: 财务对账

使用"部门汇总" sheet:
- 快速查看各部门月度用车支出
- 对比不同月份的支出趋势
- 生成部门费用报表

### 场景 2: 详细审计

使用"审计结果明细" sheet:
- 查看每笔订单的审计结果
- 筛选不合规订单
- 追溯具体问题

### 场景 3: 数据分析

结合两个 sheet:
- 部门汇总看趋势
- 明细数据找原因
- 生成综合报告

---

## 🔧 自定义配置

### 修改部门分类

编辑 `app/page.tsx` 中的 `extractDepartment` 函数:

```typescript
const extractDepartment = (row: any): string => {
  const note = row['补充说明'] || ''

  // 添加你的部门关键词
  if (note.includes('你的关键词')) return '你的部门名'
  
  // ...
  
  return '默认部门'
}
```

### 修改账期格式

编辑 `generateDepartmentSummary` 函数中的账期提取逻辑:

```typescript
// 当前: "2024-01"
// 可改为: "2024年1月" 或 "202401" 等
```

### 添加更多汇总维度

可以扩展汇总逻辑,例如:
- 按用车类型汇总
- 按合规状态汇总
- 按时间段汇总(周、季度)

---

## 📚 相关文档

- **EXCEL-EXPORT-GUIDE.md** - 详细的导出功能说明和样式添加方法
- **TESTING-GUIDE.md** - 完整的测试指南
- **UI-UPDATE-SUMMARY.md** - 界面更新说明

---

## 🎯 下一步

### 立即测试:

```bash
npm run dev
# 上传文件 → 规则审计 → 下载结果 → 检查两个 sheet
```

### 可选优化:

1. **添加 Excel 样式** - 参考 `EXCEL-EXPORT-GUIDE.md`
2. **自定义部门提取** - 修改 `extractDepartment` 函数
3. **添加更多汇总维度** - 扩展 `generateDepartmentSummary` 函数

---

**Excel 导出功能已升级! 📊**

现在支持双 sheet 导出,包含明细和汇总数据!

