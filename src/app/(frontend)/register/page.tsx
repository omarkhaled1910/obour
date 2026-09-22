"use client";

import { useState } from "react";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";
import {
  submitOwnershipRegistration,
  uploadFilesAction,
  type UploadedMedia,
} from "@/actions/submissions";

type Cooperative =
  | "الطلائع"
  | "مصر الجديدة"
  | "أحمد عرابي"
  | "الأمل"
  | "القادسية"
  | "مصر التعاونية"
  | "اتحاد الوفاق";

const COOPERATIVES: { name: Cooperative }[] = [
  { name: "الطلائع" },
  { name: "مصر الجديدة" },
  { name: "أحمد عرابي" },
  { name: "الأمل" },
  { name: "القادسية" },
  { name: "مصر التعاونية" },
  { name: "اتحاد الوفاق" },
];

// إحداثيات تقريبية (نسبة %) لمواقع الجمعيات فوق صورة الخريطة، عشان تبقى قابلة للضغط.
// تقريبية بصريًا مش حدودًا مساحية دقيقة. الجمعيات اللي مش ظاهرة في الخريطة الحالية
// (مصر التعاونية، اتحاد الوفاق) بيتم اختيارها من قائمة الأسماء تحت بس.
const MAP_HOTSPOTS: Partial<Record<Cooperative, { left: number; top: number; width: number; height: number }>> = {
  "أحمد عرابي": { left: 26, top: 38, width: 30, height: 42 },
  "الطلائع": { left: 52, top: 44, width: 20, height: 14 },
  "القادسية": { left: 67, top: 52, width: 17, height: 10 },
  "مصر الجديدة": { left: 65, top: 60, width: 19, height: 13 },
  "الأمل": { left: 52, top: 60, width: 20, height: 20 },
};

type AreaUnit = "feddan" | "meter";

// المساحة الرسمية للفدان المصري (م²) — تُستخدم لتحويل الأفدنة تلقائيًا لأمتار.
const SQM_PER_FEDDAN = 4200.83;

const APPLICATION_STATUSES = [
  "لم يتم تقديم الأوراق للجهاز",
  "تم تقديم الأوراق وفي انتظار نزول الاسم أو تحديد موعد قرعة",
  "تم تقنين قطعة الأرض الزراعية التي اتملك فيها ولم أجد اسمي بكشوف الجهاز",
];

