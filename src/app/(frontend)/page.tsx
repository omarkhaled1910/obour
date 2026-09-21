import type { Metadata } from "next";
import Link from "next/link";
import { Scale, PencilRuler, HardHat, HandCoins } from "lucide-react";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { getServerSideURL } from "@/utilities/getURL";
import { createPageMetadata, SITE_NAME } from "@/utilities/seo";

const OPTIONS = [
  {
    title: "تقنين الملكية",
    description: "سجّل بياناتك وابدأ رحلة إنهاء تقنين أرضك ومتابعة حالتك أمام الجهاز أول بأول.",
    href: "/register",
    icon: Scale,
  },
  {
    title: "رسومات هندسية وتراخيص",
    description: "احصل على رسومات هندسية معتمدة واستخرج تراخيص البناء لأرضك.",
    href: "/licensing",
    icon: PencilRuler,
  },
  {
    title: "تنفيذ المباني",
    description: "تابع تنفيذ البناء على أرضك خطوة بخطوة بعد تقنينها.",
    href: "/construction",
    icon: HardHat,
  },
  {
    title: "الشريك الممول",
    description: "تواصل مع ممولين ومستثمرين لتمويل بناء أو تطوير أرضك.",
    href: "/funding-partner",
    icon: HandCoins,
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "خدمات ملاك مدينة العبور الجديدة",
  description:
    "ابدأ رحلة تقنين أرضك في مدينة العبور الجديدة، واطلب الرسومات والتراخيص أو تنفيذ المباني أو شريكًا ممولًا من مكان واحد.",
  path: "/",
  keywords: ["خدمات ملاك الأراضي", "تقنين الملكية", "البناء في العبور الجديدة"],
});

export default function Home() {
  const url = getServerSideURL();
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `خدمات ${SITE_NAME}`,
    itemListElement: OPTIONS.map((option, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: option.title,
        description: option.description,
        url: `${url}${option.href}`,
        areaServed: "مدينة العبور الجديدة",
        provider: {
          "@id": `${url}/#organization`,
        },
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative bg-gradient-to-b from-emerald-950 to-emerald-900 text-white">
        <div className="mx-auto max-w-3xl px-4 pt-20 pb-20 text-center">
          <div className="text-lg sm:text-xl font-bold mb-4">منصة ملاك مدينة العبور الجديدة</div>
          <span className="inline-block bg-[#7c2d3a]/40 border border-[#a83c4f]/70 text-[#f4c9d2] text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-wide">
            مدن الجيل الرابع الذكية
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">
            الحلم أصبح حقيقة في مدينة العبور الجديدة
          </h1>
          <p className="text-sm text-emerald-200/80 mb-6">
            بناءً على القرار الجمهوري رقم 249 لسنة 2016، وتحت إشراف هيئة المجتمعات العمرانية
            الجديدة
          </p>
          <p className="text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
            منصة خاصة بخدمة ملاك مدينة العبور الجديدة، تجمع لك كل ما تحتاجه في رحلة أرضك في مكان
            واحد: إنهاء ملف التقنين ومتابعة موقفك أمام الجهاز أول بأول، ثم البناء على أرضك بعد
            تقنينها، أو إيجاد شريك يموّل معك المشروع.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="bg-white text-emerald-900 font-medium px-8 py-3 rounded-lg hover:bg-emerald-50"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>

        <div className="absolute bottom-3 end-3 bg-emerald-900/60 border border-emerald-700/50 rounded-lg p-2.5 text-xs">
          <div className="font-bold mb-1.5">نبذة عن مدينة العبور الجديدة</div>
          <Link
            href="/city-story"
            className="block text-center bg-white text-emerald-900 font-medium px-3 py-1 rounded-md hover:bg-emerald-50"
          >
            تصفح
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-xl font-bold text-stone-900 mb-6 text-center">من فين تبدأ؟</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {OPTIONS.map((o) => (
            <Link
              key={o.title}
              href={o.href}
              className="block border border-stone-200 bg-white rounded-xl p-6 hover:border-emerald-400 transition-colors"
            >
              <div className="flex items-center mb-2">
                <o.icon size={22} className="text-emerald-700" />
              </div>
              <h3 className="font-bold text-stone-900 mb-1">{o.title}</h3>
              <p className="text-sm text-stone-600">{o.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-xl font-bold text-stone-900 mb-6 text-center">قبل وبعد</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="relative aspect-[3/2]">
              <MapPlaceholder
                label="خريطة الجمعيات قبل التقنين"
                className="absolute inset-0 h-full w-full"
              />
              <span className="absolute top-3 start-3 bg-stone-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                قبل
              </span>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <div className="relative aspect-[3/2]">
              <MapPlaceholder
                label="خريطة الأحياء التفصيلية بعد التخطيط"
                className="absolute inset-0 h-full w-full"
              />
              <span className="absolute top-3 start-3 bg-stone-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                بعد
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
