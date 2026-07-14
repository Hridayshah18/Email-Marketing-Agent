import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/forms";
import { COMPANY_NAME, COMPANY_WEBSITE, DEFAULT_CTA_URL, DEFAULT_FROM_EMAIL, DEFAULT_REPLY_EMAIL } from "@/lib/branding";
import { SOCIAL_LINKS } from "@/lib/constants";
import { getEnvStatus } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = getSupabaseAdmin();
  const settings = supabase ? (await supabase.from("settings").select("*").limit(1).maybeSingle()).data : null;
  const socials = settings?.social_links || SOCIAL_LINKS;
  const envStatus = getEnvStatus();
  return (
    <AppShell title="Settings">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <form action={saveSettings} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-2">
          <input type="hidden" name="id" defaultValue={settings?.id} />
          <Field label="Company name"><Input name="company_name" defaultValue={settings?.company_name || COMPANY_NAME} /></Field>
          <Field label="From name"><Input name="from_name" defaultValue={settings?.from_name || COMPANY_NAME} /></Field>
          <Field label="From email"><Input name="from_email" defaultValue={settings?.from_email || DEFAULT_FROM_EMAIL} /></Field>
          <Field label="Reply-to email"><Input name="reply_to_email" type="email" defaultValue={settings?.reply_to_email || DEFAULT_REPLY_EMAIL} /></Field>
          <Field label="Website URL"><Input name="website_url" type="url" defaultValue={settings?.website_url || COMPANY_WEBSITE} /></Field>
          <Field label="Default CTA URL"><Input name="default_cta_url" type="url" defaultValue={settings?.default_cta_url || DEFAULT_CTA_URL} /></Field>
          <Field label="Brand primary color"><Input name="brand_primary_color" defaultValue={settings?.brand_primary_color || "#2563eb"} /></Field>
          <div className="md:col-span-2">
            <Field label="Address / footer placeholder"><Textarea name="address_line" defaultValue={settings?.address_line || "Digital Terrene contact address placeholder"} /></Field>
          </div>
          <div className="md:col-span-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            Only upload contacts who have consented to receive marketing emails.
          </div>
          <div className="md:col-span-2"><Button type="submit">Save settings</Button></div>
        </form>
        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-950">Digital Terrene contact profile</h3>
          <p className="mt-2 text-sm text-slate-500">Primary mail: digitalterrene06@gmail.com</p>
          <div className="mt-4 grid gap-2 text-sm">
            {Object.entries(socials).map(([name, url]) => (
              <a key={name} className="rounded-md border border-slate-200 px-3 py-2 text-blue-700 hover:bg-slate-50" href={String(url)} target="_blank">
                {name}: {String(url)}
              </a>
            ))}
          </div>
        </aside>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 xl:col-start-2">
          <h3 className="text-base font-bold text-slate-950">Deployment readiness</h3>
          <div className="mt-4 grid gap-2 text-sm">
            {envStatus.map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                <span className="font-medium text-slate-700">{item.key}</span>
                <span className={item.exists ? "text-emerald-700" : item.required ? "text-red-700" : "text-amber-700"}>
                  {item.exists ? "Set" : item.required ? "Missing" : "Optional"}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
