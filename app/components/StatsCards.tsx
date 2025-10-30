'use client'

interface StatsCardsProps {
  stats: {
    total: number
    compliant: number
    nonCompliant: number
    complianceRate: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className="bg-sky-100 text-sky-600 p-4 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-500 text-sm">总订单数</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-slate-500 text-sm">合规订单</p>
          <p className="text-3xl font-bold">{stats.compliant}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className="bg-rose-100 text-rose-600 p-4 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-slate-500 text-sm">不合规订单</p>
          <p className="text-3xl font-bold">{stats.nonCompliant}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className="bg-amber-100 text-amber-600 p-4 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
          </svg>
        </div>
        <div>
          <p className="text-slate-500 text-sm">合规率</p>
          <p className="text-3xl font-bold">{stats.complianceRate}%</p>
        </div>
      </div>
    </div>
  )
}

