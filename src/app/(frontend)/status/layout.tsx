import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'متابعة الطلب',
  description: 'تابع حالة طلبك على منصة ملاك مدينة العبور الجديدة.',
  path: '/status',
  noIndex: true,
})

export default function StatusLayout({ children }: { children: ReactNode }) {
  return children
}
