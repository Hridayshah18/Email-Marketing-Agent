import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CampaignBuilder } from "../builder";
import { SendCampaignButton } from "./send-button";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const [campaignResult, promotionsResult] = supabase
    ? await Promise.all([
        supabase.from("campaigns").select("*").eq("id", id).single(),
        supabase.from("promotions").select("*").order("created_at", { ascending: false }),
      ])
    : [{ data: null }, { data: [] }];
  return (
    <AppShell
      title="Campaign builder"
      action={<div className="flex gap-2"><ButtonLink href={`/campaigns/${id}/preview`} variant="secondary">Preview</ButtonLink><ButtonLink href={`/campaigns/${id}/analytics`} variant="secondary">Analytics</ButtonLink></div>}
    >
      <CampaignBuilder promotions={promotionsResult.data || []} campaign={campaignResult.data} />
      <SendCampaignButton campaignId={id} />
    </AppShell>
  );
}
