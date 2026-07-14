import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import type { Contact } from "@/lib/types";
import { saveContact } from "./form-actions";

export function ContactForm({ contact }: { contact?: Contact | null }) {
  return (
    <form action={saveContact} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-2">
      <input type="hidden" name="id" defaultValue={contact?.id} />
      <Field label="First name"><Input name="first_name" defaultValue={contact?.first_name || ""} /></Field>
      <Field label="Last name"><Input name="last_name" defaultValue={contact?.last_name || ""} /></Field>
      <Field label="Email"><Input name="email" type="email" required defaultValue={contact?.email || ""} /></Field>
      <Field label="Company"><Input name="company_name" defaultValue={contact?.company_name || ""} /></Field>
      <Field label="City"><Input name="city" defaultValue={contact?.city || ""} /></Field>
      <Field label="Business type"><Input name="business_type" defaultValue={contact?.business_type || ""} /></Field>
      <Field label="Service interest"><Input name="service_interest" defaultValue={contact?.service_interest || ""} /></Field>
      <Field label="Source"><Input name="source" defaultValue={contact?.source || ""} /></Field>
      <div className="md:col-span-2"><Button type="submit">Save contact</Button></div>
    </form>
  );
}
