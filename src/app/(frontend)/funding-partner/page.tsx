"use client";

import { useState } from "react";
import { FileInput } from "@/components/FileInput";
import {
  submitFundingPartnerRequest,
  uploadFilesAction,
  type UploadedMedia,
} from "@/actions/submissions";

type OwnershipStatus = "اسم على صفحة الجهاز" | "إخطار تخصيص";
type PartnershipType =
  | "شراكة برسوم التقنين"
  | "شراكة برسوم التقنين والمباني"
  | "شراكة بالمباني فقط";

type Step = "status" | "docs" | "jihazDetails" | "partnership" | "contact";

const PARTNERSHIP_OPTIONS: PartnershipType[] = [
  "شراكة برسوم التقنين",
  "شراكة برسوم التقنين والمباني",
  "شراكة بالمباني فقط",
];

export default function FundingPartnerPage() {
  const [step, setStep] = useState<Step>("status");
  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus | null>(null);

  const [allocationNoticeUrls, setAllocationNoticeUrls] = useState<UploadedMedia[]>([]);
  const [receiptMinutesUrls, setReceiptMinutesUrls] = useState<UploadedMedia[]>([]);
  const [licensePhotoUrls, setLicensePhotoUrls] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [docsError, setDocsError] = useState("");

  const [landAreaSqm, setLandAreaSqm] = useState("");
  const [tanqinSeriousnessPaid, setTanqinSeriousnessPaid] = useState<boolean | null>(null);
  const [jihazError, setJihazError] = useState("");

  const [partnershipType, setPartnershipType] = useState<PartnershipType | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactError, setContactError] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

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

  function pickOwnershipStatus(s: OwnershipStatus) {
    setOwnershipStatus(s);
    setStep(s === "إخطار تخصيص" ? "docs" : "jihazDetails");
  }

  function handleContinueFromDocs() {
    const hasAnyDoc =
      allocationNoticeUrls.length > 0 || receiptMinutesUrls.length > 0 || licensePhotoUrls.length > 0;
    if (!hasAnyDoc) {
      setDocsError("ارفع مستند واحد على الأقل من الثلاثة");
      return;
    }
    setDocsError("");
    setStep("partnership");
  }

  function handleContinueFromJihazDetails() {
    if (!landAreaSqm || tanqinSeriousnessPaid === null) {
      setJihazError("اكتب مساحة الأرض وحدّد هل تم تسديد جدية التقنين ولا لأ");
      return;
    }
    setJihazError("");
    setStep("partnership");
  }

  function handleBackFromPartnership() {
    setStep(ownershipStatus === "إخطار تخصيص" ? "docs" : "jihazDetails");
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
      if (!ownershipStatus || !partnershipType) {
        throw new Error("من فضلك أكمل كل الخطوات المطلوبة");
      }
      const result = await submitFundingPartnerRequest({
        ownershipStatus,
        allocationNotices: allocationNoticeUrls.map((file) => file.id),
        receiptMinutes: receiptMinutesUrls.map((file) => file.id),
        licenseDocuments: licensePhotoUrls.map((file) => file.id),
        landAreaSqm: landAreaSqm || undefined,
        tanqinSeriousnessPaid: tanqinSeriousnessPaid ?? undefined,
        partnershipType,
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
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">الشريك الممول</h1>
          <p className="text-emerald-200">دوّر على شريك يموّل معك تقنين أو بناء أرضك</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Stepper step={step} ownershipStatus={ownershipStatus} />

        {step === "status" && (
          <div>
            <h2 className="font-bold text-stone-900 mb-1">موقف الملكية الحالي</h2>
            <p className="text-sm text-stone-600 mb-5">اختر وصف حالتك الحالية</p>
            <div className="grid gap-3">
              <button
                onClick={() => pickOwnershipStatus("اسم على صفحة الجهاز")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right font-bold text-emerald-800 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                اسم على صفحة الجهاز
              </button>
              <button
                onClick={() => pickOwnershipStatus("إخطار تخصيص")}
                className="border border-stone-200 bg-white rounded-xl p-5 text-right font-bold text-emerald-800 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                إخطار تخصيص
              </button>
            </div>
          </div>
        )}

        {step === "docs" && (
          <div>
            <button
              onClick={() => setStep("status")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لموقف الملكية
            </button>
            <h2 className="font-bold text-stone-900 mb-1">مستندات الملكية</h2>
            <p className="text-sm text-stone-600 mb-5">
              ارفع مستند واحد على الأقل من التلاتة — الباقي اختياري
            </p>

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
            </div>

            {uploadError && <p className="text-red-600 text-sm mt-3">{uploadError}</p>}
            {docsError && <p className="text-red-600 text-sm mt-3">{docsError}</p>}

            <button
              onClick={handleContinueFromDocs}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "jihazDetails" && (
          <div>
            <button
              onClick={() => setStep("status")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لموقف الملكية
            </button>
            <h2 className="font-bold text-stone-900 mb-1">بيانات الأرض</h2>
            <p className="text-sm text-stone-600 mb-5">أرضك مسجّلة باسمك على صفحة الجهاز</p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <Field label="مساحة الأرض (م²)" required>
                <input
                  type="number"
                  min={0}
                  value={landAreaSqm}
                  onChange={(e) => setLandAreaSqm(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  هل تم تسديد جدية التقنين؟ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTanqinSeriousnessPaid(true)}
                    className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                      tanqinSeriousnessPaid === true
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                    }`}
                  >
                    تم السداد
                  </button>
                  <button
                    onClick={() => setTanqinSeriousnessPaid(false)}
                    className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                      tanqinSeriousnessPaid === false
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                    }`}
                  >
                    لم يُسدَّد بعد
                  </button>
                </div>
              </div>
            </div>

            {jihazError && <p className="text-red-600 text-sm mt-3">{jihazError}</p>}

            <button
              onClick={handleContinueFromJihazDetails}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "partnership" && (
          <div>
            <button
              onClick={handleBackFromPartnership}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع
            </button>
            <h2 className="font-bold text-stone-900 mb-1">نوع الشراكة المطلوبة</h2>
            <p className="text-sm text-stone-600 mb-5">اختر نوع الشراكة اللي بتدوّر عليها</p>
            <div className="grid gap-3">
              {PARTNERSHIP_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPartnershipType(p);
                    setStep("contact");
                  }}
                  className="border border-stone-200 bg-white rounded-xl p-5 text-right font-bold text-emerald-800 hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "contact" && (
          <div>
            <button
              onClick={() => setStep("partnership")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لنوع الشراكة
            </button>
            <h2 className="font-bold text-stone-900 mb-1">بيانات التواصل بالمالك</h2>
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

function Stepper({
  step,
  ownershipStatus,
}: {
  step: Step;
  ownershipStatus: OwnershipStatus | null;
}) {
  const secondStepLabel =
    ownershipStatus === "اسم على صفحة الجهاز" ? "بيانات الأرض" : "مستندات الملكية";
  const steps: { keys: Step[]; label: string }[] = [
    { keys: ["status"], label: "موقف الملكية" },
    { keys: ["docs", "jihazDetails"], label: secondStepLabel },
    { keys: ["partnership"], label: "نوع الشراكة" },
    { keys: ["contact"], label: "بيانات التواصل" },
  ];
  const activeIndex = steps.findIndex((s) => s.keys.includes(step));
  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm flex-wrap">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
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
    <Field label={label}>
      <FileInput disabled={uploading} onFilesSelected={onSelect} />
      {uploading && <p className="text-xs text-emerald-700 mt-1">جاري الرفع...</p>}
      {urls.length > 0 && (
        <p className="text-xs text-stone-500 mt-1">تم رفع {urls.length} ملف/ملفات</p>
      )}
    </Field>
  );
}
