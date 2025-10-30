import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: '无效的数据' },
        { status: 400 }
      )
    }

    // 统计总体概况
    const total = data.length
    const nonCompliant = data.filter((r: any) => r['审计结果']).length
    const compliant = total - nonCompliant
    const complianceRate = ((compliant / total) * 100).toFixed(2)

    // 风险分类统计
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

    const riskCategories = Array.from(riskMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 高风险人员统计
    const userMap = new Map<string, number>()
    data.forEach((row: any) => {
      if (row['审计结果']) {
        const name = row['下单人姓名']
        userMap.set(name, (userMap.get(name) || 0) + 1)
      }
    })

    const highRiskUsers = Array.from(userMap.entries())
      .map(([name, violations]) => ({ name, violations }))
      .sort((a, b) => b.violations - a.violations)
      .slice(0, 10) // 只取前10名

    // 生成建议措施
    const recommendations = []
    if (nonCompliant > 0) {
      recommendations.push('加强用车规则培训，提高员工合规意识')
      
      if (riskCategories.some(r => r.name.includes('上班打车'))) {
        recommendations.push('建议对早高峰时段打车进行重点审查')
      }
      
      if (riskCategories.some(r => r.name.includes('KTV') || r.name.includes('会所'))) {
        recommendations.push('严格禁止前往娱乐场所的用车报销')
      }
      
      if (riskCategories.some(r => r.name.includes('费用'))) {
        recommendations.push('设置单次用车费用上限，超额需特殊审批')
      }
      
      if (highRiskUsers.length > 0) {
        recommendations.push('对高频违规人员进行一对一沟通和警告')
      }
    }

    return NextResponse.json({
      summary: {
        total,
        compliant,
        nonCompliant,
        complianceRate
      },
      riskCategories,
      highRiskUsers,
      recommendations
    })
  } catch (error: any) {
    console.error('生成报告错误:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

