"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about" },
  { label: "تقنين الملكية", href: "/register" },
  { label: "رسومات وتراخيص", href: "/licensing" },
  { label: "تنفيذ المباني", href: "/construction" },
  { label: "الشريك الممول", href: "/funding-partner" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "حسابي", href: "/account" },
];

export function MobileNav() {
  return (
    <header className="md:hidden border-b border-emerald-900 bg-emerald-950 text-white sticky top-0 z-20">
      <div className="px-4 py-3 font-bold">منصة ملاك مدينة العبور الجديدة</div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm text-emerald-200">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
