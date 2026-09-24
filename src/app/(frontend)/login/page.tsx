"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logInMember } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) {
      setStatus("error");
      setErrorMsg("من فضلك اكتب رقم الهاتف وكلمة السر");
      return;
    }
    setStatus("saving");
    setErrorMsg("");
    try {
      const result = await logInMember({ phone, password });
      if (!result.success) throw new Error(result.error);
      router.push("/account");
      router.refresh();
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
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">تسجيل الدخول</h1>
          <p className="text-emerald-200">ادخل على حسابك في منصة ملاك مدينة العبور الجديدة</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded-xl p-6 space-y-4"
        >
          <Field label="رقم الهاتف" required>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
            />
          </Field>

          <Field label="كلمة السر" required>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
            />
          </Field>

          {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="w-full rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800 disabled:opacity-60"
          >
            {status === "saving" ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>

          <p className="text-sm text-stone-600 text-center">
            لسه معملتش حساب؟{" "}
            <Link href="/signup" className="text-emerald-700 font-medium hover:underline">
              سجّل حساب جديد
            </Link>
          </p>
        </form>
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
