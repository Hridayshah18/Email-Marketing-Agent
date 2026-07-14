import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Gauge,
  MailPlus,
  Megaphone,
  Settings,
  UsersRound,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { getLogoPath } from "@/lib/branding";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/contacts", label: "Contacts", icon: UsersRound },
  { href: "/promotions", label: "Promotions", icon: Megaphone },
  { href: "/campaigns", label: "Campaigns", icon: MailPlus },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const logoPath = getLogoPath();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-6">
        {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={160} height={48} className="mb-4 h-12 w-auto" priority /> : null}
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Digital Terrene</p>
        <h1 className="mt-2 text-xl font-bold">{APP_NAME}</h1>
      </div>
      <nav className="grid gap-1 px-3 py-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <item.icon aria-hidden size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 p-5 text-xs text-slate-400">
        Team access enabled
      </div>
    </aside>
  );
}