type Step = "cooperative" | "status" | "size" | "details";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("cooperative");
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

  const [areaUnit, setAreaUnit] = useState<AreaUnit | null>(null);
  const [feddanCount, setFeddanCount] = useState("");
  const [hasResidentialPlot, setHasResidentialPlot] = useState<boolean | null>(null);
  const [residentialPlotArea, setResidentialPlotArea] = useState("");
  const [isBuilt, setIsBuilt] = useState<boolean | null>(null);
  const [buildingDescription, setBuildingDescription] = useState("");
  const [buildingPhotoUrls, setBuildingPhotoUrls] = useState<UploadedMedia[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [meterArea, setMeterArea] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sizeError, setSizeError] = useState("");

  const feddanInSqm =
    feddanCount && !isNaN(Number(feddanCount))
      ? Math.round(Number(feddanCount) * SQM_PER_FEDDAN).toLocaleString("en-US")
      : "";

  const [form, setForm] = useState({
    fullName: "",
    nationalId: "",
    governorate: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [ownershipDocUrls, setOwnershipDocUrls] = useState<UploadedMedia[]>([]);
  const [areaMapUrls, setAreaMapUrls] = useState<UploadedMedia[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingMaps, setUploadingMaps] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [mapsError, setMapsError] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function pickCooperative(c: Cooperative) {
    setCooperative(c);
    setApplicationStatus(null);
    setStep("status");
  }

  function pickStatus(label: string) {
    setApplicationStatus(label);
    setAreaUnit(null);
    setFeddanCount("");
    setHasResidentialPlot(null);
    setResidentialPlotArea("");
    setIsBuilt(null);
    setBuildingDescription("");
    setBuildingPhotoUrls([]);
    setUploadError("");
    setMeterArea("");
    setPlotNumber("");
    setSellerName("");
    setSizeError("");
    setStep("size");
  }

  async function uploadFiles(files: FileList): Promise<UploadedMedia[]> {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    const result = await uploadFilesAction(formData);
    if (!result.success) throw new Error(result.error);
    return result.data;
  }

  async function handlePhotosSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);
    setUploadError("");
    try {
      const urls = await uploadFiles(files);
      setBuildingPhotoUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "تعذّر رفع الصور");
    } finally {
      setUploadingPhotos(false);
    }
  }

  async function handleOwnershipDocsSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingDocs(true);
    setDocsError("");
    try {
      const urls = await uploadFiles(files);
      setOwnershipDocUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : "تعذّر رفع المستند");
    } finally {
      setUploadingDocs(false);
    }
  }

  async function handleAreaMapsSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingMaps(true);
    setMapsError("");
    try {
      const urls = await uploadFiles(files);
      setAreaMapUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setMapsError(err instanceof Error ? err.message : "تعذّر رفع خريطة المساحة");
    } finally {
      setUploadingMaps(false);
    }
  }

  function sizeSelectionSummary() {
    if (areaUnit === "feddan") {
      const parts = [`${feddanCount} فدان (${feddanInSqm} م²)`];
      parts.push(hasResidentialPlot ? "مع قطعة سكني" : "بدون قطعة سكني");
      if (hasResidentialPlot) {
        parts.push(`مساحة القطعة السكنية ${residentialPlotArea} م²`);
        parts.push(isBuilt ? "مبنية" : "غير مبنية");
      }
      return parts.join(" — ");
    }
    if (areaUnit === "meter") {
      return `${meterArea} م²`;
    }
    return "";
  }

  function handleContinueFromSize() {
    if (!areaUnit) {
      setSizeError("اختر وحدة القياس الأول");
      return;
    }
    if (areaUnit === "feddan" && (!feddanCount || hasResidentialPlot === null)) {
      setSizeError("اكتب عدد الأفدنة وحدّد هل معاها قطعة سكني ولا لأ");
      return;
    }
    if (areaUnit === "feddan" && hasResidentialPlot && (!residentialPlotArea || isBuilt === null)) {
      setSizeError("اكتب مساحة القطعة السكنية وحدّد هل هي مبنية ولا لأ");
      return;
    }
    if (areaUnit === "meter" && (!meterArea || !sellerName)) {
      setSizeError("اكتب المساحة بالمتر واسم البائع أو صاحب القطعة");
      return;
    }
    if (!plotNumber) {
      setSizeError("اكتب رقم القطعة");
      return;
    }
    setSizeError("");
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");
    try {
      if (!cooperative || !applicationStatus || !areaUnit) {
        throw new Error("من فضلك أكمل كل الخطوات المطلوبة");
      }
      const result = await submitOwnershipRegistration({
        ...form,
        cooperative,
        applicationStatus,
        areaUnit,
        feddanCount: areaUnit === "feddan" ? feddanCount : undefined,
        hasResidentialPlot: areaUnit === "feddan" ? (hasResidentialPlot ?? undefined) : undefined,
        residentialPlotArea:
          areaUnit === "feddan" && hasResidentialPlot ? residentialPlotArea : undefined,
        isBuilt:
          areaUnit === "feddan" && hasResidentialPlot ? (isBuilt ?? undefined) : undefined,
        meterArea: areaUnit === "meter" ? meterArea : undefined,
        sizeSelection: sizeSelectionSummary(),
        plotNumber,
        sellerName: areaUnit === "meter" ? sellerName : undefined,
        buildingDescription: isBuilt ? buildingDescription : undefined,
        buildingPhotos: isBuilt ? buildingPhotoUrls.map((file) => file.id) : undefined,
        ownershipDocuments: ownershipDocUrls.map((file) => file.id),
        areaMaps: areaMapUrls.map((file) => file.id),
      });
      if (!result.success) throw new Error(result.error);
      setStatus("done");
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
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">تقنين الملكية</h1>
          <p className="text-emerald-200">سجّل بياناتك كمالك في مدينة العبور الجديدة</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Stepper step={step} />

        {step === "cooperative" && (
          <div>
            <div className="relative rounded-xl overflow-hidden border border-stone-200 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/city-map-before.jpg"
                alt="خريطة جمعيات مدينة العبور"
                className="w-full h-auto block"
              />
              <span className="absolute top-3 start-3 bg-stone-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                قبل
              </span>
              {COOPERATIVES.map((c) => {
                const spot = MAP_HOTSPOTS[c.name];
                if (!spot) return null;
                return (
                  <button
                    key={c.name}
                    onClick={() => pickCooperative(c.name)}
                    aria-label={c.name}
                    title={c.name}
                    className="absolute rounded-md hover:bg-emerald-500/20 hover:ring-2 hover:ring-emerald-500 transition-all cursor-pointer"
                    style={{
                      left: `${spot.left}%`,
                      top: `${spot.top}%`,
                      width: `${spot.width}%`,
                      height: `${spot.height}%`,
                    }}
                  />
                );
              })}
            </div>
            <p className="text-xs text-stone-500 -mt-4 mb-6">
              اضغط على منطقتك في الخريطة، أو اختر اسم الجمعية تحت.
            </p>

            <h2 className="font-bold text-stone-900 mb-1">حضرتك مالك في؟</h2>
            <p className="text-sm text-stone-600 mb-5">اختر الجمعية التابع لها أرضك</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COOPERATIVES.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => pickCooperative(c.name)}
                  className="border border-stone-200 bg-white rounded-xl p-5 text-center hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  <div className="text-xs text-stone-400 font-bold mb-1">{i + 1}</div>
                  <div className="text-lg font-bold text-emerald-800">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "status" && cooperative && (
          <div>
            <button
              onClick={() => setStep("cooperative")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لاختيار الجمعية
            </button>
            <h2 className="font-bold text-stone-900 mb-1">إيه الموقف الحالي لحالتك؟</h2>
            <p className="text-sm text-stone-600 mb-5">اختر الوصف الأقرب لموقفك أمام الجهاز</p>
            <div className="grid gap-3">
              {APPLICATION_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => pickStatus(s)}
                  className="border border-stone-200 bg-white rounded-lg p-4 text-right hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  <div className="font-bold text-emerald-800">{s}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "size" && cooperative && (
          <div>
            <button
              onClick={() => setStep("status")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع للموقف الحالي
            </button>
            <h2 className="font-bold text-stone-900 mb-1">حدّد مساحة أرضك ({cooperative})</h2>
            <p className="text-sm text-stone-600 mb-5">اختر وحدة القياس المناسبة لك</p>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <button
                onClick={() => setAreaUnit("feddan")}
                className={`border rounded-xl p-4 text-center font-bold transition-all ${
                  areaUnit === "feddan"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                }`}
              >
                بالفدان (قطعة كاملة)
              </button>
              <button
                onClick={() => setAreaUnit("meter")}
                className={`border rounded-xl p-4 text-center font-bold transition-all ${
                  areaUnit === "meter"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                }`}
              >
                بالمتر
              </button>
            </div>

            {areaUnit === "feddan" && (
              <div className="space-y-4 mb-5">
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                  <Field label="عدد الأفدنة" required>
                    <input
                      type="number"
                      min={0}
                      value={feddanCount}
                      onChange={(e) => setFeddanCount(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </Field>
                  <div className="pb-2 text-lg font-bold text-stone-400">=</div>
                  <Field label="المساحة بالمتر (محسوبة تلقائيًا)">
                    <input
                      value={feddanInSqm}
                      readOnly
                      className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-stone-600"
                    />
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    هل معاها قطعة سكني؟ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setHasResidentialPlot(true)}
                      className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                        hasResidentialPlot === true
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                      }`}
                    >
                      مع قطعة سكني
                    </button>
                    <button
                      onClick={() => setHasResidentialPlot(false)}
                      className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                        hasResidentialPlot === false
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                      }`}
                    >
                      بدون قطعة سكني
                    </button>
                  </div>
                </div>

                {hasResidentialPlot && (
                  <div className="border border-emerald-100 bg-emerald-50/50 rounded-lg p-4 space-y-4">
                    <Field label="مساحة قطعة الأرض السكنية (م²)" required>
                      <input
                        type="number"
                        min={0}
                        value={residentialPlotArea}
                        onChange={(e) => setResidentialPlotArea(e.target.value)}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                      />
                    </Field>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        القطعة مبنية؟ <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsBuilt(true)}
                          className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                            isBuilt === true
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                              : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                          }`}
                        >
                          مبنية
                        </button>
                        <button
                          onClick={() => setIsBuilt(false)}
                          className={`flex-1 border rounded-lg py-2 font-medium transition-all ${
                            isBuilt === false
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                              : "border-stone-200 bg-white text-stone-700 hover:border-emerald-400"
                          }`}
                        >
                          غير مبنية
                        </button>
                      </div>
                    </div>

                    {isBuilt && (
                      <div className="space-y-4">
                        <Field label="وصف المبنى (اختياري)">
                          <textarea
                            value={buildingDescription}
                            onChange={(e) => setBuildingDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                          />
                        </Field>
                        <Field label="صور المبنى (اختياري)">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple
                            disabled={uploadingPhotos}
                            onChange={(e) => {
                              handlePhotosSelected(e.target.files);
                              e.target.value = "";
                            }}
                            className="w-full text-sm"
                          />
                          {uploadingPhotos && (
                            <p className="text-xs text-emerald-700 mt-1">جاري رفع الصور...</p>
                          )}
                          {uploadError && (
                            <p className="text-xs text-red-600 mt-1">{uploadError}</p>
                          )}
                          {buildingPhotoUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {buildingPhotoUrls.map((file) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={file.id}
                                  src={file.url || ""}
                                  alt="صورة المبنى"
                                  className="w-16 h-16 object-cover rounded-md border border-stone-200"
                                />
                              ))}
                            </div>
                          )}
                        </Field>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {areaUnit === "meter" && (
              <div className="mb-5">
                <Field label="المساحة بالمتر" required>
                  <input
                    type="number"
                    min={0}
                    value={meterArea}
                    onChange={(e) => setMeterArea(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </Field>
              </div>
            )}

            {areaUnit && (
              <div className="space-y-4 mb-5">
                <Field label="رقم القطعة" required>
                  <input
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                  />
                </Field>

                {areaUnit === "meter" && (
                  <Field label="اسم البائع / صاحب القطعة (شخص أو شركة)" required>
                    <input
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                    />
                  </Field>
                )}
              </div>
            )}

            {sizeError && <p className="text-red-600 text-sm mb-4">{sizeError}</p>}

            <button
              onClick={handleContinueFromSize}
              className="w-full rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800"
            >
              متابعة
            </button>
          </div>
        )}

        {step === "details" && (
          <div>
            <button
              onClick={() => setStep("size")}
              className="text-sm text-emerald-700 mb-4 hover:underline"
            >
              ← رجوع لاختيار المساحة
            </button>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-5 text-sm text-emerald-900 space-y-1">
              <div>
                الجمعية: <strong>{cooperative}</strong> — المساحة:{" "}
                <strong>{sizeSelectionSummary()}</strong>
              </div>
              <div>رقم القطعة: {plotNumber}</div>
              {sellerName && <div>البائع/صاحب القطعة: {sellerName}</div>}
              <div>
                الموقف الحالي: <strong>{applicationStatus}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
              <Field label="الاسم بالكامل" required>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="الرقم القومي" required>
                <input
                  required
                  pattern="[0-9]{14}"
                  title="الرقم القومي 14 رقم"
                  value={form.nationalId}
                  onChange={(e) => setForm((f) => ({ ...f, nationalId: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="الإقامة (المحافظة)" required>
                <select
                  required
                  value={form.governorate}
                  onChange={(e) => setForm((f) => ({ ...f, governorate: e.target.value }))}
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
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="البريد الإلكتروني (اختياري)">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="صورة مستند الملكية (اختياري)">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  multiple
                  disabled={uploadingDocs}
                  onChange={(e) => {
                    handleOwnershipDocsSelected(e.target.files);
                    e.target.value = "";
                  }}
                  className="w-full text-sm"
                />
                {uploadingDocs && (
                  <p className="text-xs text-emerald-700 mt-1">جاري رفع المستند...</p>
                )}
                {docsError && <p className="text-xs text-red-600 mt-1">{docsError}</p>}
                {ownershipDocUrls.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1">
                    تم رفع {ownershipDocUrls.length} ملف/ملفات
                  </p>
                )}
              </Field>

              <Field label="خرائط المساحة (اختياري)">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  multiple
                  disabled={uploadingMaps}
                  onChange={(e) => {
                    handleAreaMapsSelected(e.target.files);
                    e.target.value = "";
                  }}
                  className="w-full text-sm"
                />
                {uploadingMaps && (
                  <p className="text-xs text-emerald-700 mt-1">جاري رفع الخرائط...</p>
                )}
                {mapsError && <p className="text-xs text-red-600 mt-1">{mapsError}</p>}
                {areaMapUrls.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1">
                    تم رفع {areaMapUrls.length} ملف/ملفات
                  </p>
                )}
              </Field>

              <Field label="ملاحظات (اختياري)">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <button
                type="submit"
                disabled={status === "saving"}
                className="w-full rounded-lg bg-emerald-700 text-white font-medium py-2.5 hover:bg-emerald-800 disabled:opacity-60"
              >
                {status === "saving" ? "جاري الحفظ..." : "تسجيل"}
              </button>

              {status === "done" && (
                <p className="text-emerald-700 text-sm text-center">تم تسجيل بياناتك بنجاح.</p>
              )}
              {status === "error" && (
                <p className="text-red-600 text-sm text-center">{errorMsg}</p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "cooperative", label: "الجمعية" },
    { key: "status", label: "الموقف الحالي" },
    { key: "size", label: "بيانات الأرض" },
    { key: "details", label: "بيانات المالك" },
  ];
  const activeIndex = steps.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center justify-center gap-2 mb-8 text-sm">
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
