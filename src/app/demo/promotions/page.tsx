import { DemoDisabledAction } from "@/components/demo/demo-actions";
import { DemoShell } from "@/components/demo/demo-shell";
import { Badge } from "@/components/ui/badge";
import { demoPromotions } from "@/lib/demo-data";

export default function DemoPromotionsPage() {
  return (
    <DemoShell title="Demo Promotions">
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
        <DemoDisabledAction label="Save promotion" message="Demo mode: changes are simulated and not saved." />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {demoPromotions.map((promotion) => (
          <article key={promotion.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950">{promotion.title}</h3>
              <Badge tone="blue">{promotion.service_type}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">{promotion.offer_details}</p>
            <p className="mt-4 text-sm font-medium text-slate-500">Tone: {promotion.tone}</p>
          </article>
        ))}
      </div>
    </DemoShell>
  );
}

