import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { getSupabaseAdmin } from "@/lib/supabase";
import { PromotionForm } from "../promotion-form";

export const dynamic = "force-dynamic";

export default async function PromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const promotion = supabase ? (await supabase.from("promotions").select("*").eq("id", id).single()).data : null;
  return (
    <AppShell title="Promotion details" action={<ButtonLink href={`/campaigns/new?promotion=${id}`}>Generate campaign</ButtonLink>}>
      <PromotionForm promotion={promotion} />
    </AppShell>
  );
}

