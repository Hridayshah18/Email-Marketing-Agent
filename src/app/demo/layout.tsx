import { notFound } from "next/navigation";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.PUBLIC_DEMO_ENABLED === "false") {
    notFound();
  }

  return children;
}

