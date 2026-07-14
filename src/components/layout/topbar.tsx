import Image from "next/image";
import { LogOut } from "lucide-react";
import { ADMIN_EMAILS } from "@/lib/constants";
import { getLogoPath } from "@/lib/branding";

export function Topbar({ title, action }: { title: string; action?: React.ReactNode }) {
  const logoPath = getLogoPath();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={120} height={40} className="h-10 w-auto lg:hidden" priority /> : null}
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Admin workspace</p>
            <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {action}
          <div className="hidden rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:block">
            {ADMIN_EMAILS.split(",")[0]}
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <LogOut size={16} aria-hidden /> Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
