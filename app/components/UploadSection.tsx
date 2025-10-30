'use client'

import { useState, useRef } from 'react'

interface UploadSectionProps {
  onUpload: (file: File) => Promise<{ success: boolean; message: string }>
  onRuleAudit: () => Promise<void>
  onAIAnalyze: () => Promise<void>
  hasFile: boolean
  hasData: boolean
}

export default function UploadSection({
  onUpload,
  onRuleAudit,
  onAIAnalyze,
  hasFile,
  hasData
}: UploadSectionProps) {
  const [uploading, setUploading] = useState(false)
  const [auditing, setAuditing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [status, setStatus] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    setFileName(file.name)
    setUploading(true)
    setStatus('<span class="text-sky-600">正在上传文件...</span>')

    const result = await onUpload(file)

    if (result.success) {
      setStatus(`<span class="text-emerald-600">✓ ${result.message}</span>`)
    } else {
      setStatus(`<span class="text-rose-600">✗ ${result.message}</span>`)
      setFileName('')
    }

    setUploading(false)
  }

  const handleRuleAudit = async () => {
    setAuditing(true)
    setStatus('<span class="text-sky-600">正在执行规则审计...</span>')

    try {
      await onRuleAudit()
      setStatus('<span class="text-emerald-600">✓ 规则审计完成</span>')
    } catch (error: any) {
      setStatus(`<span class="text-rose-600">✗ ${error.message}</span>`)
    }

    setAuditing(false)
  }

  const handleAIAnalyze = async () => {
    setAnalyzing(true)
    setStatus('<span class="text-purple-600">正在进行AI分析...</span>')

    try {
      await onAIAnalyze()
      setStatus('<span class="text-emerald-600">✓ AI分析完成,请查看风险报告</span>')
    } catch (error: any) {
      setStatus(`<span class="text-rose-600">✗ ${error.message}</span>`)
    }

    setAnalyzing(false)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-xl font-bold mb-4">上传Excel文件(必须包含"用车订单"sheet)</h3>

      {/* 上传区域 */}
      <div className="flex items-center gap-4 mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="flex-1 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="flex-1 text-left">
              {fileName ? (
                <>
                  <div className="text-sm font-medium text-slate-700">{fileName}</div>
                  <div className="text-xs text-slate-500">点击重新选择文件</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-slate-600">点击选择文件</div>
                  <div className="text-xs text-slate-500">支持 .xlsx, .xls 格式</div>
                </>
              )}
            </div>
            {fileName && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </label>
      </div>

      {/* 审计按钮区域 */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleRuleAudit}
          disabled={!hasFile || auditing || analyzing}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-lg font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {auditing ? '审计中...' : '规则审计'}
        </button>

        <button
          onClick={handleAIAnalyze}
          disabled={!hasData || auditing || analyzing}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-lg font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {analyzing ? 'AI分析中...' : 'AI一键分析'}
        </button>

        <div className="flex-1 text-sm text-slate-500">
          {!hasFile && '请先上传文件'}
          {hasFile && !hasData && '文件已上传,可以执行规则审计'}
          {hasData && '数据已就绪,可以执行AI分析'}
        </div>
      </div>

      {status && (
        <div
          className="mt-4 text-sm p-3 bg-slate-50 rounded-lg"
          dangerouslySetInnerHTML={{ __html: status }}
        />
      )}
    </div>
  )
}

