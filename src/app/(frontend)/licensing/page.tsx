"use client";

import { useState } from "react";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";
import { FileInput } from "@/components/FileInput";
import {
  submitLicensingRequest,
  uploadFilesAction,
  type UploadedMedia,
} from "@/actions/submissions";

type ServiceType = "تصميم هندسي" | "استصدار رخصة";
type OwnerType = "مالك أساسي" | "بتوكيل";
type Step = "type" | "plot" | "owner" | "review";

export default function LicensingPage() {
  const [step, setStep] = useState<Step>("type");
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);

  const [allocationNoticeUrls, setAllocationNoticeUrls] = useState<UploadedMedia[]>([]);
  const [plotAreaSqm, setPlotAreaSqm] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [districtNumber, setDistrictNumber] = useState("");
  const [neighborhoodNumber, setNeighborhoodNumber] = useState("");
  const [plotError, setPlotError] = useState("");

  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [nationalIdPhotoUrls, setNationalIdPhotoUrls] = useState<UploadedMedia[]>([]);
  const [governorate, setGovernorate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ownerType, setOwnerType] = useState<OwnerType | null>(null);
  const [powerOfAttorneyUrls, setPowerOfAttorneyUrls] = useState<UploadedMedia[]>([]);
  const [ownerError, setOwnerError] = useState("");

  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

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

  function pickServiceType(t: ServiceType) {
    setServiceType(t);
    setStep("plot");
  }

  function handleContinueFromPlot() {
    if (!plotAreaSqm || !plotNumber || !districtNumber || !neighborhoodNumber) {
      setPlotError("من فضلك أكمل مساحة القطعة ورقم القطعة ورقم الحي ورقم المجاورة");
      return;
    }
    setPlotError("");
    setStep("owner");
  }

  function handleContinueFromOwner() {
    if (!fullName || !nationalId || !governorate || !phone || !ownerType) {
      setOwnerError("من فضلك أكمل الاسم والرقم القومي والمحافظة ورقم الهاتف ونوع الملكية");
      return;
    }
    if (ownerType === "بتوكيل" && powerOfAttorneyUrls.length === 0) {
      setOwnerError("من فضلك ارفع صورة التوكيل");
      return;
    }
    setOwnerError("");
    setStep("review");
  }

  async function handleSubmit() {
    setStatus("saving");
    setSubmitError("");
    try {
      if (!serviceType || !ownerType) {
        throw new Error("من فضلك أكمل كل الخطوات المطلوبة");
      }
      const result = await submitLicensingRequest({
        serviceType,
        allocationNotices: allocationNoticeUrls.map((file) => file.id),
        plotAreaSqm,
        plotNumber,
        districtNumber,
        neighborhoodNumber,
        fullName,
        nationalId,
        nationalIdPhotos: nationalIdPhotoUrls.map((file) => file.id),
        governorate,
        phone,
        email: email || undefined,
        ownerType,
        powerOfAttorneyDocuments:
          ownerType === "بتوكيل" ? powerOfAttorneyUrls.map((file) => file.id) : undefined,
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
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">رسومات هندسية وتراخيص</h1>
          <p className="text-emerald-200">اطلب تصميم هندسي أو استصدار رخصة بناء لقطعتك</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Stepper step={step} />

        {step === "type" && (
          <div>
            <h2 className="font-bold text-stone-900 mb-1">إيه الخدمة اللي محتاجها؟</h2>
            <p className="text-sm text-stone-600 mb-5">اختر نوع الطلب</p>
            <div className="grid grid-cols-2 gap-4">
              {(["تصميم هندسي", "استصدار رخصة"] as ServiceType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => pickServiceType(t)}
                  className="border border-stone-200 bg-white rounded-xl p-6 text-center font-bold text-emerald-800 hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "plot" && (
          <div>
            <button
              onClick={() => setStep("type")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لاختيار الخدمة
            </button>
            <h2 className="font-bold text-stone-900 mb-1">بيانات القطعة ({serviceType})</h2>
            <p className="text-sm text-stone-600 mb-5">
              لو عندك إخطار تخصيص ارفع صورته، وهنراجع بياناته يدويًا معاك
            </p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <Field label="صورة إخطار/محضر التخصيص (اختياري)">
                <FileInput
                  disabled={uploading === "allocation"}
                  onFilesSelected={async (files) => {
                    const urls = await uploadFiles(files, "allocation");
                    setAllocationNoticeUrls((prev) => [...prev, ...urls]);
                  }}
                />
                {uploading === "allocation" && (
                  <p className="text-xs text-emerald-700 mt-1">جاري الرفع...</p>
                )}
                {allocationNoticeUrls.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1">
                    تم رفع {allocationNoticeUrls.length} ملف/ملفات
                  </p>
                )}
              </Field>

              <Field label="مساحة القطعة (م²)" required>
                <input
                  type="number"
                  min={0}
                  value={plotAreaSqm}
                  onChange={(e) => setPlotAreaSqm(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="رقم القطعة" required>
                <input
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="رقم الحي" required>
                <input
                  value={districtNumber}
                  onChange={(e) => setDistrictNumber(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="رقم المجاورة" required>
                <input
                  value={neighborhoodNumber}
                  onChange={(e) => setNeighborhoodNumber(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>
            </div>

            {uploadError && <p className="text-red-600 text-sm mt-3">{uploadError}</p>}
            {plotError && <p className="text-red-600 text-sm mt-3">{plotError}</p>}

            <button
              onClick={handleContinueFromPlot}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "owner" && (
          <div>
            <button
              onClick={() => setStep("plot")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لبيانات القطعة
            </button>
            <h2 className="font-bold text-stone-900 mb-1">بيانات المالك</h2>
            <p className="text-sm text-stone-600 mb-5">بيانات صاحب الطلب</p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <Field label="الاسم بالكامل" required>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="الرقم القومي" required>
                <input
                  pattern="[0-9]{14}"
                  title="الرقم القومي 14 رقم"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="صورة بطاقة الرقم القومي (اختياري)">
                <FileInput
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploading === "nationalId"}
                  onFilesSelected={async (files) => {
                    const urls = await uploadFiles(files, "nationalId");
                    setNationalIdPhotoUrls((prev) => [...prev, ...urls]);
                  }}
                />
                {uploading === "nationalId" && (
                  <p className="text-xs text-emerald-700 mt-1">جاري الرفع...</p>
                )}
                {nationalIdPhotoUrls.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1">
                    تم رفع {nationalIdPhotoUrls.length} صورة
                  </p>
                )}
              </Field>

              <Field label="الإقامة (المحافظة)" required>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none bg-white"
                >
                  <option value="" disabled>
                    اختر المحافظة
                  </option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="رقم الهاتف" required>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="البريد الإلكتروني (اختياري)">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  مالك أساسي أم بتوكيل؟ <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOwnerType("مالك أساسي")}
                    className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                      ownerType === "مالك أساسي"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                    }`}
                  >
                    مالك أساسي
                  </button>
                  <button
                    onClick={() => setOwnerType("بتوكيل")}
                    className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                      ownerType === "بتوكيل"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                    }`}
                  >
                    بتوكيل
                  </button>
                </div>
              </div>

              {ownerType === "بتوكيل" && (
                <Field label="صورة التوكيل" required>
                  <FileInput
                    disabled={uploading === "poa"}
                    onFilesSelected={async (files) => {
                      const urls = await uploadFiles(files, "poa");
                      setPowerOfAttorneyUrls((prev) => [...prev, ...urls]);
                    }}
                  />
                  {uploading === "poa" && (
                    <p className="text-xs text-emerald-700 mt-1">جاري الرفع...</p>
                  )}
                  {powerOfAttorneyUrls.length > 0 && (
                    <p className="text-xs text-stone-500 mt-1">
                      تم رفع {powerOfAttorneyUrls.length} ملف/ملفات
                    </p>
                  )}
                </Field>
              )}
            </div>

            {uploadError && <p className="text-red-600 text-sm mt-3">{uploadError}</p>}
            {ownerError && <p className="text-red-600 text-sm mt-3">{ownerError}</p>}

            <button
              onClick={handleContinueFromOwner}
              className="w-full mt-5 rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "review" && (
          <div>
            <button
              onClick={() => setStep("owner")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لبيانات المالك
            </button>
            <h2 className="font-bold text-stone-900 mb-1">الرسوم ومدة العمل</h2>
            <p className="text-sm text-stone-600 mb-5">
              مراجعة أخيرة لطلبك قبل الإرسال
            </p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 text-sm text-stone-700 mb-5">
              <div>الخدمة: <strong>{serviceType}</strong></div>
              <div>
                القطعة: مساحة {plotAreaSqm} م² — رقم {plotNumber} — حي {districtNumber} — مجاورة{" "}
                {neighborhoodNumber}
              </div>
              <div>المالك: {fullName} — {governorate} — {phone}</div>
              <div>الصفة: {ownerType}</div>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-sm text-amber-900 mb-5">
              الرسوم ومدة العمل المطلوبة لقطعتك بتتحدد بعد مراجعة فريقنا لطلبك، وهنتواصل معاك
              بالتفاصيل بمجرد المراجعة.
            </div>

            <button
              onClick={handleSubmit}
              disabled={status === "saving"}
              className="w-full rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800 disabled:opacity-60"
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
    { key: "type", label: "نوع الخدمة" },
    { key: "plot", label: "بيانات القطعة" },
    { key: "owner", label: "بيانات المالك" },
    { key: "review", label: "الرسوم والمدة" },
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
