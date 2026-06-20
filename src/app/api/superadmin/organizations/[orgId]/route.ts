import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const auth = requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const { orgId } = await context.params;

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

    return NextResponse.json({ organization: data });
  } catch (err) {
    return NextResponse.json({ error: "Unable to fetch organization." }, { status: 500 });
  }
}
