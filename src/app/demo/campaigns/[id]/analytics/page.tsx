import { DemoShell } from "@/components/demo/demo-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { demoContacts, getDemoCampaign } from "@/lib/demo-data";
import { pct } from "@/lib/utils";

export default async function DemoCampaignAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getDemoCampaign(id);

  return (
    <DemoShell title="Demo Campaign Analytics">
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-950">{campaign.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{campaign.subject}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Sent" value={campaign.sent} />
        <StatCard label="Delivered" value={campaign.delivered} detail={pct(campaign.delivered, campaign.sent)} />
        <StatCard label="Opened" value={campaign.opened} detail={pct(campaign.opened, campaign.delivered)} />
        <StatCard label="Clicked" value={campaign.clicked} detail={pct(campaign.clicked, campaign.delivered)} />
        <StatCard label="Bounced" value={campaign.bounced} detail={pct(campaign.bounced, campaign.sent)} />
        <StatCard label="Unsubscribed" value={campaign.unsubscribed} detail={pct(campaign.unsubscribed, campaign.delivered)} />
      </div>
      <div className="mt-5 overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Recipient</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Opened</th><th className="px-4 py-3">Clicked</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demoContacts.map((contact, index) => (
              <tr key={contact.id}>
                <td className="px-4 py-3">{contact.first_name} {contact.last_name}</td>
                <td className="px-4 py-3">{contact.email}</td>
                <td className="px-4 py-3"><Badge tone={contact.status === "active" ? "green" : "amber"}>{contact.status}</Badge></td>
                <td className="px-4 py-3">{index < 3 ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{index < 2 ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

