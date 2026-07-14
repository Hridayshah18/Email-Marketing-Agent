import { NextResponse } from "next/server";
import { generateCampaign } from "@/lib/ai/generate-campaign";
import { isApiAdminAuthenticated } from "@/lib/auth";
import { blockDemoRequest } from "@/lib/demo-guard";
import { requireSupabaseAdmin } from "@/lib/supabase";
import { aiCampaignSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const demoBlock = blockDemoRequest(request);
  if (demoBlock) return demoBlock;
  if (!(await isApiAdminAuthenticated())) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const input = aiCampaignSchema.parse(await request.json());
    const generatedCampaign = await generateCampaign(input);
    const supabase = requireSupabaseAdmin();
    const { error } = await supabase.from("ai_generations").insert({
      promotion_id: input.promotion_id,
      input,
      output: generatedCampaign,
    });
    if (error) {
      throw new Error(`Could not save AI generation: ${error.message}`);
    }
    return NextResponse.json({ campaign: generatedCampaign });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI generation failed" },
      { status: 500 },
    );
  }
}
