import { Trees, Stethoscope, Home, ShieldCheck, Dumbbell, GraduationCap } from "lucide-react";

// بطاقات توضيحية (أيقونات، مش صور فوتوغرافية حقيقية) بتلخّص طابع الحياة في
// المدينة. مفيش عندي صور فعلية لمدينة العبور، فده تمثيل بصري تقريبي بس.
const THEMES = [
  {
    label: "حياة أسرية وحدائق",
    icon: Trees,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    label: "رعاية صحية",
    icon: Stethoscope,
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    label: "فيلات وإسكان مميز",
    icon: Home,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    label: "أمن وأمان",
    icon: ShieldCheck,
    className: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    label: "نوادٍ ومجتمعات مسوّرة",
    icon: Dumbbell,
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    label: "مدارس وجامعات",
    icon: GraduationCap,
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

export function ThemeBanners() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {THEMES.map((t) => (
        <div
          key={t.label}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center ${t.className}`}
        >
          <t.icon size={24} />
          <span className="text-[11px] font-bold leading-tight">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
