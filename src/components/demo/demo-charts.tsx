"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoCampaigns, demoLineChart } from "@/lib/demo-data";

export function DemoCharts() {
  const campaignRates = demoCampaigns.map((campaign) => ({
    name: campaign.name.replace(" Campaign", ""),
    openRate: Math.round((campaign.opened / campaign.delivered) * 100),
    clickRate: Math.round((campaign.clicked / campaign.delivered) * 100),
  }));

  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-slate-950">Sends, opens, clicks by date</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demoLineChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="opens" stroke="#059669" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-slate-950">Open and click rates by campaign</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignRates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="openRate" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clickRate" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

