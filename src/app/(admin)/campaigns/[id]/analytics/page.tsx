import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { getSupabaseAdmin } from "@/lib/supabase";
import { pct } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const [campaignResult, recipientsResult] = supabase
    ? await Promise.all([
        supabase.from("campaigns").select("*, promotions(title)").eq("id", id).single(),
        supabase.from("campaign_recipients").select("*, contacts(email, first_name, last_name)").eq("campaign_id", id),
      ])
    : [{ data: null }, { data: [] }];
  const recipients = recipientsResult.data || [];
  const sent = recipients.filter((row) => row.sent_at).length;
  const delivered = recipients.filter((row) => row.delivered_at).length;
  const opened = recipients.filter((row) => row.opened_at).length;
  const clicked = recipients.filter((row) => row.clicked_at).length;
  const bounced = recipients.filter((row) => row.bounced_at).length;
  const unsubscribed = recipients.filter((row) => row.unsubscribed_at).length;
  return (
    <AppShell title="Campaign analytics">
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-950">{campaignResult.data?.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{campaignResult.data?.subject}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Sent" value={sent} />
        <StatCard label="Delivered" value={delivered} detail={pct(delivered, sent)} />
        <StatCard label="Opened" value={opened} detail={pct(opened, delivered)} />
        <StatCard label="Clicked" value={clicked} detail={pct(clicked, delivered)} />
        <StatCard label="Bounced" value={bounced} detail={pct(bounced, sent)} />
        <StatCard label="Unsubscribed" value={unsubscribed} detail={pct(unsubscribed, delivered)} />
      </div>
      <div className="mt-5 overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Recipient</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Opened</th><th className="px-4 py-3">Clicked</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {recipients.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.contacts?.first_name} {row.contacts?.last_name}</td>
                <td className="px-4 py-3">{row.contacts?.email}</td>
                <td className="px-4 py-3"><Badge>{row.status}</Badge></td>
                <td className="px-4 py-3">{row.opened_at ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{row.clicked_at ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

