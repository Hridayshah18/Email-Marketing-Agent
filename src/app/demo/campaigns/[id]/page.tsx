import { DemoShell } from "@/components/demo/demo-shell";
import { ButtonLink } from "@/components/ui/button";
import { getDemoCampaign } from "@/lib/demo-data";
import { DemoCampaignClient } from "./demo-campaign-client";

export default async function DemoCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getDemoCampaign(id);

  return (
    <DemoShell title="Demo Campaign Builder">
      <div className="mb-4 flex justify-end">
        <ButtonLink href={`/demo/campaigns/${campaign.id}/analytics`} variant="secondary">View fake analytics</ButtonLink>
      </div>
      <DemoCampaignClient campaignName={campaign.name} />
    </DemoShell>
  );
}

