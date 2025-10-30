import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '用车订单审计系统',
  description: '基于Web的用车订单审计系统，支持Excel文件上传、自动审计和结果下载',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 text-slate-800" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}

