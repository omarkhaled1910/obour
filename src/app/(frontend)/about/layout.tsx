import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'من نحن',
  description:
    'تعرف على مجموعة ملاك الأراضي والمهندسين والمقاولين ورجال القانون القائمين على منصة ملاك مدينة العبور الجديدة.',
  path: '/about',
  keywords: ['منصة ملاك العبور الجديدة', 'جمعيات العبور الجديدة'],
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
