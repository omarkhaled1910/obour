import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'تسجيل حساب جديد',
  description: 'أنشئ حسابك في منصة ملاك مدينة العبور الجديدة.',
  path: '/signup',
  noIndex: true,
})

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children
}
