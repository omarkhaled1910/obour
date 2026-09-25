"use client";

import { useState } from "react";
import { submitSuggestion } from "@/actions/submissions";

export default function SuggestionsPage() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message) {
      setStatus("error");
      setErrorMsg("من فضلك اكتب اقتراحك");
      return;
    }
    setStatus("saving");
    setErrorMsg("");
    try {
      const result = await submitSuggestion({
        message,
        name: name || undefined,
        contact: contact || undefined,
      });
      if (!result.success) throw new Error(result.error);
      setStatus("done");
      setMessage("");
      setName("");
      setContact("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-block bg-[#7c2d3a]/40 border border-[#a83c4f]/70 text-[#f4c9d2] text-xs font-bold px-3 py-1 rounded-full mb-3">
            مدن الجيل الرابع الذكية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">شاركنا رأيك</h1>
          <p className="text-emerald-200">اقتراحاتكم بتساعدنا نطوّر المنصة</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        {status === "done" ? (
          <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
            <p className="text-emerald-700 font-bold mb-1">تم إرسال اقتراحك بنجاح</p>
            <p className="text-sm text-stone-600">شكرًا لمساعدتك في تطوير المنصة.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-stone-200 rounded-xl p-6 space-y-4"
          >
            <Field label="اقتراحك" required>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </Field>

            <Field label="الاسم (اختياري)">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </Field>

            <Field label="وسيلة تواصل (اختياري)">
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="رقم هاتف أو بريد إلكتروني"
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </Field>

            {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800 disabled:opacity-60"
            >
              {status === "saving" ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
