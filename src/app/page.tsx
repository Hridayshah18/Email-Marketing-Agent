import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { getLogoPath } from "@/lib/branding";

export default function HomePage() {
  const logoPath = getLogoPath();
  const demoEnabled = process.env.PUBLIC_DEMO_ENABLED !== "false";

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-3xl text-center">
        {logoPath ? (
          <Image src={logoPath} alt="Digital Terrene" width={220} height={80} className="mx-auto mb-8 h-20 w-auto" priority />
        ) : null}
        <p className="text-xs font-semibold uppercase text-blue-300">Digital Terrene</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">{APP_NAME}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          AI-powered campaign generation, sending, tracking, and analytics.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/login">Admin Login</ButtonLink>
          {demoEnabled ? <ButtonLink href="/demo" variant="secondary">Check Demo</ButtonLink> : null}
        </div>
      </section>
    </main>
  );
}

