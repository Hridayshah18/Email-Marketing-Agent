"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardCharts({
  events,
  recipients,
}: {
  events: { event_type: string; created_at: string }[];
  recipients: { opened_at?: string | null; clicked_at?: string | null; delivered_at?: string | null }[];
}) {
  const byDate = new Map<string, { date: string; sent: number; opens: number; clicks: number }>();
  for (const event of events) {
    const date = new Date(event.created_at).toISOString().slice(0, 10);
    const row = byDate.get(date) || { date, sent: 0, opens: 0, clicks: 0 };
    if (event.event_type === "sent") row.sent += 1;
    if (event.event_type === "open") row.opens += 1;
    if (event.event_type === "click") row.clicks += 1;
    byDate.set(date, row);
  }
  const lineData = Array.from(byDate.values());
  const delivered = recipients.filter((row) => row.delivered_at).length || 1;
  const chartData = [
    { name: "Open rate", value: Math.round((recipients.filter((row) => row.opened_at).length / delivered) * 100) },
    { name: "Click rate", value: Math.round((recipients.filter((row) => row.clicked_at).length / delivered) * 100) },
  ];

  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-base font-bold text-slate-950">Sends, opens, clicks by date</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
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
        <h3 className="text-base font-bold text-slate-950">Engagement rates</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

