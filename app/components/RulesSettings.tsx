'use client'

const auditRulesData = [
  {
    id: 1,
    name: '规则1',
    title: '上午9点前到公司打车',
    description: '如果开始计费时间为上午9点以前打车，且目的地为公司(包含了\'物产天地中心\')',
    result: '用车理由不合规，疑似上班打车'
  },
  {
    id: 2,
    name: '规则2',
    title: 'KTV、足浴店等会所',
    description: '如果实际出发地、实际目的地出现KTV、足浴、会所、洗浴、桑拿、按摩等关键词',
    result: '用车地址不得出现KTV、足浴店等会所'
  },
  {
    id: 3,
    name: '规则3',
    title: '"加班"用词',
    description: '补充说明出现"加班"',
    result: '用车理由不得出现"加班"，可写21点以后离开公司'
  },
  {
    id: 4,
    name: '规则4',
    title: '"接""送"客户',
    description: '补充说明出现"接"或"送"',
    result: '用车理由不得出现"接""送"客户'
  },
  {
    id: 5,
    name: '规则5',
    title: '"招待""接待"客户',
    description: '补充说明出现"招待"或"接待"且包含"客户"',
    result: '用车理由不得出现"招待""接待"xx客户'
  },
  {
    id: 6,
    name: '规则6',
    title: '替他人打车',
    description: '补充说明出现"替"、"代"、"帮"且包含"打车"或"用车"',
    result: '用车只能本人用车，不允许替他人打车'
  },
  {
    id: 7,
    name: '规则7',
    title: '高额费用或豪华车型',
    description: '单次用车费用超过200元，或车型为"豪华"、"商务"等',
    result: '单次用车费用远超同城平均水平'
  },
  {
    id: 8,
    name: '规则8',
    title: '用车类型与补充说明匹配度',
    description: '使用了"豪华型"、"商务型"等高价车型，但补充说明缺乏必要性说明',
    result: '用车类型选用了高价类型,缺乏必要性说明'
  }
]

export default function RulesSettings() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-2">审计规则设置</h2>
      <p className="text-slate-500 mb-8">查看和管理系统中的所有审计规则。</p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-6">现有审计规则</h3>
        <div className="space-y-4">
          {auditRulesData.map(rule => (
            <div
              key={rule.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {rule.name}
                    </span>
                    <h4 className="text-lg font-bold text-slate-800">{rule.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{rule.description}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded border-l-4 border-sky-500">
                <div className="text-xs text-slate-500 mb-1">审计结果：</div>
                <div className="text-sm font-medium text-slate-800">{rule.result}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

