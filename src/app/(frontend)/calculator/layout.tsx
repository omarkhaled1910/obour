import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'حاسبة تقنين الأراضي',
  description:
    'احسب تقدير مستحقات تقنين أرضك والأقساط السنوية في مدينة العبور الجديدة حسب المساحة ونسبة الخصم والدفعات السابقة.',
  path: '/calculator',
  keywords: ['حاسبة تقنين الأراضي', 'حساب رسوم التقنين', 'أقساط تقنين الأرض'],
})

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return children
}
