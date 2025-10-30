'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import * as XLSXStyle from 'xlsx-js-style'
import Sidebar from './components/Sidebar'
import StatsCards from './components/StatsCards'
import UploadSection from './components/UploadSection'
import ResultsTable from './components/ResultsTable'
import RulesSettings from './components/RulesSettings'
import RiskReport from './components/RiskReport'

export default function Home() {
  const [activeSection, setActiveSection] = useState('car-audit')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [rawData, setRawData] = useState<any[]>([])
  const [auditedData, setAuditedData] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    compliant: 0,
    nonCompliant: 0,
    complianceRate: 0
  })
  const [reportData, setReportData] = useState<any>(null)

  // 上传文件(只上传,不审计)
  const handleUpload = async (file: File) => {
    try {
      // 读取 Excel 文件
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      const sheetName = workbook.SheetNames.find(name => name.includes('用车订单'))
      if (!sheetName) {
        throw new Error('未找到"用车订单"工作表')
      }

      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)

      if (data.length === 0) {
        throw new Error('Excel文件中没有数据')
      }

      setUploadedFile(file)
      setRawData(data)

      return { success: true, message: `成功上传 ${data.length} 条数据` }
    } catch (error: any) {
      console.error('上传错误:', error)
      return { success: false, message: error.message }
    }
  }

  // 规则审计
  const handleRuleAudit = async () => {
    if (!uploadedFile) {
      throw new Error('请先上传文件')
    }

    const formData = new FormData()
    formData.append('file', uploadedFile)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('审计失败')
      }

      const result = await response.json()

      if (result.success) {
        setAuditedData(result.data)
        setStats({
          total: result.stats.total,
          compliant: result.stats.compliant,
          nonCompliant: result.stats.nonCompliant,
          complianceRate: ((result.stats.compliant / result.stats.total) * 100).toFixed(2) as any
        })
      } else {
        throw new Error(result.error || '审计失败')
      }
    } catch (error: any) {
      console.error('审计错误:', error)
      throw error
    }
  }

  // AI 一键分析
  const handleAIAnalyze = async () => {
    if (auditedData.length === 0) {
      throw new Error('请先执行规则审计')
    }

    try {
      // 1. 先调用 AI 审计接口
      const aiAuditResponse = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: auditedData })
      })

      if (!aiAuditResponse.ok) {
        throw new Error('AI审计失败')
      }

      const aiAuditResult = await aiAuditResponse.json()

      if (aiAuditResult.success) {
        // 更新审计数据
        setAuditedData(aiAuditResult.data)
        setStats({
          total: aiAuditResult.stats.total,
          compliant: aiAuditResult.stats.compliant,
          nonCompliant: aiAuditResult.stats.nonCompliant,
          complianceRate: ((aiAuditResult.stats.compliant / aiAuditResult.stats.total) * 100).toFixed(2) as any
        })

        // 2. 再生成风险报告
        const reportResponse = await fetch('/api/risk-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: aiAuditResult.data })
        })

        if (!reportResponse.ok) {
          throw new Error('生成风险报告失败')
        }

        const reportResult = await reportResponse.json()
        setReportData(reportResult)

        // 自动跳转到风险报告页面
        setActiveSection('risk-report')
      } else {
        throw new Error(aiAuditResult.error || 'AI审计失败')
      }
    } catch (error: any) {
      console.error('AI分析错误:', error)
      throw error
    }
  }

  const handleDownload = () => {
    if (auditedData.length === 0) return

    const workbook = XLSXStyle.utils.book_new()

    // ========== Sheet 1: 审计结果明细 ==========
    const detailSheet = XLSXStyle.utils.json_to_sheet(auditedData)

    // 应用样式到审计结果明细
    applyDetailSheetStyles(detailSheet, auditedData.length)

    XLSXStyle.utils.book_append_sheet(workbook, detailSheet, '审计结果明细')

    // ========== Sheet 2: 部门汇总 ==========
    const summaryData = generateDepartmentSummary(auditedData)
    const summarySheet = XLSXStyle.utils.json_to_sheet(summaryData)

    // 应用样式到部门汇总
    applySummarySheetStyles(summarySheet, summaryData.length)

    XLSXStyle.utils.book_append_sheet(workbook, summarySheet, '部门汇总')

    // 下载文件
    const fileName = `用车订单审计结果_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`
    XLSXStyle.writeFile(workbook, fileName)
  }

  // 应用审计结果明细样式
  const applyDetailSheetStyles = (sheet: any, rowCount: number) => {
    const range = XLSXStyle.utils.decode_range(sheet['!ref'] || 'A1')

    // 设置列宽
    sheet['!cols'] = [
      { wch: 12 },  // 下单人姓名
      { wch: 18 },  // 开始计费时间
      { wch: 25 },  // 实际出发地
      { wch: 25 },  // 实际目的地
      { wch: 15 },  // 企业实付金额
      { wch: 30 },  // 补充说明
      { wch: 15 },  // 用车类型
      { wch: 35 }   // 审计结果
    ]

    // 表头样式
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSXStyle.utils.encode_cell({ r: 0, c: C })

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
        const cellAddress = XLSXStyle.utils.encode_cell({ r: R, c: C })

        if (!sheet[cellAddress]) continue

        const headerCell = XLSXStyle.utils.encode_cell({ r: 0, c: C })
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

  // 应用部门汇总样式
  const applySummarySheetStyles = (sheet: any, rowCount: number) => {
    const range = XLSXStyle.utils.decode_range(sheet['!ref'] || 'A1')

    // 设置列宽
    sheet['!cols'] = [
      { wch: 15 },  // 账期
      { wch: 20 },  // 部门名称
      { wch: 20 }   // 企业实付金额汇总
    ]

    // 表头样式
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = XLSXStyle.utils.encode_cell({ r: 0, c: C })

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
        const cellAddress = XLSXStyle.utils.encode_cell({ r: R, c: C })

        if (!sheet[cellAddress]) continue

        const headerCell = XLSXStyle.utils.encode_cell({ r: 0, c: C })
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

        sheet[cellAddress].s = cellStyle
      }
    }
  }

  // 生成部门汇总数据
  const generateDepartmentSummary = (data: any[]) => {
    // 按账期和部门分组汇总
    const summaryMap = new Map<string, { 账期: string; 部门名称: string; 企业实付金额汇总: number }>()

    data.forEach(row => {
      // 提取账期(从开始计费时间提取年月)
      const billingTime = row['开始计费时间'] || ''
      let accountPeriod = ''

      if (billingTime) {
        const dateMatch = billingTime.match(/(\d{4})[年/-](\d{1,2})/)
        if (dateMatch) {
          accountPeriod = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}`
        }
      }

      // 提取部门名称(从下单人姓名或补充说明中提取,这里简化处理)
      // 实际应用中可能需要从其他字段获取部门信息
      const department = extractDepartment(row) || '未分配部门'

      // 企业实付金额
      const amount = parseFloat(row['企业实付金额']) || 0

      // 生成唯一键
      const key = `${accountPeriod}_${department}`

      if (summaryMap.has(key)) {
        const existing = summaryMap.get(key)!
        existing.企业实付金额汇总 += amount
      } else {
        summaryMap.set(key, {
          账期: accountPeriod || '未知账期',
          部门名称: department,
          企业实付金额汇总: amount
        })
      }
    })

    // 转换为数组并排序
    const summaryArray = Array.from(summaryMap.values())
    summaryArray.sort((a, b) => {
      // 先按账期排序,再按部门排序
      if (a.账期 !== b.账期) {
        return a.账期.localeCompare(b.账期)
      }
      return a.部门名称.localeCompare(b.部门名称)
    })

    return summaryArray
  }

  // 提取部门名称
  const extractDepartment = (row: any): string => {
    // 优先从"部门名称"列获取
    if (row['部门名称']) {
      return row['部门名称']
    }

    // 如果没有"部门名称"列,尝试从其他可能的列名获取
    if (row['部门']) {
      return row['部门']
    }

    if (row['所属部门']) {
      return row['所属部门']
    }

    // 如果都没有,返回默认值
    return '未分配部门'
  }

  // 查看风险报告(从结果表格点击)
  const handleViewReport = () => {
    if (reportData) {
      setActiveSection('risk-report')
    } else {
      alert('请先执行AI一键分析')
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {/* 用车订单审计 */}
        <div
          id="car-audit"
          className={`content-section ${activeSection === 'car-audit' ? 'active' : ''}`}
        >
          <h2 className="text-3xl font-bold mb-2">用车订单审计</h2>
          <p className="text-slate-500 mb-8">
            上传网约车账单Excel文件，执行规则审计或AI一键分析，生成审计结果和风险报告。
          </p>

          <StatsCards stats={stats} />

          <UploadSection
            onUpload={handleUpload}
            onRuleAudit={handleRuleAudit}
            onAIAnalyze={handleAIAnalyze}
            hasFile={uploadedFile !== null}
            hasData={auditedData.length > 0}
          />

          <ResultsTable
            data={auditedData}
            onDownload={handleDownload}
            onGenerateReport={handleViewReport}
          />
        </div>

        {/* 风险报告 */}
        <div
          id="risk-report"
          className={`content-section ${activeSection === 'risk-report' ? 'active' : ''}`}
        >
          <h2 className="text-3xl font-bold mb-2">风险报告</h2>
          <p className="text-slate-500 mb-8">
            基于AI分析的用车订单风险评估报告
          </p>

          {reportData ? (
            <RiskReport data={reportData} />
          ) : (
            <div className="bg-white p-12 rounded-xl shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-600 mb-2">暂无风险报告</h3>
              <p className="text-slate-500 mb-6">
                请先在"用车订单审计"页面上传文件并执行"AI一键分析"
              </p>
              <button
                onClick={() => setActiveSection('car-audit')}
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                前往审计页面
              </button>
            </div>
          )}
        </div>

        {/* 审计规则设置 */}
        <div
          id="rules-settings"
          className={`content-section ${activeSection === 'rules-settings' ? 'active' : ''}`}
        >
          <RulesSettings />
        </div>
      </main>
    </div>
  )
}

