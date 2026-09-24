"use client";

import { useMemo, useState } from "react";
import { calculateTanqin, DeductionRate } from "@/lib/tanqin";

function egp(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} جنيه`;
}

function sqm(n: number) {
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })} م²`;
}

export default function CalculatorPage() {
  const [area, setArea] = useState<string>("450");
  const [deductionRate, setDeductionRate] = useState<DeductionRate>(0.15);
  const [previousPayment, setPreviousPayment] = useState<string>("0");

  const parsedArea = Number(area) || 0;
  const parsedPrevious = Number(previousPayment) || 0;

  const result = useMemo(
    () =>
      calculateTanqin({
        ownerAreaSqm: parsedArea,
        deductionRate,
        previousPaymentEgp: parsedPrevious,
      }),
    [parsedArea, deductionRate, parsedPrevious]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-emerald-800 mb-2">حاسبة تقنين الأراضي الصغيرة</h1>
      <p className="text-sm text-stone-600 mb-4">
        خاصة بأراضي الأمل والقادسية وعرابي (الكيلو 48 سابقًا). هذه نسخة تجريبية أولى، ومش
        منطبقة على الطلائع ومصر الجديدة اللي ليهم آلية تقنين مختلفة.
      </p>

      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 text-sm text-amber-900">
        <p className="font-bold mb-1">⚠ الناتج تقدير تقريبي فقط، مش بديل عن بيان التسوية الرسمي</p>
        <p className="mb-2">
          الرقم الفعلي المستحق عليك يحدده إخطار توفيق الأوضاع الصادر من جهاز العبور، ويعتمد على
          عوامل الأداة دي لسه ما بتاخدهاش في الاعتبار: هل الطلب فردي أم عبر جمعية/مجموعة، اسم
          الحي والمنطقة بالتحديد، نوع النشاط، وتاريخ تقديم ملف التقنين.
        </p>
        <p>
          فيه تعارض بين مصدرين حول نسبة الخصم وسعر المتر — موضّح تحت كل حقل. اختر النسبة اللي
          تطابق حالتك الفعلية لو عارفها، أو جرّب الاثنين للمقارنة.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            مساحة الأرض الأصلية (م²)
          </label>
          <input
            type="number"
            min={0}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">نسبة الخصم</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={deductionRate === 0.15}
                onChange={() => setDeductionRate(0.15)}
              />
              15% — من مثال حقيقي واحد (بيان تسوية فعلي) رآه صاحب المشروع
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={deductionRate === 0.2}
                onChange={() => setDeductionRate(0.2)}
              />
              20% — نسبة خصم الطرق المذكورة في قرار عام لحائزي الأراضي الأقل من 500م²
            </label>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            المصدران غير متفقين على نسبة موحدة لكل الحالات — استخدم بيان التسوية الخاص بك لو
            متاح لمعرفة النسبة الصحيحة لحالتك.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            مبلغ مسدد مسبقًا من المقدم (اختياري، جنيه)
          </label>
          <input
            type="number"
            min={0}
            value={previousPayment}
            onChange={(e) => setPreviousPayment(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h2 className="font-bold text-emerald-900 mb-4">النتيجة</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <Row label="المساحة بعد الخصم" value={sqm(result.areaAfterDeduction)} />
          <Row
            label="الشريحة المخصصة"
            value={result.allocatedTier ? sqm(result.allocatedTier) : "لا توجد شريحة مناسبة"}
          />
          <Row label="الفرق للمالك" value={sqm(result.differenceSqm)} />
          <Row
            label="سعر الأرض (على أساس 1,400 جنيه/م² — سعر غير مؤكد كرقم عام، انظر التنبيه أعلاه)"
            value={egp(result.landPriceEgp)}
          />
          <Row label="قيمة الفرق (تُخصم لصالح المالك)" value={egp(result.differenceValueEgp)} />
          <Row label="المقدم (25%)" value={egp(result.downPaymentEgp)} />
          <Row label="مصاريف إدارية (1.5%)" value={egp(result.adminFeesEgp)} />
          <Row label="المطلوب سداده فورًا" value={egp(result.dueNowEgp)} highlight />
          <Row
            label="المتبقي بعد خصم الفرق (على 3 أقساط)"
            value={egp(result.remainingAfterDownAndDifferenceEgp)}
          />
          <Row label="قيمة القسط السنوي" value={egp(result.installmentEgp)} highlight />
        </dl>
      </div>

      <p className="mt-4 text-xs text-stone-500">
        تجربة: أدخل 450 م² مع دفعة سابقة 100,000 جنيه — المفروض تحصل بالظبط على «29,850 جنيه»
        مطلوبة فورًا و«114,375 جنيه» لكل قسط، مطابقة للمثال الرسمي في خطة المشروع.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <dt className="text-stone-600">{label}</dt>
      <dd className={highlight ? "font-bold text-emerald-800" : "text-stone-900"}>{value}</dd>
    </div>
  );
}
