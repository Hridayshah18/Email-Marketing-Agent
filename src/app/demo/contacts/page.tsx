import { DemoDisabledAction } from "@/components/demo/demo-actions";
import { DemoShell } from "@/components/demo/demo-shell";
import { Badge } from "@/components/ui/badge";
import { demoContacts } from "@/lib/demo-data";

export default function DemoContactsPage() {
  return (
    <DemoShell title="Demo Contacts">
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
        <DemoDisabledAction label="Upload CSV" message="Demo mode: contact uploads are disabled." />
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Interest</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demoContacts.map((contact) => (
              <tr key={contact.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{contact.first_name} {contact.last_name}</td>
                <td className="px-4 py-3">{contact.email}</td>
                <td className="px-4 py-3">{contact.company_name}</td>
                <td className="px-4 py-3">{contact.city}</td>
                <td className="px-4 py-3">{contact.service_interest}</td>
                <td className="px-4 py-3"><Badge tone={contact.status === "active" ? "green" : "amber"}>{contact.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DemoShell>
  );
}

