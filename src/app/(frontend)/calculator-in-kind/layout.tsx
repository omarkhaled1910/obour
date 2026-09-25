import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { createPageMetadata } from '@/utilities/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'حاسبة تقنين الأراضي الكبيرة (عيني)',
  description:
    'احسب المساحة اللي هتفضل ليك بعد تقنين أرضك عينيًا في الطلائع ومصر الجديدة، حسب نظام التقنين (مجموعة أو فردي).',
  path: '/calculator-in-kind',
  keywords: ['تقنين عيني العبور الجديدة', 'تقنين الطلائع', 'تقنين مصر الجديدة'],
})

export default function CalculatorInKindLayout({ children }: { children: ReactNode }) {
  return children
}
