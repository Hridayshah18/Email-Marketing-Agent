import { ButtonLink } from "@/components/ui/button";

export function EmptyState({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{body}</p>
      <ButtonLink href={href} className="mt-5">
        {action}
      </ButtonLink>
    </div>
  );
}

