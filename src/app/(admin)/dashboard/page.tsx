import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { getLogoPath } from "@/lib/branding";
import { getSupabaseAdmin } from "@/lib/supabase";
import { pct } from "@/lib/utils";
import { DashboardCharts } from "./charts";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabaseAdmin();
  const logoPath = getLogoPath();

  if (!supabase) {
    return (
      <AppShell title="Dashboard">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900">
          Add Supabase environment variables from <code>.env.example</code> to activate live analytics.
        </div>
      </AppShell>
    );
  }

  const [
    contacts,
    activeContacts,
    unsubscribedContacts,
    campaigns,
    recipients,
    events,
  ] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("unsubscribed", false),
    supabase.from("contacts").select("id", { count: "exact", head: true }).eq("unsubscribed", true),
    supabase.from("campaigns").select("id", { count: "exact", head: true }),
    supabase.from("campaign_recipients").select("status, sent_at, delivered_at, opened_at, clicked_at, bounced_at, unsubscribed_at, created_at, campaigns(name)"),
    supabase.from("events").select("event_type, created_at").order("created_at", { ascending: true }).limit(1000),
  ]);

  const rows = recipients.data || [];
  const sent = rows.filter((row) => row.status === "sent" || row.sent_at).length;
  const delivered = rows.filter((row) => row.delivered_at).length;
  const opened = rows.filter((row) => row.opened_at).length;
  const clicked = rows.filter((row) => row.clicked_at).length;
  const bounced = rows.filter((row) => row.bounced_at).length;
  const unsubscribed = rows.filter((row) => row.unsubscribed_at).length;

  return (
    <AppShell title="Dashboard">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={180} height={56} className="h-14 w-auto" priority /> : null}
          <div>
            <h3 className="text-lg font-bold text-slate-950">Digital Terrene campaign command center</h3>
            <p className="text-sm text-slate-500">Production-ready email marketing analytics for the team.</p>
          </div>
        </div>
        <a className="text-sm font-semibold text-blue-700 hover:text-blue-800" href="https://digitalterrene.online" target="_blank">
          digitalterrene.online
        </a>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total contacts" value={contacts.count || 0} />
        <StatCard label="Active contacts" value={activeContacts.count || 0} />
        <StatCard label="Unsubscribed" value={unsubscribedContacts.count || 0} />
        <StatCard label="Campaigns" value={campaigns.count || 0} />
        <StatCard label="Emails sent" value={sent} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-5">
        <StatCard label="Delivery rate" value={pct(delivered, sent)} detail={`${delivered} delivered`} />
        <StatCard label="Open rate" value={pct(opened, delivered)} detail={`${opened} opened`} />
        <StatCard label="Click rate" value={pct(clicked, delivered)} detail={`${clicked} clicked`} />
        <StatCard label="Bounce rate" value={pct(bounced, sent)} detail={`${bounced} bounced`} />
        <StatCard label="Unsubscribe rate" value={pct(unsubscribed, delivered)} detail={`${unsubscribed} unsubscribed`} />
      </div>
      <DashboardCharts events={events.data || []} recipients={rows} />
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Delivered</th>
              <th className="px-4 py-3">Opened</th>
              <th className="px-4 py-3">Clicked</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium text-slate-900">All campaigns</td>
              <td className="px-4 py-3">{sent}</td>
              <td className="px-4 py-3">{delivered}</td>
              <td className="px-4 py-3">{opened}</td>
              <td className="px-4 py-3">{clicked}</td>
              <td className="px-4 py-3"><Badge tone="blue">Live</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
