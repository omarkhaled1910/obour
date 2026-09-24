import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تسجيل الدخول',
  description: 'ادخل على حسابك في منصة ملاك مدينة العبور الجديدة.',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}
