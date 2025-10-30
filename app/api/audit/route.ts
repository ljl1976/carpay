import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// 审计规则定义
const auditRules = {
  rule1: (row: any) => {
    // 规则1: 上午9点前到公司打车
    const startTime = new Date(row['开始计费时间'])
    const destination = row['实际目的地'] || ''
    if (startTime.getHours() < 9 && destination.includes('物产天地中心')) {
      return '用车理由不合规，疑似上班打车'
    }
    return null
  },

  rule2: (row: any) => {
    // 规则2: 休闲娱乐场所检测(基础关键词)
    const keywords = ['KTV', 'ktv', '足浴', '会所', '洗浴', '桑拿', '按摩', '酒吧', '夜店', '游戏厅', '网吧', '棋牌', '麻将', '台球', '保健', '养生馆', '水疗', 'SPA', 'spa']
    const departure = row['实际出发地'] || ''
    const destination = row['实际目的地'] || ''

    for (let keyword of keywords) {
      if (departure.includes(keyword) || destination.includes(keyword)) {
        return '用车地址不得出现休闲娱乐类场所(KTV、足浴、会所、酒吧、夜店、按摩、游戏厅、网吧等)'
      }
    }

    // 特殊模式检测: "XX汤"、"XX浴"等可能的养生/按摩场所
    const suspiciousPatterns = [
      /[^\s]{1,5}汤\(/,  // 如: 头·道·汤(
      /[^\s]{1,5}浴\(/,  // 如: XX浴(
      /[^\s]{1,5}馆\(/,  // 如: XX养生馆(
    ]

    for (let pattern of suspiciousPatterns) {
      if (pattern.test(departure) || pattern.test(destination)) {
        return '用车地址不得出现休闲娱乐类场所(疑似养生馆、按摩店或水疗场所)'
      }
    }

    return null
  },

  rule3: (row: any) => {
    // 规则3: "加班"用词
    const note = row['补充说明'] || ''
    if (note.includes('加班')) {
      return '用车理由不得出现"加班"，可写21点以后离开公司'
    }
    return null
  },

  rule4: (row: any) => {
    // 规则4: "接""送"客户
    const note = row['补充说明'] || ''
    if (note.includes('接') || note.includes('送')) {
      return '用车理由不得出现"接""送"客户'
    }
    return null
  },

  rule5: (row: any) => {
    // 规则5: "招待""接待"客户
    const note = row['补充说明'] || ''
    if ((note.includes('招待') || note.includes('接待')) && note.includes('客户')) {
      return '用车理由不得出现"招待""接待"xx客户'
    }
    return null
  },

  rule6: (row: any) => {
    // 规则6: 替他人打车
    const note = row['补充说明'] || ''
    const keywords = ['替', '代', '帮']
    for (let keyword of keywords) {
      if (note.includes(keyword) && (note.includes('打车') || note.includes('用车'))) {
        return '用车只能本人用车，不允许替他人打车'
      }
    }
    return null
  },

  rule7: (row: any) => {
    // 规则7: 高额费用或豪华车型
    const amount = parseFloat(row['企业实付金额'])
    const carType = row['用车类型(明细)'] || ''
    if (amount > 200) {
      return '单次用车费用远超同城平均水平'
    }
    if (carType.includes('豪华') || carType.includes('商务')) {
      return '单次用车费用远超同城平均水平'
    }
    return null
  },

  rule8: (row: any) => {
    // 规则8: 用车类型与补充说明匹配度
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
}

// 执行审计
const auditRow = (row: any) => {
  const results: string[] = []
  for (let ruleKey in auditRules) {
    const result = (auditRules as any)[ruleKey](row)
    if (result) {
      results.push(result)
    }
  }
  return results.length > 0 ? results.join('; ') : ''
}

// AI批量审计函数(已移除,不在规则审计中使用)
// AI审计功能已移至 /api/ai-audit 接口

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '未上传文件' },
        { status: 400 }
      )
    }

    // 读取Excel文件
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets['用车订单']

    if (!worksheet) {
      return NextResponse.json(
        { error: '未找到"用车订单"sheet' },
        { status: 400 }
      )
    }

    // 转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet)

    // 执行审计 - 只使用本地规则
    const auditedData = data.map((row: any) => {
      const localResult = auditRow(row)
      return {
        ...row,
        '审计结果': localResult
      }
    })

    // 统计结果
    const compliant = auditedData.filter((r: any) => !r['审计结果']).length
    const nonCompliant = auditedData.filter((r: any) => r['审计结果']).length

    return NextResponse.json({
      success: true,
      data: auditedData,
      stats: {
        total: auditedData.length,
        compliant,
        nonCompliant
      }
    })
  } catch (error: any) {
    console.error('审计错误:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

