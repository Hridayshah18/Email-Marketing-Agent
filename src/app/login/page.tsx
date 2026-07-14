import Image from "next/image";
import { redirect } from "next/navigation";
import { isAllowedAdminEmail, setAdminSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import { APP_NAME } from "@/lib/constants";
import { getLogoPath } from "@/lib/branding";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (email && isAllowedAdminEmail(email) && password && password === process.env.ADMIN_PASSWORD) {
    await setAdminSession(email);
    redirect("/dashboard");
  }
  redirect("/login?error=1");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const logoPath = getLogoPath();
  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-4">
      <form action={login} className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        {logoPath ? <Image src={logoPath} alt="Digital Terrene" width={180} height={56} className="mb-5 h-14 w-auto" priority /> : null}
        <p className="text-xs font-semibold uppercase text-blue-600">Digital Terrene</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage contacts, campaigns, sends, and analytics.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Admin email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Admin password">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button type="submit">Log in</Button>
          {params.error ? <p className="text-sm text-red-700">Invalid admin email or password.</p> : null}
        </div>
      </form>
    </main>
  );
}
