import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("org_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Organization request not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ request: data });
}
