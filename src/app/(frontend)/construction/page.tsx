"use client";

import { useEffect, useState } from "react";
import { FileInput } from "@/components/FileInput";
import {
  submitConstructionRequest,
  uploadFilesAction,
  type UploadedMedia,
} from "@/actions/submissions";

type Step = "documents" | "work" | "contact";

export default function ConstructionPage() {
  const [step, setStep] = useState<Step>("documents");

  const [allocationNoticeUrls, setAllocationNoticeUrls] = useState<UploadedMedia[]>([]);
  const [receiptMinutesUrls, setReceiptMinutesUrls] = useState<UploadedMedia[]>([]);
  const [licensePhotoUrls, setLicensePhotoUrls] = useState<UploadedMedia[]>([]);
  const [setbackLetterUrls, setSetbackLetterUrls] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  const [workDescription, setWorkDescription] = useState("");
  const [workError, setWorkError] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) setStep("documents");
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function uploadFiles(files: FileList, field: string): Promise<UploadedMedia[]> {
    setUploading(field);
    setUploadError("");
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const result = await uploadFilesAction(formData);
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "تعذّر رفع الملف");
      return [];
    } finally {
      setUploading(null);
    }
  }

  function handleContinueFromWork() {
    if (!workDescription) {
      setWorkError("من فضلك اكتب وصف الإنشاءات المراد تنفيذها");
      return;
    }
    setWorkError("");
    setStep("contact");
  }

  function handleContinueFromContact() {
    if (!contactName || !contactPhone) {
      setContactError("من فضلك اكتب الاسم ورقم الهاتف");
      return;
    }
    setContactError("");
    handleSubmit();
  }

  async function handleSubmit() {
    setStatus("saving");
    setSubmitError("");
    try {
      const result = await submitConstructionRequest({
        allocationNotices: allocationNoticeUrls.map((file) => file.id),
        receiptMinutes: receiptMinutesUrls.map((file) => file.id),
        licenseDocuments: licensePhotoUrls.map((file) => file.id),
        setbackLetters: setbackLetterUrls.map((file) => file.id),
        workDescription,
        contactName,
        contactPhone,
        contactEmail: contactEmail || undefined,
      });
      if (!result.success) throw new Error(result.error);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-block bg-[#7c2d3a]/40 border border-[#a83c4f]/70 text-[#f4c9d2] text-xs font-bold px-3 py-1 rounded-full mb-3">
            مدن الجيل الرابع الذكية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">تنفيذ المباني</h1>
          <p className="text-emerald-200">اطلب تنفيذ الإنشاءات المطلوبة لأرضك</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Stepper step={step} />

        {step === "documents" && (
          <div>
            <h2 className="font-bold text-stone-900 mb-1">مستندات القطعة</h2>
            <p className="text-sm text-stone-600 mb-5">ارفع المستندات المتاحة لديك (كلها اختيارية)</p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <UploadField
                label="إخطار التخصيص"
                uploading={uploading === "allocation"}
                urls={allocationNoticeUrls}
                onSelect={async (files) => {
                  const urls = await uploadFiles(files, "allocation");
                  setAllocationNoticeUrls((prev) => [...prev, ...urls]);
                }}
              />
              <UploadField
                label="محضر استلام الأرض"
                uploading={uploading === "receipt"}
                urls={receiptMinutesUrls}
                onSelect={async (files) => {
                  const urls = await uploadFiles(files, "receipt");
                  setReceiptMinutesUrls((prev) => [...prev, ...urls]);
                }}
              />
              <UploadField
                label="صورة الترخيص"
                uploading={uploading === "license"}
                urls={licensePhotoUrls}
                onSelect={async (files) => {
                  const urls = await uploadFiles(files, "license");
                  setLicensePhotoUrls((prev) => [...prev, ...urls]);
                }}
              />
              <UploadField
                label="خطاب إبعاد الأرض"
                uploading={uploading === "setback"}
                urls={setbackLetterUrls}
                onSelect={async (files) => {
                  const urls = await uploadFiles(files, "setback");
                  setSetbackLetterUrls((prev) => [...prev, ...urls]);
                }}
              />
            </div>

            {uploadError && <p className="text-red-600 text-sm mt-3">{uploadError}</p>}

            <button
              onClick={() => setStep("work")}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "work" && (
          <div>
            <button
              onClick={() => setStep("documents")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع للمستندات
            </button>
            <h2 className="font-bold text-stone-900 mb-1">الإنشاءات المراد تنفيذها</h2>
            <p className="text-sm text-stone-600 mb-5">
              اكتب وصف تفصيلي لللي عاوز تنفّذه (مثال: بناء عظم فيلا 3 أدوار، تشطيب داخلي، سور
              خارجي...)
            </p>

            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {workError && <p className="text-red-600 text-sm mt-3">{workError}</p>}

            <button
              onClick={handleContinueFromWork}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "contact" && (
          <div>
            <button
              onClick={() => setStep("work")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع للإنشاءات المطلوبة
            </button>
            <h2 className="font-bold text-stone-900 mb-1">بيانات التواصل</h2>
            <p className="text-sm text-stone-600 mb-5">إزاي نقدر نتواصل معاك؟</p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <Field label="الاسم بالكامل" required>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>
              <Field label="رقم الهاتف" required>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>
              <Field label="البريد الإلكتروني (اختياري)">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900 mt-5">
              تقدير التكلفة أو دراسة الجدوى السعرية للمطلوب هيتحدد بعد مراجعة فريقنا الهندسي
              لطلبك، وهنتواصل معاك بالتفاصيل بمجرد المراجعة.
            </div>

            {contactError && <p className="text-red-600 text-sm mt-3">{contactError}</p>}

            <button
              onClick={handleContinueFromContact}
              disabled={status === "saving"}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800 disabled:opacity-60"
            >
              {status === "saving" ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>

            {status === "done" && (
              <p className="text-emerald-700 text-sm text-center mt-3">
                تم إرسال طلبك بنجاح، هنتواصل معاك قريبًا.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 text-sm text-center mt-3">{submitError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "documents", label: "المستندات" },
    { key: "work", label: "الإنشاءات المطلوبة" },
    { key: "contact", label: "بيانات التواصل" },
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm flex-wrap">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full font-bold ${
              i <= activeIndex ? "bg-emerald-700 text-white" : "bg-stone-200 text-stone-500"
            }`}
          >
            {i + 1}
          </span>
          <span className={i <= activeIndex ? "text-emerald-800 font-medium" : "text-stone-400"}>
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="w-8 h-px bg-stone-300 mx-1" />}
        </div>
      ))}
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

function UploadField({
  label,
  uploading,
  urls,
  onSelect,
}: {
  label: string;
  uploading: boolean;
  urls: UploadedMedia[];
  onSelect: (files: FileList) => void;
}) {
  return (
    <Field label={`${label} (اختياري)`}>
      <FileInput disabled={uploading} onFilesSelected={onSelect} />
      {uploading && <p className="text-xs text-emerald-700 mt-1">جاري الرفع...</p>}
      {urls.length > 0 && (
        <p className="text-xs text-stone-500 mt-1">تم رفع {urls.length} ملف/ملفات</p>
      )}
    </Field>
  );
}
