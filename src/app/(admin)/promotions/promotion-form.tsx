import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/forms";
import { DEFAULT_CTA_URL } from "@/lib/branding";
import { SERVICE_TYPES, TONES } from "@/lib/constants";
import type { Promotion } from "@/lib/types";
import { savePromotion } from "./form-actions";

export function PromotionForm({ promotion }: { promotion?: Promotion | null }) {
  return (
    <form action={savePromotion} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={promotion?.id} />
      <Field label="Promotion title"><Input name="title" required defaultValue={promotion?.title || ""} /></Field>
      <Field label="Service type">
        <Select name="service_type" required defaultValue={promotion?.service_type || SERVICE_TYPES[0]}>
          {SERVICE_TYPES.map((service) => <option key={service}>{service}</option>)}
        </Select>
      </Field>
      <Field label="Target audience"><Input name="target_audience" defaultValue={promotion?.target_audience || ""} /></Field>
      <Field label="Tone">
        <Select name="tone" defaultValue={promotion?.tone || TONES[0]}>
          {TONES.map((tone) => <option key={tone}>{tone}</option>)}
        </Select>
      </Field>
      <Field label="CTA text"><Input name="cta_text" defaultValue={promotion?.cta_text || ""} /></Field>
      <Field label="CTA URL" hint={`Leave blank to use ${DEFAULT_CTA_URL}.`}><Input name="cta_url" type="url" defaultValue={promotion?.cta_url || ""} /></Field>
      <Field label="Bonus"><Input name="bonus" defaultValue={promotion?.bonus || ""} /></Field>
      <Field label="Urgency"><Input name="urgency" defaultValue={promotion?.urgency || ""} /></Field>
      <div className="md:col-span-2">
        <Field label="Offer details"><Textarea name="offer_details" required defaultValue={promotion?.offer_details || ""} /></Field>
      </div>
      <div className="md:col-span-2"><Button type="submit">Save promotion</Button></div>
    </form>
  );
}
