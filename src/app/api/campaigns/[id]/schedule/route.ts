import { NextResponse } from "next/server";
import { isApiAdminAuthenticated } from "@/lib/auth";
import { blockDemoRequest } from "@/lib/demo-guard";
import { requireSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;
  if (!(await isApiAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const { scheduled_at } = await request.json();
  const supabase = requireSupabaseAdmin();
  const { error } = await supabase.from("campaigns").update({ scheduled_at, status: "scheduled" }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, note: "Cron is required for sends outside provider-supported scheduling." });
}
