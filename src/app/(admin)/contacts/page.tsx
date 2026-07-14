import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Contact } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string; interest?: string; unsubscribed?: string }> }) {
  const params = await searchParams;
  const supabase = getSupabaseAdmin();
  let contacts: Contact[] = [];
  if (supabase) {
    let query = supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(200);
    if (params.q) query = query.or(`email.ilike.%${params.q}%,first_name.ilike.%${params.q}%,company_name.ilike.%${params.q}%`);
    if (params.interest) query = query.eq("service_interest", params.interest);
    if (params.unsubscribed === "true") query = query.eq("unsubscribed", true);
    const result = await query;
    contacts = result.data || [];
  }

  return (
    <AppShell
      title="Contacts"
      action={<div className="flex gap-2"><ButtonLink href="/contacts/upload" variant="secondary"><Upload size={16} /> Upload CSV</ButtonLink><ButtonLink href="/contacts/new"><Plus size={16} /> Add contact</ButtonLink></div>}
    >
      <form className="mb-4 flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input name="q" placeholder="Search contacts" defaultValue={params.q} className="min-h-11 flex-1 rounded-md border border-slate-200 px-3 text-sm" />
        <input name="interest" placeholder="Service interest" defaultValue={params.interest} className="min-h-11 rounded-md border border-slate-200 px-3 text-sm" />
        <label className="flex min-h-11 items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="unsubscribed" value="true" defaultChecked={params.unsubscribed === "true"} /> Unsubscribed
        </label>
        <button className="rounded-md bg-slate-950 px-4 text-sm font-semibold text-white">Filter</button>
      </form>
      {!contacts.length ? (
        <EmptyState title="No contacts yet" body="Upload a CSV or add qualified marketing contacts one by one." href="/contacts/new" action="Add first contact" />
      ) : (
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Interest</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-3 font-medium text-slate-900"><Link href={`/contacts/${contact.id}`}>{contact.first_name} {contact.last_name}</Link></td>
                  <td className="px-4 py-3">{contact.email}</td>
                  <td className="px-4 py-3">{contact.company_name || "-"}</td>
                  <td className="px-4 py-3">{contact.service_interest || "-"}</td>
                  <td className="px-4 py-3"><Badge tone={contact.unsubscribed ? "amber" : "green"}>{contact.unsubscribed ? "Unsubscribed" : "Active"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
