import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseAdmin } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const supabase = getSupabaseAdmin();
  const promotions = supabase ? (await supabase.from("promotions").select("*").order("created_at", { ascending: false })).data || [] : [];
  return (
    <AppShell title="Promotions" action={<ButtonLink href="/promotions/new"><Plus size={16} /> New promotion</ButtonLink>}>
      {!promotions.length ? <EmptyState title="No promotions yet" body="Create an offer before generating campaign copy." href="/promotions/new" action="Create promotion" /> : (
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Tone</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className="px-4 py-3 font-medium text-slate-950"><Link href={`/promotions/${promotion.id}`}>{promotion.title}</Link></td>
                  <td className="px-4 py-3">{promotion.service_type}</td>
                  <td className="px-4 py-3">{promotion.tone || "-"}</td>
                  <td className="px-4 py-3"><Badge tone="blue">{promotion.status}</Badge></td>
                  <td className="px-4 py-3">{formatDate(promotion.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

