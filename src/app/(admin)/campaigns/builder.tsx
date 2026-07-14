"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { CampaignPreview } from "@/components/campaign-preview";
import type { Campaign, Promotion } from "@/lib/types";
import { saveCampaign } from "./form-actions";

export function CampaignBuilder({ promotions, selectedPromotionId, campaign }: { promotions: Promotion[]; selectedPromotionId?: string; campaign?: Campaign | null }) {
  const [promotionId, setPromotionId] = useState(campaign?.promotion_id || selectedPromotionId || promotions[0]?.id || "");
  const promotion = useMemo(() => promotions.find((item) => item.id === promotionId), [promotions, promotionId]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(campaign?.selected_subject_index ?? null);
  const [preview, setPreview] = useState(campaign?.preview_text || "");
  const [plain, setPlain] = useState(campaign?.plain_text_body || "");
  const [html, setHtml] = useState(campaign?.html_body || "");
  const [emailStyle, setEmailStyle] = useState<"marketing_template" | "plain_outreach">(campaign?.email_style || "marketing_template");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");

  async function generate() {
    if (!promotion) return;
    setLoading(true);
    setError("");
    try {
      const payload = { promotion_id: promotion.id, ...promotion, email_style: emailStyle };
      const response = await fetch("/api/ai/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(text || "AI generation returned invalid JSON.");
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "AI generation failed.");
      }

      if (!data) {
        throw new Error("AI generation returned an empty response.");
      }

      const generatedCampaign = data.campaign || data;
      setSubjects(generatedCampaign.subject_lines || []);
      setSelected(0);
      setPreview(generatedCampaign.preview_text || "");
      setPlain(generatedCampaign.plain_text_body || "");
      setHtml(generatedCampaign.html_body || "");
      setWarnings(generatedCampaign.spam_warnings || []);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "AI generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
      <form action={saveCampaign} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5">
        <input type="hidden" name="id" defaultValue={campaign?.id} />
        <input type="hidden" name="selected_subject_index" value={selected ?? ""} />
        <input type="hidden" name="email_style" value={emailStyle} />
        <Field label="Promotion">
          <Select name="promotion_id" value={promotionId} onChange={(event) => setPromotionId(event.target.value)}>
            {promotions.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
          </Select>
        </Field>
        <Field
          label="Email Style"
          hint="Plain Outreach reduces promotional formatting, but inbox placement is controlled by the recipient's email provider."
        >
          <Select value={emailStyle} onChange={(event) => setEmailStyle(event.target.value as "marketing_template" | "plain_outreach")}>
            <option value="marketing_template">Marketing Template</option>
            <option value="plain_outreach">Plain Outreach</option>
          </Select>
        </Field>
        <Field label="Campaign name"><Input name="name" required defaultValue={campaign?.name || promotion?.title || ""} /></Field>
        <Button type="button" onClick={generate} disabled={!promotion || loading}>{loading ? "Generating..." : "Generate Campaign"}</Button>
        {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {subjects.length ? (
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Choose a subject line</p>
            <div className="grid gap-2">
              {subjects.map((subject, index) => (
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
        ) : null}
        <Field label="Subject"><Input name="subject" value={selected !== null ? subjects[selected] || campaign?.subject || "" : campaign?.subject || ""} onChange={() => undefined} /></Field>
        <Field label="Preview text"><Input name="preview_text" value={preview} onChange={(event) => setPreview(event.target.value)} /></Field>
        <Field label="Plain text body"><Textarea name="plain_text_body" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
        <Field label="HTML body"><Textarea name="html_body" value={html} onChange={(event) => setHtml(event.target.value)} className="min-h-56 font-mono" /></Field>
        <input type="hidden" name="status" value="draft" />
        <Button type="submit">Save draft</Button>
        {warnings.length ? <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900"><strong>Spam-risk warnings:</strong> {warnings.join(" ")}</div> : null}
      </form>
      <div className="grid gap-3">
        <h3 className="text-base font-bold text-slate-950">HTML preview</h3>
        <CampaignPreview html={html} />
      </div>
    </div>
  );
}
