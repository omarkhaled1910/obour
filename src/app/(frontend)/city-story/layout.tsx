import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'مدينة العبور الجديدة',
  description:
    'تعرف على قصة مدينة العبور الجديدة وموقعها وتخطيطها وأنماط السكن والمرافق والخدمات المنتظرة في المدينة.',
  path: '/city-story',
  keywords: ['خريطة مدينة العبور الجديدة', 'أحياء العبور الجديدة', 'مرافق العبور الجديدة'],
})

export default function CityStoryLayout({ children }: { children: ReactNode }) {
  return children
}
