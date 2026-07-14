"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { demoGeneratedCampaign } from "@/lib/demo-data";

export function DemoGenerateButton({ onGenerate }: { onGenerate: (campaign: typeof demoGeneratedCampaign) => void }) {
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-2">
      <Button type="button" onClick={() => { onGenerate(demoGeneratedCampaign); setMessage("Demo mode: generated campaign content is mock data."); }}>
        Generate Campaign
      </Button>
      {message ? <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">{message}</p> : null}
    </div>
  );
}

export function DemoDisabledAction({ label, message }: { label: string; message: string }) {
  const [notice, setNotice] = useState("");
  return (
    <div className="grid gap-2">
      <Button type="button" variant="secondary" onClick={() => setNotice(message)}>{label}</Button>
      {notice ? <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">{notice}</p> : null}
    </div>
  );
}

