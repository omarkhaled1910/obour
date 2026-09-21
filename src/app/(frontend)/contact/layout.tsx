import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تواصل معنا',
  description: 'تواصل مع فريق منصة ملاك مدينة العبور الجديدة.',
  path: '/contact',
  noIndex: true,
})

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
