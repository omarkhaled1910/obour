import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'الرسومات الهندسية وتراخيص البناء',
  description:
    'اطلب تصميم هندسي أو رسومات هندسية واستصدار رخصة بناء لقطعتك في مدينة العبور الجديدة.',
  path: '/licensing',
  keywords: ['ترخيص بناء العبور الجديدة', 'تصميم هندسي', 'رسومات هندسية معتمدة'],
})

export default function LicensingLayout({ children }: { children: ReactNode }) {
  return children
}
