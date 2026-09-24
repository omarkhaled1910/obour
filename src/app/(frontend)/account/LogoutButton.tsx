"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logOutMember } from "@/actions/auth";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logOutMember();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-red-300 text-red-700 font-medium px-4 py-2 hover:bg-red-50 disabled:opacity-60"
    >
      {loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
