'use client'

import { useState, useEffect } from 'react'

interface ResultsTableProps {
  data: any[]
  onDownload: () => void
  onGenerateReport: () => void
}

export default function ResultsTable({ data, onDownload, onGenerateReport }: ResultsTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [displayData, setDisplayData] = useState(data)

  // 更新显示数据当 data 改变时
  useEffect(() => {
    setDisplayData(data)
  }, [data])

  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc'
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = a[column] || ''
      const bVal = b[column] || ''
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setSortColumn(column)
    setSortDirection(direction)
    setDisplayData(sorted)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">审计结果列表</h3>
        <div className="flex gap-2">
          {data.length > 0 && (
            <>
              <button
                onClick={onDownload}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载审计结果
              </button>
              <button
                onClick={onGenerateReport}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                查看风险报告
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b-2 border-slate-200 bg-slate-50">
            <tr>
              <th className="p-3 w-12">序号</th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('下单人姓名')}
              >
                下单人 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('开始计费时间')}
              >
                开始计费时间 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('实际出发地')}
              >
                实际出发地 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('实际目的地')}
              >
                实际目的地 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('企业实付金额')}
              >
                企业实付金额 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('补充说明')}
              >
                补充说明 <span className="filter-icon">⬍</span>
              </th>
              <th
                className="p-3 filter-header cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('审计结果')}
              >
                审计结果 <span className="filter-icon">⬍</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-3 text-center text-slate-500">
                  请上传Excel文件开始审计
                </td>
              </tr>
            ) : (
              displayData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-slate-100 hover:bg-slate-50 ${
                    row['审计结果'] ? 'bg-rose-50' : ''
                  }`}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{row['下单人姓名'] || '-'}</td>
                  <td className="p-3">{row['开始计费时间'] || '-'}</td>
                  <td className="p-3">{row['实际出发地'] || '-'}</td>
                  <td className="p-3">{row['实际目的地'] || '-'}</td>
                  <td className="p-3">{row['企业实付金额'] || '-'}</td>
                  <td className="p-3">{row['补充说明'] || '-'}</td>
                  <td className="p-3">
                    {row['审计结果'] ? (
                      <span className="text-rose-600 font-medium">
                        {row['审计结果']}
                      </span>
                    ) : (
                      <span className="text-emerald-600">合规</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

