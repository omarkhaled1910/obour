import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تقنين ملكية الأراضي',
  description:
    'سجل بيانات أرضك وابدأ إجراءات تقنين الملكية في جمعيات مدينة العبور الجديدة مع رفع مستندات الملكية وخرائط المساحة.',
  path: '/register',
  keywords: ['تقنين ملكية الأراضي', 'تسجيل ملاك العبور الجديدة', 'مستندات تقنين الأراضي'],
})

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children
}
