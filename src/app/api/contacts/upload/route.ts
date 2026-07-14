import { NextResponse } from "next/server";
import { isApiAdminAuthenticated } from "@/lib/auth";
import { blockDemoRequest } from "@/lib/demo-guard";
import { requireSupabaseAdmin } from "@/lib/supabase";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;
  if (!(await isApiAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { contacts } = await request.json();
  if (!Array.isArray(contacts)) return NextResponse.json({ error: "Invalid CSV payload" }, { status: 400 });
  const supabase = requireSupabaseAdmin();
  let inserted = 0;
  const skipped = 0;
  let failed = 0;

  for (const row of contacts) {
    const parsed = contactSchema.safeParse(row);
    if (!parsed.success) {
      failed += 1;
      continue;
    }
    const { error } = await supabase.from("contacts").upsert(parsed.data, { onConflict: "email", ignoreDuplicates: true });
    if (error) failed += 1;
    else inserted += 1;
  }

  return NextResponse.json({ inserted, skipped, failed });
}
