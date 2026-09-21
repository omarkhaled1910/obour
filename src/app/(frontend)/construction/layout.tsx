import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تنفيذ المباني والإنشاءات',
  description:
    'قدم طلب تنفيذ مبانٍ أو إنشاءات على أرضك في مدينة العبور الجديدة واحصل على مراجعة وتقدير من الفريق الهندسي.',
  path: '/construction',
  keywords: ['مقاولات العبور الجديدة', 'بناء فيلا', 'تنفيذ مباني'],
})

export default function ConstructionLayout({ children }: { children: ReactNode }) {
  return children
}
