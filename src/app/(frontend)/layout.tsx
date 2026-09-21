import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import React from 'react'

import { Sidebar } from '@/components/Sidebar'

import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        <Sidebar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
          نسخة أولى تجريبية (MVP) — منصة ملاك مدينة العبور الجديدة
        </footer>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'منصة ملاك مدينة العبور الجديدة',
  description: 'متابعة تقنين الأرض، حساب المستحقات، وتسجيل بياناتك كمالك في العبور الجديدة',
}
