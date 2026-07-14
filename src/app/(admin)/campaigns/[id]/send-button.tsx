"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SendSummary = {
  sent: number;
  failed: number;
  errors: string[];
};

export function SendCampaignButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SendSummary | null>(null);
  const [error, setError] = useState("");

  async function sendCampaign() {
    setLoading(true);
    setError("");
    setSummary(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: "POST",
      });
      const text = await response.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(text || "Send route returned invalid JSON.");
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Campaign send failed.");
      }

      if (!data) {
        throw new Error("Send route returned an empty response.");
      }

      setSummary({
        sent: data.sent || 0,
        failed: data.failed || 0,
        errors: Array.isArray(data.errors) ? data.errors : [],
      });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Campaign send failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5">
      <Button type="button" onClick={sendCampaign} disabled={loading}>
        {loading ? "Sending..." : "Send now"}
      </Button>
      {summary ? (
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-semibold">Send summary</p>
          <p>Sent: {summary.sent}</p>
          <p>Failed: {summary.failed}</p>
          {summary.errors.length ? (
            <ul className="mt-2 list-disc pl-5">
              {summary.errors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}

