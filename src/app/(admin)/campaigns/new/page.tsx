import { AppShell } from "@/components/layout/app-shell";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CampaignBuilder } from "../builder";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage({ searchParams }: { searchParams: Promise<{ promotion?: string }> }) {
  const params = await searchParams;
  const supabase = getSupabaseAdmin();
  const promotions = supabase ? (await supabase.from("promotions").select("*").order("created_at", { ascending: false })).data || [] : [];
  return (
    <AppShell title="New campaign">
      <CampaignBuilder promotions={promotions} selectedPromotionId={params.promotion} />
    </AppShell>
  );
}

