import Link from "next/link";
import { DemoCharts } from "@/components/demo/demo-charts";
import { DemoShell } from "@/components/demo/demo-shell";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { demoCampaigns, demoSummary } from "@/lib/demo-data";
import { pct } from "@/lib/utils";

export default function DemoDashboardPage() {
  return (
    <DemoShell title="Demo Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total contacts" value={demoSummary.totalContacts} />
        <StatCard label="Active contacts" value={demoSummary.activeContacts} />
        <StatCard label="Unsubscribed" value={demoSummary.unsubscribedContacts} />
        <StatCard label="Campaigns" value={demoSummary.totalCampaigns} />
        <StatCard label="Emails sent" value={demoSummary.sent} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-5">
        <StatCard label="Delivery rate" value={pct(demoSummary.delivered, demoSummary.sent)} detail={`${demoSummary.delivered} delivered`} />
        <StatCard label="Open rate" value={pct(demoSummary.opens, demoSummary.delivered)} detail={`${demoSummary.opens} opened`} />
        <StatCard label="Click rate" value={pct(demoSummary.clicks, demoSummary.delivered)} detail={`${demoSummary.clicks} clicked`} />
        <StatCard label="Bounce rate" value={pct(demoSummary.bounces, demoSummary.sent)} detail={`${demoSummary.bounces} bounced`} />
        <StatCard label="Unsubscribe rate" value={pct(demoSummary.unsubscribes, demoSummary.delivered)} detail={`${demoSummary.unsubscribes} unsubscribed`} />
      </div>
      <DemoCharts />
      <div className="mt-6 overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Campaign</th><th className="px-4 py-3">Sent</th><th className="px-4 py-3">Delivered</th><th className="px-4 py-3">Opened</th><th className="px-4 py-3">Clicked</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demoCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-4 py-3 font-medium text-slate-950"><Link href={`/demo/campaigns/${campaign.id}`}>{campaign.name}</Link></td>
                <td className="px-4 py-3">{campaign.sent}</td>
                <td className="px-4 py-3">{campaign.delivered}</td>
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

