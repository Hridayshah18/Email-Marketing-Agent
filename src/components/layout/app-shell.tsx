import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <Sidebar />
      <main className="lg:pl-72">
        <Topbar title={title} action={action} />
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

