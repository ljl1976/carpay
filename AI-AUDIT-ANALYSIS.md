# 🤖 AI 审计逻辑分析

## 📋 目录

1. [审计流程概览](#审计流程概览)
2. [规则审计逻辑](#规则审计逻辑)
3. [AI 审计逻辑](#ai-审计逻辑)
4. [AI 提示词分析](#ai-提示词分析)
5. [风险报告生成](#风险报告生成)
6. [优化建议](#优化建议)

---

## 🔄 审计流程概览

### 当前架构

```
用户上传 Excel
    ↓
点击"规则审计"
    ↓
调用 /api/audit
    ↓
┌─────────────────────────────────┐
│  对每条订单:                     │
│  1. 先执行本地规则检查(8条规则)  │
│  2. 如果本地规则发现问题 → 返回  │
│  3. 如果本地规则合规 → 调用 AI   │
│  4. AI 进行二次审计              │
└─────────────────────────────────┘
    ↓
返回审计结果
    ↓
点击"AI一键分析"
    ↓
调用 /api/risk-report
    ↓
生成风险报告(统计分析,无AI)
```

### 关键发现

1. **"规则审计"按钮** = 本地规则 + AI 审计(双重审计)
2. **"AI一键分析"按钮** = 统计分析(无 AI 调用)

---

## 📏 规则审计逻辑

### 8 条本地规则

位置: `app/api/audit/route.ts` (第 6-99 行)

#### 规则 1: 上班打车检测

```typescript
rule1: (row: any) => {
  const startTime = new Date(row['开始计费时间'])
  const destination = row['实际目的地'] || ''
  if (startTime.getHours() < 9 && destination.includes('物产天地中心')) {
    return '用车理由不合规，疑似上班打车'
  }
  return null
}
```

**触发条件:**
- 开始计费时间 < 9:00
- 目的地包含"物产天地中心"

---

#### 规则 2: 娱乐场所检测

```typescript
rule2: (row: any) => {
  const keywords = ['KTV', 'ktv', '足浴', '会所', '洗浴', '桑拿', '按摩']
  const departure = row['实际出发地'] || ''
  const destination = row['实际目的地'] || ''
  for (let keyword of keywords) {
    if (departure.includes(keyword) || destination.includes(keyword)) {
      return '用车地址不得出现KTV、足浴店等会所'
    }
  }
  return null
}
```

**触发条件:**
- 出发地或目的地包含: KTV、足浴、会所、洗浴、桑拿、按摩

---

#### 规则 3: "加班"用词检测

```typescript
rule3: (row: any) => {
  const note = row['补充说明'] || ''
  if (note.includes('加班')) {
    return '用车理由不得出现"加班"，可写21点以后离开公司'
  }
  return null
}
```

**触发条件:**
- 补充说明包含"加班"

---

#### 规则 4: "接送"客户检测

```typescript
rule4: (row: any) => {
  const note = row['补充说明'] || ''
  if (note.includes('接') || note.includes('送')) {
    return '用车理由不得出现"接""送"客户'
  }
  return null
}
```

**触发条件:**
- 补充说明包含"接"或"送"

**⚠️ 潜在问题:** 过于宽泛,可能误判(例如:"接到通知"、"送达文件")

---

#### 规则 5: "招待接待"检测

```typescript
rule5: (row: any) => {
  const note = row['补充说明'] || ''
  if ((note.includes('招待') || note.includes('接待')) && note.includes('客户')) {
    return '用车理由不得出现"招待""接待"xx客户'
  }
  return null
}
```

**触发条件:**
- 补充说明同时包含("招待"或"接待") + "客户"

---

#### 规则 6: 替他人打车检测

```typescript
rule6: (row: any) => {
  const note = row['补充说明'] || ''
  const keywords = ['替', '代', '帮']
  for (let keyword of keywords) {
    if (note.includes(keyword) && (note.includes('打车') || note.includes('用车'))) {
      return '用车只能本人用车，不允许替他人打车'
    }
  }
  return null
}
```

**触发条件:**
- 补充说明包含("替"或"代"或"帮") + ("打车"或"用车")

---

#### 规则 7: 高额费用检测

```typescript
rule7: (row: any) => {
  const amount = parseFloat(row['企业实付金额'])
  const carType = row['用车类型(明细)'] || ''
  if (amount > 200) {
    return '单次用车费用远超同城平均水平'
  }
  if (carType.includes('豪华') || carType.includes('商务')) {
    return '单次用车费用远超同城平均水平'
  }
  return null
}
```

**触发条件:**
- 企业实付金额 > 200 元
- 或用车类型包含"豪华"或"商务"

---

#### 规则 8: 高价车型必要性检测

```typescript
rule8: (row: any) => {
  const carType = row['用车类型(明细)'] || ''
  const note = row['补充说明'] || ''

  const isHighEndCar = carType.includes('豪华') || carType.includes('商务')

  if (isHighEndCar) {
    const necessaryKeywords = ['接待', '招待', '重要客户', '重要会议', '董事', '总经理', '客户']
    const hasNecessaryReason = necessaryKeywords.some(keyword => note.includes(keyword))

    if (!hasNecessaryReason) {
      return '用车类型选用了高价类型,缺乏必要性说明'
    }
  }
  return null
}
```

**触发条件:**
- 用车类型包含"豪华"或"商务"
- 且补充说明不包含: 接待、招待、重要客户、重要会议、董事、总经理、客户

---

## 🤖 AI 审计逻辑

### 调用时机

位置: `app/api/audit/route.ts` (第 194-214 行)

```typescript
const auditedData = await Promise.all(
  data.map(async (row: any) => {
    // 1. 先执行本地规则检查
    const localResult = auditRow(row)

    // 2. 如果本地规则检查有结果，使用本地结果
    if (localResult) {
      return {
        ...row,
        '审计结果': localResult
      }
    }

    // 3. 如果本地规则检查合规，再传给AI进行判别
    const aiResult = await callAIAudit(row)
    return {
      ...row,
      '审计结果': aiResult || ''
    }
  })
)
```

### 关键特点

1. **双重审计机制**
   - 本地规则优先
   - AI 作为补充审计

2. **AI 只审计"合规"订单**
   - 本地规则已标记的不合规订单不再调用 AI
   - 节省 AI 调用成本

3. **并发调用**
   - 使用 `Promise.all` 并发处理所有订单
   - 可能导致大量 AI 请求

---

## 📝 AI 提示词分析

### 完整提示词

位置: `app/api/audit/route.ts` (第 116-131 行)

```
你是一个用车审计专家。请根据以下规则对这条用车记录进行审计：

规则1: 如果开始计费时间为上午9点以前打车，且目的地为公司(包含了'物产天地中心')，则审计结果='用车理由不合规，疑似上班打车'
规则2: 如果实际出发地,实际目的地出现任何"KTV"、"会所"、"酒吧"、"夜店"、"足浴"、"按摩"、"SPA"、"高尔夫"等非业务相关娱乐消费场所的关键词,则审计结果='用车地址不得出现KTV、足浴店等会所'
规则3: 补充说明出现"加班"，则审计结果='用车理由不得出现"加班"，可写21点以后离开公司'
规则4: 补充说明出现"接","送"客户等，审计结果='用车理由不得出现"接""送"客户'
规则5: 补充说明出现"招待""接待"xx客户，审计结果='用车理由不得出现"招待""接待"xx客户'
规则6: 补充说明如果替他人打车，审计结果='用车只能本人用车，不允许替他人打车'
规则7: 单次用车费用远超同城平均水平（例如：单次超过200元），或用车类型(明细)为"豪华型"、"商务型"等非必要的高价车型，审计结果='单次用车费用远超同城平均水平'
规则8: 如果使用了"豪华型"、"商务型"等高价用车类型，但补充说明仅为"常规外出"或"加班"，缺乏"接待重要客户"等必要性说明，则审计结果='用车类型选用了高价类型,缺乏必要性说明'

用车记录：
${JSON.stringify(rowData, null, 2)}

请只返回审计结果，如果合规则返回空字符串。
```

### 提示词结构分析

#### 1. 角色定义
```
你是一个用车审计专家。
```
- ✅ 简洁明确
- ✅ 设定专业角色

#### 2. 规则说明
- ✅ 8 条规则完整列出
- ✅ 每条规则格式统一
- ⚠️ 规则2 比本地规则多了"酒吧"、"夜店"、"SPA"、"高尔夫"

#### 3. 数据输入
```
用车记录：
${JSON.stringify(rowData, null, 2)}
```
- ✅ 使用 JSON 格式,结构清晰
- ⚠️ 可能包含大量无关字段

#### 4. 输出要求
```
请只返回审计结果，如果合规则返回空字符串。
```
- ✅ 明确输出格式
- ✅ 要求简洁输出

---

### 提示词优缺点

#### ✅ 优点

1. **规则明确**: 8 条规则清晰列出
2. **格式统一**: 每条规则格式一致
3. **输出规范**: 明确要求输出格式
4. **角色设定**: 设定专业角色

#### ⚠️ 缺点

1. **规则冗余**: AI 提示词中的规则与本地规则重复
2. **规则不一致**: 规则2 的关键词列表不同
3. **缺少示例**: 没有提供正确/错误的示例
4. **缺少上下文**: 没有说明审计目的和背景
5. **数据冗余**: JSON 可能包含无关字段

---

## 📊 风险报告生成

### 当前实现

位置: `app/api/risk-report/route.ts`

**关键发现: 风险报告生成不使用 AI,只做统计分析**

```typescript
export async function POST(request: NextRequest) {
  const { data } = await request.json()

  // 1. 统计总体概况
  const total = data.length
  const nonCompliant = data.filter((r: any) => r['审计结果']).length
  const compliant = total - nonCompliant
  const complianceRate = ((compliant / total) * 100).toFixed(2)

  // 2. 风险分类统计
  const riskMap = new Map<string, number>()
  data.forEach((row: any) => {
    if (row['审计结果']) {
      const results = row['审计结果'].split(';')
      results.forEach((result: string) => {
        const trimmed = result.trim()
        riskMap.set(trimmed, (riskMap.get(trimmed) || 0) + 1)
      })
    }
  })

  // 3. 高风险人员统计
  const userMap = new Map<string, number>()
  data.forEach((row: any) => {
    if (row['审计结果']) {
      const name = row['下单人姓名']
      userMap.set(name, (userMap.get(name) || 0) + 1)
    }
  })

  // 4. 生成建议措施(基于规则的硬编码建议)
  const recommendations = []
  if (nonCompliant > 0) {
    recommendations.push('加强用车规则培训，提高员工合规意识')
    
    if (riskCategories.some(r => r.name.includes('上班打车'))) {
      recommendations.push('建议对早高峰时段打车进行重点审查')
    }
    // ... 更多硬编码建议
  }

  return NextResponse.json({
    summary: { total, compliant, nonCompliant, complianceRate },
    riskCategories,
    highRiskUsers,
    recommendations
  })
}
```

### 报告内容

1. **总体概况**: 总订单、合规、不合规、合规率
2. **风险分类统计**: 各类违规的数量
3. **高风险人员**: 违规次数最多的前 10 人
4. **建议措施**: 基于规则的硬编码建议

---

## 💡 优化建议

### 1. 提示词优化

#### 当前问题:
- 规则与本地规则重复
- 缺少示例
- 输出格式不够结构化

#### 优化方案:

```typescript
const prompt = `你是一个专业的企业用车审计专家,负责审查员工用车报销的合规性。

【审计背景】
公司制定了严格的用车报销规则,禁止上班打车、娱乐场所用车、替他人打车等行为。
你的任务是发现本地规则可能遗漏的违规行为。

【审计重点】
1. 地址合理性: 出发地和目的地是否符合业务需求
2. 时间合理性: 用车时间是否异常(如深夜、周末)
3. 费用合理性: 费用是否与距离、时间匹配
4. 说明真实性: 补充说明是否合理、是否有矛盾

【用车记录】
- 下单人: ${rowData['下单人姓名']}
- 时间: ${rowData['开始计费时间']}
- 路线: ${rowData['实际出发地']} → ${rowData['实际目的地']}
- 费用: ¥${rowData['企业实付金额']}
- 车型: ${rowData['用车类型(明细)']}
- 说明: ${rowData['补充说明']}

【输出要求】
如果发现可疑或不合规行为,请简要说明问题(20字以内)。
如果合规,返回空字符串。

示例:
- "深夜用车缺乏合理说明"
- "费用与距离明显不符"
- ""(合规)
`
```

#### 优化点:
- ✅ 明确 AI 的角色是"补充审计"
- ✅ 提供审计背景和重点
- ✅ 只传递必要字段,减少 token 消耗
- ✅ 提供输出示例
- ✅ 限制输出长度(20字以内)

---

### 2. 风险报告 AI 增强

#### 当前问题:
- "AI一键分析"实际上不使用 AI
- 建议措施是硬编码的

#### 优化方案:

在 `app/api/risk-report/route.ts` 中添加 AI 调用:

```typescript
const generateAIRecommendations = async (data: any[], stats: any) => {
  const prompt = `你是企业用车管理专家。请根据以下审计数据生成管理建议。

【审计概况】
- 总订单: ${stats.total}
- 合规订单: ${stats.compliant}
- 不合规订单: ${stats.nonCompliant}
- 合规率: ${stats.complianceRate}%

【主要违规类型】
${riskCategories.map(r => `- ${r.name}: ${r.count}次`).join('\n')}

【高频违规人员】
${highRiskUsers.slice(0, 5).map(u => `- ${u.name}: ${u.violations}次`).join('\n')}

请生成3-5条具体的管理建议,每条建议应该:
1. 针对具体问题
2. 可执行
3. 有预期效果

输出格式: JSON数组
["建议1", "建议2", "建议3"]
`

  // 调用 AI
  const response = await callAI(prompt)
  return JSON.parse(response)
}
```

---

### 3. 性能优化

#### 当前问题:
- 并发调用所有 AI 请求,可能超过 API 限制
- 每条订单都调用 AI,成本高

#### 优化方案:

```typescript
// 方案 1: 批量调用
const batchSize = 10
for (let i = 0; i < data.length; i += batchSize) {
  const batch = data.slice(i, i + batchSize)
  await Promise.all(batch.map(row => callAIAudit(row)))
}

// 方案 2: 只对可疑订单调用 AI
const suspiciousRows = data.filter(row => {
  // 定义"可疑"的条件
  const amount = parseFloat(row['企业实付金额'])
  const isWeekend = new Date(row['开始计费时间']).getDay() % 6 === 0
  return amount > 100 || isWeekend
})

// 只对可疑订单调用 AI
```

---

### 4. 规则一致性

#### 当前问题:
- 本地规则和 AI 提示词中的规则不一致
- 规则2 的关键词列表不同

#### 优化方案:

```typescript
// 统一规则定义
const AUDIT_RULES_CONFIG = {
  rule2: {
    keywords: ['KTV', 'ktv', '足浴', '会所', '洗浴', '桑拿', '按摩', '酒吧', '夜店', 'SPA', '高尔夫'],
    message: '用车地址不得出现KTV、足浴店等会所'
  },
  // ...
}

// 本地规则使用配置
rule2: (row: any) => {
  const { keywords, message } = AUDIT_RULES_CONFIG.rule2
  // ...
}

// AI 提示词也使用配置
const prompt = `
规则2: 如果实际出发地,实际目的地出现任何"${AUDIT_RULES_CONFIG.rule2.keywords.join('、')}"等非业务相关娱乐消费场所的关键词,则审计结果='${AUDIT_RULES_CONFIG.rule2.message}'
`
```

---

## 📋 总结

### 当前架构

| 功能 | 实现方式 | 是否使用 AI |
|------|---------|-----------|
| 规则审计 | 本地规则 + AI 补充 | ✅ 是 |
| AI一键分析 | 统计分析 | ❌ 否 |

### 关键发现

1. ✅ **双重审计机制**: 本地规则 + AI,提高准确性
2. ⚠️ **命名误导**: "AI一键分析"实际不使用 AI
3. ⚠️ **规则冗余**: AI 提示词重复本地规则
4. ⚠️ **性能问题**: 并发调用所有 AI 请求
5. ⚠️ **规则不一致**: 本地规则和 AI 规则有差异

### 优化优先级

1. **高优先级**
   - 优化 AI 提示词(减少冗余,增加示例)
   - 统一本地规则和 AI 规则
   - 为"AI一键分析"添加真正的 AI 功能

2. **中优先级**
   - 优化性能(批量调用或选择性调用)
   - 改进规则4(避免误判)

3. **低优先级**
   - 添加更多审计维度
   - 优化输出格式

---

**文档完成! 🎉**

如需实施优化,请参考上述建议。

