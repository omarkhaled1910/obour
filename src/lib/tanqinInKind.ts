// منطق حساب التقنين "العيني" للأراضي الكبيرة في الطلائع ومصر الجديدة (وأجزاء من عرابي).
// بعكس تقنين الأمل/القادسية (النقدي — راجع tanqin.ts)، هنا المالك بياخد مساحة من أرضه
// فعليًا بدل ما يدفع فلوس، والنسبة اللي بيحتفظ بيها بتختلف حسب نظام التقنين المختار.
//
// النسب والرسوم دي منقولة من صاحب المشروع مباشرة، مفيش مصدر رسمي منشور اتأكدنا منه لسه:
//  - مجموعة: المالك بيحتفظ بـ 50% من أرضه، من غير أي رسوم إدارية.
//  - فردي (مساحة أكبر من 5 فدان): المالك بيحتفظ بـ 35% بس، وعليه رسوم إدارية طفيفة.
//  - فردي (مساحة أقل من 5 فدان): المالك بيحتفظ بـ 25% بس، وعليه رسوم إدارية طفيفة.
// الرسوم الإدارية بتتحسب بنفس أسلوب حاسبة الأمل (1.5% من قيمة المساحة المتبقية على أساس
// 1,400 جنيه/م²) — نفس الثابتين من tanqin.ts.

import { ADMIN_FEES_RATE, PRICE_PER_SQM_ALLOCATED, SQM_PER_FEDDAN } from './tanqin'

export type InKindSystem = 'group' | 'individualLarge' | 'individualSmall'

export const IN_KIND_RETAIN_RATE: Record<InKindSystem, number> = {
  group: 0.5,
  individualLarge: 0.35,
  individualSmall: 0.25,
}

export interface TanqinInKindInput {
  ownerAreaFeddan: number
  system: InKindSystem
}

export interface TanqinInKindResult {
  ownerAreaSqm: number
  retainRate: number
  retainedAreaFeddan: number
  retainedAreaSqm: number
  deductedAreaFeddan: number
  adminFeesEgp: number
}

export function calculateTanqinInKind(input: TanqinInKindInput): TanqinInKindResult {
  const { ownerAreaFeddan, system } = input

  const ownerAreaSqm = ownerAreaFeddan * SQM_PER_FEDDAN
  const retainRate = IN_KIND_RETAIN_RATE[system]
  const retainedAreaSqm = ownerAreaSqm * retainRate
  const retainedAreaFeddan = retainedAreaSqm / SQM_PER_FEDDAN
  const deductedAreaFeddan = ownerAreaFeddan - retainedAreaFeddan

  const adminFeesEgp =
    system === 'group' ? 0 : retainedAreaSqm * PRICE_PER_SQM_ALLOCATED * ADMIN_FEES_RATE

  return {
    ownerAreaSqm,
    retainRate,
    retainedAreaFeddan,
    retainedAreaSqm,
    deductedAreaFeddan,
    adminFeesEgp,
  }
}
