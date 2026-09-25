import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تجربة محاكاة تقنين الأرض',
  description: 'اختار وحدة قياس مساحة أرضك ونوع التقنين عشان نوديك لحاسبة تقنين الأرض المناسبة لحالتك.',
  path: '/calculator-select',
  noIndex: true,
})

export default function CalculatorSelectLayout({ children }: { children: ReactNode }) {
  return children
}
