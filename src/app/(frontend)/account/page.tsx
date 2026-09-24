import { redirect } from "next/navigation";
import { getCurrentMember } from "@/actions/auth";
import { LogoutButton } from "./LogoutButton";

export default async function AccountPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/login");
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white py-10">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <span className="inline-block bg-[#7c2d3a]/40 border border-[#a83c4f]/70 text-[#f4c9d2] text-xs font-bold px-3 py-1 rounded-full mb-3">
            مدن الجيل الرابع الذكية
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">حسابي</h1>
          <p className="text-emerald-200">مرحبًا بيك، {member.fullName}</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-stone-700 mb-6">
            أنت مسجّل دخولك في منصة ملاك مدينة العبور الجديدة باسم{" "}
            <strong>{member.fullName}</strong>.
          </p>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
