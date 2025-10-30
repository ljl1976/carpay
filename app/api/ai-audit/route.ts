import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// AI批量审计函数
const callAIBatchAudit = async (data: any[]) => {
  try {
    // 准备审计数据(只传递必要字段)
    const auditData = data.map((row, index) => ({
      序号: index + 1,
      下单人姓名: row['下单人姓名'],
      开始计费时间: row['开始计费时间'],
      实际出发地: row['实际出发地'],
      实际目的地: row['实际目的地'],
      企业实付金额: row['企业实付金额'],
      用车类型: row['用车类型(明细)'],
      补充说明: row['补充说明']
    }))

    const prompt = `你是一个专业的企业用车审计专家,负责审查员工用车报销的合规性。

【审计背景】
公司制定了严格的用车报销规则,禁止上班打车、娱乐场所用车、替他人打车等行为。
本地规则已经完成了基础审计,你的任务是发现本地规则可能遗漏的违规行为。

【审计重点】
1. 地址合理性: 实际出发地和实际目的地是否符合业务需求
   - 特别关注可能的休闲娱乐场所(即使名称不明显)
   - 例如: "头·道·汤(西俞巷店)" 可能是养生馆、按摩店或水疗场所
   - 场所名称中包含"汤"、"浴"、"馆"等字,结合常见商业形态判断
   
2. 时间合理性: 用车时间是否异常
   - 深夜用车(22:00后)是否有合理说明
   - 周末用车是否符合业务需求
   - 早高峰时段(7:00-9:00)打车到公司
   
3. 费用合理性: 费用是否与距离、时间、车型匹配
   - 短距离高费用
   - 费用明显超出正常范围
   
4. 说明真实性: 补充说明是否合理、是否有矛盾
   - 说明过于简单或模糊
   - 说明与时间、地点不符

【用车记录】(共 ${data.length} 条)
${JSON.stringify(auditData, null, 2)}

【输出要求】
请对每条记录进行审计,返回 JSON 数组格式,数组长度必须等于 ${data.length}。
对于每条记录:
- 如果发现问题,返回审计结果(简要说明,20字以内)
- 如果合规,返回空字符串 ""

输出格式示例:
[
  "AI:深夜用车缺乏合理说明",
  "",
  "AI:疑似养生馆或按摩场所",
  "",
  "AI:费用与距离明显不符"
]

注意:
1. 必须返回 ${data.length} 个元素的数组
2. 审计结果开头必须加 "AI:" 前缀
3. 只返回 JSON 数组,不要其他文字
4. 如果合规返回空字符串 "",不要返回 null
`

    console.log('调用 AI 审计,数据量:', data.length)
    
    const response = await axios.post(
      `${process.env.AI_GATEWAY_URL}?key=${process.env.AI_GATEWAY_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'OE-Key': process.env.OE_KEY || '',
          'OE-Gateway-Name': process.env.OE_GATEWAY_NAME || '',
          'OE-AI-Provider': process.env.OE_AI_PROVIDER || '',
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60秒超时
      }
    )

    if (response.data.candidates && response.data.candidates[0]) {
      const aiResultText = response.data.candidates[0].content.parts[0].text.trim()
      console.log('AI 返回结果:', aiResultText)
      
      // 提取 JSON 数组
      let aiResults: string[] = []
      
      try {
        // 尝试直接解析
        aiResults = JSON.parse(aiResultText)
      } catch (e) {
        // 如果解析失败,尝试提取 JSON 数组
        const jsonMatch = aiResultText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          aiResults = JSON.parse(jsonMatch[0])
        } else {
          console.error('AI 返回格式错误,无法解析 JSON')
          // 返回空数组
          aiResults = new Array(data.length).fill('')
        }
      }
      
      // 确保数组长度匹配
      if (aiResults.length !== data.length) {
        console.warn(`AI 返回数组长度 ${aiResults.length} 与数据长度 ${data.length} 不匹配`)
        // 补齐或截断
        while (aiResults.length < data.length) {
          aiResults.push('')
        }
        aiResults = aiResults.slice(0, data.length)
      }
      
      // 确保所有非空结果都有 "AI:" 前缀
      aiResults = aiResults.map(result => {
        if (result && !result.startsWith('AI:')) {
          return `AI:${result}`
        }
        return result || ''
      })
      
      return aiResults
    }
    
    console.error('AI 返回数据格式错误')
    return new Array(data.length).fill('')
    
  } catch (error: any) {
    console.error('AI审计错误:', error.message)
    // 返回空数组
    return new Array(data.length).fill('')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: '无效的数据' },
        { status: 400 }
      )
    }

    console.log('开始 AI 批量审计,数据量:', data.length)
    
    // 调用 AI 批量审计
    const aiResults = await callAIBatchAudit(data)
    
    // 合并 AI 审计结果
    const auditedData = data.map((row, index) => {
      const existingResult = row['审计结果'] || ''
      const aiResult = aiResults[index] || ''
      
      // 合并结果
      let finalResult = existingResult
      if (aiResult) {
        finalResult = existingResult 
          ? `${existingResult}; ${aiResult}` 
          : aiResult
      }
      
      return {
        ...row,
        '审计结果': finalResult
      }
    })
    
    // 统计结果
    const compliant = auditedData.filter((r: any) => !r['审计结果']).length
    const nonCompliant = auditedData.filter((r: any) => r['审计结果']).length
    
    console.log('AI 审计完成,合规:', compliant, '不合规:', nonCompliant)

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
    console.error('AI审计错误:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

