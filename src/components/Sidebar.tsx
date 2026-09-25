"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Landmark,
  Info,
  Scale,
  PencilRuler,
  HardHat,
  HandCoins,
  Phone,
  Menu,
  X,
  UserCircle,
  MessageSquareHeart,
} from "lucide-react";

// شريط تنقّل جانبي قابل للفتح والإغلاق (drawer). في النسخة العربية (RTL) بيظهر
// من اليمين، وفي أي نسخة إنجليزية لاحقًا (LTR) المفروض يظهر من الشمال — لو
// اتعمل توجيه LTR لازم تتقلب قيمة translate-x في حالة الإغلاق كمان.
const NAV_ITEMS = [
  { label: "الرئيسية", href: "/", icon: Home },
  { label: "نبذة عن مدينة العبور الجديدة", href: "/city-story", icon: Landmark },
  { label: "من نحن", href: "/about", icon: Info },
  { label: "تقنين الملكية", href: "/register", icon: Scale },
  { label: "رسومات هندسية وتراخيص", href: "/licensing", icon: PencilRuler },
  { label: "تنفيذ المباني", href: "/construction", icon: HardHat },
  { label: "الشريك الممول", href: "/funding-partner", icon: HandCoins },
  { label: "تواصل معنا", href: "/contact", icon: Phone },
  { label: "ساعدنا نتطور", href: "/suggestions", icon: MessageSquareHeart },
  { label: "حسابي", href: "/account", icon: UserCircle },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        className="fixed top-4 start-4 z-30 bg-emerald-950 text-white p-2.5 rounded-lg shadow-lg hover:bg-emerald-900 transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 start-0 w-64 bg-emerald-950 text-emerald-50 z-20 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-5 pt-16 pb-5 border-b border-emerald-900">
          <Link
            href="/"
            className="font-bold text-lg text-white"
            onClick={() => setOpen(false)}
          >
            منصة ملاك مدينة العبور الجديدة
          </Link>
        </div>
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-800 text-white"
                    : "text-emerald-200 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-emerald-900 text-xs text-emerald-400">
          نسخة أولى تجريبية (MVP)
        </div>
      </aside>
    </>
  );
}
