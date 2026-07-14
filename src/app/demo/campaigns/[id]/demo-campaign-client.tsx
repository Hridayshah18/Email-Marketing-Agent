"use client";

import { useState } from "react";
import { CampaignPreview } from "@/components/campaign-preview";
import { DemoGenerateButton, DemoDisabledAction } from "@/components/demo/demo-actions";
import { Field, Input, Textarea } from "@/components/ui/forms";
import { demoGeneratedCampaign } from "@/lib/demo-data";

export function DemoCampaignClient({ campaignName }: { campaignName: string }) {
  const [generated, setGenerated] = useState(demoGeneratedCampaign);
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5">
        <Field label="Campaign name">
          <Input value={campaignName} readOnly />
        </Field>
        <DemoGenerateButton onGenerate={(campaign) => { setGenerated(campaign); setSelected(0); }} />
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Choose a subject line</p>
          <div className="grid gap-2">
            {generated.subject_lines.map((subject, index) => (
              <button
                type="button"
                key={subject}
                onClick={() => setSelected(index)}
                className={`rounded-md border p-3 text-left text-sm ${selected === index ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"}`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
        <Field label="Subject">
          <Input value={generated.subject_lines[selected]} readOnly />
        </Field>
        <Field label="Preview text">
          <Input value={generated.preview_text} readOnly />
        </Field>
        <Field label="Plain text body">
          <Textarea value={generated.plain_text_body} readOnly />
        </Field>
        <DemoDisabledAction label="Save draft" message="Demo mode: changes are simulated and not saved." />
        <DemoDisabledAction label="Send Campaign" message="Demo mode: emails are not actually sent." />
      </section>
      <div className="grid gap-3">
        <h3 className="text-base font-bold text-slate-950">Fake email preview</h3>
        <CampaignPreview html={generated.html_body} />
      </div>
    </div>
  );
}

