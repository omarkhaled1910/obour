"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "unit" | "type";

export default function CalculatorSelectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("unit");

  return (
    <div>
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-block bg-[#7c2d3a]/40 border border-[#a83c4f]/70 text-[#f4c9d2] text-xs font-bold px-3 py-1 rounded-full mb-3">
            مدن الجيل الرابع الذكية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">تجربة محاكاة تقنين الأرض</h1>
          <p className="text-emerald-200">هنساعدك توصل للحاسبة المناسبة لمساحة أرضك</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {step === "unit" && (
          <div>
            <h2 className="font-bold text-stone-900 mb-1">مساحة أرضك بالمتر ولا بالفدان؟</h2>
            <p className="text-sm text-stone-600 mb-5">
              المساحات الصغيرة (بالمتر) ليها تقنين نقدي بس، والمساحات الكبيرة (بالفدان) ممكن
              تكون عيني أو نقدي
            </p>
            <div className="grid gap-4">
              <button
                onClick={() => router.push("/calculator")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="font-bold text-emerald-800 mb-1">بالمتر (مساحة صغيرة)</div>
                <div className="text-sm text-stone-500">هتودّيك لحاسبة التقنين النقدي</div>
              </button>
              <button
                onClick={() => setStep("type")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="font-bold text-emerald-800 mb-1">بالفدان (مساحة كبيرة)</div>
                <div className="text-sm text-stone-500">هنسألك بعد كده نوع التقنين عندك</div>
              </button>
            </div>
          </div>
        )}

        {step === "type" && (
          <div>
            <button
              onClick={() => setStep("unit")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع
            </button>
            <h2 className="font-bold text-stone-900 mb-1">نوع التقنين عندك عيني ولا نقدي؟</h2>
            <p className="text-sm text-stone-600 mb-5">
              اختار النوع المطابق لحالتك، لو مش عارف اسأل ممثل الجمعية بتاعتك
            </p>
            <div className="grid gap-4">
              <button
                onClick={() => router.push("/calculator-in-kind")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="font-bold text-emerald-800 mb-1">عيني</div>
                <div className="text-sm text-stone-500">
                  هتاخد جزء من أرضك فعليًا (مجموعة أو فردي)
                </div>
              </button>
              <button
                onClick={() => router.push("/calculator")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="font-bold text-emerald-800 mb-1">نقدي</div>
                <div className="text-sm text-stone-500">
                  هتدفع فلوس مقابل تقنين أرضك — الحاسبة دي معايرة على أراضي صغيرة، للمساحات
                  الكبيرة الرقم تقديري جدًا
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
