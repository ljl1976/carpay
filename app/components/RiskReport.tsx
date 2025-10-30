'use client'

interface RiskReportProps {
  data: any
}

export default function RiskReport({ data }: RiskReportProps) {
  if (!data) return null

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">审计风险报告</h3>
      <div className="space-y-6">
        {/* 总体概况 */}
        <div className="border-l-4 border-sky-500 pl-4">
          <h4 className="font-bold text-lg mb-2">总体概况</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-500">总订单数</p>
              <p className="text-2xl font-bold">{data.summary?.total || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">不合规订单</p>
              <p className="text-2xl font-bold text-rose-600">{data.summary?.nonCompliant || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">合规率</p>
              <p className="text-2xl font-bold text-emerald-600">
                {data.summary?.complianceRate || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* 风险分类统计 */}
        {data.riskCategories && data.riskCategories.length > 0 && (
          <div className="border-l-4 border-amber-500 pl-4">
            <h4 className="font-bold text-lg mb-2">风险分类统计</h4>
            <div className="space-y-2">
              {data.riskCategories.map((category: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span className="text-sm">{category.name}</span>
                  <span className="font-bold text-rose-600">{category.count} 条</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 高风险人员 */}
        {data.highRiskUsers && data.highRiskUsers.length > 0 && (
          <div className="border-l-4 border-rose-500 pl-4">
            <h4 className="font-bold text-lg mb-2">高风险人员</h4>
            <div className="space-y-2">
              {data.highRiskUsers.map((user: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-rose-50 rounded">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-sm text-rose-600">{user.violations} 次违规</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 建议措施 */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className="border-l-4 border-emerald-500 pl-4">
            <h4 className="font-bold text-lg mb-2">建议措施</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-slate-700">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

