import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'حسابي',
  description: 'صفحة حسابك في منصة ملاك مدينة العبور الجديدة.',
  path: '/account',
  noIndex: true,
})

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children
}
