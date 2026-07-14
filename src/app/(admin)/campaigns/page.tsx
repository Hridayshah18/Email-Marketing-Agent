import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const supabase = getSupabaseAdmin();
  const campaigns = supabase ? (await supabase.from("campaigns").select("*, promotions(title)").order("created_at", { ascending: false })).data || [] : [];
  return (
    <AppShell title="Campaigns" action={<ButtonLink href="/campaigns/new"><Plus size={16} /> New campaign</ButtonLink>}>
      {!campaigns.length ? <EmptyState title="No campaigns yet" body="Generate a campaign from a promotion, choose a subject line, preview it, and save as draft." href="/campaigns/new" action="Build campaign" /> : (
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Promotion</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-4 py-3 font-medium text-slate-950"><Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link></td>
                  <td className="px-4 py-3">{campaign.promotions?.title || "-"}</td>
                  <td className="px-4 py-3">{campaign.subject || "-"}</td>
                  <td className="px-4 py-3"><Badge tone={campaign.status === "sent" ? "green" : "blue"}>{campaign.status}</Badge></td>
                  <td className="px-4 py-3">{formatDate(campaign.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

