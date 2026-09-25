import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'شاركنا رأيك',
  description: 'ساعدنا نتطور — ابعتلنا اقتراحاتك لتطوير منصة ملاك مدينة العبور الجديدة.',
  path: '/suggestions',
})

export default function SuggestionsLayout({ children }: { children: ReactNode }) {
  return children
}
