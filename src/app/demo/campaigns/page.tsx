import Link from "next/link";
import { DemoShell } from "@/components/demo/demo-shell";
import { Badge } from "@/components/ui/badge";
import { demoCampaigns } from "@/lib/demo-data";

export default function DemoCampaignsPage() {
  return (
    <DemoShell title="Demo Campaigns">
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Sent</th><th className="px-4 py-3">Opened</th><th className="px-4 py-3">Clicked</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demoCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-4 py-3 font-medium text-slate-950"><Link href={`/demo/campaigns/${campaign.id}`}>{campaign.name}</Link></td>
                <td className="px-4 py-3">{campaign.subject}</td>
                <td className="px-4 py-3">{campaign.sent}</td>
                <td className="px-4 py-3">{campaign.opened}</td>
                <td className="px-4 py-3">{campaign.clicked}</td>
                <td className="px-4 py-3"><Badge tone={campaign.status === "sent" ? "green" : "blue"}>{campaign.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

