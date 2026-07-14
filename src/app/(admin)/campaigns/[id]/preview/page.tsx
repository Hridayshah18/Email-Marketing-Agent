import { AppShell } from "@/components/layout/app-shell";
import { CampaignPreview } from "@/components/campaign-preview";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const campaign = supabase ? (await supabase.from("campaigns").select("*").eq("id", id).single()).data : null;
  return (
    <AppShell title="Email preview">
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-950">{campaign?.subject}</h3>
        <p className="mt-1 text-sm text-slate-500">{campaign?.preview_text}</p>
      </div>
      <CampaignPreview html={campaign?.html_body} />
    </AppShell>
  );
}

