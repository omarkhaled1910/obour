"use client";

import { useMemo, useState } from "react";
import { calculateTanqinInKind, type InKindSystem } from "@/lib/tanqinInKind";

function egp(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} جنيه`;
}

function feddan(n: number) {
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} فدان`;
}

function sqm(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} م²`;
}

const SYSTEMS: { key: InKindSystem; label: string; description: string }[] = [
  {
    key: "group",
    label: "تقنين وسط مجموعة",
    description: "بتحتفظ بـ 50% من أرضك، من غير أي رسوم إدارية",
  },
  {
    key: "individualLarge",
    label: "فردي — مساحة أكبر من 5 فدان",
    description: "بتحتفظ بـ 35% من أرضك، وعليها رسوم إدارية طفيفة",
  },
  {
    key: "individualSmall",
    label: "فردي — مساحة أقل من 5 فدان",
    description: "بتحتفظ بـ 25% من أرضك، وعليها رسوم إدارية طفيفة",
  },
];

export default function CalculatorInKindPage() {
  const [area, setArea] = useState<string>("10");
  const [system, setSystem] = useState<InKindSystem>("group");

  const parsedArea = Number(area) || 0;

  const result = useMemo(
    () => calculateTanqinInKind({ ownerAreaFeddan: parsedArea, system }),
    [parsedArea, system]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-emerald-800 mb-2">حاسبة تقنين الأراضي الكبيرة (عيني)</h1>
      <p className="text-sm text-stone-600 mb-4">
        خاصة بأراضي الطلائع ومصر الجديدة (وأجزاء من عرابي). هذه نسخة تجريبية أولى.
      </p>

      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 text-sm text-amber-900">
        <p className="font-bold mb-1">⚠ الناتج تقدير تقريبي فقط، مش بديل عن بيان التسوية الرسمي</p>
        <p>
          هنا التقنين &quot;عيني&quot; — يعني بتاخد جزء من أرضك فعليًا بدل ما تدفع فلوس، والنسبة اللي
          بتحتفظ بيها بتختلف حسب نظام التقنين اللي هتختاره.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            مساحة الأرض الأصلية (بالفدان)
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
          <label className="block text-sm font-medium text-stone-700 mb-1">نظام التقنين</label>
          <div className="flex flex-col gap-2">
            {SYSTEMS.map((s) => (
              <label key={s.key} className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  className="mt-1"
                  checked={system === s.key}
                  onChange={() => setSystem(s.key)}
                />
                <span>
                  <span className="font-medium">{s.label}</span>
                  <span className="block text-stone-500">{s.description}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h2 className="font-bold text-emerald-900 mb-4">النتيجة</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
          <Row label="مساحة أرضك الأصلية" value={feddan(parsedArea)} />
          <Row
            label="المساحة اللي هتفضل ليك"
            value={`${feddan(result.retainedAreaFeddan)} (${sqm(result.retainedAreaSqm)})`}
            highlight
          />
          <Row label="المساحة اللي بتروح لقطع الخدمات" value={feddan(result.deductedAreaFeddan)} />
          <Row
            label="الرسوم الإدارية"
            value={result.adminFeesEgp > 0 ? egp(result.adminFeesEgp) : "من غير رسوم"}
            highlight={result.adminFeesEgp > 0}
          />
        </dl>
      </div>
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
