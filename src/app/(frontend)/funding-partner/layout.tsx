import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'الشريك الممول للأراضي والمباني',
  description:
    'قدم طلب البحث عن شريك لتمويل رسوم تقنين أرضك أو تنفيذ المباني في مدينة العبور الجديدة.',
  path: '/funding-partner',
  keywords: ['شريك ممول عقاري', 'تمويل تقنين الأراضي', 'تمويل بناء'],
})

export default function FundingPartnerLayout({ children }: { children: ReactNode }) {
  return children
}
