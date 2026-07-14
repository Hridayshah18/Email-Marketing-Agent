import Image from "next/image";
import Link from "next/link";
import { BarChart3, Gauge, LockKeyhole, MailPlus, Megaphone, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getLogoPath } from "@/lib/branding";

const demoItems = [
  { href: "/demo/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/demo/contacts", label: "Contacts", icon: UsersRound },
  { href: "/demo/promotions", label: "Promotions", icon: Megaphone },
  { href: "/demo/campaigns", label: "Campaigns", icon: MailPlus },
  { href: "/demo/campaigns/dc1/analytics", label: "Analytics", icon: BarChart3 },
];

export function DemoShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const logoPath = getLogoPath();

  return (
    <div className="min-h-dvh bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-slate-950 text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={160} height={48} className="mb-4 h-12 w-auto" priority /> : null}
          <div className="flex items-center gap-2">
            <Badge tone="amber">Demo Mode</Badge>
          </div>
          <h1 className="mt-3 text-xl font-bold">Email Marketing Agent</h1>
        </div>
        <nav className="grid gap-1 px-3 py-4">
          {demoItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
              <item.icon aria-hidden size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-5 text-xs text-slate-400">
          Demo data only. Sending and tracking are disabled.
        </div>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={120} height={40} className="h-10 w-auto lg:hidden" priority /> : null}
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">Public showcase</p>
                  <Badge tone="amber">Demo Mode</Badge>
                </div>
                <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
              </div>
            </div>
            <ButtonLink href="/login" variant="secondary"><LockKeyhole size={16} /> Admin Login</ButtonLink>
          </div>
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
            Demo data only. Sending and tracking are disabled.
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

