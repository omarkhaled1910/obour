// منطق حساب التقنين للأراضي الصغيرة في الأمل والقادسية وعرابي (الكيلو 48 سابقًا).
// تنبيه: الطلائع ومصر الجديدة لهما آلية تقنين مختلفة، غير مُنفّذة هنا بعد.
//
// تنبيه هام (بعد مراجعة إضافية): هذا الحساب "تقدير تقريبي" فقط، مش بديل عن إخطار توفيق
// الأوضاع/بيان التسوية الرسمي الصادر من جهاز العبور. فيه تعارض غير محسوم بين مصدرين:
//  - نسبة خصم 15% وسعر 1400 جنيه/م²: مأخوذين من مثال حقيقي واحد رآه صاحب المشروع (بيان تسوية فعلي لحالة 450م²).
//  - نسبة خصم 20% (مقابل الطرق): مذكورة كقرار رسمي عام لحائزي الأراضي الصغيرة (أقل من 500م²) داخل العبور والشروق.
// الاثنان لا يصحّان كقاعدة عامة واحدة في نفس الوقت. لذلك الأداة تعرض الاثنين مع توضيح الفرق،
// ولا تفترض أيهما "الصحيح" لكل الحالات. سعر 1400 جنيه/م² نفسه غير مؤكد كسعر موحّد — قد يكون
// حصيلة عدة علاوات (تغيير نشاط، تقنين، مرافق) تُحدَّد لكل حالة على حدة حسب لجان الهيئة.
// الشرائح أدناه (209، 276، 350، 400، 450، 500) مؤكدة من عدة مصادر إخبارية مستقلة تغطي
// قرعات وزارة الإسكان الفعلية لمناطق الأمل/القادسية/الكيلو 48 (راجع almotawwer.com و
// aleqaria.com.eg، بحث سبتمبر 2026). الرقم 325 اللي كان موجود هنا قبل كده اتشال لأنه
// مش ظاهر في أي مصدر رسمي أو إخباري.

export const PLOT_TIERS = [209, 276, 350, 400, 450, 500] as const;

export const PRICE_PER_SQM_ALLOCATED = 1400; // جنيه/م² على المساحة المخصصة (الشريحة) — غير مؤكد كسعر عام، انظر التنبيه أعلاه
export const PRICE_PER_SQM_DIFFERENCE = 750; // جنيه/م² على الفرق بين المساحة المتبقية والشريحة
export const DOWN_PAYMENT_RATE = 0.25; // 25% مقدم
export const ADMIN_FEES_RATE = 0.015; // 1.5% مصاريف إدارية ومجلس أمناء
export const INSTALLMENTS_COUNT = 3;

export type DeductionRate = 0.15 | 0.2;

export interface TanqinInput {
  ownerAreaSqm: number;
  deductionRate: DeductionRate;
  previousPaymentEgp: number; // أي مبلغ سُدد مسبقًا من المقدم
}

export interface TanqinResult {
  areaAfterDeduction: number;
  allocatedTier: number | null;
  differenceSqm: number;
  landPriceEgp: number;
  differenceValueEgp: number;
  downPaymentEgp: number;
  remainingDownPaymentEgp: number;
  adminFeesEgp: number;
  dueNowEgp: number;
  remainingAfterDownAndDifferenceEgp: number;
  installmentEgp: number;
}

function closestTierBelowOrEqual(area: number): number | null {
  const eligible = PLOT_TIERS.filter((tier) => tier <= area);
  if (eligible.length === 0) return null;
  return Math.max(...eligible);
}

export function calculateTanqin(input: TanqinInput): TanqinResult {
  const { ownerAreaSqm, deductionRate, previousPaymentEgp } = input;

  const areaAfterDeduction = ownerAreaSqm * (1 - deductionRate);
  const allocatedTier = closestTierBelowOrEqual(areaAfterDeduction);
  const tier = allocatedTier ?? 0;

  const differenceSqm = Math.max(areaAfterDeduction - tier, 0);
  const landPriceEgp = tier * PRICE_PER_SQM_ALLOCATED;
  const differenceValueEgp = differenceSqm * PRICE_PER_SQM_DIFFERENCE;

  const downPaymentEgp = landPriceEgp * DOWN_PAYMENT_RATE;
  const remainingDownPaymentEgp = Math.max(downPaymentEgp - previousPaymentEgp, 0);
  const adminFeesEgp = landPriceEgp * ADMIN_FEES_RATE;
  const dueNowEgp = remainingDownPaymentEgp + adminFeesEgp;

  const remainingPrincipal = landPriceEgp - downPaymentEgp;
  const remainingAfterDownAndDifferenceEgp = remainingPrincipal - differenceValueEgp;
  const installmentEgp = remainingAfterDownAndDifferenceEgp / INSTALLMENTS_COUNT;

  return {
    areaAfterDeduction,
    allocatedTier,
    differenceSqm,
    landPriceEgp,
    differenceValueEgp,
    downPaymentEgp,
    remainingDownPaymentEgp,
    adminFeesEgp,
    dueNowEgp,
    remainingAfterDownAndDifferenceEgp,
    installmentEgp,
  };
}
